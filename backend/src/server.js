import express from 'express'
import path from 'path';
import { clerkMiddleware } from '@clerk/express'
import { ENV } from './config/env.js';
import connectDB from './config/db.js';

const app = express();

const __dirname = path.resolve();

// Middleware
app.use(clerkMiddleware()); // adds auth object under the request
app.use(express.json());

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
