import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ABI safely
const abiPath = path.join(__dirname, '../abis/UrbanCoinABI.json');
const UrbanCoinABI = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
if (!Array.isArray(UrbanCoinABI)) throw new Error('❌ ABI is not an array!');

const TOKEN_ADDRESS = process.env.URBANCOIN_CONTRACT || "0x348a6101297a3E414144D35f7484FB21EcCD3E4E";
const RPC_URL = process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";

// ✅ Utility: Fetch real token balance from blockchain
export const fetchRealBalance = async (walletAddress) => {
  if (!walletAddress) return "0";
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL); // v5 syntax
    const contract = new ethers.Contract(TOKEN_ADDRESS, UrbanCoinABI, provider);
    const raw = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();
    return ethers.utils.formatUnits(raw, decimals); // v5 syntax
  } catch (err) {
    console.error("🔴 Failed to fetch on-chain balance:", err.message);
    return "Error";
  }
};

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
    res.status(500).json({ error: 'Login failed', details: err.message });
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
