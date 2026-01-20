# 🧪 TESTER L'INTÉGRATION GOOGLE SHEETS

Ce guide vous aide à vérifier que l'intégration fonctionne correctement.

---

## ✅ TEST 1 : Vérifier le script Apps Script

**Avant de déployer, testez le script directement :**

1. Dans Apps Script, cliquez sur **"Exécuter"** (▶️)
2. Sélectionnez la fonction `doGet`
3. Cliquez **"Exécuter"**
4. Résultat attendu : 
   ```
   Exécution terminée
   Journal : "Le script fonctionne! Utilisez POST pour envoyer des données."
   ```

✅ **Si ça fonctionne** → Le script est OK, passez au déploiement  
❌ **Si erreur** → Vérifiez que vous avez bien copié tout le code de GOOGLE_SHEETS_SCRIPT.gs

---

## ✅ TEST 2 : Tester le déploiement

**Après avoir déployé, testez l'URL Web App :**

1. Copiez votre URL Web App (ex: `https://script.google.com/macros/s/AKfycby.../exec`)
2. Ouvrez cette URL dans votre navigateur
3. Résultat attendu :
   ```
   Le script fonctionne! Utilisez POST pour envoyer des données.
   ```

✅ **Si ce message s'affiche** → Le déploiement est OK  
❌ **Si erreur 404 ou autre** → Redéployez le script (voir Guide dépannage)

---

## ✅ TEST 3 : Test complet depuis le site

**Passez une vraie commande de test :**

### Étape 1 : Préparer le test
1. Vérifiez que l'URL est bien configurée dans `checkout-modal.js`
2. Lancez votre site avec `START.bat`
3. Ouvrez http://localhost:8000

### Étape 2 : Passer une commande test
1. **Ajoutez un produit** au panier
2. Cliquez sur **"Panier"** (bouton en haut)
3. Cliquez sur **"Valider ma Commande"**
4. Remplissez le formulaire :
   - **Nom** : Test User (optionnel)
   - **Téléphone** : +225 01 23 45 67 89 (OBLIGATOIRE)
   - **Lieu** : Cocody (optionnel)
   - **Note** : Commande test (optionnel)
5. Cliquez sur **"Envoyer Commande"**

### Étape 3 : Vérifier dans Google Sheets
1. Ouvrez votre Google Sheets
2. **Une nouvelle ligne doit apparaître** immédiatement
3. Vérifiez les données :

| Colonne            | Valeur attendue                    |
|--------------------|------------------------------------|
| Date               | Date/heure actuelle                |
| Nom du client      | "Test User" ou "N/A"              |
| Numéro             | +225 01 23 45 67 89               |
| Lieu de livraison  | "Cocody" ou "Non spécifié"        |
| Note               | "Commande test" ou vide           |
| Produits           | "[Nom produit] x1"                |
| Prix               | Prix total                         |
| Statuts            | "Neutre"                          |

---

## ✅ RÉSULTATS ATTENDUS

### ✅ Test réussi si :
- ✅ Une nouvelle ligne apparaît dans Google Sheets
- ✅ Toutes les colonnes sont remplies
- ✅ Le statut est "Neutre"
- ✅ La date est au format JJ/MM/AAAA HH:MM
- ✅ Les produits sont bien listés
- ✅ Le prix total est correct

### ❌ Test échoué si :
- ❌ Aucune ligne n'apparaît → Voir section Dépannage ci-dessous
- ❌ Colonnes vides ou mal placées → Vérifier l'ordre des colonnes
- ❌ Erreur JavaScript → Vérifier l'URL dans checkout-modal.js

---

## 🔧 DÉPANNAGE

### Problème 1 : Rien ne s'ajoute dans le Sheets

**Causes possibles :**

1. **URL mal copiée dans checkout-modal.js**
   - Solution : Vérifiez ligne 10 de checkout-modal.js
   - L'URL doit finir par `/exec` (pas `/dev`)

2. **Script pas déployé ou mauvaise version**
   - Solution : Apps Script → Déploiements → Nouveau déploiement
   - Notez la nouvelle URL et remplacez dans checkout-modal.js

3. **Autorisations non accordées**
   - Solution : Apps Script → Exécuter → Autoriser
   - Puis redéployez

### Problème 2 : Colonnes mal placées

**Cause :** L'ordre des colonnes dans votre Sheets ne correspond pas au script

**Solution :**
1. Vérifiez l'ordre exact de vos colonnes dans le Sheets
2. Si différent, modifiez le fichier `GOOGLE_SHEETS_SCRIPT.gs` ligne 30-38
3. Correspondance à respecter :

```javascript
const rowData = [
  date,                    // Colonne 1 : Date
  data.customerName,       // Colonne 2 : Nom du client
  data.phone,              // Colonne 3 : Numéro
  data.city,               // Colonne 4 : Lieu de livraison
  data.comment,            // Colonne 5 : Note
  produitsTexte,           // Colonne 6 : Produits
  data.total,              // Colonne 7 : Prix
  "Neutre"                 // Colonne 8 : Statuts
];
```

### Problème 3 : Erreur CORS ou réseau

**Cause :** Restriction réseau ou browser

**Solution :**
1. Testez dans un autre navigateur (Chrome recommandé)
2. Désactivez les extensions bloquant les requêtes
3. Vérifiez que le déploiement est "Public" (Tout le monde)

### Problème 4 : Console Browser montre une erreur

**Pour voir les erreurs :**
1. Appuyez sur **F12** dans votre navigateur
2. Allez dans l'onglet **Console**
3. Passez une commande et notez l'erreur
4. Solutions courantes :
   - `Failed to fetch` → URL incorrecte dans checkout-modal.js
   - `CORS error` → Script pas déployé en mode "Tout le monde"
   - `404 Not Found` → URL invalide ou script supprimé

---

## 📊 TEST AVANCÉ : Plusieurs commandes

Pour tester la robustesse :

1. **Test 1** : Commande complète (tous les champs remplis)
2. **Test 2** : Commande minimale (juste téléphone)
3. **Test 3** : Commande avec plusieurs produits
4. **Test 4** : Commande avec caractères spéciaux dans la note
5. **Test 5** : Commande avec lieu de livraison spécial (ex: "Grand-Bassam")

Toutes doivent apparaître correctement dans le Sheets.

---

## ✅ VALIDATION FINALE

Votre intégration est **opérationnelle** si :

✅ Chaque commande crée une ligne dans Google Sheets  
✅ Toutes les données sont présentes  
✅ Le statut est "Neutre" par défaut  
✅ Pas d'erreur dans la console browser  
✅ Le client reçoit un message de confirmation sur le site  

---

## 🎉 PRÊT POUR LA PRODUCTION

Si tous les tests sont ✅, votre système est **production-ready** !

Vous pouvez maintenant :
- Mettre le site en ligne
- Recevoir de vraies commandes
- Gérer les statuts dans Google Sheets

---

**Besoin d'aide ?** Consultez SETUP_GOOGLE_SHEETS.md section Dépannage
