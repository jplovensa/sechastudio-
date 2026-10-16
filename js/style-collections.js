/* Shop a photographed interior direction through the existing SECHA catalogue. */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("styling-studio");
  const dialog = document.getElementById("curated-style-shop");
  if (!section || !dialog) return;
  const { MOODBOARDS, MATERIAL_PALETTES } = window.SECHA_DESIGN_OPTIONS;
  const cards = [...section.querySelectorAll("[data-style]")];
  const collections = new Map(
    cards.map((card) => {
      const photo = card.querySelector("figure > img");
      return [
        card.dataset.style,
        {
          id: card.dataset.style,
          name: card.querySelector("h3").textContent,
          description: card
            .querySelector(".style-collection-copy > p")
            .textContent.trim(),
          board: MOODBOARDS.find(
            (board) => board.id === card.dataset.styleBoard,
          ),
          product: C.catalogue.find(
            (product) => product.id === card.dataset.styleProduct,
          ),
          photo: photo.getAttribute("src"),
          alt: photo.alt,
          colours: [...card.querySelectorAll(".style-collection-meta i")].map(
            (swatch) => swatch.style.getPropertyValue("--tone"),
          ),
        },
      ];
    }),
  );
  let selected = null,
    opener = null;
  const get = (id) => document.getElementById(id);
  const money = C.money;
  const hex = (value) => `#${value.toString(16).padStart(6, "0")}`;

  section.querySelectorAll("[data-style-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.styleFilter;
      section
        .querySelectorAll("[data-style-filter]")
        .forEach((other) =>
          other.setAttribute("aria-pressed", String(other === button)),
        );
      cards.forEach((card) => {
        card.hidden =
          category !== "all" && card.dataset.styleCategory !== category;
      });
      const count = cards.filter((card) => !card.hidden).length;
      get("style-collection-count").textContent =
        `${count} curated ${count === 1 ? "style" : "styles"}`;
    });
  });

  function updateBagCount() {
    get("style-bag-count").textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }
  function openStyle(id, trigger) {
    const collection = collections.get(id);
    if (!collection?.board || !collection.product) return;
    selected = collection;
    opener = trigger;
    const { name, description, product, board } = collection;
    const materials = MATERIAL_PALETTES[board.id];
    get("style-shop-title").textContent = name;
    get("style-shop-description").textContent = description;
    get("style-shop-photo").src = collection.photo;
    get("style-shop-photo").alt = collection.alt;
    get("style-shop-palette").innerHTML = collection.colours
      .map(
        (colour) => `<span style="--tone:${colour}" aria-hidden="true"></span>`,
      )
      .join("");
    get("style-shop-palette").setAttribute("role", "img");
    get("style-shop-palette").setAttribute(
      "aria-label",
      `${name} colour palette`,
    );
    get("style-build-heading").textContent = product.name;
    get("style-build-description").textContent = product.description;
    get("style-build-price").textContent = money(product.price);
    get("style-build-image").src = product.image;
    get("style-build-image").alt =
      `Illustrative SECHA ${product.room} modular setup`;
    get("style-build-finish").innerHTML = materials
      .map(
        (material) =>
          `<option value="${material.id}">${C.escape(material.name)}</option>`,
      )
      .join("");
    get("style-sample-products").innerHTML = materials
      .map(
        (material) =>
          `<article class="style-sample-product"><span class="style-sample-swatch" style="--tone:${hex(material.color)}" aria-hidden="true"></span><h4>${C.escape(material.name)}</h4><p>${C.escape(material.type)} / Physical sample</p><strong>${money(150000)}</strong><button data-add-style-sample="${material.id}" aria-label="Add ${C.escape(material.name)} sample to bag">Add sample <span aria-hidden="true">+</span></button></article>`,
      )
      .join("");
    get("style-shop-status").textContent =
      `The ${name} edit. Choose your modular finish or add a physical sample.`;
    updateBagCount();
    document.body.classList.add("style-shop-open");
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  section.addEventListener("click", (event) => {
    const button = event.target.closest("[data-shop-style]");
    if (button) openStyle(button.dataset.shopStyle, button);
  });
  function addSelection(item) {
    if (
      cart.some(
        (existing) => existing.id === item.id && existing.quantity >= 20,
      )
    ) {
      get("style-shop-status").textContent =
        `Your bag already has the maximum quantity of ${item.name}.`;
      return;
    }
    C.add(cart, item);
    updateCartUI();
    renderFinishingUI();
    updateBagCount();
    get("style-shop-status").textContent =
      `Added ${item.name} to your bag from the ${selected.name} edit.`;
  }
  get("style-add-build").addEventListener("click", () => {
    if (!selected) return;
    const product = selected.product;
    const material = MATERIAL_PALETTES[selected.board.id].find(
      (finish) => finish.id === get("style-build-finish").value,
    );
    if (!material) return;
    const config = {
      room: product.room,
      width: 4,
      depth: 4,
      modules: product.modules,
    };
    addSelection({
      id: `${product.id}:${material.id}:4x4:${product.modules}`,
      productId: product.id,
      name: product.name,
      type: product.category,
      price: product.price,
      boardId: selected.board.id,
      boardName: selected.name,
      material: { ...material },
      config,
    });
  });
  get("style-sample-products").addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-style-sample]");
    if (!button || !selected) return;
    const material = MATERIAL_PALETTES[selected.board.id].find(
      (finish) => finish.id === button.dataset.addStyleSample,
    );
    if (!material) return;
    addSelection({
      id: `sample:${material.id}`,
      name: `${material.name} · physical sample`,
      type: "sample",
      price: 150000,
      boardId: selected.board.id,
      boardName: selected.name,
      material: { ...material },
    });
  });
  get("style-shop-close").addEventListener("click", () => dialog.close());
  get("style-view-bag").addEventListener("click", () => {
    dialog.close();
    toggleCart(true);
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("style-shop-open");
    if (!isCartOpen && opener?.isConnected && opener.getClientRects().length)
      opener.focus({ preventScroll: true });
  });
});
