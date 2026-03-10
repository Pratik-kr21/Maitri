const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    circle: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['question', 'experience', 'win', 'resource'],
        required: true,
    },
    title: {
        type: String,
        required: true,
        maxlength: 200,
    },
    body: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    replyCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

postSchema.index({ circle: 1, createdAt: -1 });
postSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Post', postSchema);
