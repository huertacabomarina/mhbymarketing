/* -----------------------------------------------------------
   CONSENT
   Cookie banner for Google Analytics, basic Consent Mode:
   gtag.js is only loaded after the visitor accepts.
   - Accept  -> saved as "granted"; window.loadGoogleAnalytics()
                (defined in the inline tag in <head>) loads GA.
   - Decline -> saved as "denied"; nothing from Google is loaded.
   - A returning visitor who accepted gets GA straight from the
     <head> tag; one who chose either option doesn't see the
     banner again.
   - Any [data-consent-open] element (the footer's "Cookie
     settings") reopens the banner so the choice can be changed.
     Switching to Decline after accepting revokes consent and
     removes the _ga cookies GA set.
----------------------------------------------------------- */
(function () {
  var STORAGE_KEY = "consentChoice"; // "granted" | "denied"

  var banner = document.getElementById("consent-banner");
  var acceptBtn = document.getElementById("consent-accept");
  var declineBtn = document.getElementById("consent-decline");

  // localStorage can throw (blocked storage, some private modes):
  // the banner must still work, the choice just won't be remembered.
  function readChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function loadAnalytics() {
    if (typeof window.loadGoogleAnalytics === "function") {
      window.loadGoogleAnalytics();
    }
  }

  function removeAnalyticsCookies() {
    var host = window.location.hostname;
    var domains = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    document.cookie.split(";").forEach(function (cookie) {
      var name = cookie.split("=")[0].trim();
      if (name !== "_ga" && name.indexOf("_ga_") !== 0) return;
      domains.forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; path=/" + (domain ? "; domain=" + domain : "");
      });
    });
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
    document.body.classList.add("consent-open");
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    document.body.classList.remove("consent-open");
  }

  if (readChoice() === "granted") {
    loadAnalytics(); // fallback; the <head> tag normally did this already
  } else if (readChoice() !== "denied") {
    showBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      saveChoice("granted");
      loadAnalytics();
      hideBanner();
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      saveChoice("denied");
      if (window.gaLoaded && typeof gtag === "function") {
        gtag("consent", "update", { analytics_storage: "denied" });
      }
      removeAnalyticsCookies();
      hideBanner();
    });
  }

  document.querySelectorAll("[data-consent-open]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      showBanner();
      if (acceptBtn) acceptBtn.focus();
    });
  });
})();
