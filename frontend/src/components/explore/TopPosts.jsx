import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import defaultAvatar from "../../assets/default-avatar.png"; // ✅ Local fallback image

export default function TopPosts({ topPosts = [] }) {
  const navigate = useNavigate();

  // ✅ Show only top 3 confessions
  const topThree = topPosts.slice(0, 3);

  // ✅ Navigate to Confessions tab
  const handleConfessionClick = () => {
    navigate("/dating?tab=confessions");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="font-bold mb-3">🔥 Top Confessions</h2>

      {topThree.length === 0 ? (
        <p className="text-gray-400 text-sm">No top confessions yet</p>
      ) : (
        <ul className="space-y-3">
          {topThree.map((confession, i) => (
            <motion.li
              key={confession._id}
              onClick={handleConfessionClick}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="cursor-pointer p-3 rounded-lg hover:bg-pink-50 transition border border-pink-100 shadow-sm"
            >
              {/* === Author Section === */}
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={
                    confession.anonymous
                      ? defaultAvatar
                      : confession.author?.profile?.profilePic || defaultAvatar
                  }
                  alt="author"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-semibold text-sm text-gray-800">
                  {confession.anonymous
                    ? "Anonymous"
                    : confession.author?.name || "Unknown"}
                </span>
              </div>

              {/* === Confession Text === */}
              <p className="text-gray-700 text-sm line-clamp-2">
                {confession.text.length > 100
                  ? `${confession.text.slice(0, 100)}...`
                  : confession.text}
              </p>
            </motion.li>
          ))}
        </ul>
      )}

      {/* === View All Button === */}
      <button
        onClick={handleConfessionClick}
        className="mt-3 w-full text-center text-sm font-semibold text-pink-600 hover:text-pink-700 hover:underline transition"
      >
        View All Confessions →
      </button>
    </div>
  );
}
