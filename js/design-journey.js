/* Present the existing design catalogue and quote request in one studio journey. */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("design-package-grid");
  if (!grid) return;
  const edits = {
    "design-lite": { number: "01", title: "Lite", note: "FIND YOUR DIRECTION", image: "assets/process/direction.svg", copy: "A thoughtful foundation: a concept, a moodboard and a palette to start from." },
    "design-pro": { number: "02", title: "Pro", note: "SEE THE SPACE", image: "assets/process/visualise.svg", copy: "Explore the layout and see your room in three dimensions before the next step." },
    "design-premium": { number: "03", title: "Premium", note: "RESOLVE THE DETAILS", image: "assets/process/detail.svg", copy: "Carry the concept through to detailed drawings and a conversation about the build." },
  };
  grid.innerHTML = C.catalogue.filter((product) => product.category === "design").map((product) => {
    const edit = edits[product.id];
    return `<article class="design-package" aria-labelledby="${product.id}-heading"><div class="design-package-masthead"><span>SECHA / DESIGN STUDIO</span><span>${edit.number}</span></div><div class="design-package-title"><h3 id="${product.id}-heading">${edit.title}</h3><span>${edit.note}</span></div><figure><img src="${edit.image}" alt="Studio drawing for the ${edit.title} design package" width="900" height="650" loading="lazy"></figure><p>${edit.copy}</p><div class="design-package-price"><small>STARTING FROM</small><strong>${C.money(product.price)}</strong><span>${C.escape(product.lead)}</span></div><ul>${product.includes.map((item) => `<li>${C.escape(item)}</li>`).join("")}</ul><button data-design-package="${product.id}">Add ${edit.title} to bag <span aria-hidden="true">↗</span></button></article>`;
  }).join("");
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-design-package]");
    if (!button) return;
    const product = C.catalogue.find((item) => item.id === button.dataset.designPackage);
    addProduct(product.id);
    document.getElementById("design-package-status").textContent = `${product.name} added to your bag. Starting estimate ${C.money(product.price)}.`;
  });
  document.getElementById("design-review-bag").addEventListener("click", () => toggleCart(true));
  document.getElementById("journey-open-request").addEventListener("click", proceedToCheckout);
  function refreshBagPreview() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("journey-selection-count").textContent = count
      ? `${count} ${count === 1 ? "selection" : "selections"} · ${C.money(C.totals(cart, coupon).total)} estimated`
      : "Your bag is ready for its first selection.";
    document.getElementById("journey-open-request").disabled = count === 0;
  }
  document.addEventListener("secha:bag-updated", refreshBagPreview);
  refreshBagPreview();
});
