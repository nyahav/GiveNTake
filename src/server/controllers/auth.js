import bcrypt from 'bcrypt'
import { User, VerificationCode } from '../db/model/index.js'
import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config.js'
import AppError from '../utils/AppError.js'
import { removePropsMutable } from '../utils/lib.js'
import { getImageUrl } from '../utils/S3.js'
import { Resend } from 'resend'
import { emailsTemplates } from '../db/emails.js'

const resend = new Resend(process.env.RESEND_API_KEY)

const generateAccessToken = data => jwt.sign(data, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

const generateRefreshToken = data => jwt.sign(data, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

export const sendVerificationEmail = async (req, res) => {
  const { email } = req.body

  if (!email) throw new AppError('Email is required.', 400)

  // check for duplicate email in db
  const duplicate = await User.findOne({ email }).exec()
  if (duplicate) throw new AppError('Conflict. Email already exists.', 409)

  const code = Math.floor(100000 + Math.random() * 900000) // Generate 6-digit code

  console.log('Sending verification email to: ', email)

  await resend.emails.send({
    from: "Given'take <noreply@giventake.org>",
    to: email,
    subject: emailsTemplates.EmailVerification.subject,
    html: emailsTemplates.EmailVerification.html.replace('{{code}}', code)
  })

  // Check if a verification code already exists for the email
  let existingVerificationCode = await VerificationCode.findOne({ email })

  if (existingVerificationCode) {
    // Update the existing code
    existingVerificationCode.code = code
    await existingVerificationCode.save()
  } else {
    // Create a new verification code
    await VerificationCode.create({ email, code })
  }

  res.sendStatus(201)
}

export const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password, verificationCode: code } = req.body

  if (!email || !password) throw new AppError('Email and password are required.', 400)

  //  verify code
  const verificationCode = await VerificationCode.findOne({ email })

  if (verificationCode.code !== code) {
    console.log('User entered the wrong code')
    throw new AppError('Invalid verification code', 401)
  }

  //verification code is valid
  await VerificationCode.deleteOne({ email })

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ email }).exec()
  if (duplicate) throw new AppError('Conflict. User already exists.', 409)

  //encrypt the password
  const hashedPassword = await bcrypt.hash(password, 10)
  const defaultRoles = { User: 2001 }
  const refreshToken = generateRefreshToken({ email })

  // create and store the new user
  let userDB = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    refreshToken,
    roles: defaultRoles,
    flags: { hideWelcomeModal: false }
  })

  // Delete keys from the user object
  userDB = userDB.toObject()
  removePropsMutable(userDB, ['password', 'refreshToken', '__v'])
  const roles = Object.values(userDB.roles).filter(Boolean)
  userDB.roles = roles
  const accessToken = generateAccessToken({ _id: userDB._id, email, roles })

  // Creates Secure Cookie with refresh token and sends to client
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, // TLS (https)
    sameSite: 'None', // not a cross-site cookie
    maxAge: null //cookie expiry: set to match refreshToken
  })

  //send welcome email
  await resend.emails.send({
    from: "Given'take <noreply@giventake.org>",
    to: email,
    subject: emailsTemplates.Welcome.subject.replace('{{fullName}}', firstName + ' ' + lastName),
    html: emailsTemplates.Welcome.html.replace('{{fullName}}', firstName + ' ' + lastName)
  })

  // Send authorization roles and access token to user
  res.json({ accessToken, ...userDB })
}

export const login = async (req, res) => {
  const { email, password, persist } = req.body

  if (!email || !password) throw new AppError('Email and password are required.', 400)

  let foundUser = await User.findOne({ email }).exec()
  if (!foundUser) throw new AppError('Unauthorized', 401)
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password)
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean)

    // create JWT
    const refreshToken = generateRefreshToken({ email })

    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken
    await foundUser.save()
    foundUser = foundUser.toObject()
    foundUser.roles = roles
    removePropsMutable(foundUser, ['password', 'refreshToken', '__v'])
    const accessToken = generateAccessToken({
      _id: foundUser._id,
      email,
      roles
    })

    // get profile image url from S3
    const imgName = foundUser.imgName
    const url = imgName ? await getImageUrl(imgName) : ''
    foundUser.imgUrl = url

    // Creates Secure Cookie with refresh token and sends to client
    res.cookie('jwt', refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, // TLS (https)
      sameSite: 'None', // not a cross-site cookie
      maxAge: persist ? 7 * 24 * 60 * 60 * 1000 : null //cookie expiry: set to match refreshToken
    })

    // Send authorization roles and access token to user
    res.json({ accessToken, ...foundUser })
  } else {
    throw new AppError('Unauthorized', 401)
  }
}

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) throw new AppError('Unauthorized', 401)
  const refreshToken = cookies.jwt

  const foundUser = await User.findOne({ refreshToken }).lean()
  if (!foundUser) throw new AppError('Forbidden', 403)
  // evaluate jwt
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403)
    const roles = Object.values(foundUser.roles)
    const accessToken = generateAccessToken({
      _id: foundUser._id,
      email: decoded.username,
      roles
    })
    removePropsMutable(foundUser, ['password', 'refreshToken', '__v'])

    // get profile image url from S3
    const imgName = foundUser.imgName
    const url = imgName ? await getImageUrl(imgName) : ''
    foundUser.imgUrl = url

    res.status(200).json({ accessToken, ...foundUser })
  })
}

export const logout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  const refreshToken = cookies.jwt

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (foundUser) {
    // Delete refreshToken in db
    foundUser.refreshToken = ''
    const result = await foundUser.save()
  }

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  return res.sendStatus(204)
}
