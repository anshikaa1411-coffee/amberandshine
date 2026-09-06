// ==========================================================================
// AMBER & SHINE - PRODUCT CATALOG & DYNAMIC STORE DATA
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
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=400&q=85",
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
    tag: "✦ FESTIVE CAPSULE 2026 ✦",
    headline: "Vibe with Handcrafted Everyday Fine Jewels",
    subhead: "Lightweight statement jewels crafted for modern workwear, coffee runs & twilight dinners.",
    offer: "COMPLIMENTARY INSURED COURIER ON ALL ORDERS",
    ctaText: "EXPLORE NEW ARRIVALS",
    ctaLink: "new",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1800&q=85",
    position: "center center",
    theme: "amber",
    badgeLabel: "Artisan Layered Fine Jewels"
  },
  {
    id: "hero-2",
    tag: "✦ PURE RADIANCE & SOLITAIRES ✦",
    headline: "Sparkle Every Single Day. No Occasion Needed.",
    subhead: "Brilliant cultivated solitaires handset in rich precious metals with lifetime authenticity guarantee.",
    offer: "STARTING AT JUST ₹9,999 | COMPLIMENTARY INSURED COURIER",
    ctaText: "SHOP SOLITAIRES EDIT",
    ctaLink: "Solitaires",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1800&q=85",
    position: "right center",
    theme: "champagne",
    badgeLabel: "Certified Cultivated Solitaires"
  },
  {
    id: "hero-3",
    tag: "✦ MODERN ATELIER GIFTING ✦",
    headline: "Gift Smart. Gift Amber & Shine.",
    subhead: "Curated celebration gifts packaged in signature coral & champagne keepsake velvet gift boxes.",
    offer: "GET ₹1,000 OFF ON YOUR FIRST ORDER | CODE: SHINE1000",
    ctaText: "DISCOVER GIFT GUIDE",
    ctaLink: "Gifting",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=85",
    position: "right center",
    theme: "rose",
    badgeLabel: "Signature Keepsake Velvet Boxes"
  }
];

const DEFAULT_PRODUCTS_DATA = [
  {
    id: "as-001",
    name: "Dainty Twinkle Solitaire Ring",
    karatage: "Warm Amber Tone",
    category: "Rings",
    collection: "Everyday Sparkle",
    price: 13800,
    originalPrice: 15500,
    badge: "HANDCRAFTED FINE JEWEL",
    isNew: false,
    isBestseller: true,
    isTrending: true,
    rating: 4.9,
    reviewsCount: 84,
    description: "An everyday signature that whispers quiet elegance. Crafted in handcrafted solid fine metal with a prong-set brilliant cultivated solitaire (0.12 ct, VVS clarity). Designed to comfortably glide on your finger from 9 AM meetings to evening cocktails.",
    details: [
      "Hypoallergenic Waterproof Fine Metal",
      "Set with 0.12 ct VVS-GH certified brilliant stone",
      "Band width: 1.3mm featherweight comfort fit",
      "Gross weight: 1.62 grams",
      "Comes with Certificate of Authenticity & Purity Guarantee"
    ],
    specs: {
      metal: "Warm Amber Tone",
      stone: "Cultivated Solitaire (VVS Clarity, GH Color)",
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
    metals: ["Warm Amber Tone", "Rose Tone", "Silver Rhodium Tone"],
    inStock: true,
    occasion: "Workwear"
  },
  {
    id: "as-002",
    name: "Lustre Dewdrop Baroque Pearl Studs",
    karatage: "Warm Amber Tone",
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
    description: "Modern organic charm for the contemporary woman. Handpicked AA+ lustrous freshwater baroque pearls crowned with artisanal cup bezels and secure screw-back posts for worry-free all-day wear.",
    details: [
      "Artisanal Waterproof settings with secure posts",
      "Natural organic freshwater baroque pearls (9-10mm)",
      "Gross weight: 2.85 grams per pair",
      "Hypoallergenic, 100% nickel-free alloy",
      "Supplied in velvet travel pouch with lifetime cleaning warranty"
    ],
    specs: {
      metal: "Solid Fine Metal",
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
    metals: ["Warm Amber Tone", "Rose Tone"],
    inStock: true,
    occasion: "Daily Minimal"
  },
  {
    id: "as-003",
    name: "Aura Solitaire Pendant & Chain",
    karatage: "Warm Amber Tone",
    category: "Pendants",
    collection: "Everyday Sparkle",
    price: 19500,
    originalPrice: 22800,
    badge: "SIGNATURE SOLITAIRE",
    isNew: true,
    isBestseller: true,
    isTrending: true,
    rating: 4.9,
    reviewsCount: 52,
    description: "A luminous drop of pure sunlight. A single 0.18 carat brilliant solitaire is encased in a low-profile geometric bezel, suspended on an Italian precision-cut cable chain with dual adjustment loops.",
    details: [
      "Hypoallergenic Waterproof Solid Fine Metal",
      "0.18 ct round brilliant solitaire (F-G color, VVS clarity)",
      "16-18 inch adjustable precision cable chain included",
      "Gross weight: 2.10 grams",
      "Laser-engraved with Amber & Shine hallmark"
    ],
    specs: {
      metal: "Warm Amber Tone",
      stone: "Cultivated Solitaire (0.18 ct VVS)",
      caratWeight: "0.18 ctw",
      weight: "2.10 g",
      origin: "Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ['16-18" Adjustable'],
    metals: ["Warm Amber Tone", "Rose Tone", "Silver Rhodium Tone"],
    inStock: true,
    occasion: "Workwear"
  },
  {
    id: "as-004",
    name: "Modern Flora Sacred Mangalsutra",
    karatage: "Warm Amber Tone",
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
    description: "Reimagined for the contemporary bride. Features a petite floral cluster of 7 sparkling gemstones flanked by minimal black spinel beads on a whisper-fine delicate chain that layers effortlessly with daily necklaces.",
    details: [
      "Solid Fine Metal (Hallmarked)",
      "0.24 ct round brilliant certified solitaires",
      "High-grade natural faceted black spinel micro-beads",
      "Adjustable length: 16, 17, and 18 inches",
      "Featherlight 3.1 grams — built for sleep, work & workouts"
    ],
    specs: {
      metal: "Warm Amber Tone",
      stone: "Cultivated Solitaires & Spinel Beads",
      caratWeight: "0.24 ctw",
      weight: "3.10 g",
      origin: "Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ['16-18" Adjustable'],
    metals: ["Warm Amber Tone"],
    inStock: true,
    occasion: "Festive & Gifting"
  },
  {
    id: "as-005",
    name: "Celestial Moon & Star Huggies",
    karatage: "Rose Tone",
    category: "Earrings",
    collection: "Everyday Sparkle",
    price: 16900,
    originalPrice: 19500,
    badge: "ROSE TONE",
    isNew: true,
    isBestseller: false,
    isTrending: true,
    rating: 4.8,
    reviewsCount: 47,
    description: "Whimsical asymmetric mini huggie hoops with micro-pavé crystals. One earring features a shimmering crescent moon; the other a radiant north star. Click-lock clasp ensures secure everyday wear.",
    details: [
      "Artisanal Rose Finish with authentic stamp",
      "14 hand-set solitaires totaling 0.15 ctw",
      "Diameter: 10.5mm huggie fit",
      "Featherweight: 2.15 grams total weight",
      "Perfect for first, second, or cartilage piercings"
    ],
    specs: {
      metal: "Rose Tone",
      stone: "Cultivated Solitaires (VVS-GH)",
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
    metals: ["Rose Tone", "Warm Amber Tone", "Silver Rhodium Tone"],
    inStock: true,
    occasion: "Party"
  },
  {
    id: "as-006",
    name: "Liquid Sleek Herringbone Chain",
    karatage: "Warm Amber Tone",
    category: "Necklaces",
    collection: "Luxe Basics",
    price: 28900,
    originalPrice: 32000,
    badge: "BESTSELLER",
    isNew: false,
    isBestseller: true,
    isTrending: true,
    rating: 4.9,
    reviewsCount: 112,
    description: "The viral fluid chain that mirrors your movement. Made of silky interlocking flat links in solid fine metal that drape effortlessly across the collarbone like molten amber light.",
    details: [
      "Silky Italian Liquid Weave in Warm Finish",
      "Width: 2.6mm for sleek, comfortable daily layering",
      "Length: 16 inches + 2-inch extension links",
      "Custom lobster clasp with Amber & Shine stamped tag",
      "Anti-snag rounded smooth edges"
    ],
    specs: {
      metal: "Warm Amber Tone",
      stone: "None (Pure Solid Precious Metal)",
      caratWeight: "N/A",
      weight: "5.40 g",
      origin: "Arezzo, Italy & Mumbai"
    },
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ['16" + 2" Extension'],
    metals: ["Warm Amber Tone", "Rose Tone"],
    inStock: true,
    occasion: "Workwear"
  },
  {
    id: "as-007",
    name: "Petite Evil Eye Charm Bracelet",
    karatage: "Warm Amber Tone",
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
    description: "A modern lucky charm for everyday positivity. Crafted in solid fine metal with hand-enamelled turquoise & deep navy evil eye motif, accented with a natural solitaire center.",
    details: [
      "Hypoallergenic Waterproof Fine Metal",
      "Single brilliant solitaire center (0.02 ct)",
      "High-durability baked glass ceramic enamel",
      "Adjustable link closure fits wrists from 6.0 to 7.5 inches",
      "Gross weight: 1.85 grams"
    ],
    specs: {
      metal: "Warm Amber Tone",
      stone: "Solitaire (0.02 ct) & Ceramic Enamel",
      caratWeight: "0.02 ctw",
      weight: "1.85 g",
      origin: "Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1611591475850-2c351be8c5bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ['6.0" - 7.5" Adjustable'],
    metals: ["Warm Amber Tone", "Rose Tone"],
    inStock: true,
    occasion: "Daily Minimal"
  },
  {
    id: "as-008",
    name: "Solstice Pavé Eternity Ring",
    karatage: "Warm Amber Tone",
    category: "Rings",
    collection: "Everyday Sparkle",
    price: 34500,
    originalPrice: 38500,
    badge: "BRILLIANT SOLITAIRE",
    isNew: false,
    isBestseller: true,
    isTrending: true,
    rating: 5.0,
    reviewsCount: 96,
    description: "The quintessential stacker. An uninterrupted ribbon of 21 cultivated brilliant solitaires (0.35 ct total weight, VVS-GH) in solid fine metal. Low profile setting won't catch on knits or silk.",
    details: [
      "Solid Fine Metal (Hallmarked)",
      "21 round brilliant solitaires (0.35 ctw, VVS clarity)",
      "Band width: 1.6mm comfort fit interior",
      "Gross weight: 2.45 grams",
      "Complimentary laser engraving available"
    ],
    specs: {
      metal: "Warm Amber Tone",
      stone: "Cultivated Solitaires (0.35 ctw VVS)",
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
    metals: ["Warm Amber Tone", "Rose Tone", "Silver Rhodium Tone"],
    inStock: true,
    occasion: "Festive & Gifting"
  }
];

// ==========================================================================
// DYNAMIC STORAGE & ADMIN PRODUCT MANAGEMENT
// ==========================================================================

const PRODUCTS_STORAGE_KEY = "ambershine_catalog_v5";

function getStoredProducts() {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(p => {
          const defaultItem = DEFAULT_PRODUCTS_DATA.find(d => d.id === p.id) || {};
          const badgeUpper = (p.badge || defaultItem.badge || "").toUpperCase();
          const isBestseller = (p.isBestseller !== undefined)
            ? p.isBestseller
            : (defaultItem.isBestseller ?? (badgeUpper.includes("BESTSELLER") || ["as-001", "as-002", "as-003", "as-006", "as-008"].includes(p.id)));
          const isNew = (p.isNew !== undefined)
            ? p.isNew
            : (defaultItem.isNew ?? (badgeUpper.includes("NEW") || badgeUpper.includes("ARRIVAL") || ["as-003", "as-004", "as-005", "as-007"].includes(p.id)));
          const isTrending = (p.isTrending !== undefined)
            ? p.isTrending
            : (defaultItem.isTrending ?? (badgeUpper.includes("TRENDING") || isBestseller || true));

          return {
            ...defaultItem,
            ...p,
            isBestseller: Boolean(isBestseller),
            isNew: Boolean(isNew),
            isTrending: Boolean(isTrending),
            originalPrice: Number(p.originalPrice || p.original_price || defaultItem.originalPrice || p.price),
            karatage: p.karatage || p.material || defaultItem.karatage || "Warm Amber Tone",
            rating: Number(p.rating || defaultItem.rating || 4.9),
            reviewsCount: Number(p.reviewsCount || defaultItem.reviewsCount || 48)
          };
        });
      }
    }
  } catch (err) {
    console.error("Error reading stored catalog:", err);
  }
  return [...DEFAULT_PRODUCTS_DATA];
}

function saveStoredProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.PRODUCTS_DATA = products;
  } catch (err) {
    console.error("Error saving catalog:", err);
  }
}

function resetStoredProducts() {
  try {
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  } catch (err) {}
  window.PRODUCTS_DATA = [...DEFAULT_PRODUCTS_DATA];
  return window.PRODUCTS_DATA;
}

// Initialize global catalog
let PRODUCTS_DATA = getStoredProducts();
window.PRODUCTS_DATA = PRODUCTS_DATA;

async function fetchLiveCatalog() {
  try {
    const apiBase = (typeof window !== "undefined" && (window.location.protocol === "file:" || !window.location.origin.includes(":8000")))
      ? "http://127.0.0.1:8000"
      : "";
    const res = await fetch(`${apiBase}/api/products`);
    if (res.ok) {
      const data = await res.json();
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        const merged = data.products.map(p => {
          const defaultItem = DEFAULT_PRODUCTS_DATA.find(d => d.id === p.id) || {};
          const badgeUpper = (p.badge || defaultItem.badge || "").toUpperCase();
          const isBestseller = (p.isBestseller !== undefined)
            ? p.isBestseller
            : (defaultItem.isBestseller ?? (badgeUpper.includes("BESTSELLER") || ["as-001", "as-002", "as-003", "as-006", "as-008"].includes(p.id)));
          const isNew = (p.isNew !== undefined)
            ? p.isNew
            : (defaultItem.isNew ?? (badgeUpper.includes("NEW") || badgeUpper.includes("ARRIVAL") || ["as-003", "as-004", "as-005", "as-007"].includes(p.id)));
          const isTrending = (p.isTrending !== undefined)
            ? p.isTrending
            : (defaultItem.isTrending ?? (badgeUpper.includes("TRENDING") || isBestseller || true));

          return {
            ...defaultItem,
            ...p,
            isBestseller: Boolean(isBestseller),
            isNew: Boolean(isNew),
            isTrending: Boolean(isTrending),
            originalPrice: Number(p.originalPrice || p.original_price || defaultItem.originalPrice || p.price),
            karatage: p.karatage || p.material || defaultItem.karatage || "Warm Amber Tone",
            rating: Number(p.rating || defaultItem.rating || 4.9),
            reviewsCount: Number(p.reviewsCount || defaultItem.reviewsCount || 48)
          };
        });
        PRODUCTS_DATA = merged;
        window.PRODUCTS_DATA = PRODUCTS_DATA;
        saveStoredProducts(PRODUCTS_DATA);
        window.dispatchEvent(new CustomEvent("ambershine:catalog-loaded", { detail: PRODUCTS_DATA }));
        return PRODUCTS_DATA;
      }
    }
  } catch (err) {
    // Falls back seamlessly to offline catalog
  }
  return PRODUCTS_DATA;
}
if (typeof window !== "undefined") {
  fetchLiveCatalog();
}
