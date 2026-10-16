const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { spawn } = require("node:child_process");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:8001";
const artifacts =
  process.env.QA_ARTIFACTS || path.join(__dirname, "..", "qa-artifacts");
let server, browser;
async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("QA server did not become ready");
}
(async () => {
  await fs.mkdir(artifacts, { recursive: true });
  if (!process.env.QA_BASE_URL)
    server = spawn(
      "python3",
      ["-m", "http.server", "8001", "--bind", "127.0.0.1"],
      { cwd: path.join(__dirname, ".."), stdio: "ignore" },
    );
  await waitForServer();
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  const results = [];
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({
      viewport,
      acceptDownloads: true,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => document.querySelectorAll(".product-card").length === 6,
    );
    assert.equal(await page.locator("canvas").count(), 1);
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const audit = await page.evaluate(async () =>
      (
        await axe.run(
          {
            include: [
              "#designers",
              "#styling-studio",
              "#shop",
              "#modular-build",
              "#moodboards",
              "#playground",
              "#process",
              "#investment",
              "#onboarding",
            ],
          },
          {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          },
        )
      ).violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    );
    assert.deepEqual(audit, [], "Storefront accessibility checks");
    const brokenAnchors = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href"))
        .filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
    );
    assert.deepEqual(brokenAnchors, [], "In-page navigation targets");

    await page.screenshot({ path: path.join(artifacts, `${name}-hero.png`) });
    assert.deepEqual(
      await page.locator(".designer-card h3").allTextContents(),
      ["JOSEPHINE", "DAFFA", "AUDINA"],
    );
    assert.equal(await page.locator(".designer-card img").count(), 3);
    await page
      .locator("#designers")
      .screenshot({ path: path.join(artifacts, `${name}-designers.png`) });
    await page
      .locator("#modular-build")
      .screenshot({ path: path.join(artifacts, `${name}-eps.png`) });
    assert.match(
      await page.locator("#modular-build").textContent(),
      /EPS-based materials/,
    );
    await page.locator("#moodboards").scrollIntoViewIfNeeded();
    assert.equal(
      await page.locator("#finishing-studio, #style-walkway").count(),
      0,
      "Redundant room experiences removed",
    );
    await page.locator("#moodboard-nav button").nth(1).click();
    assert.match(
      await page.locator("#material-style").textContent(),
      /Japandi/,
    );
    const before = await page.locator("#moodboard-canvas canvas").screenshot();
    await page.locator("#sample-light").fill("-65");
    assert.notDeepEqual(
      await page.locator("#moodboard-canvas canvas").screenshot(),
      before,
      "Lighting changes material appearance",
    );
    const beforeTurn = await page
      .locator("#moodboard-canvas canvas")
      .screenshot();
    await page.locator("#moodboard-canvas").focus();
    await page.keyboard.press("ArrowRight");
    assert.notDeepEqual(
      await page.locator("#moodboard-canvas canvas").screenshot(),
      beforeTurn,
      "Keyboard turns the material study",
    );
    await page.locator("#sample-rotate").click();
    assert.equal(
      await page.locator("#sample-rotate").getAttribute("aria-pressed"),
      "true",
    );
    await page.locator("#sample-reset").click();
    assert.equal(
      await page.locator("#sample-rotate").getAttribute("aria-pressed"),
      "false",
    );
    await page.locator("#moodboard-nav button").first().click();
    await page.locator("#process [data-process='2']").click();
    assert.match(
      await page.locator("#process-detail").textContent(),
      /3D visualisations/,
    );
    await page
      .locator("#modular-build details")
      .evaluate((el) => (el.open = true));
    assert.match(
      await page.locator("#modular-build details").textContent(),
      /separately confirmed\s+scope/,
    );
    await page.locator('[data-filter="modular"]').click();
    assert.equal(await page.locator(".product-card").count(), 3);
    await page.locator('[data-filter="design"]').click();
    assert.equal(await page.locator(".product-card").count(), 3);
    await page.locator('[data-filter="all"]').click();
    await page.getByRole("button", { name: "Add build to bag" }).nth(1).click();
    await page.locator("#btn-add-cart").click();
    await page.locator("#material-list button").nth(1).click();
    await page.locator("#btn-add-cart").click();
    assert.equal(await page.locator("#nav-cart-count").textContent(), "3");
    await page.screenshot({ path: path.join(artifacts, `${name}-studio.png`) });
    await page.locator("#navbar button").click();
    assert.equal(await page.locator(".cart-item").count(), 3);
    await page
      .getByRole("button", { name: "Increase quantity of Raw Cast Concrete" })
      .click();
    assert.equal(await page.locator("#nav-cart-count").textContent(), "4");
    await page
      .getByRole("button", { name: "Decrease quantity of Raw Cast Concrete" })
      .click();
    assert.equal(await page.locator("#nav-cart-count").textContent(), "3");
    await page.fill("#promo-input", "STUDIO10");
    await page.locator(".coupon-form button").click();
    const cartTotal = await page
      .locator("#cart-footer .total strong")
      .textContent();
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => document.getElementById("nav-cart-count").textContent === "3",
    );
    await page.locator("#navbar button").click();
    assert.equal(
      await page.locator("#cart-footer .total strong").textContent(),
      cartTotal,
    );
    assert.equal(await page.locator("#promo-input").inputValue(), "STUDIO10");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#cart-drawer").isVisible(), false);
    await page.locator("#navbar button").click();
    await page.getByRole("button", { name: "Review your request" }).click();
    assert.equal(
      await page.locator("#checkout-summary .total strong").textContent(),
      cartTotal,
    );
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const checkoutAudit = await page.evaluate(async () =>
      (
        await axe.run(
          { include: ["#onboarding"] },
          {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          },
        )
      ).violations.map((v) => v.id),
    );
    assert.deepEqual(checkoutAudit, [], "Checkout accessibility checks");
    await page.locator("#checkout-form button[type=submit]").click();
    assert.equal(await page.locator(".order-result").count(), 0);
    await page.fill("[name=name]", "QA Customer");
    await page.fill("[name=email]", "qa@example.com");
    await page.fill("[name=phone]", "+628123456789");
    await page.fill("[name=city]", "Jakarta");
    await page.fill("[name=address]", "Test project location");
    await page.fill("[name=notes]", "QA only; no real submission");
    await page.check("[name=consent]");
    await page.screenshot({
      path: path.join(artifacts, `${name}-checkout.png`),
    });
    await page.locator("#checkout-form button[type=submit]").click();
    assert.match(
      await page.locator(".order-result").textContent(),
      /not been sent to SECHA/,
    );
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download request" }).click();
    const download = await downloadPromise;
    const content = await fs.readFile(await download.path(), "utf8");
    assert.match(content, /QA Customer/);
    assert.match(content, /Work \/ A place for focus/);
    assert.match(content, /modules/);
    assert.match(content, /No payment collected/);
    const whatsapp = new URL(
      await page.locator("#whatsapp-request").getAttribute("href"),
    );
    assert.equal(whatsapp.hostname, "wa.me");
    assert.equal(whatsapp.pathname, "/6287786010290");
    assert.equal(whatsapp.searchParams.get("text"), content);
    assert.equal(
      await page.locator("#whatsapp-request").getAttribute("rel"),
      "noopener noreferrer",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    assert.deepEqual(errors, []);
    results.push({
      viewport: name,
      errors,
      cases:
        "signature profiles, EPS material section, interactive material samples, lighting and rotation, consolidated playground, compact EPS, process steps, catalogue, modular build, distinct swatches, coupon, persistence, cart/checkout totals, form validation, request export, WhatsApp destination/message, no horizontal overflow",
    });
    await context.close();
  }
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => document.getElementById("navbar").style.opacity === "1",
    );
    for (const section of [
      "#designers",
      "#shop",
      "#modular-build",
      "#moodboards",
      "#playground",
      "#process",
    ]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${viewport.width}: ${section} horizontal overflow`,
      );
    }
    results.push({
      viewport: viewport.width,
      normalMotion: "navigation and section layouts passed",
    });
    await context.close();
  }
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const shopPage = await context.newPage();
    const errors = [];
    shopPage.on("pageerror", (error) => errors.push(error.message));
    await shopPage.goto(base, { waitUntil: "domcontentloaded" });
    assert.equal(
      await shopPage
        .locator(
          "#designers + #styling-studio + #custom-art + #art-brief-dialog + #curated-style-shop + #style-gallery-viewer + #moodboards",
        )
        .count(),
      1,
      "Style collections and the custom art atelier remain below the designers",
    );
    assert.equal(await shopPage.locator(".style-collection-card").count(), 4);
    assert.equal(
      await shopPage
        .locator(".style-collection-card img")
        .evaluateAll((images) =>
          images.every((image) => image.getAttribute("src").startsWith("assets/styling/") && image.getAttribute("src").endsWith(".webp")),
        ),
      true,
      "Collections use locally served, optimized interior concept imagery",
    );
    await shopPage.locator('[data-style-filter="natural"]').click();
    assert.equal(
      await shopPage.locator(".style-collection-card:visible").count(),
      2,
    );
    assert.equal(
      await shopPage.locator("#style-collection-count").textContent(),
      "2 curated styles",
    );
    await shopPage.locator('[data-style-filter="earthy"]').click();
    assert.equal(
      await shopPage.locator(".style-collection-card:visible").count(),
      1,
    );
    await shopPage.locator('[data-style-filter="architectural"]').click();
    assert.equal(
      await shopPage.locator(".style-collection-card:visible").count(),
      1,
    );
    await shopPage.locator('[data-style-filter="all"]').click();
    await shopPage.addScriptTag({
      path: require.resolve("axe-core/axe.min.js"),
    });
    const expectations = [
      {
        id: "warm-modern",
        name: "Warm Modern",
        board: "nomad",
        finish: "n2",
        sample: "n3",
        product: "modular-living",
      },
      {
        id: "soft-contemporary",
        name: "Soft Contemporary",
        board: "dreamer",
        finish: "d2",
        sample: "d3",
        product: "modular-living",
      },
      {
        id: "earthy-retreat",
        name: "Earthy Retreat",
        board: "purist",
        finish: "p2",
        sample: "p3",
        product: "modular-bedroom",
      },
      {
        id: "urban-studio",
        name: "Urban Studio",
        board: "architect",
        finish: "a2",
        sample: "a3",
        product: "modular-work",
      },
    ];
    for (const style of expectations) {
      const card = shopPage.locator(`[data-style="${style.id}"]`);
      await card.locator('[data-style-view="1"]').click();
      assert.match(await card.locator("figure > img").getAttribute("src"), /-detail.webp$/);
      assert.equal(await card.locator('[data-style-view="1"]').getAttribute("aria-pressed"), "true");
      const galleryTrigger = card.locator("[data-open-style-gallery]");
      await galleryTrigger.click();
      assert.equal(await shopPage.locator("#style-gallery-title").textContent(), style.name);
      assert.match(await shopPage.locator("#style-gallery-position").textContent(), /02 \/ 04 — The details/);
      await shopPage.locator("#style-gallery-next").click();
      assert.match(await shopPage.locator("#style-gallery-position").textContent(), /03 \/ 04/);
      await shopPage.keyboard.press("ArrowLeft");
      assert.match(await shopPage.locator("#style-gallery-image").getAttribute("src"), /-detail.webp$/);
      await shopPage.locator("#style-gallery-image").dispatchEvent("pointerdown", { pointerType: "touch", clientX: 250, clientY: 100 });
      await shopPage.locator("#style-gallery-image").dispatchEvent("pointerup", { pointerType: "touch", clientX: 100, clientY: 100 });
      assert.match(await shopPage.locator("#style-gallery-position").textContent(), /03 \/ 04/);
      assert.equal(await shopPage.locator("#style-viewer-thumbnails button").count(), 4);
      await shopPage.locator('[data-viewer-index="3"]').click();
      assert.match(await shopPage.locator("#style-gallery-position").textContent(), /04 \/ 04/);
      await shopPage.locator("#style-gallery-next").click();
      assert.match(await shopPage.locator("#style-gallery-image").getAttribute("src"), /-room.webp$/);
      await shopPage.keyboard.press("Tab");
      assert.equal(await shopPage.evaluate(() => document.getElementById("style-gallery-viewer").contains(document.activeElement)), true, "Gallery contains keyboard focus");
      await shopPage.waitForFunction(() => { const image = document.getElementById("style-gallery-image"); return image.complete && image.naturalWidth > 0; });
      const galleryViolations = await shopPage.evaluate(async () => (await axe.run(document.getElementById("style-gallery-viewer"), { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })));
      assert.deepEqual(galleryViolations, [], "Full-screen gallery accessibility");
      if (style.id === "warm-modern") await shopPage.locator("#style-gallery-viewer").screenshot({ path: path.join(artifacts, `style-gallery-${width}.png`) });
      await shopPage.keyboard.press("Escape");
      await shopPage.waitForFunction((id) => document.querySelector(`[data-open-style-gallery="${id}"]`) === document.activeElement, style.id);
      assert.equal(await galleryTrigger.evaluate((el) => el === document.activeElement), true, "Gallery restores its opener focus");
      await card.locator('[data-style-view="0"]').click();
      await shopPage.waitForFunction((id) => { const image = document.querySelector(`[data-style="${id}"] figure > img`); return image.complete && image.naturalWidth > 0; }, style.id);
      if (style.id === "warm-modern") await card.screenshot({ path: path.join(artifacts, `style-collection-${width}.png`) });
      const trigger = shopPage.locator(`[data-shop-style="${style.id}"]`);
      await galleryTrigger.click();
      await shopPage.locator("#style-gallery-shop").click();
      assert.equal(await shopPage.locator("#style-gallery-viewer").isVisible(), false, "Gallery hands off to the style shop");
      assert.equal(
        await shopPage.locator("#curated-style-shop").isVisible(),
        true,
      );
      assert.equal(
        await shopPage.locator("#style-shop-title").textContent(),
        style.name,
      );
      assert.equal(
        await shopPage.locator("#style-build-finish option").count(),
        3,
      );
      await shopPage.keyboard.press("Shift+Tab");
      assert.equal(
        await shopPage.evaluate(() =>
          document
            .getElementById("curated-style-shop")
            .contains(document.activeElement),
        ),
        true,
        "Shop keeps keyboard focus inside",
      );
      await shopPage.locator("#style-build-finish").selectOption(style.finish);
      await shopPage.locator("#style-add-build").click();
      await shopPage
        .locator(`[data-add-style-sample="${style.sample}"]`)
        .click();
      const selected = await shopPage.evaluate(() =>
        JSON.parse(localStorage.getItem("secha-cart-v2")),
      );
      assert.ok(
        selected.some(
          (item) =>
            item.productId === style.product &&
            item.boardId === style.board &&
            item.material.id === style.finish &&
            item.boardName === style.name,
        ),
        "Build carries the selected collection and finish",
      );
      assert.ok(
        selected.some(
          (item) =>
            item.id === `sample:${style.sample}` &&
            item.boardId === style.board,
        ),
        "Physical sample matches the curated palette",
      );
      const violations = await shopPage.evaluate(async () =>
        (
          await axe.run(document.getElementById("curated-style-shop"), {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          })
        ).violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      );
      assert.deepEqual(violations, [], "Curated style shop accessibility");
      await shopPage.keyboard.press("Escape");
      await shopPage.waitForFunction((id) => document.querySelector(`[data-shop-style="${id}"]`) === document.activeElement, style.id);
      assert.equal(
        await shopPage.locator("#curated-style-shop").isVisible(),
        false,
      );
      assert.equal(
        await trigger.evaluate((el) => el === document.activeElement),
        true,
        "Shop restores focus to its collection",
      );
    }
    await shopPage.locator('[data-shop-style="warm-modern"]').click();
    await shopPage.locator("#style-view-bag").click();
    assert.equal(
      await shopPage.locator("#curated-style-shop").isVisible(),
      false,
    );
    assert.equal(
      await shopPage.locator(".cart-item").count(),
      8,
      "All four curated styles can be shopped independently",
    );
    await shopPage.keyboard.press("Escape");
    await shopPage.reload({ waitUntil: "domcontentloaded" });
    assert.equal(
      await shopPage.locator("#nav-cart-count").textContent(),
      "8",
      "Curated shopping bag persists and re-prices on reload",
    );
    assert.equal(
      await shopPage.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    assert.deepEqual(errors, []);
    results.push({
      viewport: width,
      case: "curated style collections",
      filters: "passed",
      imagery: "four optimized generated interior concepts per style",
      galleries: "thumbnails, arrow keys, swipe, focus restoration and shop handoff passed",
      shopping: "theme-specific finishes, builds and samples persist",
      accessibility: "passed",
    });
    await context.close();
  }
  const fallback = await browser.newContext({ reducedMotion: "reduce" });
  const page = await fallback.newPage();
  await page.route("**/vendor/**", (route) => route.abort());
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.querySelectorAll(".product-card").length === 6,
  );
  await page.getByRole("button", { name: "Add design to bag" }).first().click();
  assert.equal(await page.locator("#nav-cart-count").textContent(), "1");
  assert.equal(await page.locator("#material-fallback").isVisible(), true);
  await page.locator("#moodboard-nav button").nth(1).click();
  await page.locator("#btn-add-cart").click();
  assert.equal(await page.locator("#nav-cart-count").textContent(), "2");
  assert.deepEqual(errors, []);
  results.push({
    case: "missing 3D/animation scripts",
    commerce: "works",
    errors,
  });
  await fs.writeFile(
    path.join(artifacts, "results.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (server) server.kill();
  });
