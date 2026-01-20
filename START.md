# 🚀 DÉMARRAGE RAPIDE - Légancy Boutique v2.0

> **Mettez en marche en 2 minutes!**

---

## ⚡ Démarrer le Site (30 secondes)

### Méthode 1: Simple (Double-cliquez)
```
1. Ouvrir: index.html
2. ✅ Site charge automatiquement
```

### Méthode 2: Optimal (http-server)
```bash
# Terminal/CMD:
npx http-server

# Ouvrir dans navigateur:
http://localhost:8080
```

---

## 👥 Première Utilisation Client

### Ajouter au Panier
```
1. Voir produits sur la page
2. Cliquer "Ajouter au Panier"
3. Voir sidebar panier mise à jour
4. Nombre d'articles affiché
```

### Passer Commande
```
1. Cliquer "Passer Commande"
2. Remplir TÉLÉPHONE (obligatoire)
3. Optionnel: Prénom, Nom, Lieu, Note
4. Lieu affecte livraison (live update!)
5. Cliquer "Valider Commande"
6. Envoyer via WhatsApp
```

### Voir Livraison
```
Lieu entered → Livraison calculée auto:
├─ "Plateau" → 0 FCFA (gratuit!)
├─ "Bassam" → 1000 FCFA (zone spéciale)
└─ "Yamoussoukro" → 2000 FCFA (hors Abidjan)
```

---

## 👨‍💻 Première Utilisation Dev

### Tester la Livraison
```javascript
// Ouvrir F12 (DevTools)
// Aller à Console
// Copier-coller:

testShipping()

// Voir résultats (12/12 tests)
```

### Voir le Code
```javascript
// En console:

// Voir communes Abidjan
console.table(ABIDJAN_COMMUNES)

// Voir zones spéciales
console.table(SPECIAL_ZONES_1000)

// Tester un lieu
calculateShipping('Plateau')      // → 0
calculateShipping('Bassam')       // → 1000
```

### Tester le Cart
```javascript
// En console:

// Voir articles
CartManager.getItems()

// Voir total
CartManager.getSubtotal()

// Ajouter un test
CartManager.add(999, 'Test Product', 5000, 1)
CartManager.saveCartToStorage()
location.reload()
```

---

## 📚 Documentation Essentielle

### Pour Les Clients (5 min)
1. Lire: [GUIDE_UTILISATEUR.md](GUIDE_UTILISATEUR.md)
   - Comment utiliser
   - FAQ
   - Tips

### Pour Les Devs (15 min)
1. Lire: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) (2 min)
2. Lire: [GUIDE_DEVELOPPEUR.md](GUIDE_DEVELOPPEUR.md) (10 min)
3. Tester: `testShipping()` (1 min)
4. Lancer: Console debugging (2 min)

### Vue Globale (10 min)
1. [README.md](README.md) - Aperçu (3 min)
2. [RÉSUMÉ_FINAL.md](RÉSUMÉ_FINAL.md) - Changements (5 min)
3. [INDEX_DOCUMENTATION.md](INDEX_DOCUMENTATION.md) - Navigation (2 min)

---

## 🔧 Modifications Courantes

### Ajouter une Zone à 1000 FCFA

**Localiser:** [app.js](app.js#L25)

```javascript
const SPECIAL_ZONES_1000 = [
  'bassam',
  // ... existant ...
  'ma_nouvelle_zone'  // ← AJOUTER ICI
];
```

**Tester:**
```javascript
calculateShipping('Ma Nouvelle Zone')  // → 1000 FCFA
```

### Ajouter une Commune Abidjan

**Localiser:** [app.js](app.js#L15)

```javascript
const ABIDJAN_COMMUNES = [
  'abobo',
  // ... existant ...
  'nouvelle_commune'  // ← AJOUTER ICI
];
```

**Tester:**
```javascript
calculateShipping('Nouvelle Commune')  // → 0 FCFA
```

### Changer le Tarif de Base

**Localiser:** [app.js](app.js#L75)

```javascript
function calculateShipping(city) {
  // ... règles prioritaires ...
  
  return 2500;  // ← CHANGER DE 2000 À 2500
}
```

---

## 🧪 Vérifications Rapides

### ✅ Livraison
```javascript
testShipping()  // Doit montrer 12/12 ✓
```

### ✅ Cart
```javascript
CartManager.getItems()  // Doit retourner articles
CartManager.getSubtotal() // Doit retourner nombre
```

### ✅ localStorage
```javascript
localStorage.getItem('cart')  // Doit avoir données
JSON.parse(localStorage.cart)  // Doit être JSON valide
```

### ✅ Formulaire
```javascript
// Remplir et valider
document.querySelector('#checkout-modal')
// Téléphone obligatoire, autres optionnels
```

---

## 🐛 Problèmes Courants

### "Livraison toujours 2000 FCFA"
```
Cause: Ville pas dans les arrays
Solution: 
1. Vérifier orthographe
2. Lancer: console.table(ABIDJAN_COMMUNES)
3. Vérifier si ville présente
```

### "Formulaire bloqué"
```
Cause: Téléphone vide ou < 8 caractères
Solution:
1. Entrer au moins 8 chiffres
2. Autres champs optionnels
```

### "localStorage vide après refresh"
```
Cause: Mode incognito/privé
Solution:
1. Utiliser mode normal
2. Ou accepter comportement (attendu)
```

### "WhatsApp ne s'ouvre pas"
```
Cause: Lien malformé ou no WhatsApp app
Solution:
1. Utiliser WhatsApp Web
2. Ou copier les détails manuellement
```

---

## 📱 Tester Mobile

### Depuis PC
```
1. Ouvrir Developer Tools (F12)
2. Cliquer "Toggle device toolbar" (Ctrl+Shift+M)
3. Choisir téléphone
4. Tester navigation, panier, formulaire
```

### Depuis Téléphone
```
1. Servir site: npx http-server
2. Depuis téléphone: http://<IP_PC>:8080
3. Tester panier, livraison, WhatsApp
```

---

## 💡 Tips Utiles

### 💡 Tip 1: localStorage Clear
```javascript
// Nettoyer les données:
localStorage.clear()
location.reload()
```

### 💡 Tip 2: Console Shortcut
```javascript
// Alias rapides:
T = () => testShipping()
T()  // Lance les tests

C = () => CartManager.getItems()
C()  // Voir articles
```

### 💡 Tip 3: Voir Tous les Nombres
```javascript
// En console, afficher tous les résultats:
for (let commune of ABIDJAN_COMMUNES) {
  console.log(`${commune} → ${calculateShipping(commune)}`)
}
```

### 💡 Tip 4: Backup Avant Modification
```bash
# Terminal:
cp app.js app.js.backup
# Modifier ensuite...
```

---

## 🎯 Prochaines Étapes

### Immédiat (Aujourd'hui)
1. ✅ Tester le site
2. ✅ Vérifier livraison
3. ✅ Tester formulaire
4. ✅ Test mobile

### Court Terme (Cette Semaine)
1. ✅ Lancer avec clients réels
2. ✅ Collecter feedback
3. ✅ Fixer bugs mineurs
4. ✅ Monitorer performances

### Medium Terme (Ce Mois)
1. ✅ Analytics et rapports
2. ✅ Optimisations
3. ✅ Nouvelles zones
4. ✅ Versions v2.1

---

## 📊 Status Check

```
✅ Code complet
✅ Tests 12/12 passent
✅ Documentation complète
✅ Mobile testé
✅ Production ready

→ DÉPLOYER CONFIANT! 🚀
```

---

## 🔗 Ressources

| Besoin | Ressource | Temps |
|--------|-----------|-------|
| Démarrer | CE FICHIER | 2 min |
| Utiliser | [GUIDE_UTILISATEUR.md](GUIDE_UTILISATEUR.md) | 10 min |
| Développer | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | 5 min |
| Navigation | [INDEX_DOCUMENTATION.md](INDEX_DOCUMENTATION.md) | 5 min |

---

## ❓ Questions?

### Q: Ça marche vraiment sans server?
**R:** Oui! localStorage sauvegarde le panier localement.

### Q: Je peux modifier le code?
**R:** Oui! Consulter [GUIDE_DEVELOPPEUR.md](GUIDE_DEVELOPPEUR.md)

### Q: Comment déployer?
**R:** Voir [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

### Q: Les données restent après refresh?
**R:** Oui, dans localStorage (mode normal uniquement)

---

<div align="center">

## 🎉 C'est Tout!

**Vous êtes prêt à utiliser Légancy Boutique v2.0**

### Prochaine étape: Ouvrez index.html! 👉

---

Questions? → Voir [INDEX_DOCUMENTATION.md](INDEX_DOCUMENTATION.md)

</div>

---

**Version:** 2.0  
**Date:** Janvier 2026  
**Status:** ✅ READY TO GO

Happy selling! 🛍️
