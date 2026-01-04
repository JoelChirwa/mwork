import { clerkClient } from '@clerk/express';

/**
 * Middleware to check if user has required role in Clerk metadata
 * @param {string[]} allowedRoles - Array of allowed roles (e.g., ['WORKER', 'EMPLOYER'])
 */
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { userId } = await req.auth();

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Get user from Clerk
      const user = await clerkClient.users.getUser(userId);
      
      // Check role in public metadata
      const userRole = user.publicMetadata?.role;

      if (!userRole) {
        return res.status(403).json({ 
          message: 'Role not set. Please complete onboarding first.' 
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: `Access denied. Required role(s): ${allowedRoles.join(', ')}` 
        });
      }

      // Attach role to request for downstream use
      req.user = {
        ...req.user,
        clerkUserId: userId,
        email: user.emailAddresses?.[0]?.emailAddress,
        role: userRole
      };

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({ message: 'Failed to verify user role' });
    }
  };
};

// Convenience middleware for specific roles
export const requireWorker = requireRole(['WORKER']);
export const requireEmployer = requireRole(['EMPLOYER']);
export const requireWorkerOrEmployer = requireRole(['WORKER', 'EMPLOYER']);
