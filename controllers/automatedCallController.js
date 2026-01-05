const twilio = require('twilio');
const logger = require('../utils/logger');
const { OrderDB, CallDB } = require('../config/database');
const { updateOrderStatus, addNote } = require('../services/googleSheets');
const { isBotEnabled } = require('../config/botState');

const VoiceResponse = twilio.twiml.VoiceResponse;

/**
 * Lancer un appel automatique IA
 */
async function makeAutomatedCall(order) {
  if (!isBotEnabled()) {
    logger.info('⛔ Bot OFF — appel ignoré');
    return;
  }

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const call = await client.calls.create({
      to: order.customer_phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      url: `${process.env.BASE_URL}/api/automated/voice?orderId=${order.id}`,
      statusCallback: `${process.env.BASE_URL}/api/automated/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST'
    });

    await CallDB.create({
      order_id: order.id,
      call_sid: call.sid,
      status: 'initiated'
    });

    await OrderDB.incrementCallAttempts(order.id);
    logger.info(`📞 Appel lancé pour ${order.customer_name}`);

  } catch (error) {
    logger.error('Erreur makeAutomatedCall:', error.message);
  }
}

/**
 * Webhook vocal Twilio (début appel) — Media Streams (WSS)
 */
async function handleVoiceWebhook(req, res) {
  const orderId = req.query.orderId;
  const response = new VoiceResponse();

  response.say(
    { voice: 'alice', language: 'fr-FR' },
    "Bonjour. Un instant s'il vous plaît."
  );

  // BASE_URL: https://web-production-13730.up.railway.app
  const base = process.env.BASE_URL || `https://${req.headers.host}`;
  const wsBase = base.replace(/^https?:\/\//, 'wss://');
  const wsUrl = `${wsBase}/ws/voice?orderId=${encodeURIComponent(orderId || '')}`;

  response.connect().stream({ url: wsUrl });

  res.type('text/xml');
  res.send(response.toString());
}

/**
 * Réponse vocale client (legacy Gather — conservé mais non utilisé si Media Streams)
 */
async function handleCustomerResponse(req, res) {
  const orderId = req.query.orderId;
  const speech = (req.body.SpeechResult || '').toLowerCase();
  const order = await OrderDB.getById(orderId);

  const response = new VoiceResponse();

  if (!order) {
    response.say({ language: 'fr-FR', voice: 'alice' }, "Commande introuvable.");
    response.hangup();
    return res.type('text/xml').send(response.toString());
  }

  // 👉 ANNULATION
  if (speech.includes('annuler')) {
    response.say({ language: 'fr-FR', voice: 'alice' },
      "Souhaitez-vous annuler la commande ? Dites oui ou non.");

    response.gather({
      input: 'speech',
      language: 'fr-FR',
      speechTimeout: 'auto',
      speechModel: 'phone_call',
      action: `/api/automated/confirm-cancel?orderId=${order.id}`,
      method: 'POST'
    });

    return res.type('text/xml').send(response.toString());
  }

  // 👉 CONFIRMATION
  if (speech.includes('confirmer') || speech.includes('oui')) {
    await OrderDB.updateStatus(order.id, 'confirmed', 'Confirmée par appel IA');
    await updateOrderStatus(order.sheet_row, 'confirmée', 'Confirmée par appel IA');

    response.say({ language: 'fr-FR', voice: 'alice' },
      "Merci. Votre commande est confirmée. Vous serez livré comme prévu.");
    response.hangup();
    return res.type('text/xml').send(response.toString());
  }

  response.say({ language: 'fr-FR', voice: 'alice' },
    "Je n'ai pas bien compris. Pouvez-vous répéter ?");

  response.gather({
    input: 'speech',
    language: 'fr-FR',
    speechTimeout: 'auto',
    speechModel: 'phone_call',
    action: `/api/automated/respond?orderId=${order.id}`,
    method: 'POST'
  });

  res.type('text/xml').send(response.toString());
}

/**
 * Confirmation OUI / NON annulation (legacy Gather)
 */
async function handleCancelConfirmation(orderId, speech) {
  const response = new VoiceResponse();
  const text = (speech || '').toLowerCase();

  if (text.includes('oui')) {
    await OrderDB.updateStatus(orderId, 'cancelled', 'Annulée par client');
    const order = await OrderDB.getById(orderId);

    if (order) {
      await updateOrderStatus(order.sheet_row, 'annulée', 'Annulée par client');
      await addNote(order.sheet_row, 'Commande annulée par le client pendant appel.');
    }

    response.say({ language: 'fr-FR', voice: 'alice' },
      "D'accord. La commande est annulée. Merci.");
    response.hangup();
    return response.toString();
  }

  response.say({ language: 'fr-FR', voice: 'alice' },
    "Très bien. Nous continuons la commande.");

  response.hangup();
  return response.toString();
}

/**
 * Status Twilio
 */
async function handleCallStatus(req, res) {
  logger.info('📞 Statut appel:', req.body.CallStatus);
  res.sendStatus(200);
}

module.exports = {
  makeAutomatedCall,
  handleVoiceWebhook,
  handleCustomerResponse,
  handleCancelConfirmation,
  handleCallStatus
};
