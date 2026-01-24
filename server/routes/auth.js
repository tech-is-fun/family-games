const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
    createUser,
    getUserByUsername,
    getUserById,
    createPasswordResetToken,
    getPasswordResetToken,
    markTokenAsUsed,
    updateUserPassword
} = require('../db');

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password, gameName } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (username.length < 3 || username.length > 50) {
            return res.status(400).json({ error: 'Username must be between 3 and 50 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        if (gameName && gameName.length > 50) {
            return res.status(400).json({ error: 'Game name must be 50 characters or less' });
        }

        // Check if username already exists
        const existing = await getUserByUsername(username);
        if (existing) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password and create user
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await createUser(username, passwordHash, gameName || null);

        // Create session
        req.session.userId = user.id;

        res.json({ success: true, user: { id: user.id, username: user.username, gameName: user.game_name } });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Create session
        req.session.userId = user.id;

        res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// Get current user
router.get('/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const user = await getUserById(req.session.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        res.json({ user: { id: user.id, username: user.username, gameName: user.game_name } });
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Forgot password - request reset link
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email/username is required' });
        }

        // For this family app, username is also the identifier
        // Check if it's an email or username
        const user = await getUserByUsername(email);

        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        await createPasswordResetToken(user.id, token, expiresAt);

        // Build reset URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password.html?token=${token}`;

        // Send email if EMAIL_USER and EMAIL_PASS are configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email.includes('@') ? email : null, // Only send if it looks like an email
                    subject: 'Family Games - Password Reset',
                    html: `
                        <h2>Password Reset Request</h2>
                        <p>Hello ${user.username},</p>
                        <p>You requested a password reset for your Family Games account.</p>
                        <p>Click the link below to reset your password (valid for 1 hour):</p>
                        <p><a href="${resetUrl}">${resetUrl}</a></p>
                        <p>If you didn't request this, you can ignore this email.</p>
                    `
                });
            } catch (emailErr) {
                console.error('Failed to send email:', emailErr);
            }
        }

        // For family app, also log the reset URL to console (for development/testing)
        console.log(`Password reset link for ${user.username}: ${resetUrl}`);

        res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Validate token
        const tokenData = await getPasswordResetToken(token);

        if (!tokenData) {
            return res.status(400).json({ error: 'Invalid or expired reset link' });
        }

        // Hash new password and update
        const passwordHash = await bcrypt.hash(password, 10);
        await updateUserPassword(tokenData.user_id, passwordHash);

        // Mark token as used
        await markTokenAsUsed(token);

        res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Validate reset token (for checking if token is valid before showing form)
router.get('/validate-reset-token', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ valid: false, error: 'Token is required' });
        }

        const tokenData = await getPasswordResetToken(token);

        if (!tokenData) {
            return res.json({ valid: false, error: 'Invalid or expired reset link' });
        }

        res.json({ valid: true, username: tokenData.username });
    } catch (err) {
        console.error('Validate token error:', err);
        res.status(500).json({ valid: false, error: 'Failed to validate token' });
    }
});

module.exports = router;
