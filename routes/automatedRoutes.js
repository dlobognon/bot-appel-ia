const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const {
  handleVoiceWebhook,
  handleCustomerResponse,
  handleCallStatus,
  handleRecording
} = require('../controllers/automatedCallController');

/**
 * POST /api/automated/voice - Webhook pour démarrer l'appel automatique
 */
router.post('/voice', async (req, res) => {
  try {
    const orderId = req.query.orderId;
    
    if (!orderId) {
      return res.status(400).send('Order ID required');
    }

    const twiml = await handleVoiceWebhook(orderId);
    res.type('text/xml');
    res.send(twiml);

  } catch (error) {
    logger.error('Erreur webhook voice:', error.message);
    res.status(500).send('<Response><Say>Erreur système</Say></Response>');
  }
});

/**
 * POST /api/automated/respond - Gérer la réponse vocale du client
 */
router.post('/respond', async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const speechResult = req.body.SpeechResult || '';
    const callSid = req.body.CallSid;

    if (!orderId) {
      return res.status(400).send('Order ID required');
    }

    const twiml = await handleCustomerResponse(orderId, speechResult, callSid);
    res.type('text/xml');
    res.send(twiml);

  } catch (error) {
    logger.error('Erreur réponse:', error.message);
    res.status(500).send('<Response><Say>Erreur</Say></Response>');
  }
});

/**
 * POST /api/automated/status - Webhook pour le statut des appels
 */
router.post('/status', async (req, res) => {
  try {
    await handleCallStatus(req.body);
    res.sendStatus(200);
  } catch (error) {
    logger.error('Erreur statut:', error.message);
    res.sendStatus(500);
  }
});

/**
 * POST /api/automated/recording - Webhook pour les enregistrements
 */
router.post('/recording', async (req, res) => {
  try {
    await handleRecording(req.body);
    res.sendStatus(200);
  } catch (error) {
    logger.error('Erreur enregistrement:', error.message);
    res.sendStatus(500);
  }
});

/**
 * POST /api/automated/test-call - Déclencher un appel test immédiatement
 */
router.post('/test-call', async (req, res) => {
  try {
    const { db } = require('../config/database');
    const { makeAutomatedCall } = require('../controllers/automatedCallController');
    
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID requis' });
    }
    
    // Récupérer la commande
    const order = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    logger.info(`🧪 Test d'appel manuel pour commande #${orderId}`);
    const callSid = await makeAutomatedCall(order);
    
    res.json({
      success: true,
      message: 'Appel lancé',
      callSid,
      order: {
        id: order.id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone
      }
    });
    
  } catch (error) {
    logger.error('Erreur test call:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/automated/manual-call - Appel manuel avec réinitialisation possible
 */
router.post('/manual-call', async (req, res) => {
  try {
    const { db } = require('../config/database');
    const { makeAutomatedCall } = require('../controllers/automatedCallController');
    
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID requis' });
    }
    
    // Récupérer la commande
    const order = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    // Si la commande a échoué ou atteint le max de tentatives, on réinitialise
    if (order.status === 'failed' || order.call_attempts >= 5) {
      logger.info(`🔄 Réinitialisation des tentatives pour commande #${orderId}`);
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE orders SET status = ?, call_attempts = 0 WHERE id = ?',
          ['retry', orderId],
          (err) => err ? reject(err) : resolve()
        );
      });
      // Recharger la commande après mise à jour
      order.status = 'retry';
      order.call_attempts = 0;
    }
    
    logger.info(`📞 Appel manuel pour ${order.customer_name} (commande #${orderId})`);
    const callSid = await makeAutomatedCall(order);
    
    res.json({
      success: true,
      message: 'Appel lancé avec succès',
      callSid,
      order: {
        id: order.id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        status: order.status
      }
    });
    
  } catch (error) {
    logger.error('Erreur appel manuel:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
