import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load ABI safely (must be an array)
const abiPath = path.join(__dirname, "../abis/UrbanCoinABI.json");
const UrbanCoinABI = JSON.parse(fs.readFileSync(abiPath, "utf8"));

if (!Array.isArray(UrbanCoinABI)) {
  throw new Error("❌ ABI is not an array!");
}

// ✅ Setup provider & wallet (Ethers v5)
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ✅ Contract instance
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, UrbanCoinABI, wallet);

// 🎁 Reward reporter function
export const rewardReporter = async (req, res) => {
  try {
    const { reporter, amount } = req.body;

    if (!reporter || !amount) {
      return res.status(400).json({ error: "Reporter and amount required" });
    }

    if (!ethers.utils.isAddress(reporter)) {
      return res.status(400).json({ error: "Invalid reporter address" });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    // Call smart contract reward function
    const tx = await contract.reward(reporter, amount);
    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash,
      message: `✅ Rewarded ${amount} URB to ${reporter}`,
    });
  } catch (err) {
    console.error("❌ Reward failed:", err);
    res.status(500).json({
      error: "Reward transaction failed",
      details: err.message,
    });
  }
};
