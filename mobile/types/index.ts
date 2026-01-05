/* ===========================
   GLOBAL / SHARED TYPES
   =========================== */

export type UserRole = 'EMPLOYER' | 'WORKER' | 'ADMIN';

export type ID = string;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/* ===========================
   USER & PROFILE
   =========================== */

export interface BaseUser {
  _id: ID;
  clerkUserId: string;
  role: UserRole;
  phoneNumber: string;
  isOnboarded: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerProfile extends BaseUser {
  role: 'EMPLOYER';
  companyName?: string;
  location: string;
}

export interface WorkerProfile extends BaseUser {
  role: 'WORKER';
  fullName: string;
  skills: string[];
  location: string;
  bio?: string;
  isVerified: boolean;
}

/* ===========================
   SUBSCRIPTION
   =========================== */

export interface WorkerSubscription {
  isActive: boolean;
  startedAt?: string;
  expiresAt?: string;
}

/* ===========================
   JOBS
   =========================== */

export type JobStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Job {
  _id: ID;
  employerId: ID;
  title: string;
  description: string;
  category: string;
  location: string;
  status: JobStatus;
  assignedWorkerId?: ID;
  createdAt: string;
  updatedAt: string;
}

/* ===========================
   PROPOSALS
   =========================== */

export type ProposalStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface Proposal {
  _id: ID;
  jobId: ID;
  workerId: ID;
  message: string;
  status: ProposalStatus;
  createdAt: string;
}

/* ===========================
   PAYMENTS (PayChangu)
   =========================== */

export interface PayChanguCheckoutResponse {
  checkoutUrl: string;
  reference: string;
}

export interface SubscriptionPlan {
  id: ID;
  name: string;
  price: number;
  durationDays: number;
}

/* ===========================
   ADMIN / AUDIT
   =========================== */

export interface AuditLog {
  _id: ID;
  actorId: ID;
  action: string;
  targetId?: ID;
  metadata?: Record<string, any>;
  createdAt: string;
}

/* ===========================
   NOTIFICATIONS
   =========================== */

export interface AppNotification {
  _id: ID;
  userId: ID;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

/* ===========================
   UTILITY
   =========================== */

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
