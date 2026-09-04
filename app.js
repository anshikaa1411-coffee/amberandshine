// ==========================================================================
// AMBER & SHINE FINE JEWELLERY - MAIN APPLICATION CONTROLLER
// ==========================================================================

class AmberShineApp {
  constructor() {
    this.currentView = "home";
    this.currentProduct = PRODUCTS_DATA[0];
    this.selectedMetal = null;
    this.selectedSize = null;
    this.currentPdpQty = 1;
    this.currentFilter = "all";
    this.currentSort = "featured";

    this.init();
  }

  init() {
    // Initial Render of Homepage Components
    this.renderFeaturedCollections();
    this.renderNewArrivals();
    this.renderBestsellers();
    this.renderCatalogGrid();

    // Event Listeners for Cart & Wishlist
    window.addEventListener("aurelia:cart-updated", (e) => this.onCartUpdated(e.detail));
    window.addEventListener("aurelia:wishlist-updated", (e) => this.onWishlistUpdated(e.detail));

    // Scroll listener for sticky header styling
    window.addEventListener("scroll", () => {
      const header = document.getElementById("siteHeader");
      if (header) {
        if (window.scrollY > 40) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    });

    // Mobile nav toggle
    const mobileMenuOpenBtn = document.getElementById("mobileMenuOpen");
    if (mobileMenuOpenBtn) {
      mobileMenuOpenBtn.addEventListener("click", () => this.openMobileNav());
    }

    // Refresh UI with initial storage data
    this.onCartUpdated({
      cart: store.cart,
      count: store.getCartCount(),
      subtotal: store.getCartSubtotal(),
      progress: store.getShippingProgress()
    });

    this.onWishlistUpdated({
      wishlist: store.wishlist,
      count: store.getWishlistCount()
    });

    // Hash navigation check
    this.handleHashChange();
    window.addEventListener("hashchange", () => this.handleHashChange());

    // Initialize Lucide Icons
    this.refreshIcons();
  }

  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // ==========================================
  // NAVIGATION & VIEW SWITCHING
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

    // Update active state on nav links
    document.querySelectorAll(".header-nav .nav-link").forEach(link => {
      link.classList.remove("active");
    });

    this.refreshIcons();
  }

  navigateToShop(filter = "all") {
    this.navigateTo("shop");
    this.filterShop(filter);
  }

  navigateToProduct(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    this.currentProduct = product;
    this.currentPdpQty = 1;
    this.selectedMetal = product.metals ? product.metals[0] : "18K Yellow Gold";
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
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  handleHashChange() {
    const hash = window.location.hash.replace("#", "");
    if (!hash || hash === "home") {
      this.navigateTo("home");
    } else if (hash === "new-arrivals") {
      this.navigateToShop("new");
    } else if (hash === "jewellery" || hash === "shop") {
      this.navigateToShop("all");
    } else if (hash === "about") {
      this.navigateTo("about");
    } else if (hash.startsWith("product-")) {
      const id = hash.replace("product-", "");
      this.navigateToProduct(id);
    }
  }

  // ==========================================
  // PRODUCT CARD RENDERING
  // ==========================================

  createProductCardHTML(product) {
    const inWishlist = store.isInWishlist(product.id);
    const primaryImg = product.images[0];
    const secondaryImg = product.images[1] || product.images[0];
    const badgeHTML = product.badge 
      ? `<span class="product-badge">${product.badge}</span>` 
      : "";

    const oldPriceHTML = product.originalPrice 
      ? `<span class="product-old-price">${formatINR(product.originalPrice)}</span>` 
      : "";

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-card-media" onclick="app.navigateToProduct('${product.id}')">
          ${badgeHTML}
          <button 
            type="button" 
            class="product-wishlist-btn ${inWishlist ? 'active' : ''}" 
            onclick="event.stopPropagation(); app.toggleWishlist('${product.id}', this)"
            aria-label="Save to Wishlist"
          >
            <i data-lucide="heart" size="18"></i>
          </button>
          
          <img src="${primaryImg}" alt="${product.name}" class="product-img-primary" loading="lazy">
          <img src="${secondaryImg}" alt="${product.name} on model" class="product-img-secondary" loading="lazy">

          <div class="product-quick-add" onclick="event.stopPropagation();">
            <button type="button" class="product-quick-btn" onclick="app.quickAdd('${product.id}')">
              QUICK ADD · ${formatINR(product.price)}
            </button>
          </div>
        </div>

        <div class="product-card-info">
          <span class="product-category-sub">${product.category} · ${product.collection}</span>
          <a href="#product-${product.id}" class="product-name-link" onclick="app.navigateToProduct('${product.id}'); return false;">
            ${product.name}
          </a>
          <div class="product-price-row">
            <span class="product-price">${formatINR(product.price)}</span>
            ${oldPriceHTML}
          </div>
        </div>
      </div>
    `;
  }

  renderFeaturedCollections() {
    const container = document.getElementById("featuredCollectionsGrid");
    if (!container) return;

    container.innerHTML = COLLECTIONS_DATA.map(col => `
      <div class="collection-card" onclick="app.navigateToShop('${col.title}')">
        <div class="collection-img-wrap">
          <img src="${col.image}" alt="${col.title}" class="collection-img" loading="lazy">
        </div>
        <div class="collection-card-body">
          <div>
            <h3 class="collection-title">${col.title}</h3>
            <p class="collection-desc">${col.subtitle}</p>
          </div>
          <span class="btn-text-link">
            ${col.linkText} <i data-lucide="arrow-right" size="14"></i>
          </span>
        </div>
      </div>
    `).join("");
  }

  renderNewArrivals() {
    const container = document.getElementById("newArrivalsGrid");
    if (!container) return;

    // Show 4 selected new products
    const newItems = PRODUCTS_DATA.slice(0, 4);
    container.innerHTML = newItems.map(p => this.createProductCardHTML(p)).join("");
  }

  renderBestsellers() {
    const container = document.getElementById("bestsellersGrid");
    if (!container) return;

    // Show bestsellers
    const bestsellers = PRODUCTS_DATA.filter(p => p.isBestseller).slice(0, 4);
    container.innerHTML = bestsellers.map(p => this.createProductCardHTML(p)).join("");
  }

  // ==========================================
  // SHOP VIEW FILTER & SORT
  // ==========================================

  filterShop(category, clickedElement = null) {
    this.currentFilter = category;

    // Update active pill button
    const pills = document.querySelectorAll("#shopFilterPills .filter-pill");
    pills.forEach(p => {
      if (clickedElement && p === clickedElement) {
        p.classList.add("active");
      } else if (!clickedElement && p.textContent.trim().toLowerCase() === category.toLowerCase()) {
        p.classList.add("active");
      } else if (!clickedElement && category === "all" && p.textContent.trim() === "All") {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });

    // Update Titles
    const titleEl = document.getElementById("shopTitle");
    const subEl = document.getElementById("shopSubtitle");
    const eyebrowEl = document.getElementById("shopEyebrow");

    if (category === "all") {
      eyebrowEl.textContent = "Full Catalog";
      titleEl.textContent = "All Atelier Creations";
      subEl.textContent = "Browse our hand-finished collection of fine rings, necklaces, earrings, and bracelets.";
    } else if (category === "new") {
      eyebrowEl.textContent = "Latest Drop";
      titleEl.textContent = "New Arrivals";
      subEl.textContent = "Recently emerged from our atelier benches, crafted in limited numbers.";
    } else {
      eyebrowEl.textContent = "Collection";
      titleEl.textContent = category;
      subEl.textContent = `Explore our bespoke selection of fine ${category.toLowerCase()}.`;
    }

    this.renderCatalogGrid();
  }

  sortShop(sortBy) {
    this.currentSort = sortBy;
    this.renderCatalogGrid();
  }

  renderCatalogGrid() {
    const container = document.getElementById("catalogProductGrid");
    if (!container) return;

    let list = [...PRODUCTS_DATA];

    // Filter
    if (this.currentFilter === "new") {
      list = list.filter(p => p.isNew);
    } else if (this.currentFilter !== "all") {
      list = list.filter(p => 
        p.category.toLowerCase() === this.currentFilter.toLowerCase() ||
        p.collection.toLowerCase() === this.currentFilter.toLowerCase()
      );
    }

    // Sort
    if (this.currentSort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (this.currentSort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (this.currentSort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <p style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-secondary);">No pieces found in this category.</p>
          <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="app.filterShop('all')">VIEW ALL PIECES</button>
        </div>
      `;
    } else {
      container.innerHTML = list.map(p => this.createProductCardHTML(p)).join("");
    }

    this.refreshIcons();
  }

  // ==========================================
  // PRODUCT DETAIL PAGE (PDP) CONTROLLER
  // ==========================================

  renderPdp(product) {
    // Breadcrumbs
    document.getElementById("pdpBreadcrumbCategory").textContent = product.category;
    document.getElementById("pdpBreadcrumbTitle").textContent = product.name;

    // Header & Meta
    document.getElementById("pdpCollectionTag").textContent = `${product.collection} Collection`;
    document.getElementById("pdpTitle").textContent = product.name;
    document.getElementById("pdpPrice").textContent = formatINR(product.price);
    
    const origPriceEl = document.getElementById("pdpOriginalPrice");
    if (product.originalPrice) {
      origPriceEl.textContent = formatINR(product.originalPrice);
      origPriceEl.style.display = "inline";
    } else {
      origPriceEl.style.display = "none";
    }

    document.getElementById("pdpRatingSnippet").textContent = `${product.rating} (${product.reviewsCount} verified atelier reviews)`;
    document.getElementById("pdpDescription").textContent = product.description;

    // Gallery
    const mainImg = document.getElementById("pdpMainImage");
    mainImg.src = product.images[0];
    mainImg.alt = product.name;

    const thumbContainer = document.getElementById("pdpThumbnailsList");
    thumbContainer.innerHTML = product.images.map((img, idx) => `
      <div class="pdp-thumb ${idx === 0 ? 'active' : ''}" onclick="app.setPdpMainImage('${img}', this)">
        <img src="${img}" alt="${product.name} view ${idx + 1}">
      </div>
    `).join("");

    // Metals
    const metalContainer = document.getElementById("pdpMetalSwatches");
    const metalLabel = document.getElementById("pdpSelectedMetalLabel");
    metalLabel.textContent = this.selectedMetal;

    metalContainer.innerHTML = (product.metals || ["18K Yellow Gold"]).map(m => {
      let swatchClass = "swatch-yellow-gold";
      if (m.includes("Rose")) swatchClass = "swatch-rose-gold";
      if (m.includes("White")) swatchClass = "swatch-white-gold";
      const isActive = m === this.selectedMetal;
      return `
        <button type="button" class="metal-swatch-btn ${isActive ? 'active' : ''}" onclick="app.selectPdpMetal('${m}', this)">
          <span class="swatch-circle ${swatchClass}"></span>
          <span>${m}</span>
        </button>
      `;
    }).join("");

    // Sizes
    const sizeContainer = document.getElementById("pdpSizeOptions");
    const sizeLabel = document.getElementById("pdpSelectedSizeLabel");
    sizeLabel.textContent = this.selectedSize;

    sizeContainer.innerHTML = (product.sizes || ["One Size"]).map(s => {
      const isActive = s === this.selectedSize;
      return `
        <button type="button" class="size-pill-btn ${isActive ? 'active' : ''}" onclick="app.selectPdpSize('${s}', this)">
          ${s}
        </button>
      `;
    }).join("");

    // Wishlist PDP button state
    const wishlistBtn = document.getElementById("pdpWishlistBtn");
    if (store.isInWishlist(product.id)) {
      wishlistBtn.classList.add("active");
    } else {
      wishlistBtn.classList.remove("active");
    }

    // Details list
    const detailsList = document.getElementById("pdpDetailsList");
    detailsList.innerHTML = (product.details || []).map(d => `<li>${d}</li>`).join("");

    // Specs grid
    const specsGrid = document.getElementById("pdpSpecsGrid");
    if (product.specs) {
      specsGrid.innerHTML = `
        <div class="spec-item">
          <span class="spec-label">Precious Metal</span>
          <span class="spec-val">${product.specs.metal}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Gemstone</span>
          <span class="spec-val">${product.specs.stone}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Carat / Weight</span>
          <span class="spec-val">${product.specs.caratWeight}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Atelier Origin</span>
          <span class="spec-val">${product.specs.origin}</span>
        </div>
      `;
    }

    // Recommendations
    const recsGrid = document.getElementById("pdpRecommendationsGrid");
    const recs = PRODUCTS_DATA.filter(p => p.id !== product.id).slice(0, 4);
    recsGrid.innerHTML = recs.map(p => this.createProductCardHTML(p)).join("");

    // Reset Pincode state
    const pincodeRes = document.getElementById("pincodeResult");
    if (pincodeRes) pincodeRes.style.display = "none";

    document.getElementById("pdpQtyValue").textContent = this.currentPdpQty;
    this.refreshIcons();
  }

  setPdpMainImage(imgUrl, clickedThumb) {
    const mainImg = document.getElementById("pdpMainImage");
    if (mainImg) mainImg.src = imgUrl;

    document.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
    if (clickedThumb) clickedThumb.classList.add("active");
  }

  selectPdpMetal(metal, btn) {
    this.selectedMetal = metal;
    document.getElementById("pdpSelectedMetalLabel").textContent = metal;
    document.querySelectorAll("#pdpMetalSwatches .metal-swatch-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  selectPdpSize(size, btn) {
    this.selectedSize = size;
    document.getElementById("pdpSelectedSizeLabel").textContent = size;
    document.querySelectorAll("#pdpSizeOptions .size-pill-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  incrementPdpQty() {
    this.currentPdpQty++;
    document.getElementById("pdpQtyValue").textContent = this.currentPdpQty;
  }

  decrementPdpQty() {
    if (this.currentPdpQty > 1) {
      this.currentPdpQty--;
      document.getElementById("pdpQtyValue").textContent = this.currentPdpQty;
    }
  }

  addCurrentPdpToCart() {
    store.addToCart(this.currentProduct, this.selectedSize, this.selectedMetal, this.currentPdpQty);
    this.showToast(`Added ${this.currentProduct.name} to your bag`);
    this.openCartDrawer();
  }

  togglePdpWishlist() {
    const added = store.toggleWishlist(this.currentProduct.id);
    const wishlistBtn = document.getElementById("pdpWishlistBtn");
    if (added) {
      wishlistBtn.classList.add("active");
      this.showToast(`Saved to your Wishlist`);
    } else {
      wishlistBtn.classList.remove("active");
      this.showToast(`Removed from your Wishlist`);
    }
  }

  // Delivery Pincode Checker
  checkPincode() {
    const input = document.getElementById("pincodeInput");
    const res = document.getElementById("pincodeResult");
    const pin = input.value.trim();

    if (!pin || pin.length !== 6 || isNaN(pin)) {
      res.style.display = "block";
      res.style.color = "#C0392B";
      res.innerHTML = "Please enter a valid 6-digit Indian postal code.";
      return;
    }

    // Realistic delivery estimation logic
    const days = pin.startsWith("11") || pin.startsWith("40") || pin.startsWith("56") ? 2 : 4;
    const now = new Date();
    const deliveryDate = new Date(now.setDate(now.getDate() + days));
    const dateFormatted = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });

    res.style.display = "block";
    res.style.color = "#2E7D32";
    res.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem;">
        <span>✓ <strong>Express Insured Delivery</strong> available to <strong>${pin}</strong></span>
      </div>
      <div style="color: var(--text-secondary); margin-top: 0.2rem; font-size: 0.76rem;">
        Estimated arrival by <strong>${dateFormatted}</strong> via BlueDart Apex Vault Courier.
      </div>
    `;
  }

  toggleAccordion(headerBtn) {
    const item = headerBtn.closest(".accordion-item");
    if (!item) return;

    const isOpen = item.classList.contains("open");
    item.classList.toggle("open", !isOpen);
  }

  // ==========================================
  // QUICK ADD & WISHLIST INTERACTIONS
  // ==========================================

  quickAdd(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    store.addToCart(product);
    this.showToast(`Added ${product.name} to your bag`);
    this.openCartDrawer();
  }

  toggleWishlist(productId, btnElement) {
    const added = store.toggleWishlist(productId);
    if (btnElement) {
      btnElement.classList.toggle("active", added);
    }
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const title = product ? product.name : "Item";
    this.showToast(added ? `Saved ${title} to Wishlist` : `Removed ${title} from Wishlist`);
  }

  // ==========================================
  // CART DRAWER CONTROLLER
  // ==========================================

  openCartDrawer() {
    this.closeAllDrawers();
    document.getElementById("drawerBackdrop").classList.add("open");
    document.getElementById("cartDrawer").classList.add("open");
    this.renderCartDrawer();
  }

  closeCartDrawer() {
    document.getElementById("drawerBackdrop").classList.remove("open");
    document.getElementById("cartDrawer").classList.remove("open");
  }

  onCartUpdated(detail) {
    // Update Badge
    const badge = document.getElementById("cartCountBadge");
    if (badge) {
      badge.textContent = detail.count;
      badge.style.display = detail.count > 0 ? "flex" : "none";
    }

    const drawerCount = document.getElementById("cartDrawerCount");
    if (drawerCount) drawerCount.textContent = detail.count;

    // Update Free Shipping Progress Bar
    const progressFill = document.getElementById("shippingBarProgress");
    const progressMsg = document.getElementById("shippingBarMessage");

    if (progressFill && progressMsg) {
      progressFill.style.width = `${detail.progress.percentage}%`;
      if (detail.progress.qualified) {
        progressMsg.innerHTML = `<span style="color: #2E7D32; font-weight: 500;">✦ You have unlocked complimentary insured courier delivery!</span>`;
      } else {
        progressMsg.innerHTML = `Add <strong>${formatINR(detail.progress.remaining)}</strong> more for complimentary shipping.`;
      }
    }

    // Update Subtotal
    const subtotalEl = document.getElementById("cartSubtotalValue");
    if (subtotalEl) subtotalEl.textContent = formatINR(detail.subtotal);

    // If drawer is open, re-render items
    if (document.getElementById("cartDrawer").classList.contains("open")) {
      this.renderCartDrawer();
    }
  }

  renderCartDrawer() {
    const container = document.getElementById("cartItemsList");
    const footer = document.getElementById("cartDrawerFooter");
    if (!container) return;

    if (store.cart.length === 0) {
      container.innerHTML = `
        <div class="drawer-empty-state">
          <i data-lucide="shopping-bag" size="48"></i>
          <h3>Your bag is empty</h3>
          <p>Discover our heirloom collections and begin your curation.</p>
          <button class="btn btn-outline" onclick="app.closeCartDrawer(); app.navigateToShop('all');">
            EXPLORE COLLECTIONS
          </button>
        </div>
      `;
      if (footer) footer.style.display = "none";
    } else {
      if (footer) footer.style.display = "block";
      container.innerHTML = store.cart.map(item => `
        <div class="drawer-item">
          <img src="${item.image}" alt="${item.name}" class="drawer-item-img">
          <div class="drawer-item-info">
            <div>
              <div class="drawer-item-title">${item.name}</div>
              <div class="drawer-item-meta">${item.metal} · ${item.size}</div>
              <div class="drawer-item-price">${formatINR(item.price * item.quantity)}</div>
            </div>
            <div class="drawer-item-controls">
              <div class="mini-stepper">
                <button type="button" onclick="store.updateCartQuantity('${item.key}', ${item.quantity - 1})">−</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="store.updateCartQuantity('${item.key}', ${item.quantity + 1})">+</button>
              </div>
              <button type="button" class="item-remove-btn" onclick="store.removeFromCart('${item.key}')">Remove</button>
            </div>
          </div>
        </div>
      `).join("");
    }

    this.refreshIcons();
  }

  handleCheckout() {
    this.closeCartDrawer();
    this.showToast("Directing to 256-Bit Encrypted Secure Checkout...");
    setTimeout(() => {
      alert(`✦ Order Confirmation Simulation\n\nSubtotal: ${formatINR(store.getCartSubtotal())}\nComplimentary Armored Courier Delivery\n\nThank you for choosing Amber & Shine Haute Joaillerie. A luxury concierge will verify your dispatch.`);
      store.clearCart();
    }, 800);
  }

  // ==========================================
  // WISHLIST DRAWER CONTROLLER
  // ==========================================

  openWishlistDrawer() {
    this.closeAllDrawers();
    document.getElementById("drawerBackdrop").classList.add("open");
    document.getElementById("wishlistDrawer").classList.add("open");
    this.renderWishlistDrawer();
  }

  closeWishlistDrawer() {
    document.getElementById("drawerBackdrop").classList.remove("open");
    document.getElementById("wishlistDrawer").classList.remove("open");
  }

  onWishlistUpdated(detail) {
    const badge = document.getElementById("wishlistCountBadge");
    if (badge) {
      badge.textContent = detail.count;
      badge.style.display = detail.count > 0 ? "flex" : "none";
    }

    const drawerCount = document.getElementById("wishlistDrawerCount");
    if (drawerCount) drawerCount.textContent = detail.count;

    if (document.getElementById("wishlistDrawer").classList.contains("open")) {
      this.renderWishlistDrawer();
    }
  }

  renderWishlistDrawer() {
    const container = document.getElementById("wishlistItemsList");
    if (!container) return;

    if (store.wishlist.length === 0) {
      container.innerHTML = `
        <div class="drawer-empty-state">
          <i data-lucide="heart" size="48"></i>
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart icon on any jewel to preserve it in your private salon.</p>
          <button class="btn btn-outline" onclick="app.closeWishlistDrawer(); app.navigateToShop('all');">
            DISCOVER PIECES
          </button>
        </div>
      `;
    } else {
      const wishlistProducts = store.wishlist
        .map(id => PRODUCTS_DATA.find(p => p.id === id))
        .filter(Boolean);

      container.innerHTML = wishlistProducts.map(product => `
        <div class="drawer-item">
          <img src="${product.images[0]}" alt="${product.name}" class="drawer-item-img">
          <div class="drawer-item-info">
            <div>
              <div class="drawer-item-title">${product.name}</div>
              <div class="drawer-item-meta">${product.category} · ${product.collection}</div>
              <div class="drawer-item-price">${formatINR(product.price)}</div>
            </div>
            <div style="display: flex; gap: 0.8rem; margin-top: 0.8rem;">
              <button class="btn btn-primary" style="padding: 0.45rem 0.8rem; font-size: 0.68rem;" onclick="app.moveWishlistToBag('${product.id}')">
                MOVE TO BAG
              </button>
              <button class="item-remove-btn" onclick="app.toggleWishlist('${product.id}')">
                Remove
              </button>
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

  closeAllDrawers() {
    document.getElementById("drawerBackdrop").classList.remove("open");
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("wishlistDrawer").classList.remove("open");
    document.getElementById("mobileNavDrawer").classList.remove("open");
  }

  // ==========================================
  // SEARCH MODAL
  // ==========================================

  openSearch() {
    document.getElementById("searchModal").classList.add("open");
    const input = document.getElementById("searchLargeInput");
    if (input) {
      input.focus();
      this.handleSearchInput(input.value);
    }
  }

  closeSearch() {
    document.getElementById("searchModal").classList.remove("open");
  }

  clearSearchInput() {
    const input = document.getElementById("searchLargeInput");
    if (input) {
      input.value = "";
      this.handleSearchInput("");
      input.focus();
    }
  }

  applySearchQuery(tag) {
    const input = document.getElementById("searchLargeInput");
    if (input) {
      input.value = tag;
      this.handleSearchInput(tag);
    }
  }

  handleSearchInput(query) {
    const container = document.getElementById("searchResultsGrid");
    if (!container) return;

    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      // Show default top picks
      const preview = PRODUCTS_DATA.slice(0, 3);
      container.innerHTML = preview.map(p => this.createProductCardHTML(p)).join("");
      this.refreshIcons();
      return;
    }

    const matched = PRODUCTS_DATA.filter(p => 
      p.name.toLowerCase().includes(cleanQuery) ||
      p.category.toLowerCase().includes(cleanQuery) ||
      p.collection.toLowerCase().includes(cleanQuery) ||
      p.description.toLowerCase().includes(cleanQuery)
    );

    if (matched.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
          <p style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-secondary);">No creations found matching “${query}”.</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">Try searching for “Gold”, “Ring”, “Pearl”, or “Pendant”.</p>
        </div>
      `;
    } else {
      container.innerHTML = matched.map(p => this.createProductCardHTML(p)).join("");
    }

    this.refreshIcons();
  }

  // ==========================================
  // SIZE GUIDE & MODALS
  // ==========================================

  openSizeGuide() {
    document.getElementById("sizeGuideModal").classList.add("open");
  }

  closeSizeGuide() {
    document.getElementById("sizeGuideModal").classList.remove("open");
  }

  closeSizeGuideOnBackdrop(e) {
    if (e.target.id === "sizeGuideModal") {
      this.closeSizeGuide();
    }
  }

  // Account Modal
  openAccountModal() {
    document.getElementById("accountModal").classList.add("open");
  }

  closeAccountModal() {
    document.getElementById("accountModal").classList.remove("open");
  }

  closeAccountModalOnBackdrop(e) {
    if (e.target.id === "accountModal") {
      this.closeAccountModal();
    }
  }

  handleAccountSubmit(e) {
    e.preventDefault();
    this.closeAccountModal();
    this.showToast("Welcome back to your Amber & Shine Private Salon.");
  }

  // Mobile Nav
  openMobileNav() {
    this.closeAllDrawers();
    document.getElementById("drawerBackdrop").classList.add("open");
    document.getElementById("mobileNavDrawer").classList.add("open");
  }

  closeMobileNav() {
    document.getElementById("drawerBackdrop").classList.remove("open");
    document.getElementById("mobileNavDrawer").classList.remove("open");
  }

  // Newsletter
  handleNewsletter(e) {
    e.preventDefault();
    const input = document.getElementById("newsletterEmail");
    if (input && input.value) {
      this.showToast("Welcome to our salon. A private invitation has been dispatched.");
      input.value = "";
    }
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
      <i data-lucide="sparkles" size="16" style="color: var(--gold-champagne); flex-shrink: 0;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    this.refreshIcons();

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 3500);
  }
}

// Instantiate Global App
const app = new AmberShineApp();

