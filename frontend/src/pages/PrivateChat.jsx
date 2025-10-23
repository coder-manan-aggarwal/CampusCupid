// src/pages/PrivateChat.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import socket from "../utils/socket";
import chatBackground from "../assets/chatBackground.jpg";
import EmojiPicker from "emoji-picker-react";

const PrivateChat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load matches
  useEffect(() => {
    API.get("/messages/matches")
      .then((res) => setMatches(res.data))
      .catch((err) => console.error("Fetch matches error:", err));
  }, []);

  // Load chat + socket join
  useEffect(() => {
    if (!matchId) return;
    socket.emit("joinPrivateChat", matchId);

    API.get(`/private-chat/${matchId}`)
      .then((res) => {
        setMessages(res.data);
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

    return () => socket.off("receivePrivateMessage");
  }, [matchId, matches]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim() || !recipient?._id) return;
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
    if (!file || !recipient?._id) return;
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
    <div
      className="flex h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${chatBackground})` }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/60 to-purple-100/50 backdrop-blur-sm"></div>

      {/* Sidebar */}
      <div className="relative z-10 w-72 bg-white/50 backdrop-blur-xl shadow-md overflow-y-auto border-r border-white/40">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-pink-300/80 to-purple-300/80 text-gray-800 font-semibold tracking-wide">
          <span>Matches</span>
          <button
            onClick={() => navigate("/messages")}
            className="px-3 py-1 bg-white/60 hover:bg-white/90 border border-gray-300 rounded-md shadow-sm transition text-sm font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Matches List */}
        {matches.map((m) => {
          const other = m.users.find((u) => u._id !== userId);
          return (
            <div
              key={m._id}
              onClick={() => navigate(`/chat/${m._id}`)}
              className={`flex items-center gap-3 mx-3 my-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                m._id === matchId
                  ? "bg-gradient-to-r from-pink-200 to-purple-200 shadow-md"
                  : "bg-white/60 hover:bg-white/80"
              }`}
            >
              <img
                src={other?.profile?.profilePic || "/default-avatar.png"}
                alt={other?.name}
                className="w-10 h-10 rounded-full object-cover border border-purple-200"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-gray-800">{other?.name}</p>
                <p className="text-gray-600 text-sm truncate">
                  {m.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center gap-3 shadow-md">
          {recipient && (
            <>
              <img
                src={recipient.profile?.profilePic || "/default-avatar.png"}
                alt={recipient.name}
                className="w-10 h-10 rounded-full border border-white/40"
              />
              <span className="font-semibold text-lg tracking-wide">
                {recipient.name}
              </span>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          {messages.map((m) => (
            <div
  key={m._id}
  className={`flex ${
    m.sender?._id === userId ? "justify-end" : "justify-start"
  }`}
>
  <div className="max-w-[70%]">
    {/* Text Message */}
    {m.text && (
      <div
        className={`px-5 py-3 text-[15px] shadow-sm transition-all duration-200 ${
          m.sender?._id === userId
            ? "bg-gradient-to-r from-[#FFD8F5] via-[#FFB3E2] to-[#FF9FB6] text-[#4B006E]"
            : "bg-gradient-to-r from-white to-[#FFF7FB] text-gray-700"
        }`}
        style={{
          borderRadius:
            m.sender?._id === userId
              ? "20px 20px 0px 20px"
              : "20px 20px 20px 0px",
        }}
      >
        <span className="leading-relaxed break-words">{m.text}</span>
      </div>
    )}

    {/* Image Message */}
    {m.imageUrl && (
      <div className="mt-2">
        <img
          src={m.imageUrl}
          alt="sent"
          className="max-w-[200px] rounded-xl shadow-sm"
        />
      </div>
    )}
  </div>
</div>

          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {/* Input */}
{matchId && (
  <div className="relative p-4 bg-white/80 backdrop-blur-md border-t flex items-center gap-3">
    {/* Emoji Button */}
    <div className="relative">
      <button
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        className="text-xl hover:opacity-70 transition"
      >
        😊
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-12 left-0 z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setText((prev) => prev + emojiData.emoji);
              setShowEmojiPicker(false);
            }}
            theme="light"
            width={320}
            height={360}
          />
        </div>
      )}
    </div>

    {/* Image Upload */}
    <input
      type="file"
      accept="image/*"
      id="image-upload"
      className="hidden"
      onChange={(e) => sendImage(e.target.files[0])}
    />
    <label
      htmlFor="image-upload"
      className="cursor-pointer text-lg hover:opacity-70 transition"
    >
      📷
    </label>

    {/* Message Input */}
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      }}
      placeholder="Type a message..."
      className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
    />

    {/* Send Button */}
    <button
      onClick={sendMessage}
      className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-pink-600 via-fuchsia-500 to-purple-600 text-white rounded-full shadow-md hover:scale-105 transition-transform"
    >
      ➤
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default PrivateChat;
