// src/components/MiniSpotlightCard.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MiniSpotlightCard = ({ spotlight }) => {
  const navigate = useNavigate();
  if (!spotlight) return null;

  const profilePic = spotlight.profile?.profilePic || "/default-avatar.png";
  const name = spotlight.profile?.name || spotlight.name || "Unknown";
  const course = spotlight.profile?.course || "";
  const year = spotlight.profile?.year || "";
  const vibeLine =
    spotlight.profile?.bio ||
    spotlight.profile?.tagline ||
    "Spreading sunshine & sweet vibes ✨";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate("/dating?tab=discover")}
      className="relative cursor-pointer bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-200" />

      {/* Header */}
      <h3 className="text-sm font-semibold text-center text-pink-700 mb-3">
        💞 Meet Today’s Star
      </h3>

      {/* Main content layout */}
      <div className="relative z-10 flex items-center gap-5 justify-center">
        {/* Profile Picture */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 180 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/${spotlight._id}`);
          }}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white/40 backdrop-blur-sm flex-shrink-0"
        >
          <img
            src={profilePic}
            alt={name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Name + course/year */}
        <div className="flex flex-col items-start justify-center text-left">
          <h2 className="text-lg font-bold text-gray-800 hover:text-pink-600 transition">
            {name}
          </h2>
          {(course || year) && (
            <p className="text-sm text-gray-600">
              {course} {year && `• ${year}`}
            </p>
          )}
        </div>
      </div>

      {/* Description / Bio below */}
      <p className="text-center text-sm text-gray-700 italic mt-4 max-w-[260px] mx-auto leading-snug">
        “{vibeLine}”
      </p>

      {/* Decorative sparkle line */}
      <div className="mt-3 mx-auto w-14 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-full animate-pulse" />
    </motion.div>
  );
};

export default MiniSpotlightCard;
