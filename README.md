# Bot d'Appel Téléphonique IA 🤖📞

Bot d'appel automatisé avec intelligence artificielle pour gérer les commandes de votre site web. Le système s'intègre avec Google Sheets, appelle automatiquement vos clients, et mène des conversations naturelles pour confirmer les commandes.

## 🎯 Concept

**Votre problème:** Vous devez appeler manuellement chaque client pour confirmer sa commande, poser des questions, et gérer les objections. C'est long et répétitif.

**Notre solution:** Un bot IA qui appelle automatiquement vos clients, discute naturellement avec eux, répond à leurs questions, et confirme les commandes - le tout de manière autonome.

```
Nouvelle commande  →  Bot détecte  →  Appel automatique  →  Conversation IA  →  Commande confirmée
(Google Sheets)       (Auto 5min)      (Horaires 8h-18h)     (GPT-4 naturel)    (Mise à jour auto)
```

## ⚡ Démarrage Rapide

**3 commandes pour lancer:**
```powershell
npm install                    # 1. Installer
cp .env.example .env          # 2. Configurer (.env + credentials.json)
npm run dev                    # 3. Démarrer
```

**📖 Guides:**
- **15 minutes:** [QUICKSTART.md](QUICKSTART.md) - Installation complète pas à pas
- **Checklist:** [CHECKLIST.md](CHECKLIST.md) - Vérifier que tout est configuré
- **Tests:** [TEST_DATA.md](TEST_DATA.md) - Données et scénarios de test

## 🚀 Fonctionnalités

### Gestion Automatique des Commandes
- ✅ **Synchronisation Google Sheets**: Import automatique des nouvelles commandes
- ✅ **Appels automatiques**: Le bot appelle les clients automatiquement
- ✅ **Conversation IA**: Utilise OpenAI GPT-4 pour des conversations naturelles
- ✅ **Gestion des horaires**: Appels uniquement de 8h à 18h, messages de 6h à 20h
- ✅ **Tentatives multiples**: Jusqu'à 3 tentatives par commande
- ✅ **Messages vocaux**: Laisse des messages si client pas joignable

### Intelligence Artificielle
- 🤖 **Conversation fluide**: Discute naturellement avec les clients
- 🎯 **Confirmation de commande**: Vérifie les détails et l'adresse
- 💬 **Réponses aux questions**: Répond aux questions sur les produits
- 🔄 **Gestion des objections**: Essaie de convaincre les clients hésitants
- 📝 **Résumés automatiques**: Génère un compte-rendu de chaque appel

### Suivi et Reporting
- 📊 **Statistiques en temps réel**: Dashboard avec métriques
- 📋 **Historique complet**: Tous les appels enregistrés
- 🎙️ **Enregistrements**: Tous les appels sont enregistrés
- 📝 **Transcriptions**: Conversion speech-to-text automatique
- 🔄 **Mise à jour Google Sheets**: Statuts synchronisés automatiquement

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- Compte Twilio (https://www.twilio.com)
- Compte OpenAI (https://platform.openai.com)
- Google Cloud Project avec Google Sheets API activée
- ngrok (pour le développement local)

## 🔧 Installation

### 1. Cloner ou télécharger le projet

```bash
cd "BOT APPEL ET MESSAGE"
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration complète

#### A. Twilio (Appels téléphoniques)

1. Créez un compte sur https://www.twilio.com
2. Récupérez vos identifiants (voir [TWILIO_SETUP.md](TWILIO_SETUP.md))
3. Achetez un numéro de téléphone

#### B. OpenAI (Intelligence artificielle)

1. Créez un compte sur https://platform.openai.com
2. Allez dans **API Keys**
3. Créez une nouvelle clé API
4. Copiez la clé (commence par `sk-...`)

#### C. Google Sheets (Gestion des commandes)

**Guide complet:** [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)

1. Créez un projet Google Cloud
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33123456789

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Sheets
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_CREDENTIALS_PATH=./credentials.json

# Serveur
PORT=3000
NODE_ENV=development
BASE_URL=https://votre-url-ngrok.ngrok.io

# Horaires (format 24h)
CALL_START_HOUR=8
CALL_END_HOUR=18
MESSAGE_START_HOUR=6
MESSAGE_END_HOUR=20

# Intervalle de vérification (en minutes)
CHECK_INTERVAL=5| Produits | Adresse Livraison | Statut | Notes |
|---------------|------------|-----------|----------|-------------------|---------|-------|
| 2026-01-03 | Jean Dupont | +33612345678 | 2x Pizza | 10 rue de Paris | pending | |

7. Partagez la feuille avec l'email du compte de service

### 4. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet:

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos informations:

```env
TWILIO_ACCOUNT_SID=votre_account_sid_ici
TWILIO_AUTH_TOKEN=votre_auth_token_ici
TWILIO_PHONE_NUMBER=+33123456789

PORT=3000
NODE_ENV=development
BASE_URL=https://votre-url-ngrok.ngrok.io
```

### 5. Configuration de ngrok (pour le développement)
automated/voice`
   - **Voice & Fax** → **Call Status Changes**: `https://votre-url-ngrok.ngrok.io/api/automated

```bash
# Installer ngrok
npm install -g ngrok

# Démarrer ngrok
ngrok http 3000
```

Copiez l'URL HTTPS fournie par ngrok (ex: `https://abc123.ngrok.io`) et mettez-la dans `BASE_URL` de votre fichier `.env`.

### 6. Configuration des webhooks Twilio

1. Allez dans la console Twilio
2. Accédez à votre numéro de téléphone
3. Configurez les webhooks:
   - **Voice & Fax** → **A Call Comes In**: `https://votre-url-ngrok.ngrok.io/api/calls/voice`
   - **Voice & Fax** → **Call Status Changes**: `https://votre-url-ngrok.ngrok.io/api/calls/status`

## 🎯 Démarrage

### Mode développement (avec auto-reload)
Voir les commandes en temps réel
- Consulter les statistiques
- Synchroniser manuellement Google Sheets
- Voir l'historique des appels
- Monitorer le statut du système

### Flux Automatique

1. **Un client passe commande** sur votre site
2. **La commande arrive** dans Google Sheets (via votre système)
3. **Le bot détecte** la nouvelle commande (toutes les 5 min)
4. **Import automatique** dans le système
5. **Appel automatique** dans les horaires configurés (8h-18h)
6. **Conversation IA** avec le client:
   - Salutation personnalisée
   - Confirmation des détails
   - Réponses aux questions
   - Gestion des objections
7. **Mise à jour** du statut dans Google Sheets
8. **Résumé automatique** de la conversation

### Gestion des Horaires

- **08h-18h**: Appels téléphoniques autorisés
- **06h-20h**: Messages vocaux autorisés
- **Hors horaires**: Aucune action, attente de la prochaine fenêtre

### Gestion des Tentatives

- **1ère tentative**: Appel direct
- **2ème tentative**: Nouvel appel si pas de réponse
- **3ème tentative**: Dernière tentative
- **Après 3 tentatives**: Marqué comme "failed"

Entre chaque tentative, un délai est respecté.T /api/calls/make
Content-Type: application/json

{
  "phoneNumber": "+33612345678"
}
```

#### Obtenir l'historique

```bash
GET /api/calls/history?limit=50
```
Conversation IA

### Capacités du Bot

Le bot utilise GPT-4 pour:

1. **Ouverture personnalisée**
   - Salue le client par son nom
   - Mentionne les produits commandés
   - Demande si c'est le bon moment
Base de Données SQLite

Le système utilise SQLite pour stocker:
- **Commandes**: Toutes les commandes importées
- **Appels**: Historique complet des appels
- **Conversations**: Transcriptions des échanges IA

### Enregistrement et Transcription

- Tous les appels sont **enregistrés**
- Conversion **speech-to-text** automatique
- **Résumé IA** de chaque conversation
- Stockage des URLs d'enregistrement

### Synchronisation Google Sheets

- **Import automatique** des nouvelles commandes
- **Mise à jour automatique** des statuts
- **Ajout de notes** après chaque appel
- **Synchronisation bidirectionnelle**

### Logs et Monitoring

Tous les événements sont loggés dans:
- `logs/combined.log` - Tous les logs
- `logs/error.log` - Erreurs uniquement

Le système log:
- Chaque appel initié/terminé
- Réponses de l'IA
- Intentions détectées
- Erreurs et exceptions
### Exemples de Dialogue
fig/
│   └── database.js              # Configuration SQLite
├── controllers/
│   ├── callController.js        # Contrôleur d'appels manuels
│   └── automatedCallController.js  # Contrôleur d'appels IA
├── routes/
│   ├── callRoutes.js            # Routes d'appels manuels
│   ├── automatedRoutes.js       # Routes webhooks IA
│   └── orderRoutes.js           # Routes de gestion commandes
├── services/
│   ├── googleSheets.js          # Service Google Sheets
│   ├── aiService.js             # Service OpenAI
│   └── automationService.js     # Service d'automation
├── utils/
│   ├── logger.js                # Système de logs
│   └── timeManager.js           # Gestion des horaires
├── public/
│   └── index.html               # Interface web
├── data/
│   └── orders.db                # Base de données SQLite
├── logs/                        # Fichiers de logs
├── credentials.json             # Identifiants Google (à créer)
├── server.js                    # Serveur Express
├── package.json
├── .env        comportement de l'IA

Éditez [services/aiService.js](services/aiService.js) pour personnaliser:

```javascript
const SYSTEM_PROMPT = `Tu es un assistant commercial...
- Ajouter des règles spécifiques
- Modifier le ton
- Ajouter des informations produits
`;
```

### Modifier les horaires

Dans votre `.env`:

```env
# Appels de 9h à 17h
CALL_START_HOUR=9
CALL_END_HOUR=17

# Messages de 7h à 21h
MESSAGE_START_HOUR=7
MESSAGE_END_HOUR=21
```'appelle pas les clients

- Vérifiez que vous êtes dans les horaires d'appel (8h-18h par défaut)
- Vérifiez les logs: `logs/combined.log`
- Vérifiez que Google Sheets est bien connecté
- Vérifiez que les commandes ont le statut "pending"

### Les commandes ne sont pas importées

- Vérifiez le fichier `credentials.json`
- Vérifiez que la feuille est partagée avec le compte de service
- Vérifiez le nom de la feuille ("Commandes")
- Vérifiez que l'ID de la feuille est correct dans `.env`

### L'IA ne répond pas correctement

- Vérifiez votre clé API OpenAI
- Vérifiez votre crédit OpenAI
- Regardez les logs pour les erreurs API
- Vérifiez votre connexion internet

### Les webhooks Twilio ne fonctionnent pas

- Vérifiez que ngrok est actif et l'URL à jour
- Testez l'URL: `https://votre-url/api/automated/voice`
- Vérifiez la configuration dans la console Twilio
- Regardez les logs Twilio: Console → Monitor → Logs

### Erreur "Account credentials are required"

- Vérifiez votre fichier `.env`
- Vérifiez que toutes les variables sont définies
- Redémarrez le serveur après modification du `.envla plage
Le système track:
- Nombre total d'appels
- Appels réussis/échoués
- Taux de réussite
- Durée des appels
- Direction (entrant/sortant)

### Logs

Tous les événements sont loggés dans:
- `logs/combined.log` - Tous les logs
- `logs/error.log` - Erreurs uniquement

## 🔒 Sécurité

- Les identifiants Twilio sont stockés dans des variables d'environnement
- Le fichier `.env` est dans `.gitignore`
- Validation des numéros de téléphone
- Gestion des erreurs sécurisée

## 📁 Struct[TWILIO_SETUP.md](TWILIO_SETUP.md) pour Twilio
- Consultez [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) pour Google Sheets
- Consultez la documentation OpenAI: https://platform.openai.com/docs
- Vérifiez les logs dans le dossier `logs/`

## 🎉 Prochaines Améliorations

- [ ] Authentification utilisateur
- [ ] Dashboard analytics avancé avec graphiques
- [ ] Support de plusieurs langues
- [ ] Intégration CRM (Salesforce, HubSpot)
- [ ] SMS automatiques en complément
- [ ] Planification d'appels à heure précise
- [ ] Webhooks personnalisés pour notifier votre système
- [ ] IA encore plus avancée (GPT-4 Turbo)
- [ ] Support WhatsApp Business
- [ ] Application mobile de gestion
├── .env.example
└── README.md
```

## 🛠️ Personnalisation

### Modifier le message vocal

Éditez [controllers/callController.js](controllers/callController.js) dans la fonction `handleIncomingCall()`:

```javascript
response.say(
  {
    voice: 'alice',
    language: 'fr-FR'
  },
  'Votre message personnalisé ici'
);
```

### Changer le numéro de transfert

Dans [controllers/callController.js](controllers/callController.js), case '1':

```javascript
response.dial('+33123456789'); // Remplacez par votre numéro
```

## 🐛 Dépannage

### Le bot ne reçoit pas les appels entrants

- Vérifiez que ngrok est actif
- Vérifiez que l'URL dans Twilio correspond à votre URL ngrok
- Vérifiez les logs: `logs/combined.log`

### Erreur "Account credentials are required"

- Vérifiez votre fichier `.env`
- Vérifiez que les identifiants Twilio sont corrects

### Les webhooks ne fonctionnent pas

- Vérifiez que `BASE_URL` dans `.env` est correct
- Testez l'URL: `https://votre-url/api/calls/voice`

## 📞 Support

Pour toute question ou problème:
- Consultez la documentation Twilio: https://www.twilio.com/docs
- Vérifiez les logs dans le dossier `logs/`

## 📝 Licence

MIT

## 🎉 Prochaines Améliorations

- [ ] Authentification utilisateur
- [ ] Dashboard analytics avancé
- [ ] Support de plusieurs langues
- [ ] Intégration CRM
- [ ] SMS automatiques
- [ ] Planification d'appels
