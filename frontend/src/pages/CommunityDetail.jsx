import React, { useEffect, useState } from "react";

const CommunityDetail = ({ communityId }) => {
  const [members, setMembers] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch(`/api/communities/${communityId}/members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMembers(data);

      // check if logged-in user is in members
      const userId = localStorage.getItem("userId");
      setJoined(data.some((m) => m._id === userId));
    };

    fetchMembers();
  }, [communityId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Community Members</h2>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {members.map((m) => (
          <li key={m._id} className="flex flex-col items-center bg-white p-3 rounded-lg shadow">
            <img
              src={m.profile?.profilePic || "/default-avatar.png"}
              alt={m.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <p className="mt-2 font-medium">{m.name}</p>
          </li>
        ))}
      </ul>

      {joined && communityId && (
  <button
    onClick={() => (window.location.href = `/lounges/${communityId}`)}
    className="mt-6 bg-purple-500 text-white px-5 py-2 rounded-xl hover:bg-purple-600 transition"
  >
    Go to Chat Lounge
  </button>
)}
    </div>
  );
};

export default CommunityDetail;
