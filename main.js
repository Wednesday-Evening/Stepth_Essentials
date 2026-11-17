/* ==========================================================================
   Stepth Essentials — Shared site logic
   Injects header & footer on every page, handles nav toggle, search submit,
   newsletter form, FAQ accordion, etc.
   ========================================================================== */

// ---------- SVG icon library (inline so no extra requests) ----------
const ICONS = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  cart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  whatsapp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
  mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  truck: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  shield: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  refresh: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  chat: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  gift: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  share: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>',
  instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  tiktok: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>'
};

// ---------- Header & Footer markup ----------
function buildHeader() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const isActive = (page) => path === page ? 'active' : '';
  return `
    <a href="#main" class="skip-link">Skip to content</a>
    <div class="announce">Free delivery within Benin City on orders over ₦20,000 — Your Essentials, Your Way.</div>
    <header class="site-header">
      <div class="container header-inner">
        <button class="menu-toggle" onclick="toggleMobileNav()" aria-label="Open menu">${ICONS.menu}</button>
        <a href="index.html" class="logo" aria-label="Stepth Essentials home">
          <img src="images/logo.png" alt="Stepth Essentials logo">
          <span class="logo-text">Stepth Essentials<span>Your Essentials, Your Way</span></span>
        </a>
        <form class="search" role="search" onsubmit="handleSearch(event)">
          <span class="search-icon">${ICONS.search}</span>
          <input type="search" id="searchInput" placeholder="Search products, categories…" aria-label="Search products">
        </form>
        <div class="header-actions">
          <a href="#" class="icon-btn" onclick="goToWishlist(event)" aria-label="Wishlist">
            ${ICONS.heart}
            <span class="badge wishlist-count" style="display:none">0</span>
          </a>
          <button class="icon-btn" onclick="openCartDrawer()" aria-label="Open cart">
            ${ICONS.cart}
            <span class="badge cart-count" style="display:none">0</span>
          </button>
        </div>
      </div>
      <nav class="main-nav" id="mainNav" aria-label="Main navigation">
        <div class="container">
          <ul>
            <li><a href="shop.html" class="${isActive('shop.html')}">Shop All</a></li>
            <li><a href="shop.html?cat=Fashion" class="">Categories</a></li>
            <li><a href="shop.html?filter=new" class="${isActive('')}">New Arrivals</a></li>
            <li><a href="shop.html?filter=best" class="">Best Sellers</a></li>
            <li><a href="shop.html?filter=sale" class="sale-link">Sale</a></li>
            <li><a href="about.html" class="${isActive('about.html')}">About</a></li>
            <li><a href="contact.html" class="${isActive('contact.html')}">Contact</a></li>
            <li><a href="faq.html" class="${isActive('faq.html')}">FAQ</a></li>
          </ul>
        </div>
      </nav>
    </header>
  `;
}

function buildFooter() {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col footer-brand">
            <div class="logo" style="margin-bottom:14px">
              <img src="images/logo.png" alt="Stepth Essentials logo" style="width:48px;height:48px;border-radius:50%">
              <span class="logo-text" style="font-size:1.1rem">Stepth Essentials<span>Your Essentials, Your Way</span></span>
            </div>
            <p>An online variety store offering useful products for everyday needs. Based in Benin City, delivering essentials with care.</p>
            <div class="footer-social">
              <a href="#" aria-label="Instagram" title="Instagram (TBC)">${ICONS.instagram}</a>
              <a href="#" aria-label="Facebook" title="Facebook (TBC)">${ICONS.facebook}</a>
              <a href="#" aria-label="TikTok" title="TikTok (TBC)">${ICONS.tiktok}</a>
              <a href="https://wa.me/2348000000000" aria-label="WhatsApp" title="WhatsApp Business">${ICONS.whatsapp}</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="shop.html">All Products</a></li>
              <li><a href="shop.html?filter=new">New Arrivals</a></li>
              <li><a href="shop.html?filter=best">Best Sellers</a></li>
              <li><a href="shop.html?filter=sale">On Sale</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Help & Info</h4>
            <ul>
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="policies.html#returns">Returns</a></li>
              <li><a href="policies.html#shipping">Shipping</a></li>
              <li><a href="policies.html">Privacy Policy</a></li>
              <li><a href="policies.html#terms">Terms of Service</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:stephnoraodion9@gmail.com">${ICONS.mail} stephnoraodion9@gmail.com</a></li>
              <li><a href="https://wa.me/2348000000000">${ICONS.whatsapp} WhatsApp Business</a></li>
              <li style="opacity:0.7;font-size:0.85rem">Benin City, Nigeria</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© ${year} Stepth Essentials. All rights reserved.</div>
          <div>Currency: Nigerian Naira (₦) · Domain: stepthessentials.store (TBC)</div>
        </div>
      </div>
    </footer>
  `;
}

// ---------- Page bootstrap ----------
function bootstrapSite() {
  // Inject header & footer
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.innerHTML = buildHeader();
  if (footerSlot) footerSlot.innerHTML = buildFooter();

  // Wire up counts
  updateCartCount();
  updateWishlistCount();

  // Restore search query from URL
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  if (q) {
    const input = document.getElementById('searchInput');
    if (input) input.value = q;
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.faq-item').classList.toggle('open');
    });
  });

  // Newsletter forms
  document.querySelectorAll('form[data-newsletter]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input[type=email]').value;
      if (email) {
        form.innerHTML = `<div class="form-success">${ICONS.check} Thank you for subscribing! We'll be in touch soon.</div>`;
        showToast('Subscribed successfully', 'success');
      }
    });
  });

  // Set active nav based on path
  highlightActiveNav();
}

function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
}

function toggleMobileNav() {
  document.getElementById('mainNav')?.classList.toggle('open');
}

function handleSearch(e) {
  e.preventDefault();
  const q = document.getElementById('searchInput').value.trim();
  window.location.href = 'shop.html' + (q ? '?q=' + encodeURIComponent(q) : '');
}

function goToWishlist(e) {
  e.preventDefault();
  const list = getWishlist();
  if (list.length === 0) {
    showToast('Your wishlist is empty', '');
    return;
  }
  window.location.href = 'shop.html?wishlist=1';
}

// WhatsApp floating button
function injectWhatsAppFab() {
  const fab = document.createElement('a');
  fab.href = 'https://wa.me/2348000000000?text=' + encodeURIComponent('Hello Stepth Essentials, I have a question.');
  fab.className = 'whatsapp-fab';
  fab.target = '_blank';
  fab.rel = 'noopener';
  fab.setAttribute('aria-label', 'Chat on WhatsApp');
  fab.innerHTML = ICONS.whatsapp;
  fab.style.cssText = 'position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;background:#25D366;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,0.4);z-index:999;transition:transform 0.2s';
  fab.onmouseenter = () => fab.style.transform = 'scale(1.1)';
  fab.onmouseleave = () => fab.style.transform = 'scale(1)';
  document.body.appendChild(fab);
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  bootstrapSite();
  injectWhatsAppFab();
});
