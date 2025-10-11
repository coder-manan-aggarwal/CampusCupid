import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../utils/api";
import DatingNavbar from "../components/DatingNavbar";

import DiscoverTab from "./DiscoverTab";
import AskoutsTab from "./Askouts";
import MatchesTab from "./MatchesTab";
import ConfessionsTab from "./ConfessionsTab";
import CommunityPage from "./CommunityPage";

import datingBg from "../assets/datingpagebackground.png"; // ✅ safe import

export default function DatingPage() {
  // ===== State =====
  const [activeTab, setActiveTab] = useState("discover");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // ===== Get URL Query Param =====
  const [searchParams] = useSearchParams();

  // ✅ Sync tab with URL (e.g. /dating?tab=confessions)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab.toLowerCase());
    }
  }, [searchParams]);

  // ===== Handle Search =====
  const handleSearch = async (query) => {
    const trimmed = query?.trim();
    if (!trimmed) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      let res;
      switch (activeTab) {
        case "discover":
          res = await API.get(`/users/search?q=${encodeURIComponent(trimmed)}`);
          break;
        case "matches":
          res = await API.get(`/dating/matches/search?q=${encodeURIComponent(trimmed)}`);
          break;
        case "askouts":
          res = await API.get(`/dating/askouts/search?q=${encodeURIComponent(trimmed)}`);
          break;
        case "confessions":
          res = await API.get(`/dating/confession/search?q=${encodeURIComponent(trimmed)}`);
          break;
        default:
          res = { data: [] };
      }

      setSearchResults(res.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    }
  };

  // ===== Render =====
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${datingBg})`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Glass overlay */}
      <div className="bg-[rgba(255,255,255,0.55)] backdrop-blur-sm min-h-screen pb-10">
        {/* Sticky Navbar */}
        <DatingNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSearch={handleSearch}
        />

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="max-w-7xl mx-auto px-4 pt-6"
        >
          {activeTab === "discover" && (
            <DiscoverTab searchResults={searchResults} isSearching={isSearching} />
          )}

          {activeTab === "askouts" && (
            <AskoutsTab searchResults={searchResults} isSearching={isSearching} />
          )}

          {activeTab === "matches" && (
            <MatchesTab searchResults={searchResults} isSearching={isSearching} />
          )}

          {activeTab === "confessions" && (
            <ConfessionsTab searchResults={searchResults} isSearching={isSearching} />
          )}

         
        </motion.main>
      </div>
    </div>
  );
}
