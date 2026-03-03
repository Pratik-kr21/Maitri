const express = require('express');
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');
const Circle = require('../models/Circle');

const router = express.Router();

// Get circles (Seed if empty)
router.get('/circles', async (req, res) => {
    try {
        let circles = await Circle.find();
        if (circles.length === 0) {
            circles = await Circle.insertMany([
                { name: 'Teen Talk', description: 'Restricted for ages 13-24', ageRestricted: true },
                { name: 'PCOS Warriors', description: 'Support for PCOS' },
                { name: 'Working & Cycling', description: 'Balancing work and health' },
                { name: 'General Wellness', description: 'General health and habits' }
            ]);
        }
        res.json(circles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username')
            .populate('circle', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create post
router.post('/posts', protect, async (req, res) => {
    try {
        const { circleId, content, postType } = req.body;
        const post = await Post.create({
            user: req.user.id,
            circle: circleId,
            content,
            postType
        });

        await post.populate('user', 'username');
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
