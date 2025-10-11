import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

// 🕒 Utility for relative time (e.g., “2h ago”)
const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
};

const ConfessionsTab = ({ searchResults = [] }) => {
  const [confessions, setConfessions] = useState([]);
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  // 📥 Fetch Confessions
  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const res = await API.get("/dating/confession");
        setConfessions(res.data);
      } catch (err) {
        console.error("Error fetching confessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfessions();
  }, []);

  // ✍️ Post a new confession
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await API.post("/dating/confession", {
        text,
        anonymous: isAnonymous,
      });
      setConfessions((prev) => [res.data, ...prev]);
      setText("");
    } catch (err) {
      console.error("Error posting confession:", err);
    }
  };

  // ❤️ Like toggle
  const handleLike = async (id) => {
    try {
      const res = await API.post(`/dating/confession/${id}/like`);
      setConfessions((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                likes: Array(res.data.likesCount).fill("like"),
                liked: res.data.liked,
              }
            : c
        )
      );
    } catch (err) {
      console.error("Error liking confession:", err);
    }
  };

  // 💬 Add comment
  const handleComment = async (id, commentText) => {
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/dating/confession/${id}/comment`, { text: commentText });
      setConfessions((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, comments: [...c.comments, res.data] } : c
        )
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const toggleComments = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const listToShow = searchResults?.length > 0 ? searchResults : confessions;
  if (loading)
    return <p className="text-gray-500 text-center mt-6">Loading confessions...</p>;

  return (
    <div className="space-y-4">
      {/* ✍️ Post Form */}
      {searchResults.length === 0 && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl shadow-md border border-pink-100"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your confession..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={!isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              Post with my name
            </label>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {/* 💌 Confession Feed */}
      <div className="space-y-4">
        {listToShow.map((c) => {
          // ✅ only 1 comment by default now
          const commentsToShow =
            expanded === c._id ? c.comments : c.comments?.slice(-1) || [];

          return (
            <div
              key={c._id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 transition"
            >
              {/* 👤 Author Info */}
              {!c.anonymous && c.author ? (
                <div
                  className="flex items-center gap-3 mb-3 cursor-pointer"
                  onClick={() => navigate(`/user/${c.author._id}`)}
                >
                  <img
                    src={c.author?.profile?.profilePic || "/default-avatar.png"}
                    alt={c.author?.name}
                    className="w-10 h-10 rounded-full object-cover border border-pink-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 hover:text-pink-600">
                      {c.author?.name}
                    </p>
                    <p className="text-xs text-gray-400">{timeAgo(c.createdAt)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-2">Anonymous · {timeAgo(c.createdAt)}</p>
              )}

              {/* 📝 Confession Text */}
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{c.text}</p>

              {/* ❤️ Like + 💬 Comments */}
              <div className="flex gap-4 mt-3 text-sm">
                <button
                  onClick={() => handleLike(c._id)}
                  className={`flex items-center gap-1 ${
                    c.liked ? "text-pink-600" : "text-gray-500"
                  }`}
                >
                  ❤️ {c.likes?.length || 0}
                </button>
                <button
                  onClick={() => toggleComments(c._id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expanded === c._id ? "🔽 Hide Comments" : "💬 View Comments"}
                </button>
              </div>

              {/* 💭 Comments */}
              {c.comments?.length > 0 && (
                <div className="mt-3 border-t pt-2 space-y-2">
                  {commentsToShow.map((com, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-sm bg-gray-50 p-2 rounded-lg"
                    >
                      <img
                        src={com.user?.profile?.profilePic || "/default-avatar.png"}
                        alt={com.user?.name || "User"}
                        onClick={() => navigate(`/user/${com.user?._id}`)}
                        className="w-8 h-8 rounded-full object-cover cursor-pointer border border-pink-100"
                      />
                      <div className="flex-1">
                        <p
                          onClick={() => navigate(`/user/${com.user?._id}`)}
                          className="font-semibold text-gray-800 cursor-pointer hover:text-pink-600"
                        >
                          {com.user?.name || "Anonymous"}
                        </p>
                        <p className="text-gray-700">{com.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(com.createdAt)}</p>
                      </div>
                    </div>
                  ))}

                  {c.comments.length > 1 && (
                    <button
                      onClick={() => toggleComments(c._id)}
                      className="text-xs text-pink-600 hover:underline"
                    >
                      {expanded === c._id
                        ? "Hide comments"
                        : `View all ${c.comments.length} comments`}
                    </button>
                  )}
                </div>
              )}

              {/* 📝 Comment Input */}
              <CommentInput onSubmit={(text) => handleComment(c._id, text)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 💬 Comment Input Box
const CommentInput = ({ onSubmit }) => {
  const [val, setVal] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(val);
        setVal("");
      }}
      className="flex gap-2 mt-3"
    >
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 transition"
      >
        Send
      </button>
    </form>
  );
};

export default ConfessionsTab;
