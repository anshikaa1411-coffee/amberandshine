// ==========================================
// AMBER & SHINE FINE JEWELLERY - CART & WISHLIST STORE
// ==========================================

const CART_STORAGE_KEY = "ambershine_cart_v1";
const WISHLIST_STORAGE_KEY = "ambershine_wishlist_v1";
const FREE_SHIPPING_THRESHOLD = 5000;

class Store {
  constructor() {
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem("aurelia_cart_v1");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Could not read cart from localStorage", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
    this.notifyCartChange();
  }

  loadWishlist() {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY) || localStorage.getItem("aurelia_wishlist_v1");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Could not read wishlist from localStorage", e);
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
    } catch (e) {
      console.warn("Could not save wishlist to localStorage", e);
    }
    this.notifyWishlistChange();
  }

  // --- Cart Operations ---
  addToCart(product, size = null, metal = null, quantity = 1) {
    const selectedSize = size || (product.sizes ? product.sizes[0] : "Standard");
    const selectedMetal = metal || (product.metals ? product.metals[0] : "18K Yellow Gold");
    const itemKey = `${product.id}-${selectedSize}-${selectedMetal}`;

    const existingIndex = this.cart.findIndex(item => item.key === itemKey);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        key: itemKey,
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
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
    this.saveCart();
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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

  // --- Observers ---
  notifyCartChange() {
    const detail = {
      cart: this.cart,
      count: this.getCartCount(),
      subtotal: this.getCartSubtotal(),
      progress: this.getShippingProgress()
    };
    window.dispatchEvent(new CustomEvent("ambershine:cart-updated", { detail }));
    window.dispatchEvent(new CustomEvent("aurelia:cart-updated", { detail }));
  }

  notifyWishlistChange() {
    const detail = {
      wishlist: this.wishlist,
      count: this.getWishlistCount()
    };
    window.dispatchEvent(new CustomEvent("ambershine:wishlist-updated", { detail }));
    window.dispatchEvent(new CustomEvent("aurelia:wishlist-updated", { detail }));
  }
}

// Global Store Instance
const store = new Store();

// Helper currency formatter for Indian Rupees
function formatINR(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

