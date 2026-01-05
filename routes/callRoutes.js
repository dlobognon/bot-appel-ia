const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');
const logger = require('../utils/logger');

/**
 * POST /api/calls/make - Initier un appel
 */
router.post('/make', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Numéro de téléphone requis' });
    }

    const result = await callController.makeCall(phoneNumber, message);
    res.json(result);
  } catch (error) {
    logger.error(`Erreur lors de l'initiation de l'appel: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/calls/voice - Webhook pour les appels entrants
 */
router.post('/voice', (req, res) => {
  try {
    const twiml = callController.handleIncomingCall();
    res.type('text/xml');
    res.send(twiml);
  } catch (error) {
    logger.error(`Erreur lors du traitement de l'appel entrant: ${error.message}`);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * POST /api/calls/menu - Gérer les sélections du menu
 */
router.post('/menu', (req, res) => {
  try {
    const digit = req.body.Digits;
    const twiml = callController.handleMenuSelection(digit);
    res.type('text/xml');
    res.send(twiml);
  } catch (error) {
    logger.error(`Erreur lors du traitement du menu: ${error.message}`);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * POST /api/calls/status - Webhook pour le statut des appels
 */
router.post('/status', (req, res) => {
  try {
    const result = callController.handleCallStatus(req.body);
    res.json(result);
  } catch (error) {
    logger.error(`Erreur lors du traitement du statut: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/calls/recording - Gérer les enregistrements
 */
router.post('/recording', (req, res) => {
  try {
    const twiml = callController.handleRecording(req.body);
    res.type('text/xml');
    res.send(twiml);
  } catch (error) {
    logger.error(`Erreur lors du traitement de l'enregistrement: ${error.message}`);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * POST /api/calls/transcription - Recevoir les transcriptions
 */
router.post('/transcription', (req, res) => {
  logger.info(`Transcription reçue: ${req.body.TranscriptionText}`);
  res.sendStatus(200);
});

/**
 * GET /api/calls/history - Obtenir l'historique des appels
 */
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = await callController.getCallHistory(limit);
    res.json(history);
  } catch (error) {
    logger.error(`Erreur lors de la récupération de l'historique: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/calls/stats - Obtenir les statistiques
 */
router.get('/stats', (req, res) => {
  try {
    const stats = callController.getStats();
    res.json(stats);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
