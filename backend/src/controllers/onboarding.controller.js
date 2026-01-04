import User from '../models/User.js';

export const completeOnboarding = async (req, res) => {
  const clerkUserId = req.clerkUserId;

  const { role, phoneNumber, location } = req.body;

  if (!role || !phoneNumber || !location?.district) {
    return res.status(400).json({
      message: 'Missing required onboarding fields'
    });
  }

  if (!['EMPLOYER', 'WORKER'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json({ message: 'User record not found' });
  }

  if (user.profileCompleted) {
    return res.status(409).json({
      message: 'Onboarding already completed'
    });
  }

  // Enforce unique phone number
  const phoneExists = await User.findOne({
    phoneNumber,
    clerkUserId: { $ne: clerkUserId }
  });

  if (phoneExists) {
    return res.status(409).json({
      message: 'Phone number already in use'
    });
  }

  user.role = role;
  user.phoneNumber = phoneNumber;
  user.location = location;
  user.profileCompleted = true;
  user.onboardingCompletedAt = new Date();

  await user.save();

  return res.status(200).json({
    message: 'Onboarding completed successfully',
    user: {
      id: user._id,
      role: user.role,
      phoneNumber: user.phoneNumber,
      location: user.location
    }
  });
};
