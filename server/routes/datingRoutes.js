import express from "express";
import {
  sendAskOut,
  respondAskOut,
  getIncomingAskOuts,
  checkAskout,
} from "../controllers/askOutController.js";

import {
  addSecretCrush,
  getMySecretCrushes,
} from "../controllers/secretCrushController.js";

import {
  getTodayCrush,
  confirmDailyCrush,
} from "../controllers/dailyController.js";

import {
  createConfession,
  getConfessions,
  toggleLikeConfession,
  addComment,
  getTopConfessions,
} from "../controllers/confessionController.js";

import { getMyMatches ,checkIfMatched} from "../controllers/matchController.js";

import { getSpotlightUser  } from "../controllers/spotlightController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
console.log("✅ datingRoutes file loaded");
router.get("/ping", (req, res) => {
  res.json({ msg: "Dating API is mounted!" });
});

console.log("👉 getSpotlightUser is:", getSpotlightUser);


// Spotlight endpoint
router.get("/spotlight", getSpotlightUser);
/* ---------------------- ASKOUT ROUTES ---------------------- */
router.post("/askout", sendAskOut); // send request
router.put("/askout/:id/respond", respondAskOut); // accept/reject
router.get("/askout/incoming", authMiddleware, getIncomingAskOuts); // get pending requests
router.get("/check-askout/:userId", authMiddleware, checkAskout);
/* ----------------- SECRET CRUSH ROUTES --------------------- */
router.post("/secret-crush", addSecretCrush); // add secret crush
router.get("/secret-crush/mine", getMySecretCrushes); // get my crush list


/* ---------------- CONFESSION ROUTES ------------------------ */
router.post("/confession", authMiddleware, createConfession);
router.get("/confession", authMiddleware, getConfessions);
router.post("/confession/:id/like", authMiddleware, toggleLikeConfession);
router.post("/confession/:id/comment", authMiddleware, addComment);
router.get("/confession/top", authMiddleware, getTopConfessions);
/* ------------------- MATCH ROUTES -------------------------- */
router.get("/matches", authMiddleware,getMyMatches); // my matches
router.get("/check-match/:userId", authMiddleware, checkIfMatched);

console.log("👉 Registered routes:", router.stack.map(r => r.route?.path));

export default router;
