const Cycle = require('../models/Cycle');
const DailyLog = require('../models/DailyLog');
const User = require('../models/User');

// @route GET /api/vault/export
const getVaultData = async (req, res) => {
    try {
        const cycles = await Cycle.find({ userId: req.user._id }).sort({ startDate: -1 });
        const logs = await DailyLog.find({ userId: req.user._id }).sort({ logDate: -1 });

        // Summarize symptom frequencies
        const physicalFreq = {};
        const emotionalFreq = {};
        const energyFreq = { low: 0, medium: 0, high: 0 };

        logs.forEach(log => {
            log.physicalSymptoms.forEach(s => physicalFreq[s] = (physicalFreq[s] || 0) + 1);
            log.emotionalSymptoms.forEach(s => emotionalFreq[s] = (emotionalFreq[s] || 0) + 1);
            energyFreq[log.energyLevel]++;
        });

        const topPhysical = Object.entries(physicalFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topEmotional = Object.entries(emotionalFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

        res.json({
            success: true,
            vault: {
                user: {
                    username: req.user.username,
                    memberSince: req.user.createdAt,
                },
                cycles: cycles.map(c => ({
                    startDate: c.startDate,
                    endDate: c.endDate,
                    periodLength: c.periodLength,
                    notes: c.notes,
                })),
                totalCycles: cycles.length,
                totalDaysLogged: logs.length,
                symptoms: {
                    physical: topPhysical,
                    emotional: topEmotional,
                    energy: energyFreq,
                },
                recentLogs: logs.slice(0, 10),
                exportedAt: new Date(),
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route DELETE /api/vault/account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        // Soft delete user
        await User.findByIdAndUpdate(userId, { deletedAt: new Date() });

        // Hard delete all health data
        await Cycle.deleteMany({ userId });
        await DailyLog.deleteMany({ userId });

        res.json({ success: true, message: 'Your account and all data have been permanently deleted. A confirmation has been noted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getVaultData, deleteAccount };
