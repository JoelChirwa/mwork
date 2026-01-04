import User from '../models/User.js';
import Job from '../models/Job.js';
import Subscription from '../models/Subscription.js';

// ----------------------- USER MANAGEMENT -----------------------
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'WORKER' }).select('-passwordHash');
    return res.status(200).json({ workers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: 'EMPLOYER' }).select('-passwordHash');
    return res.status(200).json({ employers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------- JOB MANAGEMENT -----------------------
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('employerId', 'fullName companyName profileImageUrl')
      .populate('assignedWorkerId', 'fullName skills profileImageUrl');
    return res.status(200).json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------- SUBSCRIPTION MANAGEMENT -----------------------
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('workerId', 'fullName email phoneNumber profileImageUrl');
    return res.status(200).json({ subscriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: Deactivate Worker subscription manually
export const deactivateSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(subscriptionId, { isActive: false }, { new: true });
    return res.status(200).json({ message: 'Subscription deactivated', subscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
