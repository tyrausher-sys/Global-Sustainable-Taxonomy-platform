/* /api/subscribe.js — Vercel serverless function (Node.js runtime)
 *
 * This is the ONLY place the Brevo API key is used. It reads it from an
 * environment variable (BREVO_API_KEY) set in the Vercel project settings —
 * it is never sent to, or visible in, the browser.
 *
 * The front end (subscribe.js) POSTs { email, name, interests, language }
 * here. This function adds the contact to your Brevo account (and, if
 * BREVO_LIST_ID is set, to that specific list) via Brevo's Contacts API:
 * https://developers.brevo.com/reference/create-contact
 *
 * IMPORTANT: this only captures the signup itself. It does not send any
 * digest content — that still has to be written and sent by a human from
 * the Brevo dashboard (Campaigns), since nothing here can invent real
 * "updates" content on your behalf.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "The server is missing a BREVO_API_KEY environment variable. Set it in your Vercel project settings (see DEPLOY_INSTRUCTIONS.md) and redeploy."
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const email = String(body.email || "").trim();
  const name = String(body.name || "").trim();
  const interests = String(body.interests || "").trim();
  const language = String(body.language || "").trim();

  if (!email || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  const attributes = {};
  if (name) attributes.FIRSTNAME = name;
  if (interests) attributes.INTERESTS = interests; // requires a Brevo custom contact attribute named INTERESTS
  if (language) attributes.LANGUAGE = language;     // requires a Brevo custom contact attribute named LANGUAGE

  const payload = {
    email,
    attributes,
    updateEnabled: true
  };

  const listId = process.env.BREVO_LIST_ID;
  if (listId && !isNaN(Number(listId))) {
    payload.listIds = [Number(listId)];
  }

  try {
    const upstream = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(payload)
    });

    if (upstream.status === 204 || upstream.ok) {
      res.status(200).json({ ok: true });
      return;
    }

    let data = {};
    try { data = await upstream.json(); } catch (e) { /* ignore */ }
    const msg = (data && data.message) || `Brevo API error (HTTP ${upstream.status})`;
    res.status(upstream.status).json({ error: msg });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach Brevo: " + err.message });
  }
};
