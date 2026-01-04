import { ENV } from '../config/env.js';

export const requireAdmin = (req, res, next) => {
  const adminEmail = ENV.ADMIN_EMAIL;

  if (!req.user || req.user.email !== adminEmail) {
    console.log('Admin check failed:', { 
      userEmail: req.user?.email, 
      adminEmail,
      match: req.user?.email === adminEmail 
    });
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};
