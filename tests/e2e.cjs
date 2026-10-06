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
    assert.equal(await page.locator("canvas").count(), 3);
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const audit = await page.evaluate(async () =>
      (
        await axe.run(
          { include: ["#shop", "#modular-build", "#finishing-studio"] },
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
    await page.locator('[data-filter="modular"]').click();
    assert.equal(await page.locator(".product-card").count(), 3);
    await page.locator('[data-filter="design"]').click();
    assert.equal(await page.locator(".product-card").count(), 3);
    await page.locator('[data-filter="all"]').click();
    await page
      .getByRole("button", { name: "Try in studio" })
      .first()
      .click();
    await page.selectOption("#room-kind", "work");
    await page.selectOption("#room-light", "warm");
    await page.selectOption("#room-modules", "4");
    await page.locator("#room-width").fill("5");
    assert.equal(await page.locator("#room-width-value").textContent(), "5 m");
    await page
      .getByRole("button", { name: "Add room setup to bag" })
      .click();
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
    assert.match(content, /4 modules/);
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
        "catalogue, room controls, configured build, distinct swatches, coupon, persistence, cart/checkout totals, form validation, request export, WhatsApp destination/message, no horizontal overflow",
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
    for (const section of ["#shop", "#modular-build", "#finishing-studio"]) {
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
  await page.locator("#walkway-tryon-grid button").nth(1).click();
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
