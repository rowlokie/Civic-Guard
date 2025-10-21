import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load ABI JSON safely (must be an array)
const abiPath = path.join(__dirname, "../abis/UrbanCoinABI.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

if (!Array.isArray(abi)) throw new Error("❌ ABI is not an array!");

// ✅ Validate environment variables
if (!process.env.AMOY_RPC_URL) throw new Error("❌ AMOY_RPC_URL missing in .env");
if (!process.env.PRIVATE_KEY) throw new Error("❌ PRIVATE_KEY missing in .env");
if (!process.env.CONTRACT_ADDRESS) throw new Error("❌ CONTRACT_ADDRESS missing in .env");

// ✅ Setup provider & wallet (Ethers v5)
const provider = new ethers.providers.JsonRpcProvider(process.env.AMOY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ✅ Setup contract
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

// 🎁 Reward UrbanCoins to a user
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

// 🧾 Get on-chain UrbanCoin balance
export const getBalance = async (address) => {
  try {
    if (!ethers.utils.isAddress(address)) throw new Error("Invalid address");

    const balance = await contract.balanceOf(address);
    return ethers.utils.formatUnits(balance, 18); // BigNumber -> string
  } catch (error) {
    console.error("❌ Error fetching UrbanCoin balance:", error);
    throw error;
  }
};

// 💸 Transfer UrbanCoins from admin to user
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

// 🧍 Transfer tokens from a user (needs allowance)
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

export default contract;
