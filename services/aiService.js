const OpenAI = require('openai');
const logger = require('../utils/logger');
const { ConversationDB } = require('../config/database');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Contexte système pour l'IA
const SYSTEM_PROMPT = `Tu es un assistant commercial téléphonique professionnel pour une entreprise de livraison de produits.

TON RÔLE:
- Appeler les clients qui ont passé commande pour confirmer leur commande
- Convaincre les clients hésitants avec professionnalisme et empathie
- Répondre aux questions sur les produits et la livraison
- Confirmer les détails de livraison (adresse, horaire)
- Être courtois, patient et persuasif

INFORMATIONS À COLLECTER:
1. Confirmation de la commande (oui/non)
2. Confirmation de l'adresse de livraison
3. Horaire préféré pour la livraison
4. Questions ou préoccupations du client

RÈGLES IMPORTANTES:
- Toujours être poli et professionnel
- Ne jamais forcer une vente
- Écouter attentivement les préoccupations
- Proposer des solutions aux objections
- Rester calme et positif
- Parler naturellement, comme un vrai humain
- Utiliser des phrases courtes et claires pour la synthèse vocale

STRUCTURE DE L'APPEL:
1. Salutation et présentation
2. Vérification de l'identité du client
3. Confirmation des détails de la commande
4. Répondre aux questions
5. Confirmer la livraison
6. Remerciement et au revoir

Si le client refuse catégoriquement, accepte avec grâce et termine poliment l'appel.`;

/**
 * Générer une réponse IA pour la conversation
 */
async function generateResponse(callSid, userMessage, orderDetails) {
  try {
    // Récupérer l'historique de conversation
    const history = await ConversationDB.getByCallSid(callSid);
    
    // Construire le contexte avec les détails de la commande
    const orderContext = `
DÉTAILS DE LA COMMANDE:
- Client: ${orderDetails.customer_name}
- Produits: ${orderDetails.products}
- Adresse de livraison: ${orderDetails.delivery_address}
- Date de commande: ${orderDetails.order_date}
`;

    // Construire les messages pour OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + orderContext },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: userMessage }
    ];

    // Appeler OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 150,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    });

    const aiResponse = completion.choices[0].message.content;

    // Sauvegarder dans l'historique
    await ConversationDB.add(callSid, 'user', userMessage);
    await ConversationDB.add(callSid, 'assistant', aiResponse);

    logger.info(`🤖 IA: ${aiResponse.substring(0, 100)}...`);
    return aiResponse;

  } catch (error) {
    logger.error('Erreur génération réponse IA:', error.message);
    
    // Réponse de secours
    return "Je vous écoute. Pouvez-vous répéter s'il vous plaît ?";
  }
}

/**
 * Générer le message d'ouverture personnalisé
 */
async function generateOpeningMessage(orderDetails) {
  try {
    const prompt = `Génère un message d'ouverture chaleureux et professionnel pour un appel téléphonique. 
    
Client: ${orderDetails.customer_name}
Produits commandés: ${orderDetails.products}

Le message doit:
- Saluer le client par son nom
- Te présenter comme l'assistant commercial
- Mentionner brièvement la commande
- Demander si c'est le bon moment pour parler
- Être naturel et court (2-3 phrases maximum)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Tu es un assistant commercial professionnel et courtois.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 100
    });

    return completion.choices[0].message.content;
  } catch (error) {
    logger.error('Erreur génération message ouverture:', error.message);
    
    // Message par défaut
    return `Bonjour ${orderDetails.customer_name}, je vous appelle concernant votre commande de ${orderDetails.products}. Est-ce que vous avez quelques minutes pour en discuter ?`;
  }
}

/**
 * Analyser la réponse du client pour déterminer l'intention
 */
async function analyzeCustomerIntent(message) {
  try {
    const prompt = `Analyse cette réponse d'un client lors d'un appel de confirmation de commande: "${message}"

Détermine l'intention principale parmi:
- "confirm": Le client confirme/accepte la commande
- "refuse": Le client refuse/annule la commande
- "question": Le client a une question
- "hesitant": Le client hésite, a des doutes
- "unavailable": Le client n'est pas disponible maintenant
- "other": Autre

Réponds uniquement avec le mot-clé correspondant.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 10
    });

    const intent = completion.choices[0].message.content.trim().toLowerCase();
    logger.info(`🎯 Intention détectée: ${intent}`);
    return intent;

  } catch (error) {
    logger.error('Erreur analyse intention:', error.message);
    return 'other';
  }
}

/**
 * Générer un résumé de la conversation
 */
async function generateConversationSummary(callSid) {
  try {
    const history = await ConversationDB.getByCallSid(callSid);
    
    if (history.length === 0) {
      return 'Aucune conversation enregistrée.';
    }

    const conversation = history
      .map(h => `${h.role === 'user' ? 'Client' : 'Assistant'}: ${h.content}`)
      .join('\n');

    const prompt = `Résume cette conversation téléphonique en 2-3 phrases, en indiquant:
- Si le client a confirmé ou refusé la commande
- Les principales préoccupations ou questions
- Les prochaines actions nécessaires

Conversation:
${conversation}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 150
    });

    return completion.choices[0].message.content;

  } catch (error) {
    logger.error('Erreur génération résumé:', error.message);
    return 'Résumé non disponible.';
  }
}

/**
 * Générer un message vocal à laisser sur répondeur
 */
function generateVoicemailMessage(orderDetails) {
  return `Bonjour ${orderDetails.customer_name}, 
  
Nous vous appelons concernant votre commande de ${orderDetails.products} que vous avez passée récemment. 

Nous souhaiterions confirmer les détails de livraison à ${orderDetails.delivery_address}. 

Pourriez-vous nous rappeler au ${process.env.TWILIO_PHONE_NUMBER} ou nous répondrons à votre prochain appel. 

Merci et à très bientôt !`;
}

module.exports = {
  generateResponse,
  generateOpeningMessage,
  analyzeCustomerIntent,
  generateConversationSummary,
  generateVoicemailMessage
};
