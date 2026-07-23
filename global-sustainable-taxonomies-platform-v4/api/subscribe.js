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
 * Resilient attribute handling: Brevo rejects the ENTIRE contact-create call
 * if you send a custom attribute (like INTERESTS or LANGUAGE) that hasn't
 * been created in that Brevo account's Contact Attributes settings — the
 * whole signup would silently fail even though the person's email is
 * perfectly valid. To avoid losing real signups over an optional field, this
 * function detects that specific "attribute is unknown" error, drops just
 * that attribute, and retries — so the email/name always gets captured even
 * if the optional INTERESTS/LANGUAGE attributes were never set up.
 *
 * IMPORTANT: this only captures the signup itself. It does not send any
 * digest content — that still has to be written and sent by a human from
 * the Brevo dashboard (Campaigns), since nothing here can invent real
 * "updates" content on your behalf.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ATTEMPTS = 5; // 1 initial try + up to 4 attribute drops (FIRSTNAME, INTERESTS, LANGUAGE, +1 spare)

async function callBrevo(apiKey, payload) {
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
    return { ok: true };
  }

  let data = {};
  try { data = await upstream.json(); } catch (e) { /* ignore */ }
  return { ok: false, status: upstream.status, message: (data && data.message) || "", code: data && data.code };
}

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
    let result;
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      result = await callBrevo(apiKey, payload);
      if (result.ok) {
        res.status(200).json({ ok: true });
        return;
      }

      // Brevo's "unknown attribute" error names the offending key, e.g.
      // "Attribute INTERESTS is unknown. Please check the api documentation"
      const m = /attribute[s]?\s+([A-Z0-9_]+)\s+(?:is|are)\s+unknown/i.exec(result.message || "");
      if (m && payload.attributes && Object.prototype.hasOwnProperty.call(payload.attributes, m[1])) {
        delete payload.attributes[m[1]];
        continue; // retry without that one attribute
      }

      // Not an attribute-naming issue (or nothing left to drop) — stop retrying.
      break;
    }

    const msg = (result && result.message) || `Brevo API error (HTTP ${result && result.status})`;
    res.status((result && result.status) || 500).json({ error: msg });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach Brevo: " + err.message });
  }
};
