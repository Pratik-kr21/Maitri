const mongoose = require('mongoose');

const aiCacheSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        index: true,
    },
    answer: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24, // auto-delete after 24 hours (TTL index)
    },
});

module.exports = mongoose.model('AiCache', aiCacheSchema);
