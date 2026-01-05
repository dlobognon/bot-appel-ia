const express = require('express');
const router = express.Router();
const { setBotStatus, getBotStatus } = require('../config/botState');

router.get('/status', (req, res) => {
  res.json(getBotStatus());
});

router.post('/on', (req, res) => {
  setBotStatus(true);
  res.json({ status: 'ON' });
});

router.post('/off', (req, res) => {
  setBotStatus(false);
  res.json({ status: 'OFF' });
});

module.exports = router;
