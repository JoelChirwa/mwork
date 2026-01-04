import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    role: {
      type: String,
      enum: ['EMPLOYER', 'WORKER'],
      required: true
    },

    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    
    profileImageUrl: {
      type: String,
      default: null
    },


    location: {
      district: { type: String, required: true },
      area: { type: String }
    },

    profileCompleted: {
      type: Boolean,
      default: false
    },

    onboardingCompletedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
