/* api/_lib/rss.js — shared Google News RSS fetch + parse helper.
 *
 * Files under api/_lib are NOT treated as their own routes by Vercel (the
 * leading underscore excludes a folder from the automatic /api/* routing
 * convention), so this is safe to require() from real endpoint files
 * (news.js, trends.js) without Vercel trying to also serve it directly.
 *
 * Used for the "News", "Reports" and "Papers" content types on the Media
 * Hub, and to gather source headlines for the AI trend analysis. No API
 * key or account needed — Google News' search RSS feed is public.
 */

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

async function fetchGoogleNewsRss(query, limit) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  const upstream = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; GlobalSustainableTaxonomiesBot/1.0; +https://global-sustainable-taxonomy-platfor.vercel.app/)" }
  });
  if (!upstream.ok) {
    throw new Error(`Upstream feed error (HTTP ${upstream.status})`);
  }
  const xml = await upstream.text();
  const items = parseItems(xml).slice(0, limit || 24);
  if (!items.length) {
    throw new Error("Feed returned no parseable items.");
  }
  return items;
}

module.exports = { fetchGoogleNewsRss, parseItems, decodeEntities, stripTags };
