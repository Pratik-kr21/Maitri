const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cycleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cycle'
    },
    logDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    flowIntensity: {
        type: String,
        enum: ['none', 'spotting', 'light', 'medium', 'heavy'],
        default: 'none'
    },
    symptoms: [{
        type: String
    }],
    energyLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    moodWord: {
        type: String,
        maxLength: 30
    },
    notes: {
        type: String,
        maxLength: 280
    }
}, { timestamps: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
