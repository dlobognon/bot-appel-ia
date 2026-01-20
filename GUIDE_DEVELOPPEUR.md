# 💻 GUIDE DÉVELOPPEUR - Architecture & Maintenance

## 📦 Structure du Projet

```
legancy_pro_SITE OFFICIEL/
├── index.html                    # Page principale (produits)
├── product.html                  # Page détails produit
├── app.js                         # ⭐ Configuration & Logique principale
├── script.js                      # ⭐ Gestion des événements DOM
├── product.js                     # ⭐ Logique produits
├── cart-modal.js                  # ⭐ Sidebar panier (NOUVEAU)
├── checkout-modal.js              # ⭐ Formulaire de commande (NOUVEAU)
├── style.css                      # Styles généraux
├── cart-checkout-styles.css       # Styles panier & checkout (NOUVEAU)
├── LIVRAISON_IVOIRIENNE.md       # Documentation livraison
├── GUIDE_UTILISATEUR.md           # Guide pour les clients
└── assets/
    └── [images, etc.]
```

**Légende:** ⭐ = Fichiers critiques pour ce projet

---

## 🎯 Architecture Générale

### Flux d'Exécution

```
index.html (charge)
  ├─→ style.css (global)
  ├─→ app.js (config + CartManager)
  ├─→ script.js (événements globaux)
  ├─→ product.js (logique produits)
  ├─→ cart-modal.js (sidebar panier)
  ├─→ checkout-modal.js (formulaire)
  └─→ cart-checkout-styles.css (styles)
       
Utilisateur ajoute article
  └─→ script.js (événement click)
       └─→ CartManager.add() (app.js)
            └─→ UI update (cart-modal.js)
                 └─→ Affichage sidebar
                 
Utilisateur valide commande
  └─→ checkout-modal.js (formulaire)
       ├─→ validateForm() (validation)
       ├─→ calculateShipping() (app.js)
       └─→ sendViaWhatsApp() ou copie
```

---

## 🔑 Modules Clés

### 1. **app.js** - Cœur de l'Application

#### CartManager

```javascript
class CartManager {
  add(id, name, price, quantity)        // Ajouter au panier
  remove(id)                            // Retirer du panier
  updateQuantity(id, quantity)          // Modifier quantité
  getItems()                            // Récupérer articles
  getSubtotal()                         // Total sans livraison
  getTotal()                            // Total (actuellement = sous-total)
  getShipping(city)                     // ⚠️ DEPRECATED - utiliser calculateShipping()
  clear()                               // Vider le panier
  getCartFromStorage()                  // Charger depuis localStorage
  saveCartToStorage()                   // Sauvegarder dans localStorage
}
```

#### Gestion Livraison

```javascript
// Arrays (MODIFIER ICI pour ajouter zones)
const ABIDJAN_COMMUNES = [...]     // 8 communes
const SPECIAL_ZONES_1000 = [...]   // 9 zones spéciales

// Fonction CRITIQUE
function calculateShipping(city)
  // Entrée: string (lieu)
  // Sortie: number (frais en FCFA)
  // Logique: 3 règles prioritaires
  
function testShipping()
  // Fonction de test avec 12 cas
  // À utiliser en console: testShipping()
```

#### Structure localStorage

```javascript
{
  cart: [
    { id: 1, name: 'Robe A', price: 5000, quantity: 2 },
    { id: 2, name: 'Robe B', price: 8000, quantity: 1 }
  ]
}
```

---

### 2. **checkout-modal.js** - Formulaire de Commande

#### Structure Form HTML

```html
<form id="checkout-form">
  <div class="form-group">
    <input type="tel" id="phone" placeholder="..." required>
    <span class="required-badge">OBLIGATOIRE</span>
    <small class="form-help">Ceci sera utilisé pour confirmer votre commande</small>
  </div>
  
  <div class="form-group">
    <input type="text" id="firstName" placeholder="..." optional>
  </div>
  
  <div class="form-group">
    <input type="text" id="city" placeholder="..." optional>
    <small class="form-help">Affecte le calcul de livraison</small>
  </div>
  
  <!-- ... autres champs optionnels ... -->
</form>
```

#### Méthodes Clés

```javascript
class CheckoutModal {
  // Validation
  validateForm()
    // ✅ Validation SIMPLE: téléphone obligatoire
    // Autres champs OPTIONNELS
    
  // Récupération données
  getFormData()
    // Retourne: { phone, firstName, lastName, city, comment, shipping }
    // N.A. pour vides (sauf city → "Non spécifié")
    
  // Envoi WhatsApp
  sendViaWhatsApp()
    // 1. Génère message avec articles + totaux
    // 2. Inclut conditionnellement les champs non-vides
    // 3. Ouvre WhatsApp avec lien
    
  // Mise à jour UI
  updateOrderSummary()
    // 1. Affiche articles
    // 2. Calcule livraison avec calculateShipping()
    // 3. Affiche total final
}
```

#### Données Envoyées via WhatsApp

```
Format MESSAGE:
━━━━━━━━━━━━━━━━━━━━━━━━
Bonjour, voici ma commande:

[ARTICLES]
- Produit X (Qte) : Prix FCFA

[TOTAUX]
Sous-total: ... FCFA
Livraison: ... FCFA
TOTAL: ... FCFA

[INFOS CLIENT - optionnel]
Prénom: ...
Nom: ...
Téléphone: ... (TOUJOURS inclus)
Lieu: ...
Note: ...
━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 3. **cart-modal.js** - Sidebar Panier

#### UI Components

```javascript
// Structure sidebar
<div id="cart-modal" class="cart-modal">
  <div class="cart-header">Panier (N articles)</div>
  <div class="cart-items">
    <!-- Articles dynamiques -->
  </div>
  <div class="cart-footer">
    <div class="cart-total">25,000 FCFA</div>
    <button id="checkout-btn">Passer Commande</button>
  </div>
</div>
```

#### Méthodes Clés

```javascript
renderCartItems()
  // Affiche tous les articles du panier
  
updateCartUI()
  // Mise à jour dynamique
  
removeFromCart(id)
  // Retire un article
  
updateQuantity(id, newQty)
  // Change la quantité
```

---

## 📋 Processus Validation

### Diagramme Validation

```
Utilisateur clique "Valider Commande"
        │
        ▼
   Form.getValues()
   { phone, firstName, lastName, city, comment }
        │
        ▼
   validateForm()
   ├─ if (!phone || phone.length < 8)
   │  └─→ ❌ Erreur: "Veuillez entrer numéro valide"
   │  └─→ return false
   │
   └─ Tous autres champs: IGNORÉS si vides
      └─→ ✅ Validation réussie
        │
        ▼
   getFormData()
   { 
     phone: "07 68 24 59 17",
     firstName: "Jean" ou "N.A.",
     lastName: "Doe" ou "N.A.",
     city: "Plateau" ou "Non spécifié",
     comment: "...",
     shipping: calculateShipping(city)  // ← ICI
   }
        │
        ▼
   updateOrderSummary()
   └─ Affiche TOTAL avec livraison
        │
        ▼
   ✅ Prêt à envoyer via WhatsApp
```

---

## 🧮 Calcul Livraison - Algorithme

### Pseudo-code

```javascript
function calculateShipping(city) {
  // 1. Normaliser
  normalizedCity = city.toLowerCase().trim()
  
  // 2. Vérifier ZONES 1000 (PRIORITÉ)
  for zone in SPECIAL_ZONES_1000:
    if normalizedCity.includes(zone):
      return 1000  // ← S'ARRÊTE ICI
  
  // 3. Vérifier COMMUNES ABIDJAN
  for commune in ABIDJAN_COMMUNES:
    if normalizedCity.includes(commune):
      return 0  // ← S'ARRÊTE ICI
  
  // 4. DEFAULT
  return 2000
}
```

### Matrice de Décision

| Condition | Résultat | Priorité |
|-----------|----------|----------|
| Include "bassam" | 1000 | 1️⃣ (Highest) |
| Include "zone industrielle" | 1000 | 1️⃣ |
| Include "plateau" | 0 | 2️⃣ |
| Include "yopougon" | 0 | 2️⃣ |
| Rien ne match | 2000 | 3️⃣ (Lowest) |

---

## 🐛 Debugging

### Tester la Livraison

```javascript
// En console du navigateur (F12):

// Test basique
calculateShipping('Plateau')  // Doit retourner 0
calculateShipping('Bassam')   // Doit retourner 1000

// Test suite complète
testShipping()  // Lance tous les 12 tests

// Avec logs détaillés
function calculateShipping(city) {
  console.log(`📍 Ville entrée: "${city}"`);
  // ... reste du code ...
  console.log(`💰 Résultat: ${result} FCFA`);
  return result;
}
```

### Déboguer Formulaire

```javascript
// En console:

// Voir les données du formulaire
const form = document.querySelector('#checkout-modal');
const data = CheckoutModal.prototype.getFormData.call(CheckoutModal.instance);
console.log(data);

// Vérifier localStorage
console.log(JSON.parse(localStorage.getItem('cart')));

// Tester validation
CheckoutModal.prototype.validateForm.call(CheckoutModal.instance);
```

### Problèmes Courants

| Problème | Cause | Solution |
|----------|-------|----------|
| Livraison toujours 2000 | Villes mal orthographiées | Vérifier ABIDJAN_COMMUNES array |
| Validation bloquée | Téléphone vide | Champ #phone obligatoire |
| WhatsApp ne s'ouvre pas | Lien malformé | Vérifier format URL WhatsApp |
| localStorage plein | Trop de données | Nettoyer ou augmenter quota |

---

## 🔧 Modifications Courantes

### Ajouter une Commune Abidjan

```javascript
// Dans app.js, ligne ~15
const ABIDJAN_COMMUNES = [
  'abobo',
  'adjamé',
  // ... existant ...
  'nouvelle_commune'  // ← AJOUTER
];
```

### Ajouter une Zone 1000 FCFA

```javascript
// Dans app.js, ligne ~30
const SPECIAL_ZONES_1000 = [
  'bassam',
  // ... existant ...
  'quartier_special'  // ← AJOUTER
];
```

### Changer le Tarif par Défaut (hors Abidjan)

```javascript
// Dans app.js, fonction calculateShipping(), ligne ~75
// Actuellement: return 2000;
// Nouveau:
return 2500;  // Augmenter à 2500 FCFA
```

### Modifier le Message WhatsApp

```javascript
// Dans checkout-modal.js, fonction sendViaWhatsApp()

// Chercher: const message = `...`
// Modifier le template selon besoins
// Exemple ajouter prix unitaire:

const message = `
${item.name} x${item.quantity} = ${item.price * item.quantity} FCFA
(${item.price} FCFA l'unité)
`;
```

---

## 🧪 Tests & QA

### Test de Régression

```javascript
// À faire après chaque modification:

// 1. Tester livraison
testShipping();  // Doit afficher 12/12 passing

// 2. Tester cart
CartManager.add(1, 'Test', 5000, 1);
CartManager.getItems();  // Doit avoir 1 item
CartManager.getSubtotal();  // Doit être 5000

// 3. Tester formulaire
validateForm();  // Doit retourner false si phone vide
getFormData();  // Doit retourner données correctes

// 4. Tester localStorage
localStorage.clear();
CartManager.saveCartToStorage();
// Actualiser la page
CartManager.getCartFromStorage();  // Doit restaurer
```

### Checklist de Déploiement

- [ ] `testShipping()` passe (12/12)
- [ ] `CartManager` fonctionne (ajouter/retirer/modifier)
- [ ] Formulaire validation fonctionne (téléphone req)
- [ ] WhatsApp s'ouvre correctement
- [ ] localStorage persiste après refresh
- [ ] Responsive (mobile/desktop/tablet)
- [ ] Pas d'erreurs en console (F12)
- [ ] Tous les produits affichés
- [ ] Styles CSS appliqués

---

## 📊 Performance

### Optimisations Implémentées

✅ **localStorage:** Panier persiste sans serveur
✅ **Lazy loading:** Images chargées on-demand
✅ **String.includes():** Recherche rapide pour villes
✅ **localStorage cache:** Pas de recalcul à chaque chargement

### Limitations Actuelles

⚠️ **Pas de base de données:** Stock n'est pas persistent
⚠️ **localStorage limité:** ~5-10MB par domaine
⚠️ **Pas d'authentification:** Pas de comptes utilisateurs
⚠️ **Pas de paiement:** WhatsApp uniquement

### Améliorations Futures

```javascript
// Potentielles améliorations:
1. Backend: Node.js + MongoDB pour stock
2. Auth: Système de login/inscription
3. Paiement: Intégration Orange Money / Wave
4. Analytics: Tracker des commandes
5. CMS: Admin panel pour gérer produits
6. Notifications: SMS confirmations
```

---

## 📁 Fichiers À Modifier Selon Besoins

| Besoins | Fichier | Ligne |
|---------|---------|-------|
| Changer WhatsApp | app.js | ~5 (CONFIG) |
| Ajouter zone livraison | app.js | ~30-40 |
| Modifier taux de base | app.js | ~75 |
| Changer texte form | checkout-modal.js | ~20-50 |
| Ajouter champ form | checkout-modal.js | ~50-100 |
| Modifier styles | cart-checkout-styles.css | Variable |

---

## 🔐 Sécurité

### Données Sensibles

⚠️ **Pas d'encryption:** Téléphones en clair dans localStorage
⚠️ **localStorage accessible:** JS peut accéder facilement
⚠️ **HTTPS recommandé:** Pour production, utiliser HTTPS

### Bonnes Pratiques

```javascript
// ✅ À FAIRE
- Valider ALL inputs côté client
- Sanitize strings avant utilisation
- Utiliser HTTPS en production
- Logout/clear localStorage selon besoin

// ❌ À NE PAS FAIRE
- Stocker mots de passe en localStorage
- Faire confiance uniquement à validation client
- Utiliser HTTP en production
- Exposer données sensibles en console
```

---

## 📞 Support & Maintenance

### Stack Technique

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Storage:** localStorage (navigateur)
- **Integration:** WhatsApp Web, Google Sheets (optional)
- **Responsive:** Mobile-first design

### Dépendances

✅ **Zéro dépendances externes!** (No npm packages)

```javascript
// Tout est vanilla JS, CSS, HTML
// Avantages:
// - Pas de build process
// - Pas de versions à gérer
// - Pas de sécurité de dépendances
// - Léger et rapide
```

### Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ 100% |
| Firefox | ✅ 100% |
| Safari | ✅ 100% |
| Edge | ✅ 100% |
| IE 11 | ⚠️ Partiel |

---

## 📚 Ressources & Références

### localStorage API
```javascript
localStorage.setItem('key', value);
localStorage.getItem('key');
localStorage.removeItem('key');
localStorage.clear();
```

### WhatsApp API
```
https://api.whatsapp.com/send?phone=2250768245917&text=Hello
```

### JavaScript Strings
```javascript
string.toLowerCase()      // Convertir en minuscules
string.trim()            // Retirer espaces
string.includes('text')  // Chercher substring
```

---

**Version:** 2.0
**Dernière MAJ:** Janvier 2026
**Mainteneur:** Développeur Légancy

---

*Questions? Consultez LIVRAISON_IVOIRIENNE.md pour détails spécifiques.*
