import mongoose from 'mongoose'
import { Conversation, Message } from '../db/model/index.js'
import AppError from '../utils/AppError.js'
import {
  getContactsQuery,
  getConversationMessagesQuery,
  getConversationParticipantsQuery,
  getConversationPostQuery
} from '../db/queries/messages.js'
import { getImageUrl } from '../utils/S3.js'
const ObjectId = mongoose.Schema.ObjectId

export const getContacts = async (req, res) => {
  const selfUserId = req.user._id

  const userContacts = await getContactsQuery(selfUserId)

  for (const contact of userContacts) {
    const imgName = contact.lastMessage.sender?.imgName
    const url = imgName ? await getImageUrl(imgName) : ''
    contact.lastMessage.sender.imgUrl = url

    if (contact?.post?.imgName) {
      const imgName2 = contact.post?.imgName
      const url2 = imgName2 ? await getImageUrl(imgName2) : ''
      contact.post.imgUrl = url2
    }

    for (const participant of contact.otherUsers) {
      const imgName = participant?.imgName
      const url = imgName ? await getImageUrl(imgName) : ''
      participant.imgUrl = url
    }
  }

  res.status(200).json(userContacts)
}

export const getConversationMessages = async (req, res) => {
  const { conversationId } = req.query
  const selfUserId = req.user._id

  const userConversationMessages = await getConversationMessagesQuery(selfUserId, conversationId)

  const conversationParticipants = await getConversationParticipantsQuery(selfUserId, conversationId)
  for (const participant of conversationParticipants) {
    const imgName = participant?.imgName
    const url = imgName ? await getImageUrl(imgName) : ''
    participant.imgUrl = url
  }

  const post = await getConversationPostQuery(selfUserId, conversationId)
  if (post) {
    const imgName = post?.imgName
    const url = imgName ? await getImageUrl(imgName) : ''
    post.imgUrl = url
  }

  const conversation = {
    conversationId,
    users: conversationParticipants,
    otherUsers: conversationParticipants?.filter(user => !user?.isSelf),
    post,
    messages: userConversationMessages
  }

  res.status(200).json(conversation)
}

export const addMessage = async (req, res) => {
  let {
    contact: { conversationId, userId, postId },
    message
  } = req.body
  const selfUserId = req.user._id

  // if it's a new conversation then create new one
  let newConversation
  if (!conversationId && userId) {
    newConversation = await Conversation.create({
      users: [selfUserId, userId],
      ...(postId && { post: postId }),
      readByUsers: [selfUserId]
    })
    conversationId = newConversation._id
    console.log('Conversation Created')
  }

  //set message as unread
  const conversation = await Conversation.findByIdAndUpdate(conversationId, {
    $set: {
      readByUsers: [selfUserId]
    }
  })
  if (!conversation) throw new AppError('Conversation not found.', 400)

  const newMessage = await Message.create({
    conversation: conversationId,
    sender: selfUserId,
    body: { text: message }
  })

  //if it's a new conversation then return it's details
  if (newConversation) {
    const conversation = {
      conversationId,
      users: newConversation.users,
      otherUsers: newConversation.users?.filter(userId => {
        return userId.toString() !== selfUserId
      }),
      messages: [newMessage]
    }
    return res.status(200).json({ conversation })
  }
  if (newMessage) return res.sendStatus(201)
  else throw new AppError('Failed to add message to the database', 500)
}

export const readConversation = async (req, res) => {
  let { conversationId } = req.body
  const selfUserId = req.user._id

  const conversation = await Conversation.findByIdAndUpdate(conversationId, {
    $addToSet: {
      readByUsers: selfUserId
    }
  })
  if (!conversation) throw new AppError('Conversation not found.', 400)

  console.log(conversation)

  res.sendStatus(201)

}
