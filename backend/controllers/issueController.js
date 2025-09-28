// controllers/issueController.js
import cloudinary from '../utils/cloudinary.js';
import Issue from '../models/Issue.js';
import User from '../models/User.js';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { rewardCoins } from '../utils/urbanCoin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------------------------
// Helper: Parse Location
// ------------------------
const parseLocation = (locationStr) => {
  if (!locationStr) return { address: '' };
  const parts = locationStr.split(',').map((part) => part.trim());
  return {
    address: locationStr,
    street: parts[0] || '',
    area: parts[1] || '',
    landmark: parts[2] || '',
    suburb: parts[3] || '',
    city: parts[4] || 'Mumbai', // Default city
  };
};

// ------------------------
// Report a new Issue
// ------------------------
export const reportIssue = async (req, res) => {
  try {
    // ✅ Check authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const { description, location, type, title, priority } = req.body;

    if (!type) return res.status(400).json({ error: 'Issue type is required' });
    if (!description) return res.status(400).json({ error: 'Description is required' });

    // ✅ Handle optional image upload
    let imageUrl = null;
    if (req.file) {
      const filePath = req.file.path;
      try {
        const upload = await cloudinary.uploader.upload(filePath, {
          folder: 'civicguard/issues',
          public_id: `${Date.now()}-${type}`,
        });
        imageUrl = upload.secure_url;
      } catch (cloudErr) {
        console.error('❌ Cloudinary upload failed:', cloudErr);
        return res.status(500).json({ error: 'Image upload failed', details: cloudErr.message });
      } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    // ✅ Parse location safely
    let parsedLocation = {};
    if (location) {
      try {
        parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
      } catch {
        return res.status(400).json({ error: 'Invalid location format' });
      }
    }

    // ✅ Create and save issue
    const issue = new Issue({
      title: title || type,
      type,
      description,
      location: parsedLocation,
      confidence: 100,
      priority: priority || 'medium',
      imageUrl,
      reportedBy: req.user._id,
    });

    await issue.save();

    // ✅ Reward user off-chain
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.reports.push(issue._id);
    user.realBalance += 10;

    // ✅ On-chain reward (optional)
    if (user.walletAddress) {
      try {
        const txHash = await rewardCoins(user.walletAddress, 10);
        issue.rewardTxHash = txHash;
        await issue.save();
        console.log('✅ On-chain reward sent:', txHash);
      } catch (blockchainErr) {
        console.error('❌ Blockchain reward failed:', blockchainErr.message);
      }
    }

    await user.save();

    res.status(201).json({ msg: 'Issue reported successfully', issue });
  } catch (err) {
    console.error('❌ Issue reporting failed:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ------------------------
// Get all issues
// ------------------------
export const getAllIssues = async (req, res) => {
  try {
    const { regionType, regionName, type, status } = req.query;
    let filter = {};

    if (regionType && regionName) filter[`location.${regionType}`] = regionName;
    if (type && type !== 'all') filter.type = type;
    if (status && status !== 'all') filter.status = status;

    const issues = await Issue.find(filter).populate('reportedBy', 'name email');
    res.status(200).json(issues);
  } catch (err) {
    console.error('❌ Fetch all issues failed:', err);
    res.status(500).json({ error: 'Failed to fetch issues', details: err.message });
  }
};

// ------------------------
// Get available regions
// ------------------------
export const getRegions = async (req, res) => {
  try {
    const regions = await Issue.aggregate([
      {
        $group: {
          _id: null,
          cities: { $addToSet: '$location.city' },
          areas: { $addToSet: '$location.area' },
          suburbs: { $addToSet: '$location.suburb' },
          streets: { $addToSet: '$location.street' },
        },
      },
    ]);

    res.status(200).json(regions[0] || { cities: [], areas: [], suburbs: [], streets: [] });
  } catch (err) {
    console.error('❌ Get regions failed:', err);
    res.status(500).json({ error: 'Failed to fetch regions', details: err.message });
  }
};

// ------------------------
// Verify an issue
// ------------------------
export const verifyIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: 'Verified' },
      { new: true, runValidators: true }
    );

    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    // Reward acting user
    const actingUser = await User.findById(req.user._id);
    if (actingUser) {
      actingUser.validations.push(issue._id);
      actingUser.realBalance += 5;
      await actingUser.save();
    }

    res.json({ message: 'Issue verified', issue });
  } catch (err) {
    console.error('❌ Verify error:', err);
    res.status(500).json({ error: 'Verification failed', details: err.message });
  }
};

// ------------------------
// Resolve an issue
// ------------------------
export const resolveIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: 'Resolved' },
      { new: true, runValidators: true }
    );

    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    // Reward acting user
    const actingUser = await User.findById(req.user._id);
    if (actingUser) {
      actingUser.realBalance += 10;
      await actingUser.save();
    }

    res.json({ message: 'Issue resolved', issue });
  } catch (err) {
    console.error('❌ Resolve error:', err);
    res.status(500).json({ error: 'Resolve failed', details: err.message });
  }
};
