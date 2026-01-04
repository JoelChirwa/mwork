import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

// User management
router.get('/workers', requireAuth, requireAdmin, adminController.getAllWorkers);
router.get('/employers', requireAuth, requireAdmin, adminController.getAllEmployers);

// Job management
router.get('/jobs', requireAuth, requireAdmin, adminController.getAllJobs);

// Subscription management
router.get('/subscriptions', requireAuth, requireAdmin, adminController.getAllSubscriptions);
router.patch('/subscriptions/deactivate/:subscriptionId', requireAuth, requireAdmin, adminController.deactivateSubscription);

export default router;
