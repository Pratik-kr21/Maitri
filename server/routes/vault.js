const express = require('express');
const router = express.Router();
const { getVaultData, deleteAccount } = require('../controllers/vaultController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/export', getVaultData);
router.delete('/account', deleteAccount);

module.exports = router;
