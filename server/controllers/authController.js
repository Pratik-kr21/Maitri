const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const webPush = require('web-push');
const User = require('../models/User');
const Cycle = require('../models/Cycle');

// Generate and configure VAPID keys if in env, else dummy
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webPush.setVapidDetails(
        'mailto:admin@maitri.local',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'maitri_secret', {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

// Setup transporter (use Ethereal for dev if no email configured)
const getTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    // Skip SMTP if placeholder values are still set
    const isConfigured = user && pass
        && !user.includes('your_email')
        && !pass.includes('your_app_password')
        && !pass.includes('your_');
    if (isConfigured) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: parseInt(process.env.EMAIL_PORT) === 465,
            auth: { user, pass },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 5000,
            greetingTimeout: 5000,
            socketTimeout: 10000,
        });
    }
    // Dev fallback - just log the token
    return null;
};

// @route POST /api/auth/signup
// @desc  Initiate signup - send magic link
const signup = async (req, res) => {
    try {
        const { email, username, displayName, dateOfBirth, parentEmail, avatar, avatarColor, lastPeriodDate } = req.body;

        if (!email || !username || !dateOfBirth) {
            return res.status(400).json({ success: false, message: 'Email, username and date of birth are required' });
        }

        // Check existing user
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
        const isMinor = age < 18;

        if (isMinor && !parentEmail) {
            return res.status(400).json({ success: false, message: 'Parental consent email required for users under 18' });
        }

        // Create OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const user = await User.create({
            email,
            username,
            displayName,
            dateOfBirth,
            isMinor,
            ageBracket: age < 18 ? 'teen' : 'adult',
            parentalConsentEmail: isMinor ? parentEmail : null,
            parentalConsentGranted: !isMinor,
            otp,
            otpExpires,
            isVerified: false,
            avatar: avatar || 'lotus',
            avatarColor: avatarColor || '#E87A86',
        });

        if (lastPeriodDate) {
            await Cycle.create({
                userId: user._id,
                startDate: new Date(lastPeriodDate)
            });
        }

        const transporter = getTransporter();
        if (transporter) {
            try {
                const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?email=${encodeURIComponent(email)}`;
                await transporter.sendMail({
                    from: `"Maitri" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: 'Verify your Maitri account 🌸',
                    html: `
              <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;padding:32px;border:1px solid #f0f0f0;border-radius:16px;">
                <h2 style="color:#E87A86;font-family:serif;text-align:center;">Welcome to Maitri 🌸</h2>
                <p>Hi ${username},</p>
                <p>Your verification code is:</p>
                <div style="background:#f9f9f9;padding:16px;text-align:center;font-size:32px;font-weight:bold;letter-spacing:8px;color:#2C1A1D;border-radius:12px;margin:24px 0;">
                    ${otp}
                </div>
                <p style="text-align:center;">Or click the button below to verify directly:</p>
                <div style="text-align:center;margin:32px 0;">
                    <a href="${verifyUrl}" style="background:#E87A86;color:white;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:semibold;">Verify Account →</a>
                </div>
                <p style="color:#888;font-size:0.875rem;margin-top:24px;text-align:center;">This code expires in 10 minutes.</p>
              </div>
            `,
                });
            } catch (mailErr) {
                console.error('MAIL ERROR:', mailErr);
                // In dev, we still want to succeed even if email fails
                if (process.env.NODE_ENV !== 'development') {
                    throw new Error('Could not send verification email. Please check your email address.');
                }
            }
        } else {
            console.log('\n🔑 OTP (dev mode):', otp, '\n');
        }

        res.status(201).json({
            success: true,
            message: 'Verification email sent. Please check your inbox.',
            devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
        });
    } catch (err) {
        console.error('SIGNUP ERROR:', err);
        res.status(500).json({ success: false, message: err.message || 'Signup failed' });
    }
};

// @route POST /api/auth/verify-email
// @desc  Verify OTP and activate account
const verifyEmail = async (req, res) => {
    try {
        const { otp, email } = req.body;

        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
        }

        if (user.isMinor && !user.parentalConsentGranted) {
            return res.status(403).json({
                success: false,
                message: 'Awaiting parental consent. Please ask your parent/guardian to approve your account.',
            });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const jwtToken = generateToken(user._id);

        res.json({
            success: true,
            message: 'Email verified successfully',
            token: jwtToken,
            user: {
                id: user._id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                ageBracket: user.ageBracket,
                isMinor: user.isMinor,
                avatar: user.avatar,
                avatarColor: user.avatarColor,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/auth/login
// @desc  Request OTP login
const login = async (req, res) => {
    try {
        const { identifier } = req.body;
        console.log('Login request for:', identifier);
        if (!identifier) return res.status(400).json({ success: false, message: 'Email or Username is required' });

        const user = await User.findOne({
            $and: [
                {
                    $or: [
                        { email: identifier.toLowerCase() },
                        { username: identifier }
                    ]
                },
                {
                    $or: [
                        { deletedAt: null },
                        { deletedAt: { $exists: false } }
                    ]
                }
            ]
        });

        if (!user) {
            console.log('User not found:', identifier);
            return res.status(404).json({ success: false, message: 'No account found with this email or username' });
        }

        console.log('User found, sending email to:', user.email);
        const email = user.email;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        const transporter = getTransporter();
        if (transporter) {
            try {
                const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?email=${encodeURIComponent(email)}`;
                await transporter.sendMail({
                    from: `"Maitri" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: 'Your Maitri login code 🌸',
                    html: `
              <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;padding:32px;border:1px solid #f0f0f0;border-radius:16px;">
                <h2 style="color:#E87A86;font-family:serif;text-align:center;">Login to Maitri 🌸</h2>
                <p>Hi ${user.username},</p>
                <p>Your login code is:</p>
                <div style="background:#f9f9f9;padding:16px;text-align:center;font-size:32px;font-weight:bold;letter-spacing:8px;color:#2C1A1D;border-radius:12px;margin:24px 0;">
                    ${otp}
                </div>
                <div style="text-align:center;margin:32px 0;">
                    <a href="${verifyUrl}" style="background:#E87A86;color:white;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:semibold;">Login Directly →</a>
                </div>
                <p style="color:#888;font-size:0.875rem;margin-top:24px;text-align:center;">This code expires in 10 minutes.</p>
              </div>
            `,
                });
            } catch (mailErr) {
                console.error('MAIL ERROR:', mailErr);
                if (process.env.NODE_ENV !== 'development') {
                    throw new Error('Could not send login email.');
                }
            }
        } else {
            console.log('\n🔑 LOGIN OTP (dev mode):', otp, '\n');
        }

        res.json({
            success: true,
            message: 'Login code sent to your email',
            email: user.email,
            devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route GET /api/auth/me
// @desc  Get current user
const getMe = async (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username,
            displayName: req.user.displayName,
            email: req.user.email,
            avatar: req.user.avatar,
            avatarColor: req.user.avatarColor,
            notificationsEnabled: req.user.notificationsEnabled,
            patternDetectionEnabled: req.user.patternDetectionEnabled,
            aiHistoryEnabled: req.user.aiHistoryEnabled,
            createdAt: req.user.createdAt,
        },
    });
};

// @route PUT /api/auth/profile
// @desc  Update profile
const updateProfile = async (req, res) => {
    try {
        const { avatar, avatarColor, notificationsEnabled, patternDetectionEnabled, aiHistoryEnabled } = req.body;
        const user = await User.findById(req.user._id);

        if (avatar) user.avatar = avatar;
        if (avatarColor) user.avatarColor = avatarColor;
        if (typeof notificationsEnabled === 'boolean') user.notificationsEnabled = notificationsEnabled;
        if (typeof patternDetectionEnabled === 'boolean') user.patternDetectionEnabled = patternDetectionEnabled;
        if (typeof aiHistoryEnabled === 'boolean') user.aiHistoryEnabled = aiHistoryEnabled;

        await user.save();
        res.json({ success: true, message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route GET /api/auth/check-username/:username
// @desc  Check if username is available
const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const exists = await User.findOne({ username: username.toLowerCase() });
        res.json({ success: true, available: !exists });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/auth/resend-otp
// @desc  Resend OTP to email
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const transporter = getTransporter();
        if (transporter) {
            await transporter.sendMail({
                from: `"Maitri" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your new Maitri verification code',
                html: `
          <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
            <p>Your new verification code is: <strong>${otp}</strong></p>
            <p>If you didn't request this, please ignore.</p>
          </div>`,
            });
        }
        res.json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/auth/push-subscribe
// @desc  Subscribe to web push notifications
const subscribePush = async (req, res) => {
    try {
        const { subscription } = req.body;
        if (!process.env.VAPID_PUBLIC_KEY) {
            return res.status(503).json({ success: false, message: 'Push notifications are not configured on the server.' });
        }

        const user = await User.findById(req.user._id);
        if (subscription) {
            user.pushSubscription = subscription;
            user.notificationsEnabled = true;

            // Send a welcome push to verify
            try {
                const payload = JSON.stringify({
                    title: 'Maitri Notifications enabled! 🌸',
                    body: 'You will now receive daily check-in reminders.'
                });
                await webPush.sendNotification(subscription, payload);
            } catch (pushErr) {
                console.error('Failed to send welcome push:', pushErr);
            }
        } else {
            user.pushSubscription = null;
            user.notificationsEnabled = false;
        }

        await user.save();
        res.json({ success: true, message: 'Push settings updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { signup, verifyEmail, login, getMe, updateProfile, checkUsername, resendOtp, subscribePush };
