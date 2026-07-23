/* /api/ask.js — Vercel serverless function (Node.js runtime)
 *
 * This is the ONLY place the AI provider's API key is used. It reads the
 * key from an environment variable (ANTHROPIC_API_KEY) set in the Vercel
 * project settings — it is never sent to, or visible in, the browser.
 *
 * The front end (advisor.js, "Ask AI" tab) POSTs { question, history, lang }
 * here and gets back { answer }. This function builds a system prompt from
 * the compiled taxonomy dataset (taxonomy-data.json) so the model answers
 * using this site's data rather than only its own general knowledge. `lang`
 * is the site's currently selected UI language (one of the 8 language codes
 * used across the site's static i18n) — it's used to instruct the model to
 * reply in that language, so the "Ask AI" tab honours the same language
 * selector as the rest of the site rather than only mirroring whatever
 * language the question happened to be typed in.
 */

const fs = require("fs");
const path = require("path");

let TAXONOMY_DATA = null;
function loadData() {
  if (!TAXONOMY_DATA) {
    const raw = fs.readFileSync(path.join(__dirname, "taxonomy-data.json"), "utf8");
    TAXONOMY_DATA = JSON.parse(raw);
  }
  return TAXONOMY_DATA;
}

const LANGUAGE_NAMES = {
  en: "English",
  sv: "Swedish (Svenska)",
  ko: "Korean (한국어)",
  es: "Spanish (Español)",
  fr: "French (Français)",
  de: "German (Deutsch)",
  ja: "Japanese (日本語)",
  zh: "Chinese (中文)"
};

function buildSystemPrompt(langCode) {
  const data = loadData();
  const lines = Object.entries(data).map(([iso, e]) => {
    const parts = [
      `${e.name} (${iso})`,
      `status: ${e.status}`,
      e.taxonomy ? `taxonomy name: ${e.taxonomy}` : null,
      e.year ? `year published: ${e.year}` : null,
      e.region ? `region: ${e.region}` : null,
      e.regulator ? `regulator: ${e.regulator}` : null,
      e.source ? `source: ${e.source}` : null,
      e.note ? `notes: ${e.note}` : null,
      e.sectors && e.sectors.length ? `sectors covered: ${e.sectors.join(", ")}` : null,
      e.facts ? `facts: ${JSON.stringify(e.facts)}` : null,
      e.objectives && e.objectives.length ? `environmental objectives: ${e.objectives.map(o => o.label).join(", ")}` : null,
      e.overlays && e.overlays.length ? `also applies: ${e.overlays.map(o => o.name).join(", ")}` : null
    ].filter(Boolean);
    return "- " + parts.join(" | ");
  });

  const languageName = LANGUAGE_NAMES[langCode];
  const languageLine = languageName
    ? `Respond in ${languageName} — this is the language the user has selected for the site's interface. If the user's question is clearly written in a different language, respond in that language instead.`
    : "Respond in the same language the user's question is written in.";

  return [
    "You are the AI Assistant for the Global Sustainable Taxonomies website — available both as the Advisor page's dedicated chat and as a persistent assistant widget on every page of the site.",
    "You help users understand and compare countries' sustainable finance taxonomies (green/sustainable activity classification frameworks), explain taxonomy terminology and concepts, and guide users to the relevant section of the platform for what they're trying to do. You should be equally useful to a seasoned sustainable finance professional and to a student encountering taxonomies for the first time — adjust the depth of your explanation to the question, and don't assume prior jargon knowledge unless the question demonstrates it.",
    languageLine,
    "Answer using the reference data listed below, plus your general knowledge of how sustainable finance taxonomies typically work (e.g. explaining what DNSH or minimum safeguards mean in general).",
    "If asked to compare two or more countries, structure your answer clearly (e.g. short paragraphs or a simple comparison), highlighting concrete differences: status, year, scope/sectors, DNSH, minimum safeguards, mandatory vs voluntary.",
    "If the data needed to answer isn't in the reference data below, say so plainly instead of guessing or inventing specifics.",
    "This is an informational tool, not legal, financial, or regulatory advice — if the user asks for a compliance determination for a specific transaction, remind them to confirm against official sources.",
    "Keep answers concise and readable in a chat widget — avoid long walls of text.",
    "",
    "SITE STRUCTURE (use this to direct users to the right place when relevant):",
    "- Interactive Global Map (index.html): a world map of every country's taxonomy status, with search and advanced filtering by environmental objective/sector, plus a 'Matching Countries' results list.",
    "- Country pages (country.html?iso=XX): a detailed research report per country — taxonomy overview, official documents, environmental objectives, technical screening criteria, and a side-by-side comparison tool with another country.",
    "- AI Advisor (advisor.html): four tabs — 'Multi-Country Comparison' (describe an activity, see a table of which countries' taxonomies match), 'Country-Specific Advisor' (pick a country + describe an activity, get a detailed DNSH/criteria breakdown), 'Portfolio Comparison' (assess multiple activities at once across countries), and 'Ask AI' (free-form chat).",
    "- Media & Trend Hub (media.html): live news/reports/papers feed plus AI-generated trend insights and thematic/timeline charts.",
    "- Subscribe (subscribe.html): sign up for a weekly email digest of taxonomy news and updates.",
    "- About (about.html): platform mission, team, BNZ PARTNERS background, and key reference resources.",
    "If a user asks 'where can I find X' or describes a goal that matches one of these sections, tell them which page and tab to use.",
    "",
    "REFERENCE DATA (one line per jurisdiction):",
    lines.join("\n")
  ].join("\n");
}

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

  const question = String(body.question || "").trim();
  const history = Array.isArray(body.history) ? body.history : [];
  const langCode = LANGUAGE_NAMES[body.lang] ? body.lang : null;

  if (!question) {
    res.status(400).json({ error: "Missing 'question' in request body." });
    return;
  }
  if (question.length > 4000) {
    res.status(400).json({ error: "Question is too long (max 4000 characters)." });
    return;
  }

  const messages = history
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8)
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
  messages.push({ role: "user", content: question });

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
        max_tokens: 1024,
        system: buildSystemPrompt(langCode),
        messages
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const msg = (data && data.error && data.error.message) || `Upstream API error (HTTP ${upstream.status})`;
      res.status(upstream.status).json({ error: msg });
      return;
    }

    const text = Array.isArray(data.content)
      ? data.content.map(block => block.text || "").join("\n").trim()
      : "";

    res.status(200).json({ answer: text || "(The model returned an empty response.)" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach the AI provider: " + err.message });
  }
};
