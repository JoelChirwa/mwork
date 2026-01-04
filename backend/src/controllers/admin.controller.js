import User from '../models/User.js';
import Job from '../models/Job.js';
import Subscription from '../models/Subscription.js';
import AuditLog from '../models/AuditLog.js';
import { inngest } from '../config/inngest.js';

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

// Suspend Worker
export const suspendWorker = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'WORKER') {
      return res.status(400).json({ message: 'Can only suspend workers' });
    }

    user.isSuspended = true;
    user.suspensionReason = reason || 'Violation of platform policies';
    user.suspendedAt = new Date();
    user.suspendedBy = req.user._id;
    await user.save();

    // Trigger Inngest audit log
    await inngest.send({
      name: 'admin/worker.suspended',
      data: {
        userId: user._id.toString(),
        userName: user.fullName,
        adminId: req.user._id.toString(),
        adminEmail: req.user.email,
        reason,
        timestamp: new Date().toISOString()
      }
    });

    return res.status(200).json({ message: 'Worker suspended', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unsuspend Worker
export const unsuspendWorker = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isSuspended = false;
    user.suspensionReason = null;
    user.suspendedAt = null;
    user.suspendedBy = null;
    await user.save();

    // Trigger Inngest audit log
    await inngest.send({
      name: 'admin/worker.unsuspended',
      data: {
        userId: user._id.toString(),
        userName: user.fullName,
        adminId: req.user._id.toString(),
        adminEmail: req.user.email,
        timestamp: new Date().toISOString()
      }
    });

    return res.status(200).json({ message: 'Worker unsuspended', user });
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

// ----------------------- AUDIT LOGS & ANALYTICS -----------------------
export const getAuditLogs = async (req, res) => {
  try {
    const { eventType, limit = 50, page = 1 } = req.query;
    
    const query = eventType ? { eventType } : {};
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('targetUserId', 'fullName email role');

    const total = await AuditLog.countDocuments(query);

    return res.status(200).json({ 
      logs, 
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / limit) 
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    // Platform statistics
    const totalWorkers = await User.countDocuments({ role: 'WORKER' });
    const totalEmployers = await User.countDocuments({ role: 'EMPLOYER' });
    const suspendedWorkers = await User.countDocuments({ isSuspended: true });
    
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'OPEN' });
    const assignedJobs = await Job.countDocuments({ status: 'ASSIGNED' });
    const completedJobs = await Job.countDocuments({ status: 'COMPLETED' });
    
    const activeSubscriptions = await Subscription.countDocuments({ isActive: true });
    const totalSubscriptions = await Subscription.countDocuments();

    // Recent activity
    const recentSuspensions = await AuditLog.countDocuments({ 
      eventType: 'admin/worker.suspended',
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const recentJobsPosted = await Job.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    return res.status(200).json({
      users: {
        totalWorkers,
        totalEmployers,
        suspendedWorkers,
        totalUsers: totalWorkers + totalEmployers
      },
      jobs: {
        total: totalJobs,
        open: openJobs,
        assigned: assignedJobs,
        completed: completedJobs
      },
      subscriptions: {
        active: activeSubscriptions,
        total: totalSubscriptions,
        activeRate: totalSubscriptions > 0 ? ((activeSubscriptions / totalSubscriptions) * 100).toFixed(2) : 0
      },
      recentActivity: {
        suspensionsLast7Days: recentSuspensions,
        jobsPostedLast7Days: recentJobsPosted
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
