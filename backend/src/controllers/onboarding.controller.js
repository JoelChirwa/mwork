import User from '../models/User.js';
import { clerkClient } from '@clerk/express';

export const completeEmployerOnboarding = async (req, res) => {
  try {
    const clerkUserId = req.user.clerkUserId;
    const { phoneNumber, district, specificLocation } = req.body;

    console.log('Employer onboarding request:', { clerkUserId, phoneNumber, district, specificLocation });

    if (!phoneNumber || !district || !specificLocation) {
      return res.status(400).json({
        message: 'Missing required fields: phoneNumber, district, and specificLocation'
      });
    }

    // Get user details from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      // Create user if doesn't exist
      user = new User({
        clerkUserId,
        role: 'EMPLOYER',
        fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Employer',
        email: clerkUser.primaryEmailAddress?.emailAddress,
        profileImageUrl: clerkUser.imageUrl,
        phoneNumber,
        location: {
          district,
          area: specificLocation
        },
        profileCompleted: true,
        onboardingCompletedAt: new Date()
      });
    } else {
      // Update existing user
      user.role = 'EMPLOYER';
      user.fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || user.fullName || 'Employer';
      user.email = clerkUser.primaryEmailAddress?.emailAddress || user.email;
      user.profileImageUrl = clerkUser.imageUrl || user.profileImageUrl;
      user.phoneNumber = phoneNumber;
      user.location = {
        district,
        area: specificLocation
      };
      user.profileCompleted = true;
      user.onboardingCompletedAt = new Date();
    }

    await user.save();

    // Sync role to Clerk metadata
    try {
      await clerkClient.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          role: 'EMPLOYER',
          profileCompleted: true
        }
      });
    } catch (error) {
      console.error('Failed to update Clerk metadata:', error);
    }

    return res.status(200).json({
      message: 'Employer onboarding completed successfully',
      user: {
        id: user._id,
        role: user.role,
        phoneNumber: user.phoneNumber,
        district: user.location.district,
        specificLocation: user.location.area
      }
    });
  } catch (error) {
    console.error('Employer onboarding error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const completeWorkerOnboarding = async (req, res) => {
  try {
    const clerkUserId = req.user.clerkUserId;
    const { phoneNumber, skills, experience, district, specificLocation, bio } = req.body;

    console.log('Worker onboarding request:', { clerkUserId, phoneNumber, skills, district, specificLocation });

    if (!phoneNumber || !skills || !district || !specificLocation) {
      return res.status(400).json({
        message: 'Missing required fields: phoneNumber, skills, district, and specificLocation'
      });
    }

    // Check if phone number is already in use by another user
    const existingUser = await User.findOne({ phoneNumber, clerkUserId: { $ne: clerkUserId } });
    if (existingUser) {
      return res.status(400).json({
        message: 'Phone number is already in use by another account'
      });
    }

    // Get user details from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      // Create user if doesn't exist
      user = new User({
        clerkUserId,
        role: 'WORKER',
        fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Worker',
        email: clerkUser.primaryEmailAddress?.emailAddress,
        profileImageUrl: clerkUser.imageUrl,
        phoneNumber,
        skills: Array.isArray(skills) ? skills : [skills],
        experienceSummary: bio || '',
        location: {
          district,
          area: specificLocation
        },
        profileCompleted: true,
        onboardingCompletedAt: new Date()
      });
    } else {
      // Update existing user
      user.role = 'WORKER';
      user.fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || user.fullName || 'Worker';
      user.email = clerkUser.primaryEmailAddress?.emailAddress || user.email;
      user.profileImageUrl = clerkUser.imageUrl || user.profileImageUrl;
      user.phoneNumber = phoneNumber;
      user.skills = Array.isArray(skills) ? skills : [skills];
      user.experienceSummary = bio || '';
      user.location = {
        district,
        area: specificLocation
      };
      user.profileCompleted = true;
      user.onboardingCompletedAt = new Date();
    }

    await user.save();

    // Sync role to Clerk metadata
    try {
      await clerkClient.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          role: 'WORKER',
          profileCompleted: true
        }
      });
    } catch (error) {
      console.error('Failed to update Clerk metadata:', error);
    }

    return res.status(200).json({
      message: 'Worker onboarding completed successfully',
      user: {
        id: user._id,
        role: user.role,
        skills: user.skills,
        experienceSummary: user.experienceSummary,
        district: user.location.district,
        specificLocation: user.location.area
      }
    });
  } catch (error) {
    console.error('Worker onboarding error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const completeOnboarding = async (req, res) => {
  const clerkUserId = req.user.clerkUserId;

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

  // Sync role to Clerk metadata for RBAC
  try {
    await clerkClient.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: role,
        profileCompleted: true
      }
    });
  } catch (error) {
    console.error('Failed to update Clerk metadata:', error);
    // Continue even if Clerk update fails - we have it in DB
  }

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
