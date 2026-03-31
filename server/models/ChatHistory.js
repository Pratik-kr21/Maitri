const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    ts: { type: Date, default: Date.now },
}, { _id: false });

const chatHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    messages: [messageSchema],
    date: { type: String, required: true }, // YYYY-MM-DD, one doc per user per day
}, { timestamps: true });

// Compound unique index: one document per user per day
chatHistorySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
