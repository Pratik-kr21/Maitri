const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    ageRestricted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Circle', circleSchema);
