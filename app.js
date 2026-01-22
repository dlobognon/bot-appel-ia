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

  buildKey(id, variantType, variantValue) {
    const type = variantType || '';
    const value = variantValue || '';
    return `${id}::${type}::${value}`;
  }

  loadCart() {
    const saved = localStorage.getItem('legancy_cart');
    const parsed = saved ? JSON.parse(saved) : [];

    // Garantir la présence des clés/labels pour compatibilité ascendante
    return parsed.map(it => {
      const variantType = it.variantType || null;
      const variantValue = it.variantValue || null;
      const variantLabel = variantValue || 'Non précisé';
      return {
        ...it,
        variantType,
        variantValue,
        variantLabel,
        key: it.key || this.buildKey(it.id, variantType, variantValue)
      };
    });
  }

  saveCart() {
    localStorage.setItem('legancy_cart', JSON.stringify(this.items));
  }

  addItem(product, quantity = 1, variantType = null, variantValue = null) {
    const key = this.buildKey(product.id, variantType, variantValue || null);
    const existing = this.items.find(item => item.key === key);
    const variantLabel = variantValue || 'Non précisé';

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        key,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
        category: product.category,
        variantType,
        variantValue,
        variantLabel
      });
    }

    this.saveCart();
    this.updateUI();
  }

  removeItem(keyOrId) {
    this.items = this.items.filter(item => item.key !== keyOrId && item.id !== keyOrId);
    this.saveCart();
    this.updateUI();
  }

  updateQuantity(keyOrId, quantity) {
    const item = this.items.find(item => item.key === keyOrId || item.id === keyOrId);
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
    const countMobileEl = document.getElementById('cart-count-mobile');
    if (countEl) countEl.textContent = count;
    if (countMobileEl) countMobileEl.textContent = count;
    
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
  const variantType = getVariantType(product);
  
  // Générer les options de variante si applicable
  let variantOptions = [];
  if (variantType === 'boxer') variantOptions = ['L', 'XL', '2XL', '3XL', '4XL'];
  else if (variantType === 'shoes') variantOptions = ['36', '37', '38', '39', '40', '41', '42'];
  
  // HTML du quick picker (caché par défaut)
  const pickerHtml = variantOptions.length > 0 ? `
    <div class="quick-picker" data-product-id="${product.id}" data-variant-type="${variantType}">
      <div class="quick-picker-content">
        <div class="quick-picker-options">
          ${variantOptions.map(opt => `<button class="variant-pill-card" type="button" data-value="${opt}" data-product-id="${product.id}">${opt}</button>`).join('')}
        </div>
      </div>
    </div>
  ` : '';
  
  return `
    <div class="product-card" data-product-id="${product.id}" data-variant-type="${variantType || 'none'}">
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
          <button class="add-to-cart-btn quick-add-btn" data-product-id="${product.id}" type="button">${addLabel}</button>
          <a href="product.html?id=${product.id}" class="product-view-link" style="flex: 0.8;">${viewLabel}</a>
        </div>
        ${pickerHtml}
      </div>
    </div>
  `;
}

function getVariantType(product) {
  const cat = (product.category || '').toLowerCase();
  const sub = (product.subcategory || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (cat.includes('boxer') || sub.includes('boxeur') || sub.includes('boxer') || name.includes('boxer')) {
    return 'boxer';
  }
  if (cat.includes('chaussure') || cat.includes('sandale') || sub.includes('chaussure') || sub.includes('sandale') || name.includes('sandale') || name.includes('chaussure')) {
    return 'shoes';
  }
  return null;
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
  // Update WhatsApp links
  const whatsappNumber = CONFIG.WHATSAPP_NUMBER;
  const waHeader = document.getElementById('wa-header');
  const waContact = document.getElementById('wa-contact');
  const footerWa = document.getElementById('footer-wa');
  const waHeaderMobile = document.getElementById('wa-header-mobile');
  if (waHeader) waHeader.href = `https://wa.me/${whatsappNumber}`;
  if (waContact) waContact.href = `https://wa.me/${whatsappNumber}`;
  if (footerWa) footerWa.href = `https://wa.me/${whatsappNumber}`;
  if (waHeaderMobile) waHeaderMobile.href = `https://wa.me/${whatsappNumber}`;

  // Mobile navigation (bottom sheet) - mobile only
  const mobileBottomSheet = document.getElementById('mobileBottomSheet');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileSheetClose = document.getElementById('mobileSheetClose');
  const siteAccordionBtn = document.getElementById('siteAccordionBtn');
  const siteAccordionPanel = document.getElementById('siteAccordionPanel');
  const langAccordionBtn = document.getElementById('langAccordionBtn');
  const langAccordionPanel = document.getElementById('langAccordionPanel');
  const mobileMq = window.matchMedia('(max-width: 768px)');
  let isMobile = mobileMq.matches;

  // Force closed state on initialization
  if (mobileBottomSheet) {
    mobileBottomSheet.classList.remove('open');
    mobileBottomSheet.setAttribute('aria-hidden', 'true');
  }
  if (mobileMenuOverlay) {
    mobileMenuOverlay.classList.remove('open');
  }
  if (mobileMenuToggle) {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }
  document.body.classList.remove('menu-open');

  const setAccordion = (btn, panel, open) => {
    if (!btn || !panel) return;
    if (open) {
      btn.classList.add('open');
      panel.classList.add('open');
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    } else {
      btn.classList.remove('open');
      panel.classList.remove('open');
      panel.style.maxHeight = '0px';
    }
  };

  const toggleAccordion = (btn, panel) => {
    if (!btn || !panel || !isMobile) return;
    const willOpen = !panel.classList.contains('open');
    setAccordion(btn, panel, willOpen);
  };

  const openMobileMenu = () => {
    if (!mobileBottomSheet || !isMobile) return;
    mobileBottomSheet.classList.add('open');
    mobileBottomSheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('open');
  };

  const closeMobileMenu = () => {
    if (!mobileBottomSheet) return;
    mobileBottomSheet.classList.remove('open');
    mobileBottomSheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('open');
    setAccordion(siteAccordionBtn, siteAccordionPanel, false);
    setAccordion(langAccordionBtn, langAccordionPanel, false);
  };

  const handleMedia = (e) => {
    isMobile = e.matches;
    if (isMobile) {
      document.body.classList.add('is-mobile');
    } else {
      document.body.classList.remove('is-mobile');
      closeMobileMenu();
    }
  };

  handleMedia(mobileMq);
  if (typeof mobileMq.addEventListener === 'function') {
    mobileMq.addEventListener('change', handleMedia);
  } else {
    mobileMq.addListener(handleMedia);
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (!isMobile) return;
      const isOpen = mobileBottomSheet && mobileBottomSheet.classList.contains('open');
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });
  }

  if (mobileSheetClose) mobileSheetClose.addEventListener('click', closeMobileMenu);
  if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

  if (siteAccordionBtn && siteAccordionPanel) {
    siteAccordionBtn.addEventListener('click', () => toggleAccordion(siteAccordionBtn, siteAccordionPanel));
  }

  if (langAccordionBtn && langAccordionPanel) {
    langAccordionBtn.addEventListener('click', () => toggleAccordion(langAccordionBtn, langAccordionPanel));
  }

  if (mobileBottomSheet) {
    mobileBottomSheet.querySelectorAll('a.mobileNavItem, button.mobileNavItem, .accordionOption').forEach(el => {
      el.addEventListener('click', () => closeMobileMenu());
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  const markActiveLanguage = () => {
    const currentLang = (typeof window.getLanguage === 'function') ? window.getLanguage() : localStorage.getItem('site_lang') || 'fr';
    document.querySelectorAll('.accordionOption.lang-option').forEach(btn => {
      if (btn.getAttribute('data-lang') === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  markActiveLanguage();
  window.addEventListener('languageChanged', markActiveLanguage);

  // Add to cart button handlers - WITH QUICK PICKER
  document.addEventListener('click', (e) => {
    // Quick Add button avec sélecteur de variante
    if (e.target.classList.contains('quick-add-btn')) {
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      const productCard = e.target.closest('.product-card');
      const quickPicker = productCard.querySelector('.quick-picker');
      
      if (!quickPicker) {
        // Pas de variantes => ajouter directement
        const product = getProductById(productId);
        if (product) {
          window.cart.addItem(product, 1, null, null);
          const btn = e.target;
          const originalText = btn.textContent;
          btn.textContent = '✓ Ajouté';
          btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
          }, 1500);
        }
      } else {
        // Avec variantes
        if (quickPicker.classList.contains('open')) {
          // 2e clic => ajouter avec "Non précisé" et fermer
          const product = getProductById(productId);
          const variantType = productCard.getAttribute('data-variant-type');
          if (product) {
            window.cart.addItem(product, 1, variantType, null);
            const btn = e.target;
            const originalText = btn.textContent;
            btn.textContent = '✓ Ajouté';
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.background = '';
            }, 1500);
          }
          quickPicker.classList.remove('open');
        } else {
          // 1er clic => ouvrir le picker
          quickPicker.classList.add('open');
        }
      }
    }
    
    // Clic sur une variante (pill) => ajouter avec cette variante
    if (e.target.classList.contains('variant-pill-card')) {
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      const variantValue = e.target.getAttribute('data-value');
      const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
      const variantType = productCard.getAttribute('data-variant-type');
      const product = getProductById(productId);
      
      if (product) {
        window.cart.addItem(product, 1, variantType, variantValue);
        // Feedback
        const btn = productCard.querySelector('.quick-add-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Ajouté';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 1500);
        // Fermer le picker
        const quickPicker = productCard.querySelector('.quick-picker');
        if (quickPicker) quickPicker.classList.remove('open');
      }
    }
  });

  // Fermer le quick picker en cliquant en dehors
  document.addEventListener('click', (e) => {
    // Si le clic n'est pas sur une carte, fermer tous les pickers
    if (!e.target.closest('.product-card')) {
      document.querySelectorAll('.quick-picker.open').forEach(picker => {
        picker.classList.remove('open');
      });
    }
  });

  // Cart button - ouvre le modal du panier
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      if (window.cartModal) {
        window.cartModal.open();
      }
      if (typeof closeMobileMenu === 'function') {
        closeMobileMenu();
      }
    });
  }

  const cartBtnMobile = document.getElementById('cart-btn-mobile');
  if (cartBtnMobile) {
    cartBtnMobile.addEventListener('click', () => {
      if (window.cartModal) {
        window.cartModal.open();
      }
      closeMobileMenu();
    });
  }
});

// Export for use in other scripts
window.CartManager = CartManager;
window.CONFIG = CONFIG;
window.formatPrice = formatPrice;
window.getProductById = getProductById;
window.renderProductCard = renderProductCard;
window.getVariantType = getVariantType;
