// AURA CHRONOS — Core Store, UI Shell, Cart, Wishlist, Currency, Search & Interactions

const AuraApp = (() => {
    const STORAGE_KEYS = {
        CART: 'aura_cart_v2',
        WISHLIST: 'aura_wishlist_v2',
        CURRENCY: 'aura_currency_v2',
        ORDERS: 'aura_orders_v2',
        APPOINTMENTS: 'aura_appointments_v2',
        SERVICES: 'aura_services_v2',
        NEWSLETTER: 'aura_newsletter_v2'
    };

    // ---------- STATE HELPERS ----------
    const loadJSON = (key, fallback) => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    };

    const saveJSON = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Storage unavailable', e);
        }
    };

    const getCurrency = () => localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'EGP';
    const setCurrency = (code) => {
        if (!CURRENCIES[code]) return;
        localStorage.setItem(STORAGE_KEYS.CURRENCY, code);
        document.querySelectorAll('.currency-select').forEach(sel => sel.value = code);
        renderCartDrawer();
        window.dispatchEvent(new CustomEvent('aura:currencyChange', { detail: code }));
        showToast(`Currency updated to ${code}`);
    };

    const formatPrice = (egpAmount) => {
        const curr = CURRENCIES[getCurrency()] || CURRENCIES.EGP;
        const converted = Math.round(egpAmount * curr.rate);
        const formatted = converted.toLocaleString('en-US');
        return curr.prefix ? `${curr.symbol}${formatted}` : `${formatted} ${curr.symbol}`;
    };

    // ---------- CART ----------
    const getCart = () => loadJSON(STORAGE_KEYS.CART, []);
    const saveCart = (cart) => {
        saveJSON(STORAGE_KEYS.CART, cart);
        updateNavBadges();
        renderCartDrawer();
    };

    const addToCart = (productId, qty = 1, engraving = '') => {
        const product = products.find(p => p.id === Number(productId));
        if (!product) return;
        const cart = getCart();
        const existing = cart.find(item => item.id === product.id && (item.engraving || '') === (engraving || ''));
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ id: product.id, qty, engraving: engraving.trim() });
        }
        saveCart(cart);
        showToast(`${product.name} added to your acquisition bag`);
        openCartDrawer();
    };

    const updateCartQty = (index, delta) => {
        const cart = getCart();
        if (!cart[index]) return;
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
    };

    const removeCartItem = (index) => {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
    };

    const clearCart = () => saveCart([]);

    const getCartCount = () => getCart().reduce((sum, item) => sum + item.qty, 0);
    const getCartSubtotalEGP = () => getCart().reduce((sum, item) => {
        const p = products.find(pr => pr.id === item.id);
        return sum + (p ? p.priceNum * item.qty : 0);
    }, 0);

    // ---------- WISHLIST ----------
    const getWishlist = () => loadJSON(STORAGE_KEYS.WISHLIST, []);
    const isWishlisted = (id) => getWishlist().includes(Number(id));
    const toggleWishlist = (id) => {
        const numId = Number(id);
        const list = getWishlist();
        const idx = list.indexOf(numId);
        const product = products.find(p => p.id === numId);
        if (idx > -1) {
            list.splice(idx, 1);
            showToast(`${product ? product.name : 'Timepiece'} removed from saved vault`);
        } else {
            list.push(numId);
            showToast(`${product ? product.name : 'Timepiece'} saved to your vault`);
        }
        saveJSON(STORAGE_KEYS.WISHLIST, list);
        updateNavBadges();
        document.querySelectorAll(`[data-wishlist-id="${numId}"]`).forEach(btn => {
            btn.classList.toggle('active', idx === -1);
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = idx === -1 ? 'fas fa-heart' : 'far fa-heart';
            }
        });
        window.dispatchEvent(new CustomEvent('aura:wishlistChange'));
    };

    // ---------- ORDERS / APPOINTMENTS / SERVICES ----------
    const getOrders = () => loadJSON(STORAGE_KEYS.ORDERS, []);
    const saveOrder = (order) => {
        const orders = getOrders();
        orders.unshift(order);
        saveJSON(STORAGE_KEYS.ORDERS, orders);
    };

    const getAppointments = () => loadJSON(STORAGE_KEYS.APPOINTMENTS, []);
    const saveAppointment = (appt) => {
        const list = getAppointments();
        list.unshift(appt);
        saveJSON(STORAGE_KEYS.APPOINTMENTS, list);
    };

    const saveServiceRequest = (req) => {
        const list = loadJSON(STORAGE_KEYS.SERVICES, []);
        list.unshift(req);
        saveJSON(STORAGE_KEYS.SERVICES, list);
    };

    // ---------- TOASTS ----------
    const showToast = (message, icon = 'fa-check-circle') => {
        let container = document.getElementById('auraToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'auraToastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(30px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    };

    // ---------- SHARED SHELL (NAV, DRAWERS, MODALS, FOOTER) ----------
    const getCurrentPage = () => {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        return path.toLowerCase();
    };

    const buildNav = () => {
        const page = getCurrentPage();
        const links = [
            { href: 'index.html', label: 'Home' },
            { href: 'collections.html', label: 'Collections' },
            { href: 'services.html', label: 'Services' },
            { href: 'magazine.html', label: 'Magazine' },
            { href: 'boutiques.html', label: 'Boutiques' }
        ];

        const navLinksHTML = links.map(l =>
            `<a href="${l.href}" class="${page === l.href || (page === '' && l.href === 'index.html') ? 'active' : ''}">${l.label}</a>`
        ).join('');

        const curr = getCurrency();
        const currOptions = Object.keys(CURRENCIES).map(c =>
            `<option value="${c}" ${c === curr ? 'selected' : ''}>${c}</option>`
        ).join('');

        const navHost = document.getElementById('siteNav');
        if (navHost) {
            navHost.innerHTML = `
                <nav class="site-nav" id="mainNavbar">
                    <a href="index.html" class="logo">
                        <div>
                            AURA
                            <span class="logo-sub">CHRONOS · 1924</span>
                        </div>
                    </a>
                    <div class="nav-links">${navLinksHTML}</div>
                    <div class="nav-actions">
                        <select class="currency-select" aria-label="Currency selector" onchange="AuraApp.setCurrency(this.value)">
                            ${currOptions}
                        </select>
                        <button class="icon-btn" title="Search Timepieces" aria-label="Search" onclick="AuraApp.openSearchModal()">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="icon-btn" title="Saved Vault" aria-label="Wishlist" onclick="AuraApp.openWishlistModal()">
                            <i class="far fa-heart"></i>
                            <span class="icon-badge empty" id="navWishlistBadge">0</span>
                        </button>
                        <button class="icon-btn" title="Acquisition Bag" aria-label="Shopping Bag" onclick="AuraApp.openCartDrawer()">
                            <i class="fas fa-shopping-bag"></i>
                            <span class="icon-badge empty" id="navCartBadge">0</span>
                        </button>
                        <a href="boutiques.html#appointment" class="btn nav-cta">Book Viewing</a>
                        <button class="mobile-menu-btn" aria-label="Open Menu" onclick="AuraApp.toggleMobileDrawer(true)">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </nav>
            `;
        }

        // Inject Mobile Drawer, Cart Drawer, Search Modal, Wishlist Modal, Orders Modal, Quick View Modal
        if (!document.getElementById('auraGlobalOverlays')) {
            const overlays = document.createElement('div');
            overlays.id = 'auraGlobalOverlays';
            overlays.innerHTML = `
                <!-- Mobile Drawer -->
                <div class="mobile-drawer-overlay" id="mobileDrawerOverlay" onclick="AuraApp.toggleMobileDrawer(false)"></div>
                <aside class="mobile-drawer" id="mobileDrawer" aria-label="Mobile Navigation">
                    <div>
                        <div class="mobile-drawer-header">
                            <a href="index.html" class="logo" style="font-size:1.35rem;">AURA</a>
                            <button class="icon-btn" aria-label="Close Menu" onclick="AuraApp.toggleMobileDrawer(false)">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="mobile-drawer-links">
                            ${links.map(l => `<a href="${l.href}" class="${page === l.href ? 'active' : ''}"><span>${l.label}</span><i class="fas fa-chevron-right" style="font-size:0.7rem;opacity:0.5;"></i></a>`).join('')}
                            <a href="checkout.html"><span>Checkout</span><i class="fas fa-chevron-right" style="font-size:0.7rem;opacity:0.5;"></i></a>
                        </div>
                    </div>
                    <div class="mobile-drawer-footer">
                        <div style="display:flex;align-items:center;justify-content:space-between;">
                            <span style="font-size:0.75rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);">Currency</span>
                            <select class="currency-select" style="display:block;" onchange="AuraApp.setCurrency(this.value)">${currOptions}</select>
                        </div>
                        <button class="btn btn-ghost btn-sm" style="width:100%;" onclick="AuraApp.toggleMobileDrawer(false); AuraApp.openOrdersModal();">
                            <i class="fas fa-receipt"></i> My Orders & Bookings
                        </button>
                        <a href="boutiques.html#appointment" class="btn btn-fill btn-sm" style="width:100%;">Book Private Viewing</a>
                    </div>
                </aside>

                <!-- Cart Drawer -->
                <div class="drawer-overlay" id="cartOverlay" onclick="AuraApp.closeCartDrawer()"></div>
                <aside class="cart-drawer" id="cartDrawer" aria-label="Acquisition Bag">
                    <div class="cart-header">
                        <div>
                            <h3 class="serif" style="font-size:1.35rem;">Acquisition Bag</h3>
                            <span style="font-size:0.75rem;color:var(--text-muted);">Complimentary Armored Insured Delivery</span>
                        </div>
                        <button class="icon-btn" aria-label="Close Bag" onclick="AuraApp.closeCartDrawer()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="cart-body" id="cartDrawerBody"></div>
                    <div class="cart-footer" id="cartDrawerFooter"></div>
                </aside>

                <!-- Search Modal -->
                <div class="modal-overlay" id="searchModal" onclick="if(event.target===this) AuraApp.closeModal('searchModal')">
                    <div class="modal-box" style="max-width:640px;">
                        <button class="modal-close" aria-label="Close" onclick="AuraApp.closeModal('searchModal')"><i class="fas fa-times"></i></button>
                        <span class="section-kicker">Vault Search</span>
                        <h3 class="serif" style="font-size:1.7rem;margin-bottom:1.1rem;">Find Your Timepiece</h3>
                        <div class="search-input-wrap">
                            <i class="fas fa-search"></i>
                            <input type="text" id="globalSearchInput" placeholder="Search by model, brand, caliber, or material..." oninput="AuraApp.handleGlobalSearch(this.value)">
                        </div>
                        <div class="search-results-list" id="globalSearchResults"></div>
                    </div>
                </div>

                <!-- Wishlist Modal -->
                <div class="modal-overlay" id="wishlistModal" onclick="if(event.target===this) AuraApp.closeModal('wishlistModal')">
                    <div class="modal-box" style="max-width:680px;">
                        <button class="modal-close" aria-label="Close" onclick="AuraApp.closeModal('wishlistModal')"><i class="fas fa-times"></i></button>
                        <span class="section-kicker">Personal Curation</span>
                        <h3 class="serif" style="font-size:1.7rem;margin-bottom:1.25rem;">Saved Vault Timepieces</h3>
                        <div id="wishlistModalBody"></div>
                    </div>
                </div>

                <!-- Orders & Appointments Modal -->
                <div class="modal-overlay" id="ordersModal" onclick="if(event.target===this) AuraApp.closeModal('ordersModal')">
                    <div class="modal-box" style="max-width:700px;">
                        <button class="modal-close" aria-label="Close" onclick="AuraApp.closeModal('ordersModal')"><i class="fas fa-times"></i></button>
                        <span class="section-kicker">Client Dossier</span>
                        <h3 class="serif" style="font-size:1.7rem;margin-bottom:1.25rem;">My Acquisitions & Appointments</h3>
                        <div id="ordersModalBody"></div>
                    </div>
                </div>

                <!-- Quick View Modal -->
                <div class="modal-overlay" id="quickViewModal" onclick="if(event.target===this) AuraApp.closeModal('quickViewModal')">
                    <div class="modal-box" style="max-width:860px;">
                        <button class="modal-close" aria-label="Close" onclick="AuraApp.closeModal('quickViewModal')"><i class="fas fa-times"></i></button>
                        <div id="quickViewBody"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlays);
        }

        updateNavBadges();
        renderCartDrawer();
    };

    const buildFooter = () => {
        const footerHost = document.getElementById('siteFooter');
        if (!footerHost) return;
        footerHost.innerHTML = `
            <footer class="site-footer">
                <div class="footer-grid">
                    <div>
                        <div class="footer-logo">AURA CHRONOS</div>
                        <p style="color:var(--text-muted);font-size:0.9rem;max-width:320px;margin-bottom:1.25rem;">
                            Geneva-born haute horlogerie & authenticated collector vault. Celebrating a century of precision, provenance, and timeless design.
                        </p>
                        <div class="social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="https://x.com" target="_blank" rel="noopener" aria-label="X"><i class="fab fa-twitter"></i></a>
                            <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div class="footer-col">
                        <h4>Maison</h4>
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="collections.html">All Collections</a></li>
                            <li><a href="services.html">Atelier Services</a></li>
                            <li><a href="magazine.html">Horology Journal</a></li>
                            <li><a href="boutiques.html">Global Boutiques</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Client Care</h4>
                        <ul>
                            <li><button onclick="AuraApp.openOrdersModal()">Track My Orders</button></li>
                            <li><button onclick="AuraApp.openWishlistModal()">Saved Vault</button></li>
                            <li><a href="boutiques.html#appointment">Book Private Viewing</a></li>
                            <li><a href="services.html#verify">Serial Verification</a></li>
                            <li><a href="services.html#serviceRequest">Request Restoration</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Concierge</h4>
                        <ul>
                            <li style="color:var(--text-muted);font-size:0.9rem;"><i class="fas fa-map-marker-alt" style="color:var(--primary);width:18px;"></i> Cairo · Geneva · London</li>
                            <li><a href="tel:+201008841924"><i class="fas fa-phone" style="color:var(--primary);width:18px;"></i> +20 100 884 1924</a></li>
                            <li><a href="mailto:concierge@aurachronos.eg"><i class="fas fa-envelope" style="color:var(--primary);width:18px;"></i> concierge@aurachronos.eg</a></li>
                            <li style="color:var(--text-muted);font-size:0.82rem;margin-top:0.5rem;"><i class="fas fa-shield-alt" style="color:var(--primary);width:18px;"></i> 10-Year International Warranty</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <span>&copy; 2026 Aura Chronos Horology. All rights reserved.</span>
                    <span>Authenticated Luxury · 256-Bit Encrypted Checkout</span>
                </div>
            </footer>
        `;
    };

    const updateNavBadges = () => {
        const cartCount = getCartCount();
        const wishCount = getWishlist().length;
        const cartBadge = document.getElementById('navCartBadge');
        const wishBadge = document.getElementById('navWishlistBadge');
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.classList.toggle('empty', cartCount === 0);
        }
        if (wishBadge) {
            wishBadge.textContent = wishCount;
            wishBadge.classList.toggle('empty', wishCount === 0);
        }
    };

    // ---------- DRAWERS & MODALS ----------
    const toggleMobileDrawer = (open) => {
        document.getElementById('mobileDrawer')?.classList.toggle('open', open);
        document.getElementById('mobileDrawerOverlay')?.classList.toggle('open', open);
        document.body.classList.toggle('no-scroll', open);
    };

    const openCartDrawer = () => {
        renderCartDrawer();
        document.getElementById('cartDrawer')?.classList.add('open');
        document.getElementById('cartOverlay')?.classList.add('open');
        document.body.classList.add('no-scroll');
    };

    const closeCartDrawer = () => {
        document.getElementById('cartDrawer')?.classList.remove('open');
        document.getElementById('cartOverlay')?.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };

    const openModal = (id) => {
        document.getElementById(id)?.classList.add('open');
        document.body.classList.add('no-scroll');
    };

    const closeModal = (id) => {
        document.getElementById(id)?.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };

    const renderCartDrawer = () => {
        const body = document.getElementById('cartDrawerBody');
        const footer = document.getElementById('cartDrawerFooter');
        if (!body || !footer) return;
        const cart = getCart();

        if (cart.length === 0) {
            body.innerHTML = `
                <div style="text-align:center;padding:3.5rem 1rem;">
                    <i class="fas fa-shopping-bag" style="font-size:2.8rem;color:var(--glass-border);margin-bottom:1rem;"></i>
                    <h4 class="serif" style="font-size:1.3rem;margin-bottom:0.5rem;">Your Bag is Empty</h4>
                    <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;">Explore our curated horological masterpieces to begin your acquisition.</p>
                    <a href="collections.html" class="btn btn-fill btn-sm" onclick="AuraApp.closeCartDrawer()">Explore Collections</a>
                </div>
            `;
            footer.innerHTML = '';
            return;
        }

        body.innerHTML = cart.map((item, idx) => {
            const p = products.find(pr => pr.id === item.id);
            if (!p) return '';
            return `
                <div class="cart-item">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="cart-item-info">
                        <div style="display:flex;justify-content:space-between;align-items:start;gap:0.5rem;">
                            <div>
                                <div style="font-size:0.65rem;letter-spacing:1.8px;color:var(--primary);text-transform:uppercase;">${p.brand}</div>
                                <a href="product.html?id=${p.id}" style="font-family:'Playfair Display',serif;font-size:1.05rem;text-decoration:none;">${p.name}</a>
                            </div>
                            <button class="qty-btn" title="Remove" onclick="AuraApp.removeCartItem(${idx})"><i class="fas fa-trash-alt" style="font-size:0.78rem;color:var(--text-muted);"></i></button>
                        </div>
                        ${item.engraving ? `<div style="font-size:0.74rem;color:var(--text-muted);margin-top:0.2rem;"><i class="fas fa-pen-nib" style="color:var(--primary);"></i> Engraving: "${item.engraving}"</div>` : ''}
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.5rem;">
                            <div class="qty-controls">
                                <button class="qty-btn" onclick="AuraApp.updateCartQty(${idx}, -1)">−</button>
                                <span style="font-size:0.85rem;min-width:16px;text-align:center;">${item.qty}</span>
                                <button class="qty-btn" onclick="AuraApp.updateCartQty(${idx}, 1)">+</button>
                            </div>
                            <span class="price" style="font-size:0.95rem;">${formatPrice(p.priceNum * item.qty)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const subtotal = getCartSubtotalEGP();
        footer.innerHTML = `
            <div class="summary-row"><span>Insured Armored Shipping</span><span style="color:var(--success);">Complimentary</span></div>
            <div class="summary-row total"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
            <a href="checkout.html" class="btn btn-fill" style="width:100%;margin-top:1rem;">Proceed to Secure Checkout</a>
        `;
    };

    // ---------- SEARCH ----------
    const openSearchModal = () => {
        openModal('searchModal');
        handleGlobalSearch('');
        setTimeout(() => document.getElementById('globalSearchInput')?.focus(), 100);
    };

    const handleGlobalSearch = (query) => {
        const container = document.getElementById('globalSearchResults');
        if (!container) return;
        const q = (query || '').trim().toLowerCase();
        const matched = q
            ? products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.ref.toLowerCase().includes(q) ||
                p.specs.caseMaterial.toLowerCase().includes(q)
            )
            : products.slice(0, 5);

        if (matched.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:2rem 0;">No timepieces match "${query}". Try searching "Rolex", "Titanium", or "Chronograph".</p>`;
            return;
        }

        container.innerHTML = matched.map(p => `
            <a href="product.html?id=${p.id}" class="search-result-row">
                <img src="${p.img}" alt="${p.name}">
                <div style="flex:1;min-width:0;">
                    <div style="font-size:0.68rem;letter-spacing:1.8px;color:var(--primary);text-transform:uppercase;">${p.brand} · ${p.category}</div>
                    <div class="serif" style="font-size:1.05rem;">${p.name}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted);">${p.specs.diameter} · ${p.specs.caseMaterial}</div>
                </div>
                <div class="price" style="font-size:0.92rem;white-space:nowrap;">${formatPrice(p.priceNum)}</div>
            </a>
        `).join('');
    };

    // ---------- WISHLIST MODAL ----------
    const openWishlistModal = () => {
        const body = document.getElementById('wishlistModalBody');
        const list = getWishlist();
        if (body) {
            if (list.length === 0) {
                body.innerHTML = `
                    <div style="text-align:center;padding:2.5rem 1rem;">
                        <i class="far fa-heart" style="font-size:2.5rem;color:var(--glass-border);margin-bottom:1rem;"></i>
                        <p style="color:var(--text-muted);margin-bottom:1.5rem;">You haven't saved any timepieces to your vault yet.</p>
                        <a href="collections.html" class="btn btn-fill btn-sm">Browse Collections</a>
                    </div>
                `;
            } else {
                body.innerHTML = `<div class="search-results-list">` + list.map(id => {
                    const p = products.find(pr => pr.id === id);
                    if (!p) return '';
                    return `
                        <div class="search-result-row" style="justify-content:space-between;">
                            <a href="product.html?id=${p.id}" style="display:flex;align-items:center;gap:1rem;text-decoration:none;flex:1;">
                                <img src="${p.img}" alt="${p.name}">
                                <div>
                                    <div style="font-size:0.68rem;letter-spacing:1.8px;color:var(--primary);text-transform:uppercase;">${p.brand}</div>
                                    <div class="serif" style="font-size:1.05rem;">${p.name}</div>
                                    <div class="price" style="font-size:0.88rem;">${formatPrice(p.priceNum)}</div>
                                </div>
                            </a>
                            <div style="display:flex;gap:0.5rem;">
                                <button class="btn btn-fill btn-sm" onclick="AuraApp.closeModal('wishlistModal'); AuraApp.addToCart(${p.id});">Add</button>
                                <button class="icon-btn" onclick="AuraApp.toggleWishlist(${p.id}); AuraApp.openWishlistModal();" title="Remove"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                    `;
                }).join('') + `</div>`;
            }
        }
        openModal('wishlistModal');
    };

    // ---------- ORDERS & BOOKINGS MODAL ----------
    const openOrdersModal = () => {
        const body = document.getElementById('ordersModalBody');
        const orders = getOrders();
        const appts = getAppointments();
        if (body) {
            let html = '';
            if (orders.length === 0 && appts.length === 0) {
                html = `
                    <div style="text-align:center;padding:2.5rem 1rem;">
                        <i class="fas fa-box-open" style="font-size:2.5rem;color:var(--glass-border);margin-bottom:1rem;"></i>
                        <p style="color:var(--text-muted);margin-bottom:1.5rem;">No completed acquisitions or boutique appointments yet.</p>
                        <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
                            <a href="collections.html" class="btn btn-fill btn-sm">Explore Timepieces</a>
                            <a href="boutiques.html#appointment" class="btn btn-sm">Book Viewing</a>
                        </div>
                    </div>
                `;
            } else {
                if (orders.length > 0) {
                    html += `<h4 style="color:var(--primary);font-size:0.78rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:0.85rem;">Acquisitions (${orders.length})</h4>`;
                    html += orders.map(o => `
                        <div style="border:1px solid var(--glass-border);border-radius:8px;padding:1rem 1.2rem;margin-bottom:0.85rem;background:var(--glass);">
                            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem;">
                                <strong>Ref: ${o.ref}</strong>
                                <span style="color:var(--success);font-size:0.8rem;"><i class="fas fa-check-circle"></i> ${o.status}</span>
                            </div>
                            <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.4rem;">${o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</div>
                            <div style="display:flex;justify-content:space-between;font-size:0.85rem;">
                                <span style="color:var(--text-muted);">${o.date} · ${o.delivery}</span>
                                <span class="price">${formatPrice(o.totalEGP)}</span>
                            </div>
                        </div>
                    `).join('');
                }
                if (appts.length > 0) {
                    html += `<h4 style="color:var(--primary);font-size:0.78rem;letter-spacing:2px;text-transform:uppercase;margin:1.25rem 0 0.85rem;">Boutique Appointments (${appts.length})</h4>`;
                    html += appts.map(a => `
                        <div style="border:1px solid var(--glass-border);border-radius:8px;padding:1rem 1.2rem;margin-bottom:0.85rem;background:var(--glass);">
                            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.35rem;">
                                <strong>${a.boutique}</strong>
                                <span style="color:var(--primary);font-size:0.8rem;">${a.ref}</span>
                            </div>
                            <div style="font-size:0.85rem;color:var(--text-muted);">${a.date} at ${a.time} · Viewing: ${a.watch}</div>
                        </div>
                    `).join('');
                }
            }
            body.innerHTML = html;
        }
        openModal('ordersModal');
    };

    // ---------- QUICK VIEW MODAL ----------
    const openQuickView = (productId) => {
        const p = products.find(pr => pr.id === Number(productId));
        if (!p) return;
        const body = document.getElementById('quickViewBody');
        if (body) {
            body.innerHTML = `
                <div class="split-section" style="gap:2rem;">
                    <div style="border-radius:10px;overflow:hidden;border:1px solid var(--glass-border);">
                        <img src="${p.img}" alt="${p.name}" style="width:100%;aspect-ratio:1/1;object-fit:cover;">
                    </div>
                    <div>
                        <span class="section-kicker">${p.brand} · ${p.ref}</span>
                        <h2 class="serif" style="font-size:2rem;margin-bottom:0.5rem;">${p.name}</h2>
                        <div class="price" style="font-size:1.5rem;margin-bottom:1rem;">${formatPrice(p.priceNum)}</div>
                        <p style="color:var(--text-muted);font-size:0.95rem;margin-bottom:1.25rem;">${p.desc}</p>
                        <div class="specs-grid" style="margin-top:0;padding-top:1rem;margin-bottom:1.5rem;">
                            <div class="spec-item"><div class="spec-label">Caliber</div><div class="spec-value">${p.specs.caliber}</div></div>
                            <div class="spec-item"><div class="spec-label">Diameter</div><div class="spec-value">${p.specs.diameter}</div></div>
                            <div class="spec-item"><div class="spec-label">Case</div><div class="spec-value">${p.specs.caseMaterial}</div></div>
                            <div class="spec-item"><div class="spec-label">Reserve</div><div class="spec-value">${p.specs.powerReserve}</div></div>
                        </div>
                        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                            <button class="btn btn-fill btn-sm" style="flex:1;" onclick="AuraApp.closeModal('quickViewModal'); AuraApp.addToCart(${p.id});">Add to Bag</button>
                            <a href="product.html?id=${p.id}" class="btn btn-sm" style="flex:1;">Full Specifications</a>
                        </div>
                    </div>
                </div>
            `;
        }
        openModal('quickViewModal');
    };

    // ---------- REUSABLE WATCH CARD RENDERER ----------
    const renderWatchCard = (p) => {
        const wished = isWishlisted(p.id);
        return `
            <article class="card watch-card reveal">
                <div class="watch-card-media">
                    <span class="watch-badge">${p.badge}</span>
                    <button class="watch-wishlist-btn ${wished ? 'active' : ''}" data-wishlist-id="${p.id}" aria-label="Save ${p.name}" onclick="event.preventDefault(); AuraApp.toggleWishlist(${p.id});">
                        <i class="${wished ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <a href="product.html?id=${p.id}">
                        <img src="${p.img}" alt="${p.name}" loading="lazy">
                    </a>
                    <div class="watch-quick-actions">
                        <button class="watch-quick-btn" onclick="AuraApp.openQuickView(${p.id})">Quick View</button>
                        <button class="watch-quick-btn primary" onclick="AuraApp.addToCart(${p.id})">Add to Bag</button>
                    </div>
                </div>
                <div class="watch-card-body">
                    <div class="watch-brand">${p.brand} · ${p.category}</div>
                    <a href="product.html?id=${p.id}" class="watch-title">${p.name}</a>
                    <div class="watch-specs-mini">${p.specs.diameter} · ${p.specs.caseMaterial}</div>
                    <div class="watch-card-footer">
                        <span class="price">${formatPrice(p.priceNum)}</span>
                        <a href="product.html?id=${p.id}" style="font-size:0.74rem;letter-spacing:1.6px;text-transform:uppercase;color:var(--text-muted);text-decoration:none;">Details <i class="fas fa-arrow-right" style="font-size:0.65rem;color:var(--primary);"></i></a>
                    </div>
                </div>
            </article>
        `;
    };

    // ---------- REVEAL OBSERVER & CURSOR ----------
    const observeReveals = () => {
        const elements = document.querySelectorAll('.reveal:not(.visible)');
        if (!('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('visible'));
            return;
        }
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        elements.forEach(el => obs.observe(el));
    };

    const initCursor = () => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
        let x = 0, y = 0;
        document.addEventListener('mousemove', (e) => {
            x = e.clientX;
            y = e.clientY;
            cursor.classList.add('visible');
            cursor.style.transform = `translate(${x - cursor.offsetWidth / 2}px, ${y - cursor.offsetHeight / 2}px)`;
        });
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .card, input, select')) {
                cursor.classList.add('active');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .card, input, select')) {
                cursor.classList.remove('active');
            }
        });
    };

    const initNavbarScroll = () => {
        const onScroll = () => {
            const nav = document.getElementById('mainNavbar');
            if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    };

    const initKeyboardShortcuts = () => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                toggleMobileDrawer(false);
                closeCartDrawer();
                ['searchModal', 'wishlistModal', 'ordersModal', 'quickViewModal', 'articleModal'].forEach(closeModal);
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                openSearchModal();
            }
        });
    };

    // ---------- INIT ----------
    const init = () => {
        buildNav();
        buildFooter();
        initNavbarScroll();
        initCursor();
        initKeyboardShortcuts();
        observeReveals();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        getCurrency,
        setCurrency,
        formatPrice,
        getCart,
        addToCart,
        updateCartQty,
        removeCartItem,
        clearCart,
        getCartSubtotalEGP,
        getWishlist,
        isWishlisted,
        toggleWishlist,
        getOrders,
        saveOrder,
        getAppointments,
        saveAppointment,
        saveServiceRequest,
        showToast,
        toggleMobileDrawer,
        openCartDrawer,
        closeCartDrawer,
        openModal,
        closeModal,
        openSearchModal,
        handleGlobalSearch,
        openWishlistModal,
        openOrdersModal,
        openQuickView,
        renderWatchCard,
        observeReveals,
        STORAGE_KEYS
    };
})();
