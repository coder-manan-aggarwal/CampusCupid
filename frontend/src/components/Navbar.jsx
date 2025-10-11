import {  useState } from "react";
import React from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // ✅ import your auth context
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // ✅ use proper import

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout, loading } = useAuth(); // ✅ include loading state
  console.log("[Navbar Debug] Current user from context:", user);

// Force re-render when auth changes
// (sometimes React Fast Refresh or cache holds stale closures)
const [version, setVersion] = useState(0);
React.useEffect(() => {
  // Whenever user changes, bump version
  setVersion((v) => v + 1);
}, [user]);

  const navigate = useNavigate();

  // ✅ Don’t render until auth state is ready
  if (loading) return null;

  // Smooth scroll handler
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-lg shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Name */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => handleScroll("home")}
        >
          <img src={logo} alt="CampusCupid Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            CampusCupid
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
          {["home", "how-it-works", "features", "contact"].map((item) => (
            <li
              key={item}
              className="hover:text-pink-500 transition-colors cursor-pointer capitalize"
              onClick={() => handleScroll(item)}
            >
              {item.replace("-", " ")}
            </li>
          ))}
        </ul>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-full text-gray-700 font-semibold border border-pink-500 hover:bg-pink-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="px-5 py-2 rounded-full text-gray-700 font-semibold border border-gray-300 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg shadow-md p-6 space-y-4 text-center font-medium transition-all">
          {["home", "how-it-works", "features", "contact"].map((item) => (
            <p
              key={item}
              className="hover:text-pink-500 transition-colors cursor-pointer capitalize"
              onClick={() => handleScroll(item)}
            >
              {item.replace("-", " ")}
            </p>
          ))}

          {/* Auth Buttons for mobile */}
          {!user ? (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
                className="w-full px-5 py-2 rounded-full text-gray-700 font-semibold border border-pink-500 hover:bg-pink-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setOpen(false);
                }}
                className="w-full px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setOpen(false);
                }}
                className="w-full px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full px-5 py-2 rounded-full text-gray-700 font-semibold border border-gray-300 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
