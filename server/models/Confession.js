// models/Confession.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const confessionSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
    anonymous: { type: Boolean, default: true },
    visibleTo: {
      type: String,
      enum: ["all", "college"],
      default: "college",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Confession", confessionSchema);
