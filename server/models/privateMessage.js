import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  text: { type: String },  // encrypted text (optional now)
  iv: { type: String },    // only required if text exists

  imageUrl: { type: String }, // ✅ NEW field for images

  delivered: { type: Boolean, default: false }, 
  seen: { type: Boolean, default: false },
  seenAt: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("PrivateMessage", privateMessageSchema);
