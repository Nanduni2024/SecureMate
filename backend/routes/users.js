const express = require('express');
const router = express.Router();
const store = require('../services/firestoreStore');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.params.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// GET /api/users/:id/profile
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await store.findUserById(req.params.id);
    const profile = await store.getProfile(req.params.id);
    res.json({
      full_name: profile?.full_name || user?.full_name || '',
      email: user?.email || '',
      phone: profile?.phone || user?.phone || '',
      avatar_url: profile?.avatar_url || user?.avatar_url || ''
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching profile' });
  }
});

// PUT /api/users/:id/profile
router.put('/:id/profile', async (req, res) => {
  try {
    const { full_name, phone, avatar_url } = req.body;
    await store.createProfile({
      user_id: req.params.id,
      full_name,
      phone,
      avatar_url
    });
    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ msg: 'Server error updating profile' });
  }
});

// GET /api/users/:id/notifications
router.get('/:id/notifications', (req, res) => {
  res.json([
    {
      id: 1,
      text: 'Welcome to SecureMate! Digital footprint monitoring is active.',
      date: new Date().toISOString(),
      read: false
    }
  ]);
});

// GET /api/users/:id/settings
router.get('/:id/settings', async (req, res) => {
  try {
    const settings = await store.getSettings(req.params.id);
    res.json({
      theme: 'dark',
      notifications: true,
      two_factor: false,
      auto_lock: '15 minutes',
      backups: true,
      ...settings
    });
  } catch (err) {
    res.json({
      theme: 'dark',
      notifications: true,
      two_factor: false,
      auto_lock: '15 minutes',
      backups: true
    });
  }
});

// PUT /api/users/:id/settings
router.put('/:id/settings', async (req, res) => {
  try {
    await store.createSettings({ user_id: req.params.id, ...req.body });
    res.json({ msg: 'Settings updated successfully', ...req.body });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating settings' });
  }
});

// POST /api/users/:id/avatar
router.post('/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    const avatarUrl = `/uploads/${req.file.filename}`;
    await store.createProfile({
      user_id: req.params.id,
      avatar_url: avatarUrl
    });
    res.json({ avatar_url: avatarUrl });
  } catch (err) {
    console.error('Error uploading avatar:', err);
    res.status(500).json({ msg: 'Failed to upload photo' });
  }
});

module.exports = router;
