import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";

export default function PostCard({ post, onUpdate, currentUser }) {
  const [commentText, setCommentText] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  // ✅ Like a post
  const handleLike = async () => {
    try {
      setLoadingLike(true);
      const res = await API.post(`/explore/${post._id}/like`);
      onUpdate(res.data);
    } catch (err) {
      console.error("Error liking:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  // ✅ Add a comment (optimistic update)
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      _id: Date.now(),
      text: commentText,
      user: currentUser,
    };

    onUpdate({
      ...post,
      comments: [...post.comments, newComment],
    });

    setCommentText("");

    try {
      const res = await API.post(`/explore/${post._id}/comment`, {
        text: commentText,
      });
      onUpdate(res.data);
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      {/* --- Author + Date --- */}
      <div className="flex items-center gap-2 mb-2">
        {/* ✅ Profile Picture */}
        {post.isAnonymous ? (
          <img
            src="/default-avatar.png"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <Link to={`/user/${post.author?._id}`}>
            <img
              src={post.author?.profile?.profilePic || "/default-avatar.png"}
              alt={post.author?.name || "User"}
              className="w-8 h-8 rounded-full hover:scale-105 transition-transform"
            />
          </Link>
        )}

        {/* ✅ Author Name */}
        {post.isAnonymous ? (
          <span className="font-semibold">Anonymous</span>
        ) : (
          <Link
            to={`/user/${post.author?._id}`}
            className="font-semibold text-gray-800 hover:text-blue-600 transition"
          >
            {post.author?.name || "Unknown"}
          </Link>
        )}

        <span className="ml-auto text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>

      {/* --- Post Content --- */}
      <p className="text-gray-800 mb-3">{post.content}</p>

      {/* --- Media (image/video) --- */}
      {post.mediaUrl &&
        (post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
          <video
            src={post.mediaUrl}
            controls
            className="w-full rounded-lg mb-3 max-h-80 object-cover"
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt="Post media"
            className="w-full rounded-lg mb-3 max-h-80 object-cover"
          />
        ))}

      {/* --- Likes Section --- */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={handleLike}
          disabled={loadingLike}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
            loadingLike
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          👍 {post.likes?.length || 0}
        </button>

        {/* ✅ Clickable liked user avatars */}
        <div className="flex items-center -space-x-2">
          {post.likes?.slice(0, 3).map((user) =>
            user?._id ? (
              <Link to={`/user/${user._id}`} key={user._id}>
                <img
                  src={user?.profile?.profilePic || "/default-avatar.png"}
                  alt={user?.name || "User"}
                  className="w-6 h-6 rounded-full border hover:scale-110 transition-transform"
                />
              </Link>
            ) : (
              <img
                key={Math.random()}
                src="/default-avatar.png"
                alt="User"
                className="w-6 h-6 rounded-full border"
              />
            )
          )}
          {post.likes?.length > 3 && (
            <span className="text-xs text-gray-500 ml-2">
              +{post.likes.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* --- Comments Section --- */}
      <div className="mt-3 space-y-2">
        {/* Latest comment preview */}
        {!showAllComments && post.comments?.length > 0 && (
          <>
            {post.comments.slice(-1).map((c) => (
              <p key={c._id || Math.random()} className="text-sm">
                {c.user?._id ? (
                  <Link
                    to={`/user/${c.user._id}`}
                    className="font-semibold hover:text-blue-600 transition"
                  >
                    {c.user?.name || "User"}
                  </Link>
                ) : (
                  <b>{c.user?.name || "Anon"}</b>
                )}
                : {c.text}
              </p>
            ))}
            {post.comments.length > 1 && (
              <button
                onClick={() => setShowAllComments(true)}
                className="text-xs text-gray-500 hover:underline"
              >
                View all {post.comments.length} comments
              </button>
            )}
          </>
        )}

        {/* Show all comments */}
        {showAllComments &&
          post.comments?.map((c) => (
            <p key={c._id || Math.random()} className="text-sm">
              {c.user?._id ? (
                <Link
                  to={`/user/${c.user._id}`}
                  className="font-semibold hover:text-blue-600 transition"
                >
                  {c.user?.name || "User"}
                </Link>
              ) : (
                <b>{c.user?.name || "Anon"}</b>
              )}
              : {c.text}
            </p>
          ))}
        {showAllComments && post.comments?.length > 1 && (
          <button
            onClick={() => setShowAllComments(false)}
            className="text-xs text-gray-500 hover:underline"
          >
            Hide comments
          </button>
        )}

        {/* Add new comment */}
        <form onSubmit={handleComment} className="mt-2 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="border rounded px-3 py-1 text-sm flex-1 focus:outline-none focus:ring focus:ring-blue-200"
            disabled={loadingComment}
          />
          <button
            type="submit"
            disabled={loadingComment}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              loadingComment
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loadingComment ? "..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
