// controllers/userController.js
import User from "../models/user.js";

export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { college: { $regex: q, $options: "i" } },
        { "profile.interests": { $regex: q, $options: "i" } },
      ],
    })
      .select("name college profile profilePic")
      .limit(20);

    res.json(users);
  } catch (err) {
    console.error("❌ User search error:", err);
    res.status(500).json({ error: "User search failed" });
  }
};
