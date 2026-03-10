const express = require('express');
const router = express.Router();
const { getLogs, createOrUpdateLog, getPatterns, deleteLog } = require('../controllers/journalController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getLogs);
router.post('/', createOrUpdateLog);
router.get('/patterns', getPatterns);
router.delete('/:id', deleteLog);

module.exports = router;
