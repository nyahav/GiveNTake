import express from 'express'
import { enforceAuth } from '../middleware/verifyAuth.js'
import verifyRoles from '../middleware/verifyRoles.js'
import { getReportedPosts, getPostReports, setPostAsOk } from '../controllers/posts.js'
import ROLES_LIST from '../config/roles_list.js'

const router = express.Router()

router.get('/reported-posts', enforceAuth, verifyRoles(ROLES_LIST.Editor), getReportedPosts)
router.get('/post-reports', enforceAuth, verifyRoles(ROLES_LIST.Editor), getPostReports)
router.post('/set-post-as-ok', enforceAuth, verifyRoles(ROLES_LIST.Editor), setPostAsOk)

export default router
