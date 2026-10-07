(function () {
  var STORAGE_KEY = "consentChoice"; // "granted" | "denied"
  var stored = localStorage.getItem(STORAGE_KEY);

  function setFloatingHidden(hide) {
    document.body.classList.toggle("consent-open", hide);
  }

  if (stored === "granted") {
    if (typeof gtag === "function") {
      gtag("consent", "update", { analytics_storage: "granted" });
    }
    return;
  }

  if (stored === "denied") {
    return;
  }

  var banner = document.getElementById("consent-banner");
  if (!banner) return;

  banner.hidden = false;
  setFloatingHidden(true);

  var acceptBtn = document.getElementById("consent-accept");
  var declineBtn = document.getElementById("consent-decline");

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem(STORAGE_KEY, "granted");
      if (typeof gtag === "function") {
        gtag("consent", "update", { analytics_storage: "granted" });
      }
      banner.hidden = true;
      setFloatingHidden(false);
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      localStorage.setItem(STORAGE_KEY, "denied");
      banner.hidden = true;
      setFloatingHidden(false);
    });
  }
})();
