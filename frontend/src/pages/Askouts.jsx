import { useEffect, useState } from "react";
import API from "../utils/api";

const AskoutsTab = ({ searchResults = [] }) => {
  const [askouts, setAskouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all incoming askouts initially
  useEffect(() => {
    const fetchAskouts = async () => {
      try {
        const res = await API.get("/dating/askout/incoming");
        console.log("✅ Incoming askouts:", res.data);
        setAskouts(res.data);
      } catch (err) {
        console.error("Error loading askouts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAskouts();
  }, []);

  // Handle Accept / Reject
  const handleRespond = async (id, status) => {
    try {
      await API.put(`/dating/askout/${id}/respond`, { status });
      setAskouts((prev) => prev.filter((a) => a._id !== id));
      alert(`Request ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Determine which list to show — search results or default
  const listToShow = searchResults.length > 0 ? searchResults : askouts;

  // 🌀 Loading state
  if (loading)
    return <p className="text-gray-500 text-center mt-6">Loading askouts...</p>;

  // 💔 No askouts at all
  if (listToShow.length === 0)
    return <p className="text-gray-400 text-center mt-6">No incoming requests 💔</p>;

  // ✅ Show all askouts
  return (
    <div className="grid gap-4 mt-4">
      {listToShow.map((a) => (
        <div
          key={a._id}
          className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3">
            <img
              src={a.from?.profile?.profilePic || "/default-avatar.png"}
              alt={a.from?.name || "Unknown"}
              className="w-12 h-12 rounded-full object-cover border-2 border-pink-200"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {a.from?.name || "Unnamed User"}
              </p>
              <p className="text-gray-500 text-sm">
                {a.from?.college || "College not set"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleRespond(a._id, "accepted")}
              className="px-4 py-1.5 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 shadow"
            >
              Accept
            </button>
            <button
              onClick={() => handleRespond(a._id, "rejected")}
              className="px-4 py-1.5 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 shadow"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AskoutsTab;
