/* -----------------------------------------------------------
   ANIMATIONS
   Two reveal patterns, both fading and lifting elements into
   place once, the first time they enter the viewport:

   1. [data-reveal] — block-level, marked by hand in the HTML.
      Used for images, lists, and other non-text groups.

   2. .reveal-text — applied automatically here to every heading
      and paragraph inside <main> that isn't already covered by a
      [data-reveal] ancestor. This is what gives every page's text
      a consistent fade-in-on-scroll without editing markup by
      hand on every page. The homepage hero is also excluded: it
      gets its own pure-CSS entrance animation (see .hero rules in
      pages.css) that plays on load rather than on scroll.

   Nothing more elaborate than that — quiet confidence, not a
   showreel.
----------------------------------------------------------- */

export function initAnimations() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const blockTargets = Array.from(document.querySelectorAll("[data-reveal]"));

  const textTargets = Array.from(
    document.querySelectorAll("main h1, main h2, main h3, main p")
  ).filter((el) => !el.closest("[data-reveal], .hero"));

  textTargets.forEach((el) => el.classList.add("reveal-text"));

  const targets = [...blockTargets, ...textTargets];
  if (!targets.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* Homepage hero headline: splits the text into one <span> per
   character so it can type itself out on load, each letter
   staggered a beat after the last. The original string is kept as
   an aria-label on the heading (screen readers get the plain
   sentence, once) and the split spans are aria-hidden, so nothing
   is lost for assistive tech. Skipped entirely under
   prefers-reduced-motion, which leaves the plain text in place. */
export function initHeroTypewriter() {
  const heading = document.querySelector(".hero h1");
  if (!heading) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const text = heading.textContent.trim();
  const startDelay = 0.15;
  const step = 0.026;

  heading.setAttribute("aria-label", text);
  heading.textContent = "";

  const chars = document.createElement("span");
  chars.className = "hero-title-chars";
  chars.setAttribute("aria-hidden", "true");

  Array.from(text).forEach((char, i) => {
    if (char === " ") {
      chars.appendChild(document.createTextNode(" "));
      return;
    }
    const span = document.createElement("span");
    span.className = "hero-title-char";
    span.textContent = char;
    span.style.animationDelay = `${startDelay + i * step}s`;
    chars.appendChild(span);
  });

  const caret = document.createElement("span");
  caret.className = "hero-title-caret";
  caret.style.animationDelay = `${startDelay}s`;
  chars.appendChild(caret);

  heading.appendChild(chars);

  const typingDuration = startDelay + text.length * step;
  window.setTimeout(() => {
    caret.classList.add("is-done");
  }, (typingDuration + 0.4) * 1000);
}