// ===== CATALOGUE PAGE =====
// Gère l'affichage, filtrage et dynamique du catalogue

class CatalogueManager {
  constructor() {
    this.currentFilter = 'Tous';
    this.filteredProducts = window.PRODUCTS;
    this.init();
  }

  init() {
    this.renderProducts();
    this.attachFilterListeners();
    this.applyFilterFromUrl();
    window.addEventListener('languageChanged', () => this.renderProducts());
  }

  applyFilterFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam) {
      const filterBtn = document.querySelector(`[data-filter="${catParam}"]`);
      if (filterBtn) {
        filterBtn.click();
      }
    }
  }

  attachFilterListeners() {
    document.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active state
        document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Filter
        const filter = e.target.getAttribute('data-filter');
        this.setFilter(filter);
      });
    });
  }

  setFilter(category) {
    this.currentFilter = category;
    
    if (category === 'Tous') {
      this.filteredProducts = window.PRODUCTS;
    } else {
      this.filteredProducts = window.PRODUCTS.filter(p => p.category === category);
    }

    this.renderProducts();
  }

  renderProducts() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;

    grid.innerHTML = this.filteredProducts
      .map(product => window.renderProductCard(product))
      .join('');
    // Les boutons "Ajouter" utilisent le gestionnaire centralisé dans app.js
    // Aucun listener local pour éviter les doubles ajouts.
  }
  
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('catalogGrid')) {
    new CatalogueManager();
  }
});
