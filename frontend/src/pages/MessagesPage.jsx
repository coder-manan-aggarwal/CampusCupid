import { useEffect, useState } from "react";
import API from "../utils/api";

const MessagesPage = () => {
  const [tab, setTab] = useState("lounges");
  const [lounges, setLounges] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    API.get("/messages/lounges").then((res) => setLounges(res.data));
    API.get("/messages/matches").then((res) => setMatches(res.data));
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setTab("lounges")}
          className={`flex-1 py-3 font-semibold ${
            tab === "lounges"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500"
          }`}
        >
          Lounges
        </button>
        <button
          onClick={() => setTab("matches")}
          className={`flex-1 py-3 font-semibold ${
            tab === "matches"
              ? "border-b-2 border-pink-600 text-pink-600"
              : "text-gray-500"
          }`}
        >
          Matches
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "lounges"
          ? lounges.map((l) => (
              <div
                key={l._id}
                onClick={() => (window.location.href = `/lounges/${l._id}`)}
                className="flex items-center gap-3 bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
              >
                <div className="flex-1">
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-gray-500 text-sm">{l.lastMessage}</p>
                </div>
                {l.unreadCount > 0 && (
                  <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                    {l.unreadCount}
                  </span>
                )}
              </div>
            ))
          : matches.map((m) => {
              const other = m.users.find(
                (u) => u._id !== localStorage.getItem("userId")
              );
              return (
                <div
                  key={m._id}
                  onClick={() => (window.location.href = `/chat/${m._id}`)}
                  className="flex items-center gap-3 bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={other?.profile?.profilePic || "/default-avatar.png"}
                    alt={other?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{other?.name}</p>
                    <p className="text-gray-500 text-sm">{m.lastMessage}</p>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default MessagesPage;
