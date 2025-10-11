import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserLounges, getUserMatchesWithChats } from "../controllers/messagesController.js";

const router = express.Router();

router.get("/lounges", authMiddleware, getUserLounges);
router.get("/matches", authMiddleware, getUserMatchesWithChats);

export default router;
