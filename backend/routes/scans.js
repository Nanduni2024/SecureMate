const express = require('express');
const router = express.Router();
const store = require('../services/firestoreStore');

// GET /api/scans/user/:id
router.get('/user/:id', async (req, res) => {
  try {
    const scans = await store.getScans(req.params.id);
    res.json(scans);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching scans' });
  }
});

// POST /api/scans
router.post('/', async (req, res) => {
  try {
    const { user_id, url } = req.body;
    if (!url) return res.status(400).json({ msg: 'URL is required' });
    const scan = await store.addScan({ user_id, url });
    res.json(scan);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating scan' });
  }
});

// GET /api/scans/:id
router.get('/:id', async (req, res) => {
  res.json({
    _id: req.params.id,
    url: 'http://example.com',
    risk_level: 'low',
    threat_score: 95,
    created_at: new Date().toISOString(),
    details: {
      status: 'Clean',
      ip: '192.168.1.1',
      location: 'US'
    }
  });
});

module.exports = router;
