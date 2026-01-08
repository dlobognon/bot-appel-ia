const cron = require('node-cron');
const logger = require('../utils/logger');
const { getOrders, updateOrderStatus, addNote } = require('./googleSheets');
const { OrderDB } = require('../config/database');
const { isCallTimeAllowed, isMessageTimeAllowed, logTimeStatus } = require('../utils/timeManager');
const { isBotEnabled } = require('../config/botState');
const { makeAutomatedCall, sendAutomatedMessage } = require('../controllers/automatedCallController');

let isProcessing = false;

/**
 * 🔄 Synchroniser les commandes depuis Google Sheets
 */
async function syncOrders() {
  try {
    logger.info('🔄 syncOrders lancé');

    const sheetOrders = await getOrders();
    const existingOrders = await OrderDB.getAll();

    for (const sheetOrder of sheetOrders) {
      console.log('🧾 SHEET ORDER:', sheetOrder);

      const exists = existingOrders.find(
        o => o.sheet_row === sheetOrder.sheet_row
      );

      if (!exists && sheetOrder.customer_phone) {
        const statusSheet = (sheetOrder.status || '').toString().trim().toLowerCase();

        logger.info(
          `📥 Import commande: ${sheetOrder.customer_name} | statut sheet="${statusSheet}"`
        );

        const orderId = await OrderDB.create({
          sheet_row: sheetOrder.sheet_row,
          customer_name: sheetOrder.customer_name,
          customer_phone: sheetOrder.customer_phone,
          delivery_address: sheetOrder.delivery_address,
          products: sheetOrder.products,
          order_date: sheetOrder.order_date,
          status: 'pending'
        });

        logger.info(`✅ Commande importée ID=${orderId}`);
      }
    }

    // 🔁 Synchroniser suppressions / annulations
    for (const dbOrder of existingOrders) {
      const stillExists = sheetOrders.find(
        s => s.sheet_row === dbOrder.sheet_row
      );

      if (!stillExists) {
        await OrderDB.updateStatus(dbOrder.id, 'deleted', 'Supprimée dans Google Sheets');
        logger.info(`🗑️ Commande supprimée Sheet → Bot (id=${dbOrder.id})`);
        continue;
      }

      const sheetStatus = (stillExists.status || '').toLowerCase();
      if (['annulee', 'annulé', 'annule', 'cancelled', 'canceled'].includes(sheetStatus)) {
        await OrderDB.updateStatus(dbOrder.id, 'cancelled', 'Annulée dans Google Sheets');
        logger.info(`🚫 Commande annulée Sheet → Bot (id=${dbOrder.id})`);
      }
    }

  } catch (error) {
    logger.error('❌ Erreur syncOrders:', error);
  }
}

/**
 * 📞 Traiter les commandes en attente
 */
async function processaPendingOrders() {
  if (isProcessing) return;

  if (!isBotEnabled()) {
    logger.info('⛔ Bot OFF — aucun appel/message');
    return;
  }

  try {
    isProcessing = true;
    logTimeStatus();

    const pendingOrders = await OrderDB.getPending();

    if (pendingOrders.length === 0) {
      logger.info('📭 Aucune commande en attente');
      return;
    }

    logger.info(`📋 ${pendingOrders.length} commande(s) à traiter`);

    for (const order of pendingOrders) {
      if (order.call_attempts >= 3) {
        await OrderDB.updateStatus(order.id, 'failed', 'Maximum tentatives atteint');
        await updateOrderStatus(order.sheet_row, 'failed', 'Client injoignable');
        continue;
      }

      if (isCallTimeAllowed()) {
        logger.info(`📞 Appel IA → ${order.customer_name}`);
        await makeAutomatedCall(order);
        await new Promise(r => setTimeout(r, 30000));
      } else if (isMessageTimeAllowed()) {
        logger.info(`💬 Message IA → ${order.customer_name}`);
        await sendAutomatedMessage(order);
        await new Promise(r => setTimeout(r, 10000));
      }
    }

  } catch (error) {
    logger.error('❌ Erreur processPendingOrders:', error);
  } finally {
    isProcessing = false;
  }
}

/**
 * ▶️ Démarrage de l'automation
 */
function startAutomation() {
  logger.info('🤖 Automation démarrée');

  const checkInterval = parseInt(process.env.CHECK_INTERVAL) || 5;

  cron.schedule(`*/${checkInterval} * * * *`, async () => {
    await syncOrders();
    await processaPendingOrders();
  });

  setTimeout(async () => {
    await syncOrders();
    await processaPendingOrders();
  }, 5000);
}

/**
 * ℹ️ Status automation
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
