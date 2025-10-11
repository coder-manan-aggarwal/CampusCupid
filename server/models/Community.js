import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String, default: "👥" },
    category: {
      type: String,
      enum: [
        "Tech",
        "Cultural",
        "Sports",
        "Academic",
        "Music",
        "Gaming",
        "Literature",
        "General",
      ],
      default: "General",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    loungeId: { type: mongoose.Schema.Types.ObjectId, ref: "Lounge" },
  },
  { timestamps: true }
);

export default mongoose.model("Community", communitySchema);
