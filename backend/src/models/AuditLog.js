import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    eventType: { 
      type: String, 
      required: true,
      index: true,
      enum: [
        'admin/worker.suspended',
        'admin/worker.unsuspended',
        'job/worker.assigned',
        'job/proposal.rejected',
        'job/cancelled',
        'job/completed',
        'subscription/created',
        'subscription/expired',
        'user/created',
        'user/deleted'
      ]
    },
    actorId: { type: String }, // Clerk user ID or system
    actorEmail: { type: String },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Index for efficient querying
auditLogSchema.index({ eventType: 1, createdAt: -1 });
auditLogSchema.index({ actorId: 1, createdAt: -1 });
auditLogSchema.index({ targetUserId: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
