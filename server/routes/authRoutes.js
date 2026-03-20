import express from "express";
import { signup, login, completeProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"; 
import upload from "../middleware/upload.js"; 
import { verifySignupOtp } from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// ✅ Profile Completion route
router.put(
  "/complete-profile",
  authMiddleware,
  upload.single("profilePic"),
  completeProfile
);
router.post("/verify-otp", verifySignupOtp);
export default router;
