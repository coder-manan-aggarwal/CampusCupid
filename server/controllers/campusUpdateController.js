import CampusUpdate from "../models/CampusUpdate.js";

// 🔧 Normalizer function so we always match schema enum
const normalizeType = (t) => {
  if (!t) return null;
  const map = {
    event: "Event",
    community: "Community",
    post: "Post",
  };
  return map[t.toLowerCase()] || null;
};

// 📢 Get all campus updates (latest first)
export const getCampusUpdates = async (req, res) => {
  try {
    let updates = await CampusUpdate.find()
      .populate({
        path: "referenceId",
        select: "title image name profilePic", // only what you need
      })
      .sort({ createdAt: -1 });

    // 🔥 Filter out updates where the referenced item no longer exists
    updates = updates.filter((update) => update.referenceId);

    res.json(updates);
  } catch (err) {
    console.error("Error fetching campus updates:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📢 Create a new campus update (admin only)
export const createCampusUpdate = async (req, res) => {
  try {
    const { title, type, referenceId } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: "Title and type are required" });
    }

    // ✅ Normalize type to match schema enum
    const normalizedType = normalizeType(type);
    if (!normalizedType) {
      return res.status(400).json({ message: "Invalid type provided" });
    }

    const update = await CampusUpdate.create({
      title,
      type: normalizedType,   // 🔥 guaranteed to be "Event", "Community", or "Post"
      referenceId,
      createdBy: req.user.id,
    });

    res.status(201).json(update);
  } catch (err) {
    console.error("Error creating campus update:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📢 Delete an update
export const deleteCampusUpdate = async (req, res) => {
  try {
    const update = await CampusUpdate.findByIdAndDelete(req.params.id);
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }
    res.json({ message: "Update deleted" });
  } catch (err) {
    console.error("Error deleting campus update:", err);
    res.status(500).json({ message: "Server error" });
  }
};
