/* =========================================================
   MH by Marketing — GA4 lead tracking
   Eventos: generate_lead, book_call, book_call_click,
            whatsapp_click, email_click
   Requiere que la etiqueta de Google Analytics (gtag.js)
   esté instalada en el <head> de cada página.
   ========================================================= */
(function () {
  function track(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, Object.assign({
        page_path: window.location.pathname
      }, params || {}));
    }
  }

  // Disponible por si tu formulario confirma el envío con JavaScript:
  // llama a window.trackLead() cuando el envío haya ido bien.
  window.trackLead = function (formName) {
    track("generate_lead", { form_name: formName || "contact" });
  };

  // 1) Clics en email, WhatsApp y enlaces de reserva
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";

    if (href.indexOf("mailto:") === 0) {
      track("email_click", { link_url: href });
    } else if (/wa\.me|whatsapp\.com/i.test(href)) {
      track("whatsapp_click", { link_url: href });
    } else if (/calendar\.app\.google|calendar\.google\.com|calendly\.com|cal\.com/i.test(href)) {
      track("book_call_click", { link_url: href });
    }
  });

  // 2) Envío de formularios (se dispara solo si el formulario pasa la validación)
  //    Si un formulario no debe contar como lead, añádele data-no-track
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (form.hasAttribute("data-no-track")) return;
    track("generate_lead", { form_name: form.id || form.getAttribute("name") || "contact" });
  });

  // 3) Reserva confirmada en un Calendly incrustado en la página
  window.addEventListener("message", function (e) {
    if (e.origin === "https://calendly.com" &&
        e.data && e.data.event === "calendly.event_scheduled") {
      track("book_call");
    }
  });
})();
