const DailyLog = require('../models/DailyLog');

// @route GET /api/journal
const getLogs = async (req, res) => {
    try {
        const { startDate, endDate, limit = 30 } = req.query;
        let query = { userId: req.user._id };
        if (startDate || endDate) {
            query.logDate = {};
            if (startDate) query.logDate.$gte = new Date(startDate);
            if (endDate) query.logDate.$lte = new Date(endDate);
        }
        const logs = await DailyLog.find(query).sort({ logDate: -1 }).limit(Number(limit));
        res.json({ success: true, logs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/journal
const createOrUpdateLog = async (req, res) => {
    try {
        const { logDate, flowIntensity, physicalSymptoms, emotionalSymptoms, energyLevel, moodWord, notes, cycleId } = req.body;

        if (!logDate) return res.status(400).json({ success: false, message: 'Log date is required' });

        const dateOnly = new Date(logDate);
        dateOnly.setHours(0, 0, 0, 0);

        let log = await DailyLog.findOne({ userId: req.user._id, logDate: dateOnly });

        if (log) {
            // Check 72-hour edit window
            const hoursSinceCreated = (Date.now() - log.createdAt) / (1000 * 60 * 60);
            if (hoursSinceCreated > 72) {
                return res.status(403).json({ success: false, message: 'Logs can only be edited within 72 hours of entry' });
            }

            if (flowIntensity !== undefined) log.flowIntensity = flowIntensity;
            if (physicalSymptoms !== undefined) log.physicalSymptoms = physicalSymptoms;
            if (emotionalSymptoms !== undefined) log.emotionalSymptoms = emotionalSymptoms;
            if (energyLevel !== undefined) log.energyLevel = energyLevel;
            if (moodWord !== undefined) log.moodWord = moodWord;
            if (notes !== undefined) log.notes = notes;
            if (cycleId !== undefined) log.cycleId = cycleId;
            await log.save();
        } else {
            log = await DailyLog.create({
                userId: req.user._id,
                logDate: dateOnly,
                cycleId: cycleId || null,
                flowIntensity: flowIntensity || 'none',
                physicalSymptoms: physicalSymptoms || [],
                emotionalSymptoms: emotionalSymptoms || [],
                energyLevel: energyLevel || 'medium',
                moodWord: moodWord || '',
                notes: notes || '',
            });
        }

        res.json({ success: true, log });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Log for this date already exists' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route GET /api/journal/patterns
const getPatterns = async (req, res) => {
    try {
        const logs = await DailyLog.find({ userId: req.user._id }).sort({ logDate: -1 }).limit(90);

        if (logs.length < 20) {
            return res.json({ success: true, patterns: [], message: 'Keep logging to discover your patterns!' });
        }

        const patterns = [];

        // Energy pattern
        const energyCounts = { low: 0, medium: 0, high: 0 };
        logs.forEach(l => energyCounts[l.energyLevel]++);
        const dominantEnergy = Object.entries(energyCounts).sort((a, b) => b[1] - a[1])[0];
        if (dominantEnergy[1] > logs.length * 0.4) {
            patterns.push({
                type: 'energy',
                emoji: '⚡',
                title: `Your energy tends to be ${dominantEnergy[0]}`,
                description: `${Math.round(dominantEnergy[1] / logs.length * 100)}% of your logged days show ${dominantEnergy[0]} energy. This is a natural part of your cycle rhythm.`,
            });
        }

        // Physical symptom frequency
        const physicalCounts = {};
        logs.forEach(l => l.physicalSymptoms.forEach(s => {
            physicalCounts[s] = (physicalCounts[s] || 0) + 1;
        }));
        const topPhysical = Object.entries(physicalCounts).sort((a, b) => b[1] - a[1]).slice(0, 2);
        topPhysical.forEach(([symptom, count]) => {
            if (count >= 3) {
                patterns.push({
                    type: 'physical',
                    emoji: '🌸',
                    title: `You often experience ${symptom.replace(/_/g, ' ')}`,
                    description: `Logged ${count} times in your recent history. This may be connected to your hormonal cycle patterns.`,
                });
            }
        });

        // Emotional pattern
        const emotionalCounts = {};
        logs.forEach(l => l.emotionalSymptoms.forEach(s => {
            emotionalCounts[s] = (emotionalCounts[s] || 0) + 1;
        }));
        const topEmotional = Object.entries(emotionalCounts).sort((a, b) => b[1] - a[1])[0];
        if (topEmotional && topEmotional[1] >= 3) {
            patterns.push({
                type: 'emotional',
                emoji: '💜',
                title: `You frequently feel ${topEmotional[0]}`,
                description: `Feeling ${topEmotional[0]} is common during certain phases of your cycle. Tracking helps you anticipate and prepare.`,
            });
        }

        res.json({ success: true, patterns });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route DELETE /api/journal/:id
const deleteLog = async (req, res) => {
    try {
        const log = await DailyLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!log) return res.status(404).json({ success: false, message: 'Log not found' });
        res.json({ success: true, message: 'Log deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getLogs, createOrUpdateLog, getPatterns, deleteLog };
