/* ==========================================================================
   Stepth Essentials — Cart & Checkout page logic
   ========================================================================== */

function renderCartPage() {
  const root = document.getElementById('cartRoot');
  if (!root) return;
  const cart = getCart();
  if (cart.items.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <h3>Your cart is empty</h3>
        <p>Browse our essentials and find something you love.</p>
        <a href="shop.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }

  const items = cart.items.map(item => {
    const p = getProductById(item.id);
    if (!p) return '';
    const varStr = Object.entries(item.variations).map(([k,v]) => `${k}: ${v}`).join(', ');
    return `
      <div class="cart-item" data-id="${p.id}" data-var='${JSON.stringify(item.variations)}'>
        <div class="thumb">${p.images[0] || '[PHOTO]'}</div>
        <div class="info">
          <div class="name"><a href="product.html?id=${p.id}">${p.name}</a></div>
          <div class="meta">SKU: ${p.sku}</div>
          ${varStr ? `<div class="meta">${varStr}</div>` : ''}
          <div class="meta">₦${p.price.toLocaleString('en-NG')} each</div>
          <button class="remove" onclick="removeCartItem('${p.id}', '${encodeURIComponent(JSON.stringify(item.variations))}')">Remove</button>
        </div>
        <div class="right">
          <div class="qty-control">
            <button onclick="changePageQty('${p.id}', '${encodeURIComponent(JSON.stringify(item.variations))}', -1)">−</button>
            <input type="number" value="${item.qty}" min="1" max="${p.stock || 99}" onchange="setPageQty('${p.id}', '${encodeURIComponent(JSON.stringify(item.variations))}', this.value)" aria-label="Quantity">
            <button onclick="changePageQty('${p.id}', '${encodeURIComponent(JSON.stringify(item.variations))}', 1)">+</button>
          </div>
          <div class="price">₦${(p.price * item.qty).toLocaleString('en-NG')}</div>
        </div>
      </div>
    `;
  }).join('');

  const subtotal = cartSubtotal();
  const discount = getDiscount(subtotal);
  const shipping = getShipping(subtotal, true);
  const total = getCartTotal(subtotal, discount, shipping);

  root.innerHTML = `
    <div class="cart-layout">
      <div>
        <div class="cart-items">${items}</div>
        <div style="margin-top:20px; display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap">
          <a href="shop.html" class="btn btn-secondary btn-sm">← Continue Shopping</a>
          <button class="btn btn-beige btn-sm" onclick="clearCart(); renderCartPage();">Clear Cart</button>
        </div>
      </div>
      <aside class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        ${discount > 0 ? `<div class="summary-row" style="color:var(--color-success)"><span>Discount (${cart.promo})</span><span>−${formatPrice(discount)}</span></div>` : ''}
        <div class="summary-row"><span>Delivery (Benin City)</span><span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
        <div class="summary-row" style="font-size:0.8rem; color:var(--color-text-muted)">Outside Benin City? Calculated at checkout.</div>

        ${!cart.promo ? `
          <div class="promo-row">
            <input type="text" id="promoInput" placeholder="Discount code (e.g. WELCOME10)">
            <button onclick="applyPromoFromPage()">Apply</button>
          </div>
        ` : `
          <div style="background:rgba(46,125,91,0.1);padding:8px 12px;border-radius:6px;font-size:0.85rem;color:var(--color-success);margin:8px 0">
            ${ICONS.check} Code <strong>${cart.promo}</strong> applied. <a href="#" onclick="removePromo(); renderCartPage(); return false;" style="text-decoration:underline">Remove</a>
          </div>
        `}

        <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
        <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:16px">Proceed to Checkout</a>
        <div style="margin-top:12px; font-size:0.8rem; color:var(--color-text-muted); text-align:center">
          ${ICONS.shield} Secure SSL checkout · Guest checkout available
        </div>
      </aside>
    </div>
  `;
}

function removeCartItem(id, varEncoded) {
  const variations = JSON.parse(decodeURIComponent(varEncoded));
  removeFromCart(id, variations);
  renderCartPage();
}

function changePageQty(id, varEncoded, delta) {
  const variations = JSON.parse(decodeURIComponent(varEncoded));
  const cart = getCart();
  const key = id + '|' + JSON.stringify(variations);
  const item = cart.items.find(i => (i.id + '|' + JSON.stringify(i.variations)) === key);
  if (item) {
    const newQty = Math.max(1, (item.qty || 1) + delta);
    updateCartQty(id, variations, newQty);
    renderCartPage();
  }
}

function setPageQty(id, varEncoded, qty) {
  const variations = JSON.parse(decodeURIComponent(varEncoded));
  updateCartQty(id, variations, Math.max(1, parseInt(qty) || 1));
  renderCartPage();
}

function applyPromoFromPage() {
  const code = document.getElementById('promoInput').value;
  const result = applyPromo(code);
  if (result.ok) {
    showToast(result.message, 'success');
  } else {
    showToast(result.message, 'error');
  }
  renderCartPage();
}

// ===== Checkout =====
function renderCheckoutSummary() {
  const el = document.getElementById('checkoutSummary');
  if (!el) return;
  const cart = getCart();
  if (cart.items.length === 0) {
    el.innerHTML = `<p style="color:var(--color-text-muted)">Your cart is empty.</p>`;
    return;
  }
  const subtotal = cartSubtotal();
  const discount = getDiscount(subtotal);
  const shipping = getShipping(subtotal, true);
  const total = getCartTotal(subtotal, discount, shipping);

  let itemsHtml = cart.items.map(item => {
    const p = getProductById(item.id);
    if (!p) return '';
    const varStr = Object.entries(item.variations).map(([k,v]) => `${k}: ${v}`).join(', ');
    return `
      <div class="summary-row" style="font-size:0.88rem">
        <span>${p.name} × ${item.qty}${varStr ? '<br><small style="color:var(--color-text-muted)">'+varStr+'</small>' : ''}</span>
        <span>${formatPrice(p.price * item.qty)}</span>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <h3 style="margin-bottom:14px">Your Order</h3>
    ${itemsHtml}
    <hr style="margin:14px 0; border:none; border-top:1px solid var(--color-border)">
    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
    ${discount > 0 ? `<div class="summary-row" style="color:var(--color-success)"><span>Discount</span><span>−${formatPrice(discount)}</span></div>` : ''}
    <div class="summary-row"><span>Delivery</span><span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
    <div style="font-size:0.8rem; color:var(--color-text-muted); margin-top:10px">
      Currency: Nigerian Naira (₦). Outside Benin City? Delivery recalculated after address entry.
    </div>
  `;
}

function initCheckout() {
  if (!document.getElementById('checkoutForm')) return;
  renderCheckoutSummary();

  // Payment method selection
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
      radio.closest('.pay-method').classList.add('selected');
      // Toggle bank details
      document.getElementById('bankDetails').style.display = radio.value === 'bank' ? 'block' : 'none';
    });
  });

  // Submit handler
  document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const terms = document.getElementById('agreeTerms').checked;
    if (!terms) {
      showToast('Please accept the Terms of Service and Return Policy', 'error');
      return;
    }
    // Generate order number
    const orderNum = 'SE-' + Date.now().toString().slice(-8);
    const formData = new FormData(e.target);
    const order = {
      number: orderNum,
      date: new Date().toISOString(),
      customer: Object.fromEntries(formData),
      items: getCart().items,
      total: getCartTotal(cartSubtotal(), getDiscount(cartSubtotal()), getShipping(cartSubtotal(), true))
    };
    // Save order (would normally go to backend)
    const orders = JSON.parse(localStorage.getItem('stepth_orders') || '[]');
    orders.push(order);
    localStorage.setItem('stepth_orders', JSON.stringify(orders));
    clearCart();
    showOrderConfirmation(order);
  });
}

function showOrderConfirmation(order) {
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="container">
      <div class="confirm">
        <div class="icon-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1>Thank you for your order!</h1>
        <p style="color:var(--color-text-muted); margin-bottom:8px">Your order has been received and is now being processed. A confirmation email is on its way to <strong>${order.customer.email || 'your inbox'}</strong>.</p>
        <div class="order-num">Order #${order.number}</div>

        <div style="background:#fff; border:1px solid var(--color-border); border-radius:12px; padding:24px; margin:24px 0; text-align:left">
          <h3 style="margin-bottom:12px">What happens next?</h3>
          <ol style="padding-left:20px; line-height:2">
            <li><strong>Order Received</strong> — we've got your order ✓</li>
            <li><strong>Processing</strong> — we'll prepare your items (usually within 24 hours)</li>
            <li><strong>Shipped / Out for Delivery</strong> — you'll get a notification</li>
            <li><strong>Delivered</strong> — within 1–3 business days (Benin City)</li>
          </ol>
          <p style="margin-top:16px; font-size:0.9rem; color:var(--color-text-muted)">You will receive email updates at each stage. For WhatsApp updates, message us with your order number.</p>
        </div>

        ${order.customer.payment === 'bank' ? `
          <div class="bank-details" style="text-align:left; margin:16px 0">
            <h4 style="margin-bottom:8px">Bank Transfer Instructions</h4>
            <p>Please transfer <strong>${formatPrice(order.total)}</strong> to:</p>
            <p style="margin-top:8px"><strong>Bank:</strong> [BANK NAME — TO CONFIRM] <span class="placeholder-mark">TBC</span></p>
            <p><strong>Account Name:</strong> Stepth Essentials / Stephnora Odion</p>
            <p><strong>Account Number:</strong> [ACCOUNT NUMBER — TO CONFIRM] <span class="placeholder-mark">TBC</span></p>
            <p style="margin-top:12px; font-size:0.85rem">After payment, please send your proof of payment via WhatsApp or email with your order number <strong>#${order.number}</strong>.</p>
            <a href="https://wa.me/2348000000000?text=${encodeURIComponent('Proof of payment for order #' + order.number)}" target="_blank" rel="noopener" class="btn btn-wa" style="margin-top:10px">${ICONS.whatsapp} Send Proof on WhatsApp</a>
          </div>
        ` : ''}

        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:24px">
          <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
          <a href="https://wa.me/2348000000000" target="_blank" rel="noopener" class="btn btn-wa">${ICONS.whatsapp} WhatsApp Support</a>
        </div>
      </div>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cartRoot')) renderCartPage();
  if (document.getElementById('checkoutForm')) initCheckout();
});
