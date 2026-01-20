// ====== LEGANCY BOUTIQUE - SYSTÈME DE PRODUITS ======
// Structure : 17 produits, 4 catégories
// Chaque produit : id, nom, catégorie, prix, images (max 6), description, avantages

const PRODUCTS = [
  // ===== STYLE (Chaussures, Boxeurs, Écouteurs) =====
  {
    id: 1,
    name: "Boxer Coton Premium (Lot de 3)",
    category: "Style",
    subcategory: "Boxeurs",
    price: 20000,
    oldPrice: 25000,
    promoLabel: "PROMO",
    images: [
      "assets/images/Boxer.1.png",
      "assets/images/Boxer.2.png",
      "assets/images/Boxer.3.png",
      "assets/images/Boxer.4.png",
      "assets/images/Boxer.5.png",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Confort naturel premium – idéal pour le quotidien et les longues journées.",
    benefits: ["Respirant et doux", "Ceinture confortable", "Tenue parfaite toute la journée"],
    reviews: [
      { name: "Kouassi A.", stars: 5, text: "Très confortable. La qualité est vraiment au-dessus." },
      { name: "Yao K.", stars: 5, text: "Livraison rapide et produit conforme. Je recommande." }
    ]
  },
  {
    id: 2,
    name: "Boxer Nylon Flex (Lot de 3)",
    category: "Style",
    subcategory: "Boxeurs",
    price: 20000,
    oldPrice: 26000,
    promoLabel: "PROMO",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Nylon extensible – confort maximal et liberté de mouvement.",
    benefits: ["Stretch et léger", "Conçu pour bouger", "Séchage rapide"],
    reviews: [
      { name: "N'Guessan J.", stars: 5, text: "Top pour le sport et les longues journées." },
      { name: "Mariam C.", stars: 4, text: "Bonne matière, le confort est réel." }
    ]
  },
  {
    id: 3,
    name: "Sandales Brillantes Premium",
    category: "Style",
    subcategory: "Chaussures",
    price: 16000,
    oldPrice: 22000,
    promoLabel: "PROMO",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Style élégant et sophistiqué – confort au quotidien.",
    benefits: ["Design moderne et intemporel", "Confort durable", "Facile à assortir"],
    reviews: [
      { name: "Djeneba K.", stars: 5, text: "Très belles ! On dirait du haut de gamme." }
    ]
  },
  {
    id: 4,
    name: "Chaussures Loafer Classique",
    category: "Style",
    subcategory: "Chaussures",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Chaussure de prestige pour les occasions formelles et élégantes.",
    benefits: ["Cuir authentique", "Design intemporel", "Confort assuré"],
    reviews: [
      { name: "Théo R.", stars: 5, text: "Classique et intemporel. Excellent investissement." }
    ]
  },
  {
    id: 5,
    name: "Wireless Earbuds Deluxe",
    category: "Style",
    subcategory: "Écouteurs",
    price: 18000,
    oldPrice: 24000,
    promoLabel: "PROMO",
    images: [
      "https://images.unsplash.com/photo-1572569028738-411a7853086f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572569028738-411a7853086f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572569028738-411a7853086f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572569028738-411a7853086f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572569028738-411a7853086f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572569028738-411a7853086f?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Son clair et cristallin – connexion rapide et autonomie solide.",
    benefits: ["Connexion stable Bluetooth 5.0", "Boîtier compact", "Confort d'écoute"],
    reviews: [
      { name: "Serge B.", stars: 5, text: "Son propre et basses Ok. Très satisfait." },
      { name: "Kader T.", stars: 4, text: "Bonne autonomie et facile à connecter." }
    ]
  },
  {
    id: 6,
    name: "Écouteurs Noise Cancelling",
    category: "Style",
    subcategory: "Écouteurs",
    price: 42000,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Isolation acoustique premium pour une expérience immersive.",
    benefits: ["Réduction de bruit ANC", "Confort ergonomique", "Batterie 30h"],
    reviews: [
      { name: "Aminata F.", stars: 5, text: "La meilleure qualité audio qu'j'ai jamais eue." }
    ]
  },

  // ===== SANTÉ (Spray respiratoire, Compléments) =====
  {
    id: 7,
    name: "Spray Respiratoire Purifiant",
    category: "Santé",
    subcategory: "Spray",
    price: 8500,
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5f400f7d3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5f400f7d3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5f400f7d3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5f400f7d3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5f400f7d3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5f400f7d3?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Spray naturel pour dégager les voies respiratoires et purifie l'air.",
    benefits: ["Ingrédients naturels", "Action rapide", "Sûr pour toute la famille"],
    reviews: [
      { name: "Claire M.", stars: 5, text: "Très efficace pour l'été et le changement de saison." }
    ]
  },
  {
    id: 8,
    name: "Complément Vitamines D3",
    category: "Santé",
    subcategory: "Compléments",
    price: 12000,
    images: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Complément alimentaire D3 haute dose pour la santé osseuse et immunité.",
    benefits: ["Santé osseuse renforcée", "Système immunitaire", "Biodisponibilité maximale"],
    reviews: [
      { name: "Dr. Paul K.", stars: 5, text: "Formulation claire et efficace. Je recommande." }
    ]
  },
  {
    id: 9,
    name: "Complément Magnésium Premium",
    category: "Santé",
    subcategory: "Compléments",
    price: 15000,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Magnésium glyciné pour la détente musculaire et sommeil profond.",
    benefits: ["Relaxation musculaire", "Sommeil amélioré", "Stress réduit"],
    reviews: [
      { name: "Sophie D.", stars: 5, text: "Sommeil infiniment meilleur après une semaine." }
    ]
  },
  {
    id: 10,
    name: "Multivitamines Complètes",
    category: "Santé",
    subcategory: "Compléments",
    price: 18000,
    images: [
      "https://images.unsplash.com/photo-1631217262486-2ec5bce4fd1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631217262486-2ec5bce4fd1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631217262486-2ec5bce4fd1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631217262486-2ec5bce4fd1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631217262486-2ec5bce4fd1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631217262486-2ec5bce4fd1d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Formule équilibrée avec 13 vitamines et minéraux essentiels.",
    benefits: ["Énergie soutenue", "Immunité renforcée", "Santé globale"],
    reviews: [
      { name: "Bernard L.", stars: 5, text: "Je me sens plus énergétique depuis le début." }
    ]
  },

  // ===== SKIN CARE (Crèmes, sérums, soins) =====
  {
    id: 11,
    name: "Sérum Vitamine C Pur",
    category: "Skin care",
    subcategory: "Sérums",
    price: 22000,
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Sérum anti-oxydant puissant pour le teint éclatant et jeune.",
    benefits: ["Clareté accrue", "Protégé des UV", "Teint unifié"],
    reviews: [
      { name: "Nadia A.", stars: 5, text: "Résultat visible après 2 semaines. Mon teint est éclatant." }
    ]
  },
  {
    id: 12,
    name: "Crème Hydratante Riche",
    category: "Skin care",
    subcategory: "Crèmes",
    price: 18000,
    images: [
      "https://images.unsplash.com/photo-1617634924704-92d37541e053?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617634924704-92d37541e053?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617634924704-92d37541e053?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617634924704-92d37541e053?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617634924704-92d37541e053?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617634924704-92d37541e053?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Crème nourrissante pour peaux sèches et sensibles.",
    benefits: ["Hydratation profonde", "Anti-rides", "Effet lissant"],
    reviews: [
      { name: "Jeanne P.", stars: 5, text: "Peau douce et souple dès le lendemain." }
    ]
  },
  {
    id: 13,
    name: "Nettoyant Visage Doux",
    category: "Skin care",
    subcategory: "Nettoyants",
    price: 12000,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Gel nettoyant premium qui ôte le maquillage sans agresser.",
    benefits: ["Doux mais efficace", "Sans résidu", "pH équilibré"],
    reviews: [
      { name: "Rita G.", stars: 5, text: "J'aime la composition naturelle et le rendu." }
    ]
  },

  // ===== TECH (Gadgets, accessoires, appareils) =====
  {
    id: 14,
    name: "Precision Razor Kit",
    category: "Tech",
    subcategory: "Rasoirs",
    price: 15000,
    oldPrice: 20000,
    promoLabel: "PROMO",
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445857?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445857?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445857?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445857?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445857?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445857?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Rasoir électrique de prestige pour rasage impeccable.",
    benefits: ["Précis et sûr", "Confortable sur la peau", "Facile à utiliser"],
    reviews: [
      { name: "Michel Z.", stars: 5, text: "Très pratique. Finition propre et nette." }
    ]
  },
  {
    id: 15,
    name: "Smart Watch Fitness",
    category: "Tech",
    subcategory: "Montres",
    price: 28000,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Montre intelligente pour suivi de votre activité physique.",
    benefits: ["Suivi cardiaque", "Podomètre précis", "Autonomie 5 jours"],
    reviews: [
      { name: "Alex R.", stars: 5, text: "Les données sont précises et l'interface est simple." }
    ]
  },
  {
    id: 16,
    name: "Chargeur Universel Rapide",
    category: "Tech",
    subcategory: "Accessoires",
    price: 9500,
    images: [
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Chargeur USB-C haute puissance compatible tous les appareils.",
    benefits: ["Charge 50% en 15min", "Compact et léger", "Sécurité garantie"],
    reviews: [
      { name: "Lucas V.", stars: 5, text: "Rapide et fiable. Je l'utilise tous les jours." }
    ]
  },
  {
    id: 17,
    name: "Powerbank 30000 mAh",
    category: "Tech",
    subcategory: "Accessoires",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Batterie externe massive pour recharger 5 fois votre téléphone.",
    benefits: ["Capacité maximale", "LED de statut", "Charge rapide USB-C"],
    reviews: [
      { name: "Kamara O.", stars: 5, text: "Excellent pour les voyages et déplacements." }
    ]
  }
];

// Exposer les produits pour les scripts
window.PRODUCTS = PRODUCTS;

// Fonction utilitaire : obtenir les catégories principales
function getMainCategories() {
  return [...new Set(PRODUCTS.map(p => p.category))];
}

// Fonction utilitaire : obtenir les produits par catégorie
function getProductsByCategory(category) {
  if (category === "Tous") return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

// Exposer les utilitaires
window.getMainCategories = getMainCategories;
window.getProductsByCategory = getProductsByCategory;
