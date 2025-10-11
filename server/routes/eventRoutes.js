import express from "express";
import {
  getEvents,
  createEvent,
  deleteEvent,
  joinEvent,
  getEventDetails,
} from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";  // ✅ import admin check
import upload from "../middleware/upload.js";

const router = express.Router();

// 📌 Public for authenticated users
router.get("/", authMiddleware, getEvents);
router.get("/:id", authMiddleware, getEventDetails); 
router.post("/:id/join", authMiddleware, joinEvent);

// 📌 Admin-only actions
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createEvent);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

export default router;
