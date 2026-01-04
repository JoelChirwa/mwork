import User from '../models/User.js';

export const requireWorker = async (req, res, next) => {
  const user = await User.findOne({ clerkUserId: req.clerkUserId });

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role !== 'WORKER') {
    return res.status(403).json({ message: 'Access denied: Not a worker' });
  }

  req.user = user;
  next();
};
