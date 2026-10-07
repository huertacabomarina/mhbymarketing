/* -----------------------------------------------------------
   MAIN
   Entry point. Keeps behaviour split into small modules so
   each page only pays for what it uses.
----------------------------------------------------------- */

import { initNavigation } from "./navigation.js";
import { initAnimations, initHeroTypewriter } from "./animations.js";
import { initContactForm } from "./form.js";
import { initCarousel } from "./carousel.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initAnimations();
  initHeroTypewriter();
  initContactForm();
  initCarousel();
});
