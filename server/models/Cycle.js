const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        default: null,
    },
    periodLength: {
        type: Number,
        default: null,
    },
    notes: {
        type: String,
        default: '',
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

cycleSchema.pre('save', async function () {
    this.updatedAt = Date.now();
    if (this.startDate && this.endDate) {
        this.periodLength = Math.ceil(
            (new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24)
        );
    }
});

module.exports = mongoose.model('Cycle', cycleSchema);
