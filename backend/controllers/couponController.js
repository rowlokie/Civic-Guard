import Coupon from "../models/coupons.js";
import User from "../models/User.js";

// GET /api/coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/coupons (admin only)
export const addCoupon = async (req, res) => {
  try {
    const { title, description, coinsRequired } = req.body;

    const coupon = new Coupon({ title, description, coinsRequired });
    await coupon.save();

    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/coupons/redeem/:id
export const redeemCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    if (user.coins < coupon.coinsRequired) {
      return res.status(400).json({ message: "Not enough coins" });
    }

    // Deduct coins
    user.coins -= coupon.coinsRequired;
    await user.save();

    res.json({ message: "Coupon redeemed successfully", coupon });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
