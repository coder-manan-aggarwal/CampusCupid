import Askout from "../models/AskOut.js";

export const searchAskouts = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    const userId = req.user._id;

    const askouts = await Askout.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("from to", "name profile.profilePic")
      .lean();

    const filtered = askouts.filter((a) =>
      [a.from.name, a.to.name]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase())
    );

    res.json(filtered);
  } catch (err) {
    console.error("❌ Askout search error:", err);
    res.status(500).json({ error: "Askout search failed" });
  }
};
