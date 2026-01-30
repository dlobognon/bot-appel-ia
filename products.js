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
    price: 14900,
    oldPrice: 19000,
    promoLabel: "PROMO",
    images: [
      "assets/images/Boxer coton 1.png",
      "assets/images/Boxer coton 2.png",
      "assets/images/Boxer coton 3.png",
      "assets/images/Boxer coton 4.png",
      "assets/images/Boxer coton 5.png",
    
    ],
    description: "Lot de 3 boxers premium en nylon extensible – confort, maintien et élégance au quotidien.",
    benefits: ["Respirant et doux", "Ceinture confortable", "Tenue parfaite toute la journée"],
    colors: ["gris carreaulé noir", "beige carreaulé noir", "saumon", "marron carreaulé saumon"],
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
    price: 14900,
    oldPrice: 19000,
    promoLabel: "PROMO",
    images: [
     "assets/images/Boxer nylon1.jpeg",
     "assets/images/Boxer nylon 2.jpeg",
      "assets/images/Boxer nylon 3.jpeg",
      "assets/images/Boxer nylon 4.jpeg",
      "assets/images/Boxer nylon 5.jpeg",
      "assets/images/Boxer nylon 6.jpeg",
    ],
    description: "Nylon extensible – confort maximal et liberté de mouvement.",
    benefits: ["Stretch et léger", "Conçu pour bouger", "Séchage rapide"],
    colors: ["blanc", "marron", "blanc crème", "bleu", "bleu nuit"],
    reviews: [
      { name: "N'Guessan J.", stars: 5, text: "Top pour le sport et les longues journées." },
      { name: "Mariam C.", stars: 4, text: "Bonne matière, le confort est réel." }
    ]
  },
  {
    id: 3,
    name: "Boxer coton (Lot de 3)",
    category: "Style",
    subcategory: "Boxeurs",
    price: 14900,
    oldPrice: 15000,
    promoLabel: "PROMO",
    images: [
    "assets/images/boxer coton 1.jpeg",
    "assets/images/boxer coton 2.jpeg",
    "assets/images/boxer coton 3.jpeg",
    "assets/images/boxer coton 4.jpeg",
    "assets/images/boxer coton 5.jpeg",
    
    ],
    description: "Confort naturel premium – idéal pour le quotidien et les longues journées.",
    benefits: ["Respirant et doux", "Ceinture confortable", "Tenue parfaite toute la journée"],
    colors: ["blanc", "marron clair", "gris", "noir"],
    reviews: [
      { name: "Cissé.b", stars: 5, text: "Livraison rapide et produit conforme. Je recommande." }
    ]
  },
  {
    id: 4,
    name: "Balerines brillantes en strass",
    category: "Style",
    subcategory: "Chaussures",
    price: 16500,
    images: [
      "assets/images/Sandales 1.jpeg",
      "assets/images/Sandales 2.jpeg",
      "assets/images/Sandales 3.jpeg",
      "assets/images/Sandales 4.jpeg",
    
    ],
    description: "Ballerines brillantes en strass.",
    benefits: ["Matiere solide", "brillances intense", "Confort assuré"],
    colors: ["noir", "bleu", "beige"],
    colorImageMap: [1, 3, 2],
    colorSelectionMax: 1,
    autoFillColorsToMax: false,
    reviews: [
      { name: "Théo R.", stars: 5, text: "Classique et intemporel. Excellent investissement." }
    ]
  },
  {
    id: 5,
    name: "Sandales en strass",
    category: "Style",
    subcategory: "Écouteurs",
    price: 17500,
    oldPrice: 20000,
    promoLabel: "PROMO",
    images: [
      "assets/images/S1.jpeg",
      "assets/images/S2.jpeg",
      "assets/images/S3.jpeg",
     
    ],
    description:"Sandales décontracté en strass pour femmes",
    benefits: ["Design élégant, confortable pour le quotidien"],
    reviews: [
    
    ]
  },
 
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
