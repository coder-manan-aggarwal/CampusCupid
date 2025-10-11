import Match from "../models/Match.js";

export const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user.id })
      .populate("users", "name profile.profilePic");
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// 🔍 New function: check if logged-in user is matched with a specific user
// controllers/matchController.js
export const checkIfMatched = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user.id;

    const existingMatch = await Match.findOne({
      users: { $all: [currentUserId, otherUserId] },
    });

    if (existingMatch) {
      return res.json({
        matched: true,
        matchId: existingMatch._id, // ✅ send match id
      });
    }

    res.json({ matched: false });
  } catch (err) {
    console.error("Error checking match:", err);
    res.status(500).json({ message: "Server error" });
  }
};

