/* /api/podcasts.js — Vercel serverless function (Node.js runtime)
 *
 * Wires the Media Hub's "Podcasts" tab to real content via Apple's iTunes
 * Search API, which is free and needs no API key or account — a plain
 * public JSON endpoint. Returns real podcast episodes matching sustainable
 * finance / green taxonomy search terms.
 *
 * GET /api/podcasts -> { items: [{ title, link, source, publishedAt, audioUrl }], fetchedAt, cached }
 */

const CACHE_MS = 30 * 60 * 1000; // 30 minutes
let cache = { items: null, fetchedAt: 0 };

const TERM = "sustainable finance taxonomy green finance regulation";
const FEED_URL = `https://itunes.apple.com/search?term=${encodeURIComponent(TERM)}&media=podcast&entity=podcastEpisode&limit=20`;

async function fetchLive() {
  const upstream = await fetch(FEED_URL);
  if (!upstream.ok) {
    throw new Error(`Upstream error (HTTP ${upstream.status})`);
  }
  const data = await upstream.json();
  const results = Array.isArray(data.results) ? data.results : [];

  const items = results
    .map(r => ({
      title: r.trackName || r.collectionName || "Untitled episode",
      link: r.trackViewUrl || r.collectionViewUrl || null,
      source: r.artistName || r.collectionName || "Podcast",
      publishedAt: r.releaseDate || null,
      audioUrl: r.previewUrl || null
    }))
    .filter(i => i.title && i.link);

  if (!items.length) {
    throw new Error("No podcast episodes found for this search term.");
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
      res.status(200).json({ items: cache.items, fetchedAt: cache.fetchedAt, cached: true, stale: true });
      return;
    }
    res.status(502).json({ error: "Failed to fetch live podcast feed: " + err.message });
  }
};
