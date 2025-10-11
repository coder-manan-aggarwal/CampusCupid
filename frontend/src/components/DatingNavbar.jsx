import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; // ✅ your logo path

const tabsList = [
  { key: "discover", label: "Discover" },
  { key: "askouts", label: "Askouts & Requests" },
  { key: "matches", label: "Matches" },
  { key: "confessions", label: "Confessions" },
  
];

export default function DatingNavbar({ activeTab, setActiveTab, onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch(query || "");
    }, 400);
    return () => clearTimeout(t);
  }, [query, activeTab]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSearch(query || "");
  };

  return (
    <motion.nav
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.32 }}
      className="sticky top-4 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/75 backdrop-blur-md border border-pink-100 rounded-2xl shadow-md p-4">
          {/* ====== ROW 1: Logo - Tabs - Back Button ====== */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="CampusCupid" className="w-9 h-9 object-contain" />
              <span className="text-lg font-extrabold text-pink-600">CampusCupid</span>
            </div>

            {/* Tabs (centered and wrapping instead of scrolling) */}
            <div className="flex flex-wrap justify-center gap-3">
              {tabsList.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setQuery("");
                    setActiveTab(t.key);
                    onSearch("");
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    activeTab === t.key
                      ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-pink-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="px-3 py-1.5 bg-white/90 border border-gray-200 rounded-full text-sm shadow hover:bg-pink-50 transition whitespace-nowrap"
            >
              ← Back
            </button>
          </div>

          {/* ====== ROW 2: Search Bar ====== */}
          <div className="mt-4 flex justify-center">
            <form onSubmit={handleSubmit} className="w-full md:w-2/3 lg:w-1/2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full px-5 py-2 rounded-full bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 placeholder-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
              />
            </form>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
