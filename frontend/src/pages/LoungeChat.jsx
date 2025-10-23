import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import API from "../utils/api";
import socket from "../utils/socket";

const LoungeChat = () => {
  const { id } = useParams(); // current loungeId
  const navigate = useNavigate();
  const [lounges, setLounges] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loungeName, setLoungeName] = useState("");
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("userId");

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch lounges for sidebar
  useEffect(() => {
    API.get("/messages/lounges")
      .then((res) => setLounges(res.data))
      .catch((err) => console.error("Fetch lounges error:", err));
  }, []);

  // Fetch messages + lounge name + join socket room
  useEffect(() => {
    if (!id) return;

    socket.emit("joinLounge", id);

    API.get(`/lounges/${id}`)
      .then((res) => setLoungeName(res.data.name || "Lounge"))
      .catch(() => setLoungeName("Lounge"));

    API.get(`/lounges/${id}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Fetch messages error:", err));

    socket.on("receiveLoungeMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveLoungeMessage");
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await API.post(`/lounges/${id}/messages`, { text });
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#1E1F22] text-white">
      {/* Sidebar */}
      <div className="w-72 border-r border-[#2f3136] bg-[#2B2D31] overflow-y-auto">
        <div className="p-4 font-semibold text-lg border-b border-[#3a3c41] text-gray-200 flex justify-between items-center">
          Lounges
        </div>

        {lounges.map((l) => (
          <div
            key={l._id}
            onClick={() => navigate(`/lounges/${l._id}`)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
              l._id === id ? "bg-[#3c3f45]" : "hover:bg-[#34363c]"
            }`}
          >
            <div className="flex flex-col flex-1">
              <p className="font-medium text-gray-100">{l.name}</p>
              <p className="text-sm text-gray-400 truncate">
                {l.lastMessage || "No messages yet"}
              </p>
            </div>
            {l.unreadCount > 0 && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                {l.unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#313338]">
        {/* Header */}
        <div className="p-4 bg-[#2B2D31] border-b border-[#3a3c41] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <span className="text-[#5865F2]">#</span> {loungeName}
          </h2>
          <span className="text-xs text-gray-400 italic">
            Real-time conversation
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <AnimatePresence>
            {messages.map((m) => {
              const isOwn = m.sender?._id === userId;
              const name =
                m.sender?.profile?.name || m.sender?.name || "Unknown";
              const avatar =
                m.sender?.profile?.profilePic || "/default-avatar.png";

              return (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-3 ${
                    isOwn ? "justify-end flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <img
                    src={avatar}
                    alt={name}
                    onClick={() => navigate(`/user/${m.sender?._id}`)}
                    className="w-9 h-9 rounded-full object-cover cursor-pointer hover:brightness-110 transition"
                  />

                  {/* Message Block */}
                  <div className="max-w-[75%]">
                    {/* Username + Timestamp */}
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        onClick={() => navigate(`/user/${m.sender?._id}`)}
                        className={`text-sm font-medium cursor-pointer hover:underline ${
                          isOwn ? "text-[#9aa6ff]" : "text-gray-300"
                        }`}
                      >
                        {name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {dayjs(m.createdAt).format("hh:mm A")}
                      </span>
                    </div>

                    {/* Message bubble */}
                    <div
                      className={`px-4 py-2 text-[15px] leading-relaxed break-words shadow-sm transition-all duration-200 ${
                        isOwn
                          ? "bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white shadow-[0_0_8px_rgba(88,101,242,0.4)]"
                          : "bg-[#2f3136] text-[#dcddde]"
                      }`}
                      style={{
                        borderRadius: isOwn
                          ? "18px 18px 0px 18px"
                          : "18px 18px 18px 0px",
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-[#2B2D31] border-t border-[#3a3c41] flex items-center gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Message #${loungeName.toLowerCase() || "lounge"}...`}
            className="flex-1 px-4 py-2 bg-[#1E1F22] border border-[#3a3c41] text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865F2] placeholder-gray-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md font-medium shadow-md transition"
          >
            Send 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoungeChat;
