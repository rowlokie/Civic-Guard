import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  description: {
    type: String,
    default: "Reward coupon"
  },
  discount: {
    type: Number,
    required: true,
    min: 1
  },
  maxUses: {
    type: Number,
    default: 1
  },
  claimedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  expiryDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
