import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // hashed password
  role: { type: String, default: 'ADMIN' }
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);
