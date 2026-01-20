# ⚡ CONFIGURATION RAPIDE GOOGLE SHEETS
## 3 étapes - 5 minutes

---

## 📍 VOTRE GOOGLE SHEETS
https://docs.google.com/spreadsheets/d/1T-D0SvFw7xI6gVurg--oyQIT1h4SKLxpkgus_rwoOdc/edit

---

## ✅ ÉTAPE 1 : Copier le script (1 min)

1. Ouvrez votre Google Sheets (lien ci-dessus)
2. Menu **Extensions** → **Apps Script**
3. **Supprimez** tout le code existant
4. **Copiez** le contenu du fichier `GOOGLE_SHEETS_SCRIPT.gs`
5. **Collez-le** dans Apps Script
6. **Enregistrez** (Ctrl+S)

---

## ✅ ÉTAPE 2 : Déployer (2 min)

1. Cliquez sur **"Déployer"** → **"Nouveau déploiement"**
2. Sélectionnez **"Application Web"**
3. Configuration :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
4. Cliquez **"Déployer"**
5. **Autorisez** l'accès (suivez les étapes si besoin)
6. **COPIEZ L'URL** générée (elle ressemble à : `https://script.google.com/macros/s/AKfycby.../exec`)

---

## ✅ ÉTAPE 3 : Configurer le site (1 min)

1. Ouvrez le fichier **`checkout-modal.js`**
2. Ligne 10, remplacez :
   ```javascript
   this.googleSheetsURL = 'https://script.google.com/macros/s/VOTRE_URL_ICI/exec';
   ```
   Par **votre URL copiée** à l'étape 2
3. **Enregistrez**

---

## ✅ ÉTAPE 4 : Tester (1 min)

1. Lancez votre site (`START.bat`)
2. Ajoutez un produit au panier
3. Validez la commande avec un numéro de téléphone
4. Cliquez **"Envoyer Commande"**
5. **Vérifiez** dans votre Google Sheets → nouvelle ligne ajoutée ! ✨

---

## ⚠️ IMPORTANT

Vos colonnes Google Sheets doivent être dans cet ordre exact :
1. Date
2. Nom du client
3. Numéro
4. Lieu de livraison
5. Note
6. Produits
7. Prix
8. Statuts

---

## 🎉 C'EST TOUT !

Chaque commande s'ajoute automatiquement avec le statut "Neutre".

📖 **Guide complet** : Voir `SETUP_GOOGLE_SHEETS.md`
