import express from "express";
import {
  createPoll,
  getActivePoll,
  votePoll,
} from "../controllers/pollController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js"; // ✅ ensure only admin can create

const router = express.Router();


router.get("/", getActivePoll);


router.post("/", authMiddleware, adminMiddleware, createPoll);


router.post("/vote", authMiddleware, votePoll);

export default router;
