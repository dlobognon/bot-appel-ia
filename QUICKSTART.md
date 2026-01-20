# 🚀 Guide de Démarrage Rapide

Ce guide vous permet de configurer et lancer le bot d'appel IA en 15 minutes.

## ⚠️ PRÉREQUIS: Node.js

**Si vous avez l'erreur "npm n'est pas reconnu":**

➡️ **Suivez d'abord:** [NODEJS_INSTALL.md](NODEJS_INSTALL.md) pour installer Node.js

**Vérifiez que Node.js est installé:**
```powershell
node --version
npm --version
```

Si ces commandes affichent des versions (ex: v20.11.0), **continuez ci-dessous**. ✅

Sinon, installez Node.js via: https://nodejs.org/ (téléchargez la version LTS)

---

## ⚡ Étapes Rapides

### 1. Installation des dépendances (2 min)

```powershell
# Aller dans le dossier du projet
cd "c:\Users\PC\Documents\BOT APPEL ET MESSAGE"

# Installer les packages npm
npm install
```

**Note:** Cette étape peut prendre 2-3 minutes. C'est normal ! ⏳

### 2. Configuration Twilio (3 min)

1. Créez un compte sur [twilio.com](https://www.twilio.com/try-twilio)
2. Récupérez vos identifiants sur le dashboard:
   - Account SID
   - Auth Token
3. Achetez un numéro de téléphone (+33...)

### 3. Configuration OpenAI (2 min)

1. Créez un compte sur [platform.openai.com](https://platform.openai.com)
2. Allez dans **API Keys**
3. Créez une clé API (commence par `sk-...`)

### 4. Configuration Google Sheets (5 min)

#### A. Créer le projet Google Cloud

1. Allez sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créez un nouveau projet
3. Activez **Google Sheets API** (APIs & Services → Library)

#### B. Créer le compte de service

1. APIs & Services → Credentials
2. Create Credentials → Service Account
3. Rôle: **Editor**
4. Keys → Add Key → Create new key → JSON
5. Téléchargez le fichier

#### C. Préparer Google Sheets

1. Renommez le fichier téléchargé en `credentials.json`
2. Placez-le à la racine du projet
3. Créez une Google Sheet avec cette structure:

| Date Commande | Nom Client | Téléphone | Produits | Adresse Livraison | Statut | Notes |
|---------------|------------|-----------|----------|-------------------|---------|-------|

4. Partagez la feuille avec l'email du compte de service (dans credentials.json: `client_email`)
5. Copiez l'ID de la feuille (dans l'URL)

### 5. Configuration du fichier .env (2 min)

Créez un fichier `.env` à la racine:

```env
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33123456789

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Sheets
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_CREDENTIALS_PATH=./credentials.json

# Configuration
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Horaires
CALL_START_HOUR=8
CALL_END_HOUR=18
MESSAGE_START_HOUR=6
MESSAGE_END_HOUR=20

# Vérification toutes les 5 minutes
CHECK_INTERVAL=5
```

### 6. Démarrage avec ngrok (1 min)

Terminal 1 - Démarrer le serveur:
```powershell
npm run dev
```

Terminal 2 - Démarrer ngrok:
```powershell
ngrok http 3000
```

Copiez l'URL HTTPS de ngrok et mettez-la dans `.env`:
```env
BASE_URL=https://abc123.ngrok.io
```

Redémarrez le serveur.

### 7. Configuration des webhooks Twilio (1 min)

1. Console Twilio → Phone Numbers → Manage → Active Numbers
2. Cliquez sur votre numéro
3. Voice & Fax:
   - A Call Comes In: `https://abc123.ngrok.io/api/automated/voice` (POST)
   - Call Status Changes: `https://abc123.ngrok.io/api/automated/status` (POST)
4. Save

## ✅ Vérification

### Test 1: Serveur actif

Ouvrez http://localhost:3000

Vous devriez voir:
- ✅ Dashboard avec statistiques
- ✅ Statut "Automation: Actif" ou "Hors horaires"

### Test 2: Google Sheets connecté

Dans la console du serveur:
```
✅ Google Sheets API initialisée
✅ Google Sheets connecté
```

### Test 3: Synchronisation

1. Ajoutez une commande test dans Google Sheets:
```
2026-01-03 | Test Client | +33612345678 | Pizza | 10 rue Test | pending |
```

2. Dans l'interface web, cliquez sur "🔄 Synchroniser Google Sheets"

3. La commande devrait apparaître dans la liste

### Test 4: Appel (si dans les horaires 8h-18h)

Attendez 5 minutes ou redémarrez le serveur.

Le bot devrait:
1. Détecter la nouvelle commande
2. Appeler le numéro automatiquement
3. Mettre à jour le statut dans Google Sheets

## 📊 Interface Web

Accédez à http://localhost:3000 pour voir:

- **Statistiques**: Total, en attente, confirmées
- **Statut système**: Horaires, automation active
- **Liste des commandes**: Toutes les commandes avec leur statut
- **Synchronisation manuelle**: Bouton pour forcer la sync

## 🕐 Horaires par Défaut

- **Appels téléphoniques**: 8h - 18h
- **Messages vocaux**: 6h - 20h
- **Vérification commandes**: Toutes les 5 minutes

## 🔍 Surveillance

### Logs en temps réel

Terminal du serveur affiche:
```
📞 Initiation appel pour Test Client (+33612345678)
✅ Appel initié: CAxxxxxxxx
🗣️ Client: Oui bonjour
🤖 IA: Bonjour, je confirme votre commande...
```

### Fichiers de logs

- `logs/combined.log` - Tous les événements
- `logs/error.log` - Erreurs uniquement

## 🛠️ Commandes Utiles

```powershell
# Démarrer en mode développement (auto-reload)
npm run dev

# Démarrer en mode production
npm start

# Voir les logs en direct
Get-Content .\logs\combined.log -Wait -Tail 50

# Nettoyer la base de données (recommencer à zéro)
Remove-Item .\data\orders.db
```

## ❌ Problèmes Courants

### "Fichier credentials.json non trouvé"
→ Placez credentials.json à la racine du projet

### "Permission denied" sur Google Sheets
→ Partagez la feuille avec l'email du compte de service

### Le bot n'appelle pas
→ Vérifiez que vous êtes dans les horaires (8h-18h)
→ Vérifiez les logs

### "Invalid API key" OpenAI
→ Vérifiez votre clé API dans .env
→ Vérifiez que vous avez du crédit sur votre compte

## 📚 Documentation Complète

- [README.md](README.md) - Documentation complète
- [TWILIO_SETUP.md](TWILIO_SETUP.md) - Guide détaillé Twilio
- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) - Guide détaillé Google Sheets
- [DEPLOYMENT.md](DEPLOYMENT.md) - Déploiement en production

## 🎉 C'est Prêt !

Votre bot d'appel IA est maintenant opérationnel ! 

Ajoutez des commandes dans Google Sheets et regardez le bot les traiter automatiquement.
