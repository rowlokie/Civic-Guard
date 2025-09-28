import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UrbanCoinABI from '../abis/UrbanCoinABI.json' assert { type: 'json' };
import { ethers } from 'ethers';

const TOKEN_ADDRESS = "0x348a6101297a3E414144D35f7484FB21EcCD3E4E";
const RPC_URL = "https://rpc-amoy.polygon.technology";

// ✅ Register Controller
export const register = async (req, res) => {
  const { name, email, password, walletAddress, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      walletAddress: walletAddress || '',
      realBalance: '0',
    });

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error("🔴 Registration error:", err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        realBalance: user.realBalance,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// ✅ Get Logged-in User Profile (with real on-chain balance)
export const getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ error: 'User not found' });

    const user = await User.findById(req.user._id);

    if (user.walletAddress) {
      const realBalance = await fetchRealBalance(user.walletAddress);
      user.realBalance = realBalance;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      realBalance: user.realBalance,
    });
  } catch (err) {
    console.error("🔴 getMe error:", err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// ✅ Utility: Fetch real token balance from blockchain
export const fetchRealBalance = async (walletAddress) => {
  if (!walletAddress) return "0";
  try {
    // ethers v6 syntax
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(TOKEN_ADDRESS, UrbanCoinABI, provider);
    const raw = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();
    return ethers.formatUnits(raw, decimals); // v6 => ethers.formatUnits
  } catch (err) {
    console.error("🔴 Failed to fetch on-chain balance:", err.message);
    return "Error";
  }
};
