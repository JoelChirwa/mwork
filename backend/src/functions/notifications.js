import { inngest } from '../config/inngest.js';

export const proposalSubmitted = inngest.createFunction({ name: "Proposal Submitted" }, async ({ event }) => {
  const { workerName, employerId, jobTitle } = event.data;
  console.log(`Notification: ${workerName} submitted a proposal for "${jobTitle}" to Employer ${employerId}`);
});

export const workerAssigned = inngest.createFunction({ name: "Worker Assigned" }, async ({ event }) => {
  const { workerId, employerName, jobTitle } = event.data;
  console.log(`Notification: Worker ${workerId} assigned to job "${jobTitle}" by ${employerName}`);
});

export const jobCompleted = inngest.createFunction({ name: "Job Completed" }, async ({ event }) => {
  const { employerId, workerName, jobTitle } = event.data;
  console.log(`Notification: Worker ${workerName} completed job "${jobTitle}" for Employer ${employerId}`);
});
