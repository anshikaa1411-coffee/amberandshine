# AMBER & SHINE — Modern Fine Jewellery Atelier

A luxury, editorial direct-to-consumer e-commerce experience crafted for a modern fine jewellery brand.

---

## ✨ Visual Identity & Design Direction

- **Editorial Palette**: Warm ivory canvas (`#FAF8F5`), champagne accents (`#C5A880`), soft beige & muted taupe secondary tones (`#EFECE6`, `#E6E1D8`), and deep charcoal text (`#1C1B1A`).
- **Typography Pairing**: *Cormorant Garamond* (sophisticated serif for headings) paired with *Plus Jakarta Sans* (crisp, modern sans-serif for UI & body text).
- **Aesthetic Principles**: Magazine-style layout with generous whitespace, hairline borders, subtle micro-shadows, and smooth transitions.
- **Atmosphere**: Designed to feel like a high-end luxury fashion editorial first and an e-commerce platform second.

---

## 💎 Features & Architecture

### 1. Header & Navigation
- **Announcement Bar**: *"COMPLIMENTARY INSURED DELIVERY ON ORDERS ABOVE ₹5,000"* in an elegant warm ivory & champagne single-line bar with quick links to Track Order, Size Guide, Admin Portal, and Certified Authenticity guarantee.
- **Sticky Translucent Header**: Glassmorphic blur (`backdrop-filter: blur(14px)`) and subtle elevation on scroll.
- **Refined Branding**: Minimalist wordmark `AMBER & SHINE · Fine Jewellery`.
- **Navigation**: Instant seamless transitions between **All Jewellery**, **Rings**, **Earrings**, **Pendants**, **Bracelets & Bangles**, **Mangalsutras**, and **Solitaires**.
- **Header Utilities**: Pincode selector, Customer Account & Orders button, Wishlist drawer trigger, and Shopping Bag drawer trigger.

### 2. Customer Account Profile & Past Orders
- **Authentication**: Sign In / Create Account forms with 1-click Instant Demo Login (Ananya Sharma).
- **Profile Hub**: Displays customer name, email, VIP tier badge, and complete **Past Orders History**.
- **Direct Package Tracking**: Every past order features item summaries, price breakdown, status badges, and an instant **"Track Package"** trigger.

### 3. Interactive Order Tracking System
- **Real-Time 5-Step Visual Timeline**:
  1. Order Confirmed & Payment Verified
  2. Artisan Quality & Authenticity Inspection
  3. Sealed in Tamper-Proof Velvet Keepsake Box
  4. Dispatched via Armored Express Courier
  5. Out for Insured Doorstep Delivery
- **Full Shipment Details**: Airway Bill (AWB) number, courier partner (BlueDart Apex Armored Logistics), destination pincode, and dynamic delivery estimates.
- **Instant Post-Checkout Tracking**: Orders created during checkout automatically generate unique Order IDs (e.g. `AS-78219`) and open the tracker immediately.

### 4. Admin Product Portal (Store Management)
- **Add New Products**: Create custom products on the fly (Name, Category, Price, Original Price, Karatage/Tone, Badge Tag, Image URL, Description) that publish immediately to the live store.
- **Product Removal**: Instantly delete products from the active catalog with live re-rendering across homepage and catalog grids.
- **Persistent Storage**: All changes persist in `localStorage` across page reloads.
- **Reset to Default**: Easily restore the default fine jewellery catalog anytime.

### 5. Trust Pillars & 7-Day Easy Returns
- **Artisan Handcrafted**: Master bench finishing with microscopic precision setting and mirror luster.
- **Insured Armored Delivery**: 100% door-to-door transit insurance across 28,000+ PIN codes.
- **7-Day Easy Returns**: 100% full money-back guarantee with complimentary doorstep insured courier pickup.
- **Lifetime Care & Polish**: Free annual ultrasonic steam cleaning, prong inspection, and lifetime exchange policy.

---

## 📂 Project Structure (Flat — Zero Subfolders)

```
hi/
├── index.html         # Main HTML5 page with modern atelier layout, drawers, and modals
├── styles.css         # Complete design system & responsive styling
├── products.js        # Dynamic catalog store with persistent admin management
├── cart.js            # Reactive shopping cart, wishlist, customer auth, and orders store
├── app.js             # UI controller, account manager, order tracker, and admin portal
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
