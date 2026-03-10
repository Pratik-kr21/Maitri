const express = require('express');
const router = express.Router();
const { getDailyInsight } = require('../controllers/insightController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/daily', getDailyInsight);

module.exports = router;
