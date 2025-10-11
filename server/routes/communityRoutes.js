// routes/communityRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"; // your current middleware
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  createCommunity,
  getAllCommunities,
  joinCommunity,
  leaveCommunity,
  getCommunityMembers,
  getMutualCommunities,
  getCommunityById
} from "../controllers/communityController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// Routes
router.post("/", authMiddleware, adminMiddleware,  upload.single("icon"), createCommunity);          // Admin only
router.get("/", getAllCommunities);                        // Public
router.post("/:id/join", authMiddleware, joinCommunity);   // Logged-in users
router.post("/:id/leave", authMiddleware, leaveCommunity); // Logged-in users
router.get("/:id/members", getCommunityMembers);           // Public
router.get("/mutual/:userId", authMiddleware, getMutualCommunities);
router.get("/:id", getCommunityById); 
export default router;
