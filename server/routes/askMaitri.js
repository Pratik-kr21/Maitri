const express = require('express');
const router = express.Router();
const { chat, getSuggestions } = require('../controllers/askMaitriController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chat);
router.get('/suggestions', protect, getSuggestions);

module.exports = router;
