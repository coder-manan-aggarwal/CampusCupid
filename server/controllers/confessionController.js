// controllers/confessionController.js
import Confession from "../models/Confession.js";

// ➤ Create Confession
export const createConfession = async (req, res) => {
  try {
    const { text, anonymous, visibleTo } = req.body;

    const confession = await Confession.create({
      author: anonymous ? null : req.user.id,
      text,
      anonymous,
      visibleTo,
    });

    const populated = await confession.populate("author", "name profile.profilePic");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Error creating confession:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ➤ Get All Confessions
export const getConfessions = async (req, res) => {
  try {
    const confessions = await Confession.find()
      .sort({ createdAt: -1 })
      .populate("author", "name profile.profilePic")
      .populate("comments.user", "name profile.profilePic");
    res.json(confessions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ➤ Like / Unlike a confession
export const toggleLikeConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);
    if (!confession) return res.status(404).json({ message: "Confession not found" });

    const userId = req.user.id;
    const alreadyLiked = confession.likes.includes(userId);

    if (alreadyLiked) {
      confession.likes.pull(userId);
    } else {
      confession.likes.push(userId);
    }

    await confession.save();
    res.json({ likesCount: confession.likes.length, liked: !alreadyLiked });
  } catch (err) {
    console.error("Error liking confession:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ➤ Add a comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const confession = await Confession.findById(req.params.id);
    if (!confession) return res.status(404).json({ message: "Confession not found" });

    const comment = { user: req.user.id, text };
    confession.comments.push(comment);
    await confession.save();

    await confession.populate("comments.user", "name profile.profilePic");

    res.status(201).json(confession.comments.at(-1));
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ➤ Get Top Confessions
export const getTopConfessions = async (req, res) => {
  try {
    const confessions = await Confession.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } },
          commentsCount: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      { $sort: { likesCount: -1, commentsCount: -1, createdAt: -1 } },
      { $limit: 10 },
    ]);

    // ✅ Populate author info
    const populated = await Confession.populate(confessions, [
      { path: "author", select: "name profile.profilePic" },
    ]);

    res.json(populated);
  } catch (err) {
    console.error("Error fetching top confessions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

