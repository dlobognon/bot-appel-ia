@echo off
REM Script de démarrage rapide pour tester Legancy Boutique (Windows)

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🛒 LEGANCY BOUTIQUE - PANIER & CHECKOUT PREMIUM           ║
echo ║     Système e-commerce optimisé pour conversion max        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Vérifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python non trouvé. Installez Python 3.x
    pause
    exit /b 1
)

echo ✓ Python détecté: 
python --version

echo.
echo 📋 FICHIERS VÉRIFIÉS:
if exist index.html echo ✓ index.html
if exist catalogue.html echo ✓ catalogue.html
if exist product.html echo ✓ product.html
if exist conditions.html echo ✓ conditions.html
if exist style.css echo ✓ style.css
if exist cart-modal.js echo ✓ cart-modal.js
if exist checkout-modal.js echo ✓ checkout-modal.js
if exist cart-checkout-styles.css echo ✓ cart-checkout-styles.css

echo.
echo 🎯 DÉMARRAGE DU SERVEUR:
echo.
echo Lancement du serveur HTTP sur http://localhost:8000
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

python -m http.server 8000

pause
