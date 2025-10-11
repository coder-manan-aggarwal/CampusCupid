import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import socket from "../utils/socket";

const LoungeChat = () => {
  const { id } = useParams(); // loungeId from URL
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("userId");

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Join lounge room
    socket.emit("joinLounge", id);

    // Fetch old messages
    API.get(`/lounges/${id}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Fetch messages error:", err));

    // Listen for new messages
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

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      // Only call backend, backend will save + emit to socket.io
      await API.post(`/lounges/${id}/messages`, { text });
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {/* Header */}
      <div className="p-4 bg-purple-600 text-white font-bold text-lg shadow">
        Lounge Chat 🗨️
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`flex ${m.sender?._id === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-xs shadow ${
                m.sender?._id === userId
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {m.sender?.name && (
                <p className="text-xs font-semibold opacity-70">{m.sender.name}</p>
              )}
              <p>{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white flex items-center gap-2 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
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
    </div>
  );
};

export default LoungeChat;
