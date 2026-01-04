import User from '../models/User.js';

export const requireEmployer = async (req, res, next) => {
  const user = await User.findOne({ clerkUserId: req.clerkUserId });

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role !== 'EMPLOYER') {
    return res.status(403).json({ message: 'Access denied: Not an employer' });
  }

  req.user = user;
  next();
};
