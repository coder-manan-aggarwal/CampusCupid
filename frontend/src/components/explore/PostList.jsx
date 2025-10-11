import PostCard from "./PostCard";

export default function PostList({ posts, setPosts, currentUser }) {
  const handleUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onUpdate={handleUpdate}
            currentUser={currentUser}   // ✅ pass down for optimistic comments
          />
        ))
      ) : (
        <p className="text-gray-500 text-center mt-4">No posts yet.</p>
      )}
    </div>
  );
}
