/* Shared, deterministic commerce rules. Prices are indicative until confirmed by SECHA. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SechaCommerce = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const catalogue = [
    {
      id: "modular-living",
      name: "Living / The everyday system",
      category: "modular",
      price: 12500000,
      room: "living",
      modules: 3,
      lead: "Indicative build: 4–6 weeks after approval",
      description:
        "A media console, open display and closed storage. One consistent finish, with modules you can rearrange.",
      includes: [
        "3 configurable storage modules",
        "Finish consultation + shop drawings",
        "Assembly scope confirmed after site survey",
      ],
      image: "assets/modular-living-concept.png",
    },
    {
      id: "modular-work",
      name: "Work / A place for focus",
      category: "modular",
      price: 8500000,
      room: "work",
      modules: 2,
      lead: "Indicative build: 4–6 weeks after approval",
      description:
        "An integrated desk and storage system for a calmer working day. Designed around your routine.",
      includes: [
        "Desk + 2 storage modules",
        "Cable management planning",
        "Site measurement before fabrication",
      ],
      image: "assets/modular-work-concept.png",
    },
    {
      id: "modular-bedroom",
      name: "Rest / Room to unwind",
      category: "modular",
      price: 16500000,
      room: "bedroom",
      modules: 4,
      lead: "Indicative build: 4–6 weeks after approval",
      description:
        "A headboard wall, bedside storage and wardrobe concept that brings the bedroom together.",
      includes: [
        "Headboard + 4 storage modules",
        "Material and colour coordination",
        "Final scope agreed with your designer",
      ],
      image: "assets/modular-rest-concept.png",
    },
    {
      id: "design-lite",
      name: "Design / Lite",
      category: "design",
      price: 1000000,
      lead: "For one small room, up to 10 m²",
      description:
        "A clear direction for your space: concept, moodboard and finish palette. Construction and furniture are quoted separately.",
      includes: [
        "Room concept + moodboard",
        "Curated material palette",
        "Digital design handover",
      ],
      image: "assets/design-lite-service.png",
    },
    {
      id: "design-pro",
      name: "Design / Pro",
      category: "design",
      price: 2000000,
      lead: "For one small room, up to 10 m²",
      description:
        "Develop your room concept with layout and 3D visualisation. Construction and furniture are quoted separately.",
      includes: [
        "Everything in Lite",
        "Room layout + 3D visualisation",
        "Designer review",
      ],
      image: "assets/design-pro-service.png",
    },
    {
      id: "design-premium",
      name: "Design / Premium",
      category: "design",
      price: 2600000,
      lead: "For one small room, up to 10 m²",
      description:
        "A considered design package with detailed drawings to support your next build.",
      includes: [
        "Everything in Pro",
        "Detailed design drawings",
        "Build planning consultation",
      ],
      image: "assets/design-premium-service.png",
    },
  ];
  const money = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  const escape = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function totals(items, coupon = "") {
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    const discount =
      coupon === "STUDIO10"
        ? Math.round(
            items
              .filter((i) => i.type === "sample")
              .reduce((n, i) => n + i.price * i.quantity, 0) * 0.1,
          )
        : 0;
    const shipping = items.some((i) => i.type === "sample") ? 45000 : 0;
    return {
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping,
      requiresQuote: items.some((i) => i.type !== "sample"),
    };
  }
  function add(items, item) {
    const existing = items.find((i) => i.id === item.id);
    if (existing) existing.quantity = Math.min(20, existing.quantity + 1);
    else items.push({ ...item, quantity: 1 });
    return items;
  }
  function restore(raw, palettes) {
    try {
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      const seen = new Set();
      return data.slice(0, 60).flatMap((i) => {
        if (
          !i ||
          typeof i.id !== "string" ||
          seen.has(i.id) ||
          !Number.isInteger(i.quantity) ||
          i.quantity < 1 ||
          i.quantity > 20
        )
          return [];
        const product = catalogue.find((p) => p.id === i.productId);
        const style = palettes[i.boardId];
        const material = style?.find((m) => m.id === i.material?.id);
        if (!material) return [];
        if (i.type === "sample" && i.id === `sample:${material.id}`) {
          seen.add(i.id);
          return [
            {
              id: i.id,
              boardId: i.boardId,
              boardName: i.boardName,
              material,
              type: "sample",
              name: material.name + " · physical sample",
              price: 150000,
              quantity: i.quantity,
            },
          ];
        }
        if (!product || i.type !== product.category) return [];
        const config =
          product.category === "modular"
            ? {
                room: product.room,
                width: Math.min(6, Math.max(3, Number(i.config?.width) || 4)),
                depth: Math.min(6, Math.max(3, Number(i.config?.depth) || 4)),
                modules: Math.min(
                  4,
                  Math.max(
                    2,
                    Math.round(Number(i.config?.modules) || product.modules),
                  ),
                ),
              }
            : null;
        const expectedId = config
          ? `${product.id}:${material.id}:${config.width}x${config.depth}:${config.modules}`
          : `${product.id}:${material.id}`;
        if (i.id !== expectedId) return [];
        seen.add(i.id);
        return [
          {
            id: i.id,
            productId: product.id,
            boardId: i.boardId,
            boardName: i.boardName,
            material,
            type: product.category,
            name: product.name,
            price: config
              ? Math.round((product.price / product.modules) * config.modules)
              : product.price,
            quantity: i.quantity,
            config,
          },
        ];
      });
    } catch {
      return [];
    }
  }
  return { catalogue, money, escape, totals, add, restore };
});
