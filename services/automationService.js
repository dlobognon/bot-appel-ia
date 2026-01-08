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
 * 🔄 Synchronisation Google Sheets → Base locale
 * → Toute nouvelle ligne est importée avec status = 'neutre'
 */
async function syncOrders() {
  try {
    logger.info('🔄 syncOrders lancé');

    const sheetOrders = await getOrders();
    const dbOrders = await OrderDB.getAll(1000);
    const dbByRow = new Map(dbOrders.map(o => [o.sheet_row, o]));

    let imported = 0;

    for (const sheetOrder of sheetOrders) {
      if (!sheetOrder.sheet_row || !sheetOrder.customer_phone) continue;

      if (!dbByRow.has(sheetOrder.sheet_row)) {
        await OrderDB.create({
          sheet_row: sheetOrder.sheet_row,
          customer_name: sheetOrder.customer_name || 'Client',
          customer_phone: String(sheetOrder.customer_phone).trim(),
          delivery_address: sheetOrder.delivery_address || '',
          products: sheetOrder.products || '',
          order_date: sheetOrder.order_date || new Date().toISOString(),
          status: 'Neutre' // 🔴 STATUT UNIQUE À TRAITER
        });

        imported++;
        logger.info(`✅ Import commande NEUTRE: sheet_row=${sheetOrder.sheet_row}`);
      }
    }

    logger.info(`📥 syncOrders terminé: +${imported} commande(s) neutre(s)`);

  } catch (err) {
    logger.error('❌ Erreur syncOrders:', err);
  }
}

/**
 * 📞 Traitement des commandes NEUTRES uniquement
 */
async function processaPendingOrders() {
  if (isProcessing) {
    logger.info('⏳ Automation déjà en cours, skip');
    return;
  }

  if (!isBotEnabled()) {
    logger.info('⛔ Bot OFF — aucune action');
    return;
  }

  try {
    isProcessing = true;
    logTimeStatus();

    // 🔴 ICI LA MODIFICATION CLÉ
    const orders = await OrderDB.getAll(500);
    const neutralOrders = orders.filter(o => o.status === 'neutre');

    logger.info(
      `🤖 BOT LOOP | neutre=${neutralOrders.length} | callAllowed=${isCallTimeAllowed()} | msgAllowed=${isMessageTimeAllowed()}`
    );

    if (!neutralOrders.length) {
      logger.info('📭 Aucune commande NEUTRE à traiter');
      return;
    }

    for (const order of neutralOrders) {
      if (order.call_attempts >= 3) {
        logger.info(`⚠️ Max tentatives atteint (id=${order.id})`);
        await OrderDB.updateStatus(order.id, 'failed', 'Max tentatives atteint');
        if (order.sheet_row) {
          await updateOrderStatus(order.sheet_row, 'failed', 'Client injoignable');
        }
        continue;
      }

      let didSomething = false;

      if (isCallTimeAllowed()) {
        logger.info(`📞 Appel IA (NEUTRE) → ${order.customer_name} ${order.customer_phone}`);
        await makeAutomatedCall(order);
        didSomething = true;
      } else if (isMessageTimeAllowed()) {
        logger.info(`💬 Message IA (NEUTRE) → ${order.customer_name} ${order.customer_phone}`);
        await sendAutomatedMessage(order);
        didSomething = true;
      } else {
        logger.info(`⏰ Hors horaires — commande NEUTRE id=${order.id}`);
      }

      if (didSomething) {
        await sleep(isCallTimeAllowed() ? 30000 : 10000);
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
  logger.info('🤖 Automation démarrée (STATUT = NEUTRE)');

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

/**
 * ℹ️ Statut automation
 */
function getAutomationStatus() {
  return {
    isProcessing,
    botEnabled: isBotEnabled(),
    treatedStatus: 'neutre',
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
