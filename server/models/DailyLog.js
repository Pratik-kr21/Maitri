const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cycleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cycle',
        default: null,
    },
    logDate: {
        type: Date,
        required: true,
    },
    flowIntensity: {
        type: String,
        enum: ['none', 'spotting', 'light', 'medium', 'heavy'],
        default: 'none',
    },
    physicalSymptoms: [{
        type: String,
        enum: [
            'cramps', 'bloating', 'headache', 'breast_tenderness', 'acne',
            'fatigue', 'nausea', 'back_pain', 'spotting', 'heavy_flow', 'light_flow'
        ]
    }],
    emotionalSymptoms: [{
        type: String,
        enum: [
            'anxious', 'irritable', 'sad', 'happy', 'calm',
            'overwhelmed', 'motivated', 'brain_fog', 'low_confidence'
        ]
    }],
    energyLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    moodWord: {
        type: String,
        maxlength: 30,
        default: '',
    },
    notes: {
        type: String,
        maxlength: 280,
        default: '',
    },
    aiInsight: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index for user + date (one log per day per user)
dailyLogSchema.index({ userId: 1, logDate: 1 }, { unique: true });

dailyLogSchema.pre('save', async function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);
