/* /api/news.js — Vercel serverless function (Node.js runtime)
 *
 * Wires the Media Hub's "News" feed to real, live headlines instead of
 * sample/placeholder content. Uses Google News' public RSS search feed,
 * which needs no API key, account or sign-up — it's a plain XML feed
 * anyone can query. We fetch it here (server-side) rather than directly
 * from the browser because the feed doesn't send CORS headers, so a
 * client-side fetch from media.js would be blocked by the browser.
 *
 * GET /api/news
 *   -> { items: [{ title, link, source, publishedAt }], fetchedAt, cached }
 *
 * Results are cached in memory for CACHE_MS to avoid hammering the feed on
 * every page load; if a refresh fetch fails, the last good cache is served
 * instead of an error, so a transient network blip upstream doesn't break
 * the page for visitors.
 */

const SEARCH_TERMS = [
  '"sustainable finance taxonomy"',
  '"green taxonomy"',
  '"EU taxonomy" regulation',
  '"taxonomy regulation" sustainable finance'
];
const QUERY = `(${SEARCH_TERMS.join(" OR ")}) when:30d`;
const FEED_URL = `https://news.google.com/rss/search?q=${encodeURIComponent(QUERY)}&hl=en-US&gl=US&ceid=US:en`;

const CACHE_MS = 15 * 60 * 1000; // 15 minutes
let cache = { items: null, fetchedAt: 0 };

function decodeEntities(s) {
  // &amp; is decoded first so that any double-encoded entities (e.g. a feed
  // that renders an apostrophe as "&amp;#39;" instead of "&#39;") still
  // resolve correctly, not just single-encoded ones.
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}

function stripTags(s) {
  return String(s).replace(/<[^>]*>/g, "").trim();
}

function parseItems(xml) {
  const items = [];
  const blocks = xml.split("<item>").slice(1);

  for (const block of blocks) {
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    if (!titleMatch || !linkMatch) continue;

    let title = decodeEntities(stripTags(titleMatch[1]));
    const source = sourceMatch ? decodeEntities(stripTags(sourceMatch[1])) : null;

    // Google News titles are usually "Headline - Source Name"; strip the
    // trailing " - Source" so it isn't shown twice alongside the source tag.
    if (source && title.endsWith(" - " + source)) {
      title = title.slice(0, title.length - (" - " + source).length);
    }

    const link = decodeEntities(stripTags(linkMatch[1]));
    if (!title || !link) continue;

    items.push({
      title,
      link,
      source: source || "Google News",
      publishedAt: pubDateMatch ? stripTags(pubDateMatch[1]) : null
    });
  }

  return items;
}

async function fetchLive() {
  const upstream = await fetch(FEED_URL, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; GlobalSustainableTaxonomiesBot/1.0; +https://global-sustainable-taxonomy-platfor.vercel.app/)" }
  });
  if (!upstream.ok) {
    throw new Error(`Upstream feed error (HTTP ${upstream.status})`);
  }
  const xml = await upstream.text();
  const items = parseItems(xml).slice(0, 24);
  if (!items.length) {
    throw new Error("Feed returned no parseable items.");
  }
  return items;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  const now = Date.now();
  if (cache.items && now - cache.fetchedAt < CACHE_MS) {
    res.status(200).json({ items: cache.items, fetchedAt: cache.fetchedAt, cached: true });
    return;
  }

  try {
    const items = await fetchLive();
    cache = { items, fetchedAt: now };
    res.status(200).json({ items, fetchedAt: now, cached: false });
  } catch (err) {
    if (cache.items) {
      // Serve the last good cache rather than an error if the live fetch
      // to Google News fails for some reason (network blip, feed format
      // change, etc.) — visitors still see recent headlines.
      res.status(200).json({ items: cache.items, fetchedAt: cache.fetchedAt, cached: true, stale: true });
      return;
    }
    res.status(502).json({ error: "Failed to fetch the live news feed: " + err.message });
  }
};
