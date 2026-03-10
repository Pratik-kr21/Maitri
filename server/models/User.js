const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: [/^[a-zA-Z0-9._]+$/, 'Username can only contain letters, numbers, underscores, and dots.'],
    },
    displayName: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    anonymousName: {
        type: String,
        unique: true,
        sparse: true,
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    isMinor: {
        type: Boolean,
        default: false,
    },
    parentalConsentGranted: {
        type: Boolean,
        default: false,
    },
    parentalConsentEmail: {
        type: String,
        default: null,
    },
    parentalConsentToken: {
        type: String,
        default: null,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: 'lotus',
        enum: ['lotus', 'moon', 'sun', 'star', 'flower', 'leaf'],
    },
    avatarColor: {
        type: String,
        default: '#E87A86',
    },
    notificationsEnabled: {
        type: Boolean,
        default: true,
    },
    pushSubscription: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    patternDetectionEnabled: {
        type: Boolean,
        default: true,
    },
    aiHistoryEnabled: {
        type: Boolean,
        default: true,
    },
    aiQueriesToday: {
        type: Number,
        default: 0,
    },
    lastAiQueryDate: {
        type: Date,
        default: null,
    },
    ageBracket: {
        type: String,
        enum: ['teen', 'adult'],
        default: 'adult',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

// Compute age bracket before save
userSchema.pre('save', async function () {
    if (this.dateOfBirth) {
        const age = new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
        this.isMinor = age < 18;
        this.ageBracket = age < 18 ? 'teen' : 'adult';
    }
});

module.exports = mongoose.model('User', userSchema);
