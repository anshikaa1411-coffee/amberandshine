// ==========================================================================
// AMBER & SHINE - CART, WISHLIST, CUSTOMER & ORDER TRACKING STORE
// ==========================================================================

const CART_STORAGE_KEY = "ambershine_cart_v2";
const WISHLIST_STORAGE_KEY = "ambershine_wishlist_v2";
const PINCODE_STORAGE_KEY = "ambershine_pincode_v2";
const COUPON_STORAGE_KEY = "ambershine_applied_coupon";
const CUSTOMER_STORAGE_KEY = "ambershine_customer_v2";
const ORDERS_STORAGE_KEY = "ambershine_orders_v2";
const SESSION_TOKEN_KEY = "ambershine_session_token";

const AUTH_API_BASE = (typeof window !== "undefined" && (window.location.protocol === "file:" || !window.location.origin.includes(":8000")))
  ? "http://127.0.0.1:8000"
  : "";

const FREE_SHIPPING_THRESHOLD = 5000;

const PROMO_CODES = {
  "SHINE20": { type: "percent", value: 20, minOrder: 0, label: "20% Off on Making Charges" },
  "SHINE1000": { type: "flat", value: 1000, minOrder: 12000, label: "₹1,000 Festive Welcome Discount" },
  "FIRSTGIFT": { type: "flat", value: 500, minOrder: 5000, label: "₹500 Instant First-Order Gift" }
};

// Default seed orders so customers can view tracking immediately
const DEFAULT_SEED_ORDERS = [
  {
    id: "AS-78219",
    date: "03 Sep 2026, 02:45 PM",
    customerEmail: "ananya@example.com",
    customerName: "Ananya Sharma",
    pincode: "400001",
    courier: "BlueDart Apex Armored Courier",
    awb: "BD-984218701",
    estimatedDelivery: "Tomorrow by 2:00 PM",
    subtotal: 13800,
    discount: 2760,
    total: 11040,
    status: "Shipped",
    currentStepIndex: 2, // 0: Order Confirmed, 1: Packed, 2: Shipped, 3: Out for Delivery, 4: Delivered
    items: [
      {
        name: "Dainty Twinkle Solitaire Ring",
        karatage: "Warm Amber Tone",
        size: "US 6 / IN 12",
        metal: "Warm Amber Tone",
        price: 13800,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80"
      }
    ],
    timeline: [
      { title: "Order Confirmed", status: "Order Confirmed", time: "03 Sep 2026, 02:45 PM", completed: true, current: false },
      { title: "Packed", status: "Packed", time: "03 Sep 2026, 06:10 PM", completed: true, current: false },
      { title: "Shipped", status: "Shipped", time: "04 Sep 2026, 01:20 PM", completed: true, current: true },
      { title: "Out for Delivery", status: "Out for Delivery", time: "Pending", completed: false, current: false },
      { title: "Delivered", status: "Delivered", time: "Expected Tomorrow", completed: false, current: false }
    ]
  }
];

class Store {
  constructor() {
    this.customer = this.loadCustomer();
    this.pincode = this.loadPincode();
    this.appliedCoupon = this.loadCoupon();
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.orders = this.loadOrders();
    this.checkSession();
  }

  // --- Customer Scoped Keys ---
  getCartStorageKey() {
    if (this.customer && this.customer.email) {
      return `ambershine_cart_${this.customer.email.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`;
    }
    return null;
  }

  getWishlistStorageKey() {
    if (this.customer && this.customer.email) {
      return `ambershine_wishlist_${this.customer.email.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`;
    }
    return null;
  }

  // --- Cart Storage ---
  loadCart() {
    if (!this.isLoggedIn()) {
      return [];
    }
    try {
      const userKey = this.getCartStorageKey();
      const stored = (userKey && localStorage.getItem(userKey)) || localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem("ambershine_cart_v1");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    if (!this.isLoggedIn()) {
      this.cart = [];
      this.notifyCartChange();
      return;
    }
    try {
      const serialized = JSON.stringify(this.cart);
      const userKey = this.getCartStorageKey();
      if (userKey) {
        localStorage.setItem(userKey, serialized);
      }
      localStorage.setItem(CART_STORAGE_KEY, serialized);
    } catch (e) {}
    this.notifyCartChange();
  }

  // --- Wishlist Storage (Guest & Patron accessible) ---
  loadWishlist() {
    try {
      const userKey = this.getWishlistStorageKey();
      const stored = (userKey && localStorage.getItem(userKey)) || localStorage.getItem(WISHLIST_STORAGE_KEY) || localStorage.getItem("ambershine_wishlist_v1");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      const serialized = JSON.stringify(this.wishlist);
      const userKey = this.getWishlistStorageKey();
      if (userKey) {
        localStorage.setItem(userKey, serialized);
      }
      localStorage.setItem(WISHLIST_STORAGE_KEY, serialized);
    } catch (e) {}
    this.notifyWishlistChange();
  }

  // --- Pincode Storage ---
  loadPincode() {
    return localStorage.getItem(PINCODE_STORAGE_KEY) || "400001";
  }

  setPincode(pin) {
    this.pincode = pin;
    localStorage.setItem(PINCODE_STORAGE_KEY, pin);
    window.dispatchEvent(new CustomEvent("ambershine:pincode-updated", { detail: { pincode: pin } }));
  }

  // --- Coupon Storage ---
  loadCoupon() {
    return localStorage.getItem(COUPON_STORAGE_KEY) || null;
  }

  applyCoupon(code) {
    const upper = (code || "").trim().toUpperCase();
    if (!PROMO_CODES[upper]) {
      return { success: false, message: "Invalid promo code. Try SHINE20 or SHINE1000." };
    }
    const promo = PROMO_CODES[upper];
    const subtotal = this.getCartSubtotal();
    if (subtotal < promo.minOrder) {
      return { success: false, message: `Code valid on orders above ₹${promo.minOrder.toLocaleString('en-IN')}.` };
    }
    this.appliedCoupon = upper;
    localStorage.setItem(COUPON_STORAGE_KEY, upper);
    this.notifyCartChange();
    return { success: true, message: `Coupon "${upper}" applied! ${promo.label}` };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    localStorage.removeItem(COUPON_STORAGE_KEY);
    this.notifyCartChange();
  }

  // --- Customer Authentication & Session Management ---
  getSessionToken() {
    try {
      return localStorage.getItem(SESSION_TOKEN_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  setSessionToken(token) {
    try {
      if (token) {
        localStorage.setItem(SESSION_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(SESSION_TOKEN_KEY);
      }
    } catch (e) {}
  }

  loadCustomer() {
    try {
      const token = this.getSessionToken();
      if (!token) return null;
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  async checkSession() {
    const token = this.getSessionToken();
    if (!token) {
      this.customer = null;
      try { localStorage.removeItem(CUSTOMER_STORAGE_KEY); } catch (e) {}
      this.cart = [];
      this.wishlist = this.loadWishlist();
      this.notifyCartChange();
      this.notifyWishlistChange();
      window.dispatchEvent(new CustomEvent("ambershine:customer-updated", { detail: null }));
      return null;
    }

    try {
      const res = await fetch(`${AUTH_API_BASE}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        this.customer = data.user;
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(this.customer));
        this.cart = this.loadCart();
        this.wishlist = this.loadWishlist();
        this.notifyCartChange();
        this.notifyWishlistChange();
        window.dispatchEvent(new CustomEvent("ambershine:customer-updated", { detail: this.customer }));
        return this.customer;
      } else {
        // Session invalid or expired on backend
        await this.logoutCustomer();
        return null;
      }
    } catch (e) {
      console.warn("[AmberAuth] Background session check warning:", e);
      return this.customer;
    }
  }

  async loginCustomer(email, password) {
    const res = await fetch(`${AUTH_API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || "Authentication failed.");
      err.status = res.status;
      err.code = data.code;
      err.data = data;
      throw err;
    }

    this.setSessionToken(data.token);
    this.customer = data.user;
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(this.customer));
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.notifyCartChange();
    this.notifyWishlistChange();
    window.dispatchEvent(new CustomEvent("ambershine:customer-updated", { detail: this.customer }));
    return data;
  }

  async registerCustomer(name, email, password) {
    const res = await fetch(`${AUTH_API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || "Registration failed.");
      err.status = res.status;
      err.code = data.code;
      err.data = data;
      throw err;
    }
    return data;
  }

  async verifyEmail(email, code) {
    const res = await fetch(`${AUTH_API_BASE}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code })
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || "Verification failed.");
      err.status = res.status;
      err.code = data.code;
      err.data = data;
      throw err;
    }

    if (data.token && data.user) {
      this.setSessionToken(data.token);
      this.customer = data.user;
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(this.customer));
      this.cart = this.loadCart();
      this.wishlist = this.loadWishlist();
      this.notifyCartChange();
      this.notifyWishlistChange();
      window.dispatchEvent(new CustomEvent("ambershine:customer-updated", { detail: this.customer }));
    }
    return data;
  }

  async resendVerificationCode(email) {
    const res = await fetch(`${AUTH_API_BASE}/api/auth/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || "Failed to resend verification code.");
      err.status = res.status;
      err.code = data.code;
      err.data = data;
      throw err;
    }
    return data;
  }

  async logoutCustomer() {
    const token = this.getSessionToken();
    if (token) {
      try {
        await fetch(`${AUTH_API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
      } catch (e) {}
    }

    this.setSessionToken(null);
    this.customer = null;
    try {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {}
    this.cart = [];
    this.wishlist = this.loadWishlist();
    this.removeCoupon();
    this.notifyCartChange();
    this.notifyWishlistChange();
    window.dispatchEvent(new CustomEvent("ambershine:customer-updated", { detail: null }));
  }

  isLoggedIn() {
    return !!this.customer && !!this.getSessionToken();
  }

  // --- Orders Management & Tracking ---
  loadOrders() {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...DEFAULT_SEED_ORDERS];
  }

  saveOrders() {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
    } catch (e) {}
  }

  createOrderFromCart() {
    if (this.cart.length === 0 || !this.isLoggedIn()) return null;

    const orderId = "AS-" + Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const now = new Date();
    const estDelivery = new Date(now.setDate(now.getDate() + 3)).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const newOrder = {
      id: orderId,
      date: dateStr,
      customerEmail: this.customer.email,
      customerName: this.customer.name || "Amber VIP Customer",
      pincode: this.pincode,
      courier: "BlueDart Apex Armored Courier",
      awb: "BD-" + Math.floor(100000000 + Math.random() * 900000000),
      estimatedDelivery: estDelivery + " by 6:00 PM",
      subtotal: this.getCartSubtotal(),
      discount: this.getCouponDiscount(),
      total: this.getFinalTotal(),
      status: "Order Confirmed",
      currentStepIndex: 0,
      items: this.cart.map(item => ({ ...item })),
      timeline: [
        { title: "Order Confirmed", status: "Order Confirmed", time: dateStr, completed: true, current: true },
        { title: "Packed", status: "Packed", time: "Pending", completed: false, current: false },
        { title: "Shipped", status: "Shipped", time: "Pending", completed: false, current: false },
        { title: "Out for Delivery", status: "Out for Delivery", time: "Pending", completed: false, current: false },
        { title: "Delivered", status: "Delivered", time: `Expected ${estDelivery}`, completed: false, current: false }
      ]
    };

    this.orders.unshift(newOrder);
    this.saveOrders();
    this.syncOrderToBackend(newOrder);
    this.clearCart();
    return newOrder;
  }

  async syncOrderToBackend(order) {
    const token = this.getSessionToken();
    if (!token) return;
    try {
      await fetch(`${AUTH_API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(order)
      });
    } catch (e) {
      console.warn("[AmberStore] Could not sync order to backend:", e);
    }
  }

  async getOrderByIdAsync(orderId) {
    if (!orderId || !this.isLoggedIn()) return null;
    const cleanId = orderId.trim().toUpperCase();
    const token = this.getSessionToken();

    if (token) {
      try {
        const res = await fetch(`${AUTH_API_BASE}/api/orders/${cleanId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.order) {
            const backendOrder = data.order;
            const idx = this.orders.findIndex(o => o.id && o.id.toUpperCase() === cleanId);
            if (idx > -1) {
              this.orders[idx] = backendOrder;
            } else {
              this.orders.unshift(backendOrder);
            }
            this.saveOrders();
            return backendOrder;
          }
        }
      } catch (e) {
        console.warn("[AmberStore] Error fetching order from backend:", e);
      }
    }

    return this.getOrderById(cleanId);
  }

  async getCustomerOrdersAsync(email = null) {
    if (!this.isLoggedIn()) return [];
    const token = this.getSessionToken();

    if (token) {
      try {
        const res = await fetch(`${AUTH_API_BASE}/api/orders`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.orders)) {
            data.orders.forEach(backendOrder => {
              const idx = this.orders.findIndex(o => o.id && o.id.toUpperCase() === backendOrder.id.toUpperCase());
              if (idx > -1) {
                this.orders[idx] = backendOrder;
              } else {
                this.orders.unshift(backendOrder);
              }
            });
            this.saveOrders();
            return this.getCustomerOrders(email);
          }
        }
      } catch (e) {
        console.warn("[AmberStore] Error fetching customer orders from backend:", e);
      }
    }

    return this.getCustomerOrders(email);
  }

  getOrderById(orderId) {
    if (!orderId || !this.isLoggedIn()) return null;
    const cleanId = orderId.trim().toUpperCase();
    const order = this.orders.find(o => o.id && o.id.toUpperCase() === cleanId);
    if (!order) return null;
    // Strict privacy barrier: Customer can ONLY query their OWN order
    const orderOwner = order.customerEmail || order.customer_email;
    if (!orderOwner || !this.customer || orderOwner.toLowerCase() !== this.customer.email.toLowerCase()) {
      return null;
    }
    return order;
  }

  getCustomerOrders(email = null) {
    const targetEmail = email || (this.customer ? this.customer.email : null);
    if (!targetEmail) {
      return []; // Return empty array if not logged in or no email (never leak seed orders)
    }
    return this.orders.filter(o => {
      const owner = o.customerEmail || o.customer_email;
      return owner && owner.toLowerCase() === targetEmail.toLowerCase();
    });
  }

  // --- Cart Operations ---
  addToCart(product, size = null, metal = null, quantity = 1) {
    if (!this.isLoggedIn()) {
      return false; // Gated strictly behind customer login
    }
    const selectedSize = size || (product.sizes ? product.sizes[0] : "Standard");
    const selectedMetal = metal || (product.metals ? product.metals[0] : (product.karatage || "Warm Amber Tone"));
    const itemKey = `${product.id}-${selectedSize}-${selectedMetal}`;

    const existingIndex = this.cart.findIndex(item => item.key === itemKey);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        key: itemKey,
        productId: product.id,
        name: product.name,
        karatage: product.karatage || selectedMetal,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.images[0],
        size: selectedSize,
        metal: selectedMetal,
        quantity: quantity
      });
    }

    this.saveCart();
    return this.cart;
  }

  removeFromCart(itemKey) {
    this.cart = this.cart.filter(item => item.key !== itemKey);
    this.saveCart();
  }

  updateCartQuantity(itemKey, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(itemKey);
      return;
    }
    const item = this.cart.find(i => i.key === itemKey);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
    }
  }

  clearCart() {
    this.cart = [];
    this.removeCoupon();
    this.saveCart();
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getOriginalSubtotal() {
    return this.cart.reduce((total, item) => total + ((item.originalPrice || item.price) * item.quantity), 0);
  }

  getCouponDiscount() {
    if (!this.appliedCoupon || !PROMO_CODES[this.appliedCoupon]) return 0;
    const promo = PROMO_CODES[this.appliedCoupon];
    const subtotal = this.getCartSubtotal();
    if (subtotal < promo.minOrder) return 0;
    if (promo.type === "percent") {
      return Math.round((subtotal * promo.value) / 100);
    }
    return promo.value;
  }

  getFinalTotal() {
    return Math.max(0, this.getCartSubtotal() - this.getCouponDiscount());
  }

  getTotalSavings() {
    const productSavings = Math.max(0, this.getOriginalSubtotal() - this.getCartSubtotal());
    const couponSavings = this.getCouponDiscount();
    return productSavings + couponSavings;
  }

  getShippingProgress() {
    const subtotal = this.getCartSubtotal();
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const percentage = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    const qualified = subtotal >= FREE_SHIPPING_THRESHOLD;
    return {
      subtotal,
      remaining,
      percentage,
      qualified,
      threshold: FREE_SHIPPING_THRESHOLD
    };
  }

  // --- Wishlist Operations ---
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
      added = false;
    } else {
      this.wishlist.push(productId);
      added = true;
    }
    this.saveWishlist();
    return added;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  getWishlistCount() {
    return this.wishlist.length;
  }

  // --- Event Notifications ---
  notifyCartChange() {
    const detail = {
      cart: this.cart,
      count: this.getCartCount(),
      subtotal: this.getCartSubtotal(),
      finalTotal: this.getFinalTotal(),
      discount: this.getCouponDiscount(),
      coupon: this.appliedCoupon,
      savings: this.getTotalSavings(),
      progress: this.getShippingProgress()
    };
    window.dispatchEvent(new CustomEvent("ambershine:cart-updated", { detail }));
  }

  notifyWishlistChange() {
    const detail = {
      wishlist: this.wishlist,
      count: this.getWishlistCount()
    };
    window.dispatchEvent(new CustomEvent("ambershine:wishlist-updated", { detail }));
  }
}

// Global Store Instance
const store = new Store();
window.store = store;

function formatINR(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}
