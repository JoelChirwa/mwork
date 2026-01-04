import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ['EMPLOYER', 'WORKER'], required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    profileImageUrl: { type: String, default: null },
    phoneNumber: { type: String, required: true, unique: true, index: true },
    location: { district: { type: String, required: true }, area: { type: String } },
    profileCompleted: { type: Boolean, default: false },
    onboardingCompletedAt: { type: Date },

    // Account status
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String, default: null },
    suspendedAt: { type: Date, default: null },
    suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Worker-specific fields
    skills: { type: [String], default: [] },
    experienceSummary: { type: String, default: '' },
    availability: { type: [String], default: [] },
    portfolioUrls: { type: [String], default: [] },

    // Employer-specific fields
    companyName: { type: String, default: '' },
    description: { type: String, default: '' },
    frequentHiringAreas: { type: [String], default: [] },
    websiteUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
