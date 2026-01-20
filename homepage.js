// ===== HOMEPAGE =====
// Affiche les best sellers sur la page d'accueil

class HomePage {
  constructor() {
    this.init();
  }

  init() {
    this.renderBestSellers();
    window.addEventListener('languageChanged', () => this.renderBestSellers());
  }

  renderBestSellers() {
    const grid = document.getElementById('bestSellersGrid');
    if (!grid) return;

    // Sélectionner les 6 premiers produits comme best sellers
    const bestSellers = window.PRODUCTS.slice(0, 6);

    grid.innerHTML = bestSellers
      .map(product => window.renderProductCard(product))
      .join('');
    // Les boutons "Ajouter" s'appuient sur le gestionnaire centralisé app.js
    // Aucun listener local pour éviter les doubles ajouts.
  }
  
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bestSellersGrid')) {
    new HomePage();
  }
});
