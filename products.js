// ==========================================
// AMBER & SHINE FINE JEWELLERY - PRODUCT CATALOG
// ==========================================

const PRODUCTS_DATA = [
  {
    id: "aur-001",
    name: "Solstice Diamond Pavé Ring",
    subtitle: "18K Solid Yellow Gold with Hand-Selected VVS Diamonds",
    category: "Rings",
    collection: "Everyday Gold",
    price: 34500,
    originalPrice: 38000,
    badge: "Bestseller",
    isNew: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 54,
    description: "An ode to radiant celestial symmetry. The Solstice Ring features a delicate band of 100% recycled 18K solid yellow gold set with an unbroken arc of brilliant pavé lab-grown diamonds (0.35 ct total weight, F-G color, VVS clarity). Designed for effortless stacking or a standalone whisper of refinement.",
    details: [
      "Crafted in 18K Recycled Solid Yellow Gold (Hallmarked)",
      "Set with 21 ethically cultivated round brilliant diamonds (0.35 ctw)",
      "Band width: 1.6mm delicate comfort-fit silhouette",
      "Hand-polished mirror finish by master atelier artisans",
      "Laser-engraved with the AMBER & SHINE hallmark and purity stamp"
    ],
    specs: {
      metal: "18K Solid Gold",
      stone: "Cultivated Diamonds (VVS Clarity, F-G Color)",
      caratWeight: "0.35 ctw",
      dimensions: "Band width: 1.6mm",
      origin: "Handcrafted in Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["US 5 / IN 10", "US 6 / IN 12", "US 7 / IN 14", "US 8 / IN 16"],
    metals: ["18K Yellow Gold", "18K Rose Gold", "18K White Gold"],
    inStock: true
  },
  {
    id: "aur-002",
    name: "Lumière Baroque Pearl Drop Earrings",
    subtitle: "Organic Freshwater Pearls & 18K Solid Gold Clasps",
    category: "Earrings",
    collection: "Pearl Stories",
    price: 22800,
    originalPrice: null,
    badge: "New Arrival",
    isNew: true,
    isBestseller: false,
    rating: 5.0,
    reviewsCount: 38,
    description: "Celebrating nature’s poetic irregularities. Each earring features a hand-selected, organically contoured freshwater baroque pearl suspended beneath a hand-hammered 18K gold huggie hoop. No two pearls are ever identical, making your pair uniquely yours.",
    details: [
      "Natural AA+ graded luster organic freshwater baroque pearls (12-14mm)",
      "18K Solid Gold click-latch huggie hoops (11mm diameter)",
      "Featherweight design: only 3.8 grams per earring for all-day wear",
      "Hypoallergenic and 100% nickel-free",
      "Supplied with protective micro-suede travel pouch"
    ],
    specs: {
      metal: "18K Solid Gold",
      stone: "Natural Freshwater Baroque Pearls",
      caratWeight: "N/A (Lustrous organic nacre)",
      dimensions: "Drop length: 32mm",
      origin: "Hand-strung in Jaipur"
    },
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["One Size"],
    metals: ["18K Yellow Gold", "18K White Gold"],
    inStock: true
  },
  {
    id: "aur-003",
    name: "Amber & Shine Heirloom Herringbone Chain",
    subtitle: "Liquid-Silk 18K Yellow Gold Fluid Weave",
    category: "Necklaces",
    collection: "Everyday Gold",
    price: 48000,
    originalPrice: 52000,
    badge: "Bestseller",
    isNew: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 76,
    description: "The quintessential foundation of luxury neckline curation. Our Heirloom Herringbone Chain is meticulously woven with flat, interlocking links that catch ambient light like molten liquid gold. Lies flat against the collarbone with fluid drape.",
    details: [
      "Solid 18K Italian Yellow Gold weave",
      "Width: 3.2mm for sophisticated visibility",
      "Adjustable length: 16 inches + 2-inch extender chain",
      "Custom oversized lobster clasp with AMBER & SHINE engraved charm",
      "Anti-tarnish protective molecular ceramic coating"
    ],
    specs: {
      metal: "18K Solid Gold",
      stone: "None (Solid Metal)",
      caratWeight: "11.4 grams 18K Gold",
      dimensions: "16\" + 2\" extender, 3.2mm width",
      origin: "Arezzo, Italy & Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["16 inch (Standard)", "18 inch (Drape)"],
    metals: ["18K Yellow Gold", "18K Rose Gold", "18K White Gold"],
    inStock: true
  },
  {
    id: "aur-004",
    name: "Sculptural Élan Cuff Bracelet",
    subtitle: "Heavyweight 18K Gold Ribbon Architecture",
    category: "Bracelets",
    collection: "Statement Pieces",
    price: 68500,
    originalPrice: null,
    badge: "Limited Edition",
    isNew: false,
    isBestseller: true,
    rating: 5.0,
    reviewsCount: 29,
    description: "A wearable sculpture born from modernist architectural forms. Crafted from substantial 18K solid yellow gold with undulating, tapered curves that contour the wrist. The satin brushed interior contrasts against the mirror-polished exterior edge.",
    details: [
      "Heavyweight 18K Recycled Solid Gold construction",
      "Width tapers from 14mm to 8mm for anatomical comfort",
      "Open-cuff hinge-free slip design with gentle malleability",
      "Signed & individually numbered limited edition of 150 pieces",
      "Includes Certificate of Authenticity and insurance appraisal"
    ],
    specs: {
      metal: "18K Solid Gold",
      stone: "None (Solid Metal)",
      caratWeight: "16.8 grams pure 18K gold",
      dimensions: "Inner diameter: 58mm (Medium)",
      origin: "Hand-forged in Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1611591475850-2c351be8c5bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["Small (54mm)", "Medium (58mm)", "Large (62mm)"],
    metals: ["18K Yellow Gold", "18K Rose Gold"],
    inStock: true
  },
  {
    id: "aur-005",
    name: "Celestial Petite Diamond Pendant",
    subtitle: "Single Bezel-Set Solitaire on Diamond-Cut Chain",
    category: "Necklaces",
    collection: "Everyday Gold",
    price: 29500,
    originalPrice: null,
    badge: "New Arrival",
    isNew: true,
    isBestseller: false,
    rating: 4.8,
    reviewsCount: 41,
    description: "An everyday talisman of incandescent light. A 0.25 carat round brilliant lab diamond is cradled in an ultra-low-profile minimal bezel of 18K gold, threaded seamlessly onto a whisper-fine diamond-cut cable chain.",
    details: [
      "0.25 carat round brilliant cultivated diamond (E Color, VVS1 Clarity)",
      "18K Solid Gold minimal rub-over bezel setting",
      "16-18 inch adjustable diamond-cut cable chain",
      "Spring ring clasp with security tag",
      "Conflict-free certified with laser inscription"
    ],
    specs: {
      metal: "18K Solid Gold",
      stone: "Cultivated Diamond (VVS1 Clarity, E Color)",
      caratWeight: "0.25 ctw",
      dimensions: "Pendant: 4.5mm diameter",
      origin: "Handcrafted in Mumbai"
    },
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["16-18\" Adjustable"],
    metals: ["18K Yellow Gold", "18K White Gold", "18K Rose Gold"],
    inStock: true
  },
  {
    id: "aur-006",
    name: "Opulence Tennis Diamond Bracelet",
    subtitle: "Endless Line of Four-Prong Set VVS Diamonds",
    category: "Bracelets",
    collection: "Statement Pieces",
    price: 98000,
    originalPrice: 110000,
    badge: "Bestseller",
    isNew: false,
    isBestseller: true,
    rating: 5.0,
    reviewsCount: 62,
    description: "The ultimate timeless luxury investment. Hand-assembled with 58 calibrated round brilliant lab diamonds totaling 2.50 carats in solid 18K gold. Fitted with our double-locking hidden box clasp for effortless security during gala evenings and daily milestones alike.",
    details: [
      "2.50 carats total diamond weight (F color, VS+ clarity)",
      "Solid 18K Gold classical 4-prong low-basket mounts",
      "Length: 7 inches (Standard luxury wrist drape)",
      "Double-safety clasp mechanism prevents accidental opening",
      "IGI Certified diamond certificate included"
    ],
    specs: {
      metal: "18K Solid Gold",
      stone: "Calibrated Lab Diamonds (VS+ Clarity, F Color)",
      caratWeight: "2.50 ctw",
      dimensions: "Length: 7 inches, Width: 2.4mm",
      origin: "Crafted in Surat & Mumbai Ateliers"
    },
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1611591475850-2c351be8c5bc?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["6.5 inch (Petite)", "7.0 inch (Standard)", "7.5 inch (Relaxed)"],
    metals: ["18K White Gold", "18K Yellow Gold"],
    inStock: true
  },
  {
    id: "aur-007",
    name: "Aura Freshwater Pearl Choker",
    subtitle: "Graduated Hand-Knotted Pearls with Gold Clasp",
    category: "Necklaces",
    collection: "Pearl Stories",
    price: 36000,
    originalPrice: null,
    badge: "New Arrival",
    isNew: true,
    isBestseller: false,
    rating: 4.9,
    reviewsCount: 22,
    description: "A contemporary renaissance of the traditional pearl strand. Hand-strung on pure silk thread with individual knots between each AA+ freshwater pearl to protect their delicate luster. Fastened with our signature sculptural fluted gold ball clasp.",
    details: [
      "Lustrous near-round freshwater pearls (5.5mm - 6.0mm)",
      "Hand-knotted on 100% natural champagne silk thread",
      "Solid 18K gold organic magnetic ball clasp with safety catch",
      "Length: 15.5 inches for a modern high-collarbone sitting",
      "Store flat in the provided felt rolls"
    ],
    specs: {
      metal: "18K Solid Gold Clasp",
      stone: "Freshwater Cultured Pearls",
      caratWeight: "N/A",
      dimensions: "15.5 inches length",
      origin: "Strung by artisans in Jaipur"
    },
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["15.5 inch", "17.0 inch"],
    metals: ["18K Yellow Gold"],
    inStock: true
  },
  {
    id: "aur-008",
    name: "Signet Horizon Sculptural Ring",
    subtitle: "Substantial Minimalist Statement in 18K Gold",
    category: "Rings",
    collection: "Statement Pieces",
    price: 42000,
    originalPrice: 46000,
    badge: "Editor's Pick",
    isNew: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 47,
    description: "A genderless architectural silhouette inspired by vintage signet stamps and streamlined mid-century forms. The flat oval crown is left mirror-polished for an understated reflective surface or custom monogramming.",
    details: [
      "Substantial 18K solid yellow gold (8.2 grams)",
      "Smooth curved ergonomic inner band for silky glide on the finger",
      "Top oval face measures 12mm x 9mm",
      "Complimentary hand-engraved monogram available on request",
      "Heirloom weight built to endure generations"
    ],
    specs: {
      metal: "18K Solid Gold",
      stone: "None",
      caratWeight: "8.2 grams 18K gold",
      dimensions: "Face: 12mm x 9mm",
      origin: "Mumbai Atelier"
    },
    images: [
      "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85"
    ],
    sizes: ["US 6 / IN 12", "US 7 / IN 14", "US 8 / IN 16", "US 9 / IN 18", "US 10 / IN 20"],
    metals: ["18K Yellow Gold", "18K Rose Gold", "18K White Gold"],
    inStock: true
  }
];

const COLLECTIONS_DATA = [
  {
    id: "everyday-gold",
    title: "Everyday Gold",
    subtitle: "Effortless, stackable heirlooms in 18K solid gold, crafted for daily rituals.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85",
    linkText: "EXPLORE THE COLLECTION"
  },
  {
    id: "pearl-stories",
    title: "Pearl Stories",
    subtitle: "Luminous baroque and freshwater pearls harmonized with warm champagne gold.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85",
    linkText: "DISCOVER PEARLS"
  },
  {
    id: "statement-pieces",
    title: "Statement Pieces",
    subtitle: "Bold, sculptural silhouettes engineered to command quiet reverence.",
    image: "https://images.unsplash.com/photo-1611591475850-2c351be8c5bc?auto=format&fit=crop&w=1200&q=85",
    linkText: "VIEW STATEMENTS"
  }
];

const REVIEWS_DATA = [
  {
    author: "Ananya M.",
    location: "Mumbai",
    rating: 5,
    title: "The craftsmanship is unmatched",
    comment: "The Solstice Ring arrived in the most breathtaking ivory velvet presentation box. The weight of the 18K gold feels so substantial yet utterly weightless on the finger. Pure quiet luxury.",
    product: "Solstice Diamond Pavé Ring"
  },
  {
    author: "Devika R.",
    location: "New Delhi",
    rating: 5,
    title: "My daily signature piece",
    comment: "I have worn the Herringbone Chain continuously for 4 months now — in meetings, dinners, travel. It still shines with the same molten luster as day one. Outstanding customer care as well.",
    product: "Amber & Shine Heirloom Herringbone Chain"
  },
  {
    author: "Siddharth K.",
    location: "Bengaluru",
    rating: 5,
    title: "Bespoke gifting experience",
    comment: "Purchased the Baroque Pearl earrings as an anniversary gift. The hand-written calligraphy note and the quality of pearls exceeded every expectation. She hasn't taken them off.",
    product: "Lumière Baroque Pearl Drop Earrings"
  }
];

