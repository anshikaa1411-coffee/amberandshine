# AMBER & SHINE — Modern Fine Jewellery Atelier & Executive Suite

A luxury, editorial direct-to-consumer e-commerce experience and secure administrative management platform crafted for a modern fine jewellery brand.

---

## ✨ Visual Identity & Design Direction

- **Editorial Palette**: Warm ivory canvas (`#FAF8F5`), champagne accents (`#C5A880`), soft beige & muted taupe secondary tones (`#EFECE6`, `#E6E1D8`), and deep charcoal text (`#1C1B1A`).
- **Typography Pairing**: *Cormorant Garamond* (sophisticated serif for headings) paired with *Plus Jakarta Sans* (crisp, modern sans-serif for UI & body text).
- **Aesthetic Principles**: Magazine-style layout with generous whitespace, hairline borders, subtle micro-shadows, and smooth transitions.
- **Atmosphere**: Designed to feel like a high-end luxury fashion editorial first and an e-commerce platform second.

---

## 🔒 Security Architecture & Role-Based Access Control (RBAC)

The platform enforces strict, server-side role segregation between **Customers** and **Administrators**:

1. **Server-Side Authorization**:
   - Every administrative request (`/api/admin/*`) strictly validates the caller's session token and verifies `role == 'admin'` directly in SQLite (`users.db`).
   - Unauthenticated visits receive **HTTP 401 Unauthorized**.
   - Authenticated customers attempting to access admin APIs receive **HTTP 403 Forbidden** with the exact error:
     `"Access denied. Administrator privileges are required."`
   - Client-side modifications (DevTools, `localStorage`, URL parameters, or tampered payloads) cannot bypass server-side RBAC.

2. **Privilege Escalation Prevention**:
   - Public account registration (`POST /api/auth/register`) hardcodes `role = 'customer'`.
   - Any client-submitted `role` attribute is strictly ignored.

3. **Public Storefront Isolation**:
   - Zero admin links, buttons, modals, or indicators exist on the public storefront (`index.html`).
   - The admin route (`/admin` / `admin.html`) is completely unlinked from public navigation.

4. **Access Barrier Screen for Customers**:
   - If an authenticated customer visits `/admin`, the page verifies their role with the backend and displays a security barrier: *"Access denied. Administrator privileges are required."* with options to return to the storefront or sign out.

---

## 💎 Features & Platform Components

### 1. Public Storefront (`index.html`)
- **Top Bar**: Charcoal & warm tone minimalist announcement: *"COMPLIMENTARY INSURED DELIVERY ON ORDERS ABOVE ₹5,000"*, size guide, and track order links.
- **Sticky Translucent Header**: Glassmorphic blur (`backdrop-filter: blur(14px)`) and subtle elevation on scroll.
- **Dynamic Catalog**: Loads active products dynamically from `GET /api/products`. Products marked `Hidden` or `Archived` by the administrator are excluded from the public store.
- **Interactive Shopping Bag & Wishlist**: Real-time drawers with promo code engine (`SHINE20`, `SHINE1000`, `FIRSTGIFT`), delivery estimates, and free shipping progress meter.
- **Interactive Order Tracking Modal**: 5-step visual tracking timeline with live stage progression, AWB numbers, and armored courier tracking.

### 2. Customer Authentication & Profile Hub
- **PBKDF2 Password Hashing**: Passwords secured using PBKDF2-HMAC-SHA256 with 100,000 iterations and unique cryptographic salts.
- **Registered User Verification**: Arbitrary fake emails are rejected with: *"No account found with this email. Please create an account first."*
- **Email Verification (OTP)**: New registrations require a 6-digit verification code before activation.
- **Past Orders Directory**: Logged-in patrons can review past orders and track packages live.

### 3. Dedicated Admin Dashboard (`/admin` / `admin.html`)
- **Executive KPI Overview**: Total active products, out-of-stock items, low-stock alerts (threshold ≤ 5), total order counts, pending dispatches, and gross atelier revenue.
- **Product Management (CRUD)**:
  - Add new products with SKU, title, category, pricing, stock quantity, low-stock threshold, badge, and description.
  - Edit existing products with immediate catalog synchronization.
  - Soft-delete (archive) products with confirmation prompt.
  - Status toggle: `Active`, `Hidden`, `Out of Stock`, `Archived`.
- **Base64 Image Management**: Dedicated image upload service storing binary assets securely in SQLite `product_images` table, served via `GET /api/images/:id`.
- **Inventory & Stock Management**: Real-time warehouse stock editor with instant `+1` / `-1` / custom quantity adjustments and visual status indicators (*"In Stock"*, *"Low Stock — X remaining"*, *"Out of Stock"*).
- **Categories & Collections Management**: Add, update, and manage jewellery collection categories.
- **Order Stage Tracking**: Update order dispatch status across the 5 standard stages (`Order Confirmed`, `Packed`, `Shipped`, `Out for Delivery`, `Delivered`) with real-time customer timeline synchronization.
- **Patron Directory**: View customer spend, order history, and verification status with password hashes and salts strictly omitted.
- **Activity Audit Trail**: Immutable logging of administrative actions with timestamps, entity IDs, and administrator email.

---

## 📂 Project Structure (Flat — Zero Subfolders)

All files reside directly in the project root:

```
hi/
├── index.html         # Public fine jewellery storefront
├── admin.html         # Dedicated luxury admin portal (overview, products, inventory, orders, logs)
├── styles.css         # Atelier design system & responsive styling (zero forbidden terms)
├── products.js        # Dynamic storefront catalog loader (fetches active products from server)
├── cart.js            # Shopping cart, wishlist, customer auth, and order tracking store
├── app.js             # Public storefront UI controller and modal manager
├── server.py          # Multi-threaded Python HTTP server with strict RBAC & SQLite database
├── users.db           # SQLite database (users, sessions, products, categories, orders, images, logs)
└── README.md          # Comprehensive platform documentation
```

---

## 🚀 How to Launch and Preview

1. **Start the Atelier Backend Server**:
   ```bash
   python -u server.py
   ```

2. **Access the Public Storefront**:
   Open `http://127.0.0.1:8000/` in your browser.

3. **Access the Admin Portal**:
   Navigate directly to `http://127.0.0.1:8000/admin`.

---

## 🔑 Pre-Seeded Credentials

| Account Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@amberandshine.com` | `Admin@Amber2026!` | Full Administrative Dashboard & API Access |
| **Verified Patron (Customer)** | `ananya@example.com` | `password123` | Storefront Shopping, Cart, Past Order History |
| **Unverified Account** | `unverified@example.com` | `password123` | OTP Verification Test (`123456`) |
