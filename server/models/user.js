import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    profile: {
      gender: String,
      dob: String,
      year: String,
      course: String,

      // ✅ CHANGED from String → Array of strings
      interests: {
        type: [String],
        default: [],
      },

      bio: String,
      lookingFor: String,
      profilePic: String, // Cloudinary URL
    },

    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
