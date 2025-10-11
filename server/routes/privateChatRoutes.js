import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  sendPrivateMessage,
  sendPrivateImage,
  getPrivateMessages,
} from "../controllers/privateChatController.js";

const router = express.Router();

// Text message
router.post("/", authMiddleware, sendPrivateMessage);

// Image message
router.post("/image", authMiddleware, upload.single("image"), sendPrivateImage);

// Get history
router.get("/:matchId", authMiddleware, getPrivateMessages);

export default router;
