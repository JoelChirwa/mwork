import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/workers', requireAuth, requireAdmin, adminController.getAllWorkers);
router.get('/employers', requireAuth, requireAdmin, adminController.getAllEmployers);
router.get('/jobs', requireAuth, requireAdmin, adminController.getAllJobs);
router.get('/subscriptions', requireAuth, requireAdmin, adminController.getAllSubscriptions);

// Worker suspension
router.post('/suspend/:userId', requireAuth, requireAdmin, adminController.suspendWorker);
router.post('/unsuspend/:userId', requireAuth, requireAdmin, adminController.unsuspendWorker);

// Audit logs & Analytics
router.get('/audit-logs', requireAuth, requireAdmin, adminController.getAuditLogs);
router.get('/analytics', requireAuth, requireAdmin, adminController.getAnalytics);

export default router;

