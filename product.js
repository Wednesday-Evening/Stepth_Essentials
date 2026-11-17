/* ==========================================================================
   Stepth Essentials — Product Detail Page logic
   Loads product by ?id= URL param, renders gallery, variations, related,
   reviews, Q&A, add-to-cart.
   ========================================================================== */

let currentProduct = null;
let selectedVariations = {};
let selectedQty = 1;
let selectedImage = 0;

// Sample approved reviews (in production these come from a database)
const SAMPLE_REVIEWS = {
  'SE-FASH-001': [
    { name: 'Amaka O.', rating: 5, date: '2 weeks ago', text: 'Soft cotton and great fit. I ordered the beige in M and it sits perfectly. Will buy more colours.' },
    { name: 'Tunde A.', rating: 4, date: '1 month ago', text: 'Good quality for the price. Delivery was quick within Benin City.' }
  ],
  'SE-BEAU-001': [
    { name: 'Blessing E.', rating: 5, date: '3 weeks ago', text: 'My skin has never felt better. The shea butter smell is amazing and it absorbs fast.' },
    { name: 'Grace I.', rating: 4, date: '2 months ago', text: 'Lovely lotion. Would prefer a pump bottle but the product itself is great.' }
  ]
};

const SAMPLE_QA = {
  'SE-FASH-001': [
    { q: 'Is the cotton pre-shrunk?', a: 'Yes, the fabric is pre-shrunk so it holds its shape after washing.' },
    { q: 'Does it run true to size?', a: 'Yes — order your usual size. If between sizes, size up for a relaxed fit.' }
  ]
};

function loadProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'SE-FASH-001';
  const product = getProductById(id);
  if (!product) {
    document.getElementById('pdpRoot').innerHTML = `
      <div class="container">
        <div class="empty-state" style="padding:80px 20px">
          <h3>Product not found</h3>
          <p>We couldn't find that product. It may have been removed.</p>
          <a href="shop.html" class="btn btn-primary">Back to Shop</a>
        </div>
      </div>`;
    return;
  }
  currentProduct = product;
  selectedVariations = {};
  Object.keys(product.variations || {}).forEach(key => {
    if (product.variations[key].length) selectedVariations[key] = product.variations[key][0];
  });
  selectedQty = 1;
  selectedImage = 0;
  renderProduct();
}

function renderProduct() {
  const p = currentProduct;
  document.title = p.name + ' — Stepth Essentials';

  // Breadcrumb
  const breadcrumb = `
    <nav class="breadcrumb container" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span>/</span>
      <a href="shop.html">Shop</a><span>/</span>
      <a href="shop.html?cat=${p.category}">${p.category}</a><span>/</span>
      <span style="color:var(--color-chocolate)">${p.name}</span>
    </nav>
  `;

  // Gallery
  const galleryThumbs = p.images.map((img, i) => `
    <button class="${i === selectedImage ? 'active' : ''}" onclick="selectImage(${i})" aria-label="View image ${i+1}">${img}</button>
  `).join('');

  // Variations
  let variationsHtml = '';
  if (p.variations && Object.keys(p.variations).length) {
    variationsHtml = Object.entries(p.variations).map(([key, values]) => `
      <div class="variation-group">
        <label>${key.charAt(0).toUpperCase() + key.slice(1)}: <strong id="var-${key}">${selectedVariations[key] || ''}</strong></label>
        <div class="chip-row">
          ${values.map(v => `<button class="chip ${selectedVariations[key] === v ? 'active' : ''}" onclick="selectVariation('${key}', '${v}')">${v}</button>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Stock + SKU
  const stockHtml = `<div class="pdp-stock ${stockClass(p.stockState)}">${ICONS.check} ${stockLabel(p.stockState)}</div>`;
  const skuHtml = `<div class="pdp-sku">SKU: ${p.sku}</div>`;

  // Price
  const priceHtml = p.oldPrice
    ? `<div class="pdp-price">${formatPrice(p.price)} <span class="old">${formatPrice(p.oldPrice)}</span></div>`
    : `<div class="pdp-price">${formatPrice(p.price)}</div>`;

  // Reviews summary
  const starsHtml = Array.from({length:5}, (_,i) =>
    i < Math.round(p.rating) ? '<span class="stars">★</span>' : '<span class="stars" style="opacity:0.3">★</span>'
  ).join('');

  const isOut = p.stockState === 'out';

  // WhatsApp share link
  const waText = encodeURIComponent(`Hi! I'm interested in ${p.name} (${formatPrice(p.price)}) from Stepth Essentials.`);
  const waLink = `https://wa.me/2348000000000?text=${waText}`;

  document.getElementById('pdpRoot').innerHTML = breadcrumb + `
    <div class="container">
      <div class="pdp">
        <div class="gallery">
          <div class="gallery-main" id="galleryMain">${p.images[selectedImage] || '[PRODUCT PHOTO]'}</div>
          <div class="gallery-thumbs">${galleryThumbs}</div>
        </div>
        <div class="pdp-info">
          <div class="cat-tag">${p.category}</div>
          <h1>${p.name}</h1>
          <div class="review-summary">
            ${starsHtml}
            <span>${p.rating.toFixed(1)} · ${p.reviewCount} review${p.reviewCount === 1 ? '' : 's'}</span>
          </div>
          ${priceHtml}
          ${stockHtml}
          ${skuHtml}
          <p style="margin:16px 0; color:var(--color-text-muted); line-height:1.7">${p.description}</p>

          ${variationsHtml}

          <div class="qty-row">
            <label style="font-weight:600;color:var(--color-chocolate)">Quantity</label>
            <div class="qty-control">
              <button onclick="changeQty(-1)" aria-label="Decrease quantity">−</button>
              <input type="number" id="qtyInput" value="${selectedQty}" min="1" max="${p.stock || 99}" onchange="setQty(this.value)" aria-label="Quantity">
              <button onclick="changeQty(1)" aria-label="Increase quantity">+</button>
            </div>
          </div>

          <div class="pdp-cta">
            <button class="btn btn-primary btn-lg" onclick="addCurrentToCart()" ${isOut ? 'disabled' : ''}>
              ${ICONS.cart} ${isOut ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button class="btn btn-secondary btn-lg" onclick="toggleCurrentWishlist(this)" aria-label="Add to wishlist">
              ${ICONS.heart}
            </button>
            <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-wa btn-lg">
              ${ICONS.whatsapp} Ask on WhatsApp
            </a>
          </div>

          <div class="pdp-meta">
            <div>${ICONS.truck} <span>Benin City delivery: ₦2,000 · 1–3 business days</span></div>
            <div>${ICONS.refresh} <span>Eligible for returns — see <a href="policies.html#returns" style="text-decoration:underline">return policy</a></span></div>
            <div>${ICONS.gift} <span>Gift wrap available at checkout (where applicable)</span></div>
            <div>${ICONS.shield} <span>Secure checkout · SSL encrypted</span></div>
          </div>

          <div class="share-row">
            <span>Share:</span>
            <a class="share-btn" href="https://wa.me/?text=${encodeURIComponent(p.name + ' — ' + formatPrice(p.price) + ' at Stepth Essentials: ' + window.location.href)}" target="_blank" rel="noopener" aria-label="Share on WhatsApp">${ICONS.whatsapp}</a>
            <a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" rel="noopener" aria-label="Share on Facebook">${ICONS.facebook}</a>
            <a class="share-btn" href="#" onclick="copyLink(event)" aria-label="Copy link">${ICONS.share}</a>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="pdp-tabs">
        <div class="tab-head" role="tablist">
          <button class="active" onclick="switchTab(event,'desc')" role="tab">Description</button>
          <button onclick="switchTab(event,'reviews')" role="tab">Reviews (${p.reviewCount})</button>
          <button onclick="switchTab(event,'qa')" role="tab">Questions & Answers</button>
          <button onclick="switchTab(event,'shipping')" role="tab">Shipping & Returns</button>
        </div>

        <div class="tab-panel active" id="tab-desc">
          <h4>About this product</h4>
          <p>${p.description}</p>
          <h4>Product details</h4>
          <ul style="list-style:disc; padding-left:24px; line-height:1.9">
            <li><strong>SKU:</strong> ${p.sku}</li>
            <li><strong>Category:</strong> ${p.category}</li>
            <li><strong>Weight:</strong> ${p.weight} kg</li>
            <li><strong>Dimensions:</strong> ${p.dimensions}</li>
            ${p.variations && Object.keys(p.variations).length ? `<li><strong>Available options:</strong> ${Object.entries(p.variations).map(([k,v]) => `${k} (${v.join(', ')})`).join('; ')}</li>` : ''}
            <li><strong>Stock status:</strong> ${stockLabel(p.stockState)}</li>
          </ul>
          <p style="margin-top:16px;color:var(--color-text-muted);font-size:0.9rem">[FULL PRODUCT DESCRIPTION — TO BE PROVIDED BY CLIENT]</p>
        </div>

        <div class="tab-panel" id="tab-reviews">
          <h4>Customer Reviews (${p.reviewCount})</h4>
          <div id="reviewList">${renderReviews(p.id)}</div>
          <h4 style="margin-top:24px">Write a Review</h4>
          <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:12px">Only customers who have purchased this product can leave a review. Reviews are checked and approved before appearing publicly.</p>
          <form class="review-form" onsubmit="submitReview(event)">
            <div class="form-two">
              <div class="form-row">
                <label for="revName">Your name <span class="required">*</span></label>
                <input type="text" id="revName" required>
              </div>
              <div class="form-row">
                <label for="revRating">Rating <span class="required">*</span></label>
                <select id="revRating" required>
                  <option value="">Select…</option>
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★ (4)</option>
                  <option value="3">★★★ (3)</option>
                  <option value="2">★★ (2)</option>
                  <option value="1">★ (1)</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <label for="revText">Your review <span class="required">*</span></label>
              <textarea id="revText" required placeholder="Tell us what you think about this product…"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Submit Review for Approval</button>
          </form>
        </div>

        <div class="tab-panel" id="tab-qa">
          <h4>Customer Questions</h4>
          <div id="qaList">${renderQA(p.id)}</div>
          <h4 style="margin-top:24px">Ask a Question</h4>
          <form onsubmit="submitQuestion(event)">
            <div class="form-two">
              <div class="form-row">
                <label for="qName">Your name <span class="required">*</span></label>
                <input type="text" id="qName" required>
              </div>
              <div class="form-row">
                <label for="qEmail">Your email <span class="required">*</span></label>
                <input type="email" id="qEmail" required>
              </div>
            </div>
            <div class="form-row">
              <label for="qText">Your question <span class="required">*</span></label>
              <textarea id="qText" required placeholder="What would you like to know about this product?"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Submit Question</button>
          </form>
        </div>

        <div class="tab-panel" id="tab-shipping">
          <h4>Delivery</h4>
          <p><strong>Within Benin City:</strong> ₦2,000 flat delivery fee. Estimated delivery time: 1–3 business days.</p>
          <p><strong>Outside Benin City:</strong> Delivery fees and times are calculated based on your location after you enter your address at checkout. <span class="placeholder-mark" style="background:var(--color-warning);color:#fff;padding:2px 8px;border-radius:99px;font-size:0.75rem">[CONFIRM SHIPPING RATES — TO CONFIRM]</span></p>
          <h4>Returns</h4>
          <p>Certain products are eligible for returns within the return period. Some products (e.g. beauty/personal care) may be non-returnable for hygiene reasons. See our <a href="policies.html#returns" style="text-decoration:underline">full return policy</a>.</p>
        </div>
      </div>

      <!-- Related products -->
      ${renderRelated(p.related)}
    </div>
  `;

  // Update wishlist button state
  updateWishlistButton();
}

function renderReviews(productId) {
  const reviews = SAMPLE_REVIEWS[productId] || [];
  if (reviews.length === 0) {
    return '<p style="color:var(--color-text-muted);padding:16px 0">No reviews yet. Be the first to share your experience!</p>';
  }
  return reviews.map(r => `
    <div class="review-item">
      <div class="head">
        <span class="name">${r.name}</span>
        <span class="date">${r.date}</span>
      </div>
      <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <p style="margin-top:6px">${r.text}</p>
    </div>
  `).join('');
}

function renderQA(productId) {
  const qa = SAMPLE_QA[productId] || [];
  if (qa.length === 0) {
    return '<p style="color:var(--color-text-muted);padding:16px 0">No questions yet. Ask the first one!</p>';
  }
  return qa.map(item => `
    <div class="qa-item">
      <div class="q">Q: ${item.q}</div>
      <div class="a">A: ${item.a}</div>
    </div>
  `).join('');
}

function renderRelated(relatedIds) {
  const related = getRelatedProducts(relatedIds);
  if (!related.length) return '';
  return `
    <section class="section">
      <div class="section-head">
        <h2>You May Also Like</h2>
        <a href="shop.html" class="link-all">View all →</a>
      </div>
      <div class="product-grid" id="relatedGrid"></div>
    </section>
  `;
}

function renderRelatedCards() {
  const grid = document.getElementById('relatedGrid');
  if (!grid || !currentProduct) return;
  const related = getRelatedProducts(currentProduct.related);
  grid.innerHTML = related.slice(0, 4).map(p => renderProductCard(p)).join('');
  attachCardHandlers();
}

// --- Interactions ---
function selectImage(i) {
  selectedImage = i;
  document.getElementById('galleryMain').textContent = currentProduct.images[i] || '[PRODUCT PHOTO]';
  document.querySelectorAll('.gallery-thumbs button').forEach((b, idx) => {
    b.classList.toggle('active', idx === i);
  });
}

function selectVariation(key, value) {
  selectedVariations[key] = value;
  document.getElementById('var-' + key).textContent = value;
  document.querySelectorAll(`.variation-group:has(label[for="var-${key}"]) .chip`).forEach(c => c.classList.remove('active'));
  // Re-render variations to update chips
  renderProduct();
}

function changeQty(delta) {
  const max = currentProduct.stock || 99;
  selectedQty = Math.max(1, Math.min(max, selectedQty + delta));
  document.getElementById('qtyInput').value = selectedQty;
}

function setQty(val) {
  const max = currentProduct.stock || 99;
  selectedQty = Math.max(1, Math.min(max, parseInt(val) || 1));
}

function addCurrentToCart() {
  if (!currentProduct) return;
  if (currentProduct.stockState === 'out') {
    showToast('This product is out of stock', 'error');
    return;
  }
  addToCart(currentProduct.id, selectedQty, selectedVariations);
}

function toggleCurrentWishlist(btn) {
  if (!currentProduct) return;
  const active = toggleWishlist(currentProduct.id);
  btn.style.color = active ? 'var(--color-danger)' : '';
  btn.style.borderColor = active ? 'var(--color-danger)' : '';
}

function updateWishlistButton() {
  if (!currentProduct) return;
  const btn = document.querySelector('.pdp-cta .btn-secondary');
  if (btn && isInWishlist(currentProduct.id)) {
    btn.style.color = 'var(--color-danger)';
    btn.style.borderColor = 'var(--color-danger)';
  }
}

function switchTab(e, tabId) {
  document.querySelectorAll('.tab-head button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
}

function submitReview(e) {
  e.preventDefault();
  showToast('Review submitted! It will appear after approval.', 'success');
  e.target.reset();
}

function submitQuestion(e) {
  e.preventDefault();
  showToast('Question submitted! We will reply by email.', 'success');
  e.target.reset();
}

function copyLink(e) {
  e.preventDefault();
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('Link copied to clipboard', 'success');
  });
}

// --- Product card renderer (shared) ---
function renderProductCard(p) {
  const isOut = p.stockState === 'out';
  const badges = (p.badges || []).map(b => {
    const labels = { new: 'New', sale: 'Sale', best: 'Best Seller', low: 'Low Stock' };
    return `<span class="badge-tag ${b}">${labels[b] || b}</span>`;
  }).join('');
  const priceHtml = p.oldPrice
    ? `<span class="price">${formatPrice(p.price)}</span><span class="price-old">${formatPrice(p.oldPrice)}</span>`
    : `<span class="price">${formatPrice(p.price)}</span>`;
  const wishActive = isInWishlist(p.id) ? 'active' : '';
  return `
    <article class="product-card">
      <div class="thumb">
        <div class="badges">${badges}</div>
        <button class="wishlist-btn ${wishActive}" onclick="toggleWishlistById(event,'${p.id}')" aria-label="Add to wishlist">
          ${ICONS.heart}
        </button>
        <div class="placeholder">${p.images[0] || '[PRODUCT PHOTO]'}</div>
      </div>
      <div class="info">
        <div class="cat">${p.category}</div>
        <h3 class="name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="price-row">${priceHtml}</div>
        <div class="stock-mini ${stockClass(p.stockState)}">${stockLabel(p.stockState)}</div>
        <button class="quick-add" onclick="quickAdd('${p.id}')" ${isOut ? 'disabled' : ''}>
          ${isOut ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </article>
  `;
}

function toggleWishlistById(e, id) {
  e.preventDefault();
  e.stopPropagation();
  toggleWishlist(id);
  // Update button visual
  const btn = e.currentTarget;
  btn.classList.toggle('active');
}

function quickAdd(id) {
  const p = getProductById(id);
  if (!p || p.stockState === 'out') return;
  // If has variations, send to product page
  if (p.variations && Object.keys(p.variations).length) {
    window.location.href = 'product.html?id=' + id;
    return;
  }
  addToCart(id, 1, {});
}

function attachCardHandlers() {
  // No-op; handlers attached inline
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('pdpRoot')) {
    loadProductPage();
    // Render related cards after main render
    setTimeout(renderRelatedCards, 50);
  }
});
