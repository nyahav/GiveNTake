import express from 'express'
import { verifyAuth, enforceAuth } from '../middleware/verifyAuth.js'
import { createPost, getPosts, postAction, bumpPost, updatePost, deletePost } from '../controllers/posts.js'
import multer from 'multer'
import { bodyParse } from '../middleware/formDataBodyParser.js'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = express.Router()

router.get('/', verifyAuth, getPosts)
router.put('/', upload.single('attachment'), bodyParse, enforceAuth, createPost)
router.patch('/', upload.single('attachment'), bodyParse, enforceAuth, updatePost)
router.post('/action', enforceAuth, postAction)
router.post('/bump', enforceAuth, bumpPost)
router.delete('/', enforceAuth, deletePost)

export default router
