// models/Issue.js
import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Issue type is required'],
      enum: ['Pothole', 'Garbage', 'Broken Infrastructure', 'Sewage', 'Drains', 'Other'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    location: {
      address: { type: String, required: true },
      street: String,
      area: String,
      landmark: String,
      suburb: String,
      city: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    imageUrl: {
      type: String,
      validate: {
        validator: function(v) {
          return v ? /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(v) : true;
        },
        message: 'Image URL must be a valid image link'
      }
    },
    confidence: {
      type: Number,
      min: [0, 'Confidence cannot be less than 0'],
      max: [100, 'Confidence cannot exceed 100'],
      default: 0
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Resolved'],
      default: 'Pending',
    },
    rewardTxHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Issue', issueSchema);