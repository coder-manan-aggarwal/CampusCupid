import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";  // ✅ add this
import {
  createPost,
  getPosts,
  getTopPosts,
  toggleLikePost,
  addComment,
} from "../controllers/postController.js";

const router = express.Router();

// ✅ Fix: use Multer here
router.post("/", authMiddleware, upload.single("media"), createPost);

router.get("/", authMiddleware, getPosts);
router.get("/top", authMiddleware, getTopPosts);
router.post("/:id/like", authMiddleware, toggleLikePost);
router.post("/:id/comment", authMiddleware, addComment);

export default router;
