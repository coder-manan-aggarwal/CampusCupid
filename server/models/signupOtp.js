import mongoose from "mongoose";

const signupOtpSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // temporarily stored hashed
  college: String,
  otp: String,
  otpExpiry: Date
}, { timestamps: true });

export default mongoose.model("SignupOTP", signupOtpSchema);