const logger = require('../utils/logger');

/**
 * Vérifier si on est dans les horaires d'appel
 */
function isCallTimeAllowed() {
  const now = new Date();
  const hour = now.getHours();
  
  const startHour = parseInt(process.env.CALL_START_HOUR) || 8;
  const endHour = parseInt(process.env.CALL_END_HOUR) || 18;
  
  return hour >= startHour && hour < endHour;
}

/**
 * Vérifier si on est dans les horaires de messages
 */
function isMessageTimeAllowed() {
  const now = new Date();
  const hour = now.getHours();
  
  const startHour = parseInt(process.env.MESSAGE_START_HOUR) || 6;
  const endHour = parseInt(process.env.MESSAGE_END_HOUR) || 20;
  
  return hour >= startHour && hour < endHour;
}

/**
 * Obtenir l'heure actuelle formatée
 */
function getCurrentTime() {
  return new Date().toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Obtenir le temps restant jusqu'à la prochaine fenêtre d'appel
 */
function getTimeUntilNextCallWindow() {
  const now = new Date();
  const hour = now.getHours();
  const startHour = parseInt(process.env.CALL_START_HOUR) || 8;
  const endHour = parseInt(process.env.CALL_END_HOUR) || 18;
  
  if (hour < startHour) {
    // Avant la fenêtre d'appel du jour
    const hoursUntil = startHour - hour;
    return { hours: hoursUntil, message: `Prochaine fenêtre dans ${hoursUntil}h` };
  } else if (hour >= endHour) {
    // Après la fenêtre d'appel, attendre demain
    const hoursUntil = 24 - hour + startHour;
    return { hours: hoursUntil, message: `Prochaine fenêtre demain à ${startHour}h` };
  } else {
    // Dans la fenêtre d'appel
    const hoursRemaining = endHour - hour;
    return { hours: hoursRemaining, message: `Fenêtre active, ${hoursRemaining}h restantes` };
  }
}

/**
 * Logger les informations d'horaire
 */
function logTimeStatus() {
  const callAllowed = isCallTimeAllowed();
  const messageAllowed = isMessageTimeAllowed();
  const currentTime = getCurrentTime();
  
  logger.info(`⏰ ${currentTime} - Appels: ${callAllowed ? '✅' : '❌'} | Messages: ${messageAllowed ? '✅' : '❌'}`);
  
  if (!callAllowed) {
    const timeInfo = getTimeUntilNextCallWindow();
    logger.info(`⏳ ${timeInfo.message}`);
  }
}

/**
 * Calculer le délai optimal avant le prochain appel
 * Retourne le délai en millisecondes
 */
function getOptimalCallDelay() {
  if (isCallTimeAllowed()) {
    // Dans la fenêtre d'appel, attendre 1 minute entre chaque appel
    return 60 * 1000;
  } else {
    // Hors fenêtre, attendre 5 minutes avant de revérifier
    return 5 * 60 * 1000;
  }
}

/**
 * Formater une durée en format lisible
 */
function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}min`;
  } else if (minutes > 0) {
    return `${minutes}min`;
  } else {
    return `${seconds}s`;
  }
}

module.exports = {
  isCallTimeAllowed,
  isMessageTimeAllowed,
  getCurrentTime,
  getTimeUntilNextCallWindow,
  logTimeStatus,
  getOptimalCallDelay,
  formatDuration
};
