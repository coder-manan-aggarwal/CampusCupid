import mongoose from "mongoose";

const dailySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true } // ISO date string e.g. "2025-09-12"
}, { timestamps: true });

dailySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyCrushAssignment", dailySchema);
