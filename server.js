require('dotenv').config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('./utils/logger');

const callRoutes = require('./routes/callRoutes');
const automatedRoutes = require('./routes/automatedRoutes');
const orderRoutes = require('./routes/orderRoutes');
const botControlRoutes = require('./routes/botControl');

const { initGoogleSheets } = require('./services/googleSheets');
const { startAutomation } = require('./services/automationService');
const app = express();

// Important derrière Railway
app.set('trust proxy', 1);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static
app.use(express.static('public'));

// Logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: "Bot d'appel en ligne" });
});

// API routes
app.use('/api/calls', callRoutes);
app.use('/api/automated', automatedRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bot', botControlRoutes);

// Pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue' });
});

const PORT = process.env.PORT || 3000;

// HTTP server
const server = http.createServer(app);

// ✅ Voice WebSocket (CHEMIN CORRECT: ws/ws/voiceSocket.js)
let initVoiceSocket = null;
try {
  ({ initVoiceSocket } = require('./ws/ws/voiceSocket'));
} catch (e) {
  console.warn('⚠️ voiceSocket désactivé:', e.message);
}

// Brancher WS seulement si dispo
if (initVoiceSocket) {
  initVoiceSocket(server);
}

// Start
server.listen(PORT, async () => {
  try {
    logger.info(`🚀 Serveur démarré sur le port ${PORT}`);

    const ok = await initGoogleSheets();
    if (ok) {
      logger.info('✅ Google Sheets connecté');

      startAutomation();
      logger.info('✅ Automation démarrée');

      logger.info(`⏰ Appels: ${process.env.CALL_START_HOUR}h - ${process.env.CALL_END_HOUR}h`);
      logger.info(`💬 Messages: ${process.env.MESSAGE_START_HOUR}h - ${process.env.MESSAGE_END_HOUR}h`);
    } else {
      logger.warn('⚠️ Google Sheets non configuré (voir GOOGLE_SHEETS_SETUP.md)');
    }

    logger.info('📞 Bot d’appel prêt');
  } catch (e) {
    logger.error('❌ Erreur au démarrage:', e.message);
  }
});

module.exports = app;