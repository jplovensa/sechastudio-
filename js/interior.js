/* Furnished room preview. Geometry is illustrative; all dimensions need a site survey. */
let roomConfig = {
  room: "living",
  width: 4,
  depth: 4,
  modules: 3,
  light: "day",
};
let refreshInterior = null;
function initFinishingStudio() {
  const container = document.getElementById("vignette-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.replaceChildren(renderer.domElement);
  renderer.domElement.setAttribute(
    "aria-label",
    "Interactive furnished interior room preview",
  );
  renderer.domElement.setAttribute("role", "img");
  const daylight = new THREE.HemisphereLight(0xe9f3ff, 0x514433, 0.9);
  const sun = new THREE.DirectionalLight(0xffebcc, 1.2);
  sun.position.set(-3, 6, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const ambient = new THREE.PointLight(0xffc68a, 0.5, 15);
  ambient.position.set(1, 2.5, 0);
  scene.add(daylight, sun, ambient);
  let room = null;
  const finish = new THREE.MeshStandardMaterial({
    color: activeMaterial.color,
    roughness: activeMaterial.roughness,
    metalness: activeMaterial.metalness,
  });
  function material(color, roughness = 0.8) {
    return new THREE.MeshStandardMaterial({ color, roughness });
  }
  function box(parent, w, h, d, x, y, z, mat) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function rebuild() {
    if (room) {
      const geometry = new Set(),
        materials = new Set();
      room.traverse((o) => {
        if (o.isMesh) {
          geometry.add(o.geometry);
          if (o.material !== finish) materials.add(o.material);
        }
      });
      geometry.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      scene.remove(room);
    }
    room = new THREE.Group();
    scene.add(room);
    const { width: w, depth: d, modules, light } = roomConfig;
    const wall = material(light === "day" ? 0xded8c9 : 0xc4b8a4);
    const timber = material(0xbaa17a);
    const linen = material(0xcfc8b8);
    const dark = material(0x33332f);
    const green = material(0x536549);
    scene.background = new THREE.Color(light === "day" ? 0xaaa79f : 0x24201d);
    daylight.intensity = light === "day" ? 0.9 : 0.28;
    sun.intensity = light === "day" ? 1.2 : 0.35;
    ambient.intensity = light === "day" ? 0.3 : 1.7;
    box(room, w + 0.3, 0.15, d + 0.3, 0, -0.08, 0, timber);
    for (let x = -w / 2; x < w / 2; x += 0.3)
      box(room, 0.008, 0.005, d, x, 0.004, 0, dark);
    box(room, w + 0.15, 2.8, 0.12, 0, 1.4, -d / 2, wall);
    box(room, 0.12, 2.8, d / 2, -w / 2, 1.4, -d / 4, wall);
    box(room, 0.13, 0.7, d / 2, -w / 2, 0.35, d / 4, wall);
    box(room, 0.13, 0.25, d / 2, -w / 2, 2.68, d / 4, wall);
    const glass = new THREE.MeshStandardMaterial({
      color: 0xb9d4df,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
    });
    box(room, 0.03, 1.75, d / 2, -w / 2, 0.7 + 0.875, d / 4, glass);
    for (const z of [0, d / 4, d / 2])
      box(room, 0.16, 1.9, 0.035, -w / 2, 1.62, z, dark);
    box(room, w * 0.7, 0.025, d * 0.6, 0, 0.02, 0.15, material(0x918a7d));
    // Modular cabinet wall: visible grid and finish applied only to joinery.
    const mw = Math.min(0.72, (w - 0.5) / modules);
    for (let i = 0; i < modules; i++) {
      const x = (i - (modules - 1) / 2) * (mw + 0.035);
      box(room, mw, 0.65, 0.4, x, 0.45, -d / 2 + 0.3, finish);
      box(room, mw, 0.06, 0.43, x, 0.8, -d / 2 + 0.3, timber);
      box(room, 0.012, 0.5, 0.025, x, 0.45, -d / 2 + 0.515, dark);
      box(room, mw, 0.045, 0.24, x, 1.65, -d / 2 + 0.2, timber);
      box(room, 0.035, 0.6, 0.24, x - mw / 2, 1.35, -d / 2 + 0.2, finish);
      for (let j = 0; j < 3; j++)
        box(
          room,
          0.075,
          0.2 + j * 0.04,
          0.12,
          x - 0.2 + j * 0.09,
          1.78,
          -d / 2 + 0.2,
          material([0x8d6952, 0xd9cfba, 0x484b40][j]),
        );
    }
    if (roomConfig.room === "living") {
      box(room, 2, 0.33, 0.85, -0.25, 0.39, 0.55, linen);
      box(room, 2, 0.6, 0.18, -0.25, 0.8, 0.17, linen);
      for (const x of [-1.2, 0.7])
        box(room, 0.16, 0.5, 0.85, x, 0.66, 0.55, linen);
      for (const x of [-0.85, 0.35])
        box(room, 0.55, 0.13, 0.55, x, 0.61, 0.6, material(0xb1a692));
      box(room, 1.05, 0.075, 0.55, 0.3, 0.38, 1.45, finish);
      for (const x of [-0.1, 0.7])
        box(room, 0.055, 0.35, 0.45, x, 0.19, 1.45, dark);
    } else if (roomConfig.room === "work") {
      box(room, 1.7, 0.08, 0.7, 0.15, 0.78, 0.05, timber);
      for (const x of [-0.55, 0.85])
        box(room, 0.07, 0.75, 0.6, x, 0.38, 0.05, dark);
      box(room, 0.65, 0.4, 0.05, 0.15, 1.1, -0.05, dark);
      box(room, 0.2, 0.08, 0.2, 0.15, 0.84, -0.05, dark);
      box(room, 0.48, 0.12, 0.45, 0.15, 0.48, 0.9, linen);
      box(room, 0.48, 0.6, 0.1, 0.15, 0.78, 1.08, linen);
      for (const x of [-0.05, 0.35])
        box(room, 0.045, 0.45, 0.04, x, 0.22, 0.9, dark);
    } else {
      box(room, 1.65, 0.3, 2, 0, 0.24, 0.45, timber);
      box(room, 1.62, 0.23, 1.96, 0, 0.5, 0.45, linen);
      box(room, 1.75, 0.9, 0.12, 0, 0.6, -0.57, finish);
      box(room, 1.62, 0.05, 1.2, 0, 0.64, 0.83, material(0x9eaa9b));
      for (const x of [-0.42, 0.42])
        box(room, 0.65, 0.12, 0.38, x, 0.68, -0.25, material(0xe5ded0));
    }
    // Planter, floor lamp, wall artwork and warm pendant.
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.14, 0.35, 20),
      material(0xab8666),
    );
    pot.position.set(w / 2 - 0.35, 0.2, -d / 2 + 0.5);
    room.add(pot);
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8), green);
      leaf.scale.set(0.6, 2.3, 0.35);
      leaf.position.set(
        w / 2 - 0.35 + Math.sin(i) * 0.12,
        0.65 + Math.cos(i) * 0.15,
        -d / 2 + 0.5 + Math.cos(i) * 0.1,
      );
      leaf.rotation.z = Math.sin(i) * 0.5;
      room.add(leaf);
    }
    box(room, 0.035, 1.8, 0.035, w / 2 - 0.35, 0.9, 0.7, dark);
    box(room, 0.45, 0.28, 0.45, w / 2 - 0.35, 1.75, 0.7, linen);
    box(room, 0.9, 0.75, 0.04, -w / 2 + 0.7, 1.8, -d / 2 + 0.09, timber);
    box(
      room,
      0.79,
      0.64,
      0.05,
      -w / 2 + 0.7,
      1.8,
      -d / 2 + 0.12,
      material(0x746657),
    );
    const pendant = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.42, 0.2, 24),
      linen,
    );
    pendant.position.set(0, 2.35, 0.3);
    room.add(pendant);
    box(room, 0.015, 0.4, 0.015, 0, 2.65, 0.3, dark);
  }
  refreshInterior = rebuild;
  updateVignetteMaterial = (m) => {
    finish.color.setHex(m.color);
    finish.roughness = m.roughness;
    finish.metalness = m.metalness;
    finish.transparent = !!m.transparent;
    finish.opacity = m.opacity ?? 1;
    finish.needsUpdate = true;
  };
  rebuild();
  let pointer = 0;
  const shouldRender = createRenderGate(container);
  container.addEventListener("pointermove", (e) => {
    const r = container.getBoundingClientRect();
    pointer = (e.clientX - r.left) / r.width - 0.5;
  });
  container.addEventListener("pointerleave", () => (pointer = 0));
  new ResizeObserver(() => {
    const w = container.clientWidth,
      h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }).observe(container);
  function animate() {
    requestAnimationFrame(animate);
    if (!shouldRender()) return;
    const size = Math.max(roomConfig.width, roomConfig.depth);
    const motion = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : pointer;
    camera.position.set(size * 0.8 + motion, size * 0.7, size * 1.25);
    camera.lookAt(0, 1, 0);
    renderer.render(scene, camera);
  }
  animate();
}
