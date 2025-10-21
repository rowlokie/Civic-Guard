// urbancoin.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dynamically import JSON
const UrbanCoinABI = await import("../contract/UrbanCoinABI.json", {
  assert: { type: "json" },
});

const abi = UrbanCoinABI.default;


// ✅ Setup provider and wallet (admin wallet that deployed contract)
const provider = new ethers.providers.JsonRpcProvider(process.env.AMOY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ✅ Setup contract instance
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  UrbanCoinABI.abi,
  wallet
);

// 🎁 Reward UrbanCoins to a user (from admin wallet)
export const rewardCoins = async (toAddress, amount) => {
  try {
    if (!ethers.utils.isAddress(toAddress)) throw new Error("Invalid recipient address");
    if (!Number.isInteger(amount) || amount <= 0) throw new Error("Invalid amount");

    const tx = await contract.reward(toAddress, amount);
    console.log("⛓️ Reward TX Hash:", tx.hash);

    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("❌ Error rewarding UrbanCoins:", error);
    throw error;
  }
};

// 🧾 Get on-chain UrbanCoin balance of a user
export const getBalance = async (address) => {
  try {
    if (!ethers.utils.isAddress(address)) throw new Error("Invalid address");

    const balance = await contract.balanceOf(address);
    return ethers.utils.formatUnits(balance, 18); // Convert BigNumber -> string
  } catch (error) {
    console.error("❌ Error fetching UrbanCoin balance:", error);
    throw error;
  }
};

// 💸 Transfer UrbanCoins directly from admin to user
export const transferCoins = async (toAddress, amount) => {
  try {
    if (!ethers.utils.isAddress(toAddress)) throw new Error("Invalid recipient address");
    if (amount <= 0) throw new Error("Invalid amount");

    const tx = await contract.transfer(
      toAddress,
      ethers.utils.parseUnits(amount.toString(), 18)
    );

    console.log("💸 Transfer TX Hash:", tx.hash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("❌ Error transferring UrbanCoins:", error);
    throw error;
  }
};

// 🧍 Transfer tokens from a user (needs allowance set first)
export const transferFromUser = async (fromAddress, toAddress, amount) => {
  try {
    if (!ethers.utils.isAddress(fromAddress) || !ethers.utils.isAddress(toAddress)) {
      throw new Error("Invalid address");
    }

    const tx = await contract.transferFrom(
      fromAddress,
      toAddress,
      ethers.utils.parseUnits(amount.toString(), 18)
    );

    console.log("🔄 transferFrom TX Hash:", tx.hash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("❌ Error in transferFromUser:", error);
    throw error;
  }
};
