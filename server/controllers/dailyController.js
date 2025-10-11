import DailyCrushAssignment from "../models/DailyCrushAssignment.js";
import Match from "../models/Match.js";

export const getTodayCrush = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    let assignment = await DailyCrushAssignment.findOne({ user: req.user.id, date: today })
      .populate("assigned", "name profile.profilePic");

    if (!assignment) {
      return res.status(404).json({ message: "No daily crush assigned today." });
    }

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// (optional) Confirm mutual daily crush to match
export const confirmDailyCrush = async (req, res) => {
  try {
    const { assignedId } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const reciprocal = await DailyCrushAssignment.findOne({
      user: assignedId,
      assigned: req.user.id,
      date: today,
    });

    if (reciprocal) {
      await Match.create({ users: [req.user.id, assignedId], via: "daily" });
      return res.json({ message: "Daily crush is mutual! Match created." });
    }

    res.json({ message: "Not mutual (yet)." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
