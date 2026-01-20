const cron = require('node-cron');
const logger = require('../utils/logger');
const { getOrders, updateOrderStatus } = require('./googleSheets');
const { OrderDB } = require('../config/database');
const { isCallTimeAllowed, isMessageTimeAllowed, logTimeStatus } = require('../utils/timeManager');
const { isBotEnabled } = require('../config/botState');
const { makeAutomatedCall, sendAutomatedMessage } = require('../controllers/automatedCallController');

let isProcessing = false;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * 🔄 Synchronisation Google Sheets → DB
 * ✅ UNIQUEMENT statut EXACT = "Neutre"
 */
async function syncOrders() {
  try {
    logger.info('🔄 syncOrders (STATUT STRICT = "Neutre")');

    const sheetOrders = await getOrders();
    const dbOrders = await OrderDB.getAll(1000);
    const dbByRow = new Map(dbOrders.map(o => [o.sheet_row, o]));

    for (const sheetOrder of sheetOrders) {
      if (!sheetOrder.sheet_row || !sheetOrder.customer_phone) continue;

      // 🔴 TEST STRICT (CASSE RESPECTÉE)
      if (sheetOrder.status !== 'Neutre') continue;

      if (!dbByRow.has(sheetOrder.sheet_row)) {
        await OrderDB.create({
          sheet_row: sheetOrder.sheet_row,
          customer_name: sheetOrder.customer_name || 'Client',
          customer_phone: String(sheetOrder.customer_phone).trim(),
          delivery_address: sheetOrder.delivery_address || '',
          products: sheetOrder.products || '',
          order_date: sheetOrder.order_date || new Date().toISOString(),
          status: 'Neutre'
        });

        logger.info(`✅ Import NEUTRE STRICT → row=${sheetOrder.sheet_row}`);
      }
    }

  } catch (err) {
    logger.error('❌ Erreur syncOrders:', err);
  }
}

/**
 * 📞 Traitement des commandes
 * ✅ UNIQUEMENT status === "Neutre"
 */
async function processaPendingOrders() {
  if (isProcessing) return;

  if (!isBotEnabled()) {
    logger.info('⛔ Bot OFF — aucun traitement');
    return;
  }

  try {
    isProcessing = true;
    logTimeStatus();

    const orders = (await OrderDB.getAll(1000))
      .filter(o => o.status === 'Neutre');

    logger.info(`🤖 COMMANDES À TRAITER (Neutre EXACT) = ${orders.length}`);

    if (!orders.length) {
      logger.info('📭 Aucune commande "Neutre"');
      return;
    }

    for (const order of orders) {
      if (order.call_attempts >= 3) {
        await OrderDB.updateStatus(order.id, 'failed', 'Max tentatives atteint');
        await updateOrderStatus(order.sheet_row, 'failed', 'Client injoignable');
        continue;
      }

      if (isCallTimeAllowed()) {
        logger.info(`📞 Appel IA → ${order.customer_phone}`);
        await makeAutomatedCall(order);
        await sleep(30000);
      }
      else if (isMessageTimeAllowed()) {
        logger.info(`💬 Message IA → ${order.customer_phone}`);
        await sendAutomatedMessage(order);
        await sleep(10000);
      }
      else {
        logger.info(`⏰ Hors horaires (id=${order.id})`);
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
  logger.info('🤖 Automation démarrée (Neutre STRICT)');

  const interval = parseInt(process.env.CHECK_INTERVAL, 10) || 5;

  cron.schedule(`*/${interval} * * * *`, async () => {
    await syncOrders();
    await processaPendingOrders();
  });

  setTimeout(async () => {
    await syncOrders();
    await processaPendingOrders();
  }, 5000);
}

function getAutomationStatus() {
  return {
    isProcessing,
    callTimeAllowed: isCallTimeAllowed(),
    messageTimeAllowed: isMessageTimeAllowed(),
    checkInterval: process.env.CHECK_INTERVAL || 5,
  };
}

module.exports = {
  startAutomation,
  syncOrders,
  processaPendingOrders,
  getAutomationStatus
};
