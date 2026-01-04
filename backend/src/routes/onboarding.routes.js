import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { completeOnboarding } from '../controllers/onboarding.controller.js';

const router = express.Router();

router.post('/complete', requireAuth, completeOnboarding);

export default router;
