const express = require('express');
const router = express.Router();
const { getCycles, createCycle, updateCycle, getCurrentPhase } = require('../controllers/cycleController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/current-phase', getCurrentPhase);
router.get('/', getCycles);
router.post('/', createCycle);
router.put('/:id', updateCycle);

module.exports = router;
