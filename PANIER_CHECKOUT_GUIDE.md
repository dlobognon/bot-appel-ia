# 🛒 Système de Panier & Checkout Premium - Legancy Boutique

## 📋 Vue d'ensemble

Ce système offre une expérience de commande premium et fluide avec :
- ✅ **Panier Modal Moderne** - Sidebar avec animations smooth
- ✅ **Formulaire de Checkout** - Modal avec validation
- ✅ **Deux Options de Validation** - WhatsApp ou Google Sheets
- ✅ **Design Futuriste** - Style IA sombre avec glow discret
- ✅ **100% Responsive** - Fonctionne sur tous les appareils

---

## 🎯 Fichiers Modifiés & Créés

### ✨ Nouveaux Fichiers JS
- **`cart-modal.js`** (2.8 KB) - Gestion du panier en modal
- **`checkout-modal.js`** (7.2 KB) - Formulaire et validation de commande

### 🎨 Styles
- **`cart-checkout-styles.css`** (9.5 KB) - Design premium des modals avec animations

### 📝 Fichiers HTML Modifiés
- `index.html` - Ajout des CSS & scripts
- `catalogue.html` - Ajout des CSS & scripts
- `product.html` - Ajout des CSS & scripts
- `conditions.html` - Ajout des CSS & scripts

### 🔧 Fichiers JS Modifiés
- **`app.js`** - Amélioration du `CartManager` avec événements

---

## 🚀 Fonctionnalités

### 1️⃣ PANIER MODAL

#### Comportement
- **Ouverture** : Clic sur bouton "Panier" dans le header
- **Design** : Sidebar glissant depuis la droite avec animation fluide
- **Contenu** :
  - Liste des articles avec images
  - Modification quantités (+/- boutons)
  - Suppression d'articles
  - Calcul automatique total

#### Code Exemple
```javascript
// Ouvrir le panier
window.openCartModal();

// Ou via élément
const cartBtn = document.getElementById('cart-btn');
cartBtn.addEventListener('click', () => {
  window.cartModal.open();
});
```

---

### 2️⃣ CHECKOUT MODAL

#### Formulaire
```
┌─────────────────────────────────────────┐
│  FINALISER VOTRE COMMANDE              │
├─────────────────────────────────────────┤
│ INFORMATIONS PERSONNELLES               │
│  Prénom:        [_________________]    │
│  Nom:           [_________________]    │
│  Téléphone:     [_________________]    │
│                                         │
│ ADRESSE DE LIVRAISON                   │
│  Ville/Quartier: [_________________]   │
│  Adresse détaillée: [____________]     │
│                                         │
│ NOTE OPTIONNELLE                       │
│  Commentaire:   [_________________]    │
│                                         │
│ RÉSUMÉ COMMANDE                         │
│  Sous-total: 45,000 XOF               │
│  Livraison:  2,000 XOF                │
│  ───────────────────────               │
│  TOTAL:      47,000 XOF               │
│                                         │
│ [🟢 Commander via WhatsApp]            │
│ [Envoyer Commande]                     │
└─────────────────────────────────────────┘
```

#### Champs Obligatoires
- ✓ Prénom
- ✓ Nom
- ✓ Téléphone
- ✓ Ville / Lieu de livraison

#### Champs Optionnels
- Note / Commentaire (pour instructions spéciales)

---

## 🔐 Intégrations

### Option 1: WhatsApp
**Flux:**
1. Utilisateur remplit le formulaire
2. Clique "Commander via WhatsApp"
3. Message structuré généré automatiquement
4. Redirection vers WhatsApp Web/App au numéro : **+2250768245917**

**Message Généré (Exemple):**
```
*NOUVELLE COMMANDE* 📦

*Client:* Jean Dupont
*Téléphone:* +225 07 68 24 59 17
*Ville:* Abidjan, Plateau
*Adresse:* Rue ABC, Immeuble X

*Articles:*
T-shirt Premium x1 - 15,000 XOF
Écouteurs Bluetooth x2 - 30,000 XOF

*Sous-total:* 45,000 XOF
*Livraison:* 2,000 XOF
*TOTAL:* 47,000 XOF

*Note:* Livrer après 18h s'il vous plaît

Merci d'utiliser Legancy Boutique! 🎉
```

**Configuration:**
```javascript
// Dans app.js
const CONFIG = {
  WHATSAPP_NUMBER: '2250768245917', // ← Modifier ici
  BUSINESS_NAME: 'Legancy Boutique'
};
```

### Option 2: Google Sheets
**Flux:**
1. Utilisateur remplit le formulaire
2. Clique "Envoyer Commande"
3. Données envoyées vers Google Sheets via webhook
4. Statut: "Neutre" (en attente de confirmation)
5. Message de confirmation affiché

**Données Envoyées:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+225 07 68 24 59 17",
  "city": "Abidjan, Plateau",
  "address": "Rue ABC",
  "comment": "Livrer après 18h",
  "items": [...],
  "subtotal": 45000,
  "shipping": 2000,
  "total": 47000,
  "timestamp": "10/01/2025 14:30:45",
  "status": "Neutre"
}
```

**Configuration Google Sheets:**
```javascript
// Dans checkout-modal.js
this.googleSheetsURL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb';
```

**Setup Google Sheets (Étapes):**
1. Créer un Google Sheet avec colonnes : firstName, lastName, phone, city, address, comment, items, subtotal, shipping, total, timestamp, status
2. Créer une Apps Script qui reçoit les données POST
3. Copier l'URL web du Apps Script dans `checkout-modal.js`

Exemple Apps Script (Google):
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.firstName,
    data.lastName,
    data.phone,
    data.city,
    data.address,
    data.comment,
    JSON.stringify(data.items),
    data.subtotal,
    data.shipping,
    data.total,
    data.timestamp,
    data.status
  ]);
  
  return ContentService.createTextOutput('OK');
}
```

---

## 💾 Stockage Local

### localStorage
```javascript
// Panier (automatique)
localStorage.getItem('legancy_cart') // Array d'articles

// Commandes (sauvegarde automatique)
localStorage.getItem('legancy_orders') // Array de commandes complètes
```

---

## 🎨 Styles Premium

### Animations
- **slideInRight** - Panier s'ouvre depuis la droite
- **scaleUp** - Checkout modal zoom avec élasticité
- **fadeIn** - Overlay apparaît doucement
- **slideUp** - Articles du panier apparaissent en cascade

### Couleurs (CSS Variables)
```css
--primary-glow: #3b82f6      /* Bleu électrique */
--secondary-glow: #8b5cf6    /* Violet */
--success: #10b981           /* Vert validation */
--danger: #ef4444            /* Rouge suppression */
--bg: #0a0a0a                /* Noir très foncé */
--card: rgba(255,255,255,0.05) /* Cartes semi-transparentes */
```

### Responsive
- **Desktop** (≥1200px) - Modal classique (600px)
- **Tablette** (768px-1199px) - Modal 95% largeur
- **Mobile** (<768px) - Modal fullscreen en slide-up
- **Mini** (<480px) - Modal adapté avec moins de padding

---

## 🧪 Tests

### Checklist Validation

#### Panier Modal
- [ ] Clic bouton "Panier" ouvre le modal
- [ ] Articles affichés avec images
- [ ] Quantités modifiables
- [ ] Suppression d'article fonctionne
- [ ] Total recalculé automatiquement
- [ ] Fermeture (X ou overlay) fonctionne

#### Checkout Modal
- [ ] Ouverture depuis le panier
- [ ] Formulaire valide les champs obligatoires
- [ ] Calcul frais de livraison par ville
- [ ] Résumé commande correct
- [ ] WhatsApp ouvre avec bon message
- [ ] Google Sheets reçoit les données
- [ ] Message confirmation s'affiche
- [ ] Panier vidé après commande

#### Design
- [ ] Animations fluides
- [ ] Pas de lag sur animations
- [ ] Responsive sur mobile
- [ ] Glow effects visibles
- [ ] Contraste texte/arrière-plan bon

---

## 🔧 Customisation

### Changer le numéro WhatsApp
```javascript
// app.js
const CONFIG = {
  WHATSAPP_NUMBER: 'NEW_NUMBER_HERE', // Ex: 33612345678
  ...
};
```

### Changer les frais de livraison
```javascript
// app.js
SHIPPING_CONFIG: {
  ABIDJAN_FREE: 0,              // Abidjan gratuit
  SPECIAL_ZONES: 1000,          // Zones proches
  OUTSIDE_ABIDJAN: 2000,        // Hors Abidjan
  SPECIAL_ZONE_KEYWORDS: [...]  // Mots-clés zones
}
```

### Personnaliser textes
- Rechercher les chaînes en français dans les fichiers JS
- Remplacer par vos traductions

---

## 📊 Performance

- **Gzip:** CSS compressé ~3 KB, JS ~10 KB
- **Animations:** GPU-accelerated (transform, opacity)
- **localStorage:** Limité à 5-10 MB, stockage efficace
- **Impact SEO:** Aucun (modals en JS)

---

## 🚨 Troubleshooting

### Le panier ne s'ouvre pas
✓ Vérifier que `cart-modal.js` est chargé dans la page
✓ Vérifier la console pour les erreurs

### Google Sheets ne reçoit rien
✓ Vérifier l'URL du Apps Script
✓ Vérifier que le Apps Script est publié
✓ Vérifier les permissions CORS

### WhatsApp n'ouvre pas
✓ Vérifier le numéro de téléphone (format international)
✓ Utiliser le format sans '+' : `33612345678`

### Animations saccadées
✓ Désactiver les extensions de navigateur
✓ Essayer un autre navigateur
✓ Réduire les effets blur/backdrop-filter

---

## 📚 Fichiers Associés

- `products.js` - Données produits
- `app.js` - CartManager principal
- `style.css` - Design global

---

**Version:** 1.0.0
**Dernière mise à jour:** Janvier 2025
**Auteur:** Legancy Boutique Dev Team
