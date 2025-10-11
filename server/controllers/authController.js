import bcrypt from "bcryptjs";
import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js"; // already set up
import jwt from "jsonwebtoken";
const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role }, // 👈 include role
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ✅ Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, college } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      college,
      role: "user", // default role
    });

    const token = signToken(newUser);
    // don't send password back
    const safeUser = newUser.toObject();
    delete safeUser.password;

    res.status(201).json({ message: "User registered", user: safeUser, token });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ message: "Login successful", user: safeUser, token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ✅ Complete Profile
// ✅ Complete Profile (Improved for array-based interests)
export const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    let profilePicUrl = null;

    console.log("Received profile data:", req.body);

    // ✅ Upload image to Cloudinary if present
    if (req.file) {
      profilePicUrl = await new Promise((resolve, reject) => {
        console.log("Incoming body:", req.body);
        console.log("Incoming file:", req.file);

        const stream = cloudinary.uploader.upload_stream(
          { folder: "campusCupid/profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    // ✅ Normalize interests to always be an array
    let interests = [];
    if (Array.isArray(req.body.interests)) {
      interests = req.body.interests.filter(Boolean);
    } else if (typeof req.body.interests === "string") {
      // handle comma-separated fallback (for old clients)
      interests = req.body.interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
    }

    // ✅ Update nested profile object safely
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "profile.gender": req.body.gender,
          "profile.dob": req.body.dob,
          "profile.year": req.body.year,
          "profile.course": req.body.course,
          "profile.interests": interests,
          "profile.bio": req.body.bio,
          "profile.lookingFor": req.body.lookingFor,
          ...(profilePicUrl && { "profile.profilePic": profilePicUrl }),
          onboardingComplete: true,
        },
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res
      .status(500)
      .json({ message: "Profile update failed", error: error.message });
  }
};

