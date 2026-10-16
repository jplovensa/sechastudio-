const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs/promises");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:8007";
let browser, server;
(async () => {
  if (!process.env.QA_BASE_URL) server = spawn("python3", ["-m", "http.server", "8007", "--bind", "127.0.0.1"], { cwd: path.join(__dirname, ".."), stdio: "ignore" });
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await fs.mkdir(path.join(__dirname, "../qa-artifacts"), { recursive: true });
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox", "--enable-unsafe-swiftshader"] });
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "domcontentloaded" });
    for (const [kind, name, board] of [
      ["cafe", "Café Sol", "nomad"], ["bar", "Ember", "purist"],
      ["wellness", "Still", "dreamer"], ["office", "Common Ground", "architect"], ["salon", "Contour", "purist"],
    ]) {
      const id = `commercial-${kind}`;
      await page.locator(`[data-commercial-filter="${id}"]`).click();
      assert.equal(await page.locator(".commercial-style-card:visible").count(), 1);
      assert.equal(await page.locator('[data-commercial-filter][aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator(".style-collection-card:visible").count(), 4, "Commercial choices preserve the residential gallery");
      const card = page.locator(`[data-commercial-style="${id}"]`);
      await card.locator("img").evaluateAll((images) => { images.forEach((image) => image.loading = "eager"); return Promise.all(images.map((image) => image.decode())); });
      const link = new URL(await card.locator(".commercial-plan-link").getAttribute("href"), base);
      assert.equal(link.searchParams.get("space"), "commercial");
      assert.equal(link.searchParams.get("commercial"), kind);
      assert.equal(link.searchParams.get("moodboard"), board);
      await card.locator('[data-style-view="1"]').click();
      assert.match(await card.locator("figure > img").getAttribute("src"), /-detail.webp$/);
      const opener = card.locator("[data-open-style-gallery]");
      await opener.click();
      assert.equal(await page.locator("#style-gallery-title").textContent(), name);
      assert.equal(await page.locator("#style-viewer-thumbnails button").count(), 3);
      assert.match(await page.locator("#style-gallery-position").textContent(), /02 \/ 03/);
      assert.match(await page.locator("#style-gallery-shop").textContent(), /Plan this space/);
      await page.keyboard.press("ArrowRight");
      assert.match(await page.locator("#style-gallery-image").getAttribute("src"), /-plan.svg$/);
      await page.keyboard.press("ArrowRight");
      assert.match(await page.locator("#style-gallery-image").getAttribute("src"), /-room.webp$/);
      await page.keyboard.press("Escape");
      await page.waitForFunction((id) => document.activeElement === document.querySelector(`[data-open-style-gallery="${id}"]`), id);
      await card.locator('[data-style-view="0"]').click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.locator("#commercial-styling").screenshot({ path: path.join(__dirname, `../qa-artifacts/commercial-${kind}-${width}.png`) });
      if (width === 1440) {
        await opener.click();
        await page.route("**/playground.html?**", (route) => route.fulfill({ contentType: "text/html", body: "<title>Playground handoff</title>" }));
        await Promise.all([page.waitForURL("**/playground.html?**"), page.locator("#style-gallery-shop").click()]);
        const target = new URL(page.url());
        assert.equal(target.searchParams.get("commercial"), kind);
        assert.equal(target.searchParams.get("moodboard"), board);
        await page.goto(base, { waitUntil: "domcontentloaded" });
      }
    }
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const violations = await page.evaluate(async () => (await axe.run(document.getElementById("commercial-styling"), { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations.map((v) => ({ id: v.id, targets: v.nodes.map((node) => node.target) })));
    assert.deepEqual(violations, []);
    await page.locator('[data-open-style-gallery="warm-modern"]').click();
    assert.equal(await page.locator("#style-viewer-thumbnails button").count(), 4);
    assert.match(await page.locator("#style-gallery-shop").textContent(), /Shop my style/);
    assert.deepEqual(errors, []);
    console.log({ width, commercialTypes: 5, galleryViewsPerType: 3, playgroundLinks: "passed", residentialGallery: "preserved", accessibility: "passed" });
    await context.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  if (server) server.kill();
});
