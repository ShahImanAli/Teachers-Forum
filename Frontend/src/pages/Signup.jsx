import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOtpBtn, setShowOtpBtn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await axios.post(
        "/api/v1/verification/send-otp",
        { email: formData.email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      setOtpSent(true);
      toast.success(data.message || "OTP sent successfully");
      setShowOtpBtn(false);
    } catch (error) {
      const data = error.response?.data;
      toast.error(data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/v1/users/register",
        { ...formData, role, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;

      // Auto-login after successful signup
      login(data.data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      const message = data?.message || "Signup failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-neutral-800">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Sign Up
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-white mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label htmlFor="fullName" className="block text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-white mb-2">
              Register as
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500"
            >
              <option value="" disabled hidden>
                Select role
              </option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-white mb-2">
              Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500"
                placeholder="Enter your email"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || otpSent}
                className="bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-600 text-black px-4 py-2 rounded-lg font-medium whitespace-nowrap"
              >
               {otpLoading ? "Sending..." : otpSent ? "Sent" : "Send OTP"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="otp" className="block text-white mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500"
              placeholder="Enter the OTP"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-700 disabled:text-neutral-500 py-2 rounded-lg font-medium transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-neutral-400 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:text-neutral-400 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
