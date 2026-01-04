import { Inngest } from 'inngest';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export const inngest = new Inngest({
  id: 'mwork',
  name: 'MworK'
});

export const syncClerkUser = inngest.createFunction(
  { id: 'sync-clerk-user' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const clerkUser = event.data;

    const email = clerkUser.email_addresses?.[0]?.email_address;

    if (!email) {
      console.warn('Clerk user has no email, skipping sync');
      return;
    }

    // Defensive: prevent duplicates
    const existingUser = await User.findOne({
      clerkUserId: clerkUser.id
    });

    if (existingUser) {
      return;
    }

    await User.create({
      clerkUserId: clerkUser.id,
      role: 'WORKER', // default role, updated later during onboarding
      fullName:
        `${clerkUser.first_name ?? ''} ${clerkUser.last_name ?? ''}`.trim(),
      email,
      phoneNumber: 'PENDING', // placeholder, must be updated on onboarding
      location: {
        district: 'UNKNOWN'
      },
      profileCompleted: false
    });
  }
);

export const deleteClerkUser = inngest.createFunction(
  { id: 'delete-clerk-user' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const clerkUser = event.data;

    if (!clerkUser.id) {
      console.warn('Clerk user has no ID, skipping deletion');
      return;
    }

    const deletedUser = await User.findOneAndDelete({
      clerkUserId: clerkUser.id
    });

    if (deletedUser) {
      console.log(`Successfully deleted user: ${deletedUser.email}`);
      
      // Log deletion
      await AuditLog.create({
        eventType: 'user/deleted',
        actorId: 'system',
        targetUserId: deletedUser._id,
        metadata: { email: deletedUser.email, clerkUserId: clerkUser.id }
      });
    } else {
      console.warn(`User with Clerk ID ${clerkUser.id} not found in database`);
    }
  }
);

// Audit Log Function - Logs all admin and critical actions
export const logAuditEvent = inngest.createFunction(
  { id: 'log-audit-event' },
  { event: 'admin/*' },
  async ({ event }) => {
    try {
      await AuditLog.create({
        eventType: event.name,
        actorId: event.data.adminId || 'system',
        actorEmail: event.data.adminEmail,
        targetUserId: event.data.userId,
        metadata: event.data,
      });
      console.log(`Audit log created for event: ${event.name}`);
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }
);

// Analytics Function - Track job lifecycle events
export const trackJobAnalytics = inngest.createFunction(
  { id: 'track-job-analytics' },
  { event: 'job/*' },
  async ({ event }) => {
    try {
      await AuditLog.create({
        eventType: event.name,
        actorId: event.data.employerId || event.data.workerId,
        targetUserId: event.data.workerId || event.data.employerId,
        metadata: {
          jobId: event.data.jobId,
          jobTitle: event.data.jobTitle,
          ...event.data
        },
      });
      console.log(`Job analytics tracked: ${event.name}`);
    } catch (error) {
      console.error('Failed to track job analytics:', error);
    }
  }
);



