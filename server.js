require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const logger = require('./utils/logger');
const callRoutes = require('./routes/callRoutes');
const automatedRoutes = require('./routes/automatedRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { initGoogleSheets } = require('./services/googleSheets');
const { startAutomation } = require('./services/automationService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/calls', callRoutes);
app.use('/api/automated', automatedRoutes);
app.use('/api/orders', orderRoutes);

// Route de vérification
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bot d\'appel en ligne' });
});

// Page d'accueil
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue' });
});

// Démarrage du serveur
app.listen(PORT, async () => {
  logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`\n✅ Serveur en écoute sur http://localhost:${PORT}`);
  console.log(`✅ Interface de gestion: http://localhost:${PORT}`);
  
  // Initialiser Google Sheets
  const sheetsInitialized = await initGoogleSheets();
  if (sheetsInitialized) {
    console.log(`✅ Google Sheets connecté`);
    
    // Démarrer le système d'appels automatiques
    startAutomation();
    console.log(`✅ Système d'appels automatiques actif`);
    console.log(`⏰ Horaires d'appels: ${process.env.CALL_START_HOUR}h - ${process.env.CALL_END_HOUR}h`);
    console.log(`💬 Horaires de messages: ${process.env.MESSAGE_START_HOUR}h - ${process.env.MESSAGE_END_HOUR}h`);
  } else {
    console.log(`⚠️  Google Sheets non configuré - consultez GOOGLE_SHEETS_SETUP.md`);
  }
  
  logger.info(`📞 Bot d'appel IA prêt !`);
});

module.exports = app;
