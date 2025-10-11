// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Utility: update localStorage and broadcast a custom event
  const writeUserToStorage = useCallback((newUser, token = null) => {
    if (newUser) {
      localStorage.setItem("campusCupidUser", JSON.stringify(newUser));
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("userId", newUser._id);
    } else {
      localStorage.removeItem("campusCupidUser");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
    // broadcast to other listeners (same window)
    window.dispatchEvent(new CustomEvent("campusCupidAuthChanged", { detail: { user: newUser } }));
  }, []);

  // On mount: read user safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem("campusCupidUser");
      if (stored && stored !== "null") {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error parsing stored user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }

    // Listen for storage events (cross-tab)
    const onStorage = (e) => {
      if (e.key === "campusCupidUser") {
        try {
          const val = e.newValue;
          if (val && val !== "null") setUser(JSON.parse(val));
          else setUser(null);
        } catch (err) {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);

    // Listen for same-window custom events (we dispatch these on writes)
    const onAuthChanged = (e) => {
      const newUser = e.detail?.user ?? null;
      setUser(newUser);
    };
    window.addEventListener("campusCupidAuthChanged", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("campusCupidAuthChanged", onAuthChanged);
    };
  }, []);

  // Signup
  const signup = async (data) => {
    try {
      const res = await API.post("/auth/signup", data);
      const { user: resUser, token } = res.data;
      setUser(resUser);
      writeUserToStorage(resUser, token);
      navigate("/onboarding");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // Login
  const login = async (data) => {
    try {
      const res = await API.post("/auth/login", data);
      const { user: resUser, token } = res.data;
      setUser(resUser);
      writeUserToStorage(resUser, token);
      if (resUser.role === "admin") navigate("/admin");
      else if (resUser.onboardingComplete) navigate("/dashboard");
      else navigate("/onboarding");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // Complete profile
  const completeProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put("/auth/complete-profile", profileData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      const updatedUser = res.data.user;
      setUser(updatedUser);
      writeUserToStorage(updatedUser);
      navigate("/dashboard");
    } catch (err) {
      console.error("Profile update failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    writeUserToStorage(null);
    navigate("/login");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, completeProfile, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
