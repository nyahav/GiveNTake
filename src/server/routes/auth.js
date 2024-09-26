import express from 'express'
import { check } from 'express-validator'
import { signUp, login, logout, handleRefreshToken, sendVerificationEmail } from '../controllers/auth.js'

const router = express.Router()

router.post(
  '/signup',
  [
    check('firstName').not().isEmpty(),
    check('lastName').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  signUp
)
router.post('/send-verification-code', [check('email').normalizeEmail().isEmail()], sendVerificationEmail)
router.post('/login', [check('email').normalizeEmail().isEmail()], login)
router.post('/logout', logout)
router.get('/refresh', handleRefreshToken)

export default router
