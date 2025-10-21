import User from '../models/User.js';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path (since __dirname is not available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read ABI file safely
const abiPath = path.resolve(__dirname, '../abis/UrbanCoinABI.json');
const UrbanCoinABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const abi = UrbanCoinABI;

const RPC_URL = process.env.AMOY_RPC_URL;
const CONTRACT_ADDRESS = process.env.URBANCOIN_CONTRACT;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, UrbanCoinABI, provider);

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ walletAddress: { $exists: true, $ne: "" } });

    const balances = await Promise.all(
      users.map(async (user) => {
        try {
          const balance = await contract.balanceOf(user.walletAddress);
          return {
            name: user.name,
            email: user.email,
            walletAddress: user.walletAddress,
            realBalance: parseFloat(ethers.utils.formatUnits(balance, 18)),
          };
        } catch (err) {
          console.error(`Error fetching balance for ${user.walletAddress}:`, err.message);
          return null;
        }
      })
    );

    const filtered = balances.filter(u => u !== null);

    filtered.sort((a, b) => b.realBalance - a.realBalance);

    res.json(filtered.slice(0, 10));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
