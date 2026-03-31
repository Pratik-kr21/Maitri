const express = require('express');
const router = express.Router();
const { chat, getSuggestions, getHistory } = require('../controllers/askMaitriController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chat);
router.get('/suggestions', protect, getSuggestions);
router.get('/history', protect, getHistory);

module.exports = router;
