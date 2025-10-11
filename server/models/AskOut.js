import mongoose from "mongoose";

const askOutSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

askOutSchema.index({ from: 1, to: 1 }, { unique: true }); // prevents duplicate pending sends

export default mongoose.model("AskOut", askOutSchema);
