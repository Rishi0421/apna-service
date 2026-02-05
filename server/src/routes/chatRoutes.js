import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMessages,
  sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/:chatId", protect, getMessages);
router.post("/message", protect, sendMessage);

export default router;
