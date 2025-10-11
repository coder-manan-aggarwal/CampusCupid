import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getCampusUpdates,
  createCampusUpdate,
  deleteCampusUpdate,
} from "../controllers/campusUpdateController.js";

const router = express.Router();

// Public: anyone can view updates
router.get("/", getCampusUpdates);

// Admin-only routes
router.post("/", authMiddleware, adminMiddleware, createCampusUpdate);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCampusUpdate);

export default router;
