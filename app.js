// ===== LEGANCY BOUTIQUE - APP.JS =====
// Configuration & Logique Principale

const CONFIG = {
  WHATSAPP_NUMBER: '2250768245917',
  BUSINESS_NAME: 'Legancy Boutique'
};

const tr = (key, fallback) => (typeof window.t === 'function') ? window.t(key) : (fallback || key);

// ===== CALCUL DE LIVRAISON IVOIRIEN =====
// Logique fiable et testable pour les frais de livraison

// Communes d'Abidjan (livraison gratuite par défaut sauf zones spéciales)
const ABIDJAN_COMMUNES = [
  'abobo',
  'adjamé',
  'attécoubé',
  'cocody',
  'koumassi',
  'marcory',
  'plateau',
  'treichville',
  'yopougon'
];

// Zones à 1000 FCFA (PRIORITÉ sur gratuité Abidjan)
const SPECIAL_ZONES_1000 = [
  'grand-bassam',
  'grand bassam',
  'port-bouët',
  'port bouet',
  'yopougon zone industrielle',
  'anyama',
  'abobo',
  'bingerville'
];

/**
 * Calcule les frais de livraison selon la ville/lieu
 * @param {string} city - Le lieu ou la ville de livraison
 * @returns {number} Les frais de livraison en FCFA
 * 
 * Règles:
 * 1. Si zone à 1000 FCFA → 1000 FCFA (PRIORITÉ)
 * 2. Si commune d'Abidjan (et pas zone 1000) → 0 FCFA (GRATUIT)
 * 3. Sinon → 2000 FCFA (Hors Abidjan)
 */
function calculateShipping(city) {
  // Normaliser: minuscules, espaces, accents
  if (!city || typeof city !== 'string' || city.trim() === '') {
    return 0; // Aucun calcul tant que le lieu n'est pas renseigné
  }
  
  const normalizedCity = city.toLowerCase().trim();
  
  // RÈGLE 1: Vérifier zones à 1000 FCFA (PRIORITÉ absolue)
  for (let zone of SPECIAL_ZONES_1000) {
    if (normalizedCity.includes(zone)) {
      return 1000; // Zone 1000 FCFA
    }
  }
  
  // RÈGLE 2: Vérifier communes d'Abidjan (Gratuit)
  for (let commune of ABIDJAN_COMMUNES) {
    if (normalizedCity.includes(commune)) {
      return 0; // Abidjan gratuit (et pas en zone 1000)
    }
  }
  
  // RÈGLE 3: Hors Abidjan et pas en zone 1000
  return 2000;
}

/**
 * Fonction helper pour tester la logique de livraison
 * À utiliser en console: testShipping()
 */
function testShipping() {
  const testCases = [
    { city: 'Plateau', expected: 0 },
    { city: 'Cocody', expected: 0 },
    { city: 'Yopougon', expected: 0 },
    { city: 'Grand-Bassam', expected: 1000 },
    { city: 'Port-Bouët', expected: 1000 },
    { city: 'Yopougon Zone Industrielle', expected: 1000 },
    { city: 'Anyama', expected: 1000 },
    { city: 'Abobo', expected: 1000 },
    { city: 'Bingerville', expected: 1000 },
    { city: 'Yamoussoukro', expected: 2000 },
    { city: 'Bouaké', expected: 2000 },
    { city: '', expected: 0 }
  ];
  
  console.log('🧪 TEST CALCUL LIVRAISON:');
  let passed = 0, failed = 0;
  
  testCases.forEach(test => {
    const result = calculateShipping(test.city);
    const status = result === test.expected ? '✓' : '✗';
    console.log(`${status} "${test.city}" → ${result} FCFA (attendu: ${test.expected})`);
    if (result === test.expected) passed++;
    else failed++;
  });
  
  console.log(`\n📊 Résultats: ${passed} réussis, ${failed} échoués`);
}

// ===== CART MANAGEMENT =====
class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.updateUI();
  }

  loadCart() {
    const saved = localStorage.getItem('legancy_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('legancy_cart', JSON.stringify(this.items));
  }

  addItem(product, quantity = 1) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        category: product.category
      });
    }
    this.saveCart();
    this.updateUI();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.updateUI();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
      this.updateUI();
    }
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotal() {
    // Note: La livraison est calculée dynamiquement au moment du checkout
    // Voir calculateShipping() dans ce fichier
    return this.getSubtotal();
  }

  getShipping() {
    // Fonction dépréciée - utiliser calculateShipping() à la place
    // Le panier affiche toujours 0 FCFA avant la validation
    return 0;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  updateUI() {
    const count = this.items.reduce((total, item) => total + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = count;
    
    // Émettre un événement pour notifier les autres modules
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: this.items, count } }));
  }

  clear() {
    this.items = [];
    this.saveCart();
    this.updateUI();
  }
}

// ===== GLOBAL CART =====
window.cart = new CartManager();

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function getProductById(id) {
  return window.PRODUCTS.find(p => p.id === parseInt(id));
}

function renderProductCard(product) {
  const priceStr = formatPrice(product.price);
  const oldPriceStr = product.oldPrice ? formatPrice(product.oldPrice) : '';
  const badge = product.promoLabel ? `<div class="product-badge">${product.promoLabel}</div>` : '';
  const addLabel = tr('buttons.add', 'Ajouter');
  const viewLabel = tr('buttons.view', 'Voir');
  
  return `
    <div class="product-card">
      <div class="product-image-wrapper">
        ${badge}
        <img src="${product.images[0]}" alt="${product.name}" class="product-image">
      </div>
      <div class="product-info">
        <div class="product-category">${product.subcategory || product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="price-current">${priceStr}</span>
          ${oldPriceStr ? `<span class="price-old">${oldPriceStr}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="add-to-cart-btn" data-product-id="${product.id}" type="button">${addLabel}</button>
          <a href="product.html?id=${product.id}" class="product-view-link" style="flex: 0.8;">${viewLabel}</a>
        </div>
      </div>
    </div>
  `;
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
  // Update WhatsApp links
  const whatsappNumber = CONFIG.WHATSAPP_NUMBER;
  const waHeader = document.getElementById('wa-header');
  const waContact = document.getElementById('wa-contact');
  const footerWa = document.getElementById('footer-wa');
  
  if (waHeader) waHeader.href = `https://wa.me/${whatsappNumber}`;
  if (waContact) waContact.href = `https://wa.me/${whatsappNumber}`;
  if (footerWa) footerWa.href = `https://wa.me/${whatsappNumber}`;

  // Add to cart button handlers
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      const product = getProductById(productId);
      if (product) {
        window.cart.addItem(product, 1);
        // Show feedback
        const btn = e.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Ajouté';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 1500);
      }
    }
  });

  // Cart button - ouvre le modal du panier
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      if (window.cartModal) {
        window.cartModal.open();
      }
    });
  }
});

// Export for use in other scripts
window.CartManager = CartManager;
window.CONFIG = CONFIG;
window.formatPrice = formatPrice;
window.getProductById = getProductById;
window.renderProductCard = renderProductCard;
