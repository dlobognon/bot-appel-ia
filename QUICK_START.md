# ⚡ QUICK START - Panier & Checkout

## 🚀 5 Étapes pour Démarrer

### 1️⃣ Configurer le numéro WhatsApp
**Fichier:** `app.js` (Ligne 4)
```javascript
const CONFIG = {
  WHATSAPP_NUMBER: 'REMPLACER_ICI', // ← Votre numéro (ex: 2250768245917)
  BUSINESS_NAME: 'Legancy Boutique'
};
```

### 2️⃣ Configurer Google Sheets (OPTIONNEL)
**Fichier:** `checkout-modal.js` (Ligne 5)
```javascript
this.googleSheetsURL = 'REMPLACER_ICI'; // ← Votre URL Google Apps Script
```

**👉 Guide complet:** Voir `GUIDE_INTEGRATION_COMPLET.md`

### 3️⃣ Lancer le serveur local
**Windows:**
```bash
double-cliquer START.bat
```

**Mac/Linux:**
```bash
python3 -m http.server 8000
```

**Node.js:**
```bash
npx http-server
```

### 4️⃣ Tester le site
1. Ouvrir `http://localhost:8000`
2. Ajouter un produit au panier
3. Cliquer "Panier" → Le modal s'ouvre
4. Cliquer "Valider ma Commande" → Formulaire s'affiche
5. Tester "Commander via WhatsApp" ou "Envoyer Commande"

### 5️⃣ Déployer en production
- GitHub Pages
- Netlify
- Votre serveur personnel

---

## 🎯 Fonctionnalités Clés

### Panier Modal
- ✅ Sidebar qui s'ouvre depuis la droite
- ✅ Ajouter/supprimer/modifier produits
- ✅ Calcul automatique du total
- ✅ Animations fluides
- ✅ 100% responsive

### Checkout Modal
- ✅ Formulaire professionnel
- ✅ 6 champs (4 obligatoires)
- ✅ Deux canaux paiement
- ✅ Message confirmation
- ✅ Sauvegarde locale

### Design
- ✅ Thème sombre futuriste
- ✅ Gradients bleu/violet
- ✅ Glow effects discrets
- ✅ Animations GPU-accelerated
- ✅ Design mobile-first

---

## 📁 Fichiers Principaux

| Fichier | Rôle |
|---------|------|
| `cart-modal.js` | Panier sidebar |
| `checkout-modal.js` | Formulaire validation |
| `cart-checkout-styles.css` | Design modals |
| `cart-init.js` | Initialisation |
| `app.js` | Config et CartManager |

---

## ⚙️ Configuration

### WhatsApp
```javascript
// app.js
WHATSAPP_NUMBER: '2250768245917'  // ← Votre numéro
```

### Frais de Livraison
```javascript
// app.js
SHIPPING_CONFIG: {
  ABIDJAN_FREE: 0,       // Abidjan gratuit
  SPECIAL_ZONES: 1000,   // Zones proches
  OUTSIDE_ABIDJAN: 2000  // Hors Abidjan
}
```

---

## 🧪 Tester Rapidement

### Console Browser (F12)
```javascript
// Ouvrir panier
window.cartModal.open()

// Ouvrir checkout
window.checkoutModal.open()

// Ajouter un produit
window.cart.addItem(window.PRODUCTS[0], 1)

// Voir le panier
console.log(window.cart.items)
```

---

## 📊 Checklist

- [ ] WhatsApp numéro configuré
- [ ] Google Sheets URL configurée (si utilisé)
- [ ] Serveur local lancé
- [ ] Site accessible http://localhost:8000
- [ ] Panier fonctionne
- [ ] Checkout fonctionne
- [ ] Animations fluides
- [ ] Responsive OK sur mobile
- [ ] WhatsApp ouvre correctement
- [ ] Commande sauvegardée localement

---

## 🆘 Problèmes Courants

**Le panier ne s'ouvre pas**
→ F12 → Console → Chercher les erreurs

**Google Sheets ne reçoit rien**
→ Vérifier l'URL du Apps Script
→ Vérifier que c'est "Anyone can access"

**WhatsApp ne s'ouvre pas**
→ Vérifier le numéro (pas de + ni espace)
→ Exemple: `2250768245917`

**Animations saccadées**
→ Désactiver les extensions
→ Vider le cache (Ctrl+Maj+Suppr)

---

## 📚 Documentation Complète

- `PANIER_CHECKOUT_GUIDE.md` - Doc technique complète
- `GUIDE_INTEGRATION_COMPLET.md` - Setup Google Sheets & WhatsApp
- `CHANGELOG_PANIER_CHECKOUT.md` - Changements détaillés

---

## 🎉 Vous êtes prêt!

Votre site Legancy Boutique a maintenant:
- ✅ Panier modal premium
- ✅ Checkout professionnel
- ✅ Double option paiement
- ✅ Design futuriste IA
- ✅ UX fluide et moderne

**Bon commerce! 🚀**
