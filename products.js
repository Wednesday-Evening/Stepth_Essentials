/* ==========================================================================
   Stepth Essentials — Product Catalog Data
   Sample products across categories. Replace with real spreadsheet data
   before launch. Each product has SKU, stock state, variations, etc.
   ========================================================================== */

const CATALOG = [
  {
    id: 'SE-FASH-001',
    sku: 'SE-FASH-001',
    name: 'Classic Cotton T-Shirt',
    category: 'Fashion',
    price: 4500,
    oldPrice: null,
    weight: 0.2,
    dimensions: '30 × 22 × 2 cm',
    stock: 24,
    stockState: 'in',
    rating: 4.5,
    reviewCount: 12,
    badges: ['best'],
    featured: true,
    newArrival: false,
    onSale: false,
    description: 'Soft, breathable 100% cotton t-shirt with a relaxed fit. Perfect for everyday wear in warm weather. Pre-shrunk fabric holds its shape wash after wash.',
    variations: {
      size: ['S', 'M', 'L', 'XL'],
      color: ['White', 'Black', 'Beige', 'Brown']
    },
    images: ['[PRODUCT PHOTO — FRONT VIEW]', '[PRODUCT PHOTO — BACK VIEW]', '[LIFESTYLE PHOTO — MODEL WEARING]'],
    related: ['SE-FASH-002', 'SE-ACC-001', 'SE-FASH-005']
  },
  {
    id: 'SE-FASH-002',
    sku: 'SE-FASH-002',
    name: 'Linen Wrap Dress',
    category: 'Fashion',
    price: 12500,
    oldPrice: 15500,
    weight: 0.4,
    dimensions: '35 × 28 × 3 cm',
    stock: 8,
    stockState: 'low',
    rating: 4.8,
    reviewCount: 6,
    badges: ['sale', 'best'],
    featured: true,
    newArrival: false,
    onSale: true,
    description: 'Elegant linen wrap dress with adjustable tie waist. Lightweight and breathable — perfect for both casual outings and smart occasions. Falls just above the knee.',
    variations: {
      size: ['S', 'M', 'L', 'XL'],
      color: ['Cream', 'Chocolate', 'Olive']
    },
    images: ['[PRODUCT PHOTO — FRONT]', '[PRODUCT PHOTO — BACK]', '[LIFESTYLE PHOTO]'],
    related: ['SE-FASH-001', 'SE-ACC-002', 'SE-FASH-003']
  },
  {
    id: 'SE-FASH-003',
    sku: 'SE-FASH-003',
    name: 'Denim Tote Bag',
    category: 'Fashion',
    price: 6500,
    oldPrice: null,
    weight: 0.35,
    dimensions: '40 × 35 × 8 cm',
    stock: 18,
    stockState: 'in',
    rating: 4.6,
    reviewCount: 9,
    badges: [],
    featured: false,
    newArrival: true,
    onSale: false,
    description: 'Sturdy denim tote with reinforced straps and interior pocket. Spacious enough for groceries, books, or a laptop. Eco-friendly alternative to plastic bags.',
    variations: {
      color: ['Indigo', 'Washed Blue', 'Black']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-ACC-001', 'SE-FASH-001', 'SE-HOME-003']
  },
  {
    id: 'SE-BEAU-001',
    sku: 'SE-BEAU-001',
    name: 'Shea Butter Body Lotion',
    category: 'Beauty',
    price: 3800,
    oldPrice: null,
    weight: 0.3,
    dimensions: '15 × 6 × 6 cm',
    stock: 32,
    stockState: 'in',
    rating: 4.7,
    reviewCount: 18,
    badges: ['best'],
    featured: true,
    newArrival: false,
    onSale: false,
    description: 'Rich, nourishing body lotion made with pure shea butter. Absorbs quickly without greasiness, leaving skin soft and hydrated for up to 24 hours. Suitable for all skin types.',
    variations: {
      size: ['100ml', '250ml']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-BEAU-002', 'SE-BEAU-003', 'SE-HOME-002']
  },
  {
    id: 'SE-BEAU-002',
    sku: 'SE-BEAU-002',
    name: 'Natural Black Soap Bar',
    category: 'Beauty',
    price: 1500,
    oldPrice: 2000,
    weight: 0.15,
    dimensions: '8 × 6 × 3 cm',
    stock: 50,
    stockState: 'in',
    rating: 4.9,
    reviewCount: 27,
    badges: ['sale'],
    featured: false,
    newArrival: false,
    onSale: true,
    description: 'Traditional African black soap made from plantain skins, cocoa pods, and palm kernel oil. Gentle cleansing for face and body. Helps with blemishes and even skin tone.',
    variations: {
      size: ['100g', '200g']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-BEAU-001', 'SE-BEAU-003', 'SE-HOME-002']
  },
  {
    id: 'SE-BEAU-003',
    sku: 'SE-BEAU-003',
    name: 'Lip Tint Set (3 Shades)',
    category: 'Beauty',
    price: 5500,
    oldPrice: null,
    weight: 0.1,
    dimensions: '12 × 8 × 2 cm',
    stock: 0,
    stockState: 'out',
    rating: 4.4,
    reviewCount: 4,
    badges: ['new'],
    featured: false,
    newArrival: true,
    onSale: false,
    description: 'Set of 3 long-lasting lip tints in nude, rose, and berry shades. Lightweight, non-sticky formula enriched with vitamin E. Perfect for everyday wear.',
    variations: {},
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-BEAU-001', 'SE-BEAU-002', 'SE-ACC-002']
  },
  {
    id: 'SE-HOME-001',
    sku: 'SE-HOME-001',
    name: 'Scented Soy Candle',
    category: 'Home',
    price: 4200,
    oldPrice: null,
    weight: 0.35,
    dimensions: '8 × 8 × 8 cm',
    stock: 14,
    stockState: 'in',
    rating: 4.6,
    reviewCount: 11,
    badges: ['best'],
    featured: true,
    newArrival: false,
    onSale: false,
    description: 'Hand-poured soy wax candle with cotton wick. Burns clean for approximately 35 hours. Available in vanilla, sandalwood, and citrus scents. Comes in a reusable glass jar.',
    variations: {
      scent: ['Vanilla', 'Sandalwood', 'Citrus']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-HOME-002', 'SE-HOME-003', 'SE-BEAU-001']
  },
  {
    id: 'SE-HOME-002',
    sku: 'SE-HOME-002',
    name: 'Bamboo Bath Towel Set',
    category: 'Home',
    price: 9800,
    oldPrice: 12000,
    weight: 1.2,
    dimensions: '60 × 30 × 10 cm',
    stock: 6,
    stockState: 'low',
    rating: 4.7,
    reviewCount: 8,
    badges: ['sale'],
    featured: true,
    newArrival: false,
    onSale: true,
    description: 'Luxuriously soft 4-piece towel set made from sustainable bamboo fiber. Highly absorbent and quick-drying. Includes 2 bath towels and 2 hand towels.',
    variations: {
      color: ['Cream', 'Sage', 'Grey']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-HOME-001', 'SE-HOME-003', 'SE-BEAU-001']
  },
  {
    id: 'SE-HOME-003',
    sku: 'SE-HOME-003',
    name: 'Ceramic Plant Pot',
    category: 'Home',
    price: 3200,
    oldPrice: null,
    weight: 0.6,
    dimensions: '12 × 12 × 12 cm',
    stock: 22,
    stockState: 'in',
    rating: 4.3,
    reviewCount: 5,
    badges: ['new'],
    featured: false,
    newArrival: true,
    onSale: false,
    description: 'Minimalist ceramic plant pot with drainage hole and matching saucer. Matte finish in earthy tones. Fits small to medium indoor plants.',
    variations: {
      size: ['Small', 'Medium', 'Large'],
      color: ['Terracotta', 'Cream', 'Charcoal']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-HOME-001', 'SE-HOME-002', 'SE-FASH-003']
  },
  {
    id: 'SE-ELEC-001',
    sku: 'SE-ELEC-001',
    name: 'Wireless Phone Charger',
    category: 'Electronics',
    price: 7500,
    oldPrice: null,
    weight: 0.18,
    dimensions: '12 × 8 × 1 cm',
    stock: 12,
    stockState: 'in',
    rating: 4.5,
    reviewCount: 14,
    badges: ['best'],
    featured: true,
    newArrival: false,
    onSale: false,
    description: 'Sleek 10W wireless charging pad with anti-slip surface. Compatible with all Qi-enabled devices. LED indicator shows charging status. Includes USB-C cable.',
    variations: {
      color: ['White', 'Black']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-ELEC-002', 'SE-ACC-003', 'SE-HOME-001']
  },
  {
    id: 'SE-ELEC-002',
    sku: 'SE-ELEC-002',
    name: 'Bluetooth Mini Speaker',
    category: 'Electronics',
    price: 11000,
    oldPrice: 13500,
    weight: 0.4,
    dimensions: '8 × 8 × 8 cm',
    stock: 9,
    stockState: 'low',
    rating: 4.6,
    reviewCount: 16,
    badges: ['sale', 'new'],
    featured: false,
    newArrival: true,
    onSale: true,
    description: 'Compact Bluetooth 5.0 speaker with 360° sound and 8-hour battery life. Water-resistant design. Pairs with any phone or tablet within 10 metres.',
    variations: {
      color: ['Brown', 'Black', 'Cream']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-ELEC-001', 'SE-ACC-003', 'SE-HOME-001']
  },
  {
    id: 'SE-ACC-001',
    sku: 'SE-ACC-001',
    name: 'Leather Card Holder',
    category: 'Accessories',
    price: 5200,
    oldPrice: null,
    weight: 0.08,
    dimensions: '10 × 7 × 1 cm',
    stock: 28,
    stockState: 'in',
    rating: 4.8,
    reviewCount: 13,
    badges: ['best'],
    featured: true,
    newArrival: false,
    onSale: false,
    description: 'Slim full-grain leather card holder with 6 card slots and central pocket for cash. Ages beautifully with use. Comes in a gift-ready kraft box.',
    variations: {
      color: ['Tan', 'Chocolate', 'Black']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-FASH-001', 'SE-ACC-002', 'SE-FASH-003']
  },
  {
    id: 'SE-ACC-002',
    sku: 'SE-ACC-002',
    name: 'Beaded Statement Earrings',
    category: 'Accessories',
    price: 2800,
    oldPrice: null,
    weight: 0.05,
    dimensions: '6 × 4 × 1 cm',
    stock: 16,
    stockState: 'in',
    rating: 4.4,
    reviewCount: 7,
    badges: ['new'],
    featured: false,
    newArrival: true,
    onSale: false,
    description: 'Handcrafted beaded earrings with hypoallergenic hooks. Lightweight and comfortable for all-day wear. Each pair unique due to handmade nature.',
    variations: {
      color: ['Gold', 'Multicolor', 'Earth Tones']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-ACC-001', 'SE-FASH-002', 'SE-BEAU-003']
  },
  {
    id: 'SE-ACC-003',
    sku: 'SE-ACC-003',
    name: 'Canvas Laptop Sleeve',
    category: 'Accessories',
    price: 6800,
    oldPrice: 8500,
    weight: 0.3,
    dimensions: '35 × 25 × 2 cm',
    stock: 11,
    stockState: 'in',
    rating: 4.7,
    reviewCount: 10,
    badges: ['sale'],
    featured: false,
    newArrival: false,
    onSale: true,
    description: 'Padded canvas laptop sleeve with soft interior lining and leather-look trim. Fits most 14-inch laptops. Front pocket for cables and accessories.',
    variations: {
      size: ['13 inch', '14 inch', '15 inch'],
      color: ['Beige', 'Olive', 'Navy']
    },
    images: ['[PRODUCT PHOTO]', '[LIFESTYLE PHOTO]'],
    related: ['SE-ELEC-001', 'SE-ACC-001', 'SE-FASH-003']
  }
];

const CATEGORIES = [
  { id: 'fashion', name: 'Fashion', description: 'Clothing, bags & apparel essentials', icon: 'shirt' },
  { id: 'beauty', name: 'Beauty', description: 'Skincare, body care & cosmetics', icon: 'sparkle' },
  { id: 'home', name: 'Home', description: 'Candles, textiles & decor', icon: 'home' },
  { id: 'electronics', name: 'Electronics', description: 'Chargers, speakers & gadgets', icon: 'bolt' },
  { id: 'accessories', name: 'Accessories', description: 'Bags, jewellery & lifestyle', icon: 'gem' }
];

// Helpers
function formatPrice(n) {
  return '₦' + Number(n).toLocaleString('en-NG');
}

function getProductById(id) {
  return CATALOG.find(p => p.id === id);
}

function getRelatedProducts(ids) {
  return (ids || []).map(getProductById).filter(Boolean);
}

function stockLabel(state) {
  if (state === 'in') return 'In Stock';
  if (state === 'low') return 'Low Stock';
  return 'Out of Stock';
}

function stockClass(state) {
  if (state === 'in') return 'stock-in';
  if (state === 'low') return 'stock-low';
  return 'stock-out';
}
