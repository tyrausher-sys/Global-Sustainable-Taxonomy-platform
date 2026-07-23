/* /api/translate-content.js — Vercel serverless function (Node.js runtime)
 *
 * Translates the actual researched country content (description paragraphs,
 * environmental objective labels, activity/criteria table cells, overlay
 * text) into the reader's selected site language — not just the static UI
 * chrome, which global.js already handles client-side.
 *
 * Design: the front end (country.js) extracts every translatable string out
 * of a country's data.js entry into a flat, ordered array (see
 * extractTranslatable() in country.js) and POSTs { items, lang } here. This
 * endpoint asks Claude to return a same-length, same-order JSON array of
 * translated strings, which the front end then splices back into a cloned
 * copy of the entry for rendering. Deliberately NOT translated by this
 * pipeline (left in their original/official form): country names, taxonomy
 * proper-noun titles, regulator names, official document titles, citation
 * labels, and all URLs — those need to stay byte-identical to the real
 * official source so a reader can still find/verify it.
 *
 * Uses the same ANTHROPIC_API_KEY as /api/ask and /api/translate-pdf — no
 * separate key needed.
 */

const LANGUAGE_NAMES = {
  en: "English",
  sv: "Swedish (Svenska)",
  ko: "Korean (한국어)",
  es: "Spanish (Español)",
  fr: "French (Français)",
  de: "German (Deutsch)",
  ja: "Japanese (日本語)",
  zh: "Chinese (中文)",
  ar: "Arabic (العربية)",
  pt: "Portuguese (Português)"
};

const MAX_ITEMS = 300;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "The server is missing an ANTHROPIC_API_KEY environment variable. Set it in your Vercel project settings (see DEPLOY_INSTRUCTIONS.md) and redeploy."
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const items = Array.isArray(body.items) ? body.items.map(x => (x === null || x === undefined) ? "" : String(x)) : null;
  const langCode = LANGUAGE_NAMES[body.lang] ? body.lang : null;

  if (!items || !items.length) {
    res.status(400).json({ error: "Missing or empty 'items' array in request body." });
    return;
  }
  if (items.length > MAX_ITEMS) {
    res.status(400).json({ error: `Too many items in one request (max ${MAX_ITEMS}).` });
    return;
  }
  if (!langCode || langCode === "en") {
    // Nothing to do — echo back the originals so the caller can treat this uniformly.
    res.status(200).json({ translated: items, lang: "en" });
    return;
  }

  const languageName = LANGUAGE_NAMES[langCode];

  const systemPrompt = [
    `Translate each string in the given JSON array into ${languageName}.`,
    "Reply with ONLY a JSON array of the same length, in the same order, containing the translated strings. No other text, no markdown code fences, no explanation before or after.",
    "Preserve citation markers exactly as they appear, such as [1], [2], or [1][2] — never translate, reword, move, or drop them.",
    "Preserve template placeholders exactly as written, such as {sector}, {taxonomy}, {n}, {total}, if present in a string.",
    "If an input string is an empty string, return an empty string in that same position.",
    "This is regulatory / financial-policy source material — use a precise, formal register and do not summarize, paraphrase loosely, or add commentary. Translate faithfully."
  ].join("\n");

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: "user", content: JSON.stringify(items) }]
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const msg = (data && data.error && data.error.message) || `Upstream API error (HTTP ${upstream.status})`;
      res.status(upstream.status).json({ error: msg });
      return;
    }

    const raw = Array.isArray(data.content) ? data.content.map(b => b.text || "").join("\n").trim() : "";
    let translated;
    try {
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
      translated = JSON.parse(cleaned);
    } catch (parseErr) {
      res.status(502).json({ error: "The AI did not return valid JSON.", raw: raw.slice(0, 300) });
      return;
    }

    if (!Array.isArray(translated) || translated.length !== items.length) {
      res.status(502).json({ error: "Translation result did not match the request (wrong length or shape)." });
      return;
    }

    res.status(200).json({ translated, lang: langCode });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach the AI provider: " + err.message });
  }
};
