import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  joinLounge,
  leaveLounge,
  sendLoungeMessage,
  getLoungeMessages,
  getLoungeById, 
} from "../controllers/loungeController.js";

const router = express.Router();
router.get("/:loungeId", authMiddleware, getLoungeById);
// Join or leave a lounge
router.post("/:loungeId/join", authMiddleware, joinLounge);
router.post("/:loungeId/leave", authMiddleware, leaveLounge);

// Messages inside lounge
router.post("/:loungeId/messages", authMiddleware, sendLoungeMessage);
router.get("/:loungeId/messages", authMiddleware, getLoungeMessages);

export default router;
