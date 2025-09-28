import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import urbanCoinRoutes from './routes/urbanCoinRoutes.js';
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import userRoutes from './routes/userRoutes.js';
import couponsroutes from './routes/couponRoutes.js'
import locationRouter from "./routes/location.js"
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/issues', issueRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/urbancoin', urbanCoinRoutes);  // rewardReporter lives inside this
app.use('/api/coupon',couponsroutes);
app.use('/api', userRoutes);
app.use('/api/location',locationRouter);

// MongoDB Connect and Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('🚀 Server running on port', process.env.PORT || 5000);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
