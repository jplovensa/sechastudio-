// Play on every full page load, including refresh. Never gate access on media success.
window.initStudioIntro = function () {
  const panel = document.getElementById("studio-intro"),
    video = document.getElementById("studio-intro-video"),
    skip = document.getElementById("intro-skip");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.startStudioMotion();
    return;
  }
  const previous = document.activeElement,
    siblings = [...document.body.children].filter(
      (el) => el !== panel && el.tagName !== "SCRIPT",
    );
  const inertStates = siblings.map((el) => el.inert);
  let finished = false,
    timer;
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    video.pause();
    panel.hidden = true;
    document.body.classList.remove("intro-open");
    siblings.forEach((el, i) => (el.inert = inertStates[i]));
    document.removeEventListener("keydown", onKey);
    if (previous?.isConnected) previous.focus({ preventScroll: true });
    window.startStudioMotion();
  }
  function onKey(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      finish();
    }
    if (event.key === "Tab") {
      event.preventDefault();
      skip.focus();
    }
  }
  siblings.forEach((el) => (el.inert = true));
  panel.hidden = false;
  document.body.classList.add("intro-open");
  skip.focus({ preventScroll: true });
  skip.addEventListener("click", finish, { once: true });
  document.addEventListener("keydown", onKey);
  video.addEventListener("ended", finish, { once: true });
  video.addEventListener("error", finish, { once: true });
  timer = setTimeout(finish, 6500);
  video.src = "assets/films/studio-plus-intro.mp4";
  video.currentTime = 0;
  video.play().catch(finish);
};
