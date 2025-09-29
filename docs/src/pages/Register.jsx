import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    walletAddress: '',
    role: 'reporter', // default role
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setFormData((prev) => ({ ...prev, walletAddress: accounts[0] }));
    } else {
      alert('Please install MetaMask');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
          value={formData.name}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
          value={formData.password}
        />
        
        <select
          name="role"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
          value={formData.role}
        >
          <option value="reporter">Reporter</option>
          <option value="admin">Admin</option>
        </select>

        <div className="mb-2">
          <button
            type="button"
            onClick={connectWallet}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
          {formData.walletAddress && (
            <p className="text-sm mt-1 text-green-600">Connected: {formData.walletAddress}</p>
          )}
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button className="w-full bg-violet-600 text-white p-2 rounded hover:bg-violet-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
