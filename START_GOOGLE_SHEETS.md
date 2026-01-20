# ⚡ DÉMARRAGE RAPIDE GOOGLE SHEETS
## 3 étapes - 5 minutes chrono

---

## 🎯 VOTRE GOOGLE SHEETS
```
https://docs.google.com/spreadsheets/d/1T-D0SvFw7xI6gVurg--oyQIT1h4SKLxpkgus_rwoOdc/edit
```

---

## 📋 ÉTAPE 1/3 : Copier le script (2 min)

1. **Ouvrez** votre Google Sheets ☝️
2. Menu : **Extensions** → **Apps Script**
3. **Supprimez** le code existant
4. **Ouvrez** le fichier `GOOGLE_SHEETS_SCRIPT.gs` (dans ce dossier)
5. **Copiez TOUT** le code
6. **Collez** dans Apps Script
7. **Enregistrez** (Ctrl+S)

---

## 🚀 ÉTAPE 2/3 : Déployer (2 min)

1. Bouton **"Déployer"** → **"Nouveau déploiement"**
2. Sélectionnez **"Application Web"**
3. Configuration :
   ```
   Exécuter en tant que : Moi
   Qui a accès : Tout le monde
   ```
4. **Déployer**
5. **Autoriser** (suivez les étapes Google)
6. **COPIEZ** l'URL générée
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

---

## ⚙️ ÉTAPE 3/3 : Configurer le site (1 min)

1. **Ouvrez** `checkout-modal.js`
2. **Ligne 10**, remplacez :
   ```javascript
   this.googleSheetsURL = 'https://script.google.com/macros/s/VOTRE_URL_ICI/exec';
   ```
   Par l'URL copiée à l'étape 2
3. **Enregistrez**

---

## ✅ TESTER (1 min)

1. Lancez le site : `START.bat`
2. Ajoutez un produit au panier
3. Validez avec un numéro de téléphone
4. **Vérifiez** votre Google Sheets → Nouvelle ligne ! ✨

---

## 📚 BESOIN D'AIDE ?

- **Guide détaillé** : `SETUP_GOOGLE_SHEETS.md`
- **Guide visuel** : `GUIDE_VISUEL_APPS_SCRIPT.md`
- **Tests** : `TESTS_GOOGLE_SHEETS.md`
- **Récapitulatif** : `README_GOOGLE_SHEETS.md`

---

## 🎉 C'EST TOUT !

Votre site envoie maintenant automatiquement les commandes dans Google Sheets.

**Statut par défaut** : Neutre  
**Gestion** : Vous changez les statuts manuellement dans le Sheets

✅ **PRODUCTION READY**
