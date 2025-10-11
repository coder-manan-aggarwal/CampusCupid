import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState({});
  const [initialProfile, setInitialProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // ✅ new state for confirmation modal

  const navigate = useNavigate();

  // --- Fetch profile data ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await API.get("/profile");
        setUserData(res.data);
        const fetchedProfile = res.data.profile || {};
        setProfile(fetchedProfile);
        setInitialProfile(fetchedProfile);
        setProfile({ ...fetchedProfile, college: res.data.college });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "interests") {
      const arr =
        typeof value === "string"
          ? value.split(",").map((v) => v.trim()).filter((v) => v !== "")
          : [];
      setProfile({ ...profile, interests: arr });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setProfile({
        ...profile,
        profilePic: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        if (key === "profilePic" && file) return;
        const value =
          key === "interests" && Array.isArray(profile[key])
            ? profile[key].join(",")
            : profile[key];
        formData.append(key, value);
      });

      if (file) formData.append("profilePic", file);

      const res = await API.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedProfile = res.data.profile || {};
      setProfile({ ...updatedProfile, college: res.data.college });
      setInitialProfile({ ...updatedProfile, college: res.data.college });

      setIsEditing(false);
      setFile(null);
      console.log("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
    setFile(null);
  };

  // ✅ Actual logout function
  const {logout} = useAuth();

  if (loading)
    return (
      <div className="text-center p-10 text-gray-500">
        Loading your profile...
      </div>
    );
  if (!userData)
    return (
      <div className="text-center p-10 text-gray-500">
        Could not find profile.
      </div>
    );

  const profileFields = [
    { label: "Gender", name: "gender" },
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "Year", name: "year" },
    { label: "Course", name: "course" },
    { label: "College", name: "college" },
    { label: "Bio", name: "bio", fullWidth: true, type: "textarea" },
    {
      label: "Interests",
      name: "interests",
      fullWidth: true,
      placeholder: "e.g. Reading, Coding, Music",
    },
    { label: "Looking For", name: "lookingFor", fullWidth: true, type: "textarea" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-rose-100 flex items-center justify-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-pink-100 p-8 flex flex-col justify-between">
        {/* Header */}
        <div className="relative flex flex-col items-center">
          <div className="relative group">
            <img
              src={profile.profilePic || "/default-avatar.png"}
              alt="Profile"
              onClick={() => {
                if (profile.profilePic) setShowImageModal(true);
              }}
              className="w-32 h-32 rounded-full object-cover border-4 border-pink-300 shadow-lg cursor-pointer hover:opacity-90 transition"
            />
            {isEditing && (
              <label
                htmlFor="profilePicInput"
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white font-medium opacity-0 group-hover:opacity-100 cursor-pointer transition"
              >
                Change
                <input
                  id="profilePicInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            {userData.name || "Unnamed User"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {profile.course && profile.year
              ? `${profile.year} • ${profile.course}`
              : profile.course || profile.year || "Course not set"}
          </p>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Fields */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {profileFields.map((field) => (
            <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
              <label className="text-sm font-semibold text-gray-600">
                {field.label}
              </label>

              {isEditing ? (
                field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={
                      field.name === "interests"
                        ? profile[field.name]?.join(", ") || ""
                        : profile[field.name] || ""
                    }
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    className="w-full border-gray-300 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-pink-400 transition"
                    rows="3"
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={
                      field.name === "interests"
                        ? profile[field.name]?.join(", ") || ""
                        : profile[field.name] || ""
                    }
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    className="w-full border-gray-300 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-pink-400 transition"
                  />
                )
              ) : field.name === "interests" && Array.isArray(profile.interests) ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.interests.length > 0 ? (
                    profile.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-sm text-pink-700 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full shadow-sm font-medium"
                      >
                        #{interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No interests added</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-800 bg-gray-50 p-2 rounded-lg mt-1 min-h-[40px]">
                  {profile[field.name] || (
                    <span className="text-gray-400">Not set</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Save/Cancel */}
        {isEditing && (
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-pink-500 text-white font-semibold rounded-full disabled:opacity-50 hover:bg-pink-600 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* ✅ Logout button at bottom */}
        {!isEditing && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-8 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={profile.profilePic}
            alt="Full Profile"
            className="max-w-[90%] max-h-[85%] rounded-2xl shadow-2xl border-4 border-white object-contain"
          />
        </div>
      )}

      {/* ✅ Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={logout}
                className="px-5 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
