/* -----------------------------------------------------------
   CONTACT FORM
   Submits to Formspree over fetch so the page can show a
   success or error state without a reload. Falls back to a
   normal POST (and Formspree's own confirmation page) if
   JavaScript is unavailable.
----------------------------------------------------------- */

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const submitBtn = form.querySelector("[data-submit-btn]");
  const submitLabel = form.querySelector("[data-submit-label]");
  const statusEl = form.querySelector("[data-form-status]");
  let isSubmitting = false;

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
      statusEl.setAttribute("role", "status");
      statusEl.textContent = "Thank you — your message is on its way. I'll get back to you soon.";
      statusEl.classList.add("form-status--success");
    } catch (error) {
      statusEl.setAttribute("role", "alert");
      statusEl.textContent = "Something went wrong and your message wasn't sent. Please try again, or email huertacabomarina@gmail.com directly.";
      statusEl.classList.add("form-status--error");
    } finally {
      statusEl.hidden = false;
      submitLabel.textContent = "Start the conversation";
      submitBtn.disabled = false;
      form.removeAttribute("aria-busy");
      isSubmitting = false;
    }
  });
}
