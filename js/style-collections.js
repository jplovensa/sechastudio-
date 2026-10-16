/* Explore interior concept galleries and shop the existing SECHA catalogue. */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("styling-studio");
  const dialog = document.getElementById("curated-style-shop");
  if (!section || !dialog) return;
  const { MOODBOARDS, MATERIAL_PALETTES } = window.SECHA_DESIGN_OPTIONS;
  const cards = [...section.querySelectorAll("[data-style]")];
  const commercialCards = [...section.querySelectorAll("[data-commercial-style]")];
  const cardSelector = "[data-style], [data-commercial-style]";
  const collections = new Map(
    [...cards, ...commercialCards].map((card) => {
      const photo = card.querySelector("figure > img");
      return [
        card.dataset.style || card.dataset.commercialStyle,
        {
          id: card.dataset.style || card.dataset.commercialStyle,
          commercialType: card.dataset.commercialType,
          name: card.querySelector("h3, h4").textContent,
          description: card
            .querySelector(".style-collection-description")
            .textContent.trim(),
          board: MOODBOARDS.find(
            (board) => board.id === card.dataset.styleBoard,
          ),
          product: C.catalogue.find(
            (product) => product.id === card.dataset.styleProduct,
          ),
          photo: photo.getAttribute("src"),
          alt: photo.alt,
          views: [...card.querySelectorAll("[data-style-view] img")].map(
            (image, index) => ({
              src: image.getAttribute("src"),
              alt: index === 0 ? photo.alt : image.dataset.viewAlt,
              label: image.dataset.viewLabel || image.closest("button").querySelector("span").textContent.replace(/^\d+\s*\/\s*/, ""),
            }),
          ),
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
  const viewer = get("style-gallery-viewer");
  let galleryCollection = null,
    galleryIndex = 0,
    galleryOpener = null;

  function showCardView(card, index) {
    const collection = collections.get(card.dataset.style || card.dataset.commercialStyle);
    const view = collection.views[index];
    const image = card.querySelector("figure > img");
    image.src = view.src;
    image.alt = view.alt;
    card.dataset.activeView = index;
    card.querySelector("[data-gallery-caption]").textContent = view.label;
    card.querySelectorAll("[data-style-view]").forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.styleView) === index));
    });
    get("style-gallery-announcement").textContent = `${collection.name}: ${view.label}, image ${index + 1} of ${collection.views.length}.`;
  }

  function renderGallery() {
    const view = galleryCollection.views[galleryIndex];
    get("style-gallery-image").src = view.src;
    get("style-gallery-image").alt = view.alt;
    get("style-gallery-position").textContent = `${String(galleryIndex + 1).padStart(2, "0")} / ${String(galleryCollection.views.length).padStart(2, "0")} — ${view.label}`;
    get("style-viewer-thumbnails").querySelectorAll("button").forEach((button, index) => {
      button.setAttribute("aria-pressed", String(index === galleryIndex));
    });
  }
  function moveGallery(direction) {
    galleryIndex = (galleryIndex + direction + galleryCollection.views.length) % galleryCollection.views.length;
    renderGallery();
  }
  function openGallery(id, trigger) {
    galleryCollection = collections.get(id);
    galleryIndex = Number(trigger.closest(cardSelector).dataset.activeView || 0);
    galleryOpener = trigger;
    get("style-gallery-title").textContent = galleryCollection.name;
    get("style-gallery-shop").innerHTML = `${galleryCollection.commercialType ? "Plan this space" : "Shop my style"} <span aria-hidden="true">↗</span>`;
    get("style-gallery-disclosure").textContent = galleryCollection.commercialType
      ? "Generated commercial interior concept. Explore this direction in the playground."
      : "Generated interior concept. Explore the look with curated SECHA selections.";
    get("style-viewer-thumbnails").innerHTML = galleryCollection.views.map((view, index) =>
      `<button data-viewer-index="${index}" aria-pressed="${index === galleryIndex}" aria-controls="style-gallery-image" aria-label="Show ${C.escape(view.label)}"><img src="${view.src}" alt="" width="1536" height="1024" loading="lazy"><span>${String(index + 1).padStart(2, "0")} / ${C.escape(view.label)}</span></button>`
    ).join("");
    renderGallery();
    document.body.classList.add("style-gallery-open");
    viewer.showModal();
  }
  get("style-gallery-close").addEventListener("click", () => viewer.close());
  get("style-gallery-previous").addEventListener("click", () => moveGallery(-1));
  get("style-gallery-next").addEventListener("click", () => moveGallery(1));
  get("style-viewer-thumbnails").addEventListener("click", (event) => {
    const button = event.target.closest("[data-viewer-index]");
    if (!button) return;
    galleryIndex = Number(button.dataset.viewerIndex);
    renderGallery();
  });
  viewer.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveGallery(event.key === "ArrowLeft" ? -1 : 1);
  });
  let swipeStart = null;
  const galleryImage = get("style-gallery-image");
  galleryImage.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    swipeStart = { x: event.clientX, y: event.clientY };
  });
  galleryImage.addEventListener("pointerup", (event) => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) moveGallery(dx < 0 ? 1 : -1);
    swipeStart = null;
  });
  galleryImage.addEventListener("pointercancel", () => { swipeStart = null; });
  viewer.addEventListener("close", () => {
    document.body.classList.remove("style-gallery-open");
    if (!dialog.open) galleryOpener?.focus({ preventScroll: true });
  });
  get("style-gallery-shop").addEventListener("click", () => {
    if (galleryCollection.commercialType) {
      const params = new URLSearchParams({ space: "commercial", commercial: galleryCollection.commercialType, moodboard: galleryCollection.board.id });
      location.assign(`playground.html?${params}`);
      return;
    }
    const id = galleryCollection.id;
    const trigger = section.querySelector(`[data-shop-style="${id}"]`);
    viewer.close();
    openStyle(id, trigger);
  });

  section.querySelectorAll("[data-commercial-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      section.querySelectorAll("[data-commercial-filter]").forEach((other) =>
        other.setAttribute("aria-pressed", String(other === button)),
      );
      commercialCards.forEach((card) => {
        card.hidden = card.dataset.commercialStyle !== button.dataset.commercialFilter;
      });
      get("style-gallery-announcement").textContent = `${collections.get(button.dataset.commercialFilter).name} commercial collection selected.`;
    });
  });

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
      `Studio concept sheet for the SECHA ${product.room} system`;
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
    const thumbnail = event.target.closest("[data-style-view]");
    if (thumbnail) showCardView(thumbnail.closest(cardSelector), Number(thumbnail.dataset.styleView));
    const galleryButton = event.target.closest("[data-open-style-gallery]");
    if (galleryButton) openGallery(galleryButton.dataset.openStyleGallery, galleryButton);
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
  function dismissBackdrop(modal, event) {
    if (event.target !== modal) return;
    const rect = modal.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      modal.close();
  }
  dialog.addEventListener("click", (event) => dismissBackdrop(dialog, event));
  viewer.addEventListener("click", (event) => dismissBackdrop(viewer, event));
  dialog.addEventListener("close", () => {
    document.body.classList.remove("style-shop-open");
    if (!isCartOpen && opener?.isConnected && opener.getClientRects().length)
      opener.focus({ preventScroll: true });
  });
});
