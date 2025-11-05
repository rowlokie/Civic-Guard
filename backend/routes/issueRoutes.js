// routes/issue.js
import express from 'express';
import multer from 'multer';
import { 
  reportIssue, 
  getAllIssues, 
  verifyIssue, 
  resolveIssue, 
  getRegions,
  deleteIssue // 🆕 import delete controller
} from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/report', protect, upload.single('image'), reportIssue);
router.get('/', getAllIssues); // supports query params
router.get('/regions', getRegions);
router.put('/verify/:id', protect, verifyIssue);
router.put('/resolve/:id', protect, resolveIssue);

// 🆕 Delete issue (admin only)
router.delete('/:id', protect, deleteIssue);

export default router;
