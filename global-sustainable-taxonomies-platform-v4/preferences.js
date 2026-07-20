/* Global Sustainable Taxonomies — Subscriber Preferences (placeholder)
   NOTE: This entire page is a non-functional demo. All fields are disabled
   and pre-filled with sample data; there is no real subscriber backend. */

function init() {
  const unsubLink = document.getElementById("prefUnsubscribeLink");
  if (unsubLink) {
    unsubLink.addEventListener("click", e => {
      e.preventDefault();
      alert("This is a demo — there is no real subscription to cancel yet.");
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
