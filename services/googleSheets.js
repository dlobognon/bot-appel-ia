const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

let sheets = null;
let auth = null;

/**
 * Normaliser un numéro de téléphone ivoirien
 * - Si 9 chiffres : ajoute 0 devant puis +225
 * - Si 10 chiffres : ajoute +225
 * - Si commence déjà par +225 : garde tel quel
 * - Sinon : retourne tel quel
 */
function normalizeIvorianPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.toString().trim().replace(/[\s\-\.()]/g, '');

  // Déjà E.164
  if (cleaned.startsWith('+225')) return cleaned;

  // Si commence par 225 (sans +)
  if (cleaned.startsWith('225')) return '+' + cleaned;

  const digitsOnly = cleaned.replace(/\D/g, '');

  // Côte d'Ivoire (plan 2021): NSN 10 chiffres
  if (digitsOnly.length === 10) return '+225' + digitsOnly;

  // Ancien plan: 8 chiffres (best effort)
  if (digitsOnly.length === 8) return '+225' + digitsOnly;

  return digitsOnly ? ('+225' + digitsOnly) : '';
}

/**
 * Initialiser l'authentification Google Sheets
 */
async function initGoogleSheets() {
  try {
    let credentials;

    // Option 1: Lire depuis la variable d'environnement (Railway)
    if (process.env.GOOGLE_CREDENTIALS_JSON) {
      try {
        credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
      } catch (err) {
        logger.error('Erreur parsing GOOGLE_CREDENTIALS_JSON:', err.message);
        return false;
      }
    } else {
      // Option 2: Lire depuis le fichier local (développement)
      const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json';
      
      if (!fs.existsSync(credentialsPath)) {
        logger.error('Fichier credentials.json non trouvé. Consultez GOOGLE_SHEETS_SETUP.md');
        return false;
      }

      credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    }
    
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    sheets = google.sheets({ version: 'v4', auth });
    logger.info('✅ Google Sheets API initialisée');
    return true;
  } catch (error) {
    logger.error('Erreur initialisation Google Sheets:', error.message);
    return false;
  }
}

/**
 * Récupérer toutes les commandes depuis Google Sheets
 */
async function getOrders() {
  try {
    if (!sheets) {
      await initGoogleSheets();
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // Lire les données de la feuille (ajustez le range selon votre structure)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Commandes!A2:I', // A jusqu'à I (9 colonnes)
    });

    const rows = response.data.values || [];
    
    // LOG DEBUG: Afficher les données brutes
    logger.info(`📋 Nombre total de lignes dans le sheet: ${rows.length}`);
    if (rows.length > 0) {
      logger.info(`🔍 Première ligne (exemple): ${JSON.stringify(rows[0])}`);
    }
    
    // Transformer les lignes en objets
    const allOrders = rows.map((row, index) => {
      const rawPhone = row[2] || '';
      const normalizedPhone = normalizeIvorianPhone(rawPhone);
      
      return {
        sheet_row: index + 2, // +2 car on commence à la ligne 2
        order_date: row[0] || new Date().toISOString(), // Col A
        customer_name: row[1] || '', // Col B
        customer_phone: normalizedPhone, // Col C
        delivery_address: row[3] || '', // Col D
        notes: row[4] || '', // Col E
        products: row[5] || '', // Col F
        price: row[6] || '', // Col G
        status: (row[7] || 'neutre').toLowerCase().trim(), // Col H (Statuts)
        comments: row[8] || '' // Col I (Comments bot - peut être vide)
      };
    });
    
    // LOG DEBUG: Afficher tous les statuts trouvés
    const statuts = allOrders.map(o => o.status);
    logger.info(`📊 Statuts trouvés: ${JSON.stringify([...new Set(statuts)])}`);
    
    // Retourner TOUTES les commandes avec téléphone
    // Le filtrage par statut se fait maintenant dans syncOrders()
    const orders = allOrders.filter(order => order.customer_phone);

    logger.info(`📊 ${orders.length} commandes avec téléphone récupérées depuis Google Sheets`);
    return orders;
  } catch (error) {
    logger.error('Erreur récupération commandes:', error.message);
    throw error;
  }
}

/**
 * Mettre à jour le statut d'une commande dans Google Sheets
 */
async function updateOrderStatus(rowNumber, status, notes = '') {
  try {
    if (!sheets) {
      await initGoogleSheets();
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // Mettre à jour les colonnes H (statut) et I (comments)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Commandes!H${rowNumber}:I${rowNumber}`,
      valueInputOption: 'RAW',
      resource: {
        values: [[status, notes]]
      }
    });

    logger.info(`✅ Statut mis à jour pour la ligne ${rowNumber}: ${status}`);
  } catch (error) {
    logger.error('Erreur mise à jour statut:', error.message);
    throw error;
  }
}

/**
 * Ajouter une note à une commande
 */
async function addNote(rowNumber, note) {
  try {
    if (!sheets) {
      await initGoogleSheets();
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // Lire la note existante en colonne I (comments)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Commandes!I${rowNumber}`
    });

    const existingNote = response.data.values?.[0]?.[0] || '';
    const newNote = existingNote 
      ? `${existingNote}\n${new Date().toLocaleString('fr-FR')}: ${note}`
      : `${new Date().toLocaleString('fr-FR')}: ${note}`;

    // Mettre à jour
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Commandes!I${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[newNote]]
      }
    });

    logger.info(`✅ Note ajoutée à la ligne ${rowNumber}`);
  } catch (error) {
    logger.error('Erreur ajout note:', error.message);
    throw error;
  }
}

/**
 * Créer une structure de feuille si elle n'existe pas
 */
async function setupSheetStructure() {
  try {
    if (!sheets) {
      await initGoogleSheets();
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // Créer les en-têtes si la feuille est vide
    const headers = [
      'Date',      // A
      'Nom du client', // B
      'Numéro',    // C
      'Lieu de livraison', // D
      'Note',      // E
      'Produits',  // F
      'Prix',      // G
      'Statuts',   // H (statut: neutre, injoignable, confirmé, etc.)
      'Comments'   // I (notes du bot)
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Commandes!A1:I1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [headers]
      }
    });

    logger.info('✅ Structure de la feuille configurée');
  } catch (error) {
    logger.error('Erreur configuration feuille:', error.message);
  }
}

module.exports = {
  initGoogleSheets,
  getOrders,
  updateOrderStatus,
  addNote,
  setupSheetStructure,
  normalizeIvorianPhone
};
