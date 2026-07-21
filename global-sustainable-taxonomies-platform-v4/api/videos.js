/* /api/videos.js — Vercel serverless function (Node.js runtime)
 *
 * Wires the Media Hub's "Videos" tab to the YouTube Data API v3. Unlike
 * Google News RSS or the iTunes Search API, YouTube has no keyless public
 * search feed — it requires a free API key from Google Cloud Console.
 *
 * Until YOUTUBE_API_KEY is set in Vercel project settings, this returns an
 * empty list with a clear note, and the front end shows an honest "not
 * connected yet" state — never fake sample videos.
 *
 * To enable: console.cloud.google.com -> create/select a project -> enable
 * the "YouTube Data API v3" -> Credentials -> Create API Key (free tier is
 * generous for a search volume like this site's). Add it in Vercel as
 * YOUTUBE_API_KEY and redeploy. See DEPLOY_INSTRUCTIONS.md.
 *
 * GET /api/videos -> { items: [{ title, link, videoId, source, publishedAt }], fetchedAt, cached }
 */

const CACHE_MS = 30 * 60 * 1000; // 30 minutes
let cache = { items: null, fetchedAt: 0 };

const QUERY = "sustainable finance taxonomy green taxonomy explainer";

async function fetchLive(apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=16&order=date&q=${encodeURIComponent(QUERY)}&key=${apiKey}`;
  const upstream = await fetch(url);
  const data = await upstream.json();

  if (!upstream.ok) {
    const msg = (data && data.error && data.error.message) || `Upstream error (HTTP ${upstream.status})`;
    throw new Error(msg);
  }

  const results = Array.isArray(data.items) ? data.items : [];
  const items = results
    .map(r => ({
      title: r.snippet && r.snippet.title,
      link: r.id && r.id.videoId ? `https://www.youtube.com/watch?v=${r.id.videoId}` : null,
      videoId: r.id && r.id.videoId,
      source: r.snippet && r.snippet.channelTitle,
      publishedAt: r.snippet && r.snippet.publishedAt
    }))
    .filter(i => i.title && i.link && i.videoId);

  return items;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    res.status(200).json({
      items: [],
      fetchedAt: Date.now(),
      note: "YOUTUBE_API_KEY is not set — video results are disabled until a free YouTube Data API key is added in Vercel project settings (see DEPLOY_INSTRUCTIONS.md)."
    });
    return;
  }

  const now = Date.now();
  if (cache.items && now - cache.fetchedAt < CACHE_MS) {
    res.status(200).json({ items: cache.items, fetchedAt: cache.fetchedAt, cached: true });
    return;
  }

  try {
    const items = await fetchLive(apiKey);
    cache = { items, fetchedAt: now };
    res.status(200).json({ items, fetchedAt: now, cached: false });
  } catch (err) {
    if (cache.items) {
      res.status(200).json({ items: cache.items, fetchedAt: cache.fetchedAt, cached: true, stale: true });
      return;
    }
    res.status(502).json({ error: "Failed to fetch live video feed: " + err.message });
  }
};
