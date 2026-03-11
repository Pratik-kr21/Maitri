const express = require('express');
const router = express.Router();
const {
    getPosts, createPost, upvotePost, savePost,
    getReplies, createReply, getSavedPosts, deletePost,
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/posts', getPosts);
router.post('/posts', createPost);
router.post('/posts/:id/upvote', upvotePost);
router.post('/posts/:id/save', savePost);
router.get('/posts/:id/replies', getReplies);
router.post('/posts/:id/replies', createReply);
router.delete('/posts/:id', deletePost);
router.get('/saved', getSavedPosts);

module.exports = router;
