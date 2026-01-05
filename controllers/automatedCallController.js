const twilio = require('twilio');
const logger = require('../utils/logger');
const { OrderDB, CallDB } = require('../config/database');
const { updateOrderStatus, addNote, normalizeIvorianPhone } = require('../services/googleSheets');
const { 
  generateOpeningMessage, 
  generateResponse, 
  analyzeCustomerIntent,
  generateConversationSummary,
  generateVoicemailMessage 
} = require('../services/aiService');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Stocker les contextes d'appel actifs
const activeCallContexts = new Map();

/**
 * Faire un appel automatique pour une commande
 */
async function makeAutomatedCall(order) {
  try {
    const normalizedPhone = normalizeIvorianPhone(order.customer_phone);
    logger.info(`📞 Initiation appel pour ${order.customer_name} (${normalizedPhone})`);

    const call = await client.calls.create({
      to: normalizedPhone,
      from: twilioPhoneNumber,
      url: `${process.env.BASE_URL}/api/automated/voice?orderId=${order.id}`,
      statusCallback: `${process.env.BASE_URL}/api/automated/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      record: true,
      recordingStatusCallback: `${process.env.BASE_URL}/api/automated/recording`
    });

    // Enregistrer l'appel dans la base
    await CallDB.create({
      order_id: order.id,
      call_sid: call.sid,
      phone_number: normalizedPhone,
      call_date: new Date().toISOString()
    });

    // Stocker le contexte
    activeCallContexts.set(call.sid, {
      orderId: order.id,
      orderDetails: order,
      startTime: new Date()
    });

    await OrderDB.incrementCallAttempts(order.id, 'initiated');

    logger.info(`✅ Appel initié: ${call.sid}`);
    return call.sid;

  } catch (error) {
    logger.error(`❌ Erreur appel ${order.customer_name}:`, error.message);
    await OrderDB.incrementCallAttempts(order.id, 'failed');
    throw error;
  }
}

/**
 * Gérer le début de l'appel (webhook voice)
 */
async function handleVoiceWebhook(orderId) {
  try {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    // Récupérer les détails de la commande
    const order = await OrderDB.getById(orderId);
    
    if (!order) {
      response.say({ voice: 'alice', language: 'fr-FR' }, 
        'Désolé, une erreur est survenue.');
      response.hangup();
      return response.toString();
    }

    // Générer le message d'ouverture avec l'IA
    const openingMessage = await generateOpeningMessage(order);

    // Dire le message d'ouverture
    response.say({ voice: 'alice', language: 'fr-FR' }, openingMessage);

    // Écouter la réponse du client
    response.gather({
      input: 'speech',
      language: 'fr-FR',
      speechTimeout: 'auto',
      action: `/api/automated/respond?orderId=${orderId}`,
      method: 'POST'
    });

    // Si pas de réponse
    response.say({ voice: 'alice', language: 'fr-FR' }, 
      'Je n\'ai pas entendu votre réponse. Je vous laisse un message. Au revoir.');
    response.hangup();

    return response.toString();

  } catch (error) {
    logger.error('Erreur webhook voice:', error.message);
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    response.say({ voice: 'alice', language: 'fr-FR' }, 
      'Désolé, une erreur est survenue. Merci de nous rappeler.');
    response.hangup();
    return response.toString();
  }
}

/**
 * Gérer les réponses du client pendant l'appel
 */
async function handleCustomerResponse(orderId, speechResult, callSid) {
  try {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    const order = await OrderDB.getById(orderId);
    
    if (!order) {
      response.say({ voice: 'alice', language: 'fr-FR' }, 'Erreur système. Au revoir.');
      response.hangup();
      return response.toString();
    }

    logger.info(`🗣️ Client (${order.customer_name}): ${speechResult}`);

    // Analyser l'intention
    const intent = await analyzeCustomerIntent(speechResult);

    // Générer une réponse avec l'IA
    const aiResponse = await generateResponse(callSid, speechResult, order);

    // Dire la réponse
    response.say({ voice: 'alice', language: 'fr-FR' }, aiResponse);

    // Décider de la suite selon l'intention
    switch (intent) {
      case 'confirm':
        // Client confirme - finaliser
        response.say({ voice: 'alice', language: 'fr-FR' }, 
          'Parfait ! Votre commande est confirmée. Merci et à bientôt !');
        response.hangup();
        
        await OrderDB.updateStatus(orderId, 'confirmed', 'Client a confirmé la commande');
        await updateOrderStatus(order.sheet_row, 'confirmed', 'Confirmé par téléphone - ' + aiResponse);
        break;

      case 'refuse':
        // Client refuse - terminer poliment
        response.say({ voice: 'alice', language: 'fr-FR' }, 
          'Je comprends. Merci pour votre temps. Au revoir.');
        response.hangup();
        
        await OrderDB.updateStatus(orderId, 'cancelled', 'Client a refusé la commande');
        await updateOrderStatus(order.sheet_row, 'cancelled', 'Refusé par téléphone - ' + speechResult);
        break;

      case 'unavailable':
        // Client pas disponible - proposer de rappeler
        response.say({ voice: 'alice', language: 'fr-FR' }, 
          'Pas de problème. Nous vous rappellerons plus tard. Bonne journée !');
        response.hangup();
        
        await OrderDB.updateStatus(orderId, 'retry', 'Client pas disponible, à rappeler');
        break;

      default:
        // Continuer la conversation
        response.gather({
          input: 'speech',
          language: 'fr-FR',
          speechTimeout: 'auto',
          action: `/api/automated/respond?orderId=${orderId}`,
          method: 'POST'
        });
        
        response.say({ voice: 'alice', language: 'fr-FR' }, 
          'Avez-vous d\'autres questions ?');
        break;
    }

    return response.toString();

  } catch (error) {
    logger.error('Erreur réponse client:', error.message);
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    response.say({ voice: 'alice', language: 'fr-FR' }, 
      'Désolé, problème technique. Nous vous rappellerons. Au revoir.');
    response.hangup();
    return response.toString();
  }
}

/**
 * Gérer le statut de l'appel
 */
async function handleCallStatus(callData) {
  try {
    const { CallSid, CallStatus, CallDuration } = callData;
    // Log détaillé pour diagnostiquer les échecs Twilio (geo-permissions, webhook inaccessible, etc.)
    const extraInfo = {
      errorCode: callData.ErrorCode,
      sipResponse: callData.SipResponseCode,
      to: callData.To,
      from: callData.From,
      answeredBy: callData.AnsweredBy
    };

    logger.info(
      `📊 Appel ${CallSid}: ${CallStatus}${CallDuration ? ` (${CallDuration}s)` : ''}`,
      extraInfo
    );

    // Mettre à jour dans la base
    await CallDB.update(CallSid, {
      status: CallStatus,
      duration: CallDuration || 0
    });

    // Si l'appel est terminé, nettoyer le contexte et générer un résumé
    if (CallStatus === 'completed') {
      const context = activeCallContexts.get(CallSid);
      
      if (context) {
        // Générer un résumé de la conversation
        const summary = await generateConversationSummary(CallSid);
        
        await CallDB.update(CallSid, {
          ai_summary: summary
        });

        // Ajouter une note dans Google Sheets
        const order = await OrderDB.getById(context.orderId);
        if (order) {
          await addNote(order.sheet_row, `Appel terminé (${CallDuration}s): ${summary}`);
        }

        activeCallContexts.delete(CallSid);
        logger.info(`📝 Résumé: ${summary}`);
      }
    }

    // Si pas de réponse ou occupé, marquer pour réessayer
    if (['no-answer', 'busy', 'failed'].includes(CallStatus)) {
      const context = activeCallContexts.get(CallSid);
      if (context) {
        await OrderDB.updateStatus(context.orderId, 'retry', `Appel ${CallStatus}`);
        activeCallContexts.delete(CallSid);
      }
    }

  } catch (error) {
    logger.error('Erreur statut appel:', error.message);
  }
}

/**
 * Gérer l'enregistrement de l'appel
 */
async function handleRecording(recordingData) {
  try {
    const { CallSid, RecordingUrl, RecordingSid } = recordingData;
    
    logger.info(`🎙️ Enregistrement disponible: ${RecordingSid}`);

    await CallDB.update(CallSid, {
      recording_url: RecordingUrl
    });

  } catch (error) {
    logger.error('Erreur enregistrement:', error.message);
  }
}

/**
 * Envoyer un message vocal automatique (si client pas joignable)
 */
async function sendAutomatedMessage(order) {
  try {
    logger.info(`💬 Envoi message vocal pour ${order.customer_name}`);

    const message = generateVoicemailMessage(order);

    const call = await client.calls.create({
      to: order.customer_phone,
      from: twilioPhoneNumber,
      twiml: `<Response>
        <Say voice="alice" language="fr-FR">${message}</Say>
        <Hangup/>
      </Response>`,
      statusCallback: `${process.env.BASE_URL}/api/automated/status`,
      statusCallbackMethod: 'POST'
    });

    await CallDB.create({
      order_id: order.id,
      call_sid: call.sid,
      phone_number: order.customer_phone,
      call_date: new Date().toISOString()
    });

    await OrderDB.incrementCallAttempts(order.id, 'message_sent');
    await addNote(order.sheet_row, 'Message vocal laissé');

    logger.info(`✅ Message envoyé: ${call.sid}`);

  } catch (error) {
    logger.error(`❌ Erreur envoi message ${order.customer_name}:`, error.message);
  }
}

module.exports = {
  makeAutomatedCall,
  handleVoiceWebhook,
  handleCustomerResponse,
  handleCallStatus,
  handleRecording,
  sendAutomatedMessage
};
