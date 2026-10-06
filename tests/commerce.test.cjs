const { test } = require("node:test");
const assert = require("node:assert/strict");
const C = require("../js/commerce-core.js");
const palettes = {
  nomad: [
    { id: "n1", name: "Ash", color: 1, roughness: 0.8, metalness: 0 },
    { id: "n2", name: "Linen", color: 2 },
  ],
};
const sample = (id) => ({
  id: `sample:${id}`,
  boardId: "nomad",
  boardName: "The Nomad",
  material: palettes.nomad.find((m) => m.id === id),
  name: "Sample",
  type: "sample",
  price: 150000,
  quantity: 1,
});
test("distinct finishes are separate lines; same finish accumulates with a quantity cap", () => {
  let cart = [];
  C.add(cart, sample("n1"));
  C.add(cart, sample("n2"));
  C.add(cart, sample("n1"));
  assert.equal(cart.length, 2);
  assert.equal(cart[0].quantity, 2);
  for (let i = 0; i < 30; i++) C.add(cart, sample("n1"));
  assert.equal(cart[0].quantity, 20);
});
test("mixed cart discount applies only to samples; shipping charged once", () => {
  const t = C.totals(
    [sample("n1"), { price: 12500000, quantity: 1, type: "modular" }],
    "STUDIO10",
  );
  assert.deepEqual(t, {
    subtotal: 12650000,
    discount: 15000,
    shipping: 45000,
    total: 12680000,
    requiresQuote: true,
  });
});
test("empty and service-only carts do not charge sample delivery", () => {
  assert.equal(C.totals([]).total, 0);
  assert.equal(
    C.totals([{ price: 2000000, quantity: 2, type: "design" }], "STUDIO10")
      .total,
    4000000,
  );
});
test("restoration rejects corrupt, unknown, duplicate and invalid-quantity lines", () => {
  assert.deepEqual(C.restore("bad", palettes), []);
  assert.deepEqual(C.restore("{}", palettes), []);
  assert.equal(
    C.restore(
      JSON.stringify([
        sample("n1"),
        sample("n1"),
        { ...sample("n2"), quantity: -1 },
        { ...sample("n2"), id: "evil" },
      ]),
      palettes,
    ).length,
    1,
  );
});
test("restoration re-prices from trusted catalogue instead of stored prices", () => {
  const item = {
    ...sample("n1"),
    price: 1,
    material: { id: "n1", name: "fake" },
  };
  const [restored] = C.restore(JSON.stringify([item]), palettes);
  assert.equal(restored.price, 150000);
  assert.equal(restored.material.name, "Ash");
});
test("configured build survives reload with exact dimensions, modules and price", () => {
  const item = {
    id: "modular-living:n1:4.5x5:4",
    productId: "modular-living",
    type: "modular",
    material: { id: "n1" },
    boardId: "nomad",
    boardName: "Nomad",
    quantity: 2,
    price: 1,
    config: { width: 4.5, depth: 5, modules: 4 },
  };
  const [r] = C.restore(JSON.stringify([item]), palettes);
  assert.equal(r.price, 16666667);
  assert.equal(r.config.modules, 4);
  assert.equal(r.config.width, 4.5);
  assert.equal(r.quantity, 2);
});
test("HTML is escaped for saved text rendering", () =>
  assert.equal(
    C.escape('<img onerror="x">'),
    "&lt;img onerror=&quot;x&quot;&gt;",
  ));
