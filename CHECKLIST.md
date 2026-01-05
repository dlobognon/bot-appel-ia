# Bot d'Appel IA - À Faire Avant de Démarrer

## ✅ Checklist de Configuration

### 1. Comptes et API

- [ ] Compte Twilio créé
  - [ ] Account SID récupéré
  - [ ] Auth Token récupéré
  - [ ] Numéro de téléphone acheté

- [ ] Compte OpenAI créé
  - [ ] Clé API créée
  - [ ] Crédit disponible vérifié

- [ ] Google Cloud configuré
  - [ ] Projet créé
  - [ ] Google Sheets API activée
  - [ ] Compte de service créé
  - [ ] Fichier credentials.json téléchargé

### 2. Google Sheets

- [ ] Feuille Google Sheets créée
- [ ] Feuille nommée "Commandes"
- [ ] En-têtes ajoutés (Date | Nom | Téléphone | Produits | Adresse | Statut | Notes)
- [ ] Feuille partagée avec l'email du compte de service
- [ ] ID de la feuille copié

### 3. Fichiers du Projet

- [ ] `credentials.json` placé à la racine
- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Dépendances installées (`npm install`)

### 4. Configuration Locale

- [ ] ngrok installé
- [ ] URL ngrok configurée dans `.env`
- [ ] Webhooks Twilio configurés

### 5. Tests

- [ ] Serveur démarre sans erreur
- [ ] Google Sheets connecté (voir logs)
- [ ] Interface web accessible (http://localhost:3000)
- [ ] Synchronisation manuelle fonctionne
- [ ] Test d'appel effectué

## 📋 Variables d'Environnement Requises

Vérifiez que votre `.env` contient:

```env
# Twilio (OBLIGATOIRE)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33123456789

# OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Sheets (OBLIGATOIRE)
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_CREDENTIALS_PATH=./credentials.json

# Configuration Serveur
PORT=3000
NODE_ENV=development
BASE_URL=https://votre-url-ngrok.ngrok.io

# Horaires (IMPORTANT)
CALL_START_HOUR=8
CALL_END_HOUR=18
MESSAGE_START_HOUR=6
MESSAGE_END_HOUR=20

# Automation
CHECK_INTERVAL=5
```

## 🚨 Erreurs Communes

### ❌ "Cannot find module 'dotenv'"
**Solution:** `npm install`

### ❌ "Fichier credentials.json non trouvé"
**Solution:** Placez credentials.json à la racine du projet

### ❌ "Permission denied" Google Sheets
**Solution:** Partagez la feuille avec l'email dans credentials.json (`client_email`)

### ❌ "Invalid API key" OpenAI
**Solution:** Vérifiez votre clé API OpenAI et votre crédit

### ❌ "Unable to parse range: Commandes"
**Solution:** Renommez votre feuille exactement "Commandes"

### ❌ Le bot n'appelle pas
**Solutions:**
- Vérifiez l'heure (appels uniquement 8h-18h)
- Vérifiez que des commandes ont le statut "pending"
- Attendez 5 minutes (intervalle de vérification)

## 📞 Webhooks Twilio à Configurer

Console Twilio → Phone Numbers → Votre numéro → Voice & Fax:

1. **A Call Comes In:**
   - Webhook: `https://VOTRE-URL-NGROK.ngrok.io/api/automated/voice`
   - Method: POST

2. **Call Status Changes:**
   - Webhook: `https://VOTRE-URL-NGROK.ngrok.io/api/automated/status`
   - Method: POST

## 🎯 Premier Test

1. **Ajoutez une commande test dans Google Sheets:**
   ```
   2026-01-03 | Test | +33VOTRE_NUMERO | Pizza | 10 rue Test | pending |
   ```

2. **Synchronisez dans l'interface web**

3. **Attendez l'appel** (si dans les horaires 8h-18h)

4. **Répondez et testez la conversation**

## 📚 Documentation

- [README.md](README.md) - Documentation complète
- [QUICKSTART.md](QUICKSTART.md) - Démarrage rapide 15 min
- [TWILIO_SETUP.md](TWILIO_SETUP.md) - Configuration Twilio détaillée
- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) - Configuration Google Sheets détaillée
- [TEST_DATA.md](TEST_DATA.md) - Données et scénarios de test
- [DEPLOYMENT.md](DEPLOYMENT.md) - Déploiement en production

## ✅ Vous Êtes Prêt !

Si tous les points ci-dessus sont cochés, vous pouvez démarrer:

```powershell
npm run dev
```

Puis dans un autre terminal:

```powershell
ngrok http 3000
```

Bon appels ! 📞🤖
