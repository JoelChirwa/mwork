import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireEmployer } from '../middleware/requireEmployer.js';
import { updateEmployerProfile, getEmployerProfile } from '../controllers/employerProfile.controller.js';

const router = express.Router();

// Get own profile
router.get('/me', requireAuth, requireEmployer, getEmployerProfile);

// Update profile
router.put('/update', requireAuth, requireEmployer, updateEmployerProfile);

export default router;
