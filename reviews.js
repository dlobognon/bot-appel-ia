// ===== SYSTÈME DE GESTION DES AVIS CLIENTS =====
// Stockage localStorage avec possibilité de migration vers Google Sheets

class ReviewManager {
  constructor() {
    this.storageKey = 'legancy_reviews';
    this.reviews = this.loadReviews();
  }

  // Charger tous les avis depuis localStorage
  loadReviews() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Erreur lors du chargement des avis:', e);
      return {};
    }
  }

  // Sauvegarder tous les avis dans localStorage
  saveReviews() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.reviews));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde des avis:', e);
    }
  }

  // Ajouter un nouvel avis pour un produit
  addReview(productId, reviewData) {
    // Validation
    if (!reviewData.name || !reviewData.text || !reviewData.rating) {
      return { success: false, message: 'Tous les champs sont requis' };
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return { success: false, message: 'La note doit être entre 1 et 5' };
    }

    // Créer l'avis
    const review = {
      id: Date.now(),
      name: reviewData.name.trim(),
      text: reviewData.text.trim(),
      rating: parseInt(reviewData.rating),
      date: new Date().toISOString(),
      productId: parseInt(productId)
    };

    // Initialiser le tableau d'avis pour ce produit si nécessaire
    if (!this.reviews[productId]) {
      this.reviews[productId] = [];
    }

    // Ajouter l'avis
    this.reviews[productId].push(review);
    this.saveReviews();

    return { success: true, review };
  }

  // Récupérer tous les avis d'un produit
  getReviewsByProduct(productId) {
    return this.reviews[productId] || [];
  }

  // Calculer la note moyenne d'un produit
  getAverageRating(productId) {
    const productReviews = this.reviews[productId] || [];
    if (productReviews.length === 0) return 0;

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  }

  // Compter le nombre d'avis d'un produit
  getReviewCount(productId) {
    return (this.reviews[productId] || []).length;
  }

  // Supprimer un avis (pour modération future)
  deleteReview(productId, reviewId) {
    if (!this.reviews[productId]) return false;

    this.reviews[productId] = this.reviews[productId].filter(r => r.id !== reviewId);
    this.saveReviews();
    return true;
  }

  // Formater la date d'un avis
  formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }

  // Générer le HTML des étoiles (affichage uniquement)
  renderStars(rating) {
    let html = '<div class="review-stars">';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        html += '<span class="star filled">★</span>';
      } else {
        html += '<span class="star empty">☆</span>';
      }
    }
    html += '</div>';
    return html;
  }

  // Générer le HTML des étoiles cliquables (pour le formulaire)
  renderClickableStars(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star-input empty';
      star.textContent = '☆';
      star.dataset.value = i;
      container.appendChild(star);
    }

    // Gestion des clics
    let selectedRating = 0;
    container.querySelectorAll('.star-input').forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        this.updateStarSelection(container, selectedRating);
      });

      star.addEventListener('mouseenter', () => {
        const hoverValue = parseInt(star.dataset.value);
        this.updateStarSelection(container, hoverValue);
      });
    });

    container.addEventListener('mouseleave', () => {
      this.updateStarSelection(container, selectedRating);
    });

    // Stocker la note sélectionnée
    container.dataset.rating = 0;
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('star-input')) {
        container.dataset.rating = e.target.dataset.value;
      }
    });
  }

  // Mettre à jour la sélection visuelle des étoiles
  updateStarSelection(container, rating) {
    container.querySelectorAll('.star-input').forEach(star => {
      const value = parseInt(star.dataset.value);
      if (value <= rating) {
        star.classList.remove('empty');
        star.classList.add('filled');
        star.textContent = '★';
      } else {
        star.classList.remove('filled');
        star.classList.add('empty');
        star.textContent = '☆';
      }
    });
  }

  // Générer le HTML d'un avis
  renderReviewCard(review) {
    return `
      <div class="review-card">
        <div class="review-header">
          <div class="review-author">
            <div class="review-avatar">${review.name.charAt(0).toUpperCase()}</div>
            <div class="review-info">
              <div class="review-name">${review.name}</div>
              <div class="review-date">${this.formatDate(review.date)}</div>
            </div>
          </div>
          ${this.renderStars(review.rating)}
        </div>
        <div class="review-text">${review.text}</div>
      </div>
    `;
  }

  // Afficher tous les avis d'un produit
  renderReviews(productId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const reviews = this.getReviewsByProduct(productId);
    
    if (reviews.length === 0) {
      container.innerHTML = `
        <div class="no-reviews">
          <p>Aucun avis pour le moment. Soyez le premier à laisser votre avis !</p>
        </div>
      `;
      return;
    }

    // Trier par date (plus récent en premier)
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = reviews.map(review => this.renderReviewCard(review)).join('');
  }

  // Afficher le résumé des avis (note moyenne + nombre)
  renderReviewSummary(productId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const average = this.getAverageRating(productId);
    const count = this.getReviewCount(productId);

    container.innerHTML = `
      <div class="review-summary">
        ${this.renderStars(Math.round(average))}
        <span class="review-summary-text">
          <strong>${average > 0 ? average.toFixed(1) : '0.0'}</strong> / 5
          <span class="review-count">(${count} avis)</span>
        </span>
      </div>
    `;
  }
}

// Créer une instance globale
window.reviewManager = new ReviewManager();

console.log('✓ Système d\'avis clients initialisé');
