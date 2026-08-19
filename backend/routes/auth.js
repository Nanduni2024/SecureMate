const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const store = require('../services/firestoreStore');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    let user = await store.findUserByEmail(email);
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await store.createUser({
      email,
      password: hashedPassword
    });

    const payload = {
      user: {
        id: user._id,
        email: user.email
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user._id, email: user.email } });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    const user = await store.findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user._id,
        email: user.email
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user._id, email: user.email } });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// @route   POST api/auth/google/verify
// @desc    Verify Google ID Token and register/login user
// @access  Public
router.post('/google/verify', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ msg: 'Google credential is required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ msg: 'Invalid Google token payload' });
    }

    const { email, sub: googleId, name, picture } = payload;

    let user = await store.findUserByEmail(email);

    if (!user) {
      user = await store.createUser({
        email,
        googleId
      }, googleId);

      await store.createProfile({
        user_id: user._id,
        full_name: name || '',
        avatar_url: picture || ''
      });

      await store.createSettings({
        user_id: user._id
      });
    }

    const jwtPayload = {
      user: {
        id: user._id,
        email: user.email
      }
    };

    jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user._id, email: user.email } });
    });
  } catch (err) {
    console.error('Google verification error:', err);
    const isConfigurationError = err.message?.includes('Firebase credentials are not configured')
      || err.message?.includes('Firebase service account file was not found');
    const isAudienceError = err.message?.includes('payload audience != requiredAudience');
    res.status(isConfigurationError ? 503 : 401).json({
      msg: isConfigurationError
        ? err.message
        : isAudienceError
          ? 'Google client ID mismatch. Restart the frontend after updating .env and use the configured OAuth client.'
          : 'Google authentication failed'
    });
  }
});

module.exports = router;
