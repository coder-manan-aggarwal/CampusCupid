import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import API from "../utils/api";

const UserCard = ({ user, index, onCrush }) => {
  const navigate = useNavigate();

  const [hasAskedOut, setHasAskedOut] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [matchId, setMatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showAskoutCard, setShowAskoutCard] = useState(false);

  const userId = user._id;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const askoutRes = await API.get(`/dating/check-askout/${userId}`);
        setHasAskedOut(askoutRes.data?.askedOut || false);

        const matchRes = await API.get(`/dating/check-match/${userId}`);
        if (matchRes.data?.matched) {
          setIsMatched(true);
          setMatchId(matchRes.data?.matchId);
        }
      } catch (err) {
        console.warn("Error checking status:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [userId]);

  const handleStartChat = () => {
    if (matchId) {
      navigate(`/chat/${matchId}`, { state: { recipientId: userId } });
    }
  };

  const handleAskOutClick = async (e) => {
    e.stopPropagation();
    try {
      setHasAskedOut(true); // optimistic
      await API.post("/dating/askout", { to: userId });

      // 💌 show card globally (via portal)
      setShowAskoutCard(true);
      setTimeout(() => setShowAskoutCard(false), 3000);
    } catch (err) {
      if (err.response?.data?.message?.includes("Already asked")) {
        setToast({
          type: "warning",
          message: "💘 You’ve already asked out this person!",
        });
        setHasAskedOut(true);
      } else {
        setToast({
          type: "error",
          message: "❌ Something went wrong. Try again later.",
        });
        setHasAskedOut(false);
      }
      setTimeout(() => setToast(null), 3000);
    }
  };

  const getCourse = (u) => u?.profile?.course || u?.course || "";
  const getYear = (u) => u?.profile?.year || u?.year || "";
  const getCollege = (u) => u?.college || u?.profile?.college || "";
  const getInterests = (u) => u?.profile?.interests || [];
  const getBio = (u) => u?.profile?.bio || "";

  const course = getCourse(user);
  const year = getYear(user);
  const college = getCollege(user);
  const interests = getInterests(user);
  const bio = getBio(user);

  return (
    <>
      <motion.div
        key={user._id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => navigate(`/user/${user._id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/user/${user._id}`)}
        className={`cursor-pointer select-none min-h-[360px] rounded-3xl p-6 border ${
          isMatched
            ? "bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 border-pink-200 shadow-pink-200 shadow-lg"
            : "bg-white/90 backdrop-blur-md border-pink-100 shadow-md"
        } hover:shadow-xl transform-gpu transition duration-250 ease-out hover:-translate-y-1`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            {isMatched && (
              <motion.div
                className="absolute inset-0 rounded-full blur-lg bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 opacity-70"
                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <img
              src={user.profile?.profilePic || "/default-avatar.png"}
              alt={user.name}
              className={`w-32 h-32 rounded-full object-cover border-4 ${
                isMatched
                  ? "border-pink-400 shadow-lg shadow-pink-200"
                  : "border-pink-200 shadow"
              } relative z-10`}
            />
            {isMatched && (
              <span className="absolute bottom-1 right-2 text-xl z-20 animate-bounce">💞</span>
            )}
          </div>

          <div className="w-full">
            <h5 className="text-lg font-bold text-gray-800">{user.name}</h5>
            <p className="text-sm text-gray-500 mt-1">
              {year && course ? `${year} • ${course}` : course || year || ""}
            </p>
            <p className="text-xs text-gray-400 mt-1">{college}</p>

            {bio && <p className="text-sm text-gray-600 italic mt-3 line-clamp-3">“{bio}”</p>}

            {Array.isArray(interests) && interests.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {interests.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-full border border-pink-100"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 justify-center mt-5">
              {loading ? (
                <button className="px-5 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-full cursor-wait">
                  Loading...
                </button>
              ) : isMatched ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartChat();
                  }}
                  className="px-5 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full shadow hover:scale-105 transition"
                >
                  💬 Chat
                </button>
              ) : hasAskedOut ? (
                <motion.button
                  disabled
                  animate={{ scale: [1, 1.05, 1], opacity: [1, 0.85, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="px-5 py-1.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 text-sm font-semibold rounded-full shadow cursor-not-allowed border border-gray-300"
                >
                  ⏳ Already Asked Out
                </motion.button>
              ) : (
                <>
                  <button
                    onClick={handleAskOutClick}
                    className="px-5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-semibold rounded-full shadow hover:opacity-95 transition"
                  >
                    💌 Ask Out
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCrush(user._id);
                    }}
                    className="px-5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-full shadow-sm"
                  >
                    💖 Crush
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 💌 Askout Sent Floating Card (Now Global via Portal) */}
      {createPortal(
        <AnimatePresence>
          {showAskoutCard && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ duration: 0.5 }}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xl rounded-2xl px-6 py-4 flex items-center gap-3 z-[9999]"
            >
              <span className="text-3xl">💌</span>
              <div>
                <p className="font-semibold text-lg">Askout Sent!</p>
                <p className="text-sm opacity-90">Let’s hope love finds a way 💖</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ⚠️ Toast Notification (Also Global via Portal) */}
      {createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4 }}
              className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium z-[9999] ${
                toast.type === "warning"
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-red-500"
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default UserCard;
