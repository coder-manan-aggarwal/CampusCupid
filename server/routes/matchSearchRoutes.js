import express from "express";
import { searchMatches } from "../controllers/matchSearchController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", authMiddleware, searchMatches);

export default router;
