/* Rebuild the silent four-second Studio+ motion film. Requires Chromium and ffmpeg. */
const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
(async () => {
  const frames = await fs.mkdtemp(path.join(os.tmpdir(), "secha-film-"));
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 960, height: 540 },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<style>body{margin:0;background:#050505}canvas{position:absolute;inset:0}#type{pointer-events:none}</style><canvas id="type" width="960" height="540"></canvas>`,
    );
    await page.addScriptTag({
      path: path.join(__dirname, "../vendor/three.r128.min.js"),
    });
    await page.evaluate(() => {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#050505");
      const camera = new THREE.PerspectiveCamera(35, 960 / 540, 0.1, 100);
      camera.position.set(6, 5, 8);
      camera.lookAt(0, 1, 0);
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
      });
      renderer.setSize(960, 540);
      renderer.outputEncoding = THREE.sRGBEncoding;
      document.body.prepend(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0xfff2da, 0x333830, 1.1));
      const light = new THREE.DirectionalLight(0xffe7c7, 1.2);
      light.position.set(3, 6, 4);
      scene.add(light);
      const group = new THREE.Group();
      scene.add(group);
      const parts = [];
      function block(w, h, d, x, y, z, color, delay) {
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, d),
          new THREE.MeshStandardMaterial({ color, roughness: 0.8 }),
        );
        m.position.set(x, y, z);
        group.add(m);
        parts.push({ mesh: m, y, delay });
      }
      block(5, 0.12, 3.8, 0, 0, 0, "#a9987c", 0);
      block(5, 2.8, 0.1, 0, 1.4, -1.8, "#d8d0c0", 0.1);
      block(0.1, 2.8, 3.8, -2.45, 1.4, 0, "#c1b5a2", 0.2);
      for (let i = 0; i < 3; i++) {
        block(
          1.2,
          0.65,
          0.65,
          -1.3 + i * 1.3,
          0.42,
          -1.3,
          "#8f7557",
          0.35 + i * 0.1,
        );
        block(
          1.12,
          0.5,
          0.035,
          -1.3 + i * 1.3,
          0.43,
          -0.95,
          "#b79e7e",
          0.45 + i * 0.1,
        );
      }
      block(2.4, 0.14, 1.1, 0.7, 0.45, 0.85, "#c8bca7", 0.5);
      block(2.4, 0.65, 0.2, 0.7, 0.8, 1.3, "#bdb09c", 0.65);
      block(1.2, 0.1, 0.6, -1.1, 0.32, 0.7, "#3d403a", 0.8);
      const ctx = document.getElementById("type").getContext("2d");
      window.drawFrame = (t) => {
        const ease = (v) => {
          v = Math.max(0, Math.min(1, v));
          return 1 - Math.pow(1 - v, 3);
        };
        parts.forEach(({ mesh, y, delay }) => {
          const a = ease((t - delay) / 1.25);
          mesh.position.y = y + (1 - a) * 3;
          mesh.scale.setScalar(0.88 + 0.12 * a);
        });
        group.rotation.y = -0.23 + t * 0.055;
        renderer.render(scene, camera);
        ctx.clearRect(0, 0, 960, 540);
        const fade = ease((t - 1.7) / 0.8);
        ctx.fillStyle = `rgba(5,5,5,${fade * 0.68})`;
        ctx.fillRect(0, 0, 960, 540);
        ctx.globalAlpha = fade;
        ctx.fillStyle = "#f3eee4";
        ctx.textAlign = "center";
        ctx.font = "bold 74px Arial";
        ctx.fillText("STUDIO+", 480, 260 + (1 - fade) * 18);
        ctx.font = "13px monospace";
        ctx.fillText(
          "S E C H A   /   P E O P L E   M A K E   S P A C E",
          480,
          301,
        );
        ctx.globalAlpha = 1;
      };
    });
    for (let i = 0; i < 96; i++) {
      await page.evaluate((t) => window.drawFrame(t), i / 24);
      await page.screenshot({
        path: path.join(frames, String(i).padStart(4, "0") + ".png"),
      });
    }
    await fs.mkdir(path.join(__dirname, "../assets/films"), {
      recursive: true,
    });
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-framerate",
        "24",
        "-i",
        path.join(frames, "%04d.png"),
        "-c:v",
        "libx264",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        path.join(__dirname, "../assets/films/studio-plus-intro.mp4"),
      ],
      { stdio: "ignore" },
    );
    console.log("Rendered 96 frames: four-second, silent Studio+ MP4.");
  } finally {
    await browser.close();
    await fs.rm(frames, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
