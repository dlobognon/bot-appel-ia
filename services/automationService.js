const cron = require('node-cron');
const logger = require('../utils/logger');
const { getOrders, updateOrderStatus, addNote } = require('./googleSheets');
const { OrderDB, CallDB } = require('../config/database');
const { isCallTimeAllowed, isMessageTimeAllowed, logTimeStatus } = require('../utils/timeManager');
const { makeAutomatedCall, sendAutomatedMessage } = require('../controllers/automatedCallController');

let isProcessing = false;

/**
 * Synchroniser les nouvelles commandes depuis Google Sheets
 */
async function syncOrders() {
  try {
    logger.info('🔄 Synchronisation des commandes depuis Google Sheets...');
    
    const sheetOrders = await getOrders();
    const existingOrders = await OrderDB.getAll();
    
    // Si la base est vide, accepter tous les statuts valides pour bootstrap
    const isBootstrap = existingOrders.length === 0;
    
    for (const sheetOrder of sheetOrders) {
      // Vérifier si la commande existe déjà
      const exists = existingOrders.find(o => o.sheet_row === sheetOrder.sheet_row);
      
      if (!exists && sheetOrder.customer_phone) {
        // Statuts valides pour import
        const validStatuses = isBootstrap 
          ? ['neutre', 'injoignable', 'imported'] // Bootstrap: accepter imported aussi
          : ['neutre', 'injoignable']; // Normal: uniquement neutre/injoignable
        
        if (!validStatuses.includes(sheetOrder.status)) {
          logger.info(`⏭️ Commande ignorée (statut: ${sheetOrder.status}): ${sheetOrder.customer_name}`);
          continue;
        }
        
        // Nouvelle commande à traiter
        const orderId = await OrderDB.create({
          sheet_row: sheetOrder.sheet_row,
          customer_name: sheetOrder.customer_name,
          customer_phone: sheetOrder.customer_phone,
          delivery_address: sheetOrder.delivery_address,
          products: sheetOrder.products,
          order_date: sheetOrder.order_date
        });
        
        logger.info(`✅ Nouvelle commande importée: ${sheetOrder.customer_name} - ${sheetOrder.products}`);
        
        // NE PLUS marquer comme imported dans Google Sheets
        // Le statut reste "neutre" ou ce qu'il était, pour permettre la réimportation
      }
    }
    
    logger.info(`📊 Import terminé: ${existingOrders.length} commandes en base`);
    
  } catch (error) {
    logger.error('Erreur synchronisation commandes:', error.message);
  }
}

/**
 * Traiter les commandes en attente
 */
async function processaPendingOrders() {
  if (isProcessing) {
    logger.info('⏳ Traitement déjà en cours, passage...');
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

    logger.info(`📋 ${pendingOrders.length} commande(s) en attente de traitement`);

    for (const order of pendingOrders) {
      // Vérifier le nombre de tentatives
      if (order.call_attempts >= 3) {
        logger.info(`⚠️ Commande ${order.id} - 3 tentatives atteintes, passage en échec`);
        await OrderDB.updateStatus(order.id, 'failed', 'Maximum de tentatives atteint');
        await updateOrderStatus(order.sheet_row, 'failed', 'Client injoignable après 3 tentatives');
        continue;
      }

      // Décider entre appel ou message selon l'heure
      if (isCallTimeAllowed()) {
        logger.info(`📞 Appel automatique pour: ${order.customer_name}`);
        await makeAutomatedCall(order);
        
        // Attendre 30 secondes entre chaque appel
        await new Promise(resolve => setTimeout(resolve, 30000));
        
      } else if (isMessageTimeAllowed()) {
        logger.info(`💬 Message vocal pour: ${order.customer_name}`);
        await sendAutomatedMessage(order);
        
        // Attendre 10 secondes entre chaque message
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
  } catch (error) {
    logger.error('Erreur traitement commandes:', error.message);
  } finally {
    isProcessing = false;
  }
}

/**
 * Démarrer le système de traitement automatique
 */
function startAutomation() {
  logger.info('🤖 Démarrage du système d\'appels automatiques...');
  
  // Synchronisation des commandes toutes les 5 minutes
  const checkInterval = parseInt(process.env.CHECK_INTERVAL) || 5;
  cron.schedule(`*/${checkInterval} * * * *`, async () => {
    await syncOrders();
    await processaPendingOrders();
  });

  logger.info(`✅ Automation configurée (vérification toutes les ${checkInterval} minutes)`);
  logger.info(`⏰ Horaires d'appels: ${process.env.CALL_START_HOUR}h - ${process.env.CALL_END_HOUR}h`);
  logger.info(`💬 Horaires de messages: ${process.env.MESSAGE_START_HOUR}h - ${process.env.MESSAGE_END_HOUR}h`);
  
  // Premier lancement immédiat
  setTimeout(async () => {
    await syncOrders();
    await processaPendingOrders();
  }, 5000);
}

/**
 * Status du système d'automation
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
