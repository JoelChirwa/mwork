import Subscription from '../models/Subscription.js';

export const requireActiveSubscription = async (req, res, next) => {
  const workerId = req.user._id;
  const subscription = await Subscription.findOne({ workerId, isActive: true });

  if (!subscription || new Date() > subscription.expiresAt) {
    return res.status(403).json({ message: 'Subscription inactive. Please subscribe to send proposals.' });
  }
  next();
};

