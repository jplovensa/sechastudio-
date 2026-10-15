/* Tactile material studies share the catalogue and sample bag with the storefront. */
let refreshMaterialShowcase = null;
function playgroundDirectionURL() {
  return `playground.html?${new URLSearchParams({ moodboard: MOODBOARDS[activeFinishingIdx].id, finishing: activeMaterial.id })}`;
}
function renderMoodboardUI() {
  const b = MOODBOARDS[activeMoodboardIdx],
    list = MATERIAL_PALETTES[b.id];
  activeFinishingIdx = activeMoodboardIdx;
  if (!list.some((m) => m.id === activeMaterial.id)) activeMaterial = list[0];
  const nav = document.getElementById("moodboard-nav");
  if (!nav.children.length)
    nav.innerHTML = MOODBOARDS.map(
      (board, i) =>
        `<button onclick="changeMoodboard(${i})" aria-pressed="false"><small>${String(i + 1).padStart(2, "0")}</small><span>${board.name.replace("The ", "")}</span></button>`,
    ).join("");
  [...nav.children].forEach((button, i) =>
    button.setAttribute("aria-pressed", i === activeMoodboardIdx),
  );
  document.getElementById("showcase-board").textContent = b.style;
  document.getElementById("material-board-name").textContent = b.name;
  document.getElementById("material-style").textContent = b.style;
  document.getElementById("material-feeling").textContent = b.desc;
  const swatches = document.getElementById("material-list");
  if (swatches.dataset.board !== b.id) {
    swatches.dataset.board = b.id;
    swatches.innerHTML = list
      .map(
        (m) =>
          `<button onclick="selectMaterial('${m.id}')" aria-pressed="false"><i class="texture-${m.type.toLowerCase()}" style="--sample:#${m.color.toString(16).padStart(6, "0")}"></i><span>${m.name}<small>${m.type}</small></span><b aria-hidden="true">↗</b></button>`,
      )
      .join("");
  }
  [...swatches.children].forEach((button, i) =>
    button.setAttribute("aria-pressed", list[i].id === activeMaterial.id),
  );
  const m = activeMaterial;
  document.getElementById("surface-type").textContent = `Selected / ${m.name}`;
  document.getElementById("surface-feel").textContent =
    m.type === "Fabric"
      ? "Soft-looking, woven and light-absorbing."
      : m.type === "Wood"
        ? "Warm grain, a quiet surface and natural variation."
        : m.transparent
          ? "Light-passing layers with a soft reflective edge."
          : m.metalness > 0.5
            ? "Brushed highlights and a cool, reflective presence."
            : m.roughness > 0.65
              ? "A tactile, matte surface with subtle visual depth."
              : "A smooth surface with a pronounced play of light.";
  document.getElementById("sheen-marker").style.left =
    `${(1 - m.roughness) * 100}%`;
  document.getElementById("material-playground").href =
    playgroundDirectionURL();
  document.getElementById("btn-add-cart").textContent = cart.some(
    (i) => i.id === `sample:${m.id}`,
  )
    ? "Add another sample · Rp150.000"
    : "Add physical sample · Rp150.000";
}
function renderFinishingUI() {
  renderMoodboardUI();
}
function changeMoodboard(index) {
  if (!MOODBOARDS[index]) return;
  activeMoodboardIdx = index;
  activeMaterial = MATERIAL_PALETTES[MOODBOARDS[index].id][0];
  renderMoodboardUI();
  refreshMaterialShowcase?.();
}
function selectMaterial(id) {
  const m = MATERIAL_PALETTES[MOODBOARDS[activeMoodboardIdx].id].find(
    (m) => m.id === id,
  );
  if (!m) return;
  activeMaterial = m;
  renderMoodboardUI();
  refreshMaterialShowcase?.();
}
function initMoodboardStudio() {
  const host = document.getElementById("moodboard-canvas");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.append(renderer.domElement);
  document.getElementById("material-fallback").hidden = true;
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 5.6, 6.8);
  camera.lookAt(0, 0.1, 0);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x807967, 1.05),
    sun = new THREE.DirectionalLight(0xfff3dc, 1.1);
  sun.position.set(2.536, 6, 5.438);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -5;
  sun.shadow.camera.right = 5;
  sun.shadow.camera.top = 5;
  sun.shadow.camera.bottom = -5;
  sun.shadow.bias = -0.001;
  scene.add(hemi, sun);
  const envCanvas = document.createElement("canvas");
  envCanvas.width = envCanvas.height = 64;
  const ectx = envCanvas.getContext("2d"),
    grad = ectx.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, "#fffdf5");
  grad.addColorStop(0.5, "#ded9ca");
  grad.addColorStop(1, "#676558");
  ectx.fillStyle = grad;
  ectx.fillRect(0, 0, 64, 64);
  const environment = new THREE.CubeTexture(Array(6).fill(envCanvas));
  environment.encoding = THREE.sRGBEncoding;
  environment.needsUpdate = true;
  scene.environment = environment;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.ShadowMaterial({ opacity: 0.13 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.12;
  ground.receiveShadow = true;
  scene.add(ground);
  const group = new THREE.Group();
  group.rotation.y = -0.2;
  scene.add(group);
  let samples = [],
    renderNeeded = true,
    visible = false,
    rotating = false,
    last = 0,
    pointer = null;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  function texture(m) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#" + m.color.toString(16).padStart(6, "0");
    ctx.fillRect(0, 0, 256, 256);
    let seed = m.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    if (m.type === "Fabric") {
      for (let i = 0; i < 256; i += 3) {
        ctx.strokeStyle = i % 2 ? "#ffffff24" : "#00000025";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.moveTo(0, i);
        ctx.lineTo(256, i);
        ctx.stroke();
      }
    } else if (m.type === "Wood") {
      for (let i = 0; i < 150; i++) {
        ctx.strokeStyle = i % 3 ? "#6a3f1f30" : "#ffffff35";
        ctx.lineWidth = random() * 1.4 + 0.3;
        ctx.beginPath();
        const y = random() * 256;
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
          80,
          y + random() * 25,
          170,
          y - random() * 25,
          256,
          y + random() * 8,
        );
        ctx.stroke();
      }
    } else if (m.type === "Metal") {
      for (let i = 0; i < 700; i++) {
        ctx.fillStyle = i % 2 ? "#ffffff18" : "#00000014";
        ctx.fillRect(random() * 256, random() * 256, 15 + random() * 80, 0.3);
      }
    } else {
      for (let i = 0; i < 12000; i++) {
        ctx.fillStyle = i % 2 ? "#ffffff20" : "#00000017";
        const r = random() * 1.4;
        ctx.fillRect(random() * 256, random() * 256, r, r);
      }
    }
    const map = new THREE.CanvasTexture(canvas);
    map.encoding = THREE.sRGBEncoding;
    map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return map;
  }
  function rebuild() {
    for (const mesh of samples) {
      group.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.map?.dispose();
      mesh.material.dispose();
    }
    samples = [];
    MATERIAL_PALETTES[MOODBOARDS[activeMoodboardIdx].id].forEach((m, i) => {
      const tex = texture(m),
        mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: m.roughness,
          metalness: m.metalness,
          transparent: m.transparent ?? false,
          opacity: m.opacity ?? 1,
          bumpMap: m.type === "Fabric" || m.type === "Wood" ? tex : null,
          bumpScale: m.type === "Fabric" ? 0.035 : 0.018,
          envMapIntensity: 1,
        });
      const shape = new THREE.Shape(),
        w = 1.45,
        h = 1.95,
        r = 0.08;
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      const mesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, {
          depth: m.type === "Fabric" ? 0.12 : 0.16,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.035,
          bevelThickness: 0.025,
        }),
        mat,
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = (i - 1) * -0.13;
      mesh.position.set(
        (i - 1) * 1.55,
        m.id === activeMaterial.id ? 0.22 : 0.04,
        i === 1 ? -0.15 : 0.25,
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.materialId = m.id;
      group.add(mesh);
      samples.push(mesh);
    });
    renderNeeded = true;
  }
  refreshMaterialShowcase = rebuild;
  new ResizeObserver(() => {
    const w = host.clientWidth,
      h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.set(
      0,
      camera.aspect < 1 ? 8.5 : 5.6,
      camera.aspect < 1 ? 9.8 : 6.8,
    );
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
    renderNeeded = true;
  }).observe(host);
  new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
    if (visible) renderNeeded = true;
  }).observe(host);
  document.getElementById("sample-light").addEventListener("input", (e) => {
    const a = (Number(e.target.value) * Math.PI) / 180;
    sun.position.set(Math.sin(a) * 6, 6, Math.cos(a) * 6);
    renderNeeded = true;
  });
  document.getElementById("sample-rotate").addEventListener("click", () => {
    rotating = !rotating;
    document
      .getElementById("sample-rotate")
      .setAttribute("aria-pressed", rotating);
  });
  document.getElementById("sample-reset").addEventListener("click", () => {
    group.rotation.set(0, -0.2, 0);
    rotating = false;
    document
      .getElementById("sample-rotate")
      .setAttribute("aria-pressed", false);
    document.getElementById("sample-light").value = 25;
    sun.position.set(2.536, 6, 5.438);
    renderNeeded = true;
  });
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      rotating = false;
      document
        .getElementById("sample-rotate")
        .setAttribute("aria-pressed", false);
    }
  });
  host.addEventListener("pointerdown", (e) => {
    if (e.target.tagName !== "CANVAS") return;
    pointer = { x: e.clientX, y: e.clientY, moved: false };
    host.setPointerCapture(e.pointerId);
  });
  host.addEventListener("pointermove", (e) => {
    if (!pointer) return;
    const dx = e.clientX - pointer.x,
      dy = e.clientY - pointer.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) pointer.moved = true;
    group.rotation.y += dx * 0.008;
    group.rotation.x = Math.max(
      -0.3,
      Math.min(0.3, group.rotation.x + dy * 0.003),
    );
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    renderNeeded = true;
  });
  host.addEventListener("pointerup", (e) => {
    if (pointer && !pointer.moved) {
      const rect = host.getBoundingClientRect(),
        ray = new THREE.Raycaster();
      ray.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          (-(e.clientY - rect.top) / rect.height) * 2 + 1,
        ),
        camera,
      );
      const hit = ray.intersectObjects(samples)[0];
      if (hit) selectMaterial(hit.object.userData.materialId);
    }
    pointer = null;
  });
  host.addEventListener("pointercancel", () => (pointer = null));
  host.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      group.rotation.y += e.key === "ArrowLeft" ? -0.15 : 0.15;
      renderNeeded = true;
    }
  });
  function frame(time) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    if (rotating && time - last > 33) {
      group.rotation.y += 0.006;
      renderNeeded = true;
    }
    if (renderNeeded && time - last > 33) {
      renderer.render(scene, camera);
      renderNeeded = false;
      last = time;
    }
  }
  rebuild();
  for (const id of ["sample-rotate", "sample-light", "sample-reset"])
    document.getElementById(id).disabled = false;
  requestAnimationFrame(frame);
}
