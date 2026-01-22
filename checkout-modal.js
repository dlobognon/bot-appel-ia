// ===== LEGANCY BOUTIQUE - CHECKOUT MODAL =====
// Formulaire de validation de commande avec WhatsApp et Google Sheets

const trCheckout = (key, fallback) => (typeof window.t === 'function') ? window.t(key) : (fallback || key);

class CheckoutModal {
  constructor() {
    this.modal = null;
    
    // ⚠️ IMPORTANT: Remplacez cette URL par votre URL Google Apps Script
    // Voir le fichier SETUP_GOOGLE_SHEETS.md pour les instructions complètes
    // Après déploiement du script, l'URL ressemblera à:
    // https://script.google.com/macros/s/AKfycby.../exec
    this.googleSheetsURL = 'https://script.google.com/macros/s/AKfycbxfQ-LBKOw11-1-u-GwtKSnu7Vg-uI2uWm3D1gqBWhqOzD1ttCm3O8yNUXDHUelzMb4bA/exec';
    
    this.init();
  }

  init() {
    const tr = trCheckout;
    const title = tr('checkout.title', 'Finaliser Votre Commande');
    const infoTitle = tr('checkout.info', 'Vos Informations');
    const nameLabel = tr('checkout.name', 'Nom (optionnel)');
    const namePlaceholder = tr('checkout.name_placeholder', 'Nom complet');
    const phoneLabel = tr('checkout.phone', 'Numéro de Téléphone *');
    const phonePlaceholder = tr('checkout.phone_placeholder', '+225 07 68 24 59 17');
    const cityLabel = tr('checkout.city', 'Lieu de livraison (optionnel)');
    const cityPlaceholder = tr('checkout.city_placeholder', 'Ex: Plateau, Cocody, Grand-Bassam...');
    const commentLabel = tr('checkout.comment', 'Note / Commentaire (optionnel)');
    const commentPlaceholder = tr('checkout.comment_placeholder', 'Ex: Livrer après 18h, demander à...');
    const summaryTitle = tr('checkout.summary', 'Résumé de Votre Commande');
    const subtotalLabel = tr('checkout.subtotal', 'Sous-total');
    const shippingLabel = tr('checkout.shipping', 'Livraison');
    const totalLabel = tr('checkout.total', 'Total');
    const whatsappLabel = tr('checkout.whatsapp', 'Commander via WhatsApp');
    const sheetsLabel = tr('checkout.submit', 'Envoyer Commande');
    const successTitle = tr('checkout.success_title', 'Commande Envoyée');
    const successText = tr('checkout.success_text', 'Votre commande a été envoyée avec succès. Notre équipe vous contactera bientôt.');

    const checkoutModalHTML = `
      <div id="checkoutModal" class="checkout-modal">
        <div class="checkout-modal-overlay"></div>
        <div class="checkout-modal-content">
          <div class="checkout-modal-header">
            <h2 data-i18n="checkout.title">${title}</h2>
            <button class="checkout-modal-close" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="checkout-modal-body">
            <form id="checkoutForm" class="checkout-form">
              <!-- INFORMATIONS PERSONNELLES -->
              <div class="form-section">
                <h3 class="form-section-title" data-i18n="checkout.info">${infoTitle}</h3>
                
                <div class="form-group">
                  <label for="customerName" data-i18n="checkout.name">${nameLabel}</label>
                  <input type="text" id="customerName" name="customerName" placeholder="${namePlaceholder}" data-i18n="checkout.name_placeholder">
                </div>

                <div class="form-group">
                  <label for="phone" data-i18n="checkout.phone">${phoneLabel} <span class="required-badge" data-i18n="checkout.required">OBLIGATOIRE</span></label>
                  <input type="tel" id="phone" name="phone" required placeholder="${phonePlaceholder}" data-i18n="checkout.phone_placeholder" autofocus>
                  <small class="form-help" data-i18n="checkout.phone_help">Ex: +225 07 68 24 59 17 ou 07 68 24 59 17</small>
                </div>

                <div class="form-group">
                  <label for="city" data-i18n="checkout.city">${cityLabel}</label>
                  <input type="text" id="city" name="city" placeholder="${cityPlaceholder}" data-i18n="checkout.city_placeholder">
                  <small class="form-help" data-i18n="checkout.city_help">Le calcul se fait dès que vous renseignez ce champ</small>
                </div>

                <div class="form-group">
                  <label for="comment" data-i18n="checkout.comment">${commentLabel}</label>
                  <textarea id="comment" name="comment" rows="3" placeholder="${commentPlaceholder}" data-i18n="checkout.comment_placeholder"></textarea>
                </div>
              </div>

              <!-- RÉSUMÉ DE LA COMMANDE -->
              <div class="checkout-summary">
                <h3 class="form-section-title" data-i18n="checkout.summary">${summaryTitle}</h3>
                <div id="orderSummary" class="order-summary-items"></div>
                <div class="summary-totals">
                  <div class="summary-row">
                    <span data-i18n="checkout.subtotal">${subtotalLabel}</span>
                    <span id="checkoutSubtotal">0 XOF</span>
                  </div>
                  <div class="summary-row">
                    <span data-i18n="checkout.shipping">${shippingLabel}</span>
                    <span id="checkoutShipping">0 XOF</span>
                  </div>
                  <div class="summary-row total">
                    <span data-i18n="checkout.total">${totalLabel}</span>
                    <span id="checkoutTotal">0 XOF</span>
                  </div>
                </div>
              </div>

              <!-- BOUTONS D'ACTION -->
              <div class="checkout-actions">
                <button type="submit" class="checkout-whatsapp-btn" id="checkoutWhatsApp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371 0-.57 0-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.945 1.247l-.335-.168-3.476.522.529-3.582-.235-.374a9.86 9.86 0 011.746-4.776 9.84 9.84 0 0111.586 1.475c2.882 2.882 3.577 7.316 1.677 11.078l-.213.365 3.582.53-.531 3.477-.371-.245a9.877 9.877 0 01-5.416 1.694Z"/>
                  </svg>
                  <span data-i18n="checkout.whatsapp">${whatsappLabel}</span>
                </button>
                <button type="button" class="checkout-sheets-btn secondary-btn" id="checkoutSheets">
                  <span data-i18n="checkout.submit">${sheetsLabel}</span>
                </button>
              </div>
            </form>

            <!-- MESSAGE DE CONFIRMATION -->
            <div id="successMessage" class="success-message" style="display: none;">
              <div class="success-icon">✓</div>
              <h3 data-i18n="checkout.success_title">${successTitle}</h3>
              <p id="successText" data-i18n="checkout.success_text">${successText}</p>
              <button type="button" class="primary-btn" onclick="window.checkoutModal.close()" data-i18n="checkout.close">Fermer</button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (!document.getElementById('checkoutModal')) {
      document.body.insertAdjacentHTML('beforeend', checkoutModalHTML);
    }

    this.modal = document.getElementById('checkoutModal');
    this.setupEventListeners();
    window.applyTranslations?.();
  }

  setupEventListeners() {
    const closeBtn = this.modal.querySelector('.checkout-modal-close');
    const overlay = this.modal.querySelector('.checkout-modal-overlay');
    const form = this.modal.querySelector('#checkoutForm');
    const whatsAppBtn = this.modal.querySelector('#checkoutWhatsApp');
    const sheetsBtn = this.modal.querySelector('#checkoutSheets');

    closeBtn.addEventListener('click', () => this.close());
    overlay.addEventListener('click', () => this.close());

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Le formulaire ne soumet pas directement, on utilise les boutons
    });

    whatsAppBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        this.sendViaWhatsApp();
      }
    });

    sheetsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        this.sendViaGoogleSheets();
      }
    });

    // Mettre à jour les frais de livraison quand la ville change
    const cityInput = this.modal.querySelector('#city');
    if (cityInput) {
      cityInput.addEventListener('input', () => this.updateOrderSummary());
    }
  }

  open() {
    if (!window.cart || window.cart.items.length === 0) {
      alert(trCheckout('checkout.empty_cart', 'Votre panier est vide'));
      return;
    }
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.updateOrderSummary();
  }

  close() {
    this.modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  validateForm() {
    const form = this.modal.querySelector('#checkoutForm');
    
    // Vérifier SEULEMENT le numéro de téléphone (champ obligatoire)
    const phone = form.querySelector('#phone').value.trim();

    if (!phone || phone.length < 8) {
      alert(trCheckout('checkout.invalid_phone', '⚠️ Veuillez entrer un numéro de téléphone valide (minimum 8 chiffres)'));
      return false;
    }

    return true;
  }

  getFormData() {
    const form = this.modal.querySelector('#checkoutForm');
    
    return {
      customerName: form.querySelector('#customerName').value.trim() || 'N.A.',
      phone: form.querySelector('#phone').value.trim(),
      city: form.querySelector('#city').value.trim() || 'Non spécifié',
      comment: form.querySelector('#comment').value.trim() || '',
      timestamp: new Date().toLocaleString('fr-CI'),
      items: window.cart.items,
      subtotal: window.cart.getSubtotal(),
      shipping: calculateShipping(form.querySelector('#city').value.trim()),
      total: window.cart.getSubtotal() + calculateShipping(form.querySelector('#city').value.trim())
    };
  }

  updateOrderSummary() {
    if (!window.cart) return;

    const subtotal = window.cart.getSubtotal();
    const cityInput = this.modal.querySelector('#city').value.trim();
    const shipping = calculateShipping(cityInput);
    const total = subtotal + shipping;

    const summaryHTML = window.cart.items.map(item => {
      const label = item.variantType === 'boxer' ? 'Taille' : (item.variantType === 'shoes' ? 'Pointure' : 'Option');
      const value = item.variantLabel || 'Non précisé';
      return `
        <div class="order-summary-item">
          <div>
            <span>${item.name} x${item.quantity}</span><br>
            <small style="color: rgba(255,255,255,0.7);">${label} : ${value}</small>
          </div>
          <span>${window.formatPrice(item.price * item.quantity)}</span>
        </div>
      `;
    }).join('');

    this.modal.querySelector('#orderSummary').innerHTML = summaryHTML;
    this.modal.querySelector('#checkoutSubtotal').textContent = window.formatPrice(subtotal);
    this.modal.querySelector('#checkoutShipping').textContent = window.formatPrice(shipping);
    this.modal.querySelector('#checkoutTotal').textContent = window.formatPrice(total);
  }

  sendViaWhatsApp() {
    const formData = this.getFormData();
    const items = formData.items.map(item => {
      const label = item.variantType === 'boxer' ? 'Taille' : (item.variantType === 'shoes' ? 'Pointure' : 'Option');
      const value = item.variantLabel || 'Non précisé';
      return `${item.name} x${item.quantity} (${label}: ${value}) - ${window.formatPrice(item.price * item.quantity)}`;
    }).join('\n');
    
    const message = `
  *NOUVELLE COMMANDE* 📦

  *Téléphone:* ${formData.phone}
  ${formData.customerName !== 'N.A.' ? `*Nom:* ${formData.customerName}` : ''}
  ${formData.city !== 'Non spécifié' ? `*Lieu:* ${formData.city}` : ''}

  *Articles:*
  ${items}

  *Sous-total:* ${window.formatPrice(formData.subtotal)}
  *Livraison:* ${window.formatPrice(formData.shipping)}
  *TOTAL:* ${window.formatPrice(formData.total)}

  ${formData.comment ? `*Note:* ${formData.comment}` : ''}

  Merci d'utiliser Legancy Boutique! 🎉
    `;

    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappURL = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Sauvegarder la commande localement avant redirection
    this.saveOrderLocally(formData);
    
    // Rediriger vers WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Montrer le message de confirmation
    setTimeout(() => this.showSuccessMessage(trCheckout('checkout.whatsapp_redirect', 'Redirection vers WhatsApp en cours...')), 500);

    // Note: pour notifier automatiquement le client sur son numéro,
    // il faut brancher une API externe (WhatsApp Cloud API ou SMS).
    this.informAutoConfirmation(formData);
  }

  sendViaGoogleSheets() {
    const formData = this.getFormData();
    
    // Préparer les données pour Google Sheets
    const payload = {
      customerName: formData.customerName,
      phone: formData.phone,
      city: formData.city,
      comment: formData.comment,
      items: JSON.stringify(formData.items),
      subtotal: formData.subtotal,
      shipping: formData.shipping,
      total: formData.total,
      timestamp: formData.timestamp,
      status: 'Neutre'
    };

    // Afficher un chargement
    const btn = this.modal.querySelector('#checkoutSheets');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = trCheckout('checkout.sheets_sending', 'Envoi en cours...');

    // Envoyer vers Google Sheets via fetch
    const formDataToSend = new FormData();
    Object.keys(payload).forEach(key => {
      formDataToSend.append(key, payload[key]);
    });

    fetch(this.googleSheetsURL, {
      method: 'POST',
      body: formDataToSend
    }).then(() => {
      // Sauvegarder localement
      this.saveOrderLocally(formData);
      
      // Montrer le message de succès
      this.showSuccessMessage(trCheckout('checkout.sheets_success', 'Votre commande a été enregistrée avec succès! Notre équipe vous contactera bientôt pour confirmer.'));
      this.informAutoConfirmation(formData);
      
      // Réinitialiser le formulaire
      setTimeout(() => {
        this.modal.querySelector('#checkoutForm').reset();
        btn.disabled = false;
        btn.textContent = originalText;
      }, 3000);
    }).catch(error => {
      console.error('Erreur lors de l\'envoi:', error);
      // Même en cas d'erreur, sauvegarder localement
      this.saveOrderLocally(formData);
      this.showSuccessMessage(trCheckout('checkout.sheets_error', 'Votre commande a été enregistrée localement. Notre équipe vous contactera bientôt.'));
      this.informAutoConfirmation(formData);
      btn.disabled = false;
      btn.textContent = originalText;
    });
  }

  informAutoConfirmation(formData) {
    console.info('Confirmation client automatique non activée. Intégrez un service externe (WhatsApp Cloud API ou passerelle SMS) pour notifier le client au ' + formData.phone + ' avec le récapitulatif de commande.');
  }

  saveOrderLocally(formData) {
    const orders = JSON.parse(localStorage.getItem('legancy_orders') || '[]');
    orders.push(formData);
    localStorage.setItem('legancy_orders', JSON.stringify(orders));
    
    // Vider le panier
    window.cart?.clear();
    window.cartModal?.updateCartDisplay();
  }

  showSuccessMessage(message) {
    const form = this.modal.querySelector('#checkoutForm');
    const successMsg = this.modal.querySelector('#successMessage');
    const successText = this.modal.querySelector('#successText');

    form.style.display = 'none';
    successMsg.style.display = 'flex';
    successText.textContent = message || trCheckout('checkout.success_text', 'Votre commande a été envoyée avec succès. Notre équipe vous contactera bientôt.');

    setTimeout(() => {
      this.close();
      form.style.display = 'block';
      successMsg.style.display = 'none';
    }, 4000);
  }
}

// Initialiser le modal de checkout
window.checkoutModal = new CheckoutModal();

// Exposer la méthode open globalement
window.openCheckout = () => {
  window.checkoutModal?.open();
};
