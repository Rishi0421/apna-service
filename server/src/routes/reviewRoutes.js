import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addReview,
  getProviderReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/provider/:providerId", getProviderReviews);

export default router;
