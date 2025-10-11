import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24h
    },
    isActive: { type: Boolean, default: true },

    // ✅ Track which users have voted
    votedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Poll", pollSchema);
