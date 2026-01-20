# 🚀 GUIDE DE DÉMARRAGE RAPIDE - Legancy Boutique

## ✅ Vérification Avant Lancement

Assurez-vous d'avoir tous ces fichiers :

### 📄 Pages HTML
- [x] `index.html` - Accueil
- [x] `catalogue.html` - Catalogue complet
- [x] `product.html` - Détails produit
- [x] `conditions.html` - Conditions & livraison

### 🎨 Styles
- [x] `style.css` - Feuille de styles (responsive)

### 💻 JavaScript
- [x] `products.js` - Base de données (17 produits)
- [x] `app.js` - Logique principale
- [x] `hero.js` - Slider accueil
- [x] `homepage.js` - Best sellers
- [x] `catalogue.js` - Filtres catalogue
- [x] `product-detail.js` - Détails produit

### 🖼️ Assets
- [x] `assets/logo.jpg` - Logo
- [x] `assets/hero1.jpg` - 4 images hero slider
- [x] `assets/hero2.jpg`
- [x] `assets/hero3.jpg`
- [x] `assets/hero4.jpg`

### 📚 Documentation
- [x] `README.md` - Guide complet
- [x] `ARCHITECTURE.md` - Architecture détaillée
- [x] Ce fichier

---

## 🎯 Premiers Tests

### 1. Test Local Rapide
```bash
# Avec Python 3
python -m http.server 8000

# Ou avec Node.js
npx http-server

# Puis ouvrez : http://localhost:8000
```

### 2. Test des Fonctionnalités

#### ✓ Page d'Accueil
- [ ] Hero slider fonctionne (change d'image)
- [ ] Best sellers affichés (6 produits)
- [ ] Boutons "Ajouter" actifs
- [ ] Lien WhatsApp valide

#### ✓ Catalogue
- [ ] Page charge correctement
- [ ] Filtres changent l'affichage
- [ ] 17 produits visibles en "Tous"
- [ ] Chaque catégorie a des produits

#### ✓ Détails Produit
- [ ] Cliquer "Voir" redirige vers page produit
- [ ] Images changent au clic thumbnail
- [ ] Quantité peut augmenter/diminuer
- [ ] "Ajouter au panier" fonctionne

#### ✓ Panier
- [ ] Compteur panier augmente
- [ ] Données persistent au rechargement
- [ ] Panier stocké en localStorage

#### ✓ Responsive
- [ ] Desktop : 1200px (normal)
- [ ] Tablette : 768px (grille 2 colonnes)
- [ ] Mobile : 480px (adapté)
- [ ] Très petit mobile : 320px (lisible)

---

## 🔧 Configuration Initiale

### Changer le Numéro WhatsApp

**File:** `app.js` (ligne ~10)

```javascript
const CONFIG = {
  WHATSAPP_NUMBER: '2250768245917',  // ← Changez ce numéro
  // ...
};
```

Format : `+225` + numéro sans espaces

### Ajouter un Produit

**File:** `products.js` (fin de la liste)

```javascript
{
  id: 18,
  name: "Nom Produit",
  category: "Style",    // Style / Santé / Skin care / Tech
  subcategory: "Chaussures",
  price: 25000,
  oldPrice: 35000,      // Optionnel
  promoLabel: "PROMO",  // Optionnel
  images: [
    "https://images.unsplash.com/...",
    "https://images.unsplash.com/...",
    // max 6
  ],
  description: "Description produit",
  benefits: ["Bénéfice 1", "Bénéfice 2"],
  reviews: [
    {
      name: "Client Nom",
      stars: 5,
      text: "Super produit!"
    }
  ]
}
```

### Modifier le Logo

Remplacez `assets/logo.jpg` par votre logo (format carré recommandé : 64x64px minimum)

### Changer Images Hero

**File:** `hero.js` (ligne ~20)

```javascript
this.images = [
  'assets/hero1.jpg',  // Changez ces chemins
  'assets/hero2.jpg',
  'assets/hero3.jpg',
  'assets/hero4.jpg'
];
```

---

## 📱 Test Responsivité

### Chrome DevTools
1. Ouvrez le site
2. Appuyez `F12`
3. Cliquez icône mobile (coin supérieur gauche)
4. Testez les dimensions :
   - **Desktop** : 1200px
   - **Tablette iPad** : 768px
   - **iPhone 12** : 390px
   - **Galaxy S20** : 360px

Tout doit être lisible et fonctionnel à chaque taille.

---

## 🚀 Déploiement Production

### Option 1 : GitHub Pages (Gratuit)

```bash
1. Créez repo GitHub : "legancy-boutique"
2. Poussez tous les fichiers
3. Allez à Settings → Pages
4. Source: main branch
5. Le site sera en direct en ~2min
```

**URL** : `https://votreusername.github.io/legancy-boutique`

### Option 2 : Netlify (Gratuit + Plus Rapide)

```bash
1. Connectez-vous à netlify.com
2. Drag & drop le dossier du projet
3. Validez
4. Site en direct instantanément
```

### Option 3 : Votre Hébergement

```bash
1. FTP tous les fichiers
2. Accédez via votre domaine
3. C'est tout!
```

---

## ✨ Points Forts à Vérifier

### ✅ Design Premium
- Page entièrement sombre (fond noir #0a0a0a)
- Dégradés bleus sur boutons
- Animations fluides au survol

### ✅ Responsive 100%
- Aucun défilement horizontal
- Textes lisibles sur petit écran
- Boutons cliquables (min 44px)

### ✅ 17 Produits
- Boxer coton (id:1)
- Boxer nylon (id:2)
- ... jusqu'à Powerbank (id:17)

### ✅ 4 Catégories
- Style (6 produits)
- Santé (4 produits)
- Skin care (3 produits)
- Tech (4 produits)

### ✅ Livraison Intelligente
- Abidjan : 0 FCFA
- Bassam/Anyama : 1 000 FCFA
- Hors Abidjan : 2 000 FCFA

### ✅ Panier Fonctionnel
- Ajout/suppression produits
- Calcul automatique livraison
- Sauvegarde localStorage

---

## 🐛 Troubleshooting

### Images n'affichent pas
**Solution** : Vérifiez chemins dans `products.js`
- Les URLs Unsplash doivent être valides
- Les images locales (hero) doivent être dans `/assets`

### Filtre catalogue ne fonctionne pas
**Solution** : Vérifiez que `data-filter` sur les chips correspond aux catégories
```html
<button class="chip" data-filter="Style">Style</button>
<!-- doit correspondre à category: "Style" dans products.js -->
```

### Panier vide après refresh
**Solution** : Vérifiez localStorage n'est pas désactivé
```javascript
// Dans console (F12)
localStorage.getItem('legancy_cart')  // doit afficher le JSON
```

### WhatsApp ne se connecte pas
**Solution** : Vérifiez numéro dans `app.js`
- Format : '2250768245917' (sans + et sans espaces)
- Le numéro WhatsApp doit être valide

---

## 📋 Checklist Avant Mise en Ligne

- [ ] Tous fichiers HTML, CSS, JS présents
- [ ] Assets (logo + hero images) téléchargés
- [ ] Numéro WhatsApp correct dans app.js
- [ ] URLs images valides dans products.js
- [ ] Panier fonctionne (add/remove)
- [ ] Responsive OK sur mobile
- [ ] Liens internes fonctionnent
- [ ] Hero slider auto-play fonctionne
- [ ] Filtres catalogue changent contenu
- [ ] Page détail produit affiche tous les infos

---

## 🎉 Bravo!

Votre site **Legancy Boutique** est **100% prêt** pour la mise en ligne!

### Prochaines Étapes Optionnelles
1. **Ajouter plus de produits** : Modifiez `products.js`
2. **Changer les couleurs** : Modifiez `:root` dans `style.css`
3. **Ajouter analytics** : Intégrez Google Analytics
4. **Mettre en ligne** : Déployez sur GitHub Pages, Netlify ou votre serveur

---

**Support** 📞

Pour toute question, consultez :
- `README.md` - Guide complet
- `ARCHITECTURE.md` - Architecture système
- Commentaires dans les fichiers JS

---

**Legancy Boutique © 2025** - Tous droits réservés.

Crafted with passion 💎
