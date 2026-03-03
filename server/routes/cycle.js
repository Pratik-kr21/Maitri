const express = require('express');
const { protect } = require('../middleware/auth');
const Cycle = require('../models/Cycle');
const DailyLog = require('../models/DailyLog');
const router = express.Router();

// Get cycle history
router.get('/', protect, async (req, res) => {
    try {
        const cycles = await Cycle.find({ user: req.user.id }).sort({ startDate: -1 });
        res.json(cycles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start a new cycle
router.post('/start', protect, async (req, res) => {
    try {
        const { startDate } = req.body;
        const cycle = await Cycle.create({
            user: req.user.id,
            startDate
        });
        res.status(201).json(cycle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create daily log
router.post('/log', protect, async (req, res) => {
    try {
        const { cycleId, logDate, flowIntensity, symptoms, energyLevel, moodWord, notes } = req.body;

        const log = await DailyLog.create({
            user: req.user.id,
            cycleId,
            logDate,
            flowIntensity,
            symptoms,
            energyLevel,
            moodWord,
            notes
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get daily logs
router.get('/logs', protect, async (req, res) => {
    try {
        const logs = await DailyLog.find({ user: req.user.id }).sort({ logDate: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
