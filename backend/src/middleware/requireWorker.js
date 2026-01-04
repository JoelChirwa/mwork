import { clerkClient } from '@clerk/express';
import User from '../models/User.js';

export const requireWorker = async (req, res, next) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check role in Clerk metadata
    const clerkUser = await clerkClient.users.getUser(userId);
    const userRole = clerkUser.publicMetadata?.role;

    if (!userRole) {
      return res.status(403).json({ 
        message: 'Role not set. Please complete onboarding first.' 
      });
    }

    if (userRole !== 'WORKER') {
      return res.status(403).json({ 
        message: 'Access denied: Worker role required' 
      });
    }

    // Fetch full user from database for additional data
    const user = await User.findOne({ clerkUserId: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Worker role check error:', error);
    return res.status(500).json({ message: 'Failed to verify worker role' });
  }
};
