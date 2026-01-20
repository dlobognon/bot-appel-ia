# 🏗️ Architecture du Projet Legancy Boutique

## Vue d'Ensemble

**Legancy Boutique** est un site e-commerce professionnel multi-pages construit avec les technologies web standards (HTML5, CSS3, JavaScript vanilla) sans dépendances externes.

---

## 📐 Architecture Générale

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Client)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  HTML Pages                                                  │
│  ├─ index.html (Accueil + Best Sellers)                      │
│  ├─ catalogue.html (Catalogue Complet + Filtres)             │
│  ├─ product.html (Détails Produit)                           │
│  └─ conditions.html (Infos Livraison/Paiement)               │
│                                                               │
│  CSS                                                          │
│  └─ style.css (Design Premium Sombre Responsive)             │
│                                                               │
│  JavaScript                                                  │
│  ├─ products.js (Base Données - 17 Produits)                │
│  ├─ app.js (Logique Panier & Config Globale)                │
│  ├─ hero.js (Slider Héroïque)                               │
│  ├─ homepage.js (Affichage Best Sellers)                    │
│  ├─ catalogue.js (Filtrage Dynamique)                       │
│  └─ product-detail.js (Page Détails Produit)                │
│                                                               │
│  Storage Local                                               │
│  └─ localStorage (Panier Utilisateur)                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📄 Pages & Routes

### 1. **index.html** - Accueil
- **URL** : `/index.html`
- **Contenu** :
  - Hero slider (4 images)
  - Best sellers (6 premiers produits)
  - Section contact WhatsApp
  - Footer complet
- **Scripts** : `products.js`, `app.js`, `hero.js`, `homepage.js`

### 2. **catalogue.html** - Catalogue Complet
- **URL** : `/catalogue.html`
- **Contenu** :
  - 5 filtres par catégorie (Tous, Style, Santé, Skin care, Tech)
  - Grille dynamique 17 produits
  - Affichage sans rechargement
- **Scripts** : `products.js`, `app.js`, `catalogue.js`
- **Fonctionnalité** : Support URL params `?cat=Style`

### 3. **product.html** - Détails Produit
- **URL** : `/product.html?id=1`
- **Contenu** :
  - Galerie d'images (max 6)
  - Infos détaillées (nom, prix, bénéfices)
  - Avis clients
  - Sélecteur quantité + Ajouter au panier
- **Scripts** : `products.js`, `app.js`, `product-detail.js`

### 4. **conditions.html** - Conditions & Infos
- **URL** : `/conditions.html`
- **Sections** :
  - 📦 Livraison (tarifs par zone)
  - 💳 Paiement (à la livraison)
  - 📋 Statuts commande
  - Conditions générales

---

## 📦 Modules JavaScript

### **products.js** - Base de Données Produits

```javascript
// Structure d'un produit
{
  id: number,
  name: string,
  category: "Style" | "Santé" | "Skin care" | "Tech",
  subcategory: string,
  price: number (FCFA),
  oldPrice?: number,
  promoLabel?: string,
  images: string[] (max 6),
  description: string,
  benefits: string[],
  reviews: [{name, stars, text}]
}

// Exports globaux
window.PRODUCTS = [...]
window.getMainCategories() // Retourne catégories uniques
window.getProductsByCategory(category) // Filtre par catégorie
```

**17 Produits** :
- Style (6) : Boxers, Chaussures, Écouteurs
- Santé (4) : Spray, Vitamines, Magnésium, Multivitamines
- Skin care (3) : Sérum, Crème, Nettoyant
- Tech (4) : Rasoir, Montre, Chargeur, Powerbank

---

### **app.js** - Logique Principale

#### CartManager (Classe)
Gère le panier utilisateur avec localStorage.

**Méthodes** :
```javascript
cart.addItem(product, quantity)    // Ajoute produit
cart.removeItem(productId)         // Supprime produit
cart.updateQuantity(id, qty)       // Modifie quantité
cart.getSubtotal()                 // Prix HT
cart.getShipping()                 // Calcul livraison smart
cart.getTotal()                    // Montant final
cart.isEmpty()                     // Vérifie si vide
cart.clear()                       // Vide panier
```

#### Configuration
```javascript
CONFIG = {
  WHATSAPP_NUMBER: '2250768245917',
  SHIPPING_CONFIG: {
    ABIDJAN_FREE: 0,
    SPECIAL_ZONES: 1000,        // Bassam, Anyama, Yop ZI
    OUTSIDE_ABIDJAN: 2000
  }
}
```

#### Utilitaires Globaux
```javascript
formatPrice(price)           // Formate 15000 → "15 000 XOF"
getProductById(id)          // Récupère produit par ID
renderProductCard(product)  // HTML produit pour grille
```

---

### **hero.js** - Slider Héroïque

**Classe HeroSlider** :
- Affichage automatique (5s par slide)
- Navigation dots interactifs
- Pause/reprise au survol
- Transitions fluides

```javascript
new HeroSlider()
// Méthodes : goToSlide(), nextSlide(), prevSlide()
```

---

### **homepage.js** - Best Sellers

Affiche les 6 premiers produits de `PRODUCTS` sur l'accueil.

```javascript
new HomePage()
// Rend bestSellersGrid avec écouteurs "Ajouter au panier"
```

---

### **catalogue.js** - Gestion Catalogue

**Classe CatalogueManager** :
- Filtrage par catégorie
- Support params URL (`?cat=Style`)
- Rendu dynamique sans rechargement

```javascript
setFilter('Style')        // Filtre par catégorie
applyFilterFromUrl()      // Applique filtre depuis URL
```

---

### **product-detail.js** - Détails Produit

**Classe ProductDetail** :
- Affichage complet produit
- Galerie d'images (thumbnails cliquables)
- Gestion quantité (±1)
- Avis clients

```javascript
selectImage(index)        // Change image principale
attachListeners()         // Écouteurs interactifs
```

---

## 🎨 Design & CSS Architecture

### Variables de Couleurs
```css
--bg: #0a0a0a                    /* Fond noir profond */
--card: rgba(255,255,255,0.05)   /* Cartes semi-transparentes */
--primary-glow: #3b82f6          /* Bleu principal */
--secondary-glow: #8b5cf6        /* Violet accent */
--danger: #ef4444                /* Rouge alerte */
--text: #ffffff                  /* Texte blanc */
```

### Système de Grille
- **Desktop** : `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`
- **Tablette** : `grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))`
- **Mobile** : `grid-template-columns: repeat(2, 1fr)`

### Composants Réutilisables
- `.btn`, `.primary-btn` : Boutons
- `.product-card` : Carte produit
- `.section` : Sections page
- `.grid` : Grille produits

---

## 🔄 Flux de Données

### Ajouter un Produit au Panier

```
1. User click "Ajouter" (add-to-cart-btn)
   ↓
2. Event listener → getProductById(id)
   ↓
3. cart.addItem(product, quantity)
   ↓
4. CartManager.saveCart() → localStorage
   ↓
5. Feedback visuel (✓ Ajouté)
```

### Filtrer le Catalogue

```
1. User click chip filter
   ↓
2. CatalogueManager.setFilter(category)
   ↓
3. Filtre PRODUCTS array
   ↓
4. renderProducts() → DOM update
   ↓
5. Affichage instantané sans refresh
```

---

## 🚀 Initialisation Vie-Cycle

### Au Chargement Page
```javascript
DOMContentLoaded → 
  1. products.js exposé globalement
  2. app.js → CartManager instancié
  3. Page spécifique (hero.js, catalogue.js, etc.)
  4. Event listeners attachés
```

---

## 💾 Persistence Données

### localStorage Keys
```javascript
'legancy_cart' : JSON.stringify([
  {
    id: number,
    name: string,
    price: number,
    image: string,
    quantity: number,
    category: string
  }
])
```

Les données du panier persistent entre fermetures/réouvertures de page.

---

## 📊 Performance

- **No external dependencies** : Aucune librairie, code vanilla
- **Lightweight** : ~50KB HTML+CSS+JS au total
- **Fast rendering** : CSS Grid/Flexbox natifs
- **Optimized images** : URLs externes (Unsplash) + images locales
- **Lazy loading compatible** : Prêt pour optimisations futures

---

## 🔒 Sécurité

- **No sensitive data** : Pas de backend, paiement à la livraison
- **HTTPS ready** : Tous les liens externes en HTTPS
- **XSS protection** : innerHTML avec content echappé (produits sûrs)
- **localStorage** : Données non sensibles (panier seulement)

---

## 🌐 Déploiement

### Requis
- Simple serveur HTTP (Apache, Nginx, Python, Node, etc.)
- **HTTPS recommandé** pour production

### Hébergement Recommandé
- **GitHub Pages** : Gratuit, statique
- **Vercel** : Gratuit, rapide
- **Netlify** : Gratuit, puissant
- **Hostinger** : Payant, complet

### Installation
```bash
1. Téléchargez tous les fichiers
2. Mettez-les sur votre serveur
3. Assurez les chemins assets/images sont corrects
4. Testez http://yoursite.com
```

---

## 📈 Évolution Future

### Extensions Possibles
- [ ] Backend Node.js/Express + BDD
- [ ] Intégration paiement (Stripe, Wave)
- [ ] Admin panel édition produits
- [ ] Email notifications
- [ ] Analytics (Google Analytics)
- [ ] PWA (Progressive Web App)
- [ ] Darkmode/Lightmode toggle
- [ ] Système d'avis avancé
- [ ] Wishlist utilisateur
- [ ] Recherche produits

---

**Architecture Complète & Maintenable** ✅

Prête pour évolution et mise en ligne sans modification du cœur.

