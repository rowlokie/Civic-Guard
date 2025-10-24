import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import urbanCoinRoutes from './routes/urbanCoinRoutes.js';
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import userRoutes from './routes/userRoutes.js';
import couponsroutes from './routes/couponRoutes.js';
import locationRouter from './routes/location.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route (for Render test)
app.get("/", (req, res) => {
  res.send("🌍 CivicGuard Backend is running successfully on Render!");
});

// Routes
app.use('/api/issues', issueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/urbancoin', urbanCoinRoutes);
app.use('/api/coupon', couponsroutes);
app.use('/api', userRoutes);
app.use('/api/location', locationRouter);

// ✅ MongoDB Connect and Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000; // ✅ Required for Render
    app.listen(PORT, "0.0.0.0", () => {     // ✅ Ensure Render can detect port
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
