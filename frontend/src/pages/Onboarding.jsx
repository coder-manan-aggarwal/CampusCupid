import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const INTEREST_OPTIONS = [
  "Music", "Movies", "Sports", "Gaming", "Travel", "Cooking", "Reading", "Fitness",
  "Photography", "Coding", "Dancing", "Art", "Fashion", "Writing",
];

const Onboarding = () => {
  const { completeProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    gender: "",
    dob: "",
    year: "",
    course: "",
    interests: [],
    bio: "",
    lookingFor: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "interests" && Array.isArray(value)) {
        value.forEach((i) => data.append("interests", i));
      } else if (value) {
        data.append(key, value);
      }
    });

    try {
      setLoading(true);
      await completeProfile(data);
    } catch (err) {
      console.error("❌ Error completing profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-8 md:p-12"
      >
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Complete Your Profile 💕
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            Let’s personalize your CampusCupid experience so we can connect you better!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gender & DOB in a row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Year & Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
              <input
                type="text"
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                placeholder="e.g. 2nd Year"
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
              <input
                type="text"
                name="course"
                value={form.course}
                onChange={handleChange}
                required
                placeholder="e.g. B.Tech CSE"
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Your Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    form.interests.includes(interest)
                      ? "bg-pink-500 text-white border-pink-500 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-pink-50"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Choose at least a few things that define you best.
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Write something fun or interesting about yourself!"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          {/* Looking For */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Looking For</label>
            <input
              type="text"
              name="lookingFor"
              value={form.lookingFor}
              onChange={handleChange}
              placeholder="e.g. Friends, Study Buddy, Relationship"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                id="profilePic"
                type="file"
                accept="image/*"
                name="profilePic"
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="profilePic"
                className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-md hover:scale-105 transition-transform"
              >
                Upload Picture
              </label>
              {form.profilePic && (
                <div className="flex items-center space-x-3">
                  <img
                    src={URL.createObjectURL(form.profilePic)}
                    alt="Preview"
                    className="h-12 w-12 rounded-full object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, profilePic: null }));
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-red-500 text-sm font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold shadow-md text-white transition ${
              loading
                ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                Saving your profile...
              </div>
            ) : (
              "Save & Continue"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
