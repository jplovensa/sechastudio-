/* SECHA Playground. Local, illustrative design simulation; no order submission. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const { MOODBOARDS, MATERIAL_PALETTES, AMBIANCE_PALETTES } =
    window.SECHA_DESIGN_OPTIONS;
  const boards = Object.fromEntries(
    MOODBOARDS.map((board, index) => [
      board.id,
      { ...board, ambiance: AMBIANCE_PALETTES[index] },
    ]),
  );
  const hex = (value) => `#${value.toString(16).padStart(6, "0")}`;
  const catalog = {
    sofa: {
      name: "Sunday sofa",
      category: "living",
      price: 4200000,
      w: 2.1,
      d: 0.9,
      icon: "▰",
      color: "#b8b29a",
    },
    chair: {
      name: "Lounge chair",
      category: "living",
      price: 1800000,
      w: 0.85,
      d: 0.85,
      icon: "▱",
      color: "#a69c7f",
    },
    table: {
      name: "Pebble table",
      category: "living",
      price: 1200000,
      w: 1.1,
      d: 0.65,
      icon: "⬭",
      color: "#ae845f",
    },
    bed: {
      name: "Cloud bed",
      category: "living",
      price: 4800000,
      w: 1.7,
      d: 2.15,
      icon: "▤",
      color: "#ded9c3",
    },
    desk: {
      name: "Studio desk",
      category: "work",
      price: 2400000,
      w: 1.5,
      d: 0.7,
      icon: "⊓",
      color: "#ac8964",
    },
    counter: {
      name: "Gather counter",
      category: "work",
      price: 3600000,
      w: 2,
      d: 0.75,
      icon: "▥",
      color: "#8e9b7a",
    },
    plant: {
      name: "Indoor olive",
      category: "details",
      price: 450000,
      w: 0.6,
      d: 0.6,
      icon: "♧",
      color: "#748963",
    },
    lamp: {
      name: "Arc floor lamp",
      category: "details",
      price: 850000,
      w: 0.5,
      d: 0.5,
      icon: "◴",
      color: "#c6a66e",
    },
  };
  const spaces = {
    studio: {
      name: "The Sunday studio",
      label: "Studio apartment",
      w: 8,
      d: 6,
      budget: 30000000,
      pieces: [
        ["bed", -2.6, -1.5, 0],
        ["sofa", 0.3, 0.5, 0],
        ["table", 0.4, 1.8, 0],
        ["desk", 1.9, -2.3, 0],
        ["plant", 3.25, -2, 0],
        ["lamp", -1.2, 0.4, 0],
      ],
    },
    residence: {
      name: "A slower kind of home",
      label: "Residence",
      w: 10,
      d: 8,
      budget: 50000000,
      pieces: [
        ["bed", -3, -2.1, 0],
        ["desk", -3, 2.7, 0],
        ["sofa", 1.1, 0.3, 0],
        ["chair", 3.5, 0.4, 0],
        ["table", 1.4, 1.8, 0],
        ["counter", 2, -3.2, 0],
        ["plant", 4.3, 3.3, 0],
        ["lamp", -0.5, 0.4, 0],
      ],
    },
    commercial: {
      name: "The neighbourhood gathering",
      label: "Commercial café",
      w: 10,
      d: 7,
      budget: 45000000,
      pieces: [
        ["counter", -2.8, -2.5, 0],
        ["counter", -0.7, -2.5, 0],
        ["table", -2, 0, 0],
        ["chair", -2, 1, 2],
        ["table", 1.5, 0.5, 0],
        ["chair", 1.5, 1.6, 2],
        ["desk", 3.5, -2.5, 0],
        ["plant", 4.2, 2.7, 0],
      ],
    },
  };
  Object.assign(catalog, {
    stool: {
      name: "Counter stool",
      category: "work",
      price: 950000,
      w: 0.5,
      d: 0.5,
      icon: "⊓",
      color: "#ac8964",
    },
    treatment: {
      name: "Treatment bed",
      category: "work",
      price: 5200000,
      w: 0.85,
      d: 2,
      icon: "▤",
      color: "#ded9c3",
    },
    salon: {
      name: "Styling station",
      category: "work",
      price: 3800000,
      w: 1.1,
      d: 0.5,
      icon: "▥",
      color: "#ac8964",
    },
  });
  const commercialTypes = {
    office: {
      name: "The everyday workspace",
      label: "Office",
      pieces: [
        ["desk", -2.5, -2, 0],
        ["desk", 0, -2, 0],
        ["desk", 2.5, -2, 0],
        ["chair", -2.5, -0.7, 0],
        ["chair", 0, -0.7, 0],
        ["chair", 2.5, -0.7, 0],
        ["sofa", -2.5, 2, 0],
        ["plant", 4, 2.5, 0],
      ],
    },
    cafe: {
      name: spaces.commercial.name,
      label: "Café",
      pieces: spaces.commercial.pieces,
    },
    bar: {
      name: "After-hours gathering",
      label: "Bar",
      pieces: [
        ["counter", -2.5, -2, 0],
        ["counter", -0.3, -2, 0],
        ["counter", 1.9, -2, 0],
        ["stool", -3, -0.8, 0],
        ["stool", -2, -0.8, 0],
        ["stool", -0.8, -0.8, 0],
        ["stool", 0.3, -0.8, 0],
        ["stool", 1.4, -0.8, 0],
        ["stool", 2.5, -0.8, 0],
        ["sofa", 1.5, 2, 0],
        ["plant", -4, 2.5, 0],
      ],
    },
    wellness: {
      name: "A moment to restore",
      label: "Wellness",
      pieces: [
        ["treatment", -2, -0.7, 0],
        ["treatment", 1, -0.7, 0],
        ["counter", 2.5, -2.7, 0],
        ["chair", -3, 2, 0],
        ["plant", -4, -2.5, 0],
        ["plant", 4, 2.5, 0],
        ["lamp", -0.4, 2, 0],
      ],
    },
    salon: {
      name: "The beauty atelier",
      label: "Salon",
      pieces: [
        ["salon", -3, -2.6, 0],
        ["salon", 0, -2.6, 0],
        ["salon", 3, -2.6, 0],
        ["chair", -3, -1.3, 0],
        ["chair", 0, -1.3, 0],
        ["chair", 3, -1.3, 0],
        ["sofa", -2, 2, 0],
        ["counter", 2.5, 2, 0],
        ["plant", 4, -0.2, 0],
      ],
    },
  };
  const palettes = {
    natural: {
      name: "Warm natural",
      wall: "#e8e0cc",
      floor: "#c3a27c",
      fabric: "#d4cdb5",
      accent: "#8e9c75",
    },
    sage: {
      name: "Soft sage",
      wall: "#cbd4bd",
      floor: "#b5a589",
      fabric: "#e3dfcc",
      accent: "#718565",
    },
    clay: {
      name: "Terracotta",
      wall: "#dfbfaa",
      floor: "#b99170",
      fabric: "#ead9bd",
      accent: "#b96e52",
    },
    noir: {
      name: "Gallery noir",
      wall: "#777b76",
      floor: "#82796b",
      fabric: "#bcb8aa",
      accent: "#424e46",
    },
  };
  const storageKey = "secha-playground-v1";
  const money = (n) => new Intl.NumberFormat("id-ID").format(n);
  let nextId = 1;
  const fresh = (type, startMode = "furnished", commercialType = "cafe") => ({
    type,
    startMode,
    commercialType,
    dimensions: { w: spaces[type].w, d: spaces[type].d },
    moodboard: "nomad",
    finishing: "n1",
    finishTarget: "joinery",
    ambiance: "nomad",
    palette: null,
    night: false,
    items: (startMode === "blank"
      ? []
      : type === "commercial"
        ? commercialTypes[commercialType].pieces
        : spaces[type].pieces
    ).map(([kind, x, z, r]) => ({
      id: nextId++,
      kind,
      x,
      z,
      r,
    })),
    quests: { add: false, palette: false, walk: false },
  });
  let state = fresh("studio"),
    selected = null,
    placing = null,
    mode = "build",
    category = "all",
    history = [];
  let scene,
    renderer,
    camera,
    room,
    furniture,
    avatar,
    highlight,
    sun,
    hemisphere,
    warmLight;
  let meshes = [],
    wallColliders = [],
    raycaster,
    floorPlane,
    initialized = false,
    placementGhost = null;
  let angle = 0.76,
    zoom = 1,
    plan = false,
    toastTimer,
    dirty = false;
  let pointer = null,
    dragItem = null,
    dragOrigin = null,
    dragSnapshot = null;
  let destination = null,
    walked = 0,
    keys = new Set(),
    padDirection = null;
  let renderPending = true,
    lastRender = 0;
  const avatarPosition = { x: 0, z: 2.55 };
  function spaceConfig(data = state) {
    const base = spaces[data.type];
    return {
      ...base,
      ...(data.type === "commercial"
        ? {
            name: commercialTypes[data.commercialType].name,
            label: `Commercial · ${commercialTypes[data.commercialType].label}`,
          }
        : {}),
      ...(data.startMode === "blank" ? data.dimensions : {}),
    };
  }
  function roomPalette() {
    if (state.palette) return palettes[state.palette];
    const p = boards[state.ambiance].ambiance;
    return {
      wall: hex(p.wall),
      floor: hex(p.floor),
      fabric: hex(p.fabric),
      accent: p.swatches[2],
      rug: hex(p.rug),
    };
  }
  function selectedFinish() {
    return MATERIAL_PALETTES[state.moodboard].find(
      (f) => f.id === state.finishing,
    );
  }
  function finishMaterial() {
    const finish = selectedFinish();
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(finish.color).convertSRGBToLinear(),
      roughness: finish.roughness,
      metalness: finish.metalness,
      transparent: finish.transparent ?? false,
      opacity: finish.opacity ?? 1,
    });
  }
  function applyTheme() {
    const tones = {
      architect: ["#343735", "#f4f4f0", "#e0e2da", "#c5c9bf"],
      nomad: ["#243e33", "#faf9f5", "#e9ebdf", "#d6e6a2"],
      visionary: ["#34335c", "#f8f7fc", "#e6e4f1", "#d4d0ef"],
      purist: ["#633f31", "#fcf7f1", "#eddfcf", "#e3c0a0"],
      aesthete: ["#44344d", "#f8f5f9", "#dfd7e4", "#d6c4de"],
      dreamer: ["#344e57", "#f8fbfc", "#e5eff0", "#cbe5e8"],
    }[state.moodboard];
    const root = document.documentElement;
    ["--ink", "--paper", "--scene-tone", "--accent"].forEach((name, i) =>
      root.style.setProperty(name, tones[i]),
    );
    root.style.setProperty("--soft-tone", tones[2]);
    root.dataset.moodboard = state.moodboard;
  }
  function notify(text) {
    $("status").textContent = text;
    $("status").classList.remove("quiet");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("status").classList.add("quiet"), 3800);
  }
  function snapshot() {
    return JSON.stringify(state);
  }
  function remember(before = snapshot()) {
    history.push(before);
    if (history.length > 40) history.shift();
    $("undo-action").disabled = false;
  }
  function markDirty() {
    dirty = true;
    $("save-state").textContent = "Unsaved ideas";
  }
  function bounds(item) {
    const info = catalog[item.kind];
    return item.r % 2 ? { w: info.d, d: info.w } : { w: info.w, d: info.d };
  }
  function overlaps(a, b, gap = 0.035) {
    return (
      Math.abs(a.x - b.x) < (a.w + b.w) / 2 + gap &&
      Math.abs(a.z - b.z) < (a.d + b.d) / 2 + gap
    );
  }
  function fits(item, except = item.id) {
    const s = spaceConfig(),
      b = { ...item, ...bounds(item) };
    if (
      Math.abs(b.x) + b.w / 2 > s.w / 2 - 0.12 ||
      Math.abs(b.z) + b.d / 2 > s.d / 2 - 0.12
    )
      return false;
    return (
      !state.items.some(
        (i) => i.id !== except && overlaps(b, { ...i, ...bounds(i) }),
      ) && !wallColliders.some((w) => overlaps(b, w))
    );
  }
  function validState(data) {
    if (!data || !Object.hasOwn(spaces, data.type)) return false;
    // Migrate layouts saved before moodboards and scratch builds were available.
    data.startMode ??= "furnished";
    data.commercialType ??= "cafe";
    data.dimensions ??= { w: spaces[data.type].w, d: spaces[data.type].d };
    data.moodboard ??= "nomad";
    data.finishing ??= "n1";
    data.finishTarget ??= "joinery";
    data.ambiance ??= "nomad";
    if (
      !["furnished", "blank"].includes(data.startMode) ||
      !Object.hasOwn(commercialTypes, data.commercialType) ||
      !Object.hasOwn(boards, data.moodboard) ||
      !Object.hasOwn(boards, data.ambiance) ||
      !MATERIAL_PALETTES[data.moodboard].some((f) => f.id === data.finishing) ||
      !["joinery", "floor", "walls"].includes(data.finishTarget) ||
      !data.dimensions ||
      !Number.isFinite(data.dimensions.w) ||
      !Number.isFinite(data.dimensions.d) ||
      data.dimensions.w < 4 ||
      data.dimensions.w > 16 ||
      data.dimensions.d < 4 ||
      data.dimensions.d > 14 ||
      data.dimensions.w % 0.5 !== 0 ||
      data.dimensions.d % 0.5 !== 0
    )
      return false;

    if (
      !data ||
      !Object.hasOwn(spaces, data.type) ||
      (data.palette !== null && !Object.hasOwn(palettes, data.palette)) ||
      typeof data.night !== "boolean" ||
      !Array.isArray(data.items) ||
      data.items.length > 80
    )
      return false;
    const s = spaceConfig(data),
      ids = new Set();
    for (const i of data.items) {
      if (
        !i ||
        !Object.hasOwn(catalog, i.kind) ||
        !Number.isSafeInteger(i.id) ||
        i.id < 1 ||
        i.id >= Number.MAX_SAFE_INTEGER ||
        ids.has(i.id) ||
        !Number.isFinite(i.x) ||
        !Number.isFinite(i.z) ||
        !Number.isInteger(i.r) ||
        i.r < 0 ||
        i.r > 3
      )
        return false;
      const b = bounds(i);
      if (
        Math.abs(i.x) + b.w / 2 > s.w / 2 - 0.1 ||
        Math.abs(i.z) + b.d / 2 > s.d / 2 - 0.1
      )
        return false;
      ids.add(i.id);
    }
    data.quests = {
      add: data.quests?.add === true,
      palette: data.quests?.palette === true,
      walk: data.quests?.walk === true,
    };
    return true;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (validState(saved)) {
      state = saved;
      nextId = Math.max(0, ...state.items.map((i) => i.id)) + 1;
      $("save-state").textContent = "Saved project restored";
    }
  } catch {
    /* Storage is optional. */
  }
  // A website material or designer direction can style a restored layout without overwriting its saved copy.
  const incoming = new URLSearchParams(location.search);
  let linkedDirection = false;
  if (Object.hasOwn(spaces, incoming.get("space"))) {
    const type = incoming.get("space"),
      commercial = Object.hasOwn(commercialTypes, incoming.get("commercial"))
        ? incoming.get("commercial")
        : "cafe";
    state = fresh(type, "furnished", commercial);
    linkedDirection = true;
  }
  if (Object.hasOwn(boards, incoming.get("moodboard"))) {
    state.moodboard = incoming.get("moodboard");
    state.finishing = MATERIAL_PALETTES[state.moodboard][0].id;
    state.ambiance = state.moodboard;
    state.palette = null;
    linkedDirection = true;
  }
  if (
    MATERIAL_PALETTES[state.moodboard].some(
      (m) => m.id === incoming.get("finishing"),
    )
  ) {
    state.finishing = incoming.get("finishing");
    linkedDirection = true;
  }
  if (linkedDirection) {
    state.quests.palette = true;
    $("save-state").textContent = "Website direction applied · Save to keep";
    dirty = true;
  }
  function thumbnail(kind) {
    const colors = catalog[kind];
    const shapes = {
      sofa: '<path d="M22 38 58 26 95 39 60 52Z" fill="#d7cfb7"/><path d="M22 38v15l38 14V52Z" fill="#aaa78f"/><path d="M60 52v15l35-15V39Z" fill="#bcb69f"/><path d="M22 38V27l37-12 37 13v11L58 27Z" fill="#b8b49d"/><path d="M20 36 30 33 40 37v15l-10 4-10-4Zm65-1 12 4v15l-11 4-9-4V39Z" fill="#c5bea7"/>',
      chair:
        '<path d="M36 43 59 34 83 43 60 54Z" fill="#b3a48a"/><path d="M36 43v13l24 10 23-10V43L60 54Z" fill="#938e72"/><path d="M36 43V25l24-8 23 10v16L60 34Z" fill="#b9b59d"/>',
      table:
        '<path d="M37 39v19m39-22v20M59 48v18" stroke="#7c644a" stroke-width="4"/><ellipse cx="58" cy="35" rx="35" ry="15" fill="#ba9b76"/><ellipse cx="58" cy="32" rx="35" ry="14" fill="#cdb18c"/>',
      bed: '<path d="M25 36 64 21 96 35v20L58 71 25 55Z" fill="#b39773"/><path d="M25 36V20l32-12v19Z" fill="#a58d70"/><path d="M28 35 62 23 91 36v13L58 63 28 51Z" fill="#e2dcc8"/><path d="m38 33 14-5 13 5-14 5Zm20-7 12-4 14 6-12 4Z" fill="#f4eee0"/><path d="m28 44 33-13 30 12v8L58 65 28 53Z" fill="#9ba589"/>',
      desk: '<path d="M28 35v28m57-28v24M58 45v23" stroke="#6c6959" stroke-width="4"/><path d="m22 31 40-13 35 13-40 17Z" fill="#c5a17a"/><path d="M22 31v5l35 17 40-17v-5L57 48Z" fill="#a68662"/><path d="M48 23V8l20 7v16Z" fill="#4a5549"/><path d="m50 11 15 5v11l-15-6Z" fill="#92a494"/>',
      counter:
        '<path d="M24 30 66 15 96 28 54 45Z" fill="#d1c4a5"/><path d="M24 30v27l30 14V45Z" fill="#7e8c71"/><path d="M54 45v26l42-17V28Z" fill="#a0aa8c"/><path d="m64 47 22-8m-22 15 22-8m-22 15 22-8" stroke="#768564"/>',
      plant:
        '<ellipse cx="59" cy="62" rx="17" ry="6" fill="#d6d9c7"/><path d="m44 46 5 16q10 6 20-1l5-15" fill="#b89576"/><ellipse cx="59" cy="46" rx="15" ry="5" fill="#caae8e"/><path d="M59 48V12m0 19L43 21m16 2 14-10" stroke="#847c56" stroke-width="3"/><g fill="#7d9367"><ellipse cx="42" cy="20" rx="12" ry="6" transform="rotate(25 42 20)"/><ellipse cx="71" cy="13" rx="12" ry="6" transform="rotate(-30 71 13)"/><ellipse cx="59" cy="10" rx="9" ry="7"/><ellipse cx="69" cy="30" rx="11" ry="7"/><ellipse cx="49" cy="34" rx="11" ry="7"/></g>',
      lamp: '<ellipse cx="57" cy="62" rx="16" ry="6" fill="#b7b39b"/><path d="M57 61V17q0-11 13-11" fill="none" stroke="#8b7d5b" stroke-width="3"/><path d="m58 11-5 15q15 11 30 0l-5-15Z" fill="#d7c59d"/><ellipse cx="68" cy="26" rx="15" ry="5" fill="#eee0b9"/>',
    };
    return `<svg viewBox="0 0 120 78" aria-hidden="true">${shapes[kind] || shapes[{ stool: "chair", treatment: "bed", salon: "desk" }[kind]]}</svg>`;
  }
  function renderCatalog() {
    const entries = Object.entries(catalog).filter(
      ([, v]) => category === "all" || v.category === category,
    );
    $("catalog-count").textContent = `${entries.length} pieces`;
    $("catalog").innerHTML = entries
      .map(
        ([kind, p]) =>
          `<button class="catalog-card" data-kind="${kind}" aria-pressed="${placing === kind}" aria-label="Place ${p.name}"><span class="add-icon" aria-hidden="true">+</span>${thumbnail(kind)}<strong>${p.name}</strong><small>Rp ${money(p.price)}</small></button>`,
      )
      .join("");
  }
  function renderUI() {
    const s = spaceConfig(),
      total = state.items.reduce((v, i) => v + catalog[i.kind].price, 0);
    $("project-name").textContent = s.name;
    $("project-meta").textContent =
      `${s.label} · ${s.w} × ${s.d} m${state.startMode === "blank" ? " · From scratch" : ""}`;
    $("area-label").textContent = `${s.w * s.d} m²`;
    $("budget-total").textContent = money(total);
    $("budget-caption").textContent =
      total > s.budget
        ? `Rp ${money(total - s.budget)} over the concept budget`
        : `Rp ${money(s.budget - total)} of ${money(s.budget)} left to play with`;
    $("budget-progress").style.width =
      `${Math.min(100, (total / s.budget) * 100)}%`;
    $("budget-progress").style.background =
      total > s.budget ? "#b56a4f" : "#788d55";
    $("piece-count").textContent = state.items.length;
    $("palette-name").textContent = state.palette
      ? palettes[state.palette].name
      : boards[state.ambiance].ambiance.short;
    document
      .querySelectorAll("[data-space]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", b.dataset.space === state.type),
      );
    document
      .querySelectorAll("[data-palette]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", b.dataset.palette === state.palette),
      );
    applyTheme();
    $("commercial-options").hidden = state.type !== "commercial";
    $("commercial-type").value = state.commercialType;
    $("room-size").hidden = state.startMode !== "blank";
    $("room-width").value = s.w;
    $("room-depth").value = s.d;
    $("start-description").textContent =
      state.startMode === "blank"
        ? "An empty shell. Set your dimensions and build your own layout."
        : "A furnished starting point. Make it your own.";
    document
      .querySelectorAll("[data-start]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", b.dataset.start === state.startMode),
      );
    $("moodboard-select").value = state.moodboard;
    $("moodboard-description").textContent = boards[state.moodboard].desc;
    $("finishing-select").innerHTML = MATERIAL_PALETTES[state.moodboard]
      .map((f) => `<option value="${f.id}">${f.name}</option>`)
      .join("");
    $("finishing-select").value = state.finishing;
    $("finish-target").value = state.finishTarget;
    $("finish-swatch").style.backgroundColor = hex(selectedFinish().color);
    $("finish-description").textContent =
      `${selectedFinish().type} · Applied to ${{ joinery: "furniture & joinery", floor: "flooring", walls: "walls" }[state.finishTarget]}`;
    $("ambiance-select").value = state.ambiance;
    document
      .querySelectorAll("[data-light]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          (b.dataset.light === "evening") === state.night,
        ),
      );
    $("daylight").setAttribute("aria-pressed", !state.night);
    $("daylight").textContent = state.night ? "☾" : "☀";
    $("placed-list").innerHTML = state.items.length
      ? state.items
          .map(
            (i) =>
              `<button class="placed-piece" data-select="${i.id}" aria-pressed="${i.id === selected}" aria-label="Select ${catalog[i.kind].name}, piece ${i.id}"><span class="piece-icon" aria-hidden="true">${catalog[i.kind].icon}</span><span><strong>${catalog[i.kind].name}</strong><small>Rp ${money(catalog[i.kind].price)}</small></span><span aria-hidden="true">→</span></button>`,
          )
          .join("")
      : '<p class="catalog-hint">A blank canvas. Add your first piece.</p>';
    const item = state.items.find((i) => i.id === selected);
    $("selection-panel").hidden = !item || mode !== "build";
    if (item) $("selected-name").textContent = catalog[item.kind].name;
    const progress = Object.values(state.quests).filter(Boolean).length;
    $("quest-count").textContent = `${progress}/3`;
    $("quest-progress").style.width = `${(progress / 3) * 100}%`;
    document
      .querySelector(".quest-progress")
      .setAttribute("aria-valuenow", progress);
    $("quest-title").textContent =
      progress === 3 ? "A space with your signature" : "Make room for living";
    $("quest-detail").textContent =
      progress === 3
        ? "Quest complete. Keep exploring your ideas."
        : !state.quests.add
          ? "Add a new piece to make it yours."
          : !state.quests.palette
            ? "Try a different finish palette."
            : "Take a few steps in Walk through.";
    $("undo-action").disabled = !history.length;
  }
  function choose(id) {
    selected = id;
    placing = null;
    renderCatalog();
    $("scene").classList.remove("placing");
    renderUI();
    updateHighlight();
  }
  function changed() {
    if (!placing) clearGhost();
    markDirty();
    renderUI();
    rebuild();
  }
  function disposeGroup(group) {
    if (!group) return;
    const geo = new Set(),
      mat = new Set();
    group.traverse((o) => {
      if (o.geometry) geo.add(o.geometry);
      if (o.material) mat.add(o.material);
    });
    geo.forEach((g) => g.dispose());
    mat.forEach((m) => m.dispose());
    scene.remove(group);
  }
  function material(color, roughness = 0.8) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color).convertSRGBToLinear(),
      roughness,
    });
  }
  function box(parent, w, h, d, x, y, z, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function cylinder(parent, top, bottom, h, x, y, z, mat, segments = 20) {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(top, bottom, h, segments),
      mat,
    );
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function sphere(parent, r, x, y, z, mat, sx = 1, sy = 1, sz = 1) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  function makeFurniture(item) {
    const g = new THREE.Group(),
      p = roomPalette(),
      wood =
        state.finishTarget === "joinery"
          ? finishMaterial()
          : material("#a78661"),
      fabric =
        state.finishTarget === "joinery" && selectedFinish().type === "Fabric"
          ? finishMaterial()
          : material(p.fabric),
      accent = material(p.accent),
      dark = material("#454b3b"),
      cream = material("#f0ead8"),
      metal =
        state.finishTarget === "joinery" && selectedFinish().type === "Metal"
          ? finishMaterial()
          : material("#9f8b56", 0.35);
    if (item.kind === "sofa" || item.kind === "chair") {
      const w = item.kind === "sofa" ? 2.1 : 0.85;
      box(g, w, 0.23, 0.85, 0, 0.3, 0, fabric);
      box(g, w, 0.55, 0.17, 0, 0.62, -0.35, fabric);
      for (const x of [-w / 2 + 0.08, w / 2 - 0.08]) {
        box(g, 0.16, 0.37, 0.85, x, 0.52, 0, fabric);
        box(g, 0.08, 0.19, 0.68, x, 0.1, 0, wood);
      }
      const n = item.kind === "sofa" ? 3 : 1;
      for (let i = 0; i < n; i++)
        box(
          g,
          (w - 0.38) / n - 0.025,
          0.13,
          0.62,
          -(w - 0.38) / 2 + ((i + 0.5) * (w - 0.38)) / n,
          0.48,
          0.05,
          cream,
        );
      if (n > 1) {
        const cushion = box(g, 0.35, 0.33, 0.15, -0.6, 0.73, -0.2, accent);
        cushion.rotation.z = -0.2;
      }
    } else if (item.kind === "table") {
      const top = cylinder(g, 0.57, 0.57, 0.08, 0, 0.43, 0, wood, 40);
      top.scale.z = 0.57;
      for (const x of [-0.34, 0.34]) box(g, 0.08, 0.4, 0.35, x, 0.2, 0, dark);
      cylinder(g, 0.1, 0.1, 0.02, 0.1, 0.49, 0, cream);
      sphere(g, 0.08, -0.18, 0.54, -0.03, accent, 1, 0.6, 1);
    } else if (item.kind === "bed") {
      box(g, 1.7, 0.28, 2.1, 0, 0.25, 0, wood);
      box(g, 1.66, 0.25, 2.03, 0, 0.5, 0, cream);
      box(g, 1.7, 0.95, 0.12, 0, 0.6, -1.02, fabric);
      box(g, 1.68, 0.05, 1.25, 0, 0.65, 0.4, accent);
      for (const x of [-0.43, 0.43])
        box(g, 0.67, 0.14, 0.42, x, 0.68, -0.65, cream);
      for (let i = 0; i < 5; i++)
        box(g, 1.67, 0.008, 0.008, 0, 0.681, 0.05 + i * 0.2, fabric);
    } else if (item.kind === "desk") {
      box(g, 1.5, 0.08, 0.7, 0, 0.78, 0, wood);
      for (const x of [-0.63, 0.63]) box(g, 0.06, 0.75, 0.58, x, 0.38, 0, dark);
      box(g, 0.56, 0.35, 0.04, 0, 1.06, -0.16, dark);
      box(g, 0.08, 0.18, 0.06, 0, 0.88, -0.16, dark);
      box(g, 0.3, 0.025, 0.17, 0, 0.83, -0.12, dark);
      box(g, 0.48, 0.26, 0.01, 0, 1.07, -0.135, accent);
      box(g, 0.35, 0.025, 0.12, 0, 0.835, 0.15, cream);
      cylinder(g, 0.075, 0.055, 0.12, 0.55, 0.88, 0.1, cream);
    } else if (item.kind === "counter") {
      box(g, 2, 0.95, 0.7, 0, 0.48, 0, accent);
      box(g, 2.06, 0.07, 0.75, 0, 0.99, 0, cream);
      for (let x = -0.9; x < 1; x += 0.12)
        box(g, 0.025, 0.82, 0.015, x, 0.5, 0.36, wood);
      box(g, 0.35, 0.28, 0.3, -0.55, 1.16, 0, dark);
      cylinder(g, 0.08, 0.08, 0.12, 0.35, 1.09, 0.05, cream);
    } else if (item.kind === "stool") {
      cylinder(g, 0.24, 0.24, 0.12, 0, 0.82, 0, fabric);
      for (const x of [-0.16, 0.16])
        for (const z of [-0.16, 0.16])
          box(g, 0.035, 0.74, 0.035, x, 0.39, z, metal);
      box(g, 0.36, 0.03, 0.03, 0, 0.3, 0.16, metal);
    } else if (item.kind === "treatment") {
      box(g, 0.8, 0.12, 1.95, 0, 0.74, 0, wood);
      box(g, 0.84, 0.16, 1.98, 0, 0.87, 0, fabric);
      for (const x of [-0.32, 0.32])
        for (const z of [-0.75, 0.75])
          box(g, 0.06, 0.68, 0.06, x, 0.34, z, wood);
      box(g, 0.62, 0.12, 0.38, 0, 1, -0.65, cream);
      box(g, 0.85, 0.025, 0.65, 0, 0.965, 0.6, accent);
    } else if (item.kind === "salon") {
      box(g, 1.1, 0.08, 0.5, 0, 0.83, 0, wood);
      box(g, 0.45, 0.76, 0.45, -0.3, 0.4, 0, wood);
      box(g, 0.06, 0.8, 0.45, 0.49, 0.4, 0, metal);
      box(g, 0.78, 1.1, 0.06, 0, 1.5, -0.22, metal);
      box(g, 0.68, 1, 0.065, 0, 1.5, -0.18, material("#a7c6cb", 0.08));
      cylinder(g, 0.06, 0.055, 0.2, 0.4, 0.97, 0, accent);
    } else if (item.kind === "plant") {
      cylinder(g, 0.22, 0.16, 0.38, 0, 0.2, 0, material("#b18d6a"));
      cylinder(g, 0.18, 0.18, 0.015, 0, 0.395, 0, dark);
      cylinder(g, 0.022, 0.035, 1.2, 0, 0.95, 0, wood, 8);
      for (let i = 0; i < 9; i++) {
        const a = i * 2.4;
        const x = Math.sin(a) * 0.17,
          z = Math.cos(a) * 0.15,
          y = 0.85 + i * 0.08;
        sphere(g, 0.23, x, y, z, accent, 1, 0.65, 0.8);
      }
    } else if (item.kind === "lamp") {
      cylinder(g, 0.22, 0.24, 0.04, 0, 0.03, 0, dark);
      cylinder(g, 0.018, 0.018, 1.55, 0, 0.8, 0, metal, 10);
      cylinder(g, 0.16, 0.3, 0.32, 0, 1.62, 0, cream);
      cylinder(g, 0.28, 0.28, 0.01, 0, 1.455, 0, material("#ebd7a1"));
    }
    g.position.set(item.x, 0, item.z);
    g.rotation.y = (item.r * Math.PI) / 2;
    g.userData.itemId = item.id;
    return g;
  }
  function rebuild() {
    if (!initialized) return;
    disposeGroup(room);
    disposeGroup(furniture);
    room = new THREE.Group();
    furniture = new THREE.Group();
    scene.add(room, furniture);
    wallColliders = [];
    const s = spaceConfig(),
      p = roomPalette(),
      floor =
        state.finishTarget === "floor" ? finishMaterial() : material(p.floor),
      wall =
        state.finishTarget === "walls" ? finishMaterial() : material(p.wall),
      trim = material("#f1ecd9"),
      frame = material("#6a705a");
    scene.background = new THREE.Color(
      state.night
        ? "#52535c"
        : getComputedStyle(document.documentElement)
            .getPropertyValue("--scene-tone")
            .trim(),
    ).convertSRGBToLinear();
    scene.fog = new THREE.Fog(scene.background, 40, 100);
    if (scene.userData.ground)
      scene.userData.ground.material.color.copy(scene.background);
    box(room, s.w + 0.35, 0.25, s.d + 0.35, 0, -0.16, 0, material("#e8e5d7"));
    box(room, s.w, 0.04, s.d, 0, -0.015, 0, floor);
    if (state.finishTarget !== "floor" || selectedFinish().type === "Wood") {
      for (let x = -s.w / 2 + 0.25; x < s.w / 2; x += 0.38)
        box(
          room,
          0.012,
          0.005,
          s.d,
          x,
          0.009,
          0,
          material(state.night ? "#9b886b" : "#b2926c"),
        );
      for (let z = -s.d / 2 + 1; z < s.d / 2; z += 1.3)
        for (let x = -s.w / 2 + 0.2; x < s.w / 2; x += 0.76)
          box(
            room,
            0.36,
            0.005,
            0.008,
            x + (Math.round(z) % 2) * 0.35,
            0.01,
            z,
            material("#a98a68"),
          );
    }
    // Cutaway shell: two open sides keep the layout legible while editing.
    box(room, s.w, 0.8, 0.14, 0, 0.4, -s.d / 2, wall);
    box(room, s.w, 0.43, 0.14, 0, 2.57, -s.d / 2, wall);
    const paneW = (s.w - 1) / 3;
    for (let i = 0; i < 4; i++)
      box(
        room,
        0.12,
        1.58,
        0.15,
        -s.w / 2 + 0.2 + (i * (s.w - 0.4)) / 3,
        1.58,
        -s.d / 2,
        trim,
      );
    const glass = new THREE.MeshStandardMaterial({
      color: "#b9d1c2",
      transparent: true,
      opacity: 0.3,
      roughness: 0.2,
    });
    box(room, s.w - 0.35, 1.52, 0.035, 0, 1.57, -s.d / 2, glass);
    for (let i = 0; i < 3; i++) {
      box(
        room,
        paneW,
        0.04,
        0.17,
        -s.w / 2 + 0.2 + paneW / 2 + (i * (s.w - 0.4)) / 3,
        1.57,
        -s.d / 2,
        trim,
      );
    }
    box(room, 0.14, 2.8, s.d, -s.w / 2, 1.4, 0, wall);
    box(room, 0.16, 0.12, s.d, -s.w / 2 + 0.02, 0.08, 0, trim);
    box(room, s.w, 0.12, 0.17, 0, 0.08, -s.d / 2 + 0.03, trim);
    if (state.startMode !== "blank") {
      // Wall art and joinery give the scene an inhabited, architectural feel.
      box(room, 0.08, 0.95, 1.2, -s.w / 2 + 0.09, 1.65, 0.3, frame);
      box(room, 0.085, 0.81, 1.06, -s.w / 2 + 0.1, 1.65, 0.3, trim);
      box(
        room,
        0.09,
        0.38,
        0.38,
        -s.w / 2 + 0.11,
        1.63,
        0.2,
        material(p.accent),
      );
    }
    if (state.type === "residence" && state.startMode !== "blank") {
      // Bedroom divider with a 1.4 m opening at the front.
      const depth = s.d - 2.2;
      box(room, 0.13, 1.35, depth, -1, 0.675, -1.1, wall);
      wallColliders.push({ x: -1, z: -1.1, w: 0.13, d: depth });
      box(room, 0.16, 0.08, depth, -1, 1.39, -1.1, woodMaterial());
    }
    if (state.type === "commercial" && state.startMode !== "blank") {
      box(room, 0.1, 0.9, 1.65, -s.w / 2 + 0.09, 1.7, -0.8, frame);
      box(
        room,
        0.11,
        0.74,
        1.48,
        -s.w / 2 + 0.1,
        1.7,
        -0.8,
        material("#d4dcc0"),
      );
      for (let z = -0.9; z < 0.1; z += 0.28)
        box(room, 0.12, 0.025, 0.6, -s.w / 2 + 0.12, 1.8, z, frame);
    }
    if (state.startMode !== "blank") {
      const rug = box(
        room,
        state.type === "studio" ? 3.6 : 4.6,
        0.012,
        3.1,
        state.type === "residence" ? 1.6 : 0.35,
        0.025,
        1,
        material(p.fabric),
      );
      for (let i = 0; i < 10; i++)
        box(
          room,
          0.018,
          0.004,
          3.05,
          rug.position.x - (state.type === "studio" ? 1.5 : 2) + i * 0.35,
          0.034,
          1,
          material(p.accent),
        );
    }
    meshes = state.items.map(makeFurniture);
    meshes.forEach((m) => furniture.add(m));
    sun.intensity = state.night ? 0.25 : 1.25;
    hemisphere.intensity = state.night ? 0.5 : 0.85;
    warmLight.intensity = state.night ? 1.7 : 0.25;
    ensureAvatar();
    updateHighlight();
    updateCamera(true);
  }
  function woodMaterial() {
    return material("#ac916a");
  }
  function walkable(x, z) {
    const s = spaceConfig(),
      point = { x, z, w: 0.38, d: 0.38 };
    return (
      Math.abs(x) < s.w / 2 - 0.27 &&
      Math.abs(z) < s.d / 2 - 0.27 &&
      !state.items.some((i) =>
        overlaps(point, { ...i, ...bounds(i) }, 0.025),
      ) &&
      !wallColliders.some((w) => overlaps(point, w, 0.025))
    );
  }
  function ensureAvatar() {
    if (!walkable(avatarPosition.x, avatarPosition.z)) {
      const s = spaceConfig();
      let found = false;
      for (let z = s.d / 2 - 0.5; z > -s.d / 2 && !found; z -= 0.5)
        for (let x = 0; x < s.w / 2 - 0.3; x += 0.5)
          if (walkable(x, z)) {
            avatarPosition.x = x;
            avatarPosition.z = z;
            found = true;
            break;
          }
    }
    destination = null;
    if (avatar) avatar.position.set(avatarPosition.x, 0, avatarPosition.z);
  }
  function updateHighlight() {
    if (!initialized) return;
    renderPending = true;
    if (highlight) {
      disposeGroup(highlight);
      highlight = null;
    }
    const item = state.items.find((i) => i.id === selected);
    if (!item || mode !== "build") return;
    const b = bounds(item);
    highlight = new THREE.Group();
    const points = [
      [-b.w / 2, -b.d / 2],
      [b.w / 2, -b.d / 2],
      [b.w / 2, b.d / 2],
      [-b.w / 2, b.d / 2],
      [-b.w / 2, -b.d / 2],
    ].map(([x, z]) => new THREE.Vector3(x, 0.055, z));
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: "#425c36" }),
    );
    highlight.add(line);
    highlight.position.set(item.x, 0, item.z);
    scene.add(highlight);
  }
  const targetCamera = { position: null, target: null };
  function updateCamera(immediate = false) {
    if (!initialized) return;
    renderPending = true;
    const s = spaceConfig(),
      size = Math.max(s.w, s.d),
      aspect = $("scene").clientWidth / $("scene").clientHeight;
    const distance = ((size * 1.62) / Math.min(1.1, aspect)) * zoom;
    let target = new THREE.Vector3(0, 0, 0),
      pos;
    if (mode === "walk" && !plan) {
      target = new THREE.Vector3(avatarPosition.x, 0.65, avatarPosition.z);
      pos = new THREE.Vector3(
        avatarPosition.x + Math.sin(angle) * 5.5 * zoom,
        4.5 * zoom,
        avatarPosition.z + Math.cos(angle) * 5.5 * zoom,
      );
    } else if (plan) {
      pos = new THREE.Vector3(0, distance * 1.2, 0.001);
    } else {
      target.y = 0.2;
      pos = new THREE.Vector3(
        Math.sin(angle) * distance,
        distance * 0.9,
        Math.cos(angle) * distance,
      );
    }
    // Leave room for the title and tools above the model.
    if (mode === "build") target.y = 1.1;
    targetCamera.position = pos;
    targetCamera.target = target;
    if (immediate) {
      camera.position.copy(pos);
      camera.lookAt(target);
    }
  }
  function init3D() {
    try {
      if (!window.THREE) throw Error("Three.js unavailable");
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.95;
      renderer.domElement.setAttribute("aria-hidden", "true");
      $("scene").append(renderer.domElement);
      hemisphere = new THREE.HemisphereLight("#fbf5df", "#7f8974", 1.15);
      sun = new THREE.DirectionalLight("#fff0d0", 1.65);
      sun.position.set(3, 9, 5);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.left = -9;
      sun.shadow.camera.right = 9;
      sun.shadow.camera.top = 9;
      sun.shadow.camera.bottom = -9;
      sun.shadow.bias = -0.001;
      warmLight = new THREE.PointLight("#ffc078", 0.35, 20);
      warmLight.position.set(-2, 3, 0);
      scene.add(hemisphere, sun, warmLight);
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        material("#e9ebdf"),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.31;
      ground.receiveShadow = true;
      scene.add(ground);
      scene.userData.ground = ground;
      avatar = new THREE.Group();
      const shirt = material("#798d56"),
        skin = material("#d6ad83"),
        pants = material("#454d41");
      cylinder(avatar, 0.14, 0.17, 0.4, 0, 0.78, 0, shirt);
      sphere(avatar, 0.14, 0, 1.13, 0, skin);
      sphere(avatar, 0.145, 0, 1.18, -0.025, material("#4c4937"), 1, 0.65, 1);
      for (const x of [-0.085, 0.085]) {
        box(avatar, 0.11, 0.4, 0.12, x, 0.35, 0, pants);
        box(avatar, 0.12, 0.08, 0.22, x, 0.12, 0.035, material("#ede4cc"));
      }
      for (const x of [-0.22, 0.22])
        cylinder(avatar, 0.045, 0.04, 0.36, x, 0.77, 0, skin, 10);
      const diamond = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.13),
        material("#b5d47e", 0.35),
      );
      diamond.position.y = 1.65;
      avatar.add(diamond);
      avatar.userData.diamond = diamond;
      avatar.visible = false;
      scene.add(avatar);
      raycaster = new THREE.Raycaster();
      floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      initialized = true;
      const resize = () => {
        const w = $("scene").clientWidth,
          h = $("scene").clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        updateCamera(true);
      };
      new ResizeObserver(resize).observe($("scene"));
      rebuild();
      resize();
      bindPointer();
      animate();
    } catch (e) {
      initialized = false;
      $("webgl-fallback").hidden = false;
      notify(
        "3D could not start. Your layout tools and saved project are still available.",
      );
      console.warn("Playground WebGL:", e.message);
    }
  }
  function floorPoint(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      camera,
    );
    return raycaster.ray.intersectPlane(floorPlane, new THREE.Vector3());
  }
  function hitItem() {
    const hits = raycaster.intersectObjects(meshes, true);
    if (!hits.length) return null;
    let o = hits[0].object;
    while (o && !o.userData.itemId) o = o.parent;
    return o?.userData.itemId ?? null;
  }
  const snap = (v) => Math.round(v * 4) / 4;
  function ghostAt(x, z) {
    if (!initialized || !placing) return;
    renderPending = true;
    if (!placementGhost) {
      placementGhost = new THREE.Group();
      scene.add(placementGhost);
    }
    const b = bounds({ kind: placing, r: 0 });
    if (placementGhost.children.length) {
      const old = placementGhost.children[0];
      old.geometry.dispose();
      old.material.dispose();
      placementGhost.remove(old);
    }
    const candidate = { id: -1, kind: placing, x: snap(x), z: snap(z), r: 0 };
    const ghost = new THREE.Mesh(
      new THREE.BoxGeometry(b.w, 0.06, b.d),
      new THREE.MeshBasicMaterial({
        color: fits(candidate) ? "#6f9148" : "#c16750",
        transparent: true,
        opacity: 0.55,
      }),
    );
    ghost.position.set(candidate.x, 0.08, candidate.z);
    placementGhost.add(ghost);
  }
  function clearGhost() {
    if (placementGhost) {
      disposeGroup(placementGhost);
      placementGhost = null;
      renderPending = true;
    }
  }
  function addAt(x, z) {
    if (!placing) return;
    if (state.items.length >= 80) {
      notify("This space has 80 pieces. Remove a piece to add another.");
      return;
    }
    const item = { id: nextId, kind: placing, x: snap(x), z: snap(z), r: 0 };
    if (!fits(item)) {
      notify(
        "Give this piece a little room. Choose an open spot inside the floor.",
      );
      return;
    }
    remember();
    nextId++;
    state.items.push(item);
    state.quests.add = true;
    selected = item.id;
    const name = catalog[placing].name;
    placing = null;
    clearGhost();
    renderCatalog();
    $("scene").classList.remove("placing");
    changed();
    notify(`${name} added. Drag it or use the arrow controls to move it.`);
  }
  function bindPointer() {
    const canvas = renderer.domElement;
    canvas.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      $("scene").focus({ preventScroll: true });
      const point = floorPoint(e);
      pointer = { x: e.clientX, y: e.clientY, lastX: e.clientX, moved: false };
      canvas.setPointerCapture(e.pointerId);
      if (mode === "build" && !placing) {
        const id = hitItem();
        choose(id);
        dragItem = id;
        const item = state.items.find((i) => i.id === id);
        if (item && point) {
          dragOrigin = { x: point.x - item.x, z: point.z - item.z };
          dragSnapshot = snapshot();
        }
      }
    });
    canvas.addEventListener("pointermove", (e) => {
      if (placing) {
        const p = floorPoint(e);
        if (p) ghostAt(p.x, p.z);
      }
      if (!pointer) return;
      const dx = e.clientX - pointer.x,
        dy = e.clientY - pointer.y;
      if (Math.hypot(dx, dy) > 5) pointer.moved = true;
      if (pointer.moved && mode === "build" && !placing) {
        if (dragItem && dragOrigin) {
          const point = floorPoint(e),
            item = state.items.find((i) => i.id === dragItem);
          if (!point || !item) return;
          const candidate = {
            ...item,
            x: snap(point.x - dragOrigin.x),
            z: snap(point.z - dragOrigin.z),
          };
          if (fits(candidate)) {
            Object.assign(item, candidate);
            const mesh = meshes.find((m) => m.userData.itemId === item.id);
            mesh.position.set(item.x, 0, item.z);
            updateHighlight();
          }
        } else {
          angle -= (e.clientX - pointer.lastX) * 0.008;
          plan = false;
          $("plan-view").setAttribute("aria-pressed", false);
          updateCamera();
        }
      }
      pointer.lastX = e.clientX;
    });
    function release(e, cancelled = false) {
      if (!pointer) return;
      const point = floorPoint(e);
      if (!cancelled && !pointer.moved && point) {
        if (mode === "build" && placing) addAt(point.x, point.z);
        else if (mode === "walk") {
          if (walkable(point.x, point.z)) {
            destination = { x: point.x, z: point.z };
            notify("On your way. Use the arrow keys to find your own path.");
          } else
            notify("That spot is occupied. Pick an open part of the floor.");
        }
      }
      if (dragSnapshot && snapshot() !== dragSnapshot) {
        if (cancelled) {
          state = JSON.parse(dragSnapshot);
          rebuild();
        } else {
          remember(dragSnapshot);
          markDirty();
          ensureAvatar();
          renderUI();
        }
      }
      pointer = null;
      dragItem = null;
      dragOrigin = null;
      dragSnapshot = null;
    }
    canvas.addEventListener("pointerup", (e) => release(e));
    canvas.addEventListener("pointercancel", (e) => release(e, true));
    canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        zoom = Math.max(0.65, Math.min(1.8, zoom + Math.sign(e.deltaY) * 0.08));
        updateCamera();
      },
      { passive: false },
    );
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      notify(
        "The 3D context was interrupted. Save your layout and reload to resume.",
      );
    });
  }
  function moveSelected(dx, dz) {
    const item = state.items.find((i) => i.id === selected);
    if (!item) return;
    const candidate = { ...item, x: item.x + dx, z: item.z + dz };
    if (!fits(candidate)) {
      notify("There’s another piece or a wall in the way.");
      return;
    }
    remember();
    Object.assign(item, candidate);
    changed();
  }
  function setMode(value) {
    mode = value;
    destination = null;
    keys.clear();
    selected = null;
    placing = null;
    clearGhost();
    plan = false;
    document
      .querySelectorAll("[data-mode]")
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === mode));
    $("plan-view").setAttribute("aria-pressed", false);
    $("walk-pad").hidden = mode !== "walk";
    $("scene").classList.toggle("walking", mode === "walk");
    $("scene").classList.remove("placing");
    $("scene-hint").textContent =
      mode === "walk"
        ? "Walk mode / WASD, arrow keys or tap to explore"
        : "Build mode / Drag a piece to make it yours";
    if (avatar) {
      ensureAvatar();
      avatar.visible = mode === "walk";
    }
    renderCatalog();
    renderUI();
    updateHighlight();
    updateCamera(true);
    if (mode === "walk") $("scene").focus({ preventScroll: true });
    notify(
      mode === "walk"
        ? "Meet your space. Use WASD, arrow keys or the on-screen pad to walk."
        : "Back to the drawing board. Choose a piece to start styling.",
    );
  }
  let lastTime = 0,
    elapsed = 0,
    active = true;
  new IntersectionObserver((entries) => {
    active = entries[0].isIntersecting;
  }).observe($("workspace"));
  function animate(time = 0) {
    requestAnimationFrame(animate);
    const dt = Math.min((time - lastTime) / 1000, 0.25);
    lastTime = time;
    if (document.hidden || !active) return;
    elapsed += dt;
    if (mode === "walk") {
      let dx = 0,
        dz = 0;
      if (keys.has("w") || keys.has("arrowup") || padDirection === "forward")
        dz -= 1;
      if (keys.has("s") || keys.has("arrowdown") || padDirection === "back")
        dz += 1;
      if (keys.has("a") || keys.has("arrowleft") || padDirection === "left")
        dx -= 1;
      if (keys.has("d") || keys.has("arrowright") || padDirection === "right")
        dx += 1;
      if (dx || dz) destination = null;
      else if (destination) {
        dx = destination.x - avatarPosition.x;
        dz = destination.z - avatarPosition.z;
        if (Math.hypot(dx, dz) < 0.07) {
          destination = null;
          dx = dz = 0;
        }
      }
      const len = Math.hypot(dx, dz);
      if (len) {
        dx = (dx / len) * dt * 1.8;
        dz = (dz / len) * dt * 1.8;
        const old = { ...avatarPosition };
        // Small collision steps prevent crossing thin walls on a delayed frame.
        const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.08));
        for (let i = 0; i < steps; i++) {
          if (walkable(avatarPosition.x + dx / steps, avatarPosition.z))
            avatarPosition.x += dx / steps;
          if (walkable(avatarPosition.x, avatarPosition.z + dz / steps))
            avatarPosition.z += dz / steps;
        }
        const distance = Math.hypot(
          avatarPosition.x - old.x,
          avatarPosition.z - old.z,
        );
        walked += distance;
        if (distance < 0.0001 && destination) {
          destination = null;
          notify(
            "A piece is in the way. Try a clear path or use the arrow keys.",
          );
        }
        avatar.rotation.y = Math.atan2(dx, dz);
        avatar.position.set(
          avatarPosition.x,
          distance > 0 &&
            !matchMedia("(prefers-reduced-motion: reduce)").matches
            ? Math.sin(elapsed * 15) * 0.025
            : 0,
          avatarPosition.z,
        );
        if (walked > 1.5 && !state.quests.walk) {
          state.quests.walk = true;
          markDirty();
          renderUI();
          notify("A new perspective. Walkthrough quest complete.");
        }
        updateCamera();
      }
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        avatar.userData.diamond.rotation.y += dt;
    }
    const cameraMoving =
      targetCamera.position &&
      camera.position.distanceToSquared(targetCamera.position) > 0.000001;
    if (cameraMoving) {
      camera.position.lerp(targetCamera.position, Math.min(1, dt * 7));
      camera.lookAt(targetCamera.target);
    }
    const idleAnimation =
      mode === "walk" &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      (renderPending || cameraMoving || idleAnimation) &&
      time - lastRender > 33
    ) {
      renderer.render(scene, camera);
      renderPending = false;
      lastRender = time;
    }
  }
  $("catalog").addEventListener("click", (e) => {
    const b = e.target.closest("[data-kind]");
    if (!b) return;
    if (mode === "walk") setMode("build");
    clearGhost();
    selected = null;
    placing = placing === b.dataset.kind ? null : b.dataset.kind;
    renderCatalog();
    renderUI();
    updateHighlight();
    $("scene").classList.toggle("placing", !!placing);
    notify(
      placing
        ? `Tap an open floor spot for your ${catalog[placing].name.toLowerCase()}. Keyboard: focus the room and press Enter to find an open spot.`
        : "Placement cancelled.",
    );
    if (e.detail === 0) $("scene").focus();
    if (placing && matchMedia("(max-width:620px)").matches)
      $("workspace").scrollIntoView({ behavior: "smooth" });
  });
  document.querySelectorAll("[data-category]").forEach((b) =>
    b.addEventListener("click", () => {
      category = b.dataset.category;
      document
        .querySelectorAll("[data-category]")
        .forEach((c) => c.setAttribute("aria-pressed", c === b));
      renderCatalog();
    }),
  );
  function startLayout(type, startMode, commercialType) {
    remember();
    const previous = state;
    state = {
      ...fresh(type, startMode, commercialType),
      moodboard: previous.moodboard,
      finishing: previous.finishing,
      finishTarget: previous.finishTarget,
      ambiance: previous.ambiance,
      palette: previous.palette,
      night: previous.night,
    };
    if (
      previous.type === type &&
      previous.startMode === "blank" &&
      startMode === "blank"
    )
      state.dimensions = { ...previous.dimensions };
    walked = 0;
    choose(null);
    setMode("build");
    angle = 0.76;
    zoom = 1;
    changed();
    notify(
      startMode === "blank"
        ? "Your blank canvas is ready. Set the dimensions and add your first piece."
        : "A fresh starter layout. Undo restores your previous space.",
    );
  }
  document.querySelectorAll("[data-start]").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.start !== state.startMode)
        startLayout(state.type, b.dataset.start, state.commercialType);
    }),
  );
  $("commercial-type").addEventListener("change", (e) =>
    startLayout("commercial", state.startMode, e.target.value),
  );
  $("room-size").addEventListener("submit", (e) => {
    e.preventDefault();
    if (state.startMode !== "blank" || !e.target.reportValidity()) return;
    const before = snapshot(),
      previous = state.dimensions;
    const w = Number($("room-width").value),
      d = Number($("room-depth").value);
    if (w < 4 || w > 16 || d < 4 || d > 14 || w % 0.5 !== 0 || d % 0.5 !== 0)
      return;
    state.dimensions = { w, d };
    if (state.items.some((item) => !fits(item))) {
      state.dimensions = previous;
      notify(
        "Move pieces inside the new boundary before making the room smaller.",
      );
      return;
    }
    if (snapshot() === before) return;
    remember(before);
    changed();
    notify(`Room resized to ${w} × ${d} metres.`);
  });
  $("moodboard-select").innerHTML = MOODBOARDS.map(
    (b) => `<option value="${b.id}">${b.name} · ${b.style}</option>`,
  ).join("");
  $("ambiance-select").innerHTML = MOODBOARDS.map(
    (b) =>
      `<option value="${b.id}">${boards[b.id].ambiance.short} · ${b.style}</option>`,
  ).join("");
  $("moodboard-select").addEventListener("change", (e) => {
    remember();
    state.moodboard = e.target.value;
    state.finishing = MATERIAL_PALETTES[state.moodboard][0].id;
    state.ambiance = state.moodboard;
    state.palette = null;
    state.quests.palette = true;
    changed();
    notify(
      `${boards[state.moodboard].name}. Moodboard, finishing and ambiance applied.`,
    );
  });
  $("finish-target").addEventListener("change", (e) => {
    remember();
    state.finishTarget = e.target.value;
    state.quests.palette = true;
    changed();
    notify("Finishing application updated.");
  });
  $("finishing-select").addEventListener("change", (e) => {
    remember();
    state.finishing = e.target.value;
    state.quests.palette = true;
    changed();
    notify(
      `${selectedFinish().name} applied to ${{ joinery: "furniture and joinery", floor: "flooring", walls: "walls" }[state.finishTarget]}.`,
    );
  });
  $("ambiance-select").addEventListener("change", (e) => {
    remember();
    state.ambiance = e.target.value;
    state.palette = null;
    state.quests.palette = true;
    changed();
    notify(
      `${boards[state.ambiance].ambiance.short} ambiance applied. Your layout stays in place.`,
    );
  });
  document.querySelectorAll("[data-light]").forEach((b) =>
    b.addEventListener("click", () => {
      const night = b.dataset.light === "evening";
      if (state.night === night) return;
      remember();
      state.night = night;
      changed();
    }),
  );
  document.querySelectorAll("[data-space]").forEach((b) =>
    b.addEventListener("click", () => {
      if (state.type === b.dataset.space) return;
      startLayout(b.dataset.space, state.startMode, state.commercialType);
    }),
  );
  document.querySelectorAll("[data-palette]").forEach((b) =>
    b.addEventListener("click", () => {
      if (state.palette === b.dataset.palette) return;
      remember();
      state.palette = b.dataset.palette;
      state.quests.palette = true;
      changed();
      notify(`${palettes[state.palette].name}. A whole new feeling.`);
    }),
  );
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $("placed-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-select]");
    if (b) {
      if (mode !== "build") setMode("build");
      choose(Number(b.dataset.select));
    }
  });
  document.querySelectorAll("[data-move]").forEach((b) =>
    b.addEventListener("click", () => {
      const delta = {
        left: [-0.25, 0],
        right: [0.25, 0],
        back: [0, -0.25],
        forward: [0, 0.25],
      }[b.dataset.move];
      moveSelected(...delta);
    }),
  );
  $("rotate-piece").addEventListener("click", () => {
    const item = state.items.find((i) => i.id === selected);
    if (!item) return;
    const candidate = { ...item, r: (item.r + 1) % 4 };
    if (!fits(candidate)) {
      notify(
        "This piece needs more room to turn. Move it away from the wall or other furniture.",
      );
      return;
    }
    remember();
    item.r = candidate.r;
    changed();
    notify("A fresh angle. Rotated 90 degrees.");
  });
  $("delete-piece").addEventListener("click", () => {
    if (!selected) return;
    remember();
    state.items = state.items.filter((i) => i.id !== selected);
    selected = null;
    changed();
    notify("Piece removed. You can always undo.");
  });
  $("undo-action").addEventListener("click", () => {
    if (!history.length) return;
    state = JSON.parse(history.pop());
    selected = null;
    placing = null;
    nextId = Math.max(nextId, ...state.items.map((i) => i.id + 1));
    renderCatalog();
    $("scene").classList.remove("placing");
    changed();
    notify("One idea back.");
  });
  $("save-project").addEventListener("click", () => {
    try {
      localStorage.setItem(storageKey, snapshot());
      dirty = false;
      $("save-state").textContent = "Saved in this browser";
      notify(
        "Project saved in this browser. Export a copy to keep it elsewhere.",
      );
    } catch {
      notify(
        "Browser storage is unavailable or full. Export your layout to keep a copy.",
      );
    }
  });
  $("export-project").addEventListener("click", () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            format: "secha-playground",
            version: 1,
            project: state,
            dimensions: { w: spaceConfig().w, d: spaceConfig().d },
            estimatedTotal: state.items.reduce(
              (n, i) => n + catalog[i.kind].price,
              0,
            ),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `secha-${state.type}-layout.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Layout exported. Keep dreaming.");
  });
  $("reset-project").addEventListener("click", () => {
    remember();
    const previous = state;
    state = {
      ...fresh(state.type, state.startMode, state.commercialType),
      dimensions: { ...previous.dimensions },
      moodboard: previous.moodboard,
      finishing: previous.finishing,
      finishTarget: previous.finishTarget,
      ambiance: previous.ambiance,
      palette: previous.palette,
      night: previous.night,
    };
    selected = null;
    placing = null;
    renderCatalog();
    $("scene").classList.remove("placing");
    walked = 0;
    changed();
    notify("Back to the starting layout. Undo restores your work.");
  });
  $("daylight").addEventListener("click", () => {
    remember();
    state.night = !state.night;
    changed();
    notify(state.night ? "An evening at home." : "Let the daylight in.");
  });
  $("plan-view").addEventListener("click", () => {
    plan = !plan;
    $("plan-view").setAttribute("aria-pressed", plan);
    updateCamera(true);
  });
  $("zoom-in").addEventListener("click", () => {
    zoom = Math.max(0.65, zoom - 0.12);
    updateCamera();
  });
  $("zoom-out").addEventListener("click", () => {
    zoom = Math.min(1.8, zoom + 0.12);
    updateCamera();
  });
  $("reset-camera").addEventListener("click", () => {
    angle = 0.76;
    zoom = 1;
    plan = false;
    $("plan-view").setAttribute("aria-pressed", false);
    updateCamera(true);
  });
  $("help-button").addEventListener("click", () => {
    const open = $("help-panel").hidden;
    $("help-panel").hidden = !open;
    $("help-button").setAttribute("aria-expanded", open);
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      placing = null;
      clearGhost();
      selected = null;
      destination = null;
      keys.clear();
      $("scene").classList.remove("placing");
      $("help-panel").hidden = true;
      $("help-button").setAttribute("aria-expanded", false);
      renderCatalog();
      renderUI();
      updateHighlight();
      return;
    }
    if (e.key === "Enter" && placing && document.activeElement === $("scene")) {
      e.preventDefault();
      const s = spaceConfig();
      for (let z = s.d / 2 - 0.5; z > -s.d / 2; z -= 0.25)
        for (let x = -s.w / 2 + 0.5; x < s.w / 2; x += 0.25)
          if (fits({ id: -1, kind: placing, x, z, r: 0 })) {
            addAt(x, z);
            return;
          }
      notify(
        "No open spot fits this piece. Move or remove an existing piece first.",
      );
      return;
    }
    if (
      mode === "walk" &&
      (document.activeElement === $("scene") || e.target === document.body) &&
      [
        "w",
        "a",
        "s",
        "d",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
      ].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      keys.add(e.key.toLowerCase());
    }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
  window.addEventListener("blur", () => {
    keys.clear();
    padDirection = null;
    pointer = null;
  });
  document.addEventListener("visibilitychange", () => {
    keys.clear();
    padDirection = null;
  });
  document.querySelectorAll("[data-walk]").forEach((b) => {
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      padDirection = b.dataset.walk;
    });
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      b.addEventListener(event, () => (padDirection = null));
    b.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        padDirection = b.dataset.walk;
      }
    });
    b.addEventListener("keyup", () => (padDirection = null));
    b.addEventListener("blur", () => (padDirection = null));
  });
  renderCatalog();
  renderUI();
  init3D();
  toastTimer = setTimeout(() => $("status").classList.add("quiet"), 4500);
})();
