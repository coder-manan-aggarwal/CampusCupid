import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import API from "../utils/api";
import { Users, Calendar, MessageCircle, Sparkles } from "lucide-react";
import defaultAvatar from "../assets/default-avatar.png";
import defaultCover from "../assets/default-background.png";

export default function CommunityDetails() {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [toast, setToast] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await API.get(`/communities/${id}`);
        setCommunity(res.data);
        if (res.data.members?.some((m) => m._id === userId)) {
          setIsMember(true);
        }
      } catch (err) {
        console.error("Error fetching community:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunity();
  }, [id, userId]);

const handleJoin = async () => {
  try {
    await API.post(`/communities/${id}/join`);

    // ✅ Extract user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("campusCupidUser"));
    const newMember = {
      _id: userId,
      name: storedUser?.name || "You",
      profile: {
        profilePic: storedUser?.profile?.profilePic || null,
      },
    };

    // ✅ Instantly update community members
    setCommunity((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));

    setIsMember(true);
    setToast({ type: "success", message: "🎉 Joined the community!" });
    setTimeout(() => setToast(null), 2000);
  } catch {
    setToast({ type: "error", message: "Failed to join community." });
    setTimeout(() => setToast(null), 2000);
  }
};

const handleLeave = async () => {
  try {
    await API.post(`/communities/${id}/leave`);

    // Remove current user from members array
    setCommunity((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m._id !== userId),
    }));

    setIsMember(false);
    setToast({ type: "warning", message: "You left the community." });
    setTimeout(() => setToast(null), 2000);
  } catch {
    setToast({ type: "error", message: "Failed to leave community." });
    setTimeout(() => setToast(null), 2000);
  }
};


  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading community...
      </div>
    );

  if (!community)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Community not found.
      </div>
    );

  const { name, description, icon, members, createdBy, createdAt, category, loungeId } =
    community;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* === Sidebar === */}
      <Sidebar />

      {/* === Main Section === */}
      <div className="flex-1 flex flex-col">
        <TopNavbar variant="communities" />

        <main className="flex-1 px-6 py-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto bg-white shadow-lg rounded-3xl border border-gray-100 overflow-hidden"
          >
            {/* Banner Section */}
            <div className="relative h-64 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
              <img
                src={defaultCover}
                alt="cover"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-36 h-36 bg-white shadow-md rounded-full flex items-center justify-center border-2 border-pink-200">
                  {icon ? (
                    icon.startsWith("http") ? (
                      <img
                        src={icon}
                        alt={name}
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">{icon}</span>
                    )
                  ) : (
                    <span className="text-6xl">👥</span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-gray-800 mt-4">
                  {name}
                </h1>
                {category && (
                  <p className="text-xs text-pink-700 bg-pink-100 border border-pink-200 rounded-full px-3 py-0.5 mt-2 font-medium">
                    {category}
                  </p>
                )}
              </div>
            </div>

            {/* Description + Actions */}
            <div className="p-8 text-center">
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                {description || "No description added yet."}
              </p>
              <p className="text-sm text-gray-500">
                Created by{" "}
                <span
                  onClick={() =>
                    (window.location.href = `/user/${createdBy?._id}`)
                  }
                  className="text-pink-600 font-semibold cursor-pointer hover:underline"
                >
                  {createdBy?.name || "Unknown"}
                </span>
              </p>

              <div className="flex justify-center gap-4 mt-8">
                {isMember ? (
                  <>
                    <button
                      onClick={handleLeave}
                      className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition"
                    >
                      Leave
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/lounges/${loungeId}`)
                      }
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow hover:scale-105 transition"
                    >
                      <MessageCircle size={16} /> Go to Lounge
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleJoin}
                    className="flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow hover:scale-105 transition"
                  >
                    <Users size={16} /> Join Community
                  </button>
                )}
              </div>
            </div>

            {/* Highlighted Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-gray-100 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 py-6">
              <div className="flex flex-col items-center p-4">
                <div className="flex items-center gap-2 text-pink-600 font-semibold">
                  <Users size={18} /> Members
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {members.length || 0}
                </p>
              </div>

              <div className="flex flex-col items-center p-4 border-l border-r border-gray-200">
                <div className="flex items-center gap-2 text-purple-600 font-semibold">
                  <Calendar size={18} /> Created On
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {new Date(createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col items-center p-4">
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <Sparkles size={18} /> Category
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {category || "General"}
                </p>
              </div>
            </div>

            {/* Members Grid */}
            <div className="p-8 border-t border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Members ({members.length})
              </h2>
              {members.length === 0 ? (
                <p className="text-gray-500 text-sm">No members yet.</p>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-4 justify-center">
                  {members.slice(0, 10).map((m) => (
                    <motion.div
                      key={m._id}
                      whileHover={{ scale: 1.08 }}
                      onClick={() =>
                        (window.location.href = `/user/${m._id}`)
                      }
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <img
                        src={m.profile?.profilePic || defaultAvatar}
                        alt={m.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-pink-300 shadow-md"
                      />
                      <p className="text-xs text-gray-700 mt-1 truncate w-14 text-center font-medium">
                        {m.name.split(" ")[0]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-8 right-8 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium z-50 ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "warning"
                ? "bg-yellow-400 text-gray-900"
                : "bg-red-500"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
