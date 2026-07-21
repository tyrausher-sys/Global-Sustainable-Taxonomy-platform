/* /api/trends.js — Vercel serverless function (Node.js runtime)
 *
 * Generates the Media Hub's "AI Trend Insights" cards and thematic policy
 * chart from REAL, live headlines (via Google News), using the same
 * Anthropic model already wired up for the AI Advisor's "Ask AI" tab
 * (api/ask.js) — reusing ANTHROPIC_API_KEY rather than requiring a second
 * AI provider/key. The original Screen 4 spec called for Gemini; since
 * this project already has an Anthropic key configured, trend generation
 * reuses that instead. Functionally it fulfils the same requirement: real
 * AI analysis of freshly ingested media content, refreshed periodically
 * (here: whenever the 1-hour cache expires).
 *
 * GET /api/trends
 *   -> { trends: [{ title, teaser, detail }], thematic: [{ label, value }], fetchedAt, cached }
 */

const { fetchGoogleNewsRss } = require("./_lib/rss");

const NEWS_QUERY = '("sustainable finance taxonomy" OR "green taxonomy" OR "EU taxonomy" regulation OR "taxonomy regulation") when:30d';
const CACHE_MS = 60 * 60 * 1000; // 1 hour — avoid recomputing this on every visitor
let cache = { data: null, fetchedAt: 0 };

function buildPrompt(headlines) {
  const list = headlines.map((h, i) => `${i + 1}. ${h.title} (${h.source})`).join("\n");
  return [
    "You are analysing a batch of real, live news headlines about sustainable finance taxonomies (green/sustainable activity classification frameworks) for a media dashboard.",
    "Identify exactly 4 emerging themes that are actually visible across these headlines. For each theme, write: a short title (2-5 words), a one-sentence teaser, and a 2-3 sentence detailed analysis paragraph.",
    "Also estimate a rough thematic weighting: what share of the headlines relates to each theme, as a whole-number percentage (the 4 percentages should roughly reflect their relative prominence, but don't force an exact total of 100 if it doesn't fit naturally).",
    "Base your analysis ONLY on the headlines below — do not invent facts, events, or country developments not implied by them. If the headlines are too sparse or repetitive to genuinely support 4 distinct themes, say so honestly within the analysis text rather than inventing filler themes.",
    "Respond with ONLY valid JSON, no other text before or after it, in exactly this shape:",
    '{"trends":[{"title":"...","teaser":"...","detail":"..."}],"thematic":[{"label":"...","value":0}]}',
    "(exactly 4 items in each array)",
    "",
    "HEADLINES:",
    list
  ].join("\n");
}

async function generateTrends(apiKey) {
  const headlines = await fetchGoogleNewsRss(NEWS_QUERY, 20);

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      max_tokens: 1200,
      messages: [{ role: "user", content: buildPrompt(headlines) }]
    })
  });

  const data = await upstream.json();
  if (!upstream.ok) {
    const msg = (data && data.error && data.error.message) || `Upstream API error (HTTP ${upstream.status})`;
    throw new Error(msg);
  }

  const text = Array.isArray(data.content) ? data.content.map(b => b.text || "").join("\n").trim() : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Model did not return parseable JSON.");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(parsed.trends) || !Array.isArray(parsed.thematic)) {
    throw new Error("Model response is missing the expected 'trends' or 'thematic' arrays.");
  }
  return parsed;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(200).json({
      trends: [],
      thematic: [],
      fetchedAt: Date.now(),
      note: "ANTHROPIC_API_KEY is not set — AI trend analysis is disabled until it's configured in Vercel project settings (see DEPLOY_INSTRUCTIONS.md)."
    });
    return;
  }

  const now = Date.now();
  if (cache.data && now - cache.fetchedAt < CACHE_MS) {
    res.status(200).json({ ...cache.data, fetchedAt: cache.fetchedAt, cached: true });
    return;
  }

  try {
    const parsed = await generateTrends(apiKey);
    cache = { data: parsed, fetchedAt: now };
    res.status(200).json({ ...parsed, fetchedAt: now, cached: false });
  } catch (err) {
    if (cache.data) {
      res.status(200).json({ ...cache.data, fetchedAt: cache.fetchedAt, cached: true, stale: true });
      return;
    }
    res.status(502).json({ error: "Failed to generate live trend analysis: " + err.message });
  }
};
