/* ==========================================================================
   Stepth Essentials — Shop page logic
   Renders product grid, handles filters (category, price, variations),
   sorting, search query, and wishlist filter.
   ========================================================================== */

let shopState = {
  categories: new Set(),
  maxPrice: 20000,
  sizes: new Set(),
  colors: new Set(),
  sort: 'featured',
  search: '',
  filterMode: null // 'new' | 'best' | 'sale' | 'wishlist'
};

function initShop() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  // Read URL params
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const q = params.get('q');
  const filter = params.get('filter');
  const wishlist = params.get('wishlist');

  if (cat) {
    shopState.categories.add(cat);
    const cb = document.querySelector(`input[data-cat="${cat}"]`);
    if (cb) cb.checked = true;
  }
  if (q) shopState.search = q;
  if (filter) shopState.filterMode = filter;
  if (wishlist) shopState.filterMode = 'wishlist';

  // Wire filter inputs
  document.querySelectorAll('input[data-cat]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) shopState.categories.add(cb.dataset.cat);
      else shopState.categories.delete(cb.dataset.cat);
      shopState.filterMode = null;
      renderShop();
    });
  });

  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      shopState.maxPrice = parseInt(priceRange.value);
      document.getElementById('priceMax').textContent = formatPrice(shopState.maxPrice);
      renderShop();
    });
  }

  document.querySelectorAll('input[data-size]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) shopState.sizes.add(cb.dataset.size);
      else shopState.sizes.delete(cb.dataset.size);
      renderShop();
    });
  });

  document.querySelectorAll('input[data-color]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) shopState.colors.add(cb.dataset.color);
      else shopState.colors.delete(cb.dataset.color);
      renderShop();
    });
  });

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      shopState.sort = sortSelect.value;
      renderShop();
    });
  }

  // Mobile filter toggle
  const toggle = document.getElementById('filterToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.getElementById('filters').classList.toggle('open');
    });
  }

  // Clear filters
  const clearBtn = document.getElementById('clearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearFilters);
  }

  renderShop();
}

function clearFilters() {
  shopState = {
    categories: new Set(),
    maxPrice: 20000,
    sizes: new Set(),
    colors: new Set(),
    sort: 'featured',
    search: '',
    filterMode: null
  };
  document.querySelectorAll('.filters input[type=checkbox]').forEach(cb => cb.checked = false);
  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.value = 20000;
    document.getElementById('priceMax').textContent = formatPrice(20000);
  }
  renderShop();
}

function filterProducts() {
  let list = [...CATALOG];

  // Filter mode (new/best/sale/wishlist)
  if (shopState.filterMode === 'new') list = list.filter(p => p.newArrival);
  else if (shopState.filterMode === 'best') list = list.filter(p => p.badges.includes('best'));
  else if (shopState.filterMode === 'sale') list = list.filter(p => p.onSale);
  else if (shopState.filterMode === 'wishlist') list = list.filter(p => isInWishlist(p.id));

  // Categories
  if (shopState.categories.size) {
    list = list.filter(p => shopState.categories.has(p.category));
  }

  // Price
  list = list.filter(p => p.price <= shopState.maxPrice);

  // Sizes
  if (shopState.sizes.size) {
    list = list.filter(p => p.variations?.size && p.variations.size.some(s => shopState.sizes.has(s)));
  }

  // Colors
  if (shopState.colors.size) {
    list = list.filter(p => p.variations?.color && p.variations.color.some(c => shopState.colors.has(c)));
  }

  // Search
  if (shopState.search) {
    const q = shopState.search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (shopState.sort) {
    case 'price-asc': list.sort((a,b) => a.price - b.price); break;
    case 'price-desc': list.sort((a,b) => b.price - a.price); break;
    case 'name': list.sort((a,b) => a.name.localeCompare(b.name)); break;
    case 'newest': list.sort((a,b) => (b.newArrival?1:0) - (a.newArrival?1:0)); break;
    case 'rating': list.sort((a,b) => b.rating - a.rating); break;
    default: break; // featured
  }

  return list;
}

function renderShop() {
  const grid = document.getElementById('productGrid');
  const countEl = document.getElementById('resultCount');
  const titleEl = document.getElementById('shopTitle');
  if (!grid) return;

  const list = filterProducts();
  if (countEl) countEl.textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;

  // Update title based on filter mode
  if (titleEl) {
    if (shopState.filterMode === 'new') titleEl.textContent = 'New Arrivals';
    else if (shopState.filterMode === 'best') titleEl.textContent = 'Best Sellers';
    else if (shopState.filterMode === 'sale') titleEl.textContent = 'On Sale';
    else if (shopState.filterMode === 'wishlist') titleEl.textContent = 'My Wishlist';
    else if (shopState.search) titleEl.textContent = `Search: "${shopState.search}"`;
    else if (shopState.categories.size === 1) titleEl.textContent = [...shopState.categories][0];
    else titleEl.textContent = 'All Products';
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms.</p>
        <button class="btn btn-primary btn-sm" onclick="clearFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(p => renderProductCard(p)).join('');
}

document.addEventListener('DOMContentLoaded', initShop);
