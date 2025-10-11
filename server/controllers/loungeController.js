import Lounge from "../models/lounge.js";
import LoungeMessage from "../models/loungeMessage.js";
import { encryptText, decryptText } from "../utils/encryption.js";
import { io } from "../index.js"
// ✅ Join a lounge
export const joinLounge = async (req, res) => {
  try {
    const lounge = await Lounge.findById(req.params.loungeId);
    if (!lounge) return res.status(404).json({ message: "Lounge not found" });

    if (!lounge.members.includes(req.user.id)) {
      lounge.members.push(req.user.id);
      await lounge.save();
    }

    res.json(lounge);
  } catch (err) {
    console.error("Join lounge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Leave a lounge
export const leaveLounge = async (req, res) => {
  try {
    const lounge = await Lounge.findById(req.params.loungeId);
    if (!lounge) return res.status(404).json({ message: "Lounge not found" });

    lounge.members = lounge.members.filter(
      (m) => m.toString() !== req.user.id.toString()
    );
    await lounge.save();

    res.json({ message: "Left lounge", lounge });
  } catch (err) {
    console.error("Leave lounge error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Send a message in lounge


export const sendLoungeMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const lounge = await Lounge.findById(req.params.loungeId);
    if (!lounge) return res.status(404).json({ message: "Lounge not found" });

    if (!lounge.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Not a member of this lounge" });
    }

    const { content, iv } = encryptText(text);

    let newMsg = await LoungeMessage.create({
      lounge: lounge._id,
      sender: req.user.id,
      text: content,
      iv,
    });

    newMsg = await newMsg.populate("sender", "name profile.profilePic");

    // 🔥 Emit immediately to lounge room
    io.to(lounge._id.toString()).emit("receiveLoungeMessage", {
      ...newMsg._doc,
      text, // decrypted for client
    });

    res.status(201).json({
      ...newMsg._doc,
      text,
    });
  } catch (err) {
    console.error("Send lounge msg error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get messages from lounge
export const getLoungeMessages = async (req, res) => {
  try {
    const lounge = await Lounge.findById(req.params.loungeId);
    if (!lounge) return res.status(404).json({ message: "Lounge not found" });

    if (!lounge.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Not a member of this lounge" });
    }

    let messages = await LoungeMessage.find({ lounge: lounge._id })
      .populate("sender", "name profile.profilePic")
      .sort({ createdAt: 1 });

    const decrypted = messages.map((m) => ({
      ...m._doc,
      text: decryptText(m.text, m.iv),
    }));

    res.json(decrypted);
  } catch (err) {
    console.error("Get lounge msgs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
