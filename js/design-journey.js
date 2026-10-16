/* Guidance links to the single catalogue; the project section starts the brief. */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("investment");
  const container = document.getElementById("onboarding-container");
  if (!section || !container) return;
  const motion = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  section.addEventListener("click", (event) => {
    const button = event.target.closest("[data-design-direction]");
    if (!button) return;
    startDesignRequest();
    const card = document.querySelector(`[data-product-id="${button.dataset.designDirection}"]`);
    if (!card) return;
    card.tabIndex = -1;
    card.scrollIntoView({ behavior: motion(), block: "center" });
    card.focus({ preventScroll: true });
  });
  container.addEventListener("click", (event) => {
    if (!event.target.closest("#request-entry-action")) return;
    if (cart.length) {
      proceedToCheckout();
      return;
    }
    document.querySelector('[data-filter="all"]').click();
    const shop = document.getElementById("shop");
    shop.scrollIntoView({ behavior: motion() });
    document.querySelector('[data-filter="all"]').focus({ preventScroll: true });
  });
  function refreshEntry() {
    const button = document.getElementById("request-entry-action");
    if (!button) return;
    button.innerHTML = `${cart.length ? "Prepare my brief" : "Explore the collection"} <span aria-hidden="true">↗</span>`;
    document.getElementById("request-entry-copy").textContent = cart.length
      ? "Your selections are ready. Tell us about the space you have in mind."
      : "Choose a room system, design service or sample to begin.";
  }
  document.addEventListener("secha:bag-updated", refreshEntry);
  refreshEntry();
});
