require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('../server/routes/auth');
const cycleRoutes = require('../server/routes/cycles');
const journalRoutes = require('../server/routes/journal');
const communityRoutes = require('../server/routes/community');
const insightRoutes = require('../server/routes/insights');
const vaultRoutes = require('../server/routes/vault');
const askMaitriRoutes = require('../server/routes/askMaitri');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'https://maitri-healthcare.vercel.app',
        'http://localhost:5173',
    ],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/ask-maitri', askMaitriRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Maitri API is running', timestamp: new Date() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
};

module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
};
