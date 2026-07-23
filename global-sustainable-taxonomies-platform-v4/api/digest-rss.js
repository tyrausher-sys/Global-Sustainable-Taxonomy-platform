/* /api/digest-rss.js — Vercel serverless function (Node.js runtime)
 *
 * Publishes a real, live RSS 2.0 feed of the site's own aggregated content
 * (the same News/Reports/Papers headlines shown on the Media Hub, via
 * Google News' public RSS search — see api/_lib/rss.js and api/news.js),
 * so it can be pointed at from Brevo's built-in "RSS Campaign" feature.
 *
 * Why this exists: Brevo can automatically generate and send a recurring
 * (e.g. weekly) email campaign built from any RSS feed, entirely on its own
 * schedule, without anyone needing to write or trigger anything by hand
 * each week. But it needs a real feed URL to read from — the Media Hub's
 * News/Reports/Papers tabs are rendered client-side from api/news.js's
 * JSON response, which isn't valid RSS XML. This endpoint re-fetches the
 * same underlying live headlines and republishes them as a proper RSS feed
 * Brevo (or any other RSS reader) can subscribe to.
 *
 * Setup (one-time, done in the Brevo dashboard, no code involved):
 *   1. Brevo → Campaigns → Email → "RSS Campaign" (or Automations, depending
 *      on plan) → paste this feed's URL:
 *      https://<your-vercel-domain>/api/digest-rss
 *   2. Set the recurrence to weekly (or whatever cadence is wanted).
 *   3. Set the sending mode to "Create a draft for review" (recommended) so
 *      a real person checks the digest before it goes to real subscribers —
 *      or "Send automatically" if full automation is preferred, understanding
 *      that no one will review that week's content before it's sent.
 *   4. Pick the mailing list this should go to (the same one BREVO_LIST_ID
 *      points at).
 *
 * Deliberately NOT included: an AI-generated "trend insights" blurb. Brevo
 * (or any RSS reader) may poll this feed frequently; calling the Anthropic
 * API on every poll would run up real cost for no benefit, since the trend
 * summary shown on the Media Hub itself is already cached for an hour there.
 * This feed sticks to real, zero-marginal-cost headline data. It also does
 * NOT include a "BNZ Partners company updates" item — there is no live feed
 * of real company news to pull from, and inventing one would violate this
 * project's core rule against fabricated content. If/when there's a genuine
 * source for that (e.g. a company blog with its own RSS feed), it can be
 * merged in here.
 *
 * Response: valid RSS 2.0 XML (content-type application/rss+xml).
 */

const { fetchGoogleNewsRss } = require("./_lib/rss");

const BASE_TOPIC = '("sustainable finance taxonomy" OR "green taxonomy" OR "EU taxonomy" regulation OR "taxonomy regulation")';

const QUERIES = [
  { type: "News", query: `${BASE_TOPIC} when:14d` },
  { type: "Reports", query: `${BASE_TOPIC} (report OR study OR "white paper") when:21d` },
  { type: "Papers", query: `${BASE_TOPIC} ("working paper" OR "research paper" OR "academic study") when:30d` }
];

const MAX_ITEMS = 15;
const CACHE_MS = 15 * 60 * 1000; // 15 minutes — matches api/news.js, keeps Google News load light
let cache = { xml: null, fetchedAt: 0 };

const SITE_URL = process.env.SITE_URL || "https://global-sustainable-taxonomy-platfor.vercel.app";

function escapeXml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Google News RSS pubDate strings are already RFC-822 formatted
// ("Mon, 21 Jul 2026 09:00:00 GMT"), so they can be reused directly. Fall
// back to "now" only if a given item is somehow missing one, so every entry
// still has a valid <pubDate> for RSS readers that require it.
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

function buildRss(items) {
  const now = new Date().toUTCString();
  const itemsXml = items.map(item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <pubDate>${safePubDate(item.publishedAt)}</pubDate>
      <description>${escapeXml(`${item.section} — ${item.source || "Google News"}`)}</description>
    </item>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Global Sustainable Taxonomies — Weekly Digest</title>
    <link>${escapeXml(SITE_URL + "/media.html")}</link>
    <description>Live taxonomy news, reports and research papers, aggregated from Google News for the Global Sustainable Taxonomies platform. Used to power the automated Brevo weekly digest.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <ttl>60</ttl>${itemsXml}
  </channel>
</rss>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed. Use GET.");
    return;
  }

  const now = Date.now();
  if (cache.xml && now - cache.fetchedAt < CACHE_MS) {
    res.setHeader("content-type", "application/rss+xml; charset=utf-8");
    res.status(200).send(cache.xml);
    return;
  }

  try {
    const items = await buildFeedItems();
    const xml = buildRss(items);
    cache = { xml, fetchedAt: now };
    res.setHeader("content-type", "application/rss+xml; charset=utf-8");
    res.status(200).send(xml);
  } catch (err) {
    if (cache.xml) {
      res.setHeader("content-type", "application/rss+xml; charset=utf-8");
      res.status(200).send(cache.xml);
      return;
    }
    res.status(502).send("Failed to build the digest feed: " + err.message);
  }
};
