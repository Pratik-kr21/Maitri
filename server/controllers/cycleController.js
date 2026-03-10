const Cycle = require('../models/Cycle');
const DailyLog = require('../models/DailyLog');

// @route GET /api/cycles
const getCycles = async (req, res) => {
    try {
        const cycles = await Cycle.find({ userId: req.user._id }).sort({ startDate: -1 });
        res.json({ success: true, cycles });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/cycles
const createCycle = async (req, res) => {
    try {
        const { startDate, notes } = req.body;
        if (!startDate) return res.status(400).json({ success: false, message: 'Start date is required' });

        // End any open cycles
        await Cycle.updateMany(
            { userId: req.user._id, endDate: null },
            { endDate: new Date(startDate) }
        );

        const cycle = await Cycle.create({ userId: req.user._id, startDate, notes });
        res.status(201).json({ success: true, cycle });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route PUT /api/cycles/:id
const updateCycle = async (req, res) => {
    try {
        const { endDate, notes } = req.body;
        const cycle = await Cycle.findOne({ _id: req.params.id, userId: req.user._id });
        if (!cycle) return res.status(404).json({ success: false, message: 'Cycle not found' });

        if (endDate) cycle.endDate = endDate;
        if (notes !== undefined) cycle.notes = notes;
        await cycle.save();

        res.json({ success: true, cycle });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route GET /api/cycles/current-phase
const getCurrentPhase = async (req, res) => {
    try {
        const latestCycle = await Cycle.findOne({ userId: req.user._id }).sort({ startDate: -1 });

        if (!latestCycle) {
            return res.json({
                success: true,
                phase: null,
                phaseDay: 0,
                cycleDay: 0,
                prediction: null,
                confidence: 'none',
            });
        }

        const today = new Date();
        const cycleStart = new Date(latestCycle.startDate);
        const daysSinceStart = Math.floor((today - cycleStart) / (1000 * 60 * 60 * 24));

        // Calculate average cycle length from history
        const allCycles = await Cycle.find({ userId: req.user._id, endDate: { $ne: null } }).sort({ startDate: -1 });
        const cycleCount = allCycles.length;

        let avgCycleLength = 28; // default
        let avgPeriodLength = 5;
        if (cycleCount >= 2) {
            const lengths = [];
            for (let i = 0; i < allCycles.length - 1; i++) {
                const len = Math.round(
                    (new Date(allCycles[i].startDate) - new Date(allCycles[i + 1].startDate)) / (1000 * 60 * 60 * 24)
                );
                if (len > 15 && len < 50) lengths.push(len);
            }
            if (lengths.length) avgCycleLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);

            const periodLengths = allCycles.filter(c => c.periodLength).map(c => c.periodLength);
            if (periodLengths.length) avgPeriodLength = Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length);
        }

        // Determine phase
        let phase = 'luteal';
        let phaseName = 'Luteal';
        let phaseEmoji = '🌕';
        let phaseDescription = 'Progesterone is rising, preparing for the next cycle.';

        const currentPeriodEnd = latestCycle.endDate
            ? Math.floor((new Date(latestCycle.endDate) - cycleStart) / (1000 * 60 * 60 * 24))
            : avgPeriodLength;

        if (daysSinceStart <= currentPeriodEnd) {
            phase = 'menstrual';
            phaseName = 'Your Period';
            phaseEmoji = '🌹';
            phaseDescription = 'Your body is shedding the uterine lining. Rest is your superpower now.';
        } else if (daysSinceStart <= avgCycleLength * 0.4) {
            phase = 'follicular';
            phaseName = 'Follicular';
            phaseEmoji = '🌱';
            phaseDescription = 'Estrogen is rising. You may feel more energetic and social.';
        } else if (daysSinceStart <= avgCycleLength * 0.55) {
            phase = 'ovulatory';
            phaseName = 'Ovulation';
            phaseEmoji = '✨';
            phaseDescription = 'You\'re at peak energy! Your communication and creativity are at their best.';
        }

        // Prediction
        const nextPeriodDate = new Date(cycleStart);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);

        let confidence = 'none';
        if (cycleCount === 0) confidence = 'none';
        else if (cycleCount <= 1) confidence = 'very_low';
        else if (cycleCount <= 3) confidence = 'low';
        else if (cycleCount <= 6) confidence = 'medium';
        else confidence = 'high';

        res.json({
            success: true,
            phase,
            phaseName,
            phaseEmoji,
            phaseDescription,
            cycleDay: daysSinceStart + 1,
            avgCycleLength,
            prediction: { nextPeriod: nextPeriodDate, range: 2 },
            confidence,
            cycleCount,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getCycles, createCycle, updateCycle, getCurrentPhase };
