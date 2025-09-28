// routes/issue.js
import express from 'express';
import multer from 'multer';
import { 
  reportIssue, 
  getAllIssues, 
  verifyIssue, 
  resolveIssue, 
  getRegions 
} from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/report', protect, upload.single('image'), reportIssue);
router.get('/', getAllIssues); // Now supports query params: ?regionType=city&regionName=Mumbai&type=Pothole&status=Pending
router.get('/regions', getRegions); // New endpoint for getting available regions
router.put('/verify/:id', protect, verifyIssue);
router.put('/resolve/:id', protect, resolveIssue);

export default router;