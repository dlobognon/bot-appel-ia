// ===== HERO SLIDER =====
// Gère l'affichage du slider héroïque sur la page d'accueil

class HeroSlider {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    const heroTrack = document.getElementById('heroTrack');
    if (!heroTrack) return;

    // Images du hero (utilise les images du dossier assets)
    this.images = [
      'assets/hero1.jpg',
      'assets/hero2.jpg',
      'assets/hero3.jpg',
      'assets/hero4.jpg'
    ];

    this.renderSlides();
    this.createDots();
    this.startAutoplay();
    this.attachEventListeners();
  }

  renderSlides() {
    const heroTrack = document.getElementById('heroTrack');
    if (!heroTrack) return;

    heroTrack.innerHTML = this.images.map(img => `
      <div class="hero-slide">
        <img src="${img}" alt="Hero slide">
      </div>
    `).join('');
  }

  createDots() {
    const dotsContainer = document.getElementById('heroDots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = this.images.map((_, i) => `
      <button class="hero-dot ${i === 0 ? 'active' : ''}" data-index="${i}" type="button" aria-label="Slide ${i + 1}"></button>
    `).join('');
  }

  goToSlide(index) {
    this.currentIndex = (index + this.images.length) % this.images.length;
    const heroTrack = document.getElementById('heroTrack');
    if (heroTrack) {
      heroTrack.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    // Update dots
    document.querySelectorAll('.hero-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }

  attachEventListeners() {
    // Dot clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('hero-dot')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.goToSlide(index);
        this.stopAutoplay();
        this.startAutoplay();
      }
    });

    // Pause on hover
    const heroWrapper = document.querySelector('.hero-wrapper');
    if (heroWrapper) {
      heroWrapper.addEventListener('mouseenter', () => this.stopAutoplay());
      heroWrapper.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.hero-wrapper')) {
    new HeroSlider();
  }
});
