/* -----------------------------------------------------------
   NAVIGATION
   Sticky header border-on-scroll state, and the full-screen
   mobile menu open/close behaviour.
----------------------------------------------------------- */

export function initNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const dropdowns = document.querySelectorAll(".nav-item--dropdown, .mobile-menu-item--dropdown");

  if (header) {
    const setScrolled = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });
  }

  const closeDropdown = (item) => {
    item.classList.remove("is-open");
    const trigger = item.querySelector("button");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  };

  const closeAllDropdowns = (except) => {
    dropdowns.forEach((item) => {
      if (item !== except) closeDropdown(item);
    });
  };

  dropdowns.forEach((item) => {
    const trigger = item.querySelector("button");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = item.classList.contains("is-open");
      closeAllDropdowns(item);
      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown(item);
        trigger.focus();
      }
    });
  });

  document.addEventListener("click", (event) => {
    dropdowns.forEach((item) => {
      if (!item.contains(event.target)) closeDropdown(item);
    });
  });

  document.addEventListener(
    "focusin",
    (event) => {
      dropdowns.forEach((item) => {
        if (!item.contains(event.target)) closeDropdown(item);
      });
    },
    true
  );

  if (toggle && mobileMenu) {
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      closeAllDropdowns();
    };

    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      mobileMenu.classList.add("is-open");
      document.body.classList.add("menu-open");
      const firstLink = mobileMenu.querySelector("a");
      if (firstLink) firstLink.focus();
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }
}
