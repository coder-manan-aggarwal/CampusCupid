import User from "../models/user.js";

// ✅ Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
  "name profile.profilePic profile.college profile.course profile.year profile.interests"
);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
