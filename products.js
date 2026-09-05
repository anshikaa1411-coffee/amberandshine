// ==========================================================================
// AMBER & SHINE (MIA BY TANISHQ INSPIRED) - PRODUCT CATALOG & DATA
// ==========================================================================

const CATEGORIES_DATA = [
  {
    id: "rings",
    name: "Rings",
    count: "42+ Designs",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=85",
    filterKey: "Rings"
  },
  {
    id: "earrings",
    name: "Earrings",
    count: "68+ Designs",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=85",
    filterKey: "Earrings"
  },
  {
    id: "pendants",
    name: "Pendants",
    count: "35+ Designs",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=85",
    filterKey: "Pendants"
  },
  {
    id: "bracelets",
    name: "Bracelets & Bangles",
    count: "29+ Designs",
    image: "https://images.unsplash.com/photo-1611591475850-2c351be8c5bc?auto=format&fit=crop&w=400&q=85",
    filterKey: "Bracelets"
  },
  {
    id: "necklaces",
    name: "Necklaces & Chains",
    count: "24+ Designs",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=85",
    filterKey: "Necklaces"
  },
  {
    id: "mangalsutras",
    name: "Modern Mangalsutras",
    count: "18+ Designs",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=85",
    filterKey: "Mangalsutras"
  }
];

const BUDGET_TIERS = [
  { id: "all", label: "All Budgets", range: [0, 999999] },
  { id: "under-15k", label: "Under ₹15,000", range: [0, 15000] },
  { id: "15k-30k", label: "₹15,000 - ₹30,000", range: [15000, 30000] },
  { id: "30k-50k", label: "₹30,000 - ₹50,000", range: [30000, 50000] },
  { id: "above-50k", label: "Above ₹50,000", range: [50000, 999999] }
];

const HERO_BANNERS = [
  {
    id: "hero-1",
    tag: "FESTIVE CAPSULE 2026",
    headline: "Vibe with 14KT & 18KT Everyday Fine Gold",
    subhead: "Lightweight statement jewels crafted for modern workwear, coffee runs & twilight dinners.",
    offer: "FLAT 20% OFF ON MAKING CHARGES | USE CODE: SHINE20",
    ctaText: "EXPLORE NEW ARRIVALS",
    ctaLink: "new",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1800&q=85",
    theme: "amber"
  },
  {
    id: "hero-2",
    tag: "DIAMOND DREAMS",
    headline: "Sparkle Every Single Day. No Occasion Needed.",
    subhead: "Natural & certified lab diamonds handset in buttery solid gold with BIS 916 Hallmark guarantee.",
    offer: "STARTING AT JUST ₹9,999 | COMPLIMENTARY INSURED COURIER",
    ctaText: "SHOP DIAMOND EDIT",
    ctaLink: "Diamonds",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1800&q=85",
    theme: "gold"
  },
  {
    id: "hero-3",
    tag: "MODERN GIFTING",
    headline: "Gift Smart. Gift Amber & Shine.",
    subhead: "Curated celebration gifts packaged in signature coral & gold keepsake velvet gift boxes.",
    offer: "GET ₹1,000 OFF ON YOUR FIRST ORDER | CODE: SHINE1000",
    ctaText: "DISCOVER GIFT GUIDE",
    ctaLink: "Gifting",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85",
    theme: "rose"
  }
];

const PRODUCTS_DATA = [
  {
    id: "as-001",
    name: "Dainty Twinkle Diamond Solitaire Ring",
    karatage: "14KT Yellow Gold",
    category: "Rings",
    collection: "Everyday Sparkle",
    price: 13800,
    originalPrice: 15500,
    badge: "14KT GOLD",
    isNew: false,
    isBestseller: true,
    isTrending: true,
    rating: 4.9,
    reviewsCount: 84,
    description: "An everyday signature that whispers quiet elegance. Crafted in BIS Hallmarked 14KT solid yellow gold with a prong-set brilliant cultivated diamond (0.12 ct, VVS clarity). Designed to comfortably glide on your finger from 9 AM meetings to evening cocktails.",
    details: [
      "14KT Solid Yellow Gold (BIS Hallmarked)",
      "Set with 0.12 ct VVS-GH certified diamond",
      "Band width: 1.3mm featherweight comfort fit",
      "Gross weight: 1.62 grams",
      "Comes with Certificate of Authenticity & Purity Guarantee"
    ],
    specs: {
      metal: "14KT Yellow Gold",
      stone: "Cultivated Diamond (VVS Clarity, GH Color)",
      caratWeight: "0.12 ctw",
      weight: "1.62 g",
      origin: "Mumbai Precision Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["US 5 / IN 10", "US 6 / IN 12", "US 7 / IN 14", "US 8 / IN 16"],
    metals: ["14KT Yellow Gold", "14KT Rose Gold", "14KT White Gold"],
    inStock: true,
    occasion: "Workwear"
  },
  {
    id: "as-002",
    name: "Lustre Dewdrop Baroque Pearl Studs",
    karatage: "18KT Yellow Gold",
    category: "Earrings",
    collection: "Pearl Mood",
    price: 18400,
    originalPrice: 21000,
    badge: "BESTSELLER",
    isNew: false,
    isBestseller: true,
    isTrending: true,
    rating: 5.0,
    reviewsCount: 63,
    description: "Modern organic charm for the contemporary woman. Handpicked AA+ lustrous freshwater baroque pearls crowned with 18KT gold cup bezels and secure screw-back posts for worry-free all-day wear.",
    details: [
      "18KT Solid Yellow Gold posts and settings (Hallmarked)",
      "Natural organic freshwater baroque pearls (9-10mm)",
      "Gross weight: 2.85 grams per pair",
      "Hypoallergenic, 100% nickel-free alloy",
      "Supplied in velvet travel pouch with lifetime cleaning warranty"
    ],
    specs: {
      metal: "18KT Solid Gold",
      stone: "Freshwater Cultured Pearls",
      caratWeight: "N/A (Lustrous Nacre)",
      weight: "2.85 g",
      origin: "Jaipur & Mumbai"
    },
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["One Size"],
    metals: ["18KT Yellow Gold", "18KT Rose Gold"],
    inStock: true,
    occasion: "Daily Minimal"
  },
  {
    id: "as-003",
    name: "Aura Solitaire Diamond Pendant & Chain",
    karatage: "14KT Yellow Gold",
    category: "Pendants",
    collection: "Everyday Sparkle",
    price: 19500,
    originalPrice: 22800,
    badge: "14KT DIAMOND",
    isNew: true,
    isBestseller: true,
    isTrending: true,
    rating: 4.9,
    reviewsCount: 52,
    description: "A luminous drop of pure sunlight. A single 0.18 carat brilliant-cut diamond is encased in a low-profile geometric bezel, suspended on an Italian diamond-cut cable chain with dual adjustment loops.",
    details: [
      "14KT BIS Hallmarked Solid Gold",
      "0.18 ct round brilliant diamond (F-G color, VVS clarity)",
      "16-18 inch adjustable diamond-cut cable chain included",
      "Gross weight: 2.10 grams",
      "Laser-engraved with Amber & Shine hallmark"
    ],
    specs: {
      metal: "14KT Yellow Gold",
      stone: "Cultivated Diamond (0.18 ct VVS)",
      caratWeight: "0.18 ctw",
      weight: "2.10 g",
      origin: "Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["16-18\" Adjustable"],
    metals: ["14KT Yellow Gold", "14KT Rose Gold", "14KT White Gold"],
    inStock: true,
    occasion: "Workwear"
  },
  {
    id: "as-004",
    name: "Modern Flora Diamond Mangalsutra",
    karatage: "18KT Yellow Gold",
    category: "Mangalsutras",
    collection: "Modern Roots",
    price: 32500,
    originalPrice: 36000,
    badge: "TRENDING",
    isNew: true,
    isBestseller: false,
    isTrending: true,
    rating: 5.0,
    reviewsCount: 39,
    description: "Reimagined for the millennial & Gen-Z bride. Features a petite floral cluster of 7 sparkling diamonds flanked by minimal black spinel beads on a whisper-fine 18KT gold chain that layers effortlessly with daily necklaces.",
    details: [
      "18KT Solid Yellow Gold (BIS Hallmarked)",
      "0.24 ct round brilliant certified diamonds",
      "High-grade natural faceted black spinel micro-beads",
      "Adjustable length: 16, 17, and 18 inches",
      "Featherlight 3.1 grams — built for sleep, work & workouts"
    ],
    specs: {
      metal: "18KT Yellow Gold",
      stone: "Cultivated Diamonds & Spinel Beads",
      caratWeight: "0.24 ctw",
      weight: "3.10 g",
      origin: "Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["16-18\" Adjustable"],
    metals: ["18KT Yellow Gold"],
    inStock: true,
    occasion: "Festive & Gifting"
  },
  {
    id: "as-005",
    name: "Celestial Moon & Star Diamond Huggies",
    karatage: "14KT Rose Gold",
    category: "Earrings",
    collection: "Everyday Sparkle",
    price: 16900,
    originalPrice: 19500,
    badge: "14KT ROSE GOLD",
    isNew: true,
    isBestseller: false,
    isTrending: true,
    rating: 4.8,
    reviewsCount: 47,
    description: "Whimsical asymmetric mini huggie hoops with micro-pavé diamonds. One earring features a shimmering crescent moon; the other a radiant north star. Click-lock clasp ensures secure everyday wear.",
    details: [
      "14KT Solid Rose Gold with BIS stamp",
      "14 hand-set diamonds totaling 0.15 ctw",
      "Diameter: 10.5mm huggie fit",
      "Featherweight: 2.15 grams total weight",
      "Perfect for first, second, or cartilage piercings"
    ],
    specs: {
      metal: "14KT Rose Gold",
      stone: "Cultivated Diamonds (VVS-GH)",
      caratWeight: "0.15 ctw",
      weight: "2.15 g",
      origin: "Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["One Size"],
    metals: ["14KT Rose Gold", "14KT Yellow Gold", "14KT White Gold"],
    inStock: true,
    occasion: "Party"
  },
  {
    id: "as-006",
    name: "Liquid Gold Sleek Herringbone Chain",
    karatage: "18KT Yellow Gold",
    category: "Necklaces",
    collection: "Gold Basics",
    price: 28900,
    originalPrice: 32000,
    badge: "BESTSELLER",
    isNew: false,
    isBestseller: true,
    isTrending: true,
    rating: 4.9,
    reviewsCount: 112,
    description: "The viral fluid gold chain that mirrors your movement. Made of silky interlocking flat links in 18KT solid gold that drape effortlessly across the collarbone like molten amber light.",
    details: [
      "Solid 18KT Italian Yellow Gold flat weave",
      "Width: 2.6mm for sleek, comfortable daily layering",
      "Length: 16 inches + 2-inch extension links",
      "Custom lobster clasp with Amber & Shine stamped tag",
      "Anti-snag rounded smooth edges"
    ],
    specs: {
      metal: "18KT Yellow Gold",
      stone: "None (Pure Solid Gold)",
      caratWeight: "N/A",
      weight: "5.40 g",
      origin: "Arezzo, Italy & Mumbai"
    },
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["16\" + 2\" Extension"],
    metals: ["18KT Yellow Gold", "18KT Rose Gold"],
    inStock: true,
    occasion: "Workwear"
  },
  {
    id: "as-007",
    name: "Petite Evil Eye Charm Gold Bracelet",
    karatage: "14KT Yellow Gold",
    category: "Bracelets",
    collection: "Protective Talismans",
    price: 11500,
    originalPrice: 13200,
    badge: "UNDER ₹15K",
    isNew: true,
    isBestseller: false,
    isTrending: true,
    rating: 4.9,
    reviewsCount: 71,
    description: "A modern lucky charm for everyday positivity. Crafted in 14KT solid yellow gold with hand-enamelled turquoise & deep navy evil eye motif, accented with a natural diamond center.",
    details: [
      "14KT Solid Gold BIS Hallmarked",
      "Single brilliant diamond center (0.02 ct)",
      "High-durability baked glass ceramic enamel",
      "Adjustable link closure fits wrists from 6.0 to 7.5 inches",
      "Gross weight: 1.85 grams"
    ],
    specs: {
      metal: "14KT Yellow Gold",
      stone: "Diamond (0.02 ct) & Ceramic Enamel",
      caratWeight: "0.02 ctw",
      weight: "1.85 g",
      origin: "Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1611591475850-2c351be8c5bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["6.0\" - 7.5\" Adjustable"],
    metals: ["14KT Yellow Gold", "14KT Rose Gold"],
    inStock: true,
    occasion: "Daily Minimal"
  },
  {
    id: "as-008",
    name: "Solstice Pavé Eternity Diamond Ring",
    karatage: "18KT Yellow Gold",
    category: "Rings",
    collection: "Everyday Sparkle",
    price: 34500,
    originalPrice: 38500,
    badge: "18KT DIAMOND",
    isNew: false,
    isBestseller: true,
    isTrending: true,
    rating: 5.0,
    reviewsCount: 96,
    description: "The quintessential stacker. An uninterrupted ribbon of 21 cultivated brilliant diamonds (0.35 ct total weight, VVS-GH) in 18KT solid gold. Low profile setting won't catch on knits or silk.",
    details: [
      "18KT Solid Yellow Gold (Hallmarked)",
      "21 round brilliant diamonds (0.35 ctw, VVS clarity)",
      "Band width: 1.6mm comfort fit interior",
      "Gross weight: 2.45 grams",
      "Complimentary laser engraving available"
    ],
    specs: {
      metal: "18KT Yellow Gold",
      stone: "Cultivated Diamonds (0.35 ctw VVS)",
      caratWeight: "0.35 ctw",
      weight: "2.45 g",
      origin: "Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["US 5 / IN 10", "US 6 / IN 12", "US 7 / IN 14", "US 8 / IN 16"],
    metals: ["18KT Yellow Gold", "18KT Rose Gold", "18KT White Gold"],
    inStock: true,
    occasion: "Festive & Gifting"
  }
];
