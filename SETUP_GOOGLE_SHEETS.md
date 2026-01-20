# 📋 GUIDE D'INTÉGRATION GOOGLE SHEETS
## Legancy Boutique - Configuration Complète

---

## 🎯 OBJECTIF
Connecter votre site e-commerce à votre Google Sheets existant pour que chaque commande s'ajoute automatiquement.

**Lien de votre Google Sheets:** 
https://docs.google.com/spreadsheets/d/1T-D0SvFw7xI6gVurg--oyQIT1h4SKLxpkgus_rwoOdc/edit

---

## ✅ ÉTAPE 1 : OUVRIR GOOGLE APPS SCRIPT

1. **Ouvrez votre Google Sheets** (le lien ci-dessus)
2. Dans le menu, cliquez sur **Extensions** → **Apps Script**
3. Une nouvelle fenêtre s'ouvre avec un éditeur de code

---

## ✅ ÉTAPE 2 : COPIER LE SCRIPT

1. Dans l'éditeur Apps Script, **supprimez tout le code** existant (le fichier `Code.gs`)
2. **Copiez intégralement** le contenu du fichier `GOOGLE_SHEETS_SCRIPT.gs` (dans ce dossier)
3. **Collez-le** dans l'éditeur Apps Script
4. Cliquez sur **💾 Enregistrer** (icône disquette ou Ctrl+S)

---

## ✅ ÉTAPE 3 : DÉPLOYER LE SCRIPT

### A) Cliquez sur "Déployer" (bouton bleu en haut à droite)
   - Sélectionnez **"Nouveau déploiement"**

### B) Configurer le déploiement
   1. **Type de déploiement** : Sélectionnez **"Application Web"**
   2. **Description** : Écrivez "API Legancy Boutique"
   3. **Exécuter en tant que** : Choisissez **"Moi"** (votre compte)
   4. **Qui a accès** : Choisissez **"Tout le monde"**
   5. Cliquez sur **"Déployer"**

### C) Autoriser l'accès
   - Google vous demandera d'autoriser l'accès
   - Cliquez sur **"Examiner les autorisations"**
   - Sélectionnez votre compte Google
   - Si un avertissement "Application non vérifiée" apparaît :
     - Cliquez sur **"Paramètres avancés"**
     - Puis sur **"Accéder à [nom du projet] (non sécurisé)"**
   - Autorisez l'accès

### D) Copier l'URL du déploiement
   - Une fois déployé, une **URL Web App** apparaît
   - Elle ressemble à : 
     ```
     https://script.google.com/macros/s/AKfycby.../exec
     ```
   - **COPIEZ CETTE URL** (vous en aurez besoin à l'étape suivante)

---

## ✅ ÉTAPE 4 : CONFIGURER LE SITE

1. **Ouvrez le fichier** `checkout-modal.js`
2. **Cherchez la ligne 7** (début du fichier) :
   ```javascript
   this.googleSheetsURL = 'https://script.google.com/macros/...';
   ```
3. **Remplacez l'URL** par celle que vous venez de copier à l'étape 3D
4. **Enregistrez** le fichier

---

## ✅ ÉTAPE 5 : TESTER L'INTÉGRATION

### Test 1 : Commande test
1. Lancez votre site (avec `START.bat`)
2. Ajoutez un produit au panier
3. Cliquez sur **"Valider ma Commande"**
4. Remplissez le formulaire (numéro de téléphone obligatoire)
5. Cliquez sur **"Envoyer Commande"**

### Test 2 : Vérifier Google Sheets
1. Retournez dans votre Google Sheets
2. **Une nouvelle ligne doit apparaître** avec :
   - Date de la commande
   - Nom (si fourni)
   - Numéro de téléphone
   - Lieu de livraison (si fourni)
   - Note/commentaire (si fourni)
   - Produits commandés
   - Prix total
   - Statut : **"Neutre"**

---

## 🔧 DÉPANNAGE

### Problème : La commande n'apparaît pas dans le Sheets

**Vérifiez :**
1. L'URL dans `checkout-modal.js` est la bonne
2. Le script Apps Script est bien déployé (onglet "Déploiements")
3. Les autorisations sont accordées

**Solution rapide :**
1. Dans Apps Script, allez dans **Déploiements** → **Gérer les déploiements**
2. Cliquez sur **"Nouveau déploiement"** avec les mêmes paramètres
3. Copiez la nouvelle URL et remplacez-la dans `checkout-modal.js`

### Problème : Erreur "Script non autorisé"

**Solution :**
1. Ouvrez Apps Script
2. Cliquez sur **Exécuter** (bouton ▶️) pour tester le script
3. Autorisez les permissions demandées
4. Redéployez le script

### Problème : Colonnes mal alignées

**Vérification :**
Votre Google Sheets doit avoir **exactement** ces colonnes dans cet ordre :
1. Date
2. Nom du client
3. Numéro
4. Lieu de livraison
5. Note
6. Produits
7. Prix
8. Statuts

Si l'ordre diffère, modifiez le script `GOOGLE_SHEETS_SCRIPT.gs` ligne 30-38.

---

## 📊 STRUCTURE DES DONNÉES ENVOYÉES

Chaque commande envoie ces informations :
```javascript
{
  customerName: "Nom du client" ou "N/A",
  phone: "+225 07 68 24 59 17",
  city: "Cocody" ou "Non spécifié",
  comment: "Note éventuelle" ou "",
  items: '[{"name":"Produit","quantity":2,"price":5000}]',
  total: 10000,
  timestamp: "2025-01-10 14:32:15"
}
```

---

## 🎉 RÉSULTAT FINAL

Une fois configuré, votre système fonctionne ainsi :

1. **Client passe commande** sur votre site
2. **Commande ajoutée** automatiquement dans Google Sheets
3. **Statut initial** : "Neutre"
4. **Vous gérez** ensuite manuellement les statuts dans le Sheets

✅ Aucune intervention manuelle nécessaire  
✅ Toutes les commandes enregistrées automatiquement  
✅ Système fiable et production-ready  

---

## 📞 BESOIN D'AIDE ?

Si vous rencontrez un problème :
1. Vérifiez que l'URL Apps Script est bien copiée dans `checkout-modal.js`
2. Testez le script directement dans Apps Script (bouton Exécuter)
3. Consultez les logs dans Apps Script (Affichage → Journaux)

---

**Version:** 1.0.0  
**Date:** Janvier 2026  
**Legancy Boutique** - Système e-commerce premium
