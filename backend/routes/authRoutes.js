import express from 'express';
import { getMe ,register, login } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js'; // ✅ Import

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // ✅ Use the controller

export default router;
