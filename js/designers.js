// Direction cards translate the supplied team narratives into room palettes.
const DESIGNER_DIRECTIONS = {
  josephine: {
    name: "Josephine",
    role: "Founder & CEO",
    title: "Purpose before everything.",
    direction:
      "Start with the life the room needs to support. Josephine’s direction connects daily routines, thoughtful planning and a coherent finish palette, keeping every decision tied to your brief.",
    style: "Considered living",
    palette: 3,
    tones: ["#79634b", "#c9b494", "#ebe4d7"],
    materials: "Warm timber · earthy surfaces · soft textiles",
    principles: [
      "Plan around daily life",
      "Give each element a purpose",
      "Carry the concept through to the finish",
    ],
  },
  daffa: {
    name: "Daffa",
    role: "Architect of form",
    title: "Clarity in every line.",
    direction:
      "Daffa’s direction explores proportion, quiet geometry and visual restraint. Clean alignments and a controlled material palette give the room breathing space.",
    style: "Quiet geometry",
    palette: 0,
    tones: ["#262626", "#77716a", "#ddd7cc"],
    materials: "Charcoal · mineral textures · precise joinery",
    principles: [
      "Keep the geometry clear",
      "Reduce visual noise",
      "Balance light and dark",
    ],
  },
  audina: {
    name: "Audina",
    role: "The soul of space",
    title: "A room that feels like you.",
    direction:
      "Audina’s direction begins with the small rituals of home. Warm natural materials, soft transitions and comfortable places to pause bring a personal rhythm to the layout.",
    style: "Warm everyday rituals",
    palette: 1,
    tones: ["#d8c8ad", "#a58a64", "#f0ebe2"],
    materials: "Natural oak · warm neutrals · tactile fabrics",
    principles: [
      "Design for everyday rituals",
      "Create places to gather",
      "Make comfort part of the layout",
    ],
  },
};
function getDesignerModalData(id) {
  const d = DESIGNER_DIRECTIONS[id];
  if (!d) return;
  return {
    subtitle: `SIGNATURE DESIGNER / ${d.role}`,
    title: d.name,
    body: `<div class="direction-layout"><img class="direction-portrait" src="assets/designers/${id}.png" alt="${d.name}" /><div class="direction-copy"><h3>${d.title}</h3><p>${d.direction}</p><ul>${d.principles.map((p) => `<li>${p}</li>`).join("")}</ul><div class="direction-style"><small>STYLE CARD / SUGGESTED STARTING POINT</small><h4>${d.style}</h4><div class="direction-swatches">${d.tones.map((t, i) => `<span style="background:${t}" aria-label="Palette colour ${i + 1}: ${t}" role="img"></span>`).join("")}</div><p>${d.materials}</p></div><button class="secha-button" onclick="tryDesignerDirection('${id}')">Try this direction in your room</button><p class="direction-note">A starting point for your brief. Your designer tailors the final palette to your space.</p></div></div>`,
  };
}
function tryDesignerDirection(id) {
  const d = DESIGNER_DIRECTIONS[id];
  if (!d) return;
  closeModal();
  tryOnStyle(d.palette);
  document
    .getElementById("style-walkway")
    .scrollIntoView({ behavior: "instant" });
  const target = document.getElementById("walkway-tryon-grid");
  const button = target?.querySelector("button");
  if (button) button.focus({ preventScroll: true });
}
