const cron = require('node-cron');
const logger = require('../utils/logger');
const { getOrders, updateOrderStatus } = require('./googleSheets');
const { OrderDB } = require('../config/database');
const { isCallTimeAllowed, isMessageTimeAllowed, logTimeStatus } = require('../utils/timeManager');
const { isBotEnabled } = require('../config/botState');
const { makeAutomatedCall, sendAutomatedMessage } = require('../controllers/automatedCallController');

let isProcessing = false;

/**
 * 🔄 Synchronisation Google Sheets → Base locale
 */
async function syncOrders() {
  try {
    logger.info('🔄 syncOrders lancé');

    const sheetOrders = await getOrders();
    const dbOrders = await OrderDB.getAll();

    // Index rapide
    const dbByRow = new Map(dbOrders.map(o => [o.sheet_row, o]));

    for (const sheetOrder of sheetOrders) {
      if (!sheetOrder.sheet_row || !sheetOrder.customer_phone) continue;

      const existing = dbByRow.get(sheetOrder.sheet_row);

      if (!existing) {
        const orderId = await OrderDB.create({
          sheet_row: sheetOrder.sheet_row,
          customer_name: sheetOrder.customer_name,
          customer_phone: sheetOrder.customer_phone,
          delivery_address: sheetOrder.delivery_address,
          products: sheetOrder.products,
          order_date: sheetOrder.order_date,
          status: 'pending'
        });

        logger.info(`✅ Commande importée (${orderId}) ${sheetOrder.customer_name}`);
        continue;
      }

      // 🔁 Mise à jour statut si annulée dans Sheets
      const sheetStatus = (sheetOrder.status || '').toLowerCase();
      if (
        ['annule', 'annulé', 'annulee', 'cancelled', 'canceled'].includes(sheetStatus) &&
        existing.status !== 'cancelled'
      ) {
        await OrderDB.updateStatus(existing.id, 'cancelled', 'Annulée dans Google Sheets');
        logger.info(`🚫 Annulation synchronisée (id=${existing.id})`);
      }
    }

  } catch (err) {
    logger.error('❌ Erreur syncOrders:', err);
  }
}

/**
 * 📞 Traitement des commandes en attente
 */
async function processaPendingOrders() {
  if (isProcessing) return;

  if (!isBotEnabled()) {
    logger.info('⛔ Bot OFF — automation suspendue');
    return;
  }

  try {
    isProcessing = true;
    logTimeStatus();

    const pendingOrders = await OrderDB.getPending();

    if (!pendingOrders.length) {
      logger.info('📭 Aucune commande à traiter');
      return;
    }

    for (const order of pendingOrders) {
      if (order.call_attempts >= 3) {
        await OrderDB.updateStatus(order.id, 'failed', 'Max tentatives atteint');
        await updateOrderStatus(order.sheet_row, 'failed', 'Client injoignable');
        continue;
      }

      if (isCallTimeAllowed()) {
        logger.info(`📞 Appel IA → ${order.customer_name}`);
        await makeAutomatedCall(order);
        await new Promise(r => setTimeout(r, 30000));
      } 
      else if (isMessageTimeAllowed()) {
        logger.info(`💬 Message IA → ${order.customer_name}`);
        await sendAutomatedMessage(order);
        await new Promise(r => setTimeout(r, 10000));
      }
    }

  } catch (err) {
    logger.error('❌ Erreur processaPendingOrders:', err);
  } finally {
    isProcessing = false;
  }
}

/**
 * ▶️ Démarrage automation
 */
function startAutomation() {
  logger.info('🤖 Automation démarrée');

  const interval = parseInt(process.env.CHECK_INTERVAL) || 5;

  cron.schedule(`*/${interval} * * * *`, async () => {
    await syncOrders();
    await processaPendingOrders();
  });

  setTimeout(async () => {
    await syncOrders();
    await processaPendingOrders();
  }, 5000);
}

/**
 * ℹ️ Statut automation
 */
function getAutomationStatus() {
  return {
    isProcessing,
    callTimeAllowed: isCallTimeAllowed(),
    messageTimeAllowed: isMessageTimeAllowed(),
    checkInterval: process.env.CHECK_INTERVAL || 5,
    callHours: `${process.env.CALL_START_HOUR}h - ${process.env.CALL_END_HOUR}h`,
    messageHours: `${process.env.MESSAGE_START_HOUR}h - ${process.env.MESSAGE_END_HOUR}h`
  };
}

module.exports = {
  startAutomation,
  syncOrders,
  processaPendingOrders,
  getAutomationStatus
};
