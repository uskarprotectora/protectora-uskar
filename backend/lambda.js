const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const petsRouter = require('./routes/petsLambda');
const adoptionsRouter = require('./routes/adoptionsLambda');

const app = express();

// MongoDB connection (cached for Lambda)
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Connect to DB before handling requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// API Routes
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

module.exports.handler = serverless(app, {
    binary: ['image/*', 'video/*', 'multipart/form-data']
});
