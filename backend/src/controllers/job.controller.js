import Job from '../models/Job.js';
import { inngest } from '../config/inngest.js';

// ------------------------- EMPLOYER CONTROLLERS -------------------------

// Create a new Job
export const createJob = async (req, res) => {
  try {
    const { title, description, location, category } = req.body;
    const employerId = req.user._id;

    const job = await Job.create({ title, description, location, category, employerId });
    return res.status(201).json({ message: 'Job posted successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// View all Jobs posted by Employer
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user._id })
      .populate('assignedWorkerId', 'fullName skills profileImageUrl')
      .populate('proposals.workerId', 'fullName skills profileImageUrl');
    return res.status(200).json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign Worker to Job
export const assignWorker = async (req, res) => {
  try {
    const { jobId, workerId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    job.assignedWorkerId = workerId;
    job.status = 'ASSIGNED';
    await job.save();

    // Trigger Inngest notification
    await inngest.send({
      name: 'Worker Assigned',
      data: { workerId, employerName: req.user.fullName, jobTitle: job.title }
    });

    return res.status(200).json({ message: 'Worker assigned successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ------------------------- WORKER CONTROLLERS -------------------------

// Get Open Jobs
export const getOpenJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'OPEN' })
      .populate('employerId', 'fullName companyName profileImageUrl location');
    return res.status(200).json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit Proposal
export const submitProposal = async (req, res) => {
  try {
    const { jobId, proposalText } = req.body;
    const workerId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'OPEN') return res.status(400).json({ message: 'Job not available' });

    if (job.proposals.find(p => p.workerId.toString() === workerId.toString())) {
      return res.status(409).json({ message: 'Proposal already submitted' });
    }

    job.proposals.push({ workerId, proposalText });
    await job.save();

    // Trigger Inngest notification
    await inngest.send({
      name: 'Proposal Submitted',
      data: { workerName: req.user.fullName, employerId: job.employerId, jobTitle: job.title }
    });

    return res.status(200).json({ message: 'Proposal submitted successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Jobs assigned to Worker
export const getAssignedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ assignedWorkerId: req.user._id })
      .populate('employerId', 'fullName companyName profileImageUrl location');
    return res.status(200).json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark Job as Completed
export const completeJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);

    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.assignedWorkerId?.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    job.status = 'COMPLETED';
    await job.save();

    // Trigger Inngest notification
    await inngest.send({
      name: 'Job Completed',
      data: { employerId: job.employerId, workerName: req.user.fullName, jobTitle: job.title }
    });

    return res.status(200).json({ message: 'Job marked as completed', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Proposals for a Job (Employer only)
export const getJobProposals = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId)
      .populate('proposals.workerId', 'fullName skills profileImageUrl')
      .populate('assignedWorkerId', 'fullName skills profileImageUrl');

    if (!job || job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized or Job not found' });
    }

    return res.status(200).json({ proposals: job.proposals, assignedWorker: job.assignedWorkerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

