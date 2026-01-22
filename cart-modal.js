// ===== LEGANCY BOUTIQUE - CART MODAL =====
// Système de panier premium avec modal et animations fluides

class CartModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    const tr = (key, fallback) => (typeof window.t === 'function') ? window.t(key) : (fallback || key);
    const title = tr('cart.title', 'Votre Panier');
    const empty = tr('cart.empty', 'Votre panier est vide');
    const subtotalLabel = tr('cart.subtotal', 'Sous-total');
    const shippingLabel = tr('cart.shipping', 'Livraison');
    const totalLabel = tr('cart.total', 'Total');
    const checkoutLabel = tr('cart.checkout', 'Valider ma Commande');

    // Créer la structure du modal panier
    const cartModalHTML = `
      <div id="cartModal" class="cart-modal">
        <div class="cart-modal-overlay"></div>
        <div class="cart-modal-content">
          <div class="cart-modal-header">
            <h2 data-i18n="cart.title">${title}</h2>
            <button class="cart-modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="cart-modal-body">
            <div id="cartItemsContainer" class="cart-items-container">
              <!-- Les articles du panier s'affichent ici -->
            </div>
            <div id="cartEmpty" class="cart-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p data-i18n="cart.empty">${empty}</p>
            </div>
          </div>

          <div class="cart-modal-footer">
            <div class="cart-summary">
              <div class="summary-row">
                <span data-i18n="cart.subtotal">${subtotalLabel}</span>
                <span id="cartSubtotal">0 XOF</span>
              </div>
              <div class="summary-row">
                <span data-i18n="cart.shipping">${shippingLabel}</span>
                <span id="cartShipping">0 XOF</span>
              </div>
              <div class="summary-row total">
                <span data-i18n="cart.total">${totalLabel}</span>
                <span id="cartTotal">0 XOF</span>
              </div>
            </div>
            <button id="checkoutBtn" class="checkout-btn primary-btn" type="button">
              <span data-i18n="cart.checkout">${checkoutLabel}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Ajouter le HTML au body
    if (!document.getElementById('cartModal')) {
      document.body.insertAdjacentHTML('beforeend', cartModalHTML);
    }

    this.modal = document.getElementById('cartModal');
    this.setupEventListeners();
    this.updateCartDisplay();
    window.applyTranslations?.();
  }

  setupEventListeners() {
    const closeBtn = this.modal.querySelector('.cart-modal-close');
    const overlay = this.modal.querySelector('.cart-modal-overlay');
    const checkoutBtn = this.modal.querySelector('#checkoutBtn');

    closeBtn.addEventListener('click', () => this.close());
    overlay.addEventListener('click', () => this.close());

    checkoutBtn.addEventListener('click', () => {
      this.close();
      if (window.cart && window.cart.items.length > 0) {
        setTimeout(() => {
          window.checkoutModal?.open();
        }, 300);
      }
    });

    // Mettre à jour l'affichage quand le panier change
    window.addEventListener('cartUpdated', () => this.updateCartDisplay());
  }

  open() {
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.updateCartDisplay();
  }

  close() {
    this.modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  updateCartDisplay() {
    if (!window.cart) return;

    const container = this.modal.querySelector('#cartItemsContainer');
    const empty = this.modal.querySelector('#cartEmpty');
    
    if (window.cart.items.length === 0) {
      container.innerHTML = '';
      empty.style.display = 'flex';
      this.modal.querySelector('.checkout-btn').disabled = true;
      this.modal.querySelector('.checkout-btn').style.opacity = '0.5';
      this.modal.querySelector('.checkout-btn').style.cursor = 'not-allowed';
    } else {
      empty.style.display = 'none';
      this.modal.querySelector('.checkout-btn').disabled = false;
      this.modal.querySelector('.checkout-btn').style.opacity = '1';
      this.modal.querySelector('.checkout-btn').style.cursor = 'pointer';
      
      container.innerHTML = window.cart.items.map(item => `
        <div class="cart-item" data-item-key="${item.key}" data-product-id="${item.id}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p class="cart-item-price">${window.formatPrice(item.price)}</p>
            <p class="cart-item-variant">${item.variantType === 'boxer' ? 'Taille' : (item.variantType === 'shoes' ? 'Pointure' : 'Option')} : ${item.variantLabel || 'Non précisé'}</p>
          </div>
          <div class="cart-item-quantity">
            <button class="qty-btn minus" type="button">−</button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1">
            <button class="qty-btn plus" type="button">+</button>
          </div>
          <div class="cart-item-total">
            ${window.formatPrice(item.price * item.quantity)}
          </div>
          <button class="cart-item-remove" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `).join('');

      // Ajouter les event listeners pour les quantités et suppression
      container.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const itemEl = e.target.closest('.cart-item');
          const productKey = itemEl.dataset.itemKey;
          const qtyInput = itemEl.querySelector('.qty-input');
          let newQty = parseInt(qtyInput.value);
          
          if (e.target.classList.contains('minus')) {
            newQty = Math.max(1, newQty - 1);
          } else {
            newQty = newQty + 1;
          }
          
          qtyInput.value = newQty;
          window.cart.updateQuantity(productKey, newQty);
        });
      });

      container.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
          const itemEl = e.target.closest('.cart-item');
          const productKey = itemEl.dataset.itemKey;
          let newQty = Math.max(1, parseInt(e.target.value) || 1);
          e.target.value = newQty;
          window.cart.updateQuantity(productKey, newQty);
        });
      });

      container.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const itemEl = e.target.closest('.cart-item');
          const productKey = itemEl.dataset.itemKey;
          window.cart.removeItem(productKey);
          itemEl.style.animation = 'slideOutRight 0.3s ease-out forwards';
          setTimeout(() => this.updateCartDisplay(), 300);
        });
      });
    }

    // Mettre à jour les totaux
    this.updateTotals();
  }

  updateTotals() {
    if (!window.cart) return;

    const subtotal = window.cart.getSubtotal();
    const shipping = 0; // Frais affichés à 0 FCFA dans le panier
    const total = subtotal;

    this.modal.querySelector('#cartSubtotal').textContent = window.formatPrice(subtotal);
    this.modal.querySelector('#cartShipping').textContent = window.formatPrice(shipping);
    this.modal.querySelector('#cartTotal').textContent = window.formatPrice(total);
  }
}

// Initialiser le modal panier
window.cartModal = new CartModal();

// Exposer la méthode open globalement
window.openCartModal = () => {
  window.cartModal?.open();
};
