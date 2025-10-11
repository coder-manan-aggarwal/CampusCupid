import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    mediaUrl: { type: String }, // optional image

    // 🔥 Anonymous Confessions
    isAnonymous: { type: Boolean, default: false },

    // Likes (store User IDs, populate when fetching)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Comments (embedded)
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // 🔥 Hashtags / tags for trending
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
