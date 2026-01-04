import { clerkClient } from '@clerk/express';

export const requireAuth = async (req, res, next) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch user details from Clerk to get email
    const user = await clerkClient.users.getUser(userId);

    req.user = {
      clerkUserId: userId,
      email: user.emailAddresses?.[0]?.emailAddress,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

