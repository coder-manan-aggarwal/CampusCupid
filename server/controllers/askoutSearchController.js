import Askout from "../models/AskOut.js";

export const searchAskouts = async (req, res) => {
  try {
    const q = (req.query.q || "").trim().toLowerCase();
    const userId = req.user.id;

   

    const askouts = await Askout.find({
      to: userId,
      status: "pending",
    })
      .populate("from", "name college profile.profilePic")
      .lean();

    

    const filtered = askouts.filter((a) =>
      a.from?.name?.toLowerCase().includes(q)
    );

    

    res.json(filtered);
  } catch (err) {
    console.error("❌ Askout search error:", err);
    res.status(500).json({ error: "Askout search failed" });
  }
};