# 🛍️ Legancy Boutique - E-Commerce Premium

Bienvenue sur **Legancy Boutique** - un site e-commerce luxe et moderne construit avec HTML, CSS et JavaScript vanilla.

---

## 📁 Structure du Projet

```
legancy_pro_SITE OFFICIEL/
├── index.html              # Page d'accueil avec best sellers
├── catalogue.html          # Catalogue complet avec filtres
├── product.html            # Page détails produit
├── conditions.html         # Conditions, livraison, paiement
│
├── style.css               # Styles premium sombre (100% responsive)
│
├── products.js             # Base de données produits (17 produits)
├── app.js                  # Logique principale (panier, config)
├── hero.js                 # Slider héroïque
├── homepage.js             # Best sellers affichage
├── catalogue.js            # Filtrage dynamique catalogue
├── product-detail.js       # Page détails produit
│
├── assets/
│   ├── logo.jpg           # Logo Legancy Boutique
│   ├── hero1.jpg          # Images hero slider
│   ├── hero2.jpg
│   ├── hero3.jpg
│   └── hero4.jpg
│
└── README.md              # Ce fichier
```

---

## ✨ Caractéristiques Principales

### 🎨 Design
- **Style Sombre Premium** : Interface élégante avec dégradés bleus et effets glow
- **100% Responsive** : Desktop, tablette, mobile (optimisé jusqu'à 320px)
- **Animations Fluides** : Transitions CSS3, hover 3D, animations de chargement
- **Design Futuriste** : Effets modernes, UI orientée conversion

### 🛒 Système E-Commerce
- **17 Produits** : Organisés en 4 catégories (Style, Santé, Skin Care, Tech)
- **Panier Fonctionnel** : Ajout/suppression produits, calcul automatique
- **Filtrage Dynamique** : Filtres par catégorie sans rechargement
- **Gestion Produits** : Ajout facile de nouveaux produits via `products.js`

### 📦 Livraison & Paiement
- **Tarifs Intelligents** :
  - Abidjan : **Gratuit**
  - Bassam/Anyama/Zone Industrielle : **1 000 FCFA**
  - Hors Abidjan : **2 000 FCFA**
- **Paiement à la Livraison** : Unique mode de paiement
- **Statut Commande** : Suivi exact "Neutre", "Confirmée", etc.

### 🌐 Fonctionnalités
- **Multi-Pages** : Accueil, Catalogue, Détails Produit, Conditions
- **Hero Slider** : Affichage automatique avec navigation dots
- **WhatsApp Intégration** : Liens directs pour contact rapide
- **Stockage Local** : Panier sauvegardé via localStorage
- **Navigation Fluide** : Menu responsive, footer complet

---

## 🚀 Utilisation

### Ajouter un Nouveau Produit

Ouvrez `products.js` et ajoutez un objet à la liste `PRODUCTS` :

```javascript
{
  id: 18,
  name: "Nom du Produit",
  category: "Style",  // ou "Santé", "Skin care", "Tech"
  subcategory: "Boxeurs",
  price: 15000,
  oldPrice: 22000,      // Optionnel, pour les promos
  promoLabel: "PROMO",  // Optionnel
  images: [
    "url_image1.jpg",
    "url_image2.jpg",
    // ... max 6 images
  ],
  description: "Description courte",
  benefits: ["Bénéfice 1", "Bénéfice 2", "Bénéfice 3"],
  reviews: [
    {
      name: "Nom Client",
      stars: 5,
      text: "Avis du client"
    }
  ]
}
```

### Modifier Configuration

Dans `app.js`, section `CONFIG` :

```javascript
const CONFIG = {
  WHATSAPP_NUMBER: '2250768245917',  // Numéro WhatsApp
  BUSINESS_NAME: 'Legancy Boutique',
  SHIPPING_CONFIG: {
    ABIDJAN_FREE: 0,
    SPECIAL_ZONES: 1000,
    OUTSIDE_ABIDJAN: 2000
  }
};
```

### Personnaliser le Design

`style.css` utilise des variables CSS pour un theming facile :

```css
:root {
  --primary-glow: #3b82f6;      /* Couleur primaire (bleu) */
  --secondary-glow: #8b5cf6;    /* Couleur secondaire (violet) */
  --danger: #ef4444;            /* Couleur alerte (rouge) */
  --text: #ffffff;              /* Couleur texte */
  --bg: #0a0a0a;                /* Fond */
}
```

---

## 📱 Responsive Design

### Breakpoints
- **Desktop** : ≥1200px
- **Tablette** : 768px - 1199px
- **Smartphone** : 480px - 767px
- **Petit Mobile** : < 480px

Tous les éléments s'adaptent automatiquement avec flexbox et grid CSS.

---

## 💾 Gestion du Panier

Le panier est stocké en **localStorage** :

```javascript
// Ajouter un produit
window.cart.addItem(product, quantity);

// Voir le panier
console.log(window.cart.items);

// Obtenir le total
const total = window.cart.getTotal();

// Vider le panier
window.cart.clear();
```

---

## 🔧 Maintenance & Évolution

### Ajouter une Page
1. Créez `nompage.html`
2. Copiez la structure de header/footer depuis `index.html`
3. Créez `nompage.js` si besoin d'interactivité
4. Incluez les scripts : `<script src="products.js"></script>` et `<script src="app.js"></script>`

### Modifier le Logo
Remplacez `assets/logo.jpg` par votre propre logo (recommandé : 56x56px minimum).

### Ajouter des Images Hero
Mettez à jour les URLs dans `hero.js` :

```javascript
this.images = [
  'assets/hero1.jpg',
  'assets/hero2.jpg',
  'assets/hero3.jpg',
  'assets/hero4.jpg'
];
```

---

## 📊 Statuts de Commande

Les statuts possibles (exactement comme spécifiés) :
- `Neutre` - Commande reçue, en attente
- `Confirmée` - Paiement reçu, en préparation
- `En livraison` - Colis en chemin
- `Livrée` - Commande reçue avec succès

---

## 🌍 Déploiement

Le site est **100% prêt pour la mise en ligne** :

✅ Code clean et documenté  
✅ Structure optimisée  
✅ 100% responsive  
✅ Performance optimale  
✅ SEO friendly (meta tags)  
✅ Accessible (ARIA labels)  

Simplement téléchargez les fichiers sur votre hébergeur ou serveur.

---

## 📞 Support

Pour toute question sur la configuration ou l'évolution du site, consultez les commentaires dans chaque fichier JavaScript.

---

**Legancy Boutique © 2025** - Tous droits réservés.

Crafted with passion 💎
