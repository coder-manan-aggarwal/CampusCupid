import mongoose from "mongoose";

const secretCrushSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

secretCrushSchema.index({ from: 1, to: 1 }, { unique: true });

export default mongoose.model("SecretCrush", secretCrushSchema);
