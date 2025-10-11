import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    vibes: { type: String }, // e.g. "romantic", "fun", "chill"
    image: { type: String }, // optional event banner
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    loungeId: { type: mongoose.Schema.Types.ObjectId, ref: "Lounge" },
    hostedBy: { type: String }, // free text (college, club, group, etc.)
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
