// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://civic-guard-production.up.railway.app/api/auth/login",
        form
      );

      const user = res.data; // includes token + user info
      localStorage.setItem("user", JSON.stringify(user));
      console.log("✅ Login successful:", user);

      navigate("/profile");
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-transparent border border-purple-500/40 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-transparent border border-purple-500/40 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-purple-200 text-sm mt-4">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/Register")}
            className="text-blue-400 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
