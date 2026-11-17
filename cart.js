/* ==========================================================================
   Stepth Essentials — Shopping Cart Logic
   Uses localStorage for persistence. Cart object shape:
   { items: [{ id, qty, variations: {size:'M', color:'Black'} }], promo: 'CODE' }
   ========================================================================== */

const CART_KEY = 'stepth_cart_v1';
const WISHLIST_KEY = 'stepth_wishlist_v1';

// --- Cart ---
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [], promo: null };
  } catch (e) {
    return { items: [], promo: null };
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty = 1, variations = {}) {
  const cart = getCart();
  const key = productId + '|' + JSON.stringify(variations);
  const existing = cart.items.find(i => (i.id + '|' + JSON.stringify(i.variations)) === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ id: productId, qty, variations });
  }
  saveCart(cart);
  showToast('Added to cart', 'success');
  return cart;
}

function removeFromCart(productId, variations = {}) {
  const cart = getCart();
  const key = productId + '|' + JSON.stringify(variations);
  cart.items = cart.items.filter(i => (i.id + '|' + JSON.stringify(i.variations)) !== key);
  saveCart(cart);
}

function updateCartQty(productId, variations, qty) {
  if (qty < 1) return removeFromCart(productId, variations);
  const cart = getCart();
  const key = productId + '|' + JSON.stringify(variations);
  const item = cart.items.find(i => (i.id + '|' + JSON.stringify(i.variations)) === key);
  if (item) {
    item.qty = qty;
    saveCart(cart);
  }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

function cartCount() {
  const cart = getCart();
  return cart.items.reduce((sum, i) => sum + i.qty, 0);
}

function cartSubtotal() {
  const cart = getCart();
  return cart.items.reduce((sum, i) => {
    const p = getProductById(i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

// --- Promo codes ---
const PROMO_CODES = {
  'WELCOME10': { type: 'percent', value: 10, label: '10% off welcome discount' },
  'STEPH15': { type: 'percent', value: 15, label: '15% off (founder launch promo)' },
  'FREESHIP': { type: 'shipping', value: 0, label: 'Free Benin City delivery' }
};

function applyPromo(code) {
  const cart = getCart();
  const upper = (code || '').toUpperCase().trim();
  if (PROMO_CODES[upper]) {
    cart.promo = upper;
    saveCart(cart);
    return { ok: true, message: PROMO_CODES[upper].label };
  }
  return { ok: false, message: 'Invalid discount code' };
}

function removePromo() {
  const cart = getCart();
  cart.promo = null;
  saveCart(cart);
}

function getDiscount(subtotal) {
  const cart = getCart();
  if (!cart.promo) return 0;
  const promo = PROMO_CODES[cart.promo];
  if (!promo) return 0;
  if (promo.type === 'percent') return Math.round(subtotal * (promo.value / 100));
  return 0;
}

function getShipping(subtotal, isBeninCity = true) {
  const cart = getCart();
  if (cart.promo === 'FREESHIP' && isBeninCity) return 0;
  if (isBeninCity) return 2000;
  return null; // TBC outside Benin City
}

function getCartTotal(subtotal, discount, shipping) {
  return subtotal - discount + (shipping || 0);
}

// --- Wishlist ---
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function isInWishlist(id) {
  return getWishlist().includes(id);
}

function toggleWishlist(id) {
  const list = getWishlist();
  const idx = list.indexOf(id);
  if (idx > -1) {
    list.splice(idx, 1);
    showToast('Removed from wishlist');
  } else {
    list.push(id);
    showToast('Added to wishlist', 'success');
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  updateWishlistCount();
  return list.includes(id);
}

function updateWishlistCount() {
  const count = getWishlist().length;
  document.querySelectorAll('.wishlist-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// --- UI helpers ---
function updateCartCount() {
  const count = cartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showToast(message, type = '') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  const icon = type === 'success'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
  toast.innerHTML = icon + '<span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// --- Cart mini-drawer (used on every page) ---
function openCartDrawer() {
  let overlay = document.querySelector('.drawer-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.addEventListener('click', closeCartDrawer);
    document.body.appendChild(overlay);
  }
  let drawer = document.querySelector('.cart-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'drawer cart-drawer';
    drawer.innerHTML = `
      <div class="drawer-head">
        <h3>Your Cart</h3>
        <button class="icon-btn" style="color:#fff" onclick="closeCartDrawer()" aria-label="Close cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="drawer-body" id="cartDrawerBody"></div>
      <div class="drawer-foot" id="cartDrawerFoot"></div>
    `;
    document.body.appendChild(drawer);
  }
  renderCartDrawer();
  overlay.classList.add('open');
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.querySelector('.drawer-overlay')?.classList.remove('open');
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const body = document.getElementById('cartDrawerBody');
  const foot = document.getElementById('cartDrawerFoot');
  if (!body || !foot) return;
  const cart = getCart();
  if (cart.items.length === 0) {
    body.innerHTML = `<div class="empty-state" style="padding:32px 12px">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <h3 style="font-size:1.1rem">Your cart is empty</h3>
      <p style="font-size:0.9rem">Browse our essentials and add your favourites.</p>
      <a href="shop.html" class="btn btn-primary btn-sm" onclick="closeCartDrawer()">Shop Now</a>
    </div>`;
    foot.innerHTML = '';
    return;
  }
  let html = '';
  cart.items.forEach(item => {
    const p = getProductById(item.id);
    if (!p) return;
    const varStr = Object.entries(item.variations).map(([k,v]) => `${k}: ${v}`).join(', ');
    html += `
      <div class="cart-item" style="grid-template-columns:60px 1fr auto; padding:12px 0; border-bottom:1px solid var(--color-border)">
        <div class="thumb" style="width:60px;height:60px">${p.images[0] || '[PHOTO]'}</div>
        <div class="info">
          <div class="name" style="font-size:0.9rem">${p.name}</div>
          ${varStr ? `<div class="meta" style="font-size:0.78rem">${varStr}</div>` : ''}
          <div class="meta" style="font-size:0.78rem">Qty: ${item.qty}</div>
        </div>
        <div class="right">
          <div class="price" style="font-size:0.9rem">${formatPrice(p.price * item.qty)}</div>
          <button class="remove" style="font-size:0.75rem" onclick="removeFromCart('${p.id}', ${JSON.stringify(item.variations).replace(/"/g,'&quot;')}); renderCartDrawer();">Remove</button>
        </div>
      </div>
    `;
  });
  body.innerHTML = html;
  const subtotal = cartSubtotal();
  foot.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
    <p style="font-size:0.78rem;color:var(--color-text-muted);margin:6px 0 12px">Shipping calculated at checkout.</p>
    <a href="cart.html" class="btn btn-secondary btn-block btn-sm" style="margin-bottom:8px" onclick="closeCartDrawer()">View Cart</a>
    <a href="checkout.html" class="btn btn-primary btn-block btn-sm" onclick="closeCartDrawer()">Checkout</a>
  `;
}
