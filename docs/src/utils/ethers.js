import { ethers } from "ethers";
import UrbanCoinABI from "../contract/UrbanCoinABI.json"; // copy ABI to frontend

const CONTRACT_ADDRESS = "0xE7f61728e28E0C3a8679DC2D31056E05186a8699"; // set in .env

// ✅ Get provider & signer from MetaMask
export const getProviderAndSigner = async () => {
  if (!window.ethereum) throw new Error("MetaMask not detected");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // prompt user

  const signer = provider.getSigner();
  return { provider, signer };
};

// ✅ Get contract instance (connected with user wallet)
export const getContract = async () => {
  const { signer } = await getProviderAndSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, UrbanCoinABI.abi, signer);
};
