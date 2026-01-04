import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: false },
    startedAt: { type: Date },
    expiresAt: { type: Date },
    transactionId: { type: String } // PayChangu reference
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
