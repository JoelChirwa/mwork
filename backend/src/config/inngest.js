import { Inngest } from 'inngest';
import User from '../models/User.js';

export const inngest = new Inngest({
  id: 'mwork-backend',
  name: 'MworK Backend'
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

