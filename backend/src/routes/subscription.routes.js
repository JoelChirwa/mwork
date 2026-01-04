import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireWorker } from '../middleware/requireWorker.js';
import * as subscriptionController from '../controllers/subscription.controller.js';

const router = express.Router();

// Create PayChangu payment session
router.post('/pay', requireAuth, requireWorker, subscriptionController.createSubscriptionPayment);

// Verify payment and activate subscription
router.post('/verify', requireAuth, requireWorker, subscriptionController.verifySubscription);

// Get current subscription status
router.get('/status', requireAuth, requireWorker, subscriptionController.getSubscriptionStatus);

export default router;

