import mongoose from "mongoose";

const loungeMessageSchema = new mongoose.Schema({
  lounge: { type: mongoose.Schema.Types.ObjectId, ref: "Lounge", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true }, // encrypted
  iv: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("LoungeMessage", loungeMessageSchema);
