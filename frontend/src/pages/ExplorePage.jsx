import { useEffect, useState } from "react";
import PostBox from "../components/explore/PostBox";
import TopPosts from "../components/explore/TopPosts";
import PostList from "../components/explore/PostList";
import API from "../utils/api";

export default function ExplorePage({ searchQuery }) {
  const [posts, setPosts] = useState([]);
  const [topConfessions, setTopConfessions] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, topConfRes, updatesRes] = await Promise.all([
          API.get("/explore"), // regular posts
          API.get("/dating/confession/top"), // ✅ top confessions
          API.get("/campus-updates"),
        ]);

        setPosts(postsRes.data);
        setTopConfessions(topConfRes.data);
        setUpdates(updatesRes.data);
      } catch (err) {
        console.error("Error fetching explore data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const filteredPosts = posts.filter((p) => {
    const content = p.content?.toLowerCase() || "";
    const author = p.author?.name?.toLowerCase() || "";
    return (
      content.includes(searchQuery.toLowerCase()) ||
      author.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center mt-6">Loading posts...</p>
        ) : filteredPosts.length > 0 ? (
          <PostList posts={filteredPosts} setPosts={setPosts} />
        ) : (
          <p className="text-gray-400 text-center mt-6">
            No matching posts found.
          </p>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6 lg:sticky lg:top-0 self-start">
        {/* 🔥 Top Confessions */}
        <TopPosts topPosts={topConfessions} />

        {/* ✏️ Post Box */}
        <PostBox onPostCreated={handlePostCreated} />

        {/* 📢 Campus Updates */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-2">📢 Campus Updates</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {updates.length > 0 ? (
              updates.map((u) => (
                <li key={u._id}>
                  {u.type === "Event" && u.referenceId ? (
                    <a
                      href={`/events/${u.referenceId._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {u.title}
                    </a>
                  ) : (
                    <span>{u.title}</span>
                  )}
                </li>
              ))
            ) : (
              <li className="text-gray-400">No updates yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
