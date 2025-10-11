// src/pages/PrivateChat.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import socket from "../utils/socket";

const PrivateChat = () => {
  const { matchId } = useParams(); // current open chat
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("userId");

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load all matches for sidebar
  useEffect(() => {
    API.get("/messages/matches")
      .then((res) => setMatches(res.data))
      .catch((err) => console.error("Fetch matches error:", err));
  }, []);

  // Load chat history + join room
  useEffect(() => {
    if (!matchId) return;

    socket.emit("joinPrivateChat", matchId);

    API.get(`/private-chat/${matchId}`)
      .then((res) => {
        setMessages(res.data);
        // Find the "other" user in this match
        const match = matches.find((m) => m._id === matchId);
        if (match) {
          const other = match.users.find((u) => u._id !== userId);
          setRecipient(other);
        }
      })
      .catch((err) => console.error("Fetch private messages error:", err));

    socket.on("receivePrivateMessage", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.off("receivePrivateMessage");
    };
  }, [matchId, matches]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send text
  const sendMessage = async () => {
    if (!text.trim() || !recipient?._id) return; // ensure recipient exists
    try {
      await API.post("/private-chat", {
        matchId,
        text,
        recipientId: recipient._id,
      });
      setText("");
    } catch (err) {
      console.error("Send private message error:", err);
    }
  };

  // Send image
  const sendImage = async (file) => {
    if (!file || !recipient?._id) {
      console.warn("⚠️ Cannot send image — recipient not set yet");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("matchId", matchId);
      formData.append("recipientId", recipient._id);

      await API.post("/private-chat/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error("Send image error:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - Matches list */}
      <div className="w-72 border-r bg-white overflow-y-auto">
        <div className="p-4 font-bold text-lg border-b">Matches</div>
        {matches.map((m) => {
          const other = m.users.find((u) => u._id !== userId);
          return (
            <div
              key={m._id}
              onClick={() => navigate(`/chat/${m._id}`)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
                m._id === matchId ? "bg-purple-100" : ""
              }`}
            >
              <img
                src={other?.profile?.profilePic || "/default-avatar.png"}
                alt={other?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{other?.name}</p>
                <p className="text-gray-500 text-sm truncate">
                  {m.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-pink-100 to-purple-100">
        {/* Header */}
        <div className="p-4 bg-purple-600 text-white flex items-center gap-3 shadow">
          <button
            onClick={() => navigate("/messages")}
            className="mr-2 text-sm underline"
          >
            ← Back
          </button>
          {recipient && (
            <>
              <img
                src={recipient.profile?.profilePic || "/default-avatar.png"}
                alt={recipient.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold">{recipient.name}</span>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`flex ${
                m.sender?._id === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div className="space-y-2 max-w-xs">
                {/* Text bubble */}
                {m.text && (
                  <div
                    className={`p-3 rounded-2xl shadow ${
                      m.sender?._id === userId
                        ? "bg-purple-500 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                )}
                {/* Image bubble */}
                {m.imageUrl && (
                  <div>
                    <img
                      src={m.imageUrl}
                      alt="sent"
                      className="max-w-[200px] rounded-lg shadow"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {matchId && (
          <div className="p-4 bg-white flex items-center gap-2 border-t">
            <button className="px-2">😊</button>

            <input
              type="file"
              accept="image/*"
              id="image-upload"
              className="hidden"
              onChange={(e) => sendImage(e.target.files[0])}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              📷
            </label>

            <input
  value={text}
  onChange={(e) => setText(e.target.value)}
  onKeyDown={(e) => { 
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent new line
      sendMessage();
    }
  }}
  placeholder="Type a message..."
  className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
/>
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateChat;
