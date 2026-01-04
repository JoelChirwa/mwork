import User from '../models/User.js';

/**
 * Middleware to check if user is suspended
 * Should be used after requireAuth middleware
 */
export const checkSuspension = async (req, res, next) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ 
        message: 'Account suspended',
        reason: user.suspensionReason || 'Your account has been suspended. Contact support for details.',
        suspendedAt: user.suspendedAt
      });
    }

    next();
  } catch (error) {
    console.error('Suspension check error:', error);
    return res.status(500).json({ message: 'Failed to verify account status' });
  }
};
