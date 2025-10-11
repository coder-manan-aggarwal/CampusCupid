import mongoose from "mongoose";

const loungeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["community", "event"], required: true }, // tie lounges to either
  linkedId: { type: mongoose.Schema.Types.ObjectId }, // communityId or eventId
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export default mongoose.model("Lounge", loungeSchema);
