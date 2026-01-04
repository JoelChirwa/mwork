import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
      district: { type: String, required: true },
      area: { type: String }
    },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'],
      default: 'OPEN'
    },
    assignedWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    proposals: [
      {
        workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        proposalText: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
