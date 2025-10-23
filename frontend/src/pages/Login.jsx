import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import loginImage from "../assets/logincopy.png";
import logo from "../assets/logo.png";

// ✅ Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "At least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [showModal, setShowModal] = useState(false); // ✅ for popup modal

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      // ✅ Show modal on wrong password
      setServerError(
        err.message || "Invalid credentials. Please check your password."
      );
      setShowModal(true);

      // ✅ Clear password field
      setValue("password", "");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-100 via-white to-purple-100 relative">
      {/* ===================== LEFT SIDE ===================== */}
      <div className="hidden md:flex md:w-3/5 h-screen">
        <img
          src={loginImage}
          alt="Campus students illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ===================== RIGHT SIDE ===================== */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-8 md:p-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo + Welcome Text */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="CampusCupid Logo"
              className="w-16 h-16 object-contain mb-3"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Welcome Back!
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Login with your university email
            </p>
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
              <p className="text-sm text-red-500 mt-1">
                {errors.email?.message}
              </p>
            </div>

            {/* Password */}
            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.password?.message}
              </p>
            </div>

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
              <Link
                to="/signup"
                className="text-pink-600 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ===================== ERROR MODAL ===================== */}
      {/* ===================== ERROR MODAL ===================== */}
<AnimatePresence>
  {showModal && (
    <>
      {/* Dim Background */}
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowModal(false)}
      />

      {/* Centered Modal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className="fixed z-50 inset-0 flex items-center justify-center"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-[90%] max-w-md text-center relative overflow-hidden">
          {/* Decorative Heart Glow */}
          <motion.div
            className="absolute inset-0 opacity-10 bg-gradient-to-br from-pink-300 via-rose-200 to-purple-300"
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Close Button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-lg z-10"
          >
            ✕
          </button>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1.2, 1] }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="text-6xl mb-4 relative z-10"
          >
            💔
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2 relative z-10">
            Wrong Password
          </h2>
          <p className="text-gray-600 mb-6 relative z-10">
            Oops! Looks like your password didn’t match. Give it another try 💞
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(false)}
            className="relative z-10 px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg transition"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

    </div>
  );
}
