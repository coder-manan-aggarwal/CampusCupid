import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import API from "../utils/api";
import CommunityCard from "../components/CommunityCard";

export default function CommunityPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch all communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data } = await API.get("/communities");
        setCommunities(data);
      } catch (err) {
        console.error("Error fetching communities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  // ✅ Filter by search query
  const filteredCommunities = communities.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* === Sidebar === */}
      <Sidebar />

      {/* === Main Section === */}
      <div className="flex-1 flex flex-col">
        {/* === Top Navbar with search === */}
        <TopNavbar
          variant="communities" // ✅ Enables search bar
          onSearch={(query) => setSearchQuery(query)}
        />

        {/* === Page Content === */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-gray-800 mb-8"
          >
            🫂 Explore Communities
          </motion.h1>

          {loading ? (
            <p className="text-gray-500 text-center mt-10">
              Loading communities...
            </p>
          ) : filteredCommunities.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              No communities found 😔
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"
            >
              {filteredCommunities.map((community, i) => (
                <motion.div
                  key={community._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CommunityCard community={community} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
