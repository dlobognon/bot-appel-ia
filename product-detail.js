// ===== PRODUCT DETAIL PAGE =====
// Gère l'affichage et l'interaction de la page produit détaillée

const trDetail = (key, fallback) => (typeof window.t === 'function') ? window.t(key) : (fallback || key);

class ProductDetail {
  constructor() {
    this.product = null;
    this.currentImageIndex = 0;
    this.quantity = 1;
    this.variantType = null;
    this.selectedVariant = null;
    this.init();
  }

  init() {
    this.loadProduct();
    if (this.product) {
      this.render();
      this.attachListeners();
    }
  }

  loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    this.product = window.getProductById(id);
    
    if (!this.product) {
      document.getElementById('productDetailContainer').innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <h2 data-i18n="product.not_found_title">${trDetail('product.not_found_title', 'Produit non trouvé')}</h2>
          <p style="color: rgba(255,255,255,0.7); margin: 20px 0;" data-i18n="product.not_found_desc">${trDetail('product.not_found_desc', "Nous n'avons pas trouvé le produit que vous cherchez.")}</p>
          <a href="catalogue.html" class="primary-btn" data-i18n="product.return_catalogue">${trDetail('product.return_catalogue', 'Retour au catalogue')}</a>
        </div>
      `;
    }
  }

  render() {
    const container = document.getElementById('productDetailContainer');
    const priceStr = window.formatPrice(this.product.price);
    const oldPriceStr = this.product.oldPrice ? window.formatPrice(this.product.oldPrice) : '';
    const badge = this.product.promoLabel ? `<div class="promo-badge-wrapper" style="display: inline-flex; width: auto; flex: 0 0 auto; align-self: flex-start;"><div style="display: inline-flex; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; white-space: nowrap; border: 1px solid rgba(255,255,255,0.15); letter-spacing: 0.03em; width: auto; max-width: max-content; flex: 0 0 auto;">${this.product.promoLabel}</div></div>` : '';
    const reviewsTitle = trDetail('reviews.title', 'Avis Clients');
    const reviewsFormTitle = trDetail('reviews.form_title', 'Laisser un avis');
    const reviewNameLabel = trDetail('reviews.name_label', 'Votre nom *');
    const reviewNamePlaceholder = trDetail('reviews.name_placeholder', 'Entrez votre nom');
    const reviewRatingLabel = trDetail('reviews.rating_label', 'Votre note *');
    const reviewTextLabel = trDetail('reviews.text_label', 'Votre avis *');
    const reviewTextPlaceholder = trDetail('reviews.text_placeholder', 'Partagez votre expérience avec ce produit...');
    const reviewSubmit = trDetail('reviews.submit', 'Publier mon avis');
    const reviewsListTitle = trDetail('reviews.list_title', 'Tous les avis');
    const ratingErrorText = trDetail('reviews.rating_error', 'Veuillez sélectionner une note');
    const featuresTitle = trDetail('product.features', 'Caractéristiques');
    const addToCartLabel = trDetail('product.add_to_cart', 'Ajouter au Panier');
    const trustPay = trDetail('product.trust.pay', '✓ Paiement à la livraison');
    const trustDelivery = trDetail('product.trust.delivery', "✓ Livraison rapide en Côte d'Ivoire");
    const trustAuthentic = trDetail('product.trust.authentic', '✓ Produit 100% authentique garantie');

    this.variantType = window.getVariantType?.(this.product) || null;
    const variantOptions = this.getVariantOptions(this.variantType);
    const variantHtml = (this.variantType && variantOptions.length) ? `
      <div class="variant-selector">
        <div class="variant-pills" id="variantPills">
          ${variantOptions.map(opt => `<button type="button" class="variant-pill" data-value="${opt}">${opt}</button>`).join('')}
        </div>
        <div class="variant-current" id="variantCurrent">Sélection actuelle : <span>Non précisé</span></div>
      </div>
    ` : '';

    // Section avis clients (dynamique avec formulaire)
    const reviewsHtml = `
      <div class="product-reviews-section">
        <div class="reviews-header">
          <h3 data-i18n="reviews.title">${reviewsTitle}</h3>
          <div id="reviewSummary"></div>
        </div>

        <!-- Formulaire d'ajout d'avis -->
        <div class="review-form-container">
          <h4 data-i18n="reviews.form_title">${reviewsFormTitle}</h4>
          <form id="reviewForm" class="review-form">
            <div class="form-group">
              <label for="reviewName" data-i18n="reviews.name_label">${reviewNameLabel}</label>
              <input type="text" id="reviewName" class="form-input" placeholder="${reviewNamePlaceholder}" data-i18n="reviews.name_placeholder" required>
            </div>

            <div class="form-group">
              <label data-i18n="reviews.rating_label">${reviewRatingLabel}</label>
              <div id="starRating" class="star-rating-input"></div>
              <span id="ratingError" class="error-message" style="display: none;" data-i18n="reviews.rating_error">${ratingErrorText}</span>
            </div>

            <div class="form-group">
              <label for="reviewText" data-i18n="reviews.text_label">${reviewTextLabel}</label>
              <textarea id="reviewText" class="form-input" rows="4" placeholder="${reviewTextPlaceholder}" data-i18n="reviews.text_placeholder" required></textarea>
            </div>

            <button type="submit" class="primary-btn" data-i18n="reviews.submit">${reviewSubmit}</button>
          </form>
        </div>

        <!-- Liste des avis existants -->
        <div class="reviews-list-container">
          <h4 data-i18n="reviews.list_title">${reviewsListTitle}</h4>
          <div id="reviewsList"></div>
        </div>
      </div>
    `;

    const benefitsHtml = this.product.benefits && this.product.benefits.length > 0 ? `
      <div class="product-benefits">
        <h3 data-i18n="product.features">${featuresTitle}</h3>
        <ul class="benefits-list">
          ${this.product.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="product-layout">
        <!-- COLONNE GAUCHE : Galerie + Sélecteur de tailles -->
        <div class="product-gallery-section">
          <div class="product-gallery">
            <div class="product-main-image">
              <img id="mainImage" src="${this.product.images[0]}" alt="${this.product.name}">
            </div>
            <div class="product-thumbnails">
              ${this.product.images.slice(0, 6).map((img, i) => `
                <div class="product-thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}">
                  <img src="${img}" alt="Thumbnail ${i + 1}">
                </div>
              `).join('')}
            </div>
          </div>
          ${variantHtml}
        </div>

        <!-- COLONNE DROITE : Info achat (prix, quantité, bouton) -->
        <div class="product-purchase-section">
          ${badge}
          <h1 class="product-detail-name">${this.product.name}</h1>
          
          <div class="product-detail-price">
            <span class="product-detail-current-price">${priceStr}</span>
            ${oldPriceStr ? `<span class="product-detail-old-price">${oldPriceStr}</span>` : ''}
          </div>

          <div class="product-actions-large">
            <div class="product-qty">
              <button class="qty-btn" id="qtyMinus" type="button">−</button>
              <input type="number" class="qty-input" id="qtyInput" value="1" min="1" readonly>
              <button class="qty-btn" id="qtyPlus" type="button">+</button>
            </div>
            <button class="add-to-cart-btn-large" id="addToCartBtn" type="button" data-i18n="product.add_to_cart">${addToCartLabel}</button>
          </div>

          <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
            <span data-i18n="product.trust.pay">${trustPay}</span><br>
            <span data-i18n="product.trust.delivery">${trustDelivery}</span><br>
            <span data-i18n="product.trust.authentic">${trustAuthentic}</span>
          </p>
        </div>
      </div>

      <!-- DESCRIPTION & AVANTAGES (pleine largeur) -->
      <div class="product-details-info">
        <p class="product-description">${this.product.description}</p>
        ${benefitsHtml}
      </div>

      ${reviewsHtml}
    `;

    window.applyTranslations?.();
  }

  attachListeners() {
    // Thumbnail clicks
    document.querySelectorAll('.product-thumbnail').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.selectImage(index);
      });
    });

    // Quantity buttons
    const qtyInput = document.getElementById('qtyInput');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');

    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        this.quantity = Math.max(1, this.quantity - 1);
        if (qtyInput) qtyInput.value = this.quantity;
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        this.quantity++;
        if (qtyInput) qtyInput.value = this.quantity;
      });
    }

    if (qtyInput) {
      qtyInput.addEventListener('change', () => {
        this.quantity = Math.max(1, parseInt(qtyInput.value) || 1);
        qtyInput.value = this.quantity;
      });
    }

    // Add to cart
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const variantValue = this.selectedVariant || null;
        window.cart.addItem(this.product, this.quantity, this.variantType, variantValue);
        const originalText = addBtn.textContent;
        addBtn.textContent = '✓ Ajouté au panier!';
        addBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
          addBtn.textContent = originalText;
          addBtn.style.background = '';
        }, 2000);
      });
    }

    this.attachVariantListeners();

    // Initialiser le système d'avis
    this.initReviewSystem();
  }

  initReviewSystem() {
    if (!window.reviewManager) {
      console.error('ReviewManager non trouvé. Assurez-vous que reviews.js est chargé.');
      return;
    }

    const productId = this.product.id;

    // Afficher le résumé des avis
    window.reviewManager.renderReviewSummary(productId, 'reviewSummary');

    // Afficher la liste des avis existants
    window.reviewManager.renderReviews(productId, 'reviewsList');

    // Initialiser les étoiles cliquables
    window.reviewManager.renderClickableStars('starRating');

    // Gérer la soumission du formulaire
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleReviewSubmit();
      });
    }
  }

  handleReviewSubmit() {
    const name = document.getElementById('reviewName').value;
    const text = document.getElementById('reviewText').value;
    const ratingContainer = document.getElementById('starRating');
    const rating = parseInt(ratingContainer.dataset.rating || 0);
    const ratingError = document.getElementById('ratingError');

    // Validation de la note
    if (rating === 0) {
      ratingError.style.display = 'block';
      return;
    } else {
      ratingError.style.display = 'none';
    }

    // Ajouter l'avis
    const result = window.reviewManager.addReview(this.product.id, {
      name,
      text,
      rating
    });

    if (result.success) {
      // Réinitialiser le formulaire
      document.getElementById('reviewForm').reset();
      ratingContainer.dataset.rating = 0;
      window.reviewManager.updateStarSelection(ratingContainer, 0);

      // Rafraîchir l'affichage
      window.reviewManager.renderReviewSummary(this.product.id, 'reviewSummary');
      window.reviewManager.renderReviews(this.product.id, 'reviewsList');

      // Message de succès
      this.showSuccessMessage(trDetail('reviews.success', 'Merci pour votre avis ! Il a été publié avec succès.'));
    } else {
      alert(result.message);
    }
  }

  showSuccessMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'review-success-message';
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(msgDiv);

    setTimeout(() => {
      msgDiv.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
  }

  selectImage(index) {
    this.currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
      mainImage.src = this.product.images[index];
    }
    
    document.querySelectorAll('.product-thumbnail').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  getVariantOptions(type) {
    if (type === 'boxer') return ['L', 'XL', '2XL', '3XL', '4XL'];
    if (type === 'shoes') return ['36', '37', '38', '39', '40', '41', '42'];
    return [];
  }

  attachVariantListeners() {
    if (!this.variantType) return;
    const pills = Array.from(document.querySelectorAll('#variantPills .variant-pill'));
    const currentDisplay = document.querySelector('#variantCurrent span');

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const value = pill.dataset.value;
        if (pill.classList.contains('is-selected')) {
          pill.classList.remove('is-selected');
          this.selectedVariant = null;
          if (currentDisplay) currentDisplay.textContent = 'Non précisé';
        } else {
          pills.forEach(p => p.classList.remove('is-selected'));
          pill.classList.add('is-selected');
          this.selectedVariant = value;
          if (currentDisplay) currentDisplay.textContent = value;
        }
      });
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productDetailContainer')) {
    new ProductDetail();
  }
});
