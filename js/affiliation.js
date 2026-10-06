// Pause this material study outside the viewport, in a hidden tab, or on request.
document.addEventListener("DOMContentLoaded", () => {
  const figure = document.querySelector(".affiliation-motion");
  if (!figure) return;
  const toggle = figure.querySelector(".material-motion-toggle");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false,
    userPaused = false;
  function update() {
    const paused =
      userPaused || !visible || document.hidden || preference.matches;
    figure.classList.toggle("motion-paused", paused);
    toggle.hidden = preference.matches;
    toggle.textContent = userPaused ? "Play motion" : "Pause motion";
    toggle.setAttribute("aria-pressed", String(userPaused));
  }
  toggle.addEventListener("click", () => {
    userPaused = !userPaused;
    update();
  });
  document.addEventListener("visibilitychange", update);
  preference.addEventListener("change", update);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        update();
      },
      { threshold: 0.15 },
    ).observe(figure);
  } else {
    visible = true;
  }
  update();
});
