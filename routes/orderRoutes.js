const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { OrderDB, CallDB } = require('../config/database');
const { syncOrders, getAutomationStatus } = require('../services/automationService');

/**
 * GET /api/orders - Obtenir toutes les commandes
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const orders = await OrderDB.getAll(limit);
    res.json(orders);
  } catch (error) {
    logger.error('Erreur récupération commandes:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/pending - Obtenir les commandes en attente
 */
router.get('/status/pending', async (req, res) => {
  try {
    const orders = await OrderDB.getPending();
    res.json(orders);
  } catch (error) {
    logger.error('Erreur récupération commandes pending:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/orders/sync - Forcer une synchronisation avec Google Sheets
 */
router.post('/sync', async (req, res) => {
  try {
    await syncOrders();
    res.json({ success: true, message: 'Synchronisation effectuée' });
  } catch (error) {
    logger.error('Erreur synchronisation:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Variante GET pour déclencher la synchro depuis le navigateur
router.get('/sync', async (req, res) => {
  try {
    await syncOrders();
    res.json({ success: true, message: 'Synchronisation effectuée' });
  } catch (error) {
    logger.error('Erreur synchronisation:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/:id - Obtenir une commande spécifique
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await OrderDB.getById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Récupérer les appels associés
    const calls = await CallDB.getByOrderId(order.id);
    
    res.json({ ...order, calls });
  } catch (error) {
    logger.error('Erreur récupération commande:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/orders/:id/status - Mettre à jour le statut d'une commande
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Statut requis' });
    }

    await OrderDB.updateStatus(req.params.id, status, notes);
    res.json({ success: true });
  } catch (error) {
    logger.error('Erreur mise à jour statut:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/stats/summary - Obtenir les statistiques
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const allOrders = await OrderDB.getAll();
    
    const stats = {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === 'pending').length,
      confirmed: allOrders.filter(o => o.status === 'confirmed').length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length,
      failed: allOrders.filter(o => o.status === 'failed').length,
      retry: allOrders.filter(o => o.status === 'retry').length,
      automationStatus: getAutomationStatus()
    };
    
    res.json(stats);
  } catch (error) {
    logger.error('Erreur statistiques:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
