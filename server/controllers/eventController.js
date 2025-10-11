import Event from "../models/events.js";
import Lounge from "../models/lounge.js";
import LoungeMessage from "../models/loungeMessage.js";
import CampusUpdate from "../models/CampusUpdate.js";

import cloudinary from "../config/cloudinary.js";


export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, vibes, hostedBy } = req.body;

    let imageUrl = null;

    // ✅ Upload image if present
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "events", resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    // ✅ Create Event
    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      vibes,
      hostedBy,
      image: imageUrl,
      createdBy: req.user.id,
    });

    // 🎉 Auto-create linked Lounge (lowercase type)
    const lounge = await Lounge.create({
      name: `${title} Lounge`,
      type: "event",   // 🔥 lowercase, matches Lounge enum
      linkedId: event._id,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    event.loungeId = lounge._id;
    await event.save();

    // 📢 Auto-create CampusUpdate (capitalized type)
    await CampusUpdate.create({
      title: `New Event: ${title}`,
      type: "Event",   // 🔥 must match CampusUpdate enum + Event model
      referenceId: event._id,
      createdBy: req.user.id,
    });

    return res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};


// ✅ Get All Events
// ✅ Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).lean();

    const enriched = await Promise.all(
      events.map(async (event) => {
        let joined = false;

        if (event.loungeId) {
          const lounge = await Lounge.findById(event.loungeId).select("members");
          joined = lounge?.members.some(
            (m) => m.toString() === req.user.id.toString()
          );
        }

        return { ...event, joined };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

// ✅ Delete Event + lounge
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.loungeId) {
      await LoungeMessage.deleteMany({ lounge: event.loungeId });
      await Lounge.findByIdAndDelete(event.loungeId);
    }

    res.json({ message: "Event and lounge deleted" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};

// ✅ Join Event
export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.loungeId) {
      await Lounge.findByIdAndUpdate(event.loungeId, {
        $addToSet: { members: req.user.id },
      });
    }

    res.json({ message: "Joined event successfully", event });
  } catch (err) {
    console.error("Join event error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name profile.profilePic")
      .lean();

    if (!event) return res.status(404).json({ message: "Event not found" });

    let members = [];
    let joined = false;

    if (event.loungeId) {
      const lounge = await Lounge.findById(event.loungeId)
        .populate("members", "name profile.profilePic")
        .lean();

      members = lounge?.members || [];
      joined = lounge?.members.some(
        (m) => m._id.toString() === req.user.id.toString()
      );
    }

    res.json({ ...event, members, joined });
  } catch (err) {
    console.error("Get event details error:", err);
    res.status(500).json({ message: "Server error" });
  }
};