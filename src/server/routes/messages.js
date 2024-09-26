import express from 'express'
import { enforceAuth } from '../middleware/verifyAuth.js'
import { addMessage, getContacts, getConversationMessages, readConversation } from '../controllers/messages.js'

const router = express.Router()

router.get('/', enforceAuth, getConversationMessages)
router.get('/contacts', enforceAuth, getContacts)
router.post('/', enforceAuth, addMessage)
router.post('/read-conversation', enforceAuth, readConversation)

export default router
