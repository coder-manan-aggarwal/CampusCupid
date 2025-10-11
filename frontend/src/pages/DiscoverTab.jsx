import { useEffect, useState } from "react";
import API from "../utils/api";
import SpotlightCard from "../components/SpotlightCard";
import UserCard from "../components/UserCard";

const DiscoverTab = ({ searchResults = [], isSearching = false }) => {
  const [spotlight, setSpotlight] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch default users + spotlight (only once)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [spotRes, usersRes] = await Promise.all([
          API.get("/dating/spotlight"),
          API.get("/users"),
        ]);
        const loggedInId = localStorage.getItem("userId");
        const filtered =
          usersRes.data?.filter((u) => u._id !== loggedInId) || [];
        setSpotlight(spotRes.data.spotlight || null);
        setUsers(filtered);
      } catch (err) {
        console.error("Error loading Discover:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ✅ Ask out & crush logic
  const handleAskOut = async (id) => {
    try {
      await API.post("/dating/askout", { to: id });
      alert("Askout sent!");
    } catch {
      alert("Failed to send askout");
    }
  };

  const handleCrush = async (id) => {
    try {
      await API.post("/dating/secret-crush", { to: id });
      alert("Crush added!");
    } catch {
      alert("Failed to add crush");
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 p-10">Loading profiles...</div>
    );

  // ✅ Decide what to show
  let displayUsers = users;
  let noResults = false;

  if (isSearching) {
    displayUsers = searchResults;
    noResults = searchResults.length === 0;
  }

  return (
    <div className="p-6 space-y-10">
      <SpotlightCard
        spotlight={spotlight}
        onAskOut={handleAskOut}
        onSecretCrush={handleCrush}
      />

      <div className="max-w-7xl mx-auto">
        <h4 className="text-xl font-bold text-gray-700 mb-6">
          💫 Meet Other Singles
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {noResults ? (
            <p className="text-gray-400 col-span-full text-center mt-6">
              No users found 💔
            </p>
          ) : (
            displayUsers.map((u, i) => (
              <UserCard
                key={u._id}
                user={u}
                index={i}
                onAskOut={handleAskOut}
                onCrush={handleCrush}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverTab;
