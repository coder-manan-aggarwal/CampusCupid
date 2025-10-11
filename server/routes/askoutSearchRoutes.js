import express from "express";
import { searchAskouts } from "../controllers/askoutSearchController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", authMiddleware, searchAskouts);

export default router;
