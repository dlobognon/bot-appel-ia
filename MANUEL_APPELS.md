# Guide des Appels Manuels

## Vue d'ensemble

Le système permet maintenant de lancer des appels manuels directement depuis l'interface web, même si le bot a échoué automatiquement ou si toutes les tentatives automatiques sont épuisées.

## Fonctionnalité Bouton "Lancer Appel"

### Où le trouver?
- Ouvrez l'interface web: `http://localhost:3000`
- Consultez la section **"Commandes en attente"**
- Chaque commande affiche un bouton vert **"📞 Lancer Appel"**

### Comment l'utiliser?
1. Cliquez sur le bouton **"📞 Lancer Appel"** pour la commande souhaitée
2. Confirmez le lancement de l'appel dans la popup
3. Le système lance immédiatement l'appel au client
4. Une notification confirme le lancement
5. L'interface se rafraîchit automatiquement après 1,5 seconde

### Comportement intelligent

#### Si la commande n'a jamais été appelée:
- L'appel est lancé normalement
- Le compteur de tentatives est incrémenté

#### Si la commande a déjà des tentatives:
- L'appel est lancé à nouveau
- Le compteur continue à augmenter

#### Si la commande a échoué (status = "failed"):
- **Le système réinitialise automatiquement** le compteur de tentatives à 0
- Le statut passe à "retry"
- L'appel est lancé comme si c'était la première fois
- ✅ **Vous pouvez relancer autant d'appels que nécessaire**

## API Endpoint

### POST /api/automated/manual-call

**Corps de la requête:**
```json
{
  "orderId": 1
}
```

**Réponse en cas de succès:**
```json
{
  "success": true,
  "message": "Appel lancé avec succès",
  "callSid": "CAxxxxxxxxxxxxxxxx",
  "order": {
    "id": 1,
    "customer_name": "Nom Client",
    "customer_phone": "+225XXXXXXXX",
    "status": "retry"
  }
}
```

**Réponse en cas d'erreur:**
```json
{
  "error": "Message d'erreur"
}
```

## Logs

Les appels manuels sont tracés dans les logs avec les indicateurs:
- `🔄 Réinitialisation des tentatives pour commande #X` - Quand une commande échouée est relancée
- `📞 Appel manuel pour [Nom] (commande #X)` - Lancement de l'appel manuel
- `✅ Appel initié: [CallSid]` - Confirmation Twilio

## Cas d'usage

### Scénario 1: Client injoignable
Le bot a essayé 5 fois, la commande est en statut "failed". Vous savez que le client est maintenant disponible.

**Solution:** Cliquez sur "Lancer Appel" → Le système réinitialise automatiquement et relance l'appel.

### Scénario 2: Erreur réseau temporaire
Une erreur réseau a fait échouer tous les appels automatiques.

**Solution:** Une fois le réseau rétabli, relancez les appels manuellement pour chaque commande.

### Scénario 3: Test immédiat
Vous venez d'ajouter une nouvelle commande et voulez tester immédiatement sans attendre le cycle automatique (5 minutes).

**Solution:** Cliquez sur "Lancer Appel" pour un appel instantané.

## Sécurité et Limites

- ✅ Pas de limite sur le nombre d'appels manuels
- ✅ Réinitialisation automatique du compteur pour les commandes échouées
- ✅ Chaque appel est tracé dans les logs et la base de données
- ✅ Les webhooks Twilio fonctionnent normalement (statuts, enregistrements, etc.)
- ⚠️ Assurez-vous d'avoir des crédits Twilio suffisants

## Interface Utilisateur

Le bouton d'appel dispose:
- D'un style visuel distinct (vert émeraude avec effet 3D)
- D'une confirmation avant lancement
- De notifications de succès/erreur
- D'un rafraîchissement automatique de l'interface

## Différence avec /test-call

| Fonctionnalité | /manual-call | /test-call |
|----------------|--------------|------------|
| Réinitialisation auto des échecs | ✅ Oui | ❌ Non |
| Usage | Production | Debug/Test |
| Bouton UI | ✅ Oui | ❌ Non |
| Recommandé pour | Relances clients | Tests techniques |

## Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs: `logs/combined.log`
2. Vérifiez que le serveur tourne: `http://localhost:3000/health`
3. Vérifiez vos crédits Twilio
4. Consultez la console Twilio pour les erreurs d'appel
