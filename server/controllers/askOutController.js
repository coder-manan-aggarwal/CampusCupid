import AskOut from "../models/AskOut.js";
import Match from "../models/Match.js";

export const sendAskOut = async (req, res) => {
  try {
    const { to } = req.body;
    if (to === req.user.id) {
      return res.status(400).json({ message: "You cannot ask yourself out." });
    }

    const askout = await AskOut.create({ from: req.user.id, to });
    res.status(201).json(askout);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already asked this user out." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const respondAskOut = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "accepted" | "rejected"

    const askout = await AskOut.findById(id);
    if (!askout) return res.status(404).json({ message: "AskOut not found" });

    if (askout.to.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    askout.status = status;
    await askout.save();

    // If accepted → create a Match
    if (status === "accepted") {
      await Match.create({ users: [askout.from, askout.to], via: "askout" });
    }

    res.json(askout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getIncomingAskOuts = async (req, res) => {
  try {
    const askouts = await AskOut.find({ to: req.user.id, status: "pending" })
      .populate("from", "name college profile.profilePic");
    res.json(askouts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const checkAskout = async (req, res) => {
  try {
    const existing = await AskOut.findOne({
      from: req.user.id,
      to: req.params.userId,
    });
    res.json({ askedOut: !!existing });
  } catch (err) {
    console.error("Error checking askout:", err);
    res.status(500).json({ message: "Server error" });
  }
};

