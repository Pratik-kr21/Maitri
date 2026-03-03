const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const cycleRoutes = require('./routes/cycle');
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/community', require('./routes/community'));

app.get('/', (req, res) => {
    res.send('Maitri API API Server');
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maitri';

let isConnected;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }
    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

// Vercel execution starts here, ensure connection is made
connectDB();

// Provide the app to Vercel
module.exports = app;

// Also listen if not deployed on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
