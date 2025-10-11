import Confession from "../models/Confession.js";

export const searchConfessions = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    if (!q) return res.json([]);

    const confessions = await Confession.find()
      .populate("author", "name")
      .lean();

    const filtered = confessions.filter(
      (c) =>
        (c.author?.name &&
          c.author.name.toLowerCase().includes(q.toLowerCase())) ||
        (c.text && c.text.toLowerCase().includes(q.toLowerCase()))
    );

    res.json(filtered);
  } catch (err) {
    console.error("❌ Confession search error:", err);
    res.status(500).json({ error: "Confession search failed" });
  }
};
