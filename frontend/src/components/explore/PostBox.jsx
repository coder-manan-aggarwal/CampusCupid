import { useState } from "react";
import API from "../../utils/api";

export default function PostBox({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);
      if (file) formData.append("media", file); // ✅ matches upload.single("media")

      const res = await API.post("/explore", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onPostCreated) onPostCreated(res.data);

      setContent("");
      setFile(null);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in campus?"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          rows="3"
          disabled={loading}
        />

        <div className="flex items-center justify-between mt-3">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
            className="text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
