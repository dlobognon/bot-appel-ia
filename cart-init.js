// ===== LEGANCY BOUTIQUE - CART INITIALIZATION =====
// Fichier d'initialisation pour assurer le bon fonctionnement du panier et checkout
// Ce fichier se charge APRÈS les modules cart-modal et checkout-modal

document.addEventListener('DOMContentLoaded', () => {
  // Attendre que tous les modules soient chargés
  const waitForModules = setInterval(() => {
    if (window.cart && window.cartModal && window.checkoutModal && window.CONFIG) {
      clearInterval(waitForModules);
      initializeCartSystem();
    }
  }, 100);

  function initializeCartSystem() {
    console.log('✓ Système de panier initialisé avec succès');
    
    // Vérifier que le panier s'ouvre correctement
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn && !cartBtn.hasListenerAttached) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.cartModal) {
          window.cartModal.open();
        }
      });
      cartBtn.hasListenerAttached = true;
    }

    // Ajouter le bouton "commander" depuis le panier
    window.addEventListener('cartModalReady', () => {
      const checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn && !checkoutBtn.hasListenerAttached) {
        checkoutBtn.addEventListener('click', () => {
          if (window.cart.items.length > 0) {
            window.cartModal.close();
            setTimeout(() => {
              window.checkoutModal.open();
            }, 300);
          }
        });
        checkoutBtn.hasListenerAttached = true;
      }
    });

    // Tester la sauvegarde du panier
    if (window.cart.items.length > 0) {
      console.log('📦 Panier restauré:', window.cart.items.length, 'article(s)');
    }

    // Intégration avec le formulaire de checkout
    setupCheckoutIntegration();
  }

  function setupCheckoutIntegration() {
    // S'assurer que les événements "city" mettent à jour le shipping
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      const cityInput = checkoutForm.querySelector('#city');
      if (cityInput) {
        cityInput.addEventListener('change', () => {
          // Mettre à jour le calcul des frais de livraison
          if (window.checkoutModal) {
            window.checkoutModal.updateOrderSummary();
          }
        });
      }
    }
  }
});

// Export des fonctions globales
window.openCart = () => window.cartModal?.open();
window.openCheckout = () => window.checkoutModal?.open();

console.log('✓ cart-init.js chargé');
