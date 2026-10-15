const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:8004";
let browser, server;
const errors = [];
async function ready() {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(`${base}/playground.html`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw Error("Playground QA server did not start");
}
async function saved(page) {
  await page.locator("#save-project").click();
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("secha-playground-v1")),
  );
}
async function audit(page) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const violations = await page.evaluate(async () =>
    (
      await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      })
    ).violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  );
  assert.deepEqual(violations, [], "Playground WCAG checks");
}
// Project floor points through the documented plan camera to exercise real pointer input.
async function floorScreen(page, x, z, y = 0) {
  return page.evaluate(
    ({ x, z, y }) => {
      const rect = document.getElementById("scene").getBoundingClientRect(),
        aspect = rect.width / rect.height;
      const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
      camera.position.set(0, ((8 * 1.62) / Math.min(1.1, aspect)) * 1.2, 0.001);
      camera.lookAt(0, 1.1, 0);
      camera.updateMatrixWorld();
      const point = new THREE.Vector3(x, y, z).project(camera);
      return {
        x: rect.left + ((point.x + 1) * rect.width) / 2,
        y: rect.top + ((1 - point.y) * rect.height) / 2,
      };
    },
    { x, z, y },
  );
}
(async () => {
  if (!process.env.QA_BASE_URL)
    server = spawn(
      "python3",
      ["-m", "http.server", "8004", "--bind", "127.0.0.1"],
      { cwd: root, stdio: "ignore" },
    );
  await ready();
  await fs.mkdir(path.join(root, "qa-artifacts"), { recursive: true });
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
    reducedMotion: "reduce",
  });
  page.setDefaultTimeout(15000);
  page.on("pageerror", (e) => errors.push(e.message));
  console.log("QA: initial scene and accessibility");
  await page.goto(`${base}/playground.html`);
  assert.equal(await page.locator("#scene canvas").count(), 1);
  assert.equal(await page.locator("#webgl-fallback").isVisible(), false);
  assert.equal(await page.locator(".placed-piece").count(), 6);
  await audit(page);
  await page.screenshot({
    path: path.join(root, "qa-artifacts/playground-desktop.png"),
  });

  console.log("QA: placement and dragging");
  await page.locator("#plan-view").click();
  await page.locator('[data-kind="plant"]').click();
  const placement = await floorScreen(page, -2, 1.5);
  await page.mouse.click(placement.x, placement.y);
  assert.equal(
    await page.locator(".placed-piece").count(),
    7,
    "Pointer placement adds a piece",
  );
  let project = await saved(page),
    newId = project.items.at(-1).id;
  assert.deepEqual([project.items.at(-1).x, project.items.at(-1).z], [-2, 1.5]);
  assert.equal(project.quests.add, true);
  assert.equal(await page.locator("#budget-total").textContent(), "14.350.000");

  const dragStart = await floorScreen(page, -2, 1.5, 0.7),
    dragEnd = await floorScreen(page, -2.75, 1.5, 0.7);
  await page.mouse.move(dragStart.x, dragStart.y);
  await page.mouse.down();
  await page.mouse.move(dragEnd.x, dragEnd.y, { steps: 12 });
  await page.mouse.up();
  project = await saved(page);
  assert.ok(
    project.items.find((i) => i.id === newId).x < -2.25,
    "Dragging moves the furniture",
  );
  await page.locator("#undo-action").click();
  project = await saved(page);
  assert.equal(
    project.items.find((i) => i.id === newId).x,
    -2,
    "Undo restores dragged position",
  );

  console.log("QA: editing controls");
  await page.locator(`[data-select="${newId}"]`).click();
  await page.locator("#rotate-piece").click();
  project = await saved(page);
  assert.equal(project.items.at(-1).r, 1, "Rotation is saved");
  await page.locator('[data-move="right"]').click();
  project = await saved(page);
  assert.equal(project.items.at(-1).x, -1.75);
  await page.locator("#delete-piece").click();
  assert.equal(await page.locator(".placed-piece").count(), 6);
  await page.locator("#undo-action").click();
  assert.equal(await page.locator(".placed-piece").count(), 7);

  // A planted piece may not be placed on the existing sofa or outside the room.
  await page.locator('[data-kind="plant"]').click();
  const blocked = await floorScreen(page, 0.3, 0.5);
  await page.mouse.click(blocked.x, blocked.y);
  assert.equal(
    await page.locator(".placed-piece").count(),
    7,
    "Overlap is rejected",
  );
  await page.keyboard.press("Escape");
  await page.locator('[data-kind="lamp"]').focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator(".placed-piece").count(),
    8,
    "Keyboard placement finds an open spot",
  );

  console.log("QA: palettes, persistence, walkthrough");
  await page.locator('[data-palette="sage"]').click();
  await page.locator("#daylight").click();
  project = await saved(page);
  assert.equal(project.palette, "sage");
  assert.equal(project.night, true);
  await page.reload();
  assert.equal(
    await page.locator('[data-palette="sage"]').getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(
    await page.locator(".placed-piece").count(),
    8,
    "Layout restores on reload",
  );
  await page.locator('[data-mode="walk"]').click();
  const before = await page.locator("#scene canvas").screenshot();
  await page.keyboard.down("d");
  try {
    await page.waitForFunction(
      () => document.getElementById("quest-count").textContent === "3/3",
      {},
      { timeout: 15000 },
    );
  } finally {
    await page.keyboard.up("d");
  }
  project = await saved(page);
  assert.equal(
    project.quests.walk,
    true,
    "Avatar moves far enough to complete the walk quest",
  );
  assert.notDeepEqual(
    await page.locator("#scene canvas").screenshot(),
    before,
    "Walkthrough changes the rendered view",
  );
  assert.equal(await page.locator("#quest-count").textContent(), "3/3");
  await page.screenshot({
    path: path.join(root, "qa-artifacts/playground-walkthrough.png"),
  });

  console.log("QA: export and templates");
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#export-project").click();
  const download = await downloadPromise;
  const file = await download.path(),
    exported = JSON.parse(await fs.readFile(file, "utf8"));
  assert.equal(exported.project.items.length, 8);
  assert.equal(exported.format, "secha-playground");
  await page.locator('[data-space="residence"]').click();
  assert.match(await page.locator("#project-meta").textContent(), /Residence/);
  assert.equal(await page.locator("#area-label").textContent(), "80 m²");
  await page.screenshot({
    path: path.join(root, "qa-artifacts/playground-residence.png"),
  });
  await page.locator('[data-space="commercial"]').click();
  assert.equal(await page.locator("#area-label").textContent(), "70 m²");
  await page.screenshot({
    path: path.join(root, "qa-artifacts/playground-commercial.png"),
  });
  await page.locator("#undo-action").click();
  assert.match(await page.locator("#project-meta").textContent(), /Residence/);
  await page.locator("#reset-project").click();
  assert.equal(await page.locator(".placed-piece").count(), 8);
  await page.locator('[data-category="details"]').click();
  assert.equal(await page.locator(".catalog-card").count(), 2);

  console.log("QA: mobile controls and fallbacks");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-space="studio"]').click();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
    "No mobile horizontal overflow",
  );
  await page.locator("#workspace").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: path.join(root, "qa-artifacts/playground-mobile.png"),
    fullPage: true,
  });
  await audit(page);
  await page.locator('[data-mode="walk"]').click();
  const pad = page.locator('[data-walk="right"]');
  await pad.scrollIntoViewIfNeeded();
  const box = await pad.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  try {
    await page.waitForFunction(
      () => document.getElementById("quest-count").textContent === "1/3",
      {},
      { timeout: 15000 },
    );
  } finally {
    await page.mouse.up();
  }
  project = await saved(page);
  assert.equal(project.quests.walk, true, "On-screen walk pad works on mobile");
  await page.close();

  console.log(
    "QA: scratch builds, commercial types and shared design directions",
  );
  const design = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  design.on("pageerror", (e) => errors.push(e.message));
  await design.goto(`${base}/playground.html`);
  await design.evaluate(() => document.fonts.ready);
  assert.equal(
    await design.evaluate(() => document.fonts.check("12px Inter")),
    true,
    "Bundled Inter loads",
  );
  assert.match(
    await design
      .locator("h1")
      .evaluate((el) => getComputedStyle(el).fontFamily),
    /Inter/,
  );
  await design.locator('[data-start="blank"]').click();
  assert.equal(
    await design.locator(".placed-piece").count(),
    0,
    "Scratch starts with no furniture",
  );
  assert.equal(await design.locator("#budget-total").textContent(), "0");
  await design.locator("#room-width").fill("5");
  await design.locator("#room-depth").fill("4");
  await design.locator("#room-size button").click();
  assert.equal(await design.locator("#area-label").textContent(), "20 m²");
  await design.locator('[data-kind="lamp"]').focus();
  await design.keyboard.press("Enter");
  await design.keyboard.press("Enter");
  assert.equal(await design.locator(".placed-piece").count(), 1);
  await design.locator("#room-width").fill("4");
  await design.locator("#room-size button").click();
  assert.equal(
    (await saved(design)).dimensions.w,
    5,
    "Resize cannot cut through existing furniture",
  );
  await design.locator("#undo-action").click();
  assert.equal(await design.locator(".placed-piece").count(), 0);
  project = await saved(design);
  assert.deepEqual(project.dimensions, { w: 5, d: 4 });
  await design.reload();
  assert.equal(
    await design.locator('[data-start="blank"]').getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(
    await design.locator("#area-label").textContent(),
    "20 m²",
    "Custom scratch dimensions restore",
  );
  await design.locator("#moodboard-select").selectOption("architect");
  const emptyBefore = await design.locator("#scene canvas").screenshot();
  await design.locator("#finish-target").selectOption("floor");
  assert.notDeepEqual(
    await design.locator("#scene canvas").screenshot(),
    emptyBefore,
    "Finishing changes an empty room's flooring",
  );
  await design.locator("#finish-target").selectOption("walls");
  project = await saved(design);
  assert.equal(project.finishTarget, "walls");
  await design.reload();
  assert.equal(
    await design.locator("#finish-target").inputValue(),
    "walls",
    "Finishing target restores",
  );
  await design.locator('[data-space="commercial"]').click();
  for (const subtype of ["office", "cafe", "bar", "wellness", "salon"]) {
    await design.locator("#commercial-type").selectOption(subtype);
    assert.equal(
      await design.locator(".placed-piece").count(),
      0,
      "Commercial subtype keeps scratch mode empty",
    );
  }
  await design.locator('[data-start="furnished"]').click();
  const expected = {
    office: "desk",
    cafe: "counter",
    bar: "stool",
    wellness: "treatment",
    salon: "salon",
  };
  for (const subtype of Object.keys(expected)) {
    await design.locator("#commercial-type").selectOption(subtype);
    project = await saved(design);
    assert.equal(project.commercialType, subtype);
    assert.ok(
      project.items.some((i) => i.kind === expected[subtype]),
      `${subtype} has its own furniture`,
    );
  }
  const layoutBefore = project.items;
  let neutralImage = await design.locator("#scene canvas").screenshot();
  for (const board of [
    "architect",
    "nomad",
    "visionary",
    "purist",
    "aesthete",
    "dreamer",
  ]) {
    await design.locator("#moodboard-select").selectOption(board);
    assert.equal(
      await design.evaluate(() => document.documentElement.dataset.moodboard),
      board,
    );
    const finishIds = await design
      .locator("#finishing-select option")
      .evaluateAll((options) => options.map((o) => o.value));
    assert.equal(finishIds.length, 3);
    for (const finish of finishIds) {
      await design.locator("#finishing-select").selectOption(finish);
      project = await saved(design);
      assert.equal(project.finishing, finish);
      assert.equal(project.moodboard, board);
    }
    assert.deepEqual(
      project.items,
      layoutBefore,
      "Styling keeps the furniture layout intact",
    );
    await audit(design);
  }
  assert.notDeepEqual(
    await design.locator("#scene canvas").screenshot(),
    neutralImage,
    "Moodboard and finishing change rendered materials",
  );
  await design.locator("#ambiance-select").selectOption("purist");
  await design.locator('[data-light="evening"]').click();
  project = await saved(design);
  assert.equal(project.ambiance, "purist");
  assert.equal(project.night, true);
  await audit(design);
  await design.reload();
  assert.equal(
    await design.locator("#moodboard-select").inputValue(),
    "dreamer",
  );
  assert.equal(await design.locator("#finishing-select").inputValue(), "d3");
  assert.equal(await design.locator("#ambiance-select").inputValue(), "purist");
  assert.equal(await design.locator("#commercial-type").inputValue(), "salon");
  await design.screenshot({
    path: path.join(root, "qa-artifacts/playground-salon.png"),
  });
  await design.setViewportSize({ width: 390, height: 844 });
  await design.locator("#moodboard-select").selectOption("visionary");
  await design.locator('[data-start="blank"]').click();
  assert.equal(
    await design.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await audit(design);
  await design.screenshot({
    path: path.join(root, "qa-artifacts/playground-scratch-mobile.png"),
    fullPage: true,
  });
  await design.close();

  const legacy = await browser.newPage();
  await legacy.goto(base);
  await legacy.evaluate(() =>
    localStorage.setItem(
      "secha-playground-v1",
      JSON.stringify({
        type: "studio",
        palette: "sage",
        night: false,
        items: [],
        quests: {},
      }),
    ),
  );
  await legacy.goto(`${base}/playground.html`);
  project = await saved(legacy);
  assert.equal(project.palette, "sage");
  assert.equal(
    project.moodboard,
    "nomad",
    "Older saved projects migrate without losing styling",
  );
  await legacy.close();

  const fallback = await browser.newPage();
  await fallback.route("**/vendor/three.r128.min.js", (r) => r.abort());
  await fallback.goto(`${base}/playground.html`);
  assert.equal(
    await fallback.locator("#webgl-fallback").isVisible(),
    true,
    "Missing WebGL library has a readable fallback",
  );
  await fallback.close();
  const malformed = await browser.newPage();
  await malformed.goto(base);
  await malformed.evaluate(() =>
    localStorage.setItem(
      "secha-playground-v1",
      '{"type":"unknown","items":[]}',
    ),
  );
  await malformed.goto(`${base}/playground.html`);
  assert.equal(
    await malformed.locator(".placed-piece").count(),
    6,
    "Invalid saved layout falls back safely",
  );
  await malformed.close();
  assert.deepEqual(errors, [], "No runtime errors");
  console.log(
    "Playground QA passed: scratch dimensions; five commercial layouts; six shared moodboards and eighteen finishes; independent ambiance and lighting; Inter font; legacy-save migration; three space types; pointer placement and dragging; collision rejection; keyboard placement; rotation, movement, deletion and undo; budget; palettes and lighting; save/reload; avatar walkthrough and mobile pad; quest completion; JSON export; responsive layout; WCAG checks; unavailable-WebGL and invalid-save fallbacks.",
  );
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
    server?.kill();
  });
