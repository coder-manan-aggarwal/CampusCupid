import Match from "../models/Match.js";

export const searchMatches = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    const userId = req.user.id; // ✅ use 'id' instead of '_id'

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: user not found" });
    }

    // Find all matches where this user is one of the participants
    const matches = await Match.find({ users: userId })
      .populate("users", "name profile.profilePic")
      .lean();

    // Filter only matches where the *other user*'s name matches the search query
    const filtered = matches.filter((m) =>
      m.users.some(
        (u) =>
          u._id.toString() !== userId.toString() &&
          u.name?.toLowerCase().includes(q.toLowerCase())
      )
    );

    res.json(filtered);
  } catch (err) {
    console.error("❌ Match search error:", err);
    res.status(500).json({ error: "Match search failed" });
  }
};
