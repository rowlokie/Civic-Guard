import express from 'express';
import { rewardCoins, getBalance } from '../utils/urbanCoin.js';

const router = express.Router();

// 🧾 GET balance
router.get('/balance/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const balance = await getBalance(address);
    res.json({ address, balance });
  } catch (err) {
    console.error('❌ Failed to get balance:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// 💸 POST reward
router.post('/reward', async (req, res) => {
  try {
    const { toAddress, amount } = req.body;
    const txHash = await rewardCoins(toAddress, amount);
    res.json({ message: 'Rewarded successfully', txHash });
  } catch (err) {
    console.error('❌ Failed to reward:', err);
    res.status(500).json({ error: 'Reward transaction failed' });
  }
});

export default router;
