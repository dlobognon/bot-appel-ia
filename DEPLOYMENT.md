# Guide de Déploiement en Production

## Options de Déploiement

### Option 1: Heroku (Recommandé pour débuter)

#### 1. Installer Heroku CLI
```bash
# Windows
choco install heroku-cli

# Mac
brew tap heroku/brew && brew install heroku
```

#### 2. Créer une application Heroku
```bash
heroku login
heroku create nom-de-votre-bot
```

#### 3. Configurer les variables d'environnement
```bash
heroku config:set TWILIO_ACCOUNT_SID=votre_sid
heroku config:set TWILIO_AUTH_TOKEN=votre_token
heroku config:set TWILIO_PHONE_NUMBER=+33123456789
heroku config:set NODE_ENV=production
```

#### 4. Déployer
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku master
```

#### 5. Mettre à jour les webhooks Twilio
Remplacez l'URL ngrok par votre URL Heroku:
- `https://nom-de-votre-bot.herokuapp.com/api/calls/voice`

### Option 2: VPS (DigitalOcean, AWS, etc.)

#### 1. Configuration du serveur
```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PM2
sudo npm install -g pm2
```

#### 2. Transférer les fichiers
```bash
scp -r . user@votre-serveur:/path/to/app
```

#### 3. Configurer Nginx (reverse proxy)
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. Installer SSL avec Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

#### 5. Démarrer avec PM2
```bash
cd /path/to/app
npm install --production
pm2 start server.js --name bot-appel
pm2 startup
pm2 save
```

### Option 3: Docker

#### 1. Créer un Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### 2. Créer docker-compose.yml
```yaml
version: '3.8'
services:
  bot-appel:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
```

#### 3. Déployer
```bash
docker-compose up -d
```

## Configuration SSL en Production

Twilio nécessite HTTPS pour les webhooks en production. Options:

1. **Let's Encrypt** (gratuit)
2. **Cloudflare** (gratuit + CDN)
3. **AWS Certificate Manager** (gratuit sur AWS)

## Monitoring et Logs

### Avec PM2
```bash
pm2 logs bot-appel
pm2 monit
```

### Logs système
Les logs sont dans `logs/`:
- `combined.log` - Tous les logs
- `error.log` - Erreurs uniquement

## Scaling

Pour gérer plus d'appels simultanés:

```bash
# PM2 cluster mode
pm2 start server.js -i max --name bot-appel
```

## Backup

Sauvegardez régulièrement:
- Base de données (si ajoutée)
- Fichiers de configuration
- Logs importants

## Sécurité en Production

1. **Variables d'environnement**: Ne jamais commit `.env`
2. **Rate limiting**: Ajouter express-rate-limit
3. **Validation**: Valider tous les inputs
4. **Mise à jour**: `npm audit fix` régulièrement

## Coûts Estimés

### Twilio
- Numéro de téléphone: ~1€/mois
- Appels entrants: ~0.01€/min
- Appels sortants: ~0.05€/min

### Hébergement
- Heroku: Gratuit (avec limitations) ou 7$/mois
- DigitalOcean VPS: à partir de 5$/mois
- AWS: Variable selon utilisation

## Support et Maintenance

- Vérifier les logs quotidiennement
- Monitorer les coûts Twilio
- Mettre à jour les dépendances mensuellement
- Tester les webhooks après chaque déploiement
