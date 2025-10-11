import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { updateProfile, getProfile } from "../controllers/profileController.js";
import { getUserProfileById } from "../controllers/profileController.js";   
const router = express.Router();

// GET user profile
router.get("/", authMiddleware, getProfile);

// PUT update profile
router.put("/", authMiddleware, upload.single("profilePic"), updateProfile);
// ✅ Get another user's profile by ID
router.get("/:userId", authMiddleware, getUserProfileById);
export default router;
