import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";

// GET profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      _id: user._id,
      name: user.name , // ✅ ensures frontend gets name
      email: user.email,
      college: user.college,
      profile: user.profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile (already exists)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedFields = [
      "gender",
      "dob",
      "year",
      "course",
      "interests",
      "bio",
      "lookingFor"
    ];

    // ✅ Update nested profile fields only
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user.profile[field] = req.body[field];
      }
    });

    // ✅ Handle top-level college field separately
    if (req.body.college !== undefined) {
      user.college = Array.isArray(req.body.college)
        ? req.body.college[0]
        : req.body.college;
    }

    // ✅ Handle Cloudinary upload properly
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      user.profile.profilePic = uploadResult.secure_url;
    }

    await user.save();
    res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  college: user.college,
  profile: user.profile,
});
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET another user's profile (by userId)
export const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user safely without password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return the correct fields
    res.json({
      _id: user._id,
      name: user.name, // 🔥 FIX: send actual name
      email: user.email,
      college: user.college,
      profile: user.profile,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

