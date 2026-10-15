const PROJECT_STEPS = [
  {
    title: "Getting to know you",
    tag: "LISTEN / ALIGN",
    heading: "Your life is the brief.",
    copy: "We begin with your routines, the way you use your space, and what you want to change. Together, we define the priorities, budget and scope.",
    deliverable: "An agreed brief & project direction",
    image: "assets/interior-living.jpg",
    alt: "A warm living space with natural materials",
    note: "01 / A conversation, before a concept.",
  },
  {
    title: "Finding the direction",
    tag: "EXPLORE / PLAN",
    heading: "Give your ideas a direction.",
    copy: "Moodboards and 2D layouts connect the feeling of the room with how it needs to function. Explore the playground, then review the direction with your designer.",
    deliverable: "Moodboards & spatial layouts",
    image: "assets/design-lite-service.png",
    alt: "Illustrative design concept and material moodboard",
    note: "02 / A feeling becomes a plan.",
  },
  {
    title: "Seeing the space",
    tag: "VISUALISE / REFINE",
    heading: "See it before it takes shape.",
    copy: "3D views help you review proportions, finishes and lighting. We refine the proposal with your feedback before moving into the technical detail.",
    deliverable: "3D visualisations & design review",
    image: "assets/design-pro-service.png",
    alt: "Illustrative floor plan and 3D design presentation",
    note: "03 / Refine the details together.",
  },
  {
    title: "Drawing the details",
    tag: "DETAIL / SPECIFY",
    heading: "A clear plan for the people who build.",
    copy: "For the agreed design package, we document the drawings and specifications your team needs. Scope, finish samples and project-specific details are confirmed together.",
    deliverable: "Drawings & specifications for the chosen package",
    image: "assets/design-premium-service.png",
    alt: "Illustrative detailed drawings and a scale model",
    note: "04 / From design intention to build detail.",
  },
  {
    title: "Making it happen",
    tag: "COORDINATE / HAND OVER",
    heading: "Bring the vision into everyday life.",
    copy: "Take the agreed plans to your builder, or discuss SECHA’s furniture and modular production. Final pricing, production and installation are confirmed for your project.",
    deliverable: "A coordinated handover & confirmed next steps",
    image: "assets/modular-living-concept.png",
    alt: "Illustrative modular living room concept",
    note: "05 / The beginning of life in your space.",
  },
];
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".process-steps"),
    panel = document.getElementById("process-detail");
  nav.innerHTML = PROJECT_STEPS.map(
    (s, i) =>
      `<button aria-pressed="${i === 0}" data-process="${i}"><span>${String(i + 1).padStart(2, "0")}</span><strong>${s.title}</strong><i aria-hidden="true">↗</i></button>`,
  ).join("");
  function select(index) {
    const s = PROJECT_STEPS[index];
    [...nav.children].forEach((b, i) =>
      b.setAttribute("aria-pressed", i === index),
    );
    panel.innerHTML = `<figure><img src="${s.image}" alt="${s.alt}" width="1536" height="1024"><figcaption>${s.note}</figcaption></figure><div><p class="eyebrow">${s.tag}</p><h3>${s.heading}</h3><p>${s.copy}</p><span class="process-deliverable"><small>WHAT YOU LEAVE WITH</small>${s.deliverable}</span></div>`;
  }
  nav.addEventListener("click", (e) => {
    const b = e.target.closest("[data-process]");
    if (b) select(Number(b.dataset.process));
  });
  nav.addEventListener("keydown", (e) => {
    const current = Number(e.target.dataset.process);
    if (!Number.isInteger(current)) return;
    let next;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = (current + 1) % 5;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (current + 4) % 5;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 4;
    if (next !== undefined) {
      e.preventDefault();
      nav.children[next].focus();
      select(next);
    }
  });
  select(0);
});
