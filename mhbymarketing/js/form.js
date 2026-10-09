/* -----------------------------------------------------------
   CONTACT FORM
   Submits to Formspree over fetch so the page can show a
   success or error state without a reload. Falls back to a
   normal POST (and Formspree's own confirmation page) if
   JavaScript is unavailable.

   A successful send is reported to GA4 as generate_lead via
   window.trackLead() (js/tracking.js). The <form> carries
   data-no-track so tracking.js doesn't also count the raw
   submit event — that would fire even when sending fails.
----------------------------------------------------------- */

const CONTACT_EMAIL = "huertacabomarina@gmail.com";

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const submitBtn = form.querySelector("[data-submit-btn]");
  const submitLabel = form.querySelector("[data-submit-label]");
  const statusEl = form.querySelector("[data-form-status]");
  const idleLabel = submitLabel.textContent;
  let isSubmitting = false;

  const showStatus = (type, nodes) => {
    statusEl.replaceChildren(...nodes);
    statusEl.setAttribute("role", type === "error" ? "alert" : "status");
    statusEl.classList.add(`form-status--${type}`);
    statusEl.hidden = false;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    form.setAttribute("aria-busy", "true");
    submitBtn.disabled = true;
    submitLabel.textContent = "Sending…";
    statusEl.hidden = true;
    statusEl.classList.remove("form-status--success", "form-status--error");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("submission-failed");

      form.reset();
      showStatus("success", ["Thank you — I'll get back to you within 48 hours."]);
      if (typeof window.trackLead === "function") window.trackLead("contact");
    } catch (error) {
      const emailLink = document.createElement("a");
      emailLink.className = "text-link";
      emailLink.href = `mailto:${CONTACT_EMAIL}`;
      emailLink.textContent = CONTACT_EMAIL;
      showStatus("error", [
        "Something went wrong and your message wasn't sent. Please try again, or write to me directly at ",
        emailLink,
        ".",
      ]);
    } finally {
      submitLabel.textContent = idleLabel;
      submitBtn.disabled = false;
      form.removeAttribute("aria-busy");
      isSubmitting = false;
    }
  });
}
