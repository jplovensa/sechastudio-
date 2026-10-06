function createRenderGate(container) {
  let visible = false,
    last = 0;
  new IntersectionObserver(
    (entries) => (visible = entries[0].isIntersecting),
  ).observe(container);
  return () => {
    const now = performance.now();
    const interval = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 200
      : 33;
    if (!visible || document.hidden || now - last < interval) return false;
    last = now;
    return true;
  };
}

// --- CONSTANTS & DATA ---
const MOODBOARDS = [
  {
    id: "architect",
    name: "The Architect",
    style: "Noir Brutalism",
    desc: "Uncompromising geometry, sharp lines, and glossy textures that reflect a premium, absolute lifestyle.",
    color: 0x111111,
    roughness: 0.1,
    metalness: 0.9,
    geo: "box",
  },
  {
    id: "nomad",
    name: "The Nomad",
    style: "Japandi Serenity",
    desc: "Warm woods, muted tones, and organic imperfections creating a haven of tranquil balance.",
    color: 0xd4c5b9,
    roughness: 0.9,
    metalness: 0.1,
    geo: "sphere",
  },
  {
    id: "visionary",
    name: "The Visionary",
    style: "Avant-Garde Chroma",
    desc: "Vibrant pops of bold colour set against stark structural elements for the fearless creator.",
    color: 0x4338ca,
    roughness: 0.3,
    metalness: 0.4,
    geo: "octahedron",
  },
  {
    id: "purist",
    name: "The Purist",
    style: "Desert Monolith",
    desc: "Earthy terracotta, raw stone, and expansive warmth grounded in natural landscapes.",
    color: 0xc28f70,
    roughness: 1.0,
    metalness: 0.0,
    geo: "cylinder",
  },
  {
    id: "aesthete",
    name: "The Aesthete",
    style: "Midnight Gallery",
    desc: "Deep moody tones, dramatic spotlighting, and reflective metallic accents.",
    color: 0x0a1128,
    roughness: 0.2,
    metalness: 0.7,
    geo: "torus",
  },
  {
    id: "dreamer",
    name: "The Dreamer",
    style: "Luminous Glasshouse",
    desc: "Ethereal transparency, soft light, and boundless space blending the inside with the out.",
    color: 0xffffff,
    roughness: 0.0,
    metalness: 0.2,
    transparent: true,
    opacity: 0.5,
    geo: "icosahedron",
  },
];

const MATERIAL_PALETTES = {
  architect: [
    {
      id: "a1",
      name: "Raw Cast Concrete",
      type: "Stone",
      color: 0x888888,
      roughness: 0.9,
      metalness: 0.1,
    },
    {
      id: "a2",
      name: "Anodised Gunmetal",
      type: "Metal",
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.8,
    },
    {
      id: "a3",
      name: "Smoked Obsidian Glass",
      type: "Glass",
      color: 0x222222,
      roughness: 0.0,
      metalness: 0.5,
      transparent: true,
      opacity: 0.7,
    },
  ],
  nomad: [
    {
      id: "n1",
      name: "White Ash Wood",
      type: "Wood",
      color: 0xe6dfd3,
      roughness: 0.8,
      metalness: 0.0,
    },
    {
      id: "n2",
      name: "Boucle Linen",
      type: "Fabric",
      color: 0xf5f2ec,
      roughness: 1.0,
      metalness: 0.0,
    },
    {
      id: "n3",
      name: "Wabi-Sabi Plaster",
      type: "Stone",
      color: 0xc4b7a6,
      roughness: 0.9,
      metalness: 0.1,
    },
  ],
  visionary: [
    {
      id: "v1",
      name: "Ultramarine Matte",
      type: "Paint",
      color: 0x1e3a8a,
      roughness: 0.7,
      metalness: 0.1,
    },
    {
      id: "v2",
      name: "Brushed Chrome",
      type: "Metal",
      color: 0xdddddd,
      roughness: 0.3,
      metalness: 1.0,
    },
    {
      id: "v3",
      name: "Neon Acrylic",
      type: "Plastic",
      color: 0xec4899,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.9,
    },
  ],
  purist: [
    {
      id: "p1",
      name: "Terracotta Clay",
      type: "Ceramic",
      color: 0xaf5b3c,
      roughness: 0.8,
      metalness: 0.0,
    },
    {
      id: "p2",
      name: "Sandstone",
      type: "Stone",
      color: 0xd9c2a3,
      roughness: 0.9,
      metalness: 0.0,
    },
    {
      id: "p3",
      name: "Aged Brass",
      type: "Metal",
      color: 0x8c734b,
      roughness: 0.4,
      metalness: 0.7,
    },
  ],
  aesthete: [
    {
      id: "ae1",
      name: "Midnight Velvet",
      type: "Fabric",
      color: 0x050510,
      roughness: 0.9,
      metalness: 0.1,
    },
    {
      id: "ae2",
      name: "Polished Onyx",
      type: "Stone",
      color: 0x111111,
      roughness: 0.1,
      metalness: 0.3,
    },
    {
      id: "ae3",
      name: "Brushed Gold",
      type: "Metal",
      color: 0xc5a059,
      roughness: 0.3,
      metalness: 0.9,
    },
  ],
  dreamer: [
    {
      id: "d1",
      name: "Frosted Glass",
      type: "Glass",
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.5,
    },
    {
      id: "d2",
      name: "Opal Iridescent",
      type: "Acrylic",
      color: 0xf0f8ff,
      roughness: 0.1,
      metalness: 0.4,
    },
    {
      id: "d3",
      name: "Polished Silver",
      type: "Metal",
      color: 0xeeeeee,
      roughness: 0.1,
      metalness: 0.9,
    },
  ],
};

// --- GLOBAL STATE ---
let activeMoodboardIdx = 0;
let activeFinishingIdx = 0;
let activeMaterial = MATERIAL_PALETTES.architect[0];
let cart = [];
let isCartOpen = false;

// Globals for 3D Communication
let setMoodboardCameraTarget = null;
let updateVignetteMaterial = null;

// --- MODAL DATA (Brutalist Enhancement & British English Localization) ---
const MODAL_DATA = {
  "why-we-exist": {
    subtitle: "01 // Core Philosophy",
    title: "Bridging<br/>The Gap",
    body: `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-800 pt-8 mt-4">
                        <div class="aspect-square w-full overflow-hidden bg-zinc-900 border border-zinc-800 relative group">
                            <div class="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                            <img src="assets/interior-work.jpg" class="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700">
                        </div>
                        <div class="flex flex-col justify-between">
                            <div>
                                <p class="text-xs font-mono text-zinc-300 uppercase tracking-[0.2em] mb-4 pb-4 border-b border-zinc-800">Mission Directive</p>
                                <p class="text-sm md:text-base leading-relaxed text-white font-medium mb-6">Design shouldn't be an intimidating process reserved for the elite. We established SECHA Studio+ to democratise premium interior architecture.</p>
                                <p class="text-xs leading-relaxed text-zinc-500 font-mono tracking-wide">We bridge the gap between abstract dreams and tangible realities, handling everything from spatial psychology to material science so you can simply enjoy the result. Your sanctuary should be effortless.</p>
                            </div>
                        </div>
                    </div>
                `,
  },
  "modern-elegance": {
    subtitle: "02 // Archetype Profile",
    title: "Modern<br/>Elegance",
    body: `
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-8 border-t border-zinc-800 pt-8 mt-4">
                        <div class="md:col-span-2 flex flex-col justify-between">
                            <div>
                                <p class="text-xs font-mono text-zinc-300 uppercase tracking-[0.2em] mb-4 pb-4 border-b border-zinc-800">Daffa • Form Architect</p>
                                <p class="text-sm leading-relaxed text-white font-medium mb-6">For those who love clean lines, clutter-free spaces, and a touch of absolute, everyday luxury.</p>
                                <p class="text-xs leading-relaxed text-zinc-500 font-mono tracking-wide">His approach relies on subtracting the unnecessary, leaving only what is beautiful and purposeful. Think brutalist textures meeting elegant, undeniable proportions.</p>
                            </div>
                        </div>
                        <div class="md:col-span-3 aspect-[4/3] w-full overflow-hidden bg-zinc-900 border border-zinc-800 relative group">
                            <div class="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                            <img src="assets/interior-living.jpg" class="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700">
                        </div>
                    </div>
                `,
  },
  "cosy-functional": {
    subtitle: "03 // Archetype Profile",
    title: "Cosy &<br/>Functional",
    body: `
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-8 border-t border-zinc-800 pt-8 mt-4">
                        <div class="md:col-span-3 aspect-[4/3] w-full overflow-hidden bg-zinc-900 border border-zinc-800 relative group order-2 md:order-1">
                            <div class="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                            <img src="assets/interior-rest.jpg" class="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700">
                        </div>
                        <div class="md:col-span-2 flex flex-col justify-between order-1 md:order-2">
                            <div>
                                <p class="text-xs font-mono text-zinc-300 uppercase tracking-[0.2em] mb-4 pb-4 border-b border-zinc-800">Audina • Soul of Space</p>
                                <p class="text-sm leading-relaxed text-white font-medium mb-6">For those who want their home to feel like a warm embrace. Audina blends Japandi warmth with practical, user-first design.</p>
                                <p class="text-xs leading-relaxed text-zinc-500 font-mono tracking-wide">She emphasises organic materials, soft indirect lighting, and spatial rhythms that encourage connection, rest, and absolute tranquillity.</p>
                            </div>
                        </div>
                    </div>
                `,
  },
  "tier-lite": {
    subtitle: "INVESTMENT_TIER // LEVEL_01",
    title: "The Lite Tier<br/>Fundamental Package",
    body: `
                    <div class="border-t border-zinc-800 pt-8 mt-4">
                        <p class="mb-6 leading-relaxed font-medium text-zinc-300">An entry-level structured programme targeting spatial layouts, essential aesthetic narratives, and clear design directions.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-zinc-400 mb-8">
                            <div class="p-5 border border-zinc-900 bg-zinc-950">
                                <p class="text-white uppercase tracking-widest mb-3 font-bold font-sans text-sm">Visual Mapping</p>
                                <ul class="space-y-2">
                                    <li>• Curated Archetype Moodboard Mapping</li>
                                    <li>• Interactive Digital Colour Swatch Index</li>
                                    <li>• Visual Aesthetic Narrative Summary</li>
                                </ul>
                            </div>
                            <div class="p-5 border border-zinc-900 bg-zinc-950">
                                <p class="text-white uppercase tracking-widest mb-3 font-bold font-sans text-sm">Technical Layouts</p>
                                <ul class="space-y-2">
                                    <li>• Scaled 2D Interior Floorplan Map</li>
                                    <li>• Functional Furniture Placement Schema</li>
                                    <li>• 1 Dedicated Revision & Feedback Loop</li>
                                </ul>
                            </div>
                        </div>
                        <button onclick="closeModal()" class="w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-300 transition-colors cursor-hover">Close Spec Sheet</button>
                    </div>
                `,
  },
  "tier-pro": {
    subtitle: "INVESTMENT_TIER // LEVEL_02",
    title: "The Pro Tier<br/>Visualisation & DED",
    body: `
                    <div class="border-t border-zinc-800 pt-8 mt-4">
                        <p class="mb-6 leading-relaxed font-medium text-zinc-300">Our core signature offering. Full architectural visualisation down to the millimetre to ensure precision contractor execution.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-zinc-400 mb-8">
                            <div class="p-5 border border-zinc-900 bg-zinc-950">
                                <p class="text-white uppercase tracking-widest mb-3 font-bold font-sans text-sm">3D Visualisation</p>
                                <ul class="space-y-2">
                                    <li>• Real-time Spatial Dimension Modelling</li>
                                    <li>• Premium High-Res 4K Static Renders</li>
                                    <li>• Material Finish & Paint Matching Codes</li>
                                </ul>
                            </div>
                            <div class="p-5 border border-zinc-900 bg-zinc-950">
                                <p class="text-white uppercase tracking-widest mb-3 font-bold font-sans text-sm">Production Specs</p>
                                <ul class="space-y-2">
                                    <li>• Detailed Engineering Drawings (DED) Package</li>
                                    <li>• Detailed Mechanical, Electrical & Plumbing Maps</li>
                                    <li>• Millwork & Joinery Assembly Detailing</li>
                                </ul>
                            </div>
                        </div>
                        <button onclick="closeModal()" class="w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-300 transition-colors cursor-hover">Close Spec Sheet</button>
                    </div>
                `,
  },
  "tier-premium": {
    subtitle: "INVESTMENT_TIER // LEVEL_03",
    title: "The Premium Tier<br/>Turnkey Specifications",
    body: `
                    <div class="border-t border-zinc-800 pt-8 mt-4">
                        <p class="mb-6 leading-relaxed font-medium text-zinc-300">The uncompromised studio experience. Tailored specifically for complex spatial transformations, sourcing curation, and direct fiscal oversight.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-zinc-400 mb-8">
                            <div class="p-5 border border-zinc-900 bg-zinc-950">
                                <p class="text-white uppercase tracking-widest mb-3 font-bold font-sans text-sm">Sourcing & Sizing</p>
                                <ul class="space-y-2">
                                    <li>• Granular Bill of Quantities (BOQ Matrix)</li>
                                    <li>• Physical Sourcing Sample Kit Sourced Internally</li>
                                    <li>• Curated Sourcing Index & Shopping Registry</li>
                                </ul>
                            </div>
                            <div class="p-5 border border-zinc-900 bg-zinc-950">
                                <p class="text-white uppercase tracking-widest mb-3 font-bold font-sans text-sm">Consultation Suite</p>
                                <ul class="space-y-2">
                                    <li>• Contractor Tender Vetting Interview Logs</li>
                                    <li>• Certified SECHA Studio+ Quality Stamp</li>
                                    <li>• Post-construction Final On-site Check</li>
                                </ul>
                            </div>
                        </div>
                        <button onclick="closeModal()" class="w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-300 transition-colors cursor-hover">Close Spec Sheet</button>
                    </div>
                `,
  },
};

// Helper to generate dynamic Technical Specs for each archetype (with British English localization)
function getSpecsModalData(idx) {
  const board = MOODBOARDS[idx];
  return {
    subtitle: `ARCHETYPAL_SPECS // ${board.id.toUpperCase()}`,
    title: `${board.style}<br/>Technical Specifications`,
    body: `
                    <div class="border-t border-zinc-800 pt-8 mt-4 font-mono text-xs">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-zinc-900">
                            <div>
                                <p class="text-zinc-600 uppercase tracking-widest mb-1 font-bold">Structural System</p>
                                <p class="text-zinc-300">${idx === 0 ? "Exposed Cast Brut Concrete columns" : idx === 1 ? "Solid Japanese White Ash frame structure" : idx === 2 ? "Laminated plywood paneling & translucent acrylic spacing" : idx === 3 ? "Clay-Rendered monolithic sandstone blocks" : idx === 4 ? "Mild steel hollow frames with polished Onyx loadbearers" : "Slender low-iron glass sheets with seamless joint bonding"}</p>
                            </div>
                            <div>
                                <p class="text-zinc-600 uppercase tracking-widest mb-1 font-bold">Acoustic Absorption</p>
                                <p class="text-zinc-300">${idx === 0 ? "Concealed fibre NRC 0.85 background panels" : idx === 1 ? "Textured organic wood-wool ceiling systems" : idx === 2 ? "Custom felt sheets behind layout perforations" : idx === 3 ? "High-density dry clay plaster wall coating" : idx === 4 ? "Heavy-weave luxury velvet drapes (NRC 0.90 certified)" : "Integrated micro-perforated sound absorption film sheets"}</p>
                            </div>
                        </div>
                        <div class="mb-6 pb-6 border-b border-zinc-900">
                            <p class="text-zinc-600 uppercase tracking-widest mb-2 font-bold">Archetypal Material Inventory</p>
                            <ul class="space-y-2 text-zinc-300">
                                ${MATERIAL_PALETTES[board.id]
                                  .map(
                                    (mat) => `
                                    <li class="flex items-center justify-between">
                                        <span>✦ ${mat.name} (${mat.type})</span>
                                        <span class="text-zinc-600 font-mono">[R: ${mat.roughness} // M: ${mat.metalness}]</span>
                                    </li>
                                `,
                                  )
                                  .join("")}
                            </ul>
                        </div>
                        <p class="text-xs text-zinc-400">Illustrative concept targets, not measured room performance. Final specifications are confirmed during design.</p><div class="grid grid-cols-3 gap-2">
                            <div class="p-4 bg-zinc-900/50 border border-zinc-800 text-center">
                                <p class="text-[9px] text-zinc-600 uppercase tracking-widest mb-1 font-bold">Luminance Profile</p>
                                <p class="text-white text-[10px] font-bold">${idx === 4 || idx === 0 ? "150-200 LUX" : "350-400 LUX"}</p>
                            </div>
                            <div class="p-4 bg-zinc-900/50 border border-zinc-800 text-center">
                                <p class="text-[9px] text-zinc-600 uppercase tracking-widest mb-1 font-bold">Target Temp</p>
                                <p class="text-white text-[10px] font-bold">22.5°C // RH 55%</p>
                            </div>
                            <div class="p-4 bg-zinc-900/50 border border-zinc-800 text-center">
                                <p class="text-[9px] text-zinc-600 uppercase tracking-widest mb-1 font-bold">Material certification</p>
                                <p class="text-green-500 text-[10px] font-bold font-mono">Confirm with supplier</p>
                            </div>
                        </div>
                    </div>
                `,
  };
}

// --- GSAP & DOM INIT ---
if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  renderMoodboardUI();
  renderFinishingUI();
  renderWalkwayUI();
  initCommerce();
  if (window.THREE) {
    for (const init of [
      initMoodboardStudio,
      initFinishingStudio,
      initWalkwayStudio,
    ]) {
      try {
        init();
      } catch (error) {
        console.warn("Studio unavailable:", error.message);
      }
    }
  }

  window.startStudioMotion = () => {
    if (
      window.gsap &&
      window.ScrollTrigger &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      initAnimations();
    else document.body.classList.add("static-motion");
  };
  if (window.initStudioIntro) window.initStudioIntro();
  else window.startStudioMotion();
});

function initCursor() {}

// 2. GSAP Page Animations
function initAnimations() {
  // Hero Intro
  const tl = gsap.timeline();
  tl.to("#navbar", { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
    .to(
      ".hero-text-inner",
      { y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
      "-=0.5",
    )
    .to("#hero-sub", { opacity: 1, duration: 1 }, "-=0.2")
    .to("#hero-dec-1, #hero-dec-2", { opacity: 1, duration: 1 }, "-=0.5");

  // Hero Parallax Scroll
  gsap.to("#hero-content", {
    y: 300,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Reveal Items (Bento, Text)
  gsap.utils.toArray(".reveal-item").forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
      },
    });
  });
}

// --- THREE.JS SCENE 1: MOODBOARD CAROUSEL ---
function initMoodboardStudio() {
  const container = document.getElementById("moodboard-canvas");
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.02);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 2, 15);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const spotLight = new THREE.SpotLight(0xffffff, 5);
  spotLight.position.set(0, 15, 10);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.5;
  scene.add(spotLight);

  const rectLight = new THREE.RectAreaLight(0xffffff, 2, 10, 10);
  rectLight.position.set(0, 5, -5);
  rectLight.lookAt(0, 0, 0);
  scene.add(rectLight);

  // Grid
  const gridHelper = new THREE.GridHelper(100, 100, 0x333333, 0x111111);
  gridHelper.position.y = -2;
  scene.add(gridHelper);

  // Objects
  const objects = [];
  const spacing = 12;

  MOODBOARDS.forEach((board, i) => {
    let geometry;
    switch (board.geo) {
      case "box":
        geometry = new THREE.BoxGeometry(3, 3, 3);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(2, 64, 64);
        break;
      case "octahedron":
        geometry = new THREE.OctahedronGeometry(2.5, 0);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(1.5, 0.6, 16, 100);
        break;
      case "icosahedron":
        geometry = new THREE.IcosahedronGeometry(2.2, 0);
        break;
    }

    const material = new THREE.MeshStandardMaterial({
      color: board.color,
      roughness: board.roughness,
      metalness: board.metalness,
      transparent: board.transparent || false,
      opacity: board.opacity || 1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * spacing;

    // Wireframe Tech Overlay
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
      }),
    );
    mesh.add(line);

    scene.add(mesh);
    objects.push(mesh);
  });

  // Animation Loop variables
  let targetCameraX = 0;
  let mouseX = 0;
  let mouseY = 0;

  // Expose target setter
  setMoodboardCameraTarget = (idx) => {
    targetCameraX = idx * spacing;
  };

  // Mouse and touch tracking compatibility
  const trackMove = (x, y) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((x - rect.left) / rect.width) * 2 - 1;
    mouseY = -((y - rect.top) / rect.height) * 2 + 1;
  };

  container.addEventListener("mousemove", (e) =>
    trackMove(e.clientX, e.clientY),
  );
  container.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 0)
        trackMove(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true },
  );

  const clock = new THREE.Clock();

  const shouldRender = createRenderGate(container);
  function animate() {
    requestAnimationFrame(animate);
    if (!shouldRender()) return;
    const time = clock.getElapsedTime();

    // Camera interpolation
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetCameraX + mouseX * 2,
      0.05,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      2 + mouseY * 2,
      0.05,
    );

    spotLight.position.x = camera.position.x;
    spotLight.target.position.x = targetCameraX;
    spotLight.target.updateMatrixWorld();

    // Object subtle animations
    objects.forEach((obj, idx) => {
      obj.rotation.y += 0.005;
      obj.rotation.x = Math.sin(time * 0.5 + idx) * 0.2;
      obj.position.y = Math.sin(time + idx) * 0.5;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// --- DOM RENDER LOGIC ---

function renderMoodboardUI() {
  const nav = document.getElementById("moodboard-nav");
  const details = document.getElementById("moodboard-details");
  const b = MOODBOARDS[activeMoodboardIdx];

  // Render Nav
  nav.innerHTML = MOODBOARDS.map(
    (board, idx) => `
                <button onclick="changeMoodboard(${idx})" class="text-left p-3 md:p-4 border transition-all uppercase tracking-widest text-[10px] md:text-sm font-bold flex justify-between items-center cursor-hover shrink-0 md:shrink ${activeMoodboardIdx === idx ? "border-white bg-white text-black pl-5 md:pl-6" : "border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white"}">
                    <span>${String(idx + 1).padStart(2, "0")} // ${board.name}</span>
                    ${activeMoodboardIdx === idx ? '<span class="animate-pulse ml-2">●</span>' : ""}
                </button>
            `,
  ).join("");

  // Render Details
  details.innerHTML = `
                <div class="absolute -right-12 -top-12 text-[80px] md:text-[120px] font-black text-zinc-900 leading-none opacity-50 select-none pointer-events-none">
                    ${String(activeMoodboardIdx + 1).padStart(2, "0")}
                </div>
                <p class="text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1 md:mb-2 relative z-10">${b.name}</p>
                <h4 class="text-xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4 md:mb-6 relative z-10 leading-none">${b.style}</h4>
                <p class="text-xs md:text-base text-zinc-400 font-medium max-w-lg leading-relaxed relative z-10">${b.desc}</p>
                <div class="mt-6 md:mt-8 flex flex-wrap gap-3 relative z-10">
                    <button onclick="enterShowroom(${activeMoodboardIdx})" class="px-5 py-3 bg-white text-black text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-hover">Enter Showroom</button>
                    <button onclick="openModal('specs-${activeMoodboardIdx}')" class="px-5 py-3 border border-zinc-700 text-zinc-300 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white transition-colors cursor-hover">Concept Notes</button>
                </div>
            `;

  // GSAP pop animation
  if (window.gsap)
    gsap.fromTo(
      details,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
    );
}

function changeMoodboard(idx) {
  activeMoodboardIdx = idx;
  if (setMoodboardCameraTarget) setMoodboardCameraTarget(idx);
  renderMoodboardUI();

  // Update custom cursor targeting for new buttons
  setTimeout(initCursor, 50);
}

function enterShowroom(idx) {
  activeFinishingIdx = idx;
  const b = MOODBOARDS[activeFinishingIdx];

  // Check if material from this board is already in cart, if so, select it
  const cartItem = cart.find((i) => i.boardId === b.id);
  activeMaterial = cartItem ? cartItem.material : MATERIAL_PALETTES[b.id][0];

  roomConfig.palette = AMBIANCE_PALETTES[idx];
  if (refreshInterior) refreshInterior();
  renderFinishingUI();
  if (updateVignetteMaterial) updateVignetteMaterial(activeMaterial);

  document
    .getElementById("finishing-studio")
    .scrollIntoView({ behavior: "smooth" });
}

function renderFinishingUI() {
  const tabs = document.getElementById("archetype-tabs");
  const list = document.getElementById("material-list");
  const b = MOODBOARDS[activeFinishingIdx];
  const palette = MATERIAL_PALETTES[b.id];

  document.getElementById("vignette-subtitle").innerText = b.name;
  document.getElementById("vignette-title").innerText = b.style;

  // Render Tabs
  tabs.innerHTML = MOODBOARDS.map((board, idx) => {
    const inCart = cart.some((item) => item.boardId === board.id);
    return `
                <button onclick="enterShowroom(${idx})" class="px-3 py-1.5 md:px-4 md:py-2 border text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all relative cursor-hover ${activeFinishingIdx === idx ? "border-white bg-white text-black" : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"}">
                    ${board.name}
                    ${inCart ? `<span class="ml-1.5 ${activeFinishingIdx === idx ? "text-zinc-600" : "text-white"}">✓</span>` : ""}
                </button>`;
  }).join("");

  // Render Material List
  list.innerHTML = palette
    .map(
      (mat) => `
                <button aria-pressed="${activeMaterial.id === mat.id}" onclick="selectMaterial('${mat.id}')" class="p-4 md:p-5 border text-left transition-all group flex justify-between items-center cursor-hover ${activeMaterial.id === mat.id ? "border-white bg-zinc-900" : "border-zinc-800 hover:border-zinc-500"}">
                    <div>
                        <h4 class="text-sm md:text-lg font-bold uppercase tracking-widest ${activeMaterial.id === mat.id ? "text-white" : "text-zinc-400 group-hover:text-white"}">${mat.name}</h4>
                        <p class="text-[9px] md:text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">${mat.type}</p>
                    </div>
                    <div class="w-6 h-6 md:w-8 md:h-8 rounded-full border border-zinc-700 shrink-0 ml-4" style="background-color: #${mat.color.toString(16).padStart(6, "0")}"></div>
                </button>
            `,
    )
    .join("");

  const btn = document.getElementById("btn-add-cart");
  btn.innerText = `Add sample · Rp150.000`;

  setTimeout(initCursor, 50);
}

function selectMaterial(matId) {
  const b = MOODBOARDS[activeFinishingIdx];
  activeMaterial = MATERIAL_PALETTES[b.id].find((m) => m.id === matId);
  renderFinishingUI();
  if (updateVignetteMaterial) updateVignetteMaterial(activeMaterial);
}
