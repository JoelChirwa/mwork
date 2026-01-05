import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { 
  completeOnboarding, 
  completeEmployerOnboarding, 
  completeWorkerOnboarding 
} from '../controllers/onboarding.controller.js';

const router = express.Router();

router.post('/complete', requireAuth, completeOnboarding);
router.post('/employer', requireAuth, completeEmployerOnboarding);
router.post('/worker', requireAuth, completeWorkerOnboarding);

export default router;
