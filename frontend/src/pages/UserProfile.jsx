import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const UserProfile = () => {
  const { id } = useParams(); // userId from URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAskedOut, setHasAskedOut] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [matchId, setMatchId] = useState(null);
  const [commonCommunities, setCommonCommunities] = useState([]);
  const [toast, setToast] = useState(null);
  const [showAskoutCard, setShowAskoutCard] = useState(false); // ✅ new animated confirmation card

  // ✅ Fetch profile, askout, match, and communities
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await API.get(`/profile/${id}`);
        const fetchedUser = res.data;
        setUser(fetchedUser);

        if (!fetchedUser.name && fetchedUser.profile?.name) {
          fetchedUser.name = fetchedUser.profile.name;
        }

        // ✅ Check if already asked out
        try {
          const askoutRes = await API.get(`/dating/check-askout/${id}`);
          setHasAskedOut(askoutRes.data?.askedOut || false);
        } catch (err) {
          console.warn("AskOut check failed:", err.message);
        }

        // ✅ Check match status
        try {
          const matchRes = await API.get(`/dating/check-match/${id}`);
          if (matchRes.data?.matched) {
            setIsMatched(true);
            setMatchId(matchRes.data?.matchId);
          } else {
            setIsMatched(false);
          }
        } catch (err) {
          console.warn("Match check failed:", err.message);
        }

        // ✅ Common communities
        try {
          const commRes = await API.get(`/communities/mutual/${id}`);
          setCommonCommunities(commRes.data?.common || []);
        } catch (err) {
          console.warn("Community check failed:", err.message);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  // ✅ Handle askout with animated confirmation
  const handleAskOut = async () => {
    try {
      await API.post("/dating/askout", { to: id });
      setHasAskedOut(true);
      setShowAskoutCard(true); // show fancy card

      // Hide after 3s
      setTimeout(() => setShowAskoutCard(false), 3000);
    } catch (err) {
      if (err.response?.data?.message?.includes("Already asked")) {
        setToast({
          type: "warning",
          message: "💘 You’ve already asked out this person!",
        });
      } else {
        setToast({
          type: "error",
          message: "❌ Something went wrong. Try again later.",
        });
      }
      setTimeout(() => setToast(null), 3000);
    }
  };

  // ✅ Navigate to correct chat
  const handleMessage = () => {
    if (matchId) {
      navigate(`/chat/${matchId}`, { state: { recipientId: id } });
    } else {
      setToast({
        type: "error",
        message: "⚠️ Unable to open chat. Match not found.",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading)
    return <div className="text-center p-10 text-gray-500">Loading profile...</div>;
  if (!user)
    return <div className="text-center p-10 text-gray-500">User not found.</div>;

  const { name, fullName, profile, college } = user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-rose-100 flex items-center justify-center py-10 px-4 relative">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-pink-100 p-8 relative">

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-sm font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full border border-pink-200 shadow-sm transition-all flex items-center gap-1"
        >
          <span className="text-lg">←</span> Back
        </button>

        {/* --- Header Section --- */}
        <div className="relative flex flex-col items-center mt-6">
          <img
            src={profile?.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-pink-300 shadow-lg"
          />

          <h1 className="text-3xl font-bold text-gray-800 mt-4 flex items-center gap-2">
            {name || fullName || "Unnamed User"}
            {isMatched && (
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                💞 Matched
              </span>
            )}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {profile?.year && profile?.course
              ? `${profile.year} • ${profile.course}`
              : profile?.course || profile?.year || "Course not set"}
          </p>

          {college && <p className="text-xs text-gray-400 mt-1">{college}</p>}
        </div>

        {/* --- Profile Details --- */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-600">Gender</label>
            <p className="text-gray-800 bg-gray-50 p-2 rounded-lg mt-1">
              {profile?.gender || <span className="text-gray-400">Not set</span>}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Bio</label>
            <p className="text-gray-800 bg-gray-50 p-2 rounded-lg mt-1 min-h-[40px]">
              {profile?.bio || <span className="text-gray-400">Not set</span>}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">Looking For</label>
            <p className="text-gray-800 bg-gray-50 p-2 rounded-lg mt-1 min-h-[40px]">
              {profile?.lookingFor || <span className="text-gray-400">Not set</span>}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">Interests</label>
            {profile?.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map((i, idx) => (
                  <span
                    key={idx}
                    className="text-sm text-pink-700 bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200 px-3 py-1 rounded-full shadow-sm"
                  >
                    #{i}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 mt-1">No interests added</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">Common Communities</label>
            {commonCommunities.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {commonCommunities.map((c) => (
                  <span
                    key={c.id}
                    className="text-sm text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full shadow-sm flex items-center gap-1"
                  >
                    <span>{c.icon}</span> {c.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 mt-1">No common communities</p>
            )}
          </div>
        </div>

        {/* --- Buttons --- */}
        <div className="mt-8 flex justify-center">
          {isMatched ? (
            <button
              onClick={handleMessage}
              className="px-8 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:scale-105 transition"
            >
              💬 Message
            </button>
          ) : hasAskedOut ? (
            <button
              disabled
              className="px-8 py-2 bg-gray-300 text-gray-600 font-semibold rounded-full shadow-md cursor-not-allowed"
            >
              ⏳ Pending
            </button>
          ) : (
            <button
              onClick={handleAskOut}
              className="px-8 py-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold rounded-full shadow-md hover:scale-105 transition"
            >
              💌 Ask Out
            </button>
          )}
        </div>
      </div>

      {/* ✅ Floating Askout Success Card */}
      <AnimatePresence>
        {showAskoutCard && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xl rounded-2xl px-6 py-4 flex items-center gap-3"
          >
            <span className="text-3xl">💌</span>
            <div>
              <p className="font-semibold text-lg">Askout Sent!</p>
              <p className="text-sm opacity-90">Let’s hope love finds a way 💖</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all transform ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "warning"
              ? "bg-yellow-400 text-gray-900"
              : "bg-red-500"
          } animate-fadeIn`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
