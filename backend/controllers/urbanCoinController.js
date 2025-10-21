import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Safely read the ABI
const abiPath = path.resolve(__dirname, "../abis/UrbanCoinABI.json");
const UrbanCoinABI = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const abi = UrbanCoinABI;

// setup provider & signer
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, UrbanCoinABI, wallet);

export const rewardReporter = async (req, res) => {
  try {
    const { reporter, amount } = req.body;

    if (!reporter || !amount) {
      return res.status(400).json({ error: "Reporter and amount required" });
    }

    // call smart contract function (reward)
    const tx = await contract.reward(reporter, amount);
    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash,
      message: `✅ Rewarded ${amount} URB to ${reporter}`,
    });
  } catch (err) {
    console.error("❌ Reward failed:", err);
    res.status(500).json({ error: "Reward transaction failed", details: err.message });
  }
};
