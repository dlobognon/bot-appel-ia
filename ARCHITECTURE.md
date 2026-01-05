# 📂 Architecture du Système

## Vue d'Ensemble

```
┌─────────────────┐
│  Google Sheets  │  ← Commandes des clients
└────────┬────────┘
         │
         ↓ Synchronisation (toutes les 5 min)
┌─────────────────┐
│   Base SQLite   │  ← Stockage local
└────────┬────────┘
         │
         ↓ Traitement automatique
┌─────────────────┐
│  Bot d'Appel IA │
│   (Node.js)     │
└────────┬────────┘
         │
         ├→ Twilio API      ← Appels téléphoniques
         ├→ OpenAI API     ← Conversations IA
         └→ Interface Web  ← Dashboard
```

## Flux de Traitement

### 1. Nouvelle Commande

```
Client passe commande
    ↓
Ajout dans Google Sheets (statut: pending)
    ↓
Bot détecte nouvelle commande (sync auto)
    ↓
Import dans base SQLite (statut: imported)
    ↓
Google Sheets mis à jour (statut: imported)
```

### 2. Appel Automatique

```
Vérification horaire (8h-18h)
    ↓
Sélection commande en attente
    ↓
Génération message ouverture (OpenAI)
    ↓
Initiation appel (Twilio)
    ↓
Client répond
    ↓
Conversation IA en temps réel
    ├→ Analyse intention (OpenAI)
    ├→ Génération réponse (OpenAI)
    └→ Synthèse vocale (Twilio)
    ↓
Fin de conversation
    ↓
Génération résumé (OpenAI)
    ↓
Mise à jour statut (SQLite + Google Sheets)
```

### 3. Gestion des Résultats

```
Fin d'appel
    ↓
Analyse résultat
    ├→ Confirmé    → statut: confirmed
    ├→ Refusé      → statut: cancelled
    ├→ Pas dispo   → statut: retry
    └→ Pas répondu → statut: retry
    ↓
Enregistrement dans base
    ↓
Mise à jour Google Sheets avec notes
    ↓
Génération résumé IA
```

## Composants du Système

### Backend (Node.js + Express)

**server.js**
- Point d'entrée de l'application
- Configuration Express
- Initialisation des services
- Démarrage automation

**Routes**
- `/api/calls/*` - Appels manuels (ancienne version)
- `/api/automated/*` - Webhooks Twilio pour appels IA
- `/api/orders/*` - Gestion des commandes

**Controllers**
- `automatedCallController.js` - Logique appels IA
- `callController.js` - Appels manuels (legacy)

**Services**
- `googleSheets.js` - Interface Google Sheets API
- `aiService.js` - Interface OpenAI API
- `automationService.js` - Orchestration automatique

**Config**
- `database.js` - Configuration SQLite + ORM

**Utils**
- `logger.js` - Système de logging Winston
- `timeManager.js` - Gestion horaires

### Frontend (HTML/CSS/JS)

**public/index.html**
- Dashboard temps réel
- Statistiques
- Liste des commandes
- Synchronisation manuelle

### Base de Données (SQLite)

**Table: orders**
- id, sheet_row, customer_name, customer_phone
- delivery_address, products, order_date
- status, call_attempts, notes
- Timestamps

**Table: calls**
- id, order_id, call_sid, phone_number
- status, duration, recording_url
- transcription, ai_summary
- call_date

**Table: conversations**
- id, call_sid, role, content
- timestamp

## APIs Externes

### Twilio
**Utilisé pour:**
- Initier les appels
- Recevoir les webhooks
- Speech-to-Text (reconnaissance vocale)
- Text-to-Speech (synthèse vocale)
- Enregistrements

**Endpoints:**
- POST /api/automated/voice - Début d'appel
- POST /api/automated/respond - Réponse client
- POST /api/automated/status - Statut appel
- POST /api/automated/recording - Enregistrement

### OpenAI (GPT-4)
**Utilisé pour:**
- Génération messages d'ouverture
- Conversations en temps réel
- Analyse des intentions
- Génération résumés
- Messages vocaux

**Modèle:** gpt-4
**Temperature:** 0.7 (équilibre créativité/cohérence)

### Google Sheets API
**Utilisé pour:**
- Lecture des commandes
- Mise à jour des statuts
- Ajout de notes
- Synchronisation bidirectionnelle

**Permissions:** Editor (lecture + écriture)

## Sécurité

### Variables Sensibles (.env)
- ✅ Fichier .env dans .gitignore
- ✅ Exemple fourni (.env.example)
- ✅ Credentials.json dans .gitignore

### Validation
- ✅ Format téléphone validé
- ✅ Paramètres webhook validés
- ✅ Gestion erreurs complète

### Logs
- ✅ Pas de données sensibles dans logs
- ✅ Rotation des logs (à configurer en prod)
- ✅ Niveaux de log (info, error)

## Performance

### Optimisations
- ✅ Synchronisation par intervalle (5 min)
- ✅ Vérification horaires avant appel
- ✅ Délai entre appels (30s)
- ✅ Cache contextes d'appel actifs
- ✅ Base SQLite (rapide, locale)

### Scalabilité
- Peut gérer ~100 commandes/jour
- ~1 appel toutes les 30 secondes
- Horaires configurables
- Tentatives limitées (max 3)

### Limites
- **Twilio:** Selon votre plan
- **OpenAI:** Selon vos quotas API
- **Google Sheets:** 500 requêtes/100s
- **SQLite:** ~1M lignes (largement suffisant)

## Monitoring

### En Temps Réel
- Dashboard web (http://localhost:3000)
- Console serveur (logs colorés)
- Indicateurs statut (actif/inactif)

### Fichiers de Logs
- `logs/combined.log` - Tout
- `logs/error.log` - Erreurs uniquement

### Métriques Trackées
- Nombre total de commandes
- Commandes en attente
- Commandes confirmées/annulées
- Tentatives d'appel
- Durée des appels
- Taux de succès

## Déploiement

### Développement
- Serveur local (npm run dev)
- ngrok pour webhooks
- Hot reload (nodemon)

### Production
- Heroku / VPS / Docker
- Domaine personnalisé
- SSL obligatoire (Twilio)
- PM2 pour process management
- Variables d'environnement sécurisées

Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour le guide complet.

## Maintenance

### Quotidien
- Vérifier les logs d'erreur
- Monitorer les coûts (Twilio, OpenAI)
- Vérifier le statut automation

### Hebdomadaire
- Analyser les statistiques
- Optimiser les prompts IA
- Nettoyer les vieilles données

### Mensuel
- Mettre à jour les dépendances
- Backup base de données
- Audit de sécurité
- Optimisation performances

## Support et Évolution

### Fonctionnalités Futures
- [ ] Multi-langues
- [ ] Intégration CRM
- [ ] SMS en complément
- [ ] Analytics avancées
- [ ] API publique
- [ ] Application mobile

### Contributions
- Code open source (à définir)
- Documentation complète
- Issues GitHub (à créer)
- Pull requests welcome

---

Cette architecture est conçue pour être:
- ✅ **Simple**: Facile à comprendre et maintenir
- ✅ **Robuste**: Gestion d'erreurs complète
- ✅ **Scalable**: Peut grandir avec vos besoins
- ✅ **Flexible**: Facile à personnaliser
