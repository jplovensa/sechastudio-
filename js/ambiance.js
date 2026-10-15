/* Compare the same furnished room in a neutral scheme and a chosen SECHA direction. */
const { AMBIANCE_PALETTES } = window.SECHA_DESIGN_OPTIONS;
let walkwayStep = 1;
let ambianceConfig = {
  room: "living",
  width: 4,
  depth: 4,
  modules: 3,
  light: "day",
};
let comparisonSplit = 50,
  ambiancePreview = null;
function initWalkwayStudio() {
  ambiancePreview = createInteriorPreview(
    document.getElementById("walkway-canvas"),
    {
      getConfig: () => ({
        ...ambianceConfig,
        palette: AMBIANCE_PALETTES[walkwayStep],
      }),
      getMaterial: () => MATERIAL_PALETTES[MOODBOARDS[walkwayStep].id][0],
      getComparison: () => comparisonSplit,
    },
  );
}
function renderWalkwayUI() {
  document.querySelectorAll("[data-ambiance-room]").forEach((button) =>
    button.addEventListener("click", () => {
      ambianceConfig.room = button.dataset.ambianceRoom;
      updateAmbiance();
    }),
  );
  document.querySelectorAll("[data-ambiance-light]").forEach((button) =>
    button.addEventListener("click", () => {
      ambianceConfig.light = button.dataset.ambianceLight;
      updateAmbiance();
    }),
  );
  document
    .getElementById("ambiance-compare")
    .addEventListener("input", (event) => {
      comparisonSplit = Number(event.target.value);
      updateComparison();
    });
  document.getElementById("ambiance-reset").addEventListener("click", () => {
    walkwayStep = 1;
    ambianceConfig = {
      room: "living",
      width: 4,
      depth: 4,
      modules: 3,
      light: "day",
    };
    comparisonSplit = 50;
    updateAmbiance();
  });
  updateAmbiance();
}
function updateComparison() {
  document.getElementById("ambiance-compare").value = comparisonSplit;
  document.getElementById("comparison-divider").style.left =
    comparisonSplit + "%";
  document.getElementById("comparison-divider").hidden =
    comparisonSplit === 0 || comparisonSplit === 100;
  document.getElementById("comparison-value").textContent =
    `${comparisonSplit}% neutral / ${100 - comparisonSplit}% styled`;
  document.getElementById("ambiance-reference-label").hidden =
    comparisonSplit < 18;
  document.getElementById("ambiance-style-label").hidden = comparisonSplit > 82;
}
function updateAmbiance() {
  const board = MOODBOARDS[walkwayStep],
    palette = AMBIANCE_PALETTES[walkwayStep];
  document
    .querySelectorAll("[data-ambiance-room]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.ambianceRoom === ambianceConfig.room),
      ),
    );
  document
    .querySelectorAll("[data-ambiance-light]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.ambianceLight === ambianceConfig.light),
      ),
    );
  document.getElementById("ambiance-style-label").textContent =
    `${palette.short} / ${ambianceConfig.light === "day" ? "daylight" : "evening"}`;
  document.getElementById("ambiance-palette").innerHTML =
    `<p>Wall / floor / accent</p><div class="ambiance-swatches">${palette.swatches.map((color, i) => `<span class="ambiance-swatch" style="background-color:${color}" role="img" aria-label="${["Wall", "Floor", "Accent"][i]} colour ${color}"></span>`).join("")}</div>`;
  document.getElementById("walkway-tryon-specs").innerHTML =
    `<h3>${board.style}</h3><p>${palette.words}</p><p class="ambiance-changes">What changes: wall tone, floor tone, upholstery, accent finish and lighting. Room layout stays the same for a fair comparison.</p>`;
  const fallback = document.getElementById("ambiance-fallback-image");
  if (fallback)
    fallback.src = {
      living: "assets/interior-living.jpg",
      work: "assets/modular-work.jpg",
      bedroom: "assets/modular-rest.jpg",
    }[ambianceConfig.room];
  renderWalkwayTryOnGrid();
  updateComparison();
  if (ambiancePreview) {
    ambiancePreview.setMaterial(MATERIAL_PALETTES[board.id][0]);
    ambiancePreview.refresh();
  }
}
function renderWalkwayTryOnGrid() {
  document.getElementById("walkway-tryon-grid").innerHTML = MOODBOARDS.map(
    (board, i) =>
      `<button onclick="tryOnStyle(${i})" aria-pressed="${walkwayStep === i}"><span>${AMBIANCE_PALETTES[i].short}</span><small>${board.style}</small></button>`,
  ).join("");
}
function tryOnStyle(index) {
  if (!MOODBOARDS[index]) return;
  walkwayStep = index;
  updateAmbiance();
}
function allocateActiveStyle() {
  Object.assign(roomConfig, {
    room: ambianceConfig.room,
    light: ambianceConfig.light,
    palette: AMBIANCE_PALETTES[walkwayStep],
  });
  updateRoomControls();
  if (refreshInterior) refreshInterior();
  enterShowroom(walkwayStep);
  toast(
    `${MOODBOARDS[walkwayStep].style} selected for your ${ambianceConfig.room === "work" ? "home office" : ambianceConfig.room}.`,
  );
}
