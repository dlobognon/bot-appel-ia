const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

const {
  handleVoiceWebhook,
  handleCustomerResponse,
  handleCancelConfirmation,
  handleCallStatus
} = require('../controllers/automatedCallController');

/**
 * Webhook Twilio – début appel
 */
router.post('/voice', handleVoiceWebhook);

/**
 * Réponse vocale client
 */
router.post('/respond', handleCustomerResponse);

/**
 * Confirmation annulation
 */
router.post('/confirm-cancel', async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const speech = req.body.SpeechResult || '';
    const twiml = await handleCancelConfirmation(orderId, speech);
    res.type('text/xml').send(twiml);
  } catch (error) {
    logger.error('Erreur confirm-cancel:', error.message);
    res.status(500).send('Erreur');
  }
});

/**
 * Status appel Twilio
 */
router.post('/status', handleCallStatus);

module.exports = router;
