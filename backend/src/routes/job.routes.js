import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireWorker } from '../middleware/requireWorker.js';
import { requireEmployer } from '../middleware/requireEmployer.js';
import { requireActiveSubscription } from '../middleware/requireActiveSubscription.js';
import * as jobController from '../controllers/job.controller.js';

const router = express.Router();

// Employer routes
router.post('/create', requireAuth, requireEmployer, jobController.createJob);
router.get('/my-jobs', requireAuth, requireEmployer, jobController.getEmployerJobs);
router.post('/assign', requireAuth, requireEmployer, jobController.assignWorker);

// Worker routes
router.get('/open', requireAuth, requireWorker, jobController.getOpenJobs);
router.post('/proposal', requireAuth, requireWorker, requireActiveSubscription, jobController.submitProposal);
router.get('/assigned', requireAuth, requireWorker, jobController.getAssignedJobs);
router.post('/complete', requireAuth, requireWorker, jobController.completeJob);

// Common routes
router.get('/proposals/:jobId', requireAuth, requireEmployer, jobController.getJobProposals);


export default router;

