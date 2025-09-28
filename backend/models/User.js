import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: {
    type: String,
    enum: ['reporter', 'admin'],
    default: 'reporter',
  },
  walletAddress: { type: String, required: true, unique: true },  // Public wallet address
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
  validations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }]
});

const User = mongoose.model('User', userSchema);
export default User;
