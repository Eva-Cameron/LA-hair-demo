/**
 * One motion system for the whole site.
 *  data-reveal="fade" | "clip" | "lines"   reveal once when scrolled into view
 *  data-hero                               reveal on load instead (the entrance sequence)
 *  data-delay="240"                        ms before this element starts
 *  data-parallax="0.06"                    drift by a share of the viewport, desktop only
 * Everything is visible without this script (see Base.astro); it only opts content into motion.
 */
declare global { interface Window { __motion?: boolean } }
window.__motion = true;

const root = document.documentElement;
const motion = root.classList.contains("motion");
const reveal = (el: Element) => el.classList.add("is-in");

document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
  if (el.dataset.delay) el.style.setProperty("--d", `${el.dataset.delay}ms`);
  el.querySelectorAll<HTMLElement>(".line > span").forEach((s, i) => s.style.setProperty("--i", String(i)));
});

if (motion) {
  // Entrance: two frames so the hidden state paints first, then the sequence runs.
  requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll("[data-hero]").forEach(reveal)));

  // A fully clipped element counts as invisible to IntersectionObserver, so clip reveals watch their container.
  const watched = new Map<Element, Element>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { reveal(watched.get(e.target)!); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-hero])").forEach((el) => {
    const target = el.dataset.reveal === "clip" && el.parentElement ? el.parentElement : el;
    watched.set(target, el);
    io.observe(target);
  });

  // Gentle parallax on a few large images, only with a fine pointer and room to breathe.
  const drift = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
  const wide = matchMedia("(min-width: 64rem) and (pointer: fine)");
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    for (const el of drift) {
      if (!wide.matches) { el.style.transform = ""; continue; }
      const r = el.parentElement!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 across the screen
      el.style.transform = `translate3d(0, ${(progress * Number(el.dataset.parallax) * vh).toFixed(1)}px, 0) scale(1.08)`;
    }
  };
  if (drift.length) {
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    wide.addEventListener("change", update);
    update();
  }
} else {
  document.querySelectorAll("[data-reveal]").forEach(reveal);
}

export {};
