import User from "../models/user.js";
import DailySpotlight from "../models/DailySpotlight.js";

export const getSpotlightUser = async (req, res) => {
  try {
    const me = await User.findById(req.user.id).lean();
    if (!me) return res.status(404).json({ message: "User not found" });

    const myGender = me.profile?.gender;
    const myInterests = Array.isArray(me.profile?.interests)
      ? me.profile.interests.map((i) => i.toLowerCase())
      : [];

    // 1️⃣ Compute today 6 AM and next 6 AM
    const now = new Date();
    const today6am = new Date(now);
    today6am.setHours(6, 0, 0, 0);

    let next6am;
    if (now < today6am) {
      next6am = today6am;
    } else {
      next6am = new Date(today6am);
      next6am.setDate(today6am.getDate() + 1);
    }

    // 2️⃣ Check if spotlight already assigned after today's 6 AM
    const existingSpotlight = await DailySpotlight.findOne({
      user: me._id,
      assignedAt: { $gte: today6am },
    }).populate("spotlight", "name college profile");

    if (existingSpotlight) {
      return res.json({
        spotlight: existingSpotlight.spotlight,
        nextReset: next6am.toISOString(),
      });
    }

    // 3️⃣ Build filter
    const baseFilter = {
      _id: { $ne: me._id },
      role: "user",
    };
    if (myGender === "Male") baseFilter["profile.gender"] = "Female";
    else if (myGender === "Female") baseFilter["profile.gender"] = "Male";

    const candidates = await User.find(baseFilter)
      .select("name college profile")
      .lean();

    if (!candidates.length) {
      return res.status(404).json({
        message: "No suitable spotlight users found",
        nextReset: next6am.toISOString(),
      });
    }

    // 4️⃣ Compute compatibility
    const scoredCandidates = candidates.map((u) => {
      const userInterests = Array.isArray(u.profile?.interests)
        ? u.profile.interests.map((i) => i.toLowerCase())
        : [];
      const shared = userInterests.filter((i) => myInterests.includes(i));
      const score =
        userInterests.length > 0
          ? Math.round((shared.length / userInterests.length) * 100)
          : 0;

      return { ...u, sharedInterests: shared, compatibility: score };
    });

    scoredCandidates.sort((a, b) => b.compatibility - a.compatibility);
    const topCandidates = scoredCandidates.slice(0, 10);
    const spotlight =
      topCandidates[Math.floor(Math.random() * topCandidates.length)];

    // 5️⃣ Save record
    await DailySpotlight.create({
      user: me._id,
      spotlight: spotlight._id,
      assignedAt: new Date(),
    });

    res.json({
      spotlight: {
        ...spotlight,
        sharedInterests: spotlight.sharedInterests,
        compatibility: spotlight.compatibility,
      },
      nextReset: next6am.toISOString(),
    });
  } catch (err) {
    console.error("❌ Spotlight error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
