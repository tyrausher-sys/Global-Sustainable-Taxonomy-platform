/* /api/digest-rss.js — Vercel serverless function (Node.js runtime)
 *
 * Publishes a real, live RSS 2.0 feed of the site's own aggregated content
 * (the same News/Reports/Papers headlines shown on the Media Hub, via
 * Google News' public RSS search — see api/_lib/rss.js and api/news.js).
 *
 * This feed is kept as a general-purpose, standards-compliant RSS output —
 * any RSS reader can subscribe to it. The actual weekly Brevo digest,
 * however, is produced by api/create-digest-draft.js, which builds a draft
 * campaign directly in Brevo via its API (see that file's header comment
 * for why: Brevo's own "RSS Campaign" UI feature could not be located in
 * this account, so the same job is done by pushing a ready-made draft in
 * instead of asking Brevo to pull from a feed).
 *
 * Deliberately NOT included here: an AI-generated "trend insights" blurb
 * (would cost an API call on every poll, for no benefit — the Media Hub's
 * own trend summary is already cached there) or a "BNZ Partners company
 * updates" item (no real source to pull from; inventing one would violate
 * this project's rule against fabricated content).
 *
 * Response: valid RSS 2.0 XML (content-type application/rss+xml).
 */

const { buildFeedItems, escapeXml, safePubDate } = require("./_lib/digest-content");

const CACHE_MS = 15 * 60 * 1000; // 15 minutes — matches api/news.js, keeps Google News load light
let cache = { xml: null, fetchedAt: 0 };

const SITE_URL = process.env.SITE_URL || "https://global-sustainable-taxonomy-platfor.vercel.app";

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
    <description>Live taxonomy news, reports and research papers, aggregated from Google News for the Global Sustainable Taxonomies platform.</description>
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
