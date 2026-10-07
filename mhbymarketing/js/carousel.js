/* -----------------------------------------------------------
   CAROUSEL
   Auto-advancing crossfade for [data-carousel] image stacks.
   No-ops on pages that don't have one.
----------------------------------------------------------- */

const INTERVAL_MS = 4000;

export function initCarousel() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const slides = carousel.querySelectorAll("img");
    if (slides.length < 2) return;

    const interval = parseInt(carousel.dataset.carousel, 10) || INTERVAL_MS;
    let current = 0;

    window.setInterval(() => {
      slides[current].classList.remove("is-active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("is-active");
    }, interval);
  });
}
