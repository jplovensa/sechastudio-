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
const { MOODBOARDS, MATERIAL_PALETTES } = window.SECHA_DESIGN_OPTIONS;

// --- GLOBAL STATE ---
let activeMoodboardIdx = 0;
let activeFinishingIdx = 0;
let activeMaterial = MATERIAL_PALETTES.architect[0];
let cart = [];
let isCartOpen = false;

// Globals for 3D Communication
let setMoodboardCameraTarget = null;
let updateVignetteMaterial = null;
let roomConfig = {
  room: "living",
  width: 4,
  depth: 4,
  modules: 3,
  light: "day",
};
let refreshInterior = null;

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
  initCommerce();
  if (window.THREE) {
    for (const init of [initMoodboardStudio]) {
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
