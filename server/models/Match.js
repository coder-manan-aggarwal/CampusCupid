import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // length 2
  via: { type: String, enum: ["askout", "mutual_secret", "daily"], required: true },
  createdAt: { type: Date, default: Date.now }
});

matchSchema.index({ users: 1 });

export default mongoose.model("Match", matchSchema);
