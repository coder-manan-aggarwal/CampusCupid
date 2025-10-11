import { motion } from "framer-motion";
import { Search } from "lucide-react";

const TopNavbar = ({ variant, onSearch }) => {
  // Function to get a random motivational phrase
  const getMotivation = () => {
    const phrases = [
      "Keep spreading good vibes around campus 💫",
      "Your vibe attracts your tribe 💖",
      "Make today unforgettable ✨",
      "Small talk. Big connections. 💬",
      "Smiles are contagious — start one today 😊",
      "The best stories start with a 'Hi' 👋",
      "You’re the main character today 🌟",
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  // --- Dynamic center section ---
  const renderCenter = () => {
    switch (variant) {
      // 🌈 Dashboard Navbar
      case "dashboard":
        return (
          <div className="flex-1 flex justify-center">
            <motion.h1
              key={variant} // ensures re-animation on page change
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-base sm:text-lg font-semibold bg-gradient-to-r from-yellow-200 via-pink-200 to-fuchsia-200 bg-clip-text text-transparent tracking-wide drop-shadow-sm text-center"
            >
              {getMotivation()}
            </motion.h1>
          </div>
        );

      // 🔍 Explore / Events / Messages Navbar
      case "explore":
      case "events":
      case "messages":
      case "communities":
        const placeholderText =
          variant === "explore"
            ? "Search posts or users..."
            : variant === "events"
            ? "Search events..."
            : variant === "messages"
            ? "Search chats..."
            : "Search communities...";

        return (
          <div className="flex-1 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-lg"
            >
              <input
                type="text"
                placeholder={placeholderText}
                className="w-full pl-12 pr-4 py-2 rounded-full text-sm text-gray-800 bg-gradient-to-r from-white/90 to-white/70 placeholder-gray-500 backdrop-blur-md shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400"
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-4 top-2.5 text-gray-500"
              />
            </motion.div>
          </div>
        );

      // 👤 Profile Page Navbar
      case "profile":
        return (
          <div className="flex-1 flex justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-lg font-semibold"
            >
              My Profile
            </motion.h1>
          </div>
        );

      default:
        return <div className="flex-1" />;
    }
  };

  return (
    <div className="flex items-center justify-between px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md">
      {renderCenter()}
    </div>
  );
};

export default TopNavbar;
