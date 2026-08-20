const express = require('express');
const router = express.Router();
const store = require('../services/firestoreStore');
const auth = require('../middleware/auth');
const { analyzeUrl } = require('../services/urlAnalyzer');

// GET /api/scans/user/:id
router.get('/user/:id', auth.requireSameUser, async (req, res) => {
  try {
    const scans = await store.getScans(req.params.id);
    res.json(scans);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching scans' });
  }
});

// POST /api/scans
router.post('/', auth, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ msg: 'URL is required' });
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ msg: 'Please provide a valid URL' });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ msg: 'Only HTTP and HTTPS URLs can be scanned' });
    }

    const analysis = analyzeUrl(parsedUrl);
    const scan = await store.addScan({
      user_id: req.user.id,
      url: parsedUrl.toString(),
      ...analysis
    });
    res.json(scan);
  } catch (err) {
    console.error('Error creating scan:', err);
    res.status(500).json({ msg: 'Error creating scan' });
  }
});

// GET /api/scans/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const scan = await store.getScanById(req.params.id, req.user.id);
    if (!scan) return res.status(404).json({ msg: 'Scan report not found' });
    res.json(scan);
  } catch (err) {
    console.error('Error fetching scan:', err);
    res.status(500).json({ msg: 'Error fetching scan' });
  }
});

module.exports = router;
