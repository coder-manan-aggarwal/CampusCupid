import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import loginImage from "../assets/logincopy.png";
import logo from "../assets/logo.png";
import { Eye, EyeOff } from "lucide-react"; // ✅ for eye icons

// ✅ Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "At least 6 characters").required("Password is required"),
  college: yup.string().required("College name is required"),
});

export default function Signup() {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ show/hide password state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await signup(data);
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-100 via-white to-purple-100">
      {/* ===================== LEFT SIDE (Full Image Section) ===================== */}
      <div className="hidden md:flex md:w-3/5 h-screen">
        <img
          src={loginImage}
          alt="CampusCupid Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ===================== RIGHT SIDE (Signup Section) ===================== */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-8 md:p-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo + Welcome Text */}
          <div className="flex flex-col items-center mb-8 text-center">
            <img
              src={logo}
              alt="CampusCupid Logo"
              className="w-24 h-24 object-contain mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2 whitespace-nowrap">
              Join the CampusCupid Community!
            </h1>
            <p className="text-gray-500 text-base max-w-sm leading-relaxed">
              Discover like-minded students, share your journey, and find meaningful campus connections. 💕
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <input
                {...register("name")}
                type="text"
                placeholder="Full Name"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
              <p className="text-sm text-red-500 mt-1">{errors.name?.message}</p>
            </div>

            {/* College */}
            <div>
              <input
                {...register("college")}
                type="text"
                placeholder="College Name"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <p className="text-sm text-red-500 mt-1">{errors.college?.message}</p>
            </div>

            {/* Email */}
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email Address"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
              <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
            </div>

            {/* Password with Show/Hide Toggle */}
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <p className="text-sm text-red-500 mt-1">{errors.password?.message}</p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition ${
                loading
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Creating your account...
                </div>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center text-gray-600 pt-6">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-pink-600 font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
