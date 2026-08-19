const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      action: 'LOGIN',
      description: 'Successful user authentication',
      timestamp: new Date().toISOString()
    }
  ]);
});

router.get('/user/:id', (req, res) => {
  res.json([
    {
      id: 1,
      action: 'LOGIN',
      description: 'User signed in',
      timestamp: new Date().toISOString()
    }
  ]);
});

module.exports = router;
