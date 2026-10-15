const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { spawn } = require("node:child_process");
let browser, server;
(async () => {
  const base = process.env.QA_BASE_URL || "http://127.0.0.1:8003";
  if (!process.env.QA_BASE_URL)
    server = spawn(
      "python3",
      ["-m", "http.server", "8003", "--bind", "127.0.0.1"],
      { cwd: path.join(__dirname, ".."), stdio: "ignore" },
    );
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  await fs.mkdir(path.join(__dirname, "../qa-artifacts"), { recursive: true });
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "no-preference",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("#studio-intro").isVisible(), true);
    await page.waitForFunction(
      () => document.getElementById("studio-intro-video").currentTime > 1,
    );
    await page.screenshot({
      path: path.join(__dirname, `../qa-artifacts/${width}-opening-film.png`),
    });
    await page.waitForFunction(
      () => document.getElementById("studio-intro").hidden,
    );
    assert.equal(
      await page.locator("#main-content").evaluate((el) => el.inert),
      false,
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("#studio-intro").isVisible(), true);
    await page.getByRole("button", { name: "Skip film" }).click();
    assert.equal(await page.locator("#studio-intro").isVisible(), false);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#studio-intro").isVisible(), false);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("#studio-intro").isVisible(), false);
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    for (const [i, id] of ["josephine", "daffa", "audina"].entries()) {
      const opener = page.locator(".designer-direction").nth(i);
      await opener.click();
      assert.equal(await page.locator("#global-modal").isVisible(), true);
      assert.equal(await page.locator(".direction-swatches span").count(), 3);
      if (id === "daffa")
        await page.locator("#modal-content-wrapper").screenshot({
          path: path.join(
            __dirname,
            `../qa-artifacts/${width}-designer-direction.png`,
          ),
        });
      await page.keyboard.press("Shift+Tab");
      assert.equal(
        await page.evaluate(() =>
          document
            .getElementById("global-modal")
            .contains(document.activeElement),
        ),
        true,
      );
      const violations = await page.evaluate(async () =>
        (
          await axe.run(document.getElementById("global-modal"), {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          })
        ).violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      );
      assert.deepEqual(violations, []);

      await page.keyboard.press("Escape");
      assert.equal(
        await opener.evaluate((el) => el === document.activeElement),
        true,
      );
      await opener.click();
      await page
        .getByRole("button", { name: "Try this direction in your room" })
        .click();
      await page.waitForURL("**/playground.html?moodboard=*");
      assert.equal(
        new URL(page.url()).searchParams.get("moodboard"),
        { josephine: "purist", daffa: "architect", audina: "nomad" }[id],
      );
      assert.equal(
        await page.locator("#moodboard-select").inputValue(),
        { josephine: "purist", daffa: "architect", audina: "nomad" }[id],
      );
      await page.goto(base, { waitUntil: "domcontentloaded" });
      await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    }
    await page.locator("#modular-build").screenshot({
      path: path.join(__dirname, `../qa-artifacts/${width}-affiliation.png`),
    });
    assert.equal(
      await page.locator("#finishing-studio, #style-walkway").count(),
      0,
    );
    assert.ok(
      (await page.locator("#modular-build").boundingBox()).height <
        (width === 1440 ? 650 : 1100),
      "EPS section is compact",
    );
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const editorialAudit = await page.evaluate(async () =>
      (
        await axe.run(
          {
            include: [
              "#moodboards",
              "#modular-build",
              "#playground",
              "#process",
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
    assert.deepEqual(editorialAudit, [], "Redesigned sections accessibility");
    for (let i = 0; i < 5; i++) {
      await page.locator(`[data-process="${i}"]`).click();
      assert.equal(
        await page
          .locator(`[data-process="${i}"]`)
          .getAttribute("aria-pressed"),
        "true",
      );
      await page.waitForFunction(() => {
        const img = document.querySelector("#process-detail img");
        return img.complete && img.naturalWidth > 0;
      });
    }
    await page.locator('[data-process="0"]').focus();
    await page.keyboard.press("End");
    assert.equal(
      await page.locator('[data-process="4"]').getAttribute("aria-pressed"),
      "true",
      "Process steps support keyboard selection",
    );
    assert.equal(
      await page.locator(".eps-affiliation img").evaluateAll((images) =>
        images.every((img) => {
          const c = document.createElement("canvas");
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0);
          return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
        }),
      ),
      true,
      "Both logos have genuinely transparent corners",
    );
    assert.match(
      await page.locator("#modular-build").textContent(),
      /Fjäll Group/,
    );
    assert.equal(
      await page
        .locator(".eps-affiliation img")
        .evaluateAll((images) =>
          images.every((i) => i.complete && i.naturalWidth > 0),
        ),
      true,
    );
    await page.locator("#shop").screenshot({
      path: path.join(
        __dirname,
        `../qa-artifacts/${width}-modular-catalogue.png`,
      ),
    });
    assert.equal(
      await page
        .locator(".product-image img")
        .evaluateAll((images) =>
          images
            .slice(0, 3)
            .every(
              (i) =>
                i.complete &&
                i.naturalWidth > 0 &&
                i.src.includes("-concept.png"),
            ),
        ),
      true,
    );
    await page.locator(".product-image img").nth(5).scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll(".product-image img"))
        .slice(3)
        .every((i) => i.complete && i.naturalWidth > 0),
    );
    assert.equal(
      await page
        .locator(".product-image img")
        .evaluateAll((images) =>
          images.slice(3).every((i) => i.src.includes("-service.png")),
        ),
      true,
      "Design services use deliverable-specific images",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    assert.deepEqual(errors, []);
    await page.close();
  }
  const failed = await browser.newPage({ reducedMotion: "no-preference" });
  await failed.route("**/assets/films/*.mp4", (r) => r.abort());
  await failed.goto(base);
  await failed.waitForFunction(
    () => document.getElementById("studio-intro").hidden,
  );
  assert.equal(
    await failed.locator("#main-content").evaluate((el) => el.inert),
    false,
  );
  await failed.close();
  console.log(
    "Studio QA passed: film playback and recovery, designer modal focus and WCAG checks, designer-to-playground navigation, compact EPS and transparent affiliation logos, interactive process steps and keyboard access, redesigned-section accessibility, service assets and responsive layout.",
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
