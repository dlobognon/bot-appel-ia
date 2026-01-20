# Données Exemple pour Tests

## Structure Google Sheets

Copiez ces données dans votre Google Sheet pour tester le système.

### En-têtes (Ligne 1)
```
Date Commande | Nom Client | Téléphone | Produits | Adresse Livraison | Statut | Notes
```

### Données de Test (À partir de la ligne 2)

```
2026-01-03 | Jean Dupont | +33612345678 | 2x Pizza Margherita, 1x Tiramisu | 10 rue de la Paix, 75001 Paris | pending |
2026-01-03 | Marie Martin | +33687654321 | 1x Burger Classic, 1x Frites | 25 avenue des Champs-Élysées, 75008 Paris | pending |
2026-01-03 | Pierre Durand | +33698765432 | 3x Salade César, 2x Coca Cola | 15 boulevard Saint-Michel, 75005 Paris | pending |
2026-01-03 | Sophie Bernard | +33623456789 | 1x Poulet Rôti, 1x Riz | 8 rue du Commerce, 75015 Paris | pending |
2026-01-03 | Luc Petit | +33656789012 | 2x Sushi Mix, 1x Miso | 30 rue de Rivoli, 75004 Paris | pending |
```

## Format des Téléphones

**Important**: Les numéros doivent être au format international avec `+`

✅ **Correct:**
- +33612345678
- +33687654321
- +1234567890

❌ **Incorrect:**
- 06 12 34 56 78
- 0612345678
- 33612345678

## Statuts Disponibles

| Statut | Description | Action du Bot |
|--------|-------------|---------------|
| `pending` | Nouvelle commande | Bot va appeler automatiquement |
| `imported` | Importée dans le système | En attente de traitement |
| `confirmed` | Client a confirmé | Aucune action requise |
| `cancelled` | Client a annulé | Aucune action requise |
| `retry` | À rappeler | Bot va réessayer plus tard |
| `failed` | Échec après 3 tentatives | Traitement manuel nécessaire |

## Exemples de Produits

Utilisez des descriptions claires pour que l'IA puisse en parler naturellement:

**Restauration:**
```
- 2x Pizza Margherita, 1x Tiramisu
- 1x Burger Classic avec Frites
- Menu Familial (4 personnes)
- 3x Sushi Mix, 2x California Roll
```

**E-commerce:**
```
- iPhone 15 Pro 256Go Noir
- Samsung Galaxy Watch 6
- MacBook Air M2 13 pouces
- Casque Sony WH-1000XM5
```

**Services:**
```
- Abonnement Premium 1 an
- Coaching personnalisé 10 séances
- Formation Excel avancé
```

## Test Complet

### 1. Préparer les données

Créez 3 commandes de test:

1. **Commande simple** (devrait être confirmée)
```
2026-01-03 | Test Confirmé | VOTRE_NUMERO | 1x Pizza | 10 rue Test | pending |
```

2. **Commande avec question** (pour tester l'IA)
```
2026-01-03 | Test Question | VOTRE_NUMERO | 2x Burger | 20 av Test | pending |
```

3. **Commande à annuler** (pour tester le refus)
```
2026-01-03 | Test Annulation | VOTRE_NUMERO | 1x Salade | 30 bd Test | pending |
```

Remplacez `VOTRE_NUMERO` par votre vrai numéro au format +33...

### 2. Synchroniser

1. Cliquez sur "🔄 Synchroniser Google Sheets"
2. Vérifiez que les 3 commandes apparaissent dans l'interface

### 3. Attendre l'appel

Si vous êtes dans les horaires (8h-18h):
- Le bot appellera automatiquement
- Répondez naturellement
- Testez différents scénarios

Si hors horaires:
- Le bot attendra la prochaine fenêtre
- Vous verrez "Hors horaires" dans le statut

### 4. Vérifier les résultats

Après l'appel:
1. Vérifiez le statut mis à jour dans l'interface web
2. Vérifiez les notes dans Google Sheets
3. Consultez les logs: `logs/combined.log`

## Scénarios de Test

### Scénario 1: Client Confirme
**Vous répondez:**
- "Oui, tout est bon"
- "D'accord pour la livraison"
- "Parfait, merci"

**Résultat attendu:** Statut `confirmed`

### Scénario 2: Client Hésite
**Vous répondez:**
- "Je ne suis pas sûr..."
- "C'est un peu cher"
- "Je dois réfléchir"

**Résultat attendu:** Bot essaie de convaincre

### Scénario 3: Client Refuse
**Vous répondez:**
- "Non, je veux annuler"
- "Je ne suis plus intéressé"
- "Annulez ma commande"

**Résultat attendu:** Statut `cancelled`

### Scénario 4: Client Pose Questions
**Vous demandez:**
- "C'est livré quand ?"
- "Ça coûte combien ?"
- "C'est quoi exactement ?"

**Résultat attendu:** Bot répond naturellement

### Scénario 5: Pas Disponible
**Vous répondez:**
- "Je ne peux pas parler maintenant"
- "Rappelez-moi plus tard"
- "Je suis occupé"

**Résultat attendu:** Statut `retry`

## Surveillance en Temps Réel

Pendant les tests, surveillez:

### Console du serveur
```
📞 Initiation appel pour Test Confirmé (+33612345678)
✅ Appel initié: CAxxxxxxxx
🗣️ Client: Oui tout est bon
🤖 IA: Parfait ! Votre commande est confirmée...
```

### Interface Web
- Statistiques qui s'actualisent
- Statut qui change
- Nombre de tentatives

### Google Sheets
- Colonne "Statut" qui se met à jour
- Colonne "Notes" avec le résumé

## Tips pour Tests Réalistes

1. **Parlez naturellement** comme un vrai client
2. **Testez les interruptions** (couper le bot, parler en même temps)
3. **Variez les accents** et débits de parole
4. **Testez le bruit ambiant** (musique, TV...)
5. **Posez des questions inattendues**

## Nettoyage Après Tests

Pour recommencer les tests:

```powershell
# Supprimer la base de données
Remove-Item .\data\orders.db

# Réinitialiser Google Sheets
# Supprimez manuellement les lignes de test

# Redémarrer le serveur
npm run dev
```

## Données de Production

Une fois les tests terminés, remplacez par vos vraies données:
- Vrais clients
- Vrais produits
- Vraies adresses
- Configurez l'intégration avec votre site web

Le bot est prêt pour la production ! 🚀
