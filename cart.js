// ==========================================================================
// AMBER & SHINE - CART, WISHLIST, PROMO CODES & PINCODE STORE
// ==========================================================================

const CART_STORAGE_KEY = "ambershine_cart_v2";
const WISHLIST_STORAGE_KEY = "ambershine_wishlist_v2";
const PINCODE_STORAGE_KEY = "ambershine_pincode_v2";
const COUPON_STORAGE_KEY = "ambershine_applied_coupon";

const FREE_SHIPPING_THRESHOLD = 5000;

const PROMO_CODES = {
  "SHINE20": { type: "percent", value: 20, minOrder: 0, label: "20% Off on Making Charges" },
  "SHINE1000": { type: "flat", value: 1000, minOrder: 12000, label: "₹1,000 Festive Welcome Discount" },
  "FIRSTGIFT": { type: "flat", value: 500, minOrder: 5000, label: "₹500 Instant First-Order Gift" }
};

class Store {
  constructor() {
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.pincode = this.loadPincode();
    this.appliedCoupon = this.loadCoupon();
  }

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

  loadPincode() {
    return localStorage.getItem(PINCODE_STORAGE_KEY) || "400001";
  }

  setPincode(pin) {
    this.pincode = pin;
    localStorage.setItem(PINCODE_STORAGE_KEY, pin);
    window.dispatchEvent(new CustomEvent("ambershine:pincode-updated", { detail: { pincode: pin } }));
  }

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

  // Cart Operations
  addToCart(product, size = null, metal = null, quantity = 1) {
    const selectedSize = size || (product.sizes ? product.sizes[0] : "Standard");
    const selectedMetal = metal || (product.metals ? product.metals[0] : (product.karatage || "14KT Yellow Gold"));
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

  // Wishlist Operations
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

  // Notification Dispatches
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
