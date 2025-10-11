import SecretCrush from "../models/SecretCrush.js";
import Match from "../models/Match.js";

export const addSecretCrush = async (req, res) => {
  try {
    const { to } = req.body;
    if (to === req.user.id) {
      return res.status(400).json({ message: "You cannot crush on yourself." });
    }

    const crush = await SecretCrush.create({ from: req.user.id, to });

    // Check if reciprocal crush exists
    const reciprocal = await SecretCrush.findOne({ from: to, to: req.user.id });
    if (reciprocal) {
      // Create match
      await Match.create({ users: [req.user.id, to], via: "mutual_secret" });
    }

    res.status(201).json(crush);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already added this secret crush." });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getMySecretCrushes = async (req, res) => {
  try {
    const crushes = await SecretCrush.find({ from: req.user.id })
      .populate("to", "name profile.profilePic");
    res.json(crushes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
