/* Catalogue, persistent cart and explicit quote-request checkout. No payment is simulated. */
const C = SechaCommerce;
let coupon = "",
  checkoutDraft = {},
  currentRequest = null,
  toastTimer,
  drawerOpener;
const CART_KEY = "secha-cart-v2";
const SECHA_WHATSAPP = "6287786010290";
function storageRead(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function storageWrite(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
function toast(message) {
  const el = document.getElementById("commerce-toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 4000);
}
function initCommerce() {
  coupon = storageRead("secha-coupon-v2") === "STUDIO10" ? "STUDIO10" : "";
  cart = C.restore(storageRead(CART_KEY), MATERIAL_PALETTES);
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="cart-backdrop" class="cart-backdrop" hidden></div><aside id="cart-drawer" class="commerce-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title" hidden><div class="drawer-heading"><h2 id="bag-title">Your space / Your bag</h2><button class="icon-button" onclick="toggleCart()" aria-label="Close bag">×</button></div><div id="cart-items"></div><div id="cart-footer" class="cart-summary"></div></aside><div id="commerce-toast" class="toast" role="status" aria-live="polite" hidden></div><nav class="mobile-links" aria-label="Mobile navigation"><a href="#shop">Shop</a><a href="#modular-build">Modular</a><a href="#finishing-studio">Studio</a><button onclick="toggleCart()">Bag <span id="mobile-cart-count">0</span></button></nav>`,
  );
  document
    .getElementById("cart-backdrop")
    .addEventListener("click", () => toggleCart());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isCartOpen) toggleCart();
      if (!document.getElementById("global-modal").classList.contains("hidden"))
        closeModal();
    }
    const dialog = isCartOpen
      ? document.getElementById("cart-drawer")
      : !document.getElementById("global-modal").classList.contains("hidden")
        ? document.getElementById("global-modal")
        : null;
    if (e.key === "Tab" && dialog) {
      const focusable = [
        ...dialog.querySelectorAll("button,a[href],input,select,textarea"),
      ].filter((x) => x.getClientRects().length && !x.disabled);
      if (!focusable.length) return;
      const first = focusable[0],
        last = focusable.at(-1);
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !dialog.contains(document.activeElement))
      ) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          !dialog.contains(document.activeElement))
      ) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      renderProducts(button.dataset.filter);
    }),
  );
  for (const [id, key] of [
    ["room-kind", "room"],
    ["room-light", "light"],
    ["room-width", "width"],
    ["room-depth", "depth"],
    ["room-modules", "modules"],
  ])
    document.getElementById(id).addEventListener("input", (e) => {
      roomConfig[key] = ["width", "depth", "modules"].includes(key)
        ? Number(e.target.value)
        : e.target.value;
      updateRoomControls();
      if (refreshInterior) refreshInterior();
    });
  renderProducts();
  updateCartUI();
  updateRoomControls();
  document.querySelectorAll("#designers [onclick]").forEach((el) => {
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });
  const modal = document.getElementById("global-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "modal-title");
  modal.querySelector("button").setAttribute("aria-label", "Close details");
}
function renderProducts(filter = "all") {
  document.getElementById("product-grid").innerHTML = C.catalogue
    .filter((p) => filter === "all" || p.category === filter)
    .map(
      (p) =>
        `<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${C.escape(p.category === "modular" ? "Concept visualisation of the SECHA modular " + p.room + " setup" : "SECHA design direction")}" loading="lazy"><span>${p.category === "modular" ? "Modular concept" : "Design service"}</span></div><div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><ul>${p.includes.map((t) => `<li>${t}</li>`).join("")}</ul><div class="product-price">${C.money(p.price)}<small>Starting estimate · ${p.lead}</small></div><div class="product-actions">${p.category === "modular" ? `<button class="secha-button secondary" onclick="previewProduct('${p.id}')">Try in studio <svg class="action-arrow" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3 13 13 3M3 3h10v10"/></svg></button>` : ""}<button class="secha-button" onclick="addProduct('${p.id}')">${p.category === "modular" ? "Add build to bag" : "Add design to bag"}</button></div></div></article>`,
    )
    .join("");
}
function updateRoomControls() {
  const product = C.catalogue.find((p) => p.room === roomConfig.room);
  document.getElementById("studio-build-price").textContent = C.money(
    Math.round((product.price / product.modules) * roomConfig.modules),
  );
  for (const [id, key] of [
    ["room-kind", "room"],
    ["room-light", "light"],
    ["room-width", "width"],
    ["room-depth", "depth"],
    ["room-modules", "modules"],
  ])
    document.getElementById(id).value = roomConfig[key];
  document.getElementById("room-width-value").textContent =
    roomConfig.width + " m";
  document.getElementById("room-depth-value").textContent =
    roomConfig.depth + " m";
}
function previewProduct(id) {
  const p = C.catalogue.find((p) => p.id === id);
  if (!p || p.category !== "modular") return;
  Object.assign(roomConfig, { room: p.room, modules: p.modules });
  updateRoomControls();
  if (refreshInterior) refreshInterior();
  document
    .getElementById("finishing-studio")
    .scrollIntoView({ behavior: "smooth" });
  toast("Previewing " + p.name + ". Loose furniture is illustrative.");
}
function addProduct(id, fromStudio = false) {
  const p = C.catalogue.find((p) => p.id === id);
  if (!p) return;
  const b = MOODBOARDS[activeFinishingIdx];
  const config =
    p.category === "modular"
      ? {
          room: p.room,
          width: roomConfig.width,
          depth: roomConfig.depth,
          modules: fromStudio ? roomConfig.modules : p.modules,
        }
      : null;
  const identity = config
    ? `${p.id}:${activeMaterial.id}:${config.width}x${config.depth}:${config.modules}`
    : `${p.id}:${activeMaterial.id}`;
  C.add(cart, {
    id: identity,
    productId: p.id,
    name: p.name,
    type: p.category,
    price: config
      ? Math.round((p.price / p.modules) * config.modules)
      : p.price,
    boardId: b.id,
    boardName: b.name,
    material: { ...activeMaterial },
    config,
  });
  updateCartUI();
  toast("Added to your bag · " + p.name);
}
function addStudioBuild() {
  const p = C.catalogue.find((p) => p.room === roomConfig.room);
  addProduct(p.id, true);
}
function addDesignPackage(tier) {
  addProduct("design-" + tier);
  toggleCart(true);
}
function startDesignRequest() {
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  renderProducts("design");
  document.querySelectorAll("[data-filter]").forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === "design");
    b.setAttribute("aria-pressed", String(b.dataset.filter === "design"));
  });
}
function addToCart() {
  const b = MOODBOARDS[activeFinishingIdx];
  C.add(cart, {
    id: `sample:${activeMaterial.id}`,
    boardId: b.id,
    boardName: b.name,
    material: { ...activeMaterial },
    name: activeMaterial.name + " · physical sample",
    type: "sample",
    price: 150000,
  });
  updateCartUI();
  renderFinishingUI();
  toast("Sample added · " + activeMaterial.name);
}
function updateCartQuantity(id, amount) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity = Math.max(1, Math.min(20, item.quantity + amount));
  updateCartUI();
}
function removeCartItem(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCartUI();
  renderFinishingUI();
}
function applyCoupon(event) {
  event?.preventDefault();
  const value = document
    .getElementById("promo-input")
    .value.trim()
    .toUpperCase();
  coupon = value === "STUDIO10" ? value : "";
  updateCartUI();
  toast(
    coupon
      ? "STUDIO10: 10% off material samples."
      : "Code not recognised. Try STUDIO10 for samples.",
  );
}
function toggleCart(force) {
  const next = typeof force === "boolean" ? force : !isCartOpen;
  if (next === isCartOpen) return;
  isCartOpen = next;
  const drawer = document.getElementById("cart-drawer");
  drawer.hidden = !next;
  document.getElementById("cart-backdrop").hidden = !next;
  document.body.classList.toggle("modal-open", next);
  if (next) {
    drawerOpener = document.activeElement;
    updateCartUI();
    drawer.querySelector("button").focus();
  } else if (drawerOpener?.isConnected) drawerOpener.focus();
}
function totalsMarkup(items = cart) {
  const t = C.totals(items, coupon);
  return `<div class="totals-row"><span>Selections</span><span>${C.money(t.subtotal)}</span></div>${t.discount ? `<div class="totals-row"><span>STUDIO10 · samples</span><span>−${C.money(t.discount)}</span></div>` : ""}<div class="totals-row"><span>Sample delivery estimate</span><span>${t.shipping ? C.money(t.shipping) : "Not applicable"}</span></div><div class="totals-row total"><span>Estimated total</span><strong>${C.money(t.total)}</strong></div><p class="small-note">Build delivery, installation and applicable taxes are confirmed in the final quote. No payment is collected here.</p>`;
}
function updateCartUI() {
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  for (const id of ["cart-count", "nav-cart-count", "mobile-cart-count"]) {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  }
  document.getElementById("cart-indicator").classList.toggle("hidden", !count);
  if (!document.getElementById("cart-items")) return;
  document.getElementById("cart-items").innerHTML = cart.length
    ? cart
        .map(
          (i) =>
            `<article class="cart-item"><div class="cart-item-head"><h3>${C.escape(i.name)}</h3><button class="remove" onclick="removeCartItem('${i.id}')" aria-label="Remove ${C.escape(i.name)}">Remove</button></div><p>${C.escape(i.boardName)} / ${C.escape(i.material.name)}${i.config ? `<br>${i.config.width} × ${i.config.depth} m reference room · ${i.config.modules} modules` : ""}</p><div class="cart-item-bottom"><span>${C.money(i.price * i.quantity)}</span><div class="quantity"><button onclick="updateCartQuantity('${i.id}',-1)" aria-label="Decrease quantity of ${C.escape(i.name)}" ${i.quantity === 1 ? "disabled" : ""}>−</button><span>${i.quantity}</span><button onclick="updateCartQuantity('${i.id}',1)" aria-label="Increase quantity of ${C.escape(i.name)}" ${i.quantity === 20 ? "disabled" : ""}>+</button></div></div></article>`,
        )
        .join("")
    : '<p class="small-note">Your bag is waiting for your space.</p><a class="secha-button secondary" href="#shop" onclick="toggleCart(false)">Explore the collection</a>';
  document.getElementById("cart-footer").innerHTML = cart.length
    ? `<form class="coupon-form" onsubmit="applyCoupon(event)"><input id="promo-input" aria-label="Sample discount code" placeholder="Sample code · STUDIO10" value="${coupon}"><button type="submit">Apply</button></form>${totalsMarkup()}<button class="secha-button" onclick="proceedToCheckout()">Review your request <svg class="action-arrow" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3 13 13 3M3 3h10v10"/></svg></button>`
    : "";
  storageWrite("secha-coupon-v2", coupon);
  if (!storageWrite(CART_KEY, JSON.stringify(cart)))
    toast(
      "Browser storage unavailable. Keep this page open to retain your bag.",
    );
  if (document.getElementById("checkout-summary")) renderCheckoutSummary();
}
function proceedToCheckout() {
  if (!cart.length) {
    toast("Add a selection before preparing a request.");
    return;
  }
  toggleCart(false);
  renderCheckout();
  document.getElementById("onboarding").scrollIntoView({ behavior: "smooth" });
  document.getElementById("customer-name").focus({ preventScroll: true });
}
function renderCheckoutSummary() {
  const el = document.getElementById("checkout-summary");
  el.innerHTML = `<h3>Your selections</h3><ul>${cart.map((i) => `<li>${C.escape(i.name)} × ${i.quantity}<br><span class="small-note">${C.escape(i.material.name)}</span> · ${C.money(i.price * i.quantity)}</li>`).join("")}</ul>${totalsMarkup()}<button class="secha-button secondary" onclick="toggleCart(true)">Edit bag</button>`;
}
function renderCheckout() {
  document.getElementById("onboarding-container").innerHTML =
    `<div class="checkout-layout"><form id="checkout-form" class="checkout-form"><label>Your name *<input id="customer-name" name="name" autocomplete="name" maxlength="100" required></label><label>Email *<input name="email" type="email" autocomplete="email" maxlength="150" required></label><label>Phone / WhatsApp *<input name="phone" type="tel" autocomplete="tel" minlength="8" maxlength="25" pattern="[+0-9 ()-]{8,25}" required></label><label>City *<input name="city" autocomplete="address-level2" maxlength="100" required></label><label class="full">Room address / project location *<textarea name="address" autocomplete="street-address" maxlength="500" rows="2" required></textarea></label><label class="full">Tell us about your room<textarea name="notes" rows="3" maxlength="2000" placeholder="Measurements, preferred timing or delivery notes"></textarea></label><label class="full consent"><input name="consent" type="checkbox" required><span>I understand these prices are estimates. My request is prepared on this device and I will send it to SECHA through WhatsApp to receive a confirmed quote.</span></label><p class="full small-note">Your contact details are included in your request, kept out of the saved cart, and shared with SECHA when you continue in WhatsApp and send the message. Do not enter payment information.</p><button class="full secha-button" type="submit">Prepare order request <svg class="action-arrow" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3 13 13 3M3 3h10v10"/></svg></button></form><aside id="checkout-summary" class="checkout-summary"></aside></div>`;
  const form = document.getElementById("checkout-form");
  for (const [k, v] of Object.entries(checkoutDraft))
    if (form.elements[k] && k !== "consent") form.elements[k].value = v;
  form.addEventListener("input", () => {
    checkoutDraft = Object.fromEntries(new FormData(form));
  });
  form.addEventListener("submit", prepareRequest);
  renderCheckoutSummary();
}
function prepareRequest(event) {
  event.preventDefault();
  if (!cart.length) {
    toast("Your bag is empty. Add a selection to continue.");
    return;
  }
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const customer = Object.fromEntries(new FormData(form));
  for (const k of ["name", "city", "address"])
    if (!customer[k].trim()) {
      form.elements[k].setCustomValidity("Please enter this field.");
      form.elements[k].reportValidity();
      form.elements[k].addEventListener(
        "input",
        () => form.elements[k].setCustomValidity(""),
        { once: true },
      );
      return;
    }
  currentRequest = {
    reference: "SECHA-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "Prepared on your device — not submitted or paid",
    customer,
    items: structuredClone(cart),
    totals: C.totals(cart, coupon),
  };
  const reference = C.escape(currentRequest.reference);
  document.getElementById("onboarding-container").innerHTML =
    `<article class="order-result"><p class="eyebrow">Request prepared / ${reference}</p><h3>Your room, one step closer.</h3><p>Your request has been prepared on this device. It has <strong>not been sent to SECHA</strong>, and no payment has been taken. Continue in WhatsApp to send it to SECHA at +62 877-8601-0290 and confirm scope, price and timing. Review the message in WhatsApp, then tap Send.</p><p>Reference: <strong>${reference}</strong> · Estimate: <strong>${C.money(currentRequest.totals.total)}</strong></p><div class="product-actions"><a id="whatsapp-request" class="secha-button" href="${whatsappRequestUrl()}" target="_blank" rel="noopener noreferrer">Continue in WhatsApp</a><button class="secha-button secondary" onclick="downloadRequest()">Download request</button><button class="secha-button secondary" onclick="copyRequest()">Copy request</button><button class="secha-button secondary" onclick="renderCheckout()">Edit details</button></div><p class="small-note">Your bag remains available. Contact details are kept only in memory until you leave or reload this page.</p></article>`;
  document.querySelector(".order-result").tabIndex = -1;
  document.querySelector(".order-result").focus({ preventScroll: true });
}
function requestText() {
  const r = currentRequest;
  if (!r) return "";
  return [
    `SECHA INTERIOR / ORDER REQUEST`,
    r.reference,
    r.status,
    "",
    `Name: ${r.customer.name}`,
    `Email: ${r.customer.email}`,
    `Phone: ${r.customer.phone}`,
    `City: ${r.customer.city}`,
    `Address: ${r.customer.address}`,
    `Notes: ${r.customer.notes || "—"}`,
    "",
    ...r.items.map(
      (i) =>
        `${i.quantity} × ${i.name} / ${i.material.name}${i.config ? ` / Reference room ${i.config.width} × ${i.config.depth} m, ${i.config.modules} modules` : ""}: ${C.money(i.price * i.quantity)}`,
    ),
    "",
    `Subtotal: ${C.money(r.totals.subtotal)}`,
    `Sample discount: ${C.money(r.totals.discount)}`,
    `Sample delivery estimate: ${C.money(r.totals.shipping)}`,
    `Estimated total: ${C.money(r.totals.total)}`,
    "Final scope, delivery, installation and applicable taxes require SECHA confirmation. No payment collected.",
  ].join("\n");
}
function whatsappRequestUrl() {
  return (
    "https://wa.me/" +
    SECHA_WHATSAPP +
    "?text=" +
    encodeURIComponent(requestText())
  );
}
function downloadRequest() {
  if (!currentRequest) return;
  const url = URL.createObjectURL(
    new Blob([requestText()], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = currentRequest.reference + ".txt";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Request downloaded. Send it to SECHA on WhatsApp.");
}
async function copyRequest() {
  try {
    await navigator.clipboard.writeText(requestText());
    toast("Request copied. Send it to SECHA on WhatsApp.");
  } catch {
    toast("Clipboard unavailable. Download the request instead.");
  }
}
// Legacy detail dialogs retain the design narratives while respecting reduced motion and focus.
let modalOpener;
function openModal(id) {
  const data = id.startsWith("specs-")
    ? getSpecsModalData(Number(id.split("-")[1]))
    : id.startsWith("designer-")
      ? getDesignerModalData(id.slice(9))
      : MODAL_DATA[id];
  if (!data) return;
  modalOpener = document.activeElement;
  document.getElementById("modal-subtitle").textContent = data.subtitle;
  document.getElementById("modal-title").innerHTML = data.title;
  document.getElementById("modal-body").innerHTML = data.body;
  const modal = document.getElementById("global-modal");
  modal.classList.toggle("designer-modal", id.startsWith("designer-"));
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.getElementById("modal-backdrop").style.opacity = 1;
  const wrapper = document.getElementById("modal-content-wrapper");
  wrapper.style.opacity = 1;
  wrapper.style.transform = "none";
  document.body.classList.add("modal-open");
  modal.querySelector("button").focus();
}
function closeModal() {
  const modal = document.getElementById("global-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.toggle("modal-open", isCartOpen);
  if (modalOpener?.isConnected) modalOpener.focus();
}
