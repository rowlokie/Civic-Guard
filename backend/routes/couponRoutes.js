import express from 'express';
import Coupon from '../models/coupons.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js'; // your middleware
import { rewardCoins } from '../utils/urbanCoin.js'; // optional reward function

const router = express.Router();

// Get all coupons (available for logged-in users)
router.get('/', protect, async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: now } }
      ]
    });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: create new coupon
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { code, discount, maxUses, expiryDate, description } = req.body;
    const newCoupon = new Coupon({ code, discount, maxUses, expiryDate, description });
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User: claim coupon
router.post('/claim/:id', protect, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    const now = new Date();
    if (coupon.expiryDate && coupon.expiryDate < now)
      return res.status(400).json({ error: 'Coupon expired' });

    if (coupon.claimedBy.includes(req.user._id))
      return res.status(400).json({ error: 'Already claimed' });

    if (coupon.claimedBy.length >= coupon.maxUses)
      return res.status(400).json({ error: 'Coupon fully claimed' });

    coupon.claimedBy.push(req.user._id);
    await coupon.save();

    // Optional: reward UrbanCoin
    // await rewardCoins(req.user.walletAddress, 10);

    res.json({ message: 'Coupon claimed!', coupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
