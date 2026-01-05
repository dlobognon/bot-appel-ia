const twilio = require('twilio');
const logger = require('../utils/logger');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Historique des appels
let callHistory = [];

/**
 * Initier un appel sortant
 */
async function makeCall(toNumber, messageUrl = null) {
  try {
    const callOptions = {
      to: toNumber,
      from: twilioPhoneNumber,
      url: messageUrl || `${process.env.BASE_URL}/api/calls/voice`,
      statusCallback: `${process.env.BASE_URL}/api/calls/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST'
    };

    const call = await client.calls.create(callOptions);
    
    logger.info(`Appel initié: ${call.sid} vers ${toNumber}`);
    
    // Ajouter à l'historique
    callHistory.push({
      sid: call.sid,
      to: toNumber,
      from: twilioPhoneNumber,
      status: call.status,
      direction: 'outbound',
      timestamp: new Date()
    });

    return {
      success: true,
      callSid: call.sid,
      status: call.status
    };
  } catch (error) {
    logger.error(`Erreur lors de l'appel: ${error.message}`);
    throw error;
  }
}

/**
 * Gérer un appel entrant
 */
function handleIncomingCall() {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  // Message de bienvenue
  response.say(
    {
      voice: 'alice',
      language: 'fr-FR'
    },
    'Bonjour et bienvenue. Votre appel est important pour nous.'
  );

  // Menu interactif
  const gather = response.gather({
    input: 'dtmf',
    numDigits: 1,
    action: '/api/calls/menu',
    method: 'POST'
  });

  gather.say(
    {
      voice: 'alice',
      language: 'fr-FR'
    },
    'Appuyez sur 1 pour parler à un conseiller. Appuyez sur 2 pour laisser un message. Appuyez sur 3 pour plus d\'informations.'
  );

  // Si aucune saisie
  response.say(
    {
      voice: 'alice',
      language: 'fr-FR'
    },
    'Nous n\'avons pas reçu votre saisie. Au revoir.'
  );

  return response.toString();
}

/**
 * Gérer le menu de l'appel
 */
function handleMenuSelection(digit) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  switch (digit) {
    case '1':
      // Transférer vers un conseiller
      response.say(
        {
          voice: 'alice',
          language: 'fr-FR'
        },
        'Nous vous mettons en relation avec un conseiller. Veuillez patienter.'
      );
      response.dial('+33123456789'); // Numéro du conseiller
      break;

    case '2':
      // Enregistrer un message vocal
      response.say(
        {
          voice: 'alice',
          language: 'fr-FR'
        },
        'Veuillez laisser votre message après le bip sonore.'
      );
      response.record({
        maxLength: 120,
        action: '/api/calls/recording',
        transcribe: true,
        transcribeCallback: '/api/calls/transcription'
      });
      break;

    case '3':
      // Informations
      response.say(
        {
          voice: 'alice',
          language: 'fr-FR'
        },
        'Nos horaires d\'ouverture sont du lundi au vendredi, de 9 heures à 18 heures. Vous pouvez également nous contacter par email.'
      );
      response.say(
        {
          voice: 'alice',
          language: 'fr-FR'
        },
        'Merci et à bientôt.'
      );
      response.hangup();
      break;

    default:
      response.say(
        {
          voice: 'alice',
          language: 'fr-FR'
        },
        'Saisie invalide. Au revoir.'
      );
      response.hangup();
  }

  return response.toString();
}

/**
 * Gérer le statut de l'appel
 */
function handleCallStatus(callData) {
  logger.info(`Statut de l'appel ${callData.CallSid}: ${callData.CallStatus}`);
  
  // Mettre à jour l'historique
  const callIndex = callHistory.findIndex(c => c.sid === callData.CallSid);
  if (callIndex !== -1) {
    callHistory[callIndex].status = callData.CallStatus;
    callHistory[callIndex].duration = callData.CallDuration;
  }

  return { received: true };
}

/**
 * Gérer l'enregistrement
 */
function handleRecording(recordingData) {
  logger.info(`Enregistrement reçu: ${recordingData.RecordingSid}`);
  
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  
  response.say(
    {
      voice: 'alice',
      language: 'fr-FR'
    },
    'Merci pour votre message. Nous vous rappellerons dans les plus brefs délais. Au revoir.'
  );
  response.hangup();

  return response.toString();
}

/**
 * Obtenir l'historique des appels
 */
async function getCallHistory(limit = 50) {
  try {
    const calls = await client.calls.list({ limit });
    return calls.map(call => ({
      sid: call.sid,
      from: call.from,
      to: call.to,
      status: call.status,
      direction: call.direction,
      duration: call.duration,
      startTime: call.startTime,
      endTime: call.endTime
    }));
  } catch (error) {
    logger.error(`Erreur lors de la récupération de l'historique: ${error.message}`);
    throw error;
  }
}

/**
 * Obtenir les statistiques
 */
function getStats() {
  const total = callHistory.length;
  const completed = callHistory.filter(c => c.status === 'completed').length;
  const failed = callHistory.filter(c => c.status === 'failed' || c.status === 'busy' || c.status === 'no-answer').length;
  const inProgress = callHistory.filter(c => c.status === 'in-progress' || c.status === 'ringing').length;

  return {
    total,
    completed,
    failed,
    inProgress,
    successRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0
  };
}

module.exports = {
  makeCall,
  handleIncomingCall,
  handleMenuSelection,
  handleCallStatus,
  handleRecording,
  getCallHistory,
  getStats,
  callHistory
};
