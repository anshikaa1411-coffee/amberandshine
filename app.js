// ==========================================================================
// AMBER & SHINE (MIA BY TANISHQ INSPIRED) - APPLICATION CONTROLLER
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
    this.selectedMetal = product.metals ? product.metals[0] : (product.karatage || "14KT Yellow Gold");
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
      if (subEl) subEl.textContent = "Explore our complete range of 14KT & 18KT lightweight gold designs.";
    } else if (categoryKey === "new") {
      if (titleEl) titleEl.textContent = "New Arrivals";
      if (subEl) subEl.textContent = "Freshly crafted lightweight everyday creations.";
    } else {
      if (titleEl) titleEl.textContent = `${categoryKey} Collection`;
      if (subEl) subEl.textContent = `Browse handcrafted ${categoryKey.toLowerCase()} in solid hallmarked gold.`;
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
        (filter === "Diamonds" && p.name.includes("Diamond"))
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
    metalContainer.innerHTML = (product.metals || ["14KT Yellow Gold"]).map(m => `
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
          <span style="color: var(--text-muted); font-size: 0.8rem;">Gold Purity</span>
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

    if (document.getElementById("cartDrawer").classList.contains("open")) {
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
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.5rem;">Start shopping your favourite 14KT & 18KT gold pieces.</p>
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
    this.closeCartDrawer();
    alert(`✦ Order Confirmation Simulation\n\nTotal Payable: ${formatINR(store.getFinalTotal())}\nDelivery to Pincode: ${store.pincode}\n100% BIS Hallmarked Insured Armored Dispatch\n\nThank you for shopping with Amber & Shine!`);
    store.clearCart();
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

    if (document.getElementById("wishlistDrawer").classList.contains("open")) {
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
    document.getElementById("drawerBackdrop").classList.remove("open");
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("wishlistDrawer").classList.remove("open");
    const modals = document.querySelectorAll(".app-modal");
    modals.forEach(m => m.classList.remove("open"));
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
}

// Global Instance
const app = new AmberShineApp();
