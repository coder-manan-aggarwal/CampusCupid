import express from "express";
import { getAllUsers } from "../controllers/userController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// Only admin can fetch all users
router.get("/", authMiddleware, getAllUsers);

export default router;
