import Poll from "../models/Poll.js";

// Create Poll
export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = await Poll.create({
      question,
      options: options.map((opt) => ({ text: opt })),
      createdBy: req.user.id,
    });
    res.status(201).json(poll);
  } catch (err) {
    console.error("Error creating poll:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get active poll (not expired)
export const getActivePoll = async (req, res) => {
  try {
    const now = new Date();
    const poll = await Poll.findOne({
      isActive: true,
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });

    if (!poll) return res.status(200).json(null);
    res.json(poll);
  } catch (err) {
    console.error("Error fetching poll:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Vote
export const votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const userId = req.user.id; // ✅ assuming middleware sets req.user

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // ✅ Prevent voting on expired poll
    if (new Date() > poll.expiresAt) {
      poll.isActive = false;
      await poll.save();
      return res.status(400).json({ message: "Poll has expired" });
    }

    // ✅ Prevent double voting
    if (poll.votedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already voted in this poll" });
    }

    // ✅ Add vote
    poll.options[optionIndex].votes += 1;
    poll.votedBy.push(userId);

    await poll.save();
    res.json(poll);
  } catch (err) {
    console.error("Error voting:", err);
    res.status(500).json({ message: "Server error" });
  }
};

