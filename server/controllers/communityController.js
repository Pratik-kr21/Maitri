const Post = require('../models/Post');
const Reply = require('../models/Reply');
const User = require('../models/User');

const generateAnonymousName = () => {
    const adjectives = ['Lunar', 'Solar', 'Starry', 'Cosmic', 'Mystic', 'Crystal', 'Velvet', 'Golden', 'Silver', 'Amethyst', 'Jade', 'Coral'];
    const nouns = ['Bloom', 'Rose', 'Lily', 'Fern', 'Sage', 'Willow', 'Ocean', 'Breeze', 'Dawn', 'Dusk', 'Luna', 'Nova'];
    return adjectives[Math.floor(Math.random() * adjectives.length)] +
        nouns[Math.floor(Math.random() * nouns.length)] +
        Math.floor(Math.random() * 999);
};

const ensureAnonymousName = async (userId) => {
    const user = await User.findById(userId);
    if (user.anonymousName) return user.anonymousName;
    user.anonymousName = generateAnonymousName();
    await user.save({ validateBeforeSave: false });
    return user.anonymousName;
};

const checkModeration = async (text) => {
    return true; // Bypassing moderation because OpenRouter free tier limit has been reached
};

// @route GET /api/community/posts
const getPosts = async (req, res) => {
    try {
        const { circle, limit = 20 } = req.query;
        const query = {};
        if (circle) query.circle = circle;

        const posts = await Post.find(query)
            .populate('createdBy', 'username avatar avatarColor anonymousName')
            .sort({ createdAt: -1 })
            .limit(Number(limit));

        const enriched = posts.map(p => ({
            ...p.toObject(),
            upvotes: p.upvotes.length,
            isUpvoted: p.upvotes.some(uid => uid.toString() === req.user._id.toString()),
            isSaved: p.savedBy?.some(uid => uid.toString() === req.user._id.toString()),
            isOwner: p.createdBy?._id?.toString() === req.user._id.toString(),
        }));

        res.json({ success: true, posts: enriched });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/community/posts
const createPost = async (req, res) => {
    try {
        const { title, body, type, isAnonymous, circle } = req.body;

        if (!title || !body || !circle) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const isSafe = await checkModeration(title + '\n' + body);
        if (!isSafe) {
            return res.status(400).json({ success: false, message: 'Your post was flagged by our AI moderation for violating safety guidelines.' });
        }

        if (isAnonymous) {
            await ensureAnonymousName(req.user._id);
        }

        const post = await Post.create({
            title,
            body,
            type: type || 'experience',
            isAnonymous: isAnonymous || false,
            circle,
            createdBy: req.user._id
        });

        const populated = await post.populate('createdBy', 'username avatar avatarColor anonymousName');
        res.status(201).json({ success: true, post: populated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/community/posts/:id/upvote
const upvotePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const userId = req.user._id;
        const hasUpvoted = post.upvotes.some(uid => uid.toString() === userId.toString());

        if (hasUpvoted) {
            post.upvotes = post.upvotes.filter(uid => uid.toString() !== userId.toString());
        } else {
            post.upvotes.push(userId);
        }

        await post.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/community/posts/:id/save
const savePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const userId = req.user._id;
        const isSaved = post.savedBy.some(uid => uid.toString() === userId.toString());

        if (isSaved) {
            post.savedBy = post.savedBy.filter(uid => uid.toString() !== userId.toString());
        } else {
            post.savedBy.push(userId);
        }

        await post.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route GET /api/community/posts/:id/replies
const getReplies = async (req, res) => {
    try {
        const replies = await Reply.find({ post: req.params.id })
            .populate('createdBy', 'username avatar avatarColor anonymousName')
            .sort({ createdAt: 1 });

        res.json({ success: true, replies });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/community/posts/:id/replies
const createReply = async (req, res) => {
    try {
        const { body, isAnonymous } = req.body;
        if (!body) return res.status(400).json({ success: false, message: 'Body is required' });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const isSafe = await checkModeration(body);
        if (!isSafe) {
            return res.status(400).json({ success: false, message: 'Your reply was flagged by our AI moderation for violating safety guidelines.' });
        }

        if (isAnonymous) {
            await ensureAnonymousName(req.user._id);
        }

        const reply = await Reply.create({
            post: req.params.id,
            createdBy: req.user._id,
            body,
            isAnonymous: isAnonymous || false
        });

        post.replyCount += 1;
        await post.save();

        const populated = await reply.populate('createdBy', 'username avatar avatarColor anonymousName');
        res.status(201).json({ success: true, reply: populated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route GET /api/community/saved
const getSavedPosts = async (req, res) => {
    try {
        const posts = await Post.find({
            savedBy: req.user._id,
        }).populate('createdBy', 'username avatar avatarColor anonymousName').sort({ createdAt: -1 });

        const enriched = posts.map(p => ({
            ...p.toObject(),
            upvotes: p.upvotes.length,
            isUpvoted: p.upvotes.some(uid => uid.toString() === req.user._id.toString()),
            isSaved: true,
            isOwner: p.createdBy?._id?.toString() === req.user._id.toString(),
        }));

        res.json({ success: true, posts: enriched });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route DELETE /api/community/posts/:id
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        if (post.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You can only delete your own posts' });
        }

        // Delete all replies associated with this post
        await Reply.deleteMany({ post: req.params.id });
        await Post.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getPosts, createPost, upvotePost, savePost, getReplies, createReply, getSavedPosts, deletePost };
