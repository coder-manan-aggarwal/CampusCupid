// models/DailySpotlight.js
import mongoose from "mongoose";

const dailySpotlightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  spotlight: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedAt: { type: Date, default: Date.now },
});

// Prevent duplicate entries per user per day
dailySpotlightSchema.index({ user: 1, assignedAt: 1 });

export default mongoose.model("DailySpotlight", dailySpotlightSchema);
