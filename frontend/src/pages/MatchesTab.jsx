// src/pages/MatchesTab.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const MatchesTab = ({ searchResults = [], isSearching = false }) => {
  const [matches, setMatches] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch default matches
  useEffect(() => {
    API.get("/dating/matches")
      .then((res) => setMatches(res.data))
      .catch((err) => console.error("Error fetching matches:", err));
  }, []);

  const handleStartChat = (match) => {
    const recipient = match.users.find((u) => u._id !== userId);
    navigate(`/chat/${match._id}`, {
      state: { recipientId: recipient._id },
    });
  };

  // ✅ Determine which matches to display
  let displayMatches = matches;
  let noResults = false;

  if (isSearching) {
    displayMatches = searchResults;
    noResults = searchResults.length === 0;
  }

  // ✅ If still loading and no matches yet
  if (!isSearching && matches.length === 0)
    return <p className="text-gray-500 text-center mt-6">No matches yet 💔</p>;

  return (
    <div className="grid gap-4">
      {noResults ? (
        <p className="text-gray-400 text-center mt-6 col-span-full">
          No matches found 💔
        </p>
      ) : (
        displayMatches.map((m) => {
          const other = m.users.find((u) => u._id !== userId);
          return (
            <div
              key={m._id}
              className="flex items-center gap-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={other?.profile?.profilePic || "/default-avatar.png"}
                alt={other?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{other?.name}</p>
                <p className="text-gray-500 text-sm">{m.via} 💞</p>
              </div>
              <button
                onClick={() => handleStartChat(m)}
                className="ml-auto px-3 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 transition"
              >
                Start Chat
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MatchesTab;
