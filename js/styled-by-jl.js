/* The JL edit: discover materials without changing the shared catalogue. */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("styled-by-jl");
  if (!section) return;
  const materials = {
    linen: {
      number: "01 / THE SOFT LAYER",
      name: "Oatmeal linen",
      description: "An open weave with a soft, imperfect rhythm. The quiet layer that takes the edge off stone and timber.",
      feel: "Dry, woven, naturally soft",
      use: "Sofas, cushions & curtains",
      finish: "Matte / natural weave",
      position: "17% 9%",
    },
    oak: {
      number: "02 / THE GROUNDING ELEMENT",
      name: "Smoked oak",
      description: "Deep grain and a warm, smoky tone. Timber brings a sense of permanence to the lighter, softer layers.",
      feel: "Warm, grained, grounded",
      use: "Joinery, shelving & wall details",
      finish: "Low sheen / visible grain",
      position: "80% 9%",
    },
    travertine: {
      number: "03 / THE NATURAL CONTRAST",
      name: "Honed travertine",
      description: "Open pores, softened edges and a sandy warmth. Stone adds weight and texture without feeling cold.",
      feel: "Mineral, porous, gently uneven",
      use: "Coffee tables & sculptural accents",
      finish: "Honed / natural variation",
      position: "17% 86%",
    },
    velvet: {
      number: "04 / THE UNEXPECTED ACCENT",
      name: "Oxblood velvet",
      description: "A rich wine tone with a light-catching nap. One expressive accent brings depth to an otherwise quiet palette.",
      feel: "Plush, directional, enveloping",
      use: "A lounge chair or accent cushion",
      finish: "Soft sheen / deep pile",
      position: "87% 87%",
    },
    bronze: {
      number: "05 / THE FINISHING NOTE",
      name: "Aged bronze",
      description: "A restrained metallic glint with a softened patina. A small detail that connects warm timber, stone and light.",
      feel: "Smooth, cool, subtly reflective",
      use: "Lighting, handles & small objects",
      finish: "Brushed / aged patina",
      position: "53% 46%",
    },
  };
  const get = (id) => document.getElementById(id);
  section.querySelectorAll("[data-jl-material]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.jlMaterial;
      const material = materials[id];
      section.querySelectorAll("[data-jl-material]").forEach((other) => {
        other.setAttribute("aria-pressed", String(other.dataset.jlMaterial === id));
      });
      for (const field of ["number", "name", "description", "feel", "use", "finish"]) {
        get(`jl-material-${field}`).textContent = material[field];
      }
      get("jl-material-texture").style.setProperty("--texture-position", material.position);
      get("jl-material-texture").setAttribute("aria-label", `Close texture study of ${material.name.toLowerCase()}`);
    });
  });
  const dialog = get("jl-piece-dialog");
  const opener = get("jl-open-piece");
  opener.addEventListener("click", () => {
    document.body.classList.add("jl-piece-open");
    dialog.showModal();
    dialog.scrollTop = 0;
  });
  get("jl-close-piece").addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button, a[href]")].filter(
      (control) => !control.disabled && control.getClientRects().length,
    );
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("jl-piece-open");
    opener.focus({ preventScroll: true });
  });
});
