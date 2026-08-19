const express = require('express');
const router = express.Router();
const store = require('../services/firestoreStore');

// GET /api/vault/user/:id
router.get('/user/:id', async (req, res) => {
  try {
    const items = await store.getVaultItems(req.params.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching vault items' });
  }
});

// POST /api/vault
router.post('/', async (req, res) => {
  try {
    const { user_id, type, title, username, password, url, note } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title is required' });
    const item = await store.addVaultItem({ user_id, type, title, username, password, url, note });
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: 'Error saving vault item' });
  }
});

// DELETE /api/vault/:id
router.delete('/:id', async (req, res) => {
  try {
    await store.deleteVaultItem(req.params.id);
    res.json({ msg: 'Vault item deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting vault item' });
  }
});

module.exports = router;
