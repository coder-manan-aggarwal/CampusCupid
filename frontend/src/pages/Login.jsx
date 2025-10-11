import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import loginImage from "../assets/logincopy.png"; // ✅ Left illustration
import logo from "../assets/logo.png"; // ✅ Your logo

// ✅ Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "At least 6 characters").required("Password is required"),
});

export default function Login() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      setServerError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-100 via-white to-purple-100">
      {/* ===================== LEFT SIDE (Full Image Section) ===================== */}
      <div className="hidden md:flex md:w-3/5 h-screen">
        <img
          src={loginImage}
          alt="Campus students illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ===================== RIGHT SIDE (Login Section) ===================== */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-8 md:p-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo + Welcome Text */}
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="CampusCupid Logo" className="w-16 h-16 object-contain mb-3" />
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back!</h1>
            <p className="text-gray-500 text-sm mb-8">Login with your university email</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="University Email"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
              <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
            </div>

            {/* Password */}
            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <p className="text-sm text-red-500 mt-1">{errors.password?.message}</p>
            </div>

            {/* Server Error */}
            {serverError && (
              <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}

            {/* Login Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 shadow-md hover:shadow-lg transition"
            >
              Log In
            </motion.button>
          </form>

          {/* Footer Text */}
          <div className="text-center text-gray-600 pt-6">
            <p>
              Don’t have an account?{" "}
              <Link to="/signup" className="text-pink-600 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
