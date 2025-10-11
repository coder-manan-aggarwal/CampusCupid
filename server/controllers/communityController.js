// controllers/communityController.js
import Community from "../models/Community.js";
import Lounge from "../models/lounge.js";
import LoungeMessage from "../models/loungeMessage.js";


import cloudinary from "../config/cloudinary.js"; // make sure you have Cloudinary config


import CampusUpdate from "../models/CampusUpdate.js"; // ✅ import CampusUpdate


export const createCommunity = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create communities" });
    }

    const { name, description, category } = req.body; // ✅ added category
    let iconUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "communities", resource_type: "image" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      iconUrl = result.secure_url;
    }

    const newCommunity = await Community.create({
      name,
      description,
      category, // ✅ store it here
      icon: iconUrl,
      createdBy: req.user.id,
    });

    const lounge = await Lounge.create({
      name: `${name} Lounge`,
      type: "community",
      linkedId: newCommunity._id,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    newCommunity.loungeId = lounge._id;
    await newCommunity.save();

    await CampusUpdate.create({
      title: `🫂 New Community Created: ${newCommunity.name}`,
      type: "Community",
      referenceId: newCommunity._id,
      createdBy: req.user.id,
    });

    res.status(201).json(newCommunity);
  } catch (err) {
    console.error("Create community error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




/**
 * Get all communities (members populated)
 */
export const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("members", "name profile.profilePic")
      .lean();
    res.json(communities);
  } catch (err) {
    console.error("Get communities error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Join a community (also add to lounge.members)
 */
export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    // safer membership check
    if (community.members.some((m) => m.toString() === req.user.id.toString())) {
      return res.status(400).json({ message: "Already a member" });
    }

    community.members.push(req.user.id);
    await community.save();

    // Also join lounge members if present
    if (community.loungeId) {
      await Lounge.findByIdAndUpdate(community.loungeId, {
        $addToSet: { members: req.user.id },
      });
    }

    res.json({ message: "Joined successfully", community });
  } catch (err) {
    console.error("Join community error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Leave a community (also remove from lounge.members)
 */
export const leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    community.members = community.members.filter(
      (memberId) => memberId.toString() !== req.user.id.toString()
    );
    await community.save();

    // Also remove from lounge members if present
    if (community.loungeId) {
      await Lounge.findByIdAndUpdate(community.loungeId, {
        $pull: { members: req.user.id },
      });
    }

    res.json({ message: "Left the community", community });
  } catch (err) {
    console.error("Leave community error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete community and its linked lounge/messages
 */
export const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    if (community.loungeId) {
      await LoungeMessage.deleteMany({ lounge: community.loungeId });
      await Lounge.findByIdAndDelete(community.loungeId);
    }

    res.json({ message: "Community and lounge deleted" });
  } catch (err) {
    console.error("Delete community error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get members of a community (this was accidentally removed earlier)
 */
export const getCommunityMembers = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).populate(
      "members",
      "name email profile.profilePic"
    );
    if (!community) return res.status(404).json({ message: "Community not found" });

    res.json(community.members);
  } catch (err) {
    console.error("Get community members error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





// ✅ Get mutual communities between logged-in user and another user
export const getMutualCommunities = async (req, res) => {
  try {
    const myId = req.user.id;          // from JWT middleware
    const otherId = req.params.userId; // from URL param

    // 🔍 Find all communities where both user IDs exist in "members" array
    const mutualCommunities = await Community.find({
      members: { $all: [myId, otherId] },
    }).select("name icon _id");

    // 🔁 Format the response
    const formatted = mutualCommunities.map((c) => ({
      id: c._id,
      name: c.name,
      icon: c.icon,
    }));

    res.json({ common: formatted });
  } catch (err) {
    console.error("❌ Error fetching mutual communities:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("createdBy", "name profile.profilePic")
      .populate("members", "name profile.profilePic");

    if (!community) return res.status(404).json({ message: "Community not found" });

    res.json(community);
  } catch (err) {
    console.error("Get community by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

