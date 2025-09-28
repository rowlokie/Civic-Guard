// testUrbanCoin.js
import { rewardCoins, getBalance } from './utils/urbanCoin.js';

const testReward = async () => {
  const address = "0x407794FbdBdF679ab017b35bFdd7D9061F9c54f9"; // Replace this with your real wallet address

  console.log("📤 Sending 10 URB...");
  const txHash = await rewardCoins(address, 10);
  console.log("✅ TX Confirmed:", txHash);

  const balance = await getBalance(address);
  console.log(`💰 New Balance of ${address}: ${balance} URB`);
};

testReward();
