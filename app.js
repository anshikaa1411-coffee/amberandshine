// ==========================================================================
// AMBER & SHINE (FINE JEWELLERY ATELIER) - APPLICATION CONTROLLER
// ==========================================================================

class AmberShineApp {
  constructor() {
    this.currentView = "home";
    this.currentProduct = PRODUCTS_DATA[0];
    this.selectedMetal = null;
    this.selectedSize = null;
    this.currentPdpQty = 1;
    this.activeShowcaseTab = "trending";
    this.activeBudgetFilter = "all";
    this.currentHeroSlide = 0;
    this.heroSlideInterval = null;

    this.init();
  }

  init() {
    // Render Sections
    this.renderHeroSlider();
    this.renderCategoryBubbles();
    this.renderBudgetChips();
    this.renderShowcaseProducts();
    this.renderCatalogGrid();

    // Event Listeners for State Store
    window.addEventListener("ambershine:cart-updated", (e) => this.onCartUpdated(e.detail));
    window.addEventListener("ambershine:wishlist-updated", (e) => this.onWishlistUpdated(e.detail));
    window.addEventListener("ambershine:pincode-updated", (e) => this.onPincodeUpdated(e.detail));

    // Initialize Header Pincode Display
    this.updateHeaderPincodeDisplay(store.pincode);

    // Initial Badge Refresh
    this.onCartUpdated({
      cart: store.cart,
      count: store.getCartCount(),
      subtotal: store.getCartSubtotal(),
      finalTotal: store.getFinalTotal(),
      discount: store.getCouponDiscount(),
      coupon: store.appliedCoupon,
      savings: store.getTotalSavings(),
      progress: store.getShippingProgress()
    });

    this.onWishlistUpdated({
      wishlist: store.wishlist,
      count: store.getWishlistCount()
    });

    // Start Hero Carousel Auto-Play
    this.startHeroAutoPlay();

    // Hash navigation check
    this.handleHashChange();
    window.addEventListener("hashchange", () => this.handleHashChange());

    // Refresh Lucide Icons
    this.refreshIcons();
  }

  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // ==========================================
  // NAVIGATION & VIEW CONTROLS
  // ==========================================

  navigateTo(viewName) {
    this.currentView = viewName;
    document.querySelectorAll(".view-section").forEach(view => {
      view.classList.remove("active");
    });

    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
      targetView.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Nav button active state
    document.querySelectorAll(".nav-item-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    // Mobile bottom navigation active state
    const bHome = document.getElementById("bottomNavHome");
    const bShop = document.getElementById("bottomNavShop");
    if (bHome) bHome.classList.toggle("active", viewName === "home");
    if (bShop) bShop.classList.toggle("active", viewName === "shop");

    this.closeMobileNav();
    this.refreshIcons();
  }

  navigateToShop(category = "all") {
    this.navigateTo("shop");
    this.filterCatalog(category);
  }

  navigateToProduct(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    this.currentProduct = product;
    this.currentPdpQty = 1;
    this.selectedMetal = product.metals ? product.metals[0] : (product.karatage || "Warm Amber Tone");
    this.selectedSize = product.sizes ? product.sizes[0] : "Standard";

    this.renderPdp(product);
    this.navigateTo("product");
  }

  scrollToSection(sectionId) {
    if (this.currentView !== "home") {
      this.navigateTo("home");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  handleHashChange() {
    const hash = window.location.hash.replace("#", "");
    if (!hash || hash === "home") {
      this.navigateTo("home");
    } else if (hash === "shop") {
      this.navigateToShop("all");
    } else if (hash.startsWith("category-")) {
      const cat = hash.replace("category-", "");
      this.navigateToShop(cat);
    } else if (hash.startsWith("product-")) {
      const id = hash.replace("product-", "");
      this.navigateToProduct(id);
    }
  }

  // ==========================================
  // HERO SLIDER (MIA STYLE)
  // ==========================================

  renderHeroSlider() {
    const wrapper = document.getElementById("heroSlidesWrapper");
    const dotsContainer = document.getElementById("heroCarouselDots");
    if (!wrapper || !dotsContainer) return;

    wrapper.innerHTML = HERO_BANNERS.map((banner, idx) => `
      <div class="hero-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <div class="hero-slide-bg">
          <img src="${banner.image}" alt="${banner.headline}">
        </div>
        <div class="hero-slide-overlay"></div>
        <div class="container">
          <div class="hero-slide-content">
            <span class="hero-tag-badge">${banner.tag}</span>
            <h1 class="hero-headline">${banner.headline}</h1>
            <p class="hero-subhead">${banner.subhead}</p>
            <div class="hero-offer-bar">
              <span>✦ ${banner.offer}</span>
            </div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button class="btn btn-coral" onclick="app.navigateToShop('${banner.ctaLink}')">
                ${banner.ctaText}
              </button>
              <button class="btn btn-outline" onclick="app.scrollToSection('category-bubbles-section')">
                SHOP BY CATEGORY
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    dotsContainer.innerHTML = HERO_BANNERS.map((_, idx) => `
      <div class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="app.goToHeroSlide(${idx})"></div>
    `).join("");
  }

  goToHeroSlide(index) {
    this.currentHeroSlide = index;
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".carousel-dot");

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  nextHeroSlide() {
    let next = (this.currentHeroSlide + 1) % HERO_BANNERS.length;
    this.goToHeroSlide(next);
  }

  prevHeroSlide() {
    let prev = (this.currentHeroSlide - 1 + HERO_BANNERS.length) % HERO_BANNERS.length;
    this.goToHeroSlide(prev);
  }

  startHeroAutoPlay() {
    if (this.heroSlideInterval) clearInterval(this.heroSlideInterval);
    this.heroSlideInterval = setInterval(() => {
      this.nextHeroSlide();
    }, 6000);
  }

  // ==========================================
  // "SHOP BY CATEGORY" CIRCULAR BUBBLE GRID
  // ==========================================

  renderCategoryBubbles() {
    const container = document.getElementById("categoryBubblesGrid");
    if (!container) return;

    container.innerHTML = CATEGORIES_DATA.map(cat => `
      <div class="category-bubble-item" onclick="app.navigateToShop('${cat.filterKey}')">
        <div class="category-circle-media">
          <img src="${cat.image}" alt="${cat.name}" class="category-circle-img" loading="lazy">
        </div>
        <div class="category-bubble-name">${cat.name}</div>
        <div class="category-bubble-count">${cat.count}</div>
      </div>
    `).join("");
  }

  // ==========================================
  // "SHOP BY BUDGET / PRICE" FILTER CHIPS
  // ==========================================

  renderBudgetChips() {
    const container = document.getElementById("budgetChipsStrip");
    if (!container) return;

    container.innerHTML = BUDGET_TIERS.map(tier => `
      <button 
        type="button" 
        class="budget-chip-btn ${this.activeBudgetFilter === tier.id ? 'active' : ''}" 
        onclick="app.selectBudgetFilter('${tier.id}', this)"
      >
        ${tier.label}
      </button>
    `).join("");
  }

  selectBudgetFilter(tierId, btnElement) {
    this.activeBudgetFilter = tierId;
    document.querySelectorAll(".budget-chip-btn").forEach(b => b.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");

    this.renderShowcaseProducts();
  }

  // ==========================================
  // TABBED SHOWCASE: BEST OF AMBER & SHINE
  // ==========================================

  selectShowcaseTab(tabName, tabElement) {
    this.activeShowcaseTab = tabName;
    document.querySelectorAll(".showcase-tab-btn").forEach(btn => btn.classList.remove("active"));
    if (tabElement) tabElement.classList.add("active");

    this.renderShowcaseProducts();
  }

  renderShowcaseProducts() {
    const container = document.getElementById("showcaseProductsGrid");
    if (!container) return;

    let items = [...PRODUCTS_DATA];

    // Filter by Tab
    if (this.activeShowcaseTab === "bestsellers") {
      items = items.filter(p => p.isBestseller);
    } else if (this.activeShowcaseTab === "new") {
      items = items.filter(p => p.isNew);
    } else if (this.activeShowcaseTab === "under25k") {
      items = items.filter(p => p.price <= 25000);
    } else {
      // Default: Trending
      items = items.filter(p => p.isTrending || p.isBestseller);
    }

    // Apply Budget Filter if selected
    if (this.activeBudgetFilter !== "all") {
      const tier = BUDGET_TIERS.find(t => t.id === this.activeBudgetFilter);
      if (tier) {
        items = items.filter(p => p.price >= tier.range[0] && p.price <= tier.range[1]);
      }
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
          <p style="font-size: 1.1rem; color: var(--text-secondary);">No pieces found in this price range.</p>
          <button class="btn btn-outline" style="margin-top: 1rem;" onclick="app.selectBudgetFilter('all')">VIEW ALL PIECES</button>
        </div>
      `;
    } else {
      container.innerHTML = items.slice(0, 8).map(p => this.createProductCardHTML(p)).join("");
    }

    this.refreshIcons();
  }

  // ==========================================
  // PRODUCT CARD GENERATOR
  // ==========================================

  createProductCardHTML(product) {
    const inWishlist = store.isInWishlist(product.id);
    const savings = product.originalPrice ? (product.originalPrice - product.price) : 0;
    const savingsPercentage = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0;

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-card-media" onclick="app.navigateToProduct('${product.id}')">
          <span class="card-karatage-badge">${product.badge || product.karatage}</span>
          <button 
            type="button" 
            class="product-wishlist-btn ${inWishlist ? 'active' : ''}" 
            onclick="event.stopPropagation(); app.toggleWishlist('${product.id}', this)"
            aria-label="Save to Wishlist"
          >
            <i data-lucide="heart" size="18"></i>
          </button>
          
          <img src="${product.images[0]}" alt="${product.name}" class="product-img-primary" loading="lazy">
          <img src="${product.images[1] || product.images[0]}" alt="${product.name} lifestyle" class="product-img-secondary" loading="lazy">
        </div>

        <div class="product-card-body">
          <span class="product-tagline">${product.karatage} · ${product.category}</span>
          <a href="#product-${product.id}" class="product-card-title" onclick="app.navigateToProduct('${product.id}'); return false;">
            ${product.name}
          </a>
          
          <div class="product-pricing-box">
            <div class="price-main-row">
              <span class="current-price">${formatINR(product.price)}</span>
              ${product.originalPrice ? `<span class="original-price">${formatINR(product.originalPrice)}</span>` : ''}
            </div>
            ${savings > 0 ? `<span class="savings-chip">Save ${formatINR(savings)} (${savingsPercentage}% OFF)</span>` : ''}
          </div>

          <div class="product-card-actions">
            <button type="button" class="card-quick-btn" onclick="app.quickAdd('${product.id}')">
              ADD TO BAG
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // SHOP VIEW & CATALOG FILTERING
  // ==========================================

  filterCatalog(categoryKey) {
    const titleEl = document.getElementById("catalogTitle");
    const subEl = document.getElementById("catalogSubtitle");
    
    if (categoryKey === "all") {
      if (titleEl) titleEl.textContent = "All Jewellery";
      if (subEl) subEl.textContent = "Explore our complete range of handcrafted lightweight fine jewellery designs.";
    } else if (categoryKey === "new") {
      if (titleEl) titleEl.textContent = "New Arrivals";
      if (subEl) subEl.textContent = "Freshly crafted lightweight everyday creations.";
    } else {
      if (titleEl) titleEl.textContent = `${categoryKey} Collection`;
      if (subEl) subEl.textContent = `Browse handcrafted ${categoryKey.toLowerCase()} in solid hallmarked precious metal.`;
    }

    this.renderCatalogGrid(categoryKey);
  }

  renderCatalogGrid(filter = "all") {
    const container = document.getElementById("catalogProductGrid");
    if (!container) return;

    let items = [...PRODUCTS_DATA];
    if (filter === "new") {
      items = items.filter(p => p.isNew);
    } else if (filter !== "all") {
      items = items.filter(p => 
        p.category.toLowerCase() === filter.toLowerCase() ||
        p.collection.toLowerCase() === filter.toLowerCase() ||
        (filter === "Solitaires" && (p.category === "Solitaires" || p.name.includes("Solitaire") || p.badge.includes("SOLITAIRE")))
      );
    }

    container.innerHTML = items.map(p => this.createProductCardHTML(p)).join("");
    this.refreshIcons();
  }

  // ==========================================
  // PRODUCT DETAIL PAGE (PDP) CONTROLLER
  // ==========================================

  renderPdp(product) {
    document.getElementById("pdpTitle").textContent = product.name;
    document.getElementById("pdpKaratageTag").textContent = `${product.karatage} · BIS Hallmarked`;
    document.getElementById("pdpPrice").textContent = formatINR(product.price);
    
    const origPriceEl = document.getElementById("pdpOriginalPrice");
    const savingsEl = document.getElementById("pdpSavingsTag");
    if (product.originalPrice && product.originalPrice > product.price) {
      const diff = product.originalPrice - product.price;
      origPriceEl.textContent = formatINR(product.originalPrice);
      origPriceEl.style.display = "inline";
      savingsEl.textContent = `Save ${formatINR(diff)}`;
      savingsEl.style.display = "inline-block";
    } else {
      origPriceEl.style.display = "none";
      savingsEl.style.display = "none";
    }

    document.getElementById("pdpRatingText").textContent = `${product.rating} (${product.reviewsCount} reviews)`;
    document.getElementById("pdpDescription").textContent = product.description;

    // Gallery
    const mainImg = document.getElementById("pdpMainImage");
    mainImg.src = product.images[0];

    const thumbContainer = document.getElementById("pdpThumbnails");
    thumbContainer.innerHTML = product.images.map((img, idx) => `
      <div class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="app.setPdpMainImage('${img}', this)">
        <img src="${img}" alt="${product.name}">
      </div>
    `).join("");

    // Metal Swatches
    const metalContainer = document.getElementById("pdpMetalsList");
    metalContainer.innerHTML = (product.metals || ["Warm Amber Tone"]).map(m => `
      <button type="button" class="budget-chip-btn ${m === this.selectedMetal ? 'active' : ''}" onclick="app.selectPdpMetal('${m}', this)">
        ${m}
      </button>
    `).join("");

    // Sizes
    const sizeContainer = document.getElementById("pdpSizesList");
    sizeContainer.innerHTML = (product.sizes || ["Standard"]).map(s => `
      <button type="button" class="budget-chip-btn ${s === this.selectedSize ? 'active' : ''}" onclick="app.selectPdpSize('${s}', this)">
        ${s}
      </button>
    `).join("");

    // Specs Grid
    const specsContainer = document.getElementById("pdpSpecsList");
    if (product.specs) {
      specsContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
          <span style="color: var(--text-muted); font-size: 0.8rem;">Precious Purity</span>
          <span style="font-weight: 600; font-size: 0.82rem;">${product.specs.metal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
          <span style="color: var(--text-muted); font-size: 0.8rem;">Gemstone</span>
          <span style="font-weight: 600; font-size: 0.82rem;">${product.specs.stone}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
          <span style="color: var(--text-muted); font-size: 0.8rem;">Gross Weight</span>
          <span style="font-weight: 600; font-size: 0.82rem;">${product.specs.weight || '2.10 g'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
          <span style="color: var(--text-muted); font-size: 0.8rem;">Certification</span>
          <span style="font-weight: 600; font-size: 0.82rem; color: var(--brand-emerald);">BIS 916 Hallmark & SGL Verified</span>
        </div>
      `;
    }

    // Recommendations
    const recsContainer = document.getElementById("pdpRecommendationsGrid");
    const recs = PRODUCTS_DATA.filter(p => p.id !== product.id).slice(0, 4);
    recsContainer.innerHTML = recs.map(p => this.createProductCardHTML(p)).join("");

    this.refreshIcons();
  }

  setPdpMainImage(url, thumbEl) {
    document.getElementById("pdpMainImage").src = url;
    document.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
    if (thumbEl) thumbEl.classList.add("active");
  }

  selectPdpMetal(metal, btn) {
    this.selectedMetal = metal;
    document.querySelectorAll("#pdpMetalsList .budget-chip-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  selectPdpSize(size, btn) {
    this.selectedSize = size;
    document.querySelectorAll("#pdpSizesList .budget-chip-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  incrementPdpQty() {
    this.currentPdpQty++;
    document.getElementById("pdpQtyText").textContent = this.currentPdpQty;
  }

  decrementPdpQty() {
    if (this.currentPdpQty > 1) {
      this.currentPdpQty--;
      document.getElementById("pdpQtyText").textContent = this.currentPdpQty;
    }
  }

  addPdpToCart() {
    store.addToCart(this.currentProduct, this.selectedSize, this.selectedMetal, this.currentPdpQty);
    this.showToast(`Added ${this.currentProduct.name} to your bag`);
    this.openCartDrawer();
  }

  // ==========================================
  // QUICK ADD & WISHLIST
  // ==========================================

  quickAdd(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    store.addToCart(product);
    this.showToast(`Added ${product.name} to your bag`);
    this.openCartDrawer();
  }

  toggleWishlist(productId, btnEl) {
    const added = store.toggleWishlist(productId);
    if (btnEl) btnEl.classList.toggle("active", added);
    this.showToast(added ? "Saved to your Wishlist" : "Removed from Wishlist");
  }

  // ==========================================
  // CART DRAWER & PROMO ENGINE
  // ==========================================

  openCartDrawer() {
    this.closeAllModals();
    document.getElementById("drawerBackdrop").classList.add("open");
    document.getElementById("cartDrawer").classList.add("open");
    this.renderCartDrawer();
  }

  closeCartDrawer() {
    document.getElementById("drawerBackdrop").classList.remove("open");
    document.getElementById("cartDrawer").classList.remove("open");
  }

  onCartUpdated(detail) {
    const badge = document.getElementById("headerCartBadge");
    if (badge) {
      badge.textContent = detail.count;
      badge.style.display = detail.count > 0 ? "flex" : "none";
    }

    const bottomCart = document.getElementById("bottomCartBadge");
    if (bottomCart) {
      bottomCart.textContent = detail.count;
      bottomCart.style.display = detail.count > 0 ? "flex" : "none";
    }

    const drawerCount = document.getElementById("drawerCartCount");
    if (drawerCount) drawerCount.textContent = detail.count;

    // Progress Bar
    const progressFill = document.getElementById("shippingMeterFill");
    const progressMsg = document.getElementById("shippingMeterText");
    if (progressFill && progressMsg) {
      progressFill.style.width = `${detail.progress.percentage}%`;
      if (detail.progress.qualified) {
        progressMsg.innerHTML = `<span style="color: var(--brand-emerald); font-weight: 700;">✓ You unlocked Complimentary Insured Express Delivery!</span>`;
      } else {
        progressMsg.innerHTML = `Add <strong>${formatINR(detail.progress.remaining)}</strong> more for FREE Insured Courier.`;
      }
    }

    const cartDrawerEl = document.getElementById("cartDrawer");
    if (cartDrawerEl && cartDrawerEl.classList.contains("open")) {
      this.renderCartDrawer();
    }
  }

  renderCartDrawer() {
    const list = document.getElementById("cartItemsList");
    const footer = document.getElementById("cartDrawerFooter");
    if (!list) return;

    if (store.cart.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <i data-lucide="shopping-bag" size="48" style="color: var(--brand-coral); opacity: 0.5;"></i>
          <h3 style="font-size: 1.2rem; margin: 1rem 0 0.5rem;">Your bag is empty</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.5rem;">Start shopping your favourite handcrafted fine pieces.</p>
          <button class="btn btn-coral" onclick="app.closeCartDrawer(); app.navigateToShop('all');">
            START SHOPPING
          </button>
        </div>
      `;
      if (footer) footer.style.display = "none";
    } else {
      if (footer) footer.style.display = "block";
      list.innerHTML = store.cart.map(item => `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-sub">${item.karatage} · Size: ${item.size}</div>
              <div class="cart-item-price-row">
                <span style="font-weight: 700;">${formatINR(item.price * item.quantity)}</span>
                ${item.originalPrice ? `<span style="font-size: 0.75rem; color: var(--text-muted); text-decoration: line-through;">${formatINR(item.originalPrice * item.quantity)}</span>` : ''}
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.6rem;">
              <div class="cart-stepper">
                <button type="button" onclick="store.updateCartQuantity('${item.key}', ${item.quantity - 1})">−</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="store.updateCartQuantity('${item.key}', ${item.quantity + 1})">+</button>
              </div>
              <span class="cart-remove-link" onclick="store.removeFromCart('${item.key}')">Remove</span>
            </div>
          </div>
        </div>
      `).join("");

      // Price Calculations
      document.getElementById("cartSubtotalDisplay").textContent = formatINR(store.getCartSubtotal());
      
      const discountRow = document.getElementById("cartDiscountRow");
      const discountVal = document.getElementById("cartDiscountDisplay");
      const couponCode = store.appliedCoupon;
      const discount = store.getCouponDiscount();

      if (couponCode && discount > 0) {
        discountRow.style.display = "flex";
        discountVal.textContent = `- ${formatINR(discount)}`;
      } else {
        discountRow.style.display = "none";
      }

      document.getElementById("cartFinalTotalDisplay").textContent = formatINR(store.getFinalTotal());
    }

    this.refreshIcons();
  }

  applyCartCoupon() {
    const input = document.getElementById("cartCouponInput");
    if (!input || !input.value) return;

    const res = store.applyCoupon(input.value);
    this.showToast(res.message);
    if (res.success) input.value = "";
  }

  handleCartCheckout() {
    if (store.cart.length === 0) {
      this.showToast("Your shopping bag is empty.");
      return;
    }
    const order = store.createOrderFromCart();
    this.closeCartDrawer();
    if (order) {
      this.openTrackingModal(order.id);
      this.showToast(`Order #${order.id} confirmed! Tracking package.`);
    }
  }

  // ==========================================
  // WISHLIST DRAWER
  // ==========================================

  openWishlistDrawer() {
    this.closeAllModals();
    document.getElementById("drawerBackdrop").classList.add("open");
    document.getElementById("wishlistDrawer").classList.add("open");
    this.renderWishlistDrawer();
  }

  closeWishlistDrawer() {
    document.getElementById("drawerBackdrop").classList.remove("open");
    document.getElementById("wishlistDrawer").classList.remove("open");
  }

  onWishlistUpdated(detail) {
    const badge = document.getElementById("headerWishlistBadge");
    if (badge) {
      badge.textContent = detail.count;
      badge.style.display = detail.count > 0 ? "flex" : "none";
    }

    const bottomWishlist = document.getElementById("bottomWishlistBadge");
    if (bottomWishlist) {
      bottomWishlist.textContent = detail.count;
      bottomWishlist.style.display = detail.count > 0 ? "flex" : "none";
    }

    const wishlistEl = document.getElementById("wishlistDrawer");
    if (wishlistEl && wishlistEl.classList.contains("open")) {
      this.renderWishlistDrawer();
    }
  }

  renderWishlistDrawer() {
    const container = document.getElementById("wishlistItemsList");
    if (!container) return;

    if (store.wishlist.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <i data-lucide="heart" size="48" style="color: var(--brand-coral); opacity: 0.5;"></i>
          <h3 style="font-size: 1.2rem; margin: 1rem 0 0.5rem;">Your wishlist is empty</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.5rem;">Tap the heart icon on designs you adore to save them here.</p>
          <button class="btn btn-coral" onclick="app.closeWishlistDrawer(); app.navigateToShop('all');">
            EXPLORE DESIGNS
          </button>
        </div>
      `;
    } else {
      const items = store.wishlist
        .map(id => PRODUCTS_DATA.find(p => p.id === id))
        .filter(Boolean);

      container.innerHTML = items.map(p => `
        <div class="cart-item-card">
          <img src="${p.images[0]}" alt="${p.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div>
              <div class="cart-item-name">${p.name}</div>
              <div class="cart-item-sub">${p.karatage}</div>
              <div style="font-weight: 700; margin-top: 0.3rem;">${formatINR(p.price)}</div>
            </div>
            <div style="display: flex; gap: 0.6rem; margin-top: 0.6rem;">
              <button class="btn btn-coral" style="padding: 0.4rem 0.8rem; font-size: 0.68rem;" onclick="app.moveWishlistToBag('${p.id}')">
                MOVE TO BAG
              </button>
              <span class="cart-remove-link" onclick="app.toggleWishlist('${p.id}')">Remove</span>
            </div>
          </div>
        </div>
      `).join("");
    }

    this.refreshIcons();
  }

  moveWishlistToBag(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    store.addToCart(product);
    store.toggleWishlist(productId);
    this.showToast(`Moved ${product.name} to your bag`);
    this.renderWishlistDrawer();
  }

  // ==========================================
  // PINCODE PICKER MODAL
  // ==========================================

  openPincodeModal() {
    this.closeAllModals();
    document.getElementById("pincodeModal").classList.add("open");
    const input = document.getElementById("modalPincodeInput");
    if (input) input.value = store.pincode;
  }

  closePincodeModal() {
    document.getElementById("pincodeModal").classList.remove("open");
  }

  saveModalPincode() {
    const input = document.getElementById("modalPincodeInput");
    const pin = (input ? input.value : "").trim();
    if (!pin || pin.length !== 6 || isNaN(pin)) {
      alert("Please enter a valid 6-digit Indian Pincode (e.g. 400001)");
      return;
    }

    store.setPincode(pin);
    this.closePincodeModal();
    this.showToast(`Delivery location updated to ${pin}`);
  }

  onPincodeUpdated(detail) {
    this.updateHeaderPincodeDisplay(detail.pincode);
  }

  updateHeaderPincodeDisplay(pin) {
    const btn = document.getElementById("headerPincodeText");
    if (btn) btn.textContent = `Deliver to: ${pin}`;
  }

  // ==========================================
  // SIZE GUIDE & MODALS
  // ==========================================

  openSizeGuide() {
    this.closeAllModals();
    document.getElementById("sizeGuideModal").classList.add("open");
  }

  closeSizeGuide() {
    document.getElementById("sizeGuideModal").classList.remove("open");
  }

  closeAllModals() {
    const backdrop = document.getElementById("drawerBackdrop");
    if (backdrop) backdrop.classList.remove("open");
    const cart = document.getElementById("cartDrawer");
    if (cart) cart.classList.remove("open");
    const wishlist = document.getElementById("wishlistDrawer");
    if (wishlist) wishlist.classList.remove("open");
    const modals = document.querySelectorAll(".app-modal");
    modals.forEach(m => m.classList.remove("open"));
    this.closeMobileNav();
  }

  // ==========================================
  // MOBILE NAVIGATION CONTROLS
  // ==========================================

  toggleMobileNav() {
    const drawer = document.getElementById("mobileNavDrawer");
    if (drawer) {
      drawer.classList.toggle("open");
      this.refreshIcons();
    }
  }

  closeMobileNav() {
    const drawer = document.getElementById("mobileNavDrawer");
    if (drawer) {
      drawer.classList.remove("open");
    }
  }

  toggleMobileSearchBar() {
    const wrap = document.getElementById("mobileSearchBarWrap");
    if (!wrap) return;
    const isHidden = wrap.style.display === "none" || wrap.style.display === "";
    wrap.style.display = isHidden ? "block" : "none";
    if (isHidden) {
      const input = document.getElementById("mobileSearchInput");
      if (input) {
        input.value = "";
        setTimeout(() => input.focus(), 150);
      }
    }
    this.refreshIcons();
  }

  // ==========================================
  // SEARCH
  // ==========================================

  handleSearchInput(query) {
    const clean = (query || "").trim().toLowerCase();
    if (!clean) return;

    this.navigateTo("shop");
    this.renderCatalogGrid(clean);
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================

  showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <i data-lucide="sparkles" size="16" style="color: var(--brand-coral); flex-shrink: 0;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    this.refreshIcons();

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // ==========================================
  // CUSTOMER ACCOUNT & ORDERS
  // ==========================================

  openAccountModal() {
    this.closeAllModals();
    const modal = document.getElementById("customerAccountModal");
    if (modal) {
      modal.classList.add("open");
      this.renderCustomerAccount();
    }
  }

  closeAccountModal() {
    const modal = document.getElementById("customerAccountModal");
    if (modal) modal.classList.remove("open");
  }

  switchAuthTab(tab) {
    const signBtn = document.getElementById("tabSignInBtn");
    const regBtn = document.getElementById("tabRegisterBtn");
    const signForm = document.getElementById("signInForm");
    const regForm = document.getElementById("registerForm");

    if (tab === "signin") {
      signBtn.classList.add("active");
      regBtn.classList.remove("active");
      signForm.style.display = "flex";
      regForm.style.display = "none";
    } else {
      regBtn.classList.add("active");
      signBtn.classList.remove("active");
      regForm.style.display = "flex";
      signForm.style.display = "none";
    }
  }

  renderCustomerAccount() {
    const authView = document.getElementById("accountAuthView");
    const profileView = document.getElementById("accountProfileView");
    if (!authView || !profileView) return;

    if (store.isLoggedIn()) {
      authView.style.display = "none";
      profileView.style.display = "block";

      const cust = store.customer;
      document.getElementById("customerDisplayName").textContent = cust.name;
      document.getElementById("customerDisplayEmail").textContent = cust.email;
      document.getElementById("customerAvatarChar").textContent = (cust.name || "A")[0].toUpperCase();
      document.getElementById("customerDisplayTier").textContent = cust.tier || "Amber VIP Member";

      this.renderPastOrders();
    } else {
      authView.style.display = "block";
      profileView.style.display = "none";
      this.switchAuthTab("signin");
    }
    this.refreshIcons();
  }

  renderPastOrders() {
    const container = document.getElementById("pastOrdersContainer");
    const countDisplay = document.getElementById("ordersCountDisplay");
    if (!container) return;

    const orders = store.getCustomerOrders();
    if (countDisplay) {
      countDisplay.textContent = `${orders.length} ${orders.length === 1 ? "Order" : "Orders"}`;
    }

    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">
          No past orders found yet. Any orders placed will appear here for tracking!
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => `
      <div class="order-history-card">
        <div class="order-card-header">
          <div>
            <div class="order-id-tag">Order #${order.id}</div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">${order.date}</div>
          </div>
          <span class="order-status-pill ${order.status === 'In Transit' ? 'status-in-transit' : order.status === 'Delivered' ? 'status-delivered' : 'status-confirmed'}">
            ${order.status}
          </span>
        </div>

        <div class="order-items-preview">
          ${order.items.map(item => `
            <div class="order-item-row">
              <img src="${item.image}" alt="${item.name}" class="order-item-thumb">
              <div style="flex: 1;">
                <div style="font-size: 0.84rem; font-weight: 600; color: var(--text-primary);">${item.name}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${item.size} · ${item.metal} (Qty: ${item.quantity})</div>
              </div>
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-primary);">${formatINR(item.price * item.quantity)}</div>
            </div>
          `).join("")}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.8rem; border-top: 1px solid var(--border-subtle);">
          <div style="font-size: 0.85rem;">
            Total: <strong style="color: var(--brand-coral);">${formatINR(order.total)}</strong>
          </div>
          <button type="button" class="btn btn-coral" style="padding: 0.35rem 0.85rem; font-size: 0.74rem;" onclick="app.openTrackingModal('${order.id}')">
            Track Package →
          </button>
        </div>
      </div>
    `).join("");
  }

  handleCustomerLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const name = email.split("@")[0].replace(/[._]/g, " ");
    const capName = name.charAt(0).toUpperCase() + name.slice(1);

    store.loginCustomer(email, capName);
    this.renderCustomerAccount();
    this.showToast(`Welcome back, ${capName}!`);
  }

  handleCustomerRegister(e) {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;

    store.loginCustomer(email, name);
    this.renderCustomerAccount();
    this.showToast(`Account created! Welcome, ${name}.`);
  }

  quickDemoLogin() {
    store.loginCustomer("ananya@example.com", "Ananya Sharma");
    this.renderCustomerAccount();
    this.showToast("Signed in as Ananya Sharma!");
  }

  handleCustomerLogout() {
    store.logoutCustomer();
    this.renderCustomerAccount();
    this.showToast("You have been signed out.");
  }

  // ==========================================
  // ORDER TRACKING MODAL
  // ==========================================

  openTrackingModal(orderId = null) {
    this.closeAllModals();
    const modal = document.getElementById("orderTrackingModal");
    if (!modal) return;

    modal.classList.add("open");

    const input = document.getElementById("trackingInputId");
    if (orderId) {
      if (input) input.value = orderId;
      this.displayOrderTracking(orderId);
    } else {
      // Pre-fill with user's most recent order or seed order
      const orders = store.getCustomerOrders();
      const defaultId = orders.length > 0 ? orders[0].id : "AS-78219";
      if (input) input.value = defaultId;
      this.displayOrderTracking(defaultId);
    }
  }

  closeTrackingModal() {
    const modal = document.getElementById("orderTrackingModal");
    if (modal) modal.classList.remove("open");
  }

  handleSearchTracking(e) {
    e.preventDefault();
    const input = document.getElementById("trackingInputId");
    if (!input || !input.value) return;
    this.displayOrderTracking(input.value.trim());
  }

  displayOrderTracking(orderId) {
    const view = document.getElementById("trackingDetailsView");
    if (!view) return;

    const order = store.getOrderById(orderId);

    if (!order) {
      view.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: var(--bg-surface); border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
          <i data-lucide="alert-circle" size="32" style="color: var(--text-muted); margin-bottom: 0.5rem;"></i>
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">Order Not Found</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">Please double check your Order ID. You can test with <strong>AS-78219</strong>.</p>
        </div>
      `;
      this.refreshIcons();
      return;
    }

    const currentStep = order.currentStepIndex !== undefined ? order.currentStepIndex : 1;

    view.innerHTML = `
      <div class="tracking-summary-box">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
          <div>
            <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">Order #${order.id}</div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">Placed on: ${order.date}</div>
          </div>
          <span class="order-status-pill status-in-transit">${order.status}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; font-size: 0.78rem; padding-top: 0.8rem; border-top: 1px dashed var(--border-subtle);">
          <div>
            <span style="color: var(--text-muted); display: block;">Armored Logistics:</span>
            <strong>${order.courier}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block;">Airway Bill (AWB):</span>
            <strong style="font-family: monospace;">${order.awb}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block;">Destination Pincode:</span>
            <strong>${order.pincode}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block;">Estimated Delivery:</span>
            <strong style="color: var(--brand-emerald);">${order.estimatedDelivery}</strong>
          </div>
        </div>
      </div>

      <!-- 5-Step Visual Timeline -->
      <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 1rem;">Tracking Progress</h4>
      <div class="tracking-timeline-wrap">
        ${order.timeline.map((step, idx) => {
          const isCompleted = step.completed;
          const isActive = step.current;
          return `
            <div class="tracking-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
              <div class="tracking-step-bullet">
                ${isCompleted ? '✓' : (idx + 1)}
              </div>
              <div class="tracking-step-title">${step.title}</div>
              <div class="tracking-step-time">${step.time}</div>
            </div>
          `;
        }).join("")}
      </div>

      <!-- Items in shipment -->
      <h4 style="font-size: 0.95rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.8rem;">Items in Shipment (${order.items.length})</h4>
      <div style="display: flex; flex-direction: column; gap: 0.6rem;">
        ${order.items.map(item => `
          <div style="display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: var(--bg-surface); border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
            <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: var(--radius-xs); object-fit: cover;">
            <div style="flex: 1;">
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-primary);">${item.name}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${item.size} · ${item.metal}</div>
            </div>
            <div style="font-size: 0.82rem; font-weight: 700;">${formatINR(item.price * item.quantity)}</div>
          </div>
        `).join("")}
      </div>
    `;

    this.refreshIcons();
  }

  // ==========================================
  // ADMIN ACCESS PORTAL (RESTRICTED AUTHENTICATION & CATALOG)
  // ==========================================

  isAdminAuthenticated() {
    return sessionStorage.getItem("ambershine_admin_auth") === "true";
  }

  handleAdminLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const keyInput = document.getElementById("adminSecurityKey");
    const errorMsg = document.getElementById("adminAuthErrorMessage");
    const enteredKey = keyInput ? keyInput.value.trim() : "";

    // Master administrative passcodes
    const VALID_KEYS = ["admin2026", "amberadmin", "admin123"];
    if (VALID_KEYS.includes(enteredKey)) {
      sessionStorage.setItem("ambershine_admin_auth", "true");
      if (errorMsg) errorMsg.style.display = "none";
      this.showToast("Administrator access verified. Welcome.");
      this.openAdminModal();
    } else {
      if (errorMsg) {
        errorMsg.style.display = "block";
        errorMsg.textContent = "⚠ Access Denied: Incorrect Master Passcode.";
      }
      if (keyInput) keyInput.select();
    }
  }

  handleAdminLogout() {
    sessionStorage.removeItem("ambershine_admin_auth");
    this.showToast("Admin session locked.");
    this.openAdminModal();
  }

  openAdminModal() {
    this.closeAllModals();
    const modal = document.getElementById("adminPortalModal");
    if (!modal) return;
    modal.classList.add("open");

    const authGate = document.getElementById("adminAuthGateView");
    const dashboard = document.getElementById("adminDashboardView");
    const errorMsg = document.getElementById("adminAuthErrorMessage");
    if (errorMsg) errorMsg.style.display = "none";

    if (this.isAdminAuthenticated()) {
      if (authGate) authGate.style.display = "none";
      if (dashboard) dashboard.style.display = "block";
      this.renderAdminProducts();
    } else {
      if (authGate) authGate.style.display = "block";
      if (dashboard) dashboard.style.display = "none";
      const keyInput = document.getElementById("adminSecurityKey");
      if (keyInput) {
        keyInput.value = "";
        setTimeout(() => keyInput.focus(), 150);
      }
    }

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  closeAdminModal() {
    const modal = document.getElementById("adminPortalModal");
    if (modal) modal.classList.remove("open");
  }

  renderAdminProducts() {
    const container = document.getElementById("adminProductListContainer");
    const countEl = document.getElementById("adminCatalogCount");
    if (!container) return;

    if (countEl) countEl.textContent = `${PRODUCTS_DATA.length} Products`;

    container.innerHTML = PRODUCTS_DATA.map(p => `
      <div class="admin-product-row">
        <div style="display: flex; align-items: center; gap: 0.8rem; flex: 1;">
          <img src="${p.images[0]}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
          <div>
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${p.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${p.category} · ${p.karatage} · ${formatINR(p.price)}</div>
          </div>
        </div>
        <button type="button" class="admin-delete-btn" onclick="app.handleDeleteProduct('${p.id}')">
          Delete
        </button>
      </div>
    `).join("");
  }

  handleAddProduct(e) {
    e.preventDefault();
    if (!this.isAdminAuthenticated()) {
      this.showToast("Access Denied: Admin authorization required.");
      this.openAdminModal();
      return;
    }

    const name = document.getElementById("adminProdName").value.trim();
    const category = document.getElementById("adminProdCategory").value;
    const price = parseInt(document.getElementById("adminProdPrice").value, 10);
    const origPriceVal = document.getElementById("adminProdOrigPrice").value;
    const origPrice = origPriceVal ? parseInt(origPriceVal, 10) : Math.round(price * 1.15);
    const karatage = document.getElementById("adminProdKaratage").value.trim() || "Warm Amber Tone";
    const badge = document.getElementById("adminProdBadge").value.trim().toUpperCase() || "NEW IN";
    const image = document.getElementById("adminProdImage").value.trim();
    const desc = document.getElementById("adminProdDesc").value.trim();

    const newId = "as-" + Date.now().toString().slice(-4);

    const newProd = {
      id: newId,
      name: name,
      karatage: karatage,
      category: category,
      collection: "Contemporary Edit",
      price: price,
      originalPrice: origPrice,
      badge: badge,
      isNew: true,
      isBestseller: false,
      isTrending: true,
      rating: 5.0,
      reviewsCount: 1,
      description: desc,
      details: [
        "Handcrafted Hypoallergenic Fine Metal with mirror finish",
        "Anti-tarnish waterproof artisan craftsmanship",
        "Lifetime authenticity guarantee"
      ],
      specs: {
        metal: karatage,
        stone: "Certified Solitaire / Fine Crystal",
        caratWeight: "0.20 ctw",
        weight: "2.40 g",
        origin: "Precision Atelier"
      },
      images: [
        image,
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85"
      ],
      sizes: ["US 6 / IN 12", "US 7 / IN 14", "Standard"],
      metals: [karatage, "Rose Tone", "Silver Rhodium Tone"],
      inStock: true,
      occasion: "Everyday Luxe"
    };

    PRODUCTS_DATA.unshift(newProd);
    saveStoredProducts(PRODUCTS_DATA);

    this.renderAdminProducts();
    this.renderShowcaseProducts();
    this.renderCatalogGrid();

    this.showToast(`"${name}" published to store catalog!`);
    e.target.reset();
  }

  handleDeleteProduct(productId) {
    if (!this.isAdminAuthenticated()) {
      this.showToast("Access Denied: Admin authorization required.");
      this.openAdminModal();
      return;
    }

    const target = PRODUCTS_DATA.find(p => p.id === productId);
    const prodName = target ? target.name : "Product";

    if (!confirm(`Are you sure you want to remove "${prodName}" from the store catalog?`)) {
      return;
    }

    PRODUCTS_DATA = PRODUCTS_DATA.filter(p => p.id !== productId);
    saveStoredProducts(PRODUCTS_DATA);

    this.renderAdminProducts();
    this.renderShowcaseProducts();
    this.renderCatalogGrid();

    this.showToast(`Removed "${prodName}" from store.`);
  }

  handleResetCatalog() {
    if (!this.isAdminAuthenticated()) {
      this.showToast("Access Denied: Admin authorization required.");
      this.openAdminModal();
      return;
    }

    if (!confirm("Reset all catalog changes back to the default 8 products?")) {
      return;
    }
    PRODUCTS_DATA = resetStoredProducts();
    this.renderAdminProducts();
    this.renderShowcaseProducts();
    this.renderCatalogGrid();
    this.showToast("Catalog reset to default pieces.");
  }

}

// Global Instance
const app = new AmberShineApp();
