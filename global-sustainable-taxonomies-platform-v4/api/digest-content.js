/* api/_lib/digest-content.js — shared "what goes in this week's digest" logic.
 *
 * Used by both:
 *   - api/digest-rss.js          (publishes it as a plain RSS feed anyone/anything can read)
 *   - api/create-digest-draft.js (pushes it straight into Brevo as a draft campaign)
 *
 * Kept in one place so both paths always show the exact same real, live
 * headlines — no duplicated fetch/dedupe/sort logic to drift out of sync.
 */

const { fetchGoogleNewsRss } = require("./rss");

const BASE_TOPIC = '("sustainable finance taxonomy" OR "green taxonomy" OR "EU taxonomy" regulation OR "taxonomy regulation")';

const QUERIES = [
  { type: "News", query: `${BASE_TOPIC} when:14d` },
  { type: "Reports", query: `${BASE_TOPIC} (report OR study OR "white paper") when:21d` },
  { type: "Papers", query: `${BASE_TOPIC} ("working paper" OR "research paper" OR "academic study") when:30d` }
];

const MAX_ITEMS = 15;

function escapeXml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Google News RSS pubDate strings are already RFC-822 formatted
// ("Mon, 21 Jul 2026 09:00:00 GMT"), so they can be reused directly. Fall
// back to "now" only if a given item is somehow missing one.
function safePubDate(raw) {
  if (raw) {
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) return parsed.toUTCString();
  }
  return new Date().toUTCString();
}

async function buildFeedItems() {
  const results = await Promise.allSettled(
    QUERIES.map(q => fetchGoogleNewsRss(q.query, 10).then(items => items.map(i => ({ ...i, section: q.type }))))
  );

  const byLink = new Map();
  results.forEach(r => {
    if (r.status !== "fulfilled") return;
    r.value.forEach(item => {
      if (!byLink.has(item.link)) byLink.set(item.link, item);
    });
  });

  const items = Array.from(byLink.values());
  items.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  return items.slice(0, MAX_ITEMS);
}

module.exports = { buildFeedItems, escapeXml, escapeHtml, safePubDate, QUERIES, MAX_ITEMS, BASE_TOPIC };
