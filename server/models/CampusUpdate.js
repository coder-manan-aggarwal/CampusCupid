// models/CampusUpdate.js
import mongoose from "mongoose";

const campusUpdateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    // 🔥 must match actual model names (Event, Community, Post)
    type: { 
      type: String, 
      enum: ["Event", "Community", "Post"], 
      required: true 
    },

    // refPath dynamically points to Event/Community/Post
    referenceId: { 
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type", 
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampusUpdate", campusUpdateSchema);
