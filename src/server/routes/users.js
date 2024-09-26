import express from "express";
import { getUserById, updateUser, getUsersBySearch, getUserRating } from "../controllers/users.js";
import { enforceAuth } from "../middleware/verifyAuth.js";
import multer from 'multer';
import { bodyParse } from "../middleware/formDataBodyParser.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', getUserById);
router.get('/search', getUsersBySearch);
router.patch('/', upload.single('attachment'), bodyParse, enforceAuth, updateUser);
router.get('/rating', getUserRating);

export default router;