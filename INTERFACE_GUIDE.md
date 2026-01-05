# 📱 Guide d'Utilisation de l'Interface Web

## Accès à l'Interface

Une fois le serveur démarré, ouvrez votre navigateur:
```
http://localhost:3000
```

## Vue d'Ensemble

L'interface est divisée en 3 sections principales:

```
┌─────────────────────────────────────────────────────────┐
│  🤖 Bot d'Appel IA                            [HEADER]   │
│  Système automatique de gestion des commandes            │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🟢 Automation: Actif  ⏰ 8h-18h  💬 6h-20h     │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                     │
│  │ 📊 Stats     │  │ ⚙️ Système   │       [CARDS]       │
│  │  Total: 45   │  │ Appels: ✅   │                     │
│  │  Attente: 12 │  │ Messages: ✅ │                     │
│  │  Confirmé:30 │  │ Intervalle:5m│                     │
│  └──────────────┘  └──────────────┘                     │
├─────────────────────────────────────────────────────────┤
│  📦 Gestion des Commandes                   [COMMANDES] │
│  🔄 Synchroniser Google Sheets                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 👤 Jean Dupont              [En attente]       │    │
│  │ 📞 +33612345678                                 │    │
│  │ 📦 2x Pizza Margherita                          │    │
│  │ 📍 10 rue de Paris, 75001                       │    │
│  │ 🔁 Tentatives: 1                                │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 1. En-tête (Header)

### Bandeau de Statut
Affiche l'état du système en temps réel:

**🟢 Indicateur Vert (Actif)**
- Le système est en marche
- Dans les horaires d'appel ou de messages
- Traitement en cours

**🔴 Indicateur Rouge (Hors horaires)**
- En dehors des horaires configurés
- Système en attente
- Reprendra automatiquement

**Informations Affichées:**
- État automation (Actif/Hors horaires)
- Horaires d'appels (ex: 8h-18h)
- Horaires de messages (ex: 6h-20h)

## 2. Statistiques

### Carte Statistiques
Affiche les métriques en temps réel:

**📊 Total Commandes**
- Nombre total de commandes dans le système
- Toutes catégories confondues

**⏳ En Attente**
- Commandes qui vont être traitées
- En attente d'appel

**✅ Confirmées**
- Commandes validées par les clients
- Prêtes pour livraison

**🔄 Bouton Synchroniser**
- Force la synchronisation avec Google Sheets
- Importe les nouvelles commandes immédiatement
- Normalement automatique toutes les 5 minutes

### Comment Utiliser
1. Cliquez sur "🔄 Synchroniser Google Sheets"
2. Attendez le message de confirmation
3. Les nouvelles commandes apparaissent dans la liste

## 3. Système

### Carte Système
Affiche l'état technique du système:

**📞 Appels Autorisés**
- ✅ Oui : Dans les horaires (8h-18h)
- ❌ Non : Hors horaires

**💬 Messages Autorisés**
- ✅ Oui : Dans les horaires (6h-20h)
- ❌ Non : Hors horaires

**⏱️ Intervalle**
- Fréquence de vérification des nouvelles commandes
- Par défaut: 5 minutes

**🔄 Traitement en Cours**
- ✅ Oui : Bot en train d'appeler
- ⏸️ Non : En attente

## 4. Liste des Commandes

### Affichage des Commandes
Chaque commande affiche:

```
┌─────────────────────────────────────────────┐
│ 👤 Jean Dupont          [Badge Statut]     │
│ 📞 +33612345678                             │
│ 📦 2x Pizza Margherita, 1x Tiramisu         │
│ 📍 10 rue de Paris, 75001 Paris             │
│ 📅 03/01/2026                               │
│ 🔁 Tentatives: 2                            │
│ 📝 Notes: Client souhaite livraison 19h    │
└─────────────────────────────────────────────┘
```

### Badges de Statut

**🟡 En attente**
- Nouvelle commande
- Sera appelée automatiquement
- Couleur: Jaune

**🟢 Confirmée**
- Client a validé la commande
- Prête pour livraison
- Couleur: Vert

**🔴 Annulée**
- Client a refusé
- Aucune action nécessaire
- Couleur: Rouge

**🔵 À rappeler**
- Client pas disponible
- Sera rappelé automatiquement
- Couleur: Bleu

**⚫ Échouée**
- 3 tentatives sans succès
- Nécessite action manuelle
- Couleur: Gris foncé

## 5. Actions Disponibles

### Synchronisation Manuelle
**Quand l'utiliser:**
- Vous venez d'ajouter des commandes dans Google Sheets
- Vous voulez forcer une mise à jour immédiate
- Le système semble en retard

**Comment:**
1. Cliquez sur "🔄 Synchroniser Google Sheets"
2. Le bouton affiche "⏳ Synchronisation..."
3. Message de confirmation apparaît
4. Liste se rafraîchit automatiquement

### Auto-Refresh
L'interface se met à jour automatiquement:
- **Statistiques:** Toutes les 30 secondes
- **Statut système:** Toutes les 10 secondes
- **Liste commandes:** À la demande (bouton sync)

## 6. Notifications

### Types de Notifications

**✅ Succès (Vert)**
- Synchronisation réussie
- Commande importée
- Opération complétée

**❌ Erreur (Rouge)**
- Problème de connexion
- Erreur API
- Configuration manquante

**Emplacement:**
- Coin supérieur droit
- Disparaît automatiquement après 3 secondes
- Empilables (plusieurs peuvent s'afficher)

## 7. Surveillance en Temps Réel

### Indicateurs à Surveiller

**1. Indicateur Automation**
- Doit être vert pendant les horaires
- Rouge normal en dehors des horaires

**2. Compteur "En Attente"**
- Si stagne: Vérifier les horaires
- Si augmente trop: Vérifier les logs

**3. Tentatives d'Appel**
- Normal: 1-2 tentatives
- Si 3: La commande va passer en "failed"

### Diagnostic Rapide

**❌ Le compteur "En Attente" ne diminue pas**
→ Vérifier l'heure (appels uniquement 8h-18h)
→ Vérifier les logs du serveur

**❌ Les nouvelles commandes n'apparaissent pas**
→ Cliquer sur "Synchroniser"
→ Vérifier Google Sheets (statut "pending")
→ Vérifier credentials.json

**❌ Trop de commandes "Échouées"**
→ Vérifier les numéros de téléphone
→ Vérifier la qualité de connexion
→ Consulter les logs Twilio

## 8. Workflow Typique

### Matin (Ouverture)

1. **8h00 - Démarrage**
   - Ouvrir l'interface (http://localhost:3000)
   - Vérifier que l'indicateur est 🟢 vert
   - Regarder le nombre de commandes "En attente"

2. **8h05 - Première Vague**
   - Le bot commence à appeler automatiquement
   - Surveiller les statuts qui changent
   - Vérifier les notes dans Google Sheets

### Journée (Suivi)

3. **Toutes les heures**
   - Vérifier les statistiques
   - Surveiller les commandes "Échouées"
   - Traiter manuellement si nécessaire

4. **Ajout de Commandes**
   - Nouvelle commande dans Google Sheets
   - Attendre 5 min (auto) ou cliquer "Synchroniser"
   - Commande apparaît avec statut "En attente"
   - Bot appellera automatiquement

### Soir (Clôture)

5. **18h00 - Fin des Appels**
   - Indicateur passe au 🔴 rouge (normal)
   - Les messages peuvent encore être envoyés jusqu'à 20h
   - Consulter le résumé de la journée

6. **Rapport Journalier**
   - Total traité
   - Taux de confirmation
   - Commandes à traiter manuellement

## 9. Raccourcis Clavier

**F5** : Rafraîchir la page
**Ctrl + R** : Recharger l'interface
**Ctrl + Shift + I** : Ouvrir la console (debug)

## 10. Console Développeur (Debug)

Si vous avez un problème:

1. Appuyez sur **F12** (ou Ctrl+Shift+I)
2. Allez dans l'onglet **Console**
3. Cherchez les erreurs en rouge
4. Copiez les messages pour le support

## 11. Personnalisation

### Changer les Horaires
Modifier le fichier `.env`:
```env
CALL_START_HOUR=9    # Appels de 9h
CALL_END_HOUR=17     # à 17h
```
Redémarrer le serveur.

### Changer l'Intervalle
```env
CHECK_INTERVAL=2     # Vérifier toutes les 2 minutes
```

## 📱 Interface Mobile

L'interface est responsive et fonctionne sur mobile:
- Les cartes s'empilent verticalement
- Boutons adaptés au tactile
- Même fonctionnalités qu'en desktop

## 🎨 Personnalisation Visuelle

Pour changer les couleurs, éditez [public/index.html](public/index.html):
```css
/* Ligne 20-25 : Couleurs du header */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Ligne 50-55 : Couleurs des cartes */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 🆘 Support

Si vous avez des questions sur l'interface:
- Consultez [README.md](README.md)
- Regardez les logs: `logs/combined.log`
- Vérifiez la console développeur (F12)

---

**💡 Astuce:** Gardez l'interface ouverte en permanence pour surveiller le système en temps réel !
