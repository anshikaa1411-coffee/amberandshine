// ==========================================================================
// AMBER & SHINE - CART, WISHLIST, CUSTOMER & ORDER TRACKING STORE
// ==========================================================================

const CART_STORAGE_KEY = "ambershine_cart_v2";
const WISHLIST_STORAGE_KEY = "ambershine_wishlist_v2";
const PINCODE_STORAGE_KEY = "ambershine_pincode_v2";
const COUPON_STORAGE_KEY = "ambershine_applied_coupon";
const CUSTOMER_STORAGE_KEY = "ambershine_customer_v2";
const ORDERS_STORAGE_KEY = "ambershine_orders_v2";

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
    status: "In Transit",
    currentStepIndex: 3, // 0: Placed, 1: Inspected, 2: Packaged, 3: Dispatched, 4: Delivered
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
      { title: "Order Confirmed & Payment Verified", time: "03 Sep 2026, 02:45 PM", completed: true },
      { title: "Artisan Quality & Authenticity Inspection", time: "03 Sep 2026, 06:10 PM", completed: true },
      { title: "Sealed in Tamper-Proof Velvet Keepsake Box", time: "04 Sep 2026, 11:30 AM", completed: true },
      { title: "Dispatched via Armored Express Courier", time: "04 Sep 2026, 04:20 PM", completed: true, current: true },
      { title: "Out for Insured Doorstep Delivery", time: "Expected 06 Sep 2026", completed: false }
    ]
  }
];

class Store {
  constructor() {
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.pincode = this.loadPincode();
    this.appliedCoupon = this.loadCoupon();
    this.customer = this.loadCustomer();
    this.orders = this.loadOrders();
  }

  // --- Cart Storage ---
  loadCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem("ambershine_cart_v1");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
    } catch (e) {}
    this.notifyCartChange();
  }

  // --- Wishlist Storage ---
  loadWishlist() {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY) || localStorage.getItem("ambershine_wishlist_v1");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
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

  // --- Customer Authentication ---
  loadCustomer() {
    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  loginCustomer(email, name = "Valued Patron") {
    this.customer = {
      email: email.trim().toLowerCase(),
      name: name.trim() || "Valued Patron",
      tier: "Amber VIP Member",
      memberSince: "2026"
    };
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(this.customer));
    window.dispatchEvent(new CustomEvent("ambershine:customer-updated", { detail: this.customer }));
    return this.customer;
  }

  logoutCustomer() {
    this.customer = null;
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("ambershine:customer-updated", { detail: null }));
  }

  isLoggedIn() {
    return !!this.customer;
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
    if (this.cart.length === 0) return null;

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
      customerEmail: this.customer ? this.customer.email : "guest@amberandshine.com",
      customerName: this.customer ? this.customer.name : "Guest Shopper",
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
        { title: "Order Confirmed & Payment Verified", time: dateStr, completed: true, current: true },
        { title: "Artisan Quality & Authenticity Inspection", time: "Within 12 hours", completed: false },
        { title: "Sealed in Tamper-Proof Velvet Keepsake Box", time: "Within 24 hours", completed: false },
        { title: "Dispatched via Armored Express Courier", time: "Within 36 hours", completed: false },
        { title: "Out for Insured Doorstep Delivery", time: estDelivery, completed: false }
      ]
    };

    this.orders.unshift(newOrder);
    this.saveOrders();
    this.clearCart();
    return newOrder;
  }

  getOrderById(orderId) {
    if (!orderId) return null;
    const cleanId = orderId.trim().toUpperCase();
    return this.orders.find(o => o.id.toUpperCase() === cleanId) || null;
  }

  getCustomerOrders(email = null) {
    const targetEmail = email || (this.customer ? this.customer.email : null);
    if (!targetEmail) {
      return this.orders; // Return all store orders if guest
    }
    const filtered = this.orders.filter(o => o.customerEmail.toLowerCase() === targetEmail.toLowerCase());
    return filtered.length > 0 ? filtered : this.orders; // Return active list
  }

  // --- Cart Operations ---
  addToCart(product, size = null, metal = null, quantity = 1) {
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

function formatINR(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}
