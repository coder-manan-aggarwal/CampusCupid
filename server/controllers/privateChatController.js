import PrivateMessage from "../models/privateMessage.js";
import Match from "../models/Match.js";
import { encryptText, decryptText } from "../utils/encryption.js";
import { emitToRoom } from "../utils/socketEmitter.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Text message
export const sendPrivateMessage = async (req, res) => {
  try {
    const { matchId, text, recipientId } = req.body;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    if (!match.users.map(u => u.toString()).includes(req.user.id.toString())) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { content, iv } = encryptText(text);

    let newMsg = await PrivateMessage.create({
      match: matchId,
      sender: req.user.id,
      recipient: recipientId,
      text: content,
      iv,
      delivered: true,
    });

    newMsg = await newMsg.populate([
      { path: "sender", select: "name profile.profilePic" },
      { path: "recipient", select: "name profile.profilePic" },
    ]);

    const safeMsg = {
      ...newMsg._doc,
      text: decryptText(newMsg.text, newMsg.iv),
    };

    emitToRoom(matchId, "receivePrivateMessage", safeMsg);

    res.status(201).json(safeMsg);
  } catch (err) {
    console.error("Send private msg error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Image message
// ✅ Image message
export const sendPrivateImage = async (req, res) => {
  try {
    const { matchId, recipientId } = req.body;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    if (!match.users.map(u => u.toString()).includes(req.user.id.toString())) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "private_chat" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    let newMsg = await PrivateMessage.create({
      match: matchId,
      sender: req.user.id,
      recipient: recipientId,
      imageUrl: result.secure_url,
      delivered: true,
    });

    newMsg = await newMsg.populate([
      { path: "sender", select: "name profile.profilePic" },
      { path: "recipient", select: "name profile.profilePic" },
    ]);

    emitToRoom(matchId, "receivePrivateMessage", newMsg);

    res.status(201).json(newMsg);
  } catch (err) {
    console.error("Send private image error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fetch messages
export const getPrivateMessages = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    if (!match.users.map(u => u.toString()).includes(req.user.id.toString())) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Mark unseen messages as seen
    await PrivateMessage.updateMany(
      { match: matchId, recipient: req.user.id, seen: false },
      { seen: true, seenAt: Date.now() }
    );

    let messages = await PrivateMessage.find({ match: matchId })
      .populate("sender", "name profile.profilePic")
      .populate("recipient", "name profile.profilePic")
      .sort({ createdAt: 1 });

    const decrypted = messages.map(m => ({
      ...m._doc,
      text: m.text ? decryptText(m.text, m.iv) : null,
    }));

    res.json(decrypted);
  } catch (err) {
    console.error("Get private msgs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
