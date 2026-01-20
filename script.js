// ====== CONFIG (Centralisé via globals) ======
const SHEETS_WEBAPP_URL = (typeof window !== 'undefined' && window.SHEETS_WEBAPP_URL) ? window.SHEETS_WEBAPP_URL : "";
const WHATSAPP_NUMBER = (typeof window !== 'undefined' && window.CONFIG && window.CONFIG.WHATSAPP_NUMBER) ? window.CONFIG.WHATSAPP_NUMBER : "";
// =============================================

// ====== SHIPPING RULES (À MODIFIER SI BESOIN) ======
const SHIPPING = {
  ABIDJAN_FREE: 0,
  SPECIAL_ZONES_FEE: 1000,
  OUTSIDE_ABIDJAN_FEE: 2000,
  specialZones: ["bassam", "anyama", "yopougon zone industrielle", "yop zone industrielle", "yopougon zi"]
};
// =================================

// ====== PRODUITS (MODIFIABLES) ======
// Astuce: pour une promo, ajoute oldPrice + promoLabel.
const products = [
  {
    id: 1,
    name: "Boxer coton prime (Lot de 3)",
    category: "Boxers",
    price: 15000,
    oldPrice: 22000,
    promoLabel: "PROMO",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Confort naturel premium – idéal pour le quotidien.",
    benefits: ["Respirant et doux", "Ceinture confortable", "Tenue parfaite toute la journée"],
    reviews: [
      { name:"Kouassi A.", stars:5, text:"Très confortable. La qualité est vraiment au-dessus." },
      { name:"Yao K.", stars:5, text:"Livraison rapide et produit conforme. Je recommande." },
      { name:"Aïcha D.", stars:4, text:"Très bien. Taille nickel." }
    ]
  },
  {
    id: 2,
    name: "Boxer nylon flex (Lot de 3)",
    category: "Boxers",
    price: 20000,
    oldPrice: 26000,
    promoLabel: "PROMO",
    images: Array(8).fill("https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80"),
    description: "Nylon extensible – confort + liberté de mouvement.",
    benefits: ["Stretch et léger", "Conçu pour bouger", "Séchage rapide"],
    reviews: [
      { name:"N’Guessan J.", stars:5, text:"Top pour le sport et les longues journées." },
      { name:"Mariam C.", stars:4, text:"Bonne matière, le confort est réel." }
    ]
  },
  {
    id: 3,
    name: "Sandales brillantes",
    category: "Chaussures",
    price: 16000,
    oldPrice: 22000,
    promoLabel: "PROMO",
    images: Array(8).fill("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"),
    description: "Style élégant – confort au quotidien.",
    benefits: ["Design moderne", "Confort durable", "Facile à assortir"],
    reviews: [
      { name:"Djeneba K.", stars:5, text:"Très belles ! On dirait du haut de gamme." }
    ]
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    category: "Tech",
    price: 18000,
    images: Array(8).fill("https://images.unsplash.com/photo-1572569028738-411a7853086f?auto=format&fit=crop&w=1200&q=80"),
    description: "Son clair – connexion rapide – autonomie solide.",
    benefits: ["Connexion stable", "Boîtier compact", "Confort d’écoute"],
    reviews: [
      { name:"Serge B.", stars:5, text:"Son propre et basses OK. Très satisfait." },
      { name:"Kader T.", stars:4, text:"Bonne autonomie et facile à connecter." }
    ]
  },
  {
    id: 5,
    name: "Precision Razor Kit",
    category: "Rasoirs",
    price: 15000,
    images: Array(8).fill("https://images.unsplash.com/photo-1503602642458-232111445857?auto=format&fit=crop&w=1200&q=80"),
    description: "Rasage précis barbe & corps.",
    benefits: ["Précis", "Confortable", "Facile à utiliser"],
    reviews: [
      { name:"Michel Z.", stars:5, text:"Très pratique. Finition propre." }
    ]
  }
];

// expose products for product.js
window.products = products;

// ====== HERO SLIDES (modifiables) ======
// Déclarez ici les images/produits à montrer dans le slider héro.
// Pour voir immédiatement des images, on utilise des URLs distantes (issues
// des images produits déjà définies). Remplacez ces valeurs par vos URLs
// distantes (ex: 'https://i.imgur.com/xxxx.jpg') si vous avez hébergé vos
// images ailleurs.
// Using the images you dropped into `assets/` (filenames detected in workspace).
const heroSlides = [
  { image: "assets/hero1.jpg", productId: products[0].id },
  { image: "assets/hero2.jpg", productId: products[1].id },
  { image: "assets/hero3.jpg", productId: products[2].id },
  { image: "assets/hero4.jpg", productId: products[3].id }
];

// ====== UTILS ======
function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' })
      .format(amount).replace('F CFA', 'FCFA');
  } catch {
    return `${amount} FCFA`;
  }
}

function normalize(str) {
  return (str || "").toString().trim().toLowerCase();
}

function calcShipping(cityRaw, addressRaw) {
  const city = normalize(cityRaw);
  const address = normalize(addressRaw);
  const isAbidjan = city === "abidjan";
  if (isAbidjan) {
    const inSpecial = SHIPPING.specialZones.some(z => address.includes(z) || city.includes(z));
    return inSpecial ? SHIPPING.SPECIAL_ZONES_FEE : SHIPPING.ABIDJAN_FREE;
  }
  return SHIPPING.OUTSIDE_ABIDJAN_FEE;
}

// ====== STATE (Cart saved in localStorage for cross pages) ======
let cart = [];
try { cart = JSON.parse(localStorage.getItem("legancy_cart") || "[]"); } catch { cart = []; }

function persistCart() { localStorage.setItem("legancy_cart", JSON.stringify(cart)); }
function cartSubtotal() { return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0); }

// ====== DOM ======
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartShippingEl = document.getElementById('cart-shipping');
const cartItemsContainer = document.querySelector('.cart-items-container');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const checkoutSubtotalEl = document.getElementById('checkout-subtotal');
const checkoutShippingEl = document.getElementById('checkout-shipping');
const checkoutTotalEl = document.getElementById('checkout-total');
const checkoutStatusEl = document.getElementById('checkout-status');
const closeCheckoutBtn = document.querySelector('.close-checkout');
const checkoutWhatsAppBtn = document.getElementById('checkout-whatsapp');

function setupWhatsAppLinks() {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour, je veux des infos sur vos produits.")}`;
  const waHeader = document.getElementById("wa-header");
  const waContact = document.getElementById("wa-contact");
  if (waHeader) waHeader.href = waUrl;
  if (waContact) waContact.href = waUrl;
}

// ====== CATALOG ======
const productGrid = document.getElementById('product-grid');

function renderProducts(items) {
  if (!productGrid) return;
  productGrid.innerHTML = items.map(p => {
    const pName = (typeof t === 'function') ? (t(`product.${p.id}.name`) || p.name) : p.name;
    return `
    <a class="card" href="product.html?id=${p.id}">
      <img class="card-img" src="${(p.images && p.images[0]) || p.image || ""}" alt="${pName}">
      <div class="card-body">
        <div class="card-meta"><span class="card-cat">${p.category}</span></div>
        <h3 class="card-title">${pName}</h3>
        <div class="price-row">
          ${p.oldPrice ? `<span class="badge-promo">${p.promoLabel || "PROMO"}</span>` : ""}
          <span class="current-price">${formatCurrency(p.price)}</span>
          ${p.oldPrice ? `<span class="old-price">${formatCurrency(p.oldPrice)}</span>` : ""}
        </div>
        <button class="secondary-btn full" type="button" onclick="event.preventDefault(); addToCart(${p.id});">${(typeof t === 'function') ? t('product.add_to_cart') : 'Ajouter au panier'}</button>
      </div>
    </a>
  `;
  }).join('');
}

function setupFilters() {
  document.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      if (cat === 'all') renderProducts(products);
      else renderProducts(products.filter(p => p.category === cat));
    });
  });
}

// ====== CART ======
function updateCartUI() {
  if (cartCountEl) cartCountEl.textContent = String(cart.reduce((a,i)=>a+i.quantity,0));
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    const emptyText = (typeof t === 'function') ? t('cart.empty') : 'Votre panier est vide.';
    cartItemsContainer.innerHTML = `<p style="text-align:center;color:rgba(255,255,255,0.65);">${emptyText}</p>`;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${(item.images && item.images[0]) || item.image || ""}" alt="${item.name}">
        <div style="flex:1;">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-sub">${formatCurrency(item.price)} × ${item.quantity}</div>
          <div class="cart-item-actions">
            <button class="chip qty-btn" type="button" onclick="decQty(${item.id})">−</button>
            <button class="chip qty-btn" type="button" onclick="incQty(${item.id})">+</button>
            <span class="remove-link" onclick="removeFromCart(${item.id})">${(typeof t === 'function') ? t('cart.remove') : 'Retirer'}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  const subtotal = cartSubtotal();
  const shipping = 0; // computed during checkout
  if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(subtotal);
  if (cartShippingEl) cartShippingEl.textContent = formatCurrency(shipping);
  if (cartTotalEl) cartTotalEl.textContent = formatCurrency(subtotal + shipping);
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id:p.id, name:p.name, price:p.price, images:p.images, image:p.image, quantity:1 });
  persistCart();
  updateCartUI();
  openCart();
}
window.addToCart = addToCart;

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  persistCart();
  updateCartUI();
}
window.removeFromCart = removeFromCart;

function incQty(id) {
  const it = cart.find(i=>i.id===id);
  if (!it) return;
  it.quantity += 1;
  persistCart();
  updateCartUI();
}
window.incQty = incQty;

function decQty(id) {
  const it = cart.find(i=>i.id===id);
  if (!it) return;
  it.quantity -= 1;
  if (it.quantity <= 0) cart = cart.filter(i=>i.id!==id);
  persistCart();
  updateCartUI();
}
window.decQty = decQty;

function openCart() {
  if (!cartSidebar || !overlay) return;
  cartSidebar.classList.add('open');
  overlay.classList.add('active');
}
window.openCart = openCart;

function closeCart() {
  if (!cartSidebar || !overlay) return;
  cartSidebar.classList.remove('open');
  overlay.classList.remove('active');
}
window.closeCart = closeCart;

// ====== CHECKOUT ======
function openCheckout() {
  if (!checkoutModal) return;
    if (cart.length === 0) { alert((typeof t === 'function') ? t('cart.empty') : 'Votre panier est vide.'); return; }

  const city = checkoutForm?.elements?.city?.value || "";
  const addr = checkoutForm?.elements?.deliveryAddress?.value || "";
  const subtotal = cartSubtotal();
  const shipping = (city || addr) ? calcShipping(city, addr) : 0;

  if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = formatCurrency(subtotal);
  if (checkoutShippingEl) checkoutShippingEl.textContent = formatCurrency(shipping);
  if (checkoutTotalEl) checkoutTotalEl.textContent = formatCurrency(subtotal + shipping);

  checkoutModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}
window.openCheckout = openCheckout;

function closeCheckout() {
  if (!checkoutModal) return;
  checkoutModal.classList.remove('show');
  document.body.style.overflow = 'auto';
}
window.closeCheckout = closeCheckout;

function buildOrderPayload(fd) {
  const items = cart.map(i => ({ id:i.id, name:i.name, quantity:i.quantity, price:i.price }));
  const subtotal = cartSubtotal();
  const city = fd.get('city') || "";
  const addr = fd.get('deliveryAddress') || "";
  const shippingFee = calcShipping(city, addr);
  const total = subtotal + shippingFee;
  return {
    status: "neutre",
    customerName: (fd.get('customerName') || "").toString().trim(),
    customerPhone: (fd.get('customerPhone') || "").toString().trim(),
    city: (city || "").toString().trim(),
    deliveryAddress: (addr || "").toString().trim(),
    orderNote: (fd.get('orderNote') || "").toString().trim(),
    currency: "XOF",
    subtotal,
    shippingFee,
    total,
    items
  };
}

function orderToWhatsAppText(payload) {
  const lines = [];
  lines.push("🛒 *Nouvelle commande (Legancy Boutique)*");
  lines.push(`👤 Nom: ${payload.customerName}`);
  lines.push(`📞 Téléphone: ${payload.customerPhone}`);
  lines.push(`🏙️ Ville: ${payload.city}`);
  lines.push(`📍 Livraison: ${payload.deliveryAddress}`);
  if (payload.orderNote) lines.push(`📝 Note: ${payload.orderNote}`);
  lines.push("");
  lines.push("*Articles:*");
  payload.items.forEach(it => lines.push(`- ${it.name} x${it.quantity}`));
  lines.push("");
  lines.push(`💰 Sous-total: ${formatCurrency(payload.subtotal)}`);
  lines.push(`🚚 Livraison: ${formatCurrency(payload.shippingFee)}`);
  lines.push(`✅ Total: ${formatCurrency(payload.total)}`);
  lines.push("💳 Paiement: à la livraison");
  return lines.join("\n");
}

async function sendToGoogleSheets(payload) {
  if (!SHEETS_WEBAPP_URL) {
    console.warn("SHEETS_WEBAPP_URL not configured");
    return { ok:false, skipped:true };
  }
  const bodyText = JSON.stringify(payload);
  console.log("Sending order to Google Sheets:", payload);
  try {
    const response = await fetch(SHEETS_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: bodyText
    });
    console.log("Fetch completed (no-cors mode)");
    return { ok:true };
  } catch (e) {
    console.error("Fetch failed:", e);
  }
  try {
    if (navigator && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([bodyText], { type:"application/json" });
      const result = navigator.sendBeacon(SHEETS_WEBAPP_URL, blob);
      console.log("sendBeacon result:", result);
      return { ok: result };
    }
  } catch (e2) {
    console.error("sendBeacon failed:", e2);
  }
  return { ok:false };
}

function wireCheckoutLiveTotals() {
  if (!checkoutForm) return;
  const update = () => {
    const subtotal = cartSubtotal();
    const city = checkoutForm.elements.city?.value || "";
    const addr = checkoutForm.elements.deliveryAddress?.value || "";
    const shipping = (city || addr) ? calcShipping(city, addr) : 0;
    if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = formatCurrency(subtotal);
    if (checkoutShippingEl) checkoutShippingEl.textContent = formatCurrency(shipping);
    if (checkoutTotalEl) checkoutTotalEl.textContent = formatCurrency(subtotal + shipping);
  };
  checkoutForm.elements.city?.addEventListener('input', update);
  checkoutForm.elements.deliveryAddress?.addEventListener('input', update);
  update();
}

function wireCheckoutSubmit() {
  if (!checkoutForm) return;
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (checkoutStatusEl) checkoutStatusEl.textContent = (typeof t === 'function') ? t('checkout.sending') : 'Envoi de la commande...';
    const fd = new FormData(checkoutForm);
    const payload = buildOrderPayload(fd);

    if (!payload.customerName || !payload.customerPhone || !payload.city || !payload.deliveryAddress) {
      if (checkoutStatusEl) checkoutStatusEl.textContent = (typeof t === 'function') ? t('checkout.fill_fields') : 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const digits = payload.customerPhone.replace(/\D/g, "");
    if (digits.length < 8) {
      if (checkoutStatusEl) checkoutStatusEl.textContent = (typeof t === 'function') ? t('checkout.invalid_phone') : 'Numéro invalide.';
      return;
    }

    const res = await sendToGoogleSheets(payload);
    if (res.ok || res.skipped) {
      if (checkoutStatusEl) checkoutStatusEl.textContent = (typeof t === 'function') ? t('checkout.sent') : 'Commande envoyée ✅';
      cart = [];
      persistCart();
      updateCartUI();
      checkoutForm.reset();
      closeCart();
      setTimeout(closeCheckout, 600);
    } else {
      if (checkoutStatusEl) checkoutStatusEl.textContent = (typeof t === 'function') ? t('checkout.error') : "Erreur d'envoi. Réessayez.";
    }
  });
}

function wireWhatsAppButton() {
  if (!checkoutWhatsAppBtn || !checkoutForm) return;
  checkoutWhatsAppBtn.addEventListener('click', () => {
    const fd = new FormData(checkoutForm);
    const payload = buildOrderPayload(fd);
    if (!payload.customerName || !payload.customerPhone || !payload.city || !payload.deliveryAddress) {
      alert((typeof t === 'function') ? t('checkout.fill_fields') : 'Veuillez renseigner Nom, Numéro, Ville et Lieu de livraison.');
      return;
    }
    const txt = orderToWhatsAppText(payload);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(txt)}`, "_blank");
  });
}

// ===== HERO SLIDER =====
function setupHeroSlider() {
  const track = document.getElementById('heroTrack');
  if (!track) return;
  const slidesData = (window.heroSlides && Array.isArray(window.heroSlides) && window.heroSlides.length)
    ? window.heroSlides
    : heroSlides;
  if (!slidesData || slidesData.length === 0) return;

  const slideHtml = slidesData.map(s => `
    <div class="hero-slide" data-product="${s.productId || ''}">
      <img src="${s.image}" alt="">
    </div>
  `).join('');

  // duplicate slides for seamless loop
  track.innerHTML = `<div class="hero-track-inner">${slideHtml}${slideHtml}</div>`;
  const inner = track.querySelector('.hero-track-inner');
  if (!inner) return;
  inner.style.display = 'flex';
  inner.style.width = 'max-content';
  inner.querySelectorAll('.hero-slide').forEach(s => {
    s.style.flex = '0 0 280px';
    s.style.boxSizing = 'border-box';
    s.style.cursor = 'pointer';
  });

  // duration proportional to number of slides (tweak multiplier to adjust speed)
  // Increased multiplier for a slower, smoother scroll. Raise multiplier for even slower.
  const duration = Math.max(12, slidesData.length * 6);
  inner.style.animation = `scroll ${duration}s linear infinite`;

  // pause on hover
  track.addEventListener('mouseenter', () => { inner.style.animationPlayState = 'paused'; });
  track.addEventListener('mouseleave', () => { inner.style.animationPlayState = 'running'; });

  // click slide -> open product
  inner.querySelectorAll('.hero-slide').forEach(s => s.addEventListener('click', () => {
    const pid = s.dataset.product;
    if (pid) window.location.href = `product.html?id=${pid}`;
  }));
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  setupWhatsAppLinks();

  setupHeroSlider();

  // --- i18n: full-site translations stored in localStorage ---
  const i18n = {
    fr: {
      'header.whatsapp': 'WhatsApp',
      'header.cart': 'Panier',
      'nav.home': 'Accueil',
      'nav.catalogue': 'Catalogue',
      'nav.contact': 'Contact',
      'nav.conditions': 'Conditions',
      'brand.tag': 'Mode & technologie',
      'catalogue.title': 'Catalogue',
      'filters.all': 'Tout',
      'filters.boxers': 'Boxers',
      'filters.shoes': 'Chaussures',
      'filters.tech': 'Tech',
      'filters.razors': 'Rasoirs',
      'contact.title': 'Contact',
      'contact.desc': 'Une question ? Un besoin en gros ? Écris-nous sur WhatsApp.',
      'contact.button': 'Contacter sur WhatsApp',
      'sites.title': 'Sites',
      'sites.desc': 'Retrouvez la boutique sur les réseaux sociaux :',
      'trust.payment_title': 'Paiement à la livraison',
      'trust.payment_desc': 'Vous payez seulement à la réception.',
      'trust.delivery_title': 'Livraison – règles',
      'trust.delivery_desc': 'Abidjan : gratuite. Bassam / Anyama / Yopougon Zone Industrielle : 1 000 FCFA. Hors Abidjan : 2 000 FCFA.',
      'cart.title': 'Votre panier',
      'cart.empty': 'Votre panier est vide.',
      'cart.subtotal': 'Sous-total',
      'cart.shipping': 'Livraison',
      'cart.total': 'Total',
      'cart.checkout': 'Valider le panier',
      'checkout.title': 'Finaliser la commande',
      'checkout.name_label': 'Nom & prénom *',
      'checkout.name_placeholder': 'Ex: Kouassi Jean',
      'checkout.phone_label': 'Numéro *',
      'checkout.phone_placeholder': 'Ex: 07 XX XX XX XX',
      'checkout.city_label': 'Ville *',
      'checkout.city_placeholder': 'Ex: Abidjan',
      'checkout.address_label': 'Lieu de livraison (quartier / repère) *',
      'checkout.address_placeholder': 'Ex: Yopougon, Siporex...',
      'checkout.note_label': 'Note (optionnel)',
      'checkout.note_placeholder': 'Un détail pour la livraison ?',
      'checkout.mini_trust': '✅ Paiement à la livraison • 🚚 Livraison calculée automatiquement • 💬 WhatsApp support',
      'checkout.whatsapp_button': 'Envoyer via WhatsApp',
      'checkout.submit_button': 'Valider la commande',
      'checkout.sending': 'Envoi de la commande...',
      'checkout.fill_fields': 'Veuillez remplir tous les champs obligatoires.',
      'checkout.invalid_phone': 'Numéro invalide.',
      'checkout.sent': 'Commande envoyée ✅',
      'checkout.error': 'Erreur d\'envoi. Réessayez.',
      'product.add_to_cart': 'Ajouter au panier',
      'cart.remove': 'Retirer',
      'product.not_found_title': 'Produit introuvable',
      'product.not_found_desc': 'Retournez au catalogue.',
      'product.buy_now': 'Acheter maintenant'
      , 'product.prev': 'Précédent',
      'product.next': 'Suivant',
      // Product names
      'product.1.name': 'Boxer coton prime (Lot de 3)',
      'product.1.desc': 'Confort naturel premium – idéal pour le quotidien.',
      'product.1.benefit.1': 'Respirant et doux',
      'product.1.benefit.2': 'Ceinture confortable',
      'product.1.benefit.3': 'Tenue parfaite toute la journée',
      'product.2.name': 'Boxer nylon flex (Lot de 3)',
      'product.2.desc': 'Nylon extensible – confort + liberté de mouvement.',
      'product.2.benefit.1': 'Stretch et léger',
      'product.2.benefit.2': 'Conçu pour bouger',
      'product.2.benefit.3': 'Séchage rapide',
      'product.3.name': 'Sandales brillantes',
      'product.3.desc': 'Style élégant – confort au quotidien.',
      'product.3.benefit.1': 'Design moderne',
      'product.3.benefit.2': 'Confort durable',
      'product.3.benefit.3': 'Facile à assortir',
      'product.4.name': 'Wireless Earbuds',
      'product.4.desc': 'Son clair – connexion rapide – autonomie solide.',
      'product.4.benefit.1': 'Connexion stable',
      'product.4.benefit.2': 'Boîtier compact',
      'product.4.benefit.3': 'Confort d\'écoute',
      'product.5.name': 'Precision Razor Kit',
      'product.5.desc': 'Rasage précis barbe & corps.',
      'product.5.benefit.1': 'Précis',
      'product.5.benefit.2': 'Confortable',
      'product.5.benefit.3': 'Facile à utiliser'
    },
    en: {
      'header.whatsapp': 'WhatsApp',
      'header.cart': 'Cart',
      'nav.home': 'Home',
      'nav.catalogue': 'Catalogue',
      'nav.contact': 'Contact',
      'nav.conditions': 'Terms',
      'brand.tag': 'Fashion & Tech',
      'catalogue.title': 'Catalogue',
      'filters.all': 'All',
      'filters.boxers': 'Boxers',
      'filters.shoes': 'Shoes',
      'filters.tech': 'Tech',
      'filters.razors': 'Razors',
      'contact.title': 'Contact',
      'contact.desc': 'Questions? Wholesale? Message us on WhatsApp.',
      'contact.button': 'Contact on WhatsApp',
      'sites.title': 'Sites',
      'sites.desc': 'Find the store on social networks:',
      'trust.payment_title': 'Pay on delivery',
      'trust.payment_desc': 'You pay only on receipt.',
      'trust.delivery_title': 'Delivery – rules',
      'trust.delivery_desc': 'Abidjan: free. Bassam / Anyama / Yopougon Industrial Zone: 1,000 FCFA. Outside Abidjan: 2,000 FCFA.',
      'cart.title': 'Your cart',
      'cart.empty': 'Your cart is empty.',
      'cart.subtotal': 'Subtotal',
      'cart.shipping': 'Shipping',
      'cart.total': 'Total',
      'cart.checkout': 'Checkout',
      'checkout.title': 'Complete order',
      'checkout.name_label': 'Full name *',
      'checkout.name_placeholder': 'Ex: John Doe',
      'checkout.phone_label': 'Phone *',
      'checkout.phone_placeholder': 'Ex: +225 07 XX XX XX XX',
      'checkout.city_label': 'City *',
      'checkout.city_placeholder': 'Ex: Abidjan',
      'checkout.address_label': 'Delivery address (neighborhood / landmark) *',
      'checkout.address_placeholder': 'Ex: Yopougon, Siporex...',
      'checkout.note_label': 'Note (optional)',
      'checkout.note_placeholder': 'Any delivery detail?',
      'checkout.mini_trust': '✅ Pay on delivery • 🚚 Calculated shipping • 💬 WhatsApp support',
      'checkout.whatsapp_button': 'Send via WhatsApp',
      'checkout.submit_button': 'Place order',
      'checkout.sending': 'Sending order...',
      'checkout.fill_fields': 'Please fill all required fields.',
      'checkout.invalid_phone': 'Invalid phone number.',
      'checkout.sent': 'Order sent ✅',
      'checkout.error': 'Sending error. Try again.',
      'product.add_to_cart': 'Add to cart',
      'cart.remove': 'Remove',
      'product.not_found_title': 'Product not found',
      'product.not_found_desc': 'Return to catalogue.',
      'product.buy_now': 'Buy now'
      , 'product.prev': 'Previous',
      'product.next': 'Next',
      // Product names
      'product.1.name': 'Premium Cotton Boxer (Pack of 3)',
      'product.1.desc': 'Premium natural comfort – ideal for everyday wear.',
      'product.1.benefit.1': 'Breathable and soft',
      'product.1.benefit.2': 'Comfortable waistband',
      'product.1.benefit.3': 'Perfect fit all day long',
      'product.2.name': 'Flex Nylon Boxer (Pack of 3)',
      'product.2.desc': 'Stretchy nylon – comfort + freedom of movement.',
      'product.2.benefit.1': 'Stretch and lightweight',
      'product.2.benefit.2': 'Designed to move',
      'product.2.benefit.3': 'Quick dry',
      'product.3.name': 'Shiny Sandals',
      'product.3.desc': 'Elegant style – everyday comfort.',
      'product.3.benefit.1': 'Modern design',
      'product.3.benefit.2': 'Lasting comfort',
      'product.3.benefit.3': 'Easy to match',
      'product.4.name': 'Wireless Earbuds',
      'product.4.desc': 'Clear sound – fast connection – solid battery life.',
      'product.4.benefit.1': 'Stable connection',
      'product.4.benefit.2': 'Compact case',
      'product.4.benefit.3': 'Listening comfort',
      'product.5.name': 'Precision Razor Kit',
      'product.5.desc': 'Precise shave for beard & body.',
      'product.5.benefit.1': 'Precise',
      'product.5.benefit.2': 'Comfortable',
      'product.5.benefit.3': 'Easy to use'
    },
    ar: {
      'header.whatsapp': 'واتساب',
      'header.cart': 'السلة',
      'nav.home': 'الرئيسية',
      'nav.catalogue': 'الكتالوج',
      'nav.contact': 'اتصل بنا',
      'nav.conditions': 'الشروط',
      'brand.tag': 'الموضة والتكنولوجيا',
      'catalogue.title': 'الكتالوج',
      'filters.all': 'الكل',
      'filters.boxers': 'سراويل داخلية',
      'filters.shoes': 'أحذية',
      'filters.tech': 'تقنية',
      'filters.razors': 'شفرات الحلاقة',
      'contact.title': 'اتصل بنا',
      'contact.desc': 'هل لديك سؤال؟ هل تريد الشراء بالجملة؟ راسلنا على واتساب.',
      'contact.button': 'اتصل عبر واتساب',
      'sites.title': 'المواقع',
      'sites.desc': 'تابعنا على مواقع التواصل الاجتماعي:',
      'trust.payment_title': 'الدفع عند التسليم',
      'trust.payment_desc': 'تدفع فقط عند الاستلام.',
      'trust.delivery_title': 'التوصيل - القواعد',
      'trust.delivery_desc': 'أبيدجان: مجاني. باسام / أنياما / يوبوغون المنطقة الصناعية: 1000 فرنك. خارج أبيدجان: 2000 فرنك.',
      'cart.title': 'سلتك',
      'cart.empty': 'سلتك فارغة.',
      'cart.subtotal': 'المجموع الفرعي',
      'cart.shipping': 'التوصيل',
      'cart.total': 'المجموع',
      'cart.checkout': 'إتمام الطلب',
      'checkout.title': 'إتمام الطلب',
      'checkout.name_label': 'الاسم الكامل *',
      'checkout.name_placeholder': 'مثال: أحمد محمد',
      'checkout.phone_label': 'رقم الهاتف *',
      'checkout.phone_placeholder': 'مثال: 07 XX XX XX XX',
      'checkout.city_label': 'المدينة *',
      'checkout.city_placeholder': 'مثال: أبيدجان',
      'checkout.address_label': 'عنوان التسليم (الحي / معلم) *',
      'checkout.address_placeholder': 'مثال: يوبوغون، سيبوريكس...',
      'checkout.note_label': 'ملاحظة (اختياري)',
      'checkout.note_placeholder': 'أي تفاصيل للتسليم؟',
      'checkout.mini_trust': '✅ الدفع عند التسليم • 🚚 حساب التوصيل تلقائيًا • 💬 دعم واتساب',
      'checkout.whatsapp_button': 'إرسال عبر واتساب',
      'checkout.submit_button': 'تأكيد الطلب',
      'checkout.sending': 'جارٍ إرسال الطلب...',
      'checkout.fill_fields': 'يرجى ملء جميع الحقول المطلوبة.',
      'checkout.invalid_phone': 'رقم هاتف غير صالح.',
      'checkout.sent': 'تم إرسال الطلب ✅',
      'checkout.error': 'خطأ في الإرسال. حاول مرة أخرى.',
      'product.add_to_cart': 'أضف إلى السلة',
      'cart.remove': 'إزالة',
      'product.not_found_title': 'المنتج غير موجود',
      'product.not_found_desc': 'العودة إلى الكتالوج.',
      'product.buy_now': 'اشتر الآن',
      'product.prev': 'السابق',
      'product.next': 'التالي',
      'product.1.name': 'سروال داخلي قطني فاخر (عبوة من 3)',
      'product.1.desc': 'راحة طبيعية فاخرة - مثالية للاستخدام اليومي.',
      'product.1.benefit.1': 'قابل للتنفس وناعم',
      'product.1.benefit.2': 'حزام مريح',
      'product.1.benefit.3': 'ملاءمة مثالية طوال اليوم',
      'product.2.name': 'سروال داخلي نايلون مرن (عبوة من 3)',
      'product.2.desc': 'نايلون قابل للتمدد - راحة + حرية الحركة.',
      'product.2.benefit.1': 'مرن وخفيف الوزن',
      'product.2.benefit.2': 'مصمم للحركة',
      'product.2.benefit.3': 'سريع الجفاف',
      'product.3.name': 'صنادل لامعة',
      'product.3.desc': 'أسلوب أنيق - راحة يومية.',
      'product.3.benefit.1': 'تصميم عصري',
      'product.3.benefit.2': 'راحة دائمة',
      'product.3.benefit.3': 'سهلة التنسيق',
      'product.4.name': 'سماعات لاسلكية',
      'product.4.desc': 'صوت واضح - اتصال سريع - بطارية قوية.',
      'product.4.benefit.1': 'اتصال مستقر',
      'product.4.benefit.2': 'علبة مدمجة',
      'product.4.benefit.3': 'راحة في الاستماع',
      'product.5.name': 'طقم حلاقة دقيق',
      'product.5.desc': 'حلاقة دقيقة للذقن والجسم.',
      'product.5.benefit.1': 'دقيق',
      'product.5.benefit.2': 'مريح',
      'product.5.benefit.3': 'سهل الاستخدام'
    }
  };

  // expose helper for templates and other functions
  window.I18n = i18n;
  window.t = function(key){
    try{
      const lang = localStorage.getItem('site_lang') || 'fr';
      return (i18n[lang] && i18n[lang][key]) ? i18n[lang][key] : key;
    }catch(e){ return key; }
  };

  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = (i18n[lang] && i18n[lang][key]) ? i18n[lang][key] : '';
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = txt;
      else el.textContent = txt;
    });
  }

  function initLang() {
    const saved = localStorage.getItem('site_lang') || 'fr';
    const toggle = document.getElementById('langToggle');
    if (toggle) toggle.textContent = 'Langues ▾';
    applyTranslations(saved);
    // Apply RTL for Arabic
    if (saved === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', saved);
    }
  }

  // wire language selector
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = btn.dataset.lang || 'fr';
      localStorage.setItem('site_lang', lang);
      document.getElementById('langToggle').textContent = 'Langues ▾';
      applyTranslations(lang);
      // Apply RTL for Arabic
      if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', lang);
      }
      // re-render products with new language
      if (productGrid) renderProducts(products);
    });
  });
  initLang();

  // wire nav dropdown (mobile: click to toggle, desktop hover handled by CSS)
  function wireNavDropdown() {
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = btn.closest('.dropdown');
        if (!parent) return;
        parent.classList.toggle('open');
        btn.setAttribute('aria-expanded', parent.classList.contains('open'));
      });
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.open').forEach(d => {
          d.classList.remove('open');
          d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
  wireNavDropdown();

  if (productGrid) {
    renderProducts(products);
    setupFilters();
  }

  updateCartUI();

  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('close-cart')?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', () => { closeCart(); closeCheckout(); });
  document.getElementById('checkout-open')?.addEventListener('click', openCheckout);
  closeCheckoutBtn?.addEventListener('click', closeCheckout);

  wireCheckoutLiveTotals();
  wireCheckoutSubmit();
  wireWhatsAppButton();
});
