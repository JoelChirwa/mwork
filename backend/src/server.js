import express from 'express'
import path from 'path';
import { clerkMiddleware } from '@clerk/express'
import { ENV } from './config/env.js';
import connectDB from './config/db.js';
import { serve } from 'inngest/express';
import cors from 'cors';
import { inngest, syncClerkUser, deleteClerkUser, logAuditEvent, trackJobAnalytics } from './config/inngest.js';
import onboardingRoutes from './routes/onboarding.routes.js';
import employerProfileRoutes from './routes/employerProfile.routes.js';
import jobRoutes from './routes/job.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
app.use(cors());

const __dirname = path.resolve();

// Middleware
app.use(clerkMiddleware()); // adds auth object under the request
app.use(express.json());
app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions: [syncClerkUser, deleteClerkUser, logAuditEvent, trackJobAnalytics]
  })
);

// Routes
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/employer', employerProfileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

// making app ready for deployment
if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../admin/dist')));

    app.get("/{*any}"), (req, res) => { 
        res.sendFile(path.resolve(__dirname, '../admin', '/dist', 'index.html'));
    }
}

// Database connection
connectDB();

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
    })
