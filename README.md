# AMBER & SHINE — Haute Joaillerie & Fine Modern Jewellery

A premium, editorial e-commerce experience crafted for a luxury modern fine jewellery brand.

---

## ✨ Visual Identity & Design Direction

- **Editorial Palette**: Warm ivory canvas (`#FAF8F5`), champagne gold accents (`#C5A880`), soft beige & muted taupe secondary tones (`#EFECE6`, `#E6E1D8`), and deep charcoal text (`#1C1B1A`).
- **Typography Pairing**: *Cormorant Garamond* (sophisticated, high-contrast serif for headings) paired with *Plus Jakarta Sans* (crisp, modern sans-serif for UI & body text).
- **Aesthetic Principles**: Magazine-style layout with generous whitespace, hairline borders (`1px solid rgba(28,27,26,0.08)`), subtle micro-shadows, and smooth transitions.
- **Atmosphere**: Designed to feel like a high-end luxury fashion editorial first (reminiscent of Vogue, Cartier, and modern ateliers) and an e-commerce platform second.

---

## 💎 Features & Architecture

### 1. Header & Navigation
- **Announcement Bar**: *"Complimentary insured shipping on all orders above ₹5,000 across India"* with champagne gold asterisk emblem.
- **Sticky Translucent Header**: Glassmorphic blur (`backdrop-filter: blur(14px)`) and subtle elevation on scroll.
- **Refined Branding**: Minimalist wordmark `AMBER & SHINE · Fine Jewellery`.
- **Navigation**: Instant seamless transitions between **Home**, **New Arrivals**, **All Jewellery**, **Collections**, **Bestsellers**, and **About**.
- **Interactive Badges**: Real-time counter badges on the Wishlist and Shopping Bag icons.

### 2. Homepage Sections
- **Cinematic Hero**: Immersive high-fashion jewellery editorial imagery, headline *"Jewellery that tells your story"*, supporting copy, dual CTAs (`SHOP COLLECTION` & `EXPLORE`), and micro atelier pillars.
- **Curated Collections**: Large editorial cards showcasing *Everyday Gold*, *Pearl Stories*, and *Statement Pieces*.
- **New Arrivals Grid**: 4 curated pieces with dual-image hover transitions, quick add overlay, and wishlist heart toggles.
- **Full-Width Storytelling**: Split editorial layout showing jewellery styled on a model, craftsmanship philosophy, and atelier signature.
- **Bestsellers Grid**: Highlighting signature pieces like the Solstice Diamond Ring and Herringbone Chain.
- **"Made to be Remembered" Pillars**: Handcrafted, Responsibly Sourced (100% recycled 18K gold & cultivated diamonds), and Lifetime Care.
- **Instagram Visual Gallery**: 5-column editorial aesthetic grid linking to `@amberandshine`.
- **Private Salon Newsletter**: Minimalist email input with *"A little luxury, in your inbox"*.

### 3. Product Cards
- Large, clean high-resolution product photography.
- **Dual Image Swap**: Smooth cross-fade to a worn-on-model or alternative angle on hover.
- **Quick Add**: Floating button overlay that adds items to the bag in one click.
- **Wishlist Heart**: Instant toggle with animated feedback and persistence.
- Formatted Indian Rupee pricing (`₹`).

### 4. Dedicated Product Detail Page (PDP)
- **Interactive Multi-Angle Gallery**: Main photo viewer with click-to-view thumbnails and smooth hover zoom inspection.
- **Options Customizer**:
  - **Metal Selector**: 18K Yellow Gold, Rose Gold, White Gold with visual color swatches.
  - **Size Selector**: Dynamic size pills + interactive modal **Size Guide** with international conversion charts.
  - **Quantity Stepper**: Precise increment/decrement controls.
- **Delivery Pincode Checker**: Interactive Indian postal code verification with realistic estimated arrival dates and courier details (e.g. BlueDart Apex Vault Courier).
- **Editorial Accordions**:
  1. *Details & Specifications* (Dimensions, Hallmarking, Metal weight, Gemstone clarity)
  2. *Complimentary Shipping & 30-Day Returns*
  3. *Lifetime Care Guide & Signature Velvet Packaging*
- **"You May Also Like" Grid**: Curated recommendations based on the active piece.

### 5. Shopping Bag Drawer & Wishlist Drawer
- **Cart Drawer**:
  - Slide-out drawer with backdrop blur.
  - Dynamic **Free Shipping Progress Bar** recalculating toward the ₹5,000 threshold in real time.
  - Item list with metal, size, unit price, quantity controls, and removal.
  - Subtotal calculator with mock secure checkout flow.
- **Wishlist Drawer**: Displays favorited items with an instant **Move to Bag** action.

### 6. Live Search Modal
- Instant debounced search filtering by jewel name, collection, category, or description.
- Quick-filter trending hashtags (`#SolsticeRing`, `#BaroquePearls`, `#TennisBracelet`, `#HerringboneChain`, `#ÉlanCuff`).

---

## 📂 Project Structure (Flat — No Subfolders)

```
hi/
├── index.html         # Main HTML5 page with all editorial views, drawers, and modals
├── styles.css         # Complete luxury editorial design system & responsive styling
├── app.js             # Consolidated products catalog, reactive cart/wishlist store, and app logic
└── README.md          # Project documentation
```

---

## 🚀 How to Launch and Preview

Simply double-click or open `index.html` in any web browser:

```bash
# In your terminal or file explorer:
start index.html
```

No build tools, npm packages, or servers required — 100% self-contained, lightning fast, and fully responsive across mobile, tablet, and desktop.

