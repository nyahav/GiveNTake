import express from "express";
import { verifyAuth, enforceAuth } from '../middleware/verifyAuth.js';
import { createReview, getReviews } from "../controllers/reviews.js";

const router = express.Router();

router.get('/', getReviews);
router.put('/', enforceAuth, createReview);

export default router;