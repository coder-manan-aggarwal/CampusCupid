import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SpotlightCard = ({ spotlight, nextReset, onAskOut, onSecretCrush }) => {
  if (!spotlight) return null;

  const [remaining, setRemaining] = useState("");

  // ⏰ Live countdown timer
  useEffect(() => {
    if (!nextReset) return;
    const interval = setInterval(() => {
      const now = new Date();
      const resetTime = new Date(nextReset);
      const diff = resetTime - now;

      if (diff <= 0) {
        setRemaining("00:00:00");
        clearInterval(interval);
        return;
      }

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(
        Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(
        2,
        "0"
      );

      setRemaining(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextReset]);

  const getCourse = (u) => u?.profile?.course || u?.course || "";
  const getYear = (u) => u?.profile?.year || u?.year || "";
  const getCollege = (u) => u?.college || u?.profile?.college || "";
  const getBio = (u) => u?.profile?.bio || "";
  const getInterests = (u) => u?.profile?.interests || [];

  const sharedInterests = spotlight.sharedInterests || [];
  const allInterests = getInterests(spotlight);

  const compatibility =
    allInterests?.length > 0
      ? Math.min(
          100,
          Math.round((sharedInterests.length / allInterests.length) * 100)
        )
      : 0;

  const getCompatibilityColor = () => {
    if (compatibility > 80) return "from-green-400 to-emerald-500";
    if (compatibility > 50) return "from-yellow-400 to-orange-400";
    return "from-red-400 to-pink-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="max-w-4xl mx-auto bg-white/85 backdrop-blur-md border border-pink-100 rounded-3xl shadow-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      {/* Left section: user info */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={spotlight.profile?.profilePic || "/default-avatar.png"}
            alt={spotlight.name}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {compatibility > 0 && (
            <div
              className={`absolute bottom-0 right-0 text-xs font-semibold text-white bg-gradient-to-r ${getCompatibilityColor()} px-2 py-1 rounded-full shadow`}
            >
              {compatibility}% Match
            </div>
          )}
        </div>

        <div>
          <h3 className="text-base text-pink-600 font-semibold">
            💖 Today’s Spotlight
          </h3>
          <p className="text-2xl font-extrabold text-gray-800 mt-1">
            {spotlight.name}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {getYear(spotlight)
              ? `${getYear(spotlight)} • ${getCourse(spotlight)}`
              : getCourse(spotlight)}
          </p>
          <p className="text-xs text-gray-400">{getCollege(spotlight)}</p>

          {getBio(spotlight) && (
            <p className="text-sm italic text-gray-600 mt-2 line-clamp-2">
              “{getBio(spotlight)}”
            </p>
          )}

          {sharedInterests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {sharedInterests.map((interest, i) => (
                <span
                  key={i}
                  className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-full border border-pink-100"
                >
                  #{interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right section: actions */}
      <div className="flex flex-col items-center gap-3 md:items-end">
        <button
          onClick={() => onAskOut(spotlight._id)}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold shadow-md hover:opacity-95 transition"
        >
          💌 Ask Out
        </button>

        <button
          onClick={() => onSecretCrush(spotlight._id)}
          className="px-6 py-2 rounded-full bg-pink-50 text-pink-600 font-semibold border border-pink-100 shadow-sm hover:bg-pink-100 transition"
        >
          💖 Secret Crush
        </button>

        {/* ⏱️ Live countdown */}
        {remaining && (
          <p className="text-xs text-gray-400 mt-2">
            New connections unlock in {remaining}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SpotlightCard;
