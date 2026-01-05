# Déploiement sur Railway

## Étapes rapides :

### 1. Créer un compte Railway
```
https://railway.app
```
Connexion via GitHub (recommandé).

### 2. Déployer le projet
```bash
# Via CLI Railway (installez depuis https://railway.app/cli)
railway login
cd "C:\Users\PC\Documents\BOT APPEL ET MESSAGE"
railway init
railway up
```

**OU** via dashboard Railway :
- New Project → Import from GitHub
- Connecter ce repo
- Sélectionner la branche `main`

### 3. Configurer les variables d'environnement
Dans le dashboard Railway :
- Project Settings → Variables
- Ajouter toutes les variables depuis `.env` :
  ```
  TWILIO_ACCOUNT_SID=AC7ab17c65c...
  TWILIO_AUTH_TOKEN=52dacc7bda2...
  TWILIO_PHONE_NUMBER=+15073533830
  OPENAI_API_KEY=sk-proj-...
  GOOGLE_SHEET_ID=1T-D0SvFw7...
  GOOGLE_CREDENTIALS_PATH=./credentials.json
  PORT=3000
  NODE_ENV=production
  BASE_URL=https://your-railway-app.up.railway.app
  CALL_START_HOUR=8
  CALL_END_HOUR=18
  MESSAGE_START_HOUR=6
  MESSAGE_END_HOUR=20
  CHECK_INTERVAL=5
  ```

### 4. Uploads des fichiers sensibles
- **credentials.json** : Uploader via Railway File Storage
- Ou configurer une variable `GOOGLE_CREDENTIALS_JSON` avec le contenu JSON

### 5. Obtenir l'URL publique
Une fois déployé, Railway génère une URL :
```
https://your-bot.up.railway.app
```

Mettre à jour `.env` ou Twilio Webhooks avec cette URL.

### 6. Vérifier la santé
```
curl https://your-bot.up.railway.app/health
```

---

## Alternative : Render.com
Très similaire à Railway, un peu plus simple :
1. https://render.com
2. New Web Service → Connect GitHub
3. Configure variables et déploie
4. URL fournie automatiquement

---

## Retour à localhost
Pour revenir à localhost après tests :
```bash
# Dans .env
BASE_URL=http://localhost:3000
```

---

## Coûts
- **Railway** : Gratuit jusqu'à $5/mois (suffisant pour ce bot)
- **Render** : Gratuit avec spin-down après 15 min d'inactivité
- **Heroku** : Plus gratuit (payant depuis 2022)
