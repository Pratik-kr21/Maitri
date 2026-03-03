const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    circle: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle' },
    content: { type: String, required: true },
    postType: { type: String, enum: ['question', 'experience', 'win', 'resource'], default: 'experience' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
