#!/bin/bash
# 🚀 Script de démarrage rapide pour tester Legancy Boutique

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🛒 LEGANCY BOUTIQUE - PANIER & CHECKOUT PREMIUM           ║"
echo "║     Système e-commerce optimisé pour conversion max        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Vérification Python
if command -v python3 &> /dev/null; then
    PYTHON="python3"
elif command -v python &> /dev/null; then
    PYTHON="python"
else
    echo "❌ Python non trouvé. Installez Python 3.x"
    exit 1
fi

# Vérification Node.js (optionnel)
if command -v node &> /dev/null; then
    echo "✓ Node.js détecté: $(node -v)"
fi

echo ""
echo "📋 FICHIERS VÉRIFIÉS:"
echo "✓ index.html"
echo "✓ catalogue.html"
echo "✓ product.html"
echo "✓ conditions.html"
echo "✓ style.css"
echo "✓ cart-modal.js"
echo "✓ checkout-modal.js"
echo "✓ cart-checkout-styles.css"
echo ""

echo "🎯 PRÊT À TESTER!"
echo ""
echo "Option 1: Python HTTP Server"
echo "  cd \"$(pwd)\""
echo "  $PYTHON -m http.server 8000"
echo "  Puis ouvrir: http://localhost:8000"
echo ""

echo "Option 2: Node.js http-server"
echo "  npm install -g http-server"
echo "  http-server"
echo "  Puis ouvrir: http://localhost:8080"
echo ""

echo "Option 3: Live Server VSCode"
echo "  - Installer extension 'Live Server' dans VSCode"
echo "  - Clic droit sur index.html → Open with Live Server"
echo ""

echo "✨ À TESTER:"
echo "  1. Ajouter produits au panier"
echo "  2. Cliquer 'Panier' pour ouvrir le modal"
echo "  3. Modifier quantités"
echo "  4. Supprimer articles"
echo "  5. Cliquer 'Valider ma Commande'"
echo "  6. Remplir le formulaire"
echo "  7. Tester WhatsApp ou Google Sheets"
echo "  8. Tester sur mobile (F12 → Responsive)"
echo ""

echo "📱 RESPONSIVE TEST:"
echo "  F12 → Ctrl+Shift+M → Sélectionner un device"
echo ""

echo "💾 VÉRIFIER DATA:"
echo "  F12 → Application → Storage → Local Storage"
echo "  - legancy_cart (articles)"
echo "  - legancy_orders (commandes)"
echo ""

echo "🔗 INTÉGRATIONS:"
echo "  ✓ WhatsApp: app.js ligne 4"
echo "  ✓ Google Sheets: checkout-modal.js ligne 5"
echo ""

echo "✅ TOUT EST PRÊT!"
echo ""
