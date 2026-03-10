const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login, getMe, updateProfile, checkUsername, resendOtp, subscribePush } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/resend-otp', resendOtp);
router.get('/check-username/:username', checkUsername);
router.get('/ping', (req, res) => res.json({ message: 'pong' }));
router.post('/push-subscribe', protect, subscribePush);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
