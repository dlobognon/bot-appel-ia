# Guide de Configuration Twilio

## 1. Créer un Compte Twilio

1. Allez sur https://www.twilio.com/try-twilio
2. Créez un compte gratuit
3. Vérifiez votre email et numéro de téléphone

## 2. Récupérer vos Identifiants

1. Connectez-vous à la console Twilio: https://console.twilio.com
2. Sur le tableau de bord, vous trouverez:
   - **Account SID**: Commence par "AC..."
   - **Auth Token**: Cliquez sur "Show" pour le voir

Copiez ces valeurs dans votre fichier `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 3. Acheter un Numéro de Téléphone

### Avec le compte d'essai
- Vous recevez un crédit gratuit de $15
- Vous pouvez appeler uniquement les numéros vérifiés

### Acheter un numéro

1. Allez dans **Phone Numbers** → **Buy a Number**
2. Sélectionnez votre pays (France: +33)
3. Filtres recommandés:
   - ✅ Voice (appels vocaux)
   - ✅ SMS (optionnel)
4. Choisissez un numéro (~1€/mois)
5. Cliquez sur **Buy**

Ajoutez le numéro dans `.env`:
```env
TWILIO_PHONE_NUMBER=+33123456789
```

## 4. Configurer les Webhooks

### Développement Local (avec ngrok)

1. Installez ngrok:
```bash
npm install -g ngrok
```

2. Démarrez votre serveur:
```bash
npm run dev
```

3. Dans un autre terminal, lancez ngrok:
```bash
ngrok http 3000
```

4. Copiez l'URL HTTPS (ex: `https://abc123.ngrok.io`)

5. Dans Twilio Console → **Phone Numbers** → **Manage** → **Active Numbers**
6. Cliquez sur votre numéro
7. Configurez:

**Voice & Fax**
- A Call Comes In: **Webhook** 
  - URL: `https://abc123.ngrok.io/api/calls/voice`
  - Method: **HTTP POST**
  
- Call Status Changes: **Webhook**
  - URL: `https://abc123.ngrok.io/api/calls/status`
  - Method: **HTTP POST**

8. Cliquez sur **Save**

### Production

Remplacez l'URL ngrok par votre domaine de production:
- `https://votre-domaine.com/api/calls/voice`
- `https://votre-domaine.com/api/calls/status`

## 5. Vérifier les Numéros (Compte d'essai)

Si vous utilisez le compte d'essai, vous devez vérifier les numéros que vous souhaitez appeler:

1. Allez dans **Phone Numbers** → **Verified Caller IDs**
2. Cliquez sur **Add a new Caller ID**
3. Entrez le numéro à vérifier
4. Suivez le processus de vérification

## 6. Tester votre Configuration

### Test 1: Webhook accessible
```bash
curl https://votre-url-ngrok.ngrok.io/api/calls/voice
```
Devrait retourner du XML TwiML.

### Test 2: Passer un appel
```bash
curl -X POST https://votre-url-ngrok.ngrok.io/api/calls/make \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+33612345678"}'
```

### Test 3: Recevoir un appel
Appelez votre numéro Twilio depuis votre téléphone.

## 7. Monitorer les Appels

1. Console Twilio → **Monitor** → **Logs** → **Calls**
2. Vous verrez tous les appels avec:
   - Statut
   - Durée
   - Coût
   - Webhooks appelés

## 8. Debug des Webhooks

Si les webhooks ne fonctionnent pas:

1. **Vérifier ngrok**: L'URL change à chaque redémarrage
2. **Vérifier les logs Twilio**:
   - Console → Monitor → Logs → Debugger
3. **Vérifier votre serveur**:
   - Les logs dans `logs/combined.log`
   - La console de votre serveur

## 9. Voix et Langues Disponibles

### Voix française
```javascript
response.say({
  voice: 'alice',      // Voix féminine
  language: 'fr-FR'    // Français (France)
}, 'Votre message');
```

Autres voix disponibles:
- `alice` - Voix féminine (recommandée)
- `man` - Voix masculine
- `woman` - Voix féminine alternative

### Autres langues
- `fr-CA` - Français canadien
- `en-US` - Anglais américain
- `en-GB` - Anglais britannique
- `es-ES` - Espagnol

## 10. Fonctionnalités Avancées

### Enregistrement de messages
```javascript
response.record({
  maxLength: 120,              // Durée max (secondes)
  transcribe: true,            // Transcription auto
  transcribeCallback: '/url'   // URL de callback
});
```

### Transfert d'appel
```javascript
response.dial('+33612345678');  // Numéro à appeler
```

### Musique d'attente
```javascript
response.play('https://url-de-la-musique.mp3');
```

## 11. Limites du Compte d'Essai

- ✅ Crédit gratuit de $15
- ❌ Ne peut appeler que les numéros vérifiés
- ❌ Message "This is a test call" au début
- ❌ Certaines fonctionnalités limitées

**Pour passer en compte payant:**
1. Console → Billing
2. Ajoutez une carte de crédit
3. Toutes les limitations sont levées

## 12. Sécurité

### Valider les webhooks Twilio
```javascript
const twilio = require('twilio');

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-twilio-signature'];
  const url = `${process.env.BASE_URL}/webhook`;
  
  if (!twilio.validateRequest(authToken, signature, url, req.body)) {
    return res.status(403).send('Forbidden');
  }
  
  // Traiter le webhook
});
```

## 13. Tarification

### Numéros
- France: ~1€/mois

### Appels (France)
- Entrants: ~0.0085€/min
- Sortants vers mobile: ~0.05€/min
- Sortants vers fixe: ~0.01€/min

### Messages vocaux
- Enregistrement: ~0.0025€/min
- Transcription: ~0.05€/min

## Support

- Documentation: https://www.twilio.com/docs
- Support: https://support.twilio.com
- Community: https://www.twilio.com/community
