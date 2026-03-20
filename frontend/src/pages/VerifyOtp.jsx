import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputs = useRef([]);

  const email = localStorage.getItem("signupEmail");

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      alert("Enter complete OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/verify-otp", {
        email,
        otp: finalOtp,
      });

      localStorage.removeItem("signupEmail");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "campusCupidUser",
        JSON.stringify(res.data.user)
      );

      navigate("/onboarding");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Verify Your Email 💌
        </h1>

        <p className="text-gray-500 mb-8">
          Enter the 6-digit OTP sent to your college email
        </p>

        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              maxLength={1}
              className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-xl focus:border-pink-400 focus:outline-none"
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 shadow-md"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </motion.button>

        <p className="text-sm text-gray-400 mt-6">
          Didn’t receive OTP? Try signing up again
        </p>
      </motion.div>
    </div>
  );
}