import Lounge from "../models/lounge.js";
import LoungeMessage from "../models/loungeMessage.js";
import Match from "../models/Match.js";
import PrivateMessage from "../models/privateMessage.js";
import { decryptText } from "../utils/encryption.js";

// ✅ Get lounges user is a member of
export const getUserLounges = async (req, res) => {
  try {
    const lounges = await Lounge.find({ members: req.user.id })
      .populate("linkedId", "name")
      .lean();

    // attach last message
    const enriched = await Promise.all(
      lounges.map(async (l) => {
        const lastMsg = await LoungeMessage.findOne({ lounge: l._id })
          .sort({ createdAt: -1 })
          .populate("sender", "name")
          .lean();

        let plainText = "";
        if (lastMsg?.text && lastMsg?.iv) {
          try {
            plainText = decryptText(lastMsg.text, lastMsg.iv);
          } catch (err) {
            console.error("Decrypt lounge msg error:", err.message);
          }
        }

        return {
          ...l,
          lastMessage: plainText || (lastMsg?.imageUrl ? "📷 Image" : ""),
          lastMessageAt: lastMsg?.createdAt || null,
          unreadCount: 0, // TODO: track properly later
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("getUserLounges error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get matches with last message
export const getUserMatchesWithChats = async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user.id })
      .populate("users", "name profile.profilePic")
      .lean();

    const enriched = await Promise.all(
      matches.map(async (m) => {
        const lastMsg = await PrivateMessage.findOne({ match: m._id })
          .sort({ createdAt: -1 })
          .populate("sender", "name")
          .lean();

        let plainText = "";
        if (lastMsg?.text && lastMsg?.iv) {
          try {
            plainText = decryptText(lastMsg.text, lastMsg.iv);
          } catch (err) {
            console.error("Decrypt private msg error:", err.message);
          }
        }

        return {
          ...m,
          lastMessage: plainText || (lastMsg?.imageUrl ? "📷 Image" : ""),
          lastMessageAt: lastMsg?.createdAt || null,
          unreadCount: 0, // TODO: track properly later
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("getUserMatchesWithChats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
