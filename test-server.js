// Test simple du serveur
console.log("=== DEBUT TEST ===");

try {
  require('dotenv').config();
  console.log("✅ dotenv chargé");
  
  const express = require('express');
  console.log("✅ express chargé");
  
  const logger = require('./utils/logger');
  console.log("✅ logger chargé");
  
  const { initGoogleSheets } = require('./services/googleSheets');
  console.log("✅ googleSheets chargé");
  
  const app = express();
  const PORT = 3000;
  
  app.get('/', (req, res) => {
    res.send('Test OK');
  });
  
  console.log(">>> Appel de app.listen...");
  
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Serveur TEST sur http://localhost:${PORT}`);
    logger.info("Test logger");
    console.log("✅ SERVEUR PRET - callback exécuté");
  });
  
  console.log(">>> app.listen appelé, serveur =", server ? "OK" : "NULL");
  
} catch (error) {
  console.error("❌ ERREUR:", error.message);
  console.error(error.stack);
  process.exit(1);
}
