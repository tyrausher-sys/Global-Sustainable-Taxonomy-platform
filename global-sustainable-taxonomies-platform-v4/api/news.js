/* /api/news.js — Vercel serverless function (Node.js runtime)
 *
 * Wires the Media Hub's "News", "Reports" and "Papers" tabs to real, live
 * content instead of sample/placeholder content. Uses Google News' public
 * RSS search feed (via api/_lib/rss.js) — no API key or account needed.
 *
 * GET /api/news              -> News tab (general taxonomy news)
 * GET /api/news?type=Reports -> Reports tab (news mentioning reports/studies)
 * GET /api/news?type=Papers  -> Papers tab (news mentioning working/research papers)
 *
 * Honesty note: Google News only indexes news articles, not a curated
 * database of formal reports or academic papers. "Reports" and "Papers"
 * are approximated here by adding report/paper-related keywords to the
 * same underlying news search — so results are real, live articles, but
 * they may sometimes overlap with the News tab or be sparser than News
 * itself. This is the best available keyless, no-signup approximation;
 * a dedicated reports/papers database would need its own (likely paid)
 * API to do better.
 *
 * Response shape: { items: [{ title, link, source, publishedAt }], fetchedAt, cached }
 */

const { fetchGoogleNewsRss } = require("./_lib/rss");

const BASE_TOPIC = '("sustainable finance taxonomy" OR "green taxonomy" OR "EU taxonomy" regulation OR "taxonomy regulation")';

const QUERIES = {
  News: `${BASE_TOPIC} when:30d`,
  Reports: `${BASE_TOPIC} (report OR study OR "white paper") when:45d`,
  Papers: `${BASE_TOPIC} ("working paper" OR "research paper" OR "academic study") when:60d`
};

const CACHE_MS = 15 * 60 * 1000; // 15 minutes
const cache = {}; // keyed by type: { items, fetchedAt }

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  const type = QUERIES[req.query && req.query.type] ? req.query.type : "News";
  const query = QUERIES[type];

  const now = Date.now();
  const entry = cache[type];
  if (entry && now - entry.fetchedAt < CACHE_MS) {
    res.status(200).json({ items: entry.items, fetchedAt: entry.fetchedAt, cached: true });
    return;
  }

  try {
    const items = await fetchGoogleNewsRss(query, 24);
    cache[type] = { items, fetchedAt: now };
    res.status(200).json({ items, fetchedAt: now, cached: false });
  } catch (err) {
    if (entry) {
      // Serve the last good cache rather than an error if the live fetch
      // to Google News fails for some reason (network blip, feed format
      // change, etc.) — visitors still see recent content.
      res.status(200).json({ items: entry.items, fetchedAt: entry.fetchedAt, cached: true, stale: true });
      return;
    }
    res.status(502).json({ error: "Failed to fetch the live feed: " + err.message });
  }
};
