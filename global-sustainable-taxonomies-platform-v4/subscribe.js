/* Global Sustainable Taxonomies — Subscribe (Screen 5)
   Submits to /api/subscribe, a Vercel serverless function that adds the
   contact to your real Brevo mailing list (see api/subscribe.js and
   DEPLOY_INSTRUCTIONS.md). This requires the site to be deployed to Vercel
   with a BREVO_API_KEY set — opening this file directly, or hosting it on
   plain static hosting without the /api function, will show a clear
   "couldn't reach" error rather than pretending to succeed.
   Note: this only captures the signup. Actually sending the weekly digest
   content is still a manual step you do from the Brevo dashboard. */

const SUBSCRIBE_ENDPOINT = "/api/subscribe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(showError) {
  const input = document.getElementById("subscribeEmail");
  const errorEl = document.getElementById("emailError");
  const value = input.value.trim();

  if (!value) {
    if (showError) errorEl.textContent = "Email address is required.";
    input.classList.toggle("input-invalid", !!showError);
    return false;
  }
  if (!EMAIL_RE.test(value)) {
    if (showError) errorEl.textContent = "Please enter a valid email address.";
    input.classList.toggle("input-invalid", !!showError);
    return false;
  }
  errorEl.textContent = "";
  input.classList.remove("input-invalid");
  return true;
}

function validateConsent(showError) {
  const comms = document.getElementById("consentComms").checked;
  const privacy = document.getElementById("consentPrivacy").checked;
  const errorEl = document.getElementById("consentError");
  if (!comms || !privacy) {
    if (showError) errorEl.textContent = "Please accept both consent checkboxes to continue.";
    return false;
  }
  errorEl.textContent = "";
  return true;
}

function setupEmailValidation() {
  const input = document.getElementById("subscribeEmail");
  input.addEventListener("blur", () => validateEmail(true));
  input.addEventListener("input", () => {
    if (input.classList.contains("input-invalid")) validateEmail(true);
  });
}

function setupInterestChecks() {
  document.querySelectorAll("#interestList .interest-check").forEach(label => {
    const checkbox = label.querySelector("input[type=checkbox]");
    const sync = () => label.classList.toggle("checked", checkbox.checked);
    checkbox.addEventListener("change", sync);
    sync();
  });
}

function showConfirm(message) {
  const box = document.getElementById("subscribeConfirm");
  box.innerHTML = message;
  box.classList.remove("subscribe-confirm-error");
  box.style.display = "block";
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showError(message) {
  const box = document.getElementById("subscribeConfirm");
  box.innerHTML = message;
  box.classList.add("subscribe-confirm-error");
  box.style.display = "block";
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function lockForm(form, btn, label) {
  btn.textContent = label;
  btn.disabled = true;
  Array.from(form.elements).forEach(el => { if (el !== btn) el.disabled = true; });
}

function setupForm() {
  const form = document.getElementById("subscribeForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const emailOk = validateEmail(true);
    const consentOk = validateConsent(true);
    if (!emailOk || !consentOk) return;

    const btn = form.querySelector(".btn-subscribe-large");

    const interests = Array.from(document.querySelectorAll("#interestList input:checked")).map(i => i.value);
    const payload = {
      email: document.getElementById("subscribeEmail").value.trim(),
      name: document.getElementById("subscribeName").value.trim(),
      interests: interests.join(", "),
      language: document.getElementById("subscribeLang").value
    };

    btn.textContent = "Subscribing…";
    btn.disabled = true;

    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });

      let data = {};
      try { data = await res.json(); } catch (parseErr) { /* ignore */ }

      if (res.ok && data && data.ok) {
        showConfirm("<strong>You're subscribed!</strong><p>You've been added to the mailing list using " + escapeHtmlLocal(payload.email) + ". You'll receive future digests there.</p>");
        lockForm(form, btn, "Subscribed");
      } else {
        const detail = (data && data.error) || "This subscribe form isn't connected to a live backend yet — see DEPLOY_INSTRUCTIONS.md.";
        showError("<strong>Something went wrong.</strong><p>" + escapeHtmlLocal(detail) + "</p>");
        btn.textContent = "Subscribe for Free";
        btn.disabled = false;
      }
    } catch (err) {
      showError("<strong>Couldn't reach the subscription service.</strong><p>If you're opening this file directly rather than visiting a deployed Vercel URL, subscribing isn't available yet — see DEPLOY_INSTRUCTIONS.md. (" + escapeHtmlLocal(err.message) + ")</p>");
      btn.textContent = "Subscribe for Free";
      btn.disabled = false;
    }
  });
}

function escapeHtmlLocal(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function init() {
  setupEmailValidation();
  setupInterestChecks();
  setupForm();
}

document.addEventListener("DOMContentLoaded", init);
