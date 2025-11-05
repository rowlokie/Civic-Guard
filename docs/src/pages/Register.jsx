import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
    role: "reporter", // default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to connect your wallet.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setFormData((prev) => ({ ...prev, walletAddress: accounts[0] }));
        setError("");
      }
    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://civic-guard-production.up.railway.app/api/auth/register",
        formData
      );

      // Store token
      localStorage.setItem("token", res.data.token);

      // Navigate after short delay
      navigate("/");
    } catch (err) {
      console.error("❌ Registration failed:", err);
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="w-full p-2 rounded bg-transparent border border-purple-500/40 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            onChange={handleChange}
            value={formData.name}
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            className="w-full p-2 rounded bg-transparent border border-purple-500/40 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            onChange={handleChange}
            value={formData.email}
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full p-2 rounded bg-transparent border border-purple-500/40 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            onChange={handleChange}
            value={formData.password}
          />

          <select
            name="role"
            className="w-full p-2 rounded bg-transparent border border-purple-500/40 text-white focus:outline-none focus:border-purple-400"
            onChange={handleChange}
            value={formData.role}
          >
            <option value="reporter">Reporter</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={connectWallet}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
            >
              {formData.walletAddress
                ? "Wallet Connected ✅"
                : "Connect MetaMask Wallet"}
            </button>
            {formData.walletAddress && (
              <p className="text-sm text-green-400 break-all">
                {formData.walletAddress}
              </p>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
