/* /api/translate-pdf.js — Vercel serverless function (Node.js runtime)
 *
 * Lets a reader translate an official taxonomy document (PDF or HTML page)
 * into their selected site language, using the same Claude backend that
 * powers "Ask AI" (reads ANTHROPIC_API_KEY — no separate key needed).
 *
 * Long official documents (many run 20-50+ pages) are translated in full,
 * not just the first few pages. Because a single serverless request/response
 * can't safely hold "translate the whole 50-page PDF" in one AI call, the
 * front end (country.js) instead calls this endpoint once per chunk:
 *   POST { url, lang, chunkIndex } -> { translatedText, chunkIndex,
 *   totalChunks, sourceChars, pages, lang, truncatedOverall }
 * and walks chunkIndex 0, 1, 2, ... up to totalChunks - 1, appending each
 * chunk's translation to the reader as it arrives (with a "translating part
 * X of Y" progress note in between). Each request independently re-fetches
 * and re-parses the source document (extraction is fast; there's no
 * server-side session storage between calls in a stateless serverless
 * function) and then slices out just the requested chunk of text to
 * translate, keeping each individual request small and quick.
 *
 * How it works:
 *   1. Fetch the document from `url` server-side (browsers can't reliably
 *      fetch cross-origin PDFs, and we don't want to expose the Anthropic
 *      key to the browser anyway).
 *   2. If it's a PDF, extract raw text with `pdf-parse`. If it's HTML,
 *      strip tags down to plain text. If the PDF is a scanned image with no
 *      embedded text layer, pdf-parse returns little/nothing — we surface
 *      that honestly rather than pretending to translate empty content.
 *   3. Cap the *overall* document at MAX_TOTAL_CHARS (a generous ~40-50
 *      pages) purely as a sanity limit against pathologically huge files,
 *      and split whatever's within that cap into CHUNK_CHARS-sized pieces.
 *   4. Ask Claude to translate just the requested chunk into the requested
 *      language, preserving headings/structure/numbering where present and
 *      keeping a formal, legal-document register.
 *
 * This is a machine translation of an official source, not a substitute for
 * it — the front end always keeps a link to the original PDF alongside the
 * translation and says so in the UI.
 */

const MAX_TOTAL_CHARS = 150000; // overall sanity cap (~40-50 pages) against pathologically huge documents
const CHUNK_CHARS = 6000; // per-request chunk size — kept smaller than it might need to be, since some source languages (e.g. dense Korean legal text) translate into a long enough English/target output that a 10k-char chunk risked exceeding the function's real time budget

// A handful of official sources (confirmed: Indonesia's OJK) block automated
// fetches at the network/IP level — even with realistic browser headers and
// a fallback proxy, requests from this server (and likely from most cloud
// hosting, not just this one) never get through, no matter how generous the
// timeout. For those specific, confirmed-blocked URLs, a pre-saved plain-text
// copy (fetched independently, ahead of time) is bundled with this function
// and used directly instead of trying — and re-failing — a live fetch every
// time. This is a manual, one-off workaround for sources that are otherwise
// impossible to fetch automatically, not a general caching mechanism.
//
// IMPORTANT: this text is require()'d as a JS module (a plain string), NOT
// read from a .txt file via fs at request time. Vercel's serverless bundler
// only bundles files it can statically detect are needed by tracing require()
// calls with literal string paths — a runtime fs.readFileSync() with a path
// built from a variable is invisible to that tracing, so the .txt file was
// silently left out of the deployed bundle and every request failed with
// "ENOENT: no such file or directory" in production (while working fine
// locally, where the file is just sitting on disk). Requiring a .js module
// with a literal path at the top of the file guarantees it's included.
const idnTkbiV3Faq = require("./_lib/known-documents/idn-tkbi-v3-faq.js");

const KNOWN_DOCUMENT_TEXTS = {
  "https://ojk.go.id/id/Publikasi/Roadmap-dan-Pedoman/Sektor-Jasa-Keuangan/Keuangan-Berkelanjutan/Documents/FAQ%20Taksonomi%20untuk%20Keuangan%20Berkelanjutan%20Indonesia%20(TKBI)%20Versi%203.pdf":
    idnTkbiV3Faq,
  "https://www.ojk.go.id/id/Publikasi/Roadmap-dan-Pedoman/Sektor-Jasa-Keuangan/Keuangan-Berkelanjutan/Documents/FAQ%20Taksonomi%20untuk%20Keuangan%20Berkelanjutan%20Indonesia%20(TKBI)%20Versi%203.pdf":
    idnTkbiV3Faq
};

const LANGUAGE_NAMES = {
  en: "English",
  sv: "Swedish (Svenska)",
  ko: "Korean (한국어)",
  es: "Spanish (Español)",
  fr: "French (Français)",
  de: "German (Deutsch)",
  ja: "Japanese (日本語)",
  zh: "Chinese (中文)",
  ar: "Arabic (العربية)",
  pt: "Portuguese (Português)"
};

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Wraps fetch() with a hard timeout via AbortController. Without this, a
// slow/hanging upstream request (or a slow fallback proxy) can run long
// enough that Vercel kills the whole function before our own try/catch
// ever gets to run — which produces a platform-level crash response that
// isn't valid JSON, and the front end has no error text to show at all
// (this is suspected to be exactly what was happening: two slow/blocked
// fetch attempts in sequence eating the entire function time budget).
async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`timed out after ${timeoutMs / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchDirect(url) {
  // Some official sources (e.g. Korean government file-download endpoints)
  // reject requests that don't look like they came from a real browser
  // navigating from their own site — no browser-like User-Agent, no Accept
  // header, no Referer. Send a fuller, more convincing header set so we
  // aren't mistaken for a generic bot and blocked with a 403.
  let origin = "";
  try { origin = new URL(url).origin + "/"; } catch (e) { /* leave blank */ }
  const upstream = await fetchWithTimeout(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "application/pdf,text/html,application/xhtml+xml,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      ...(origin ? { Referer: origin } : {})
    }
  }, 10000);
  if (!upstream.ok) {
    throw new Error(`HTTP ${upstream.status}`);
  }
  const contentType = upstream.headers.get("content-type") || "";
  const buffer = Buffer.from(await upstream.arrayBuffer());
  // Some official sources serve PDFs from download endpoints that don't end in
  // ".pdf" and don't send a "pdf" content-type (e.g. korea.kr/common/download.do).
  // Sniffing the actual file signature is the only reliable check. Per the PDF
  // spec the "%PDF-" header may appear anywhere in the first 1024 bytes (some
  // servers prepend a few extra bytes), so scan a window rather than byte 0.
  const headerWindow = buffer.subarray(0, 1024).toString("latin1");
  const isPdfBySignature = headerWindow.includes("%PDF-");

  if (contentType.includes("pdf") || url.toLowerCase().endsWith(".pdf") || isPdfBySignature) {
    const pdfParse = require("pdf-parse");
    const parsed = await pdfParse(buffer);
    return { text: (parsed.text || "").trim(), kind: "pdf", pages: parsed.numpages || null };
  }

  return { text: stripHtml(buffer.toString("utf8")), kind: "html", pages: null };
}

// Fallback for sources that block direct server-to-server fetches outright
// (some government sites appear to allow well-known crawlers like Google's
// but reject generic cloud/datacenter IPs regardless of headers sent — this
// was confirmed for at least one Korean ministry download endpoint). Routes
// the fetch through r.jina.ai, a public "reader" proxy that fetches a URL
// itself and returns clean extracted text (including from PDFs), often from
// IP ranges that aren't blocked the same way. Best-effort: if this also
// fails, we fall through to the original, more informative error.
async function fetchViaReaderProxy(url) {
  // The proxy does the actual document fetch AND text-extraction itself
  // before responding — for a large, many-page document that's genuinely
  // slow work on its end, not just network latency, so this needs a much
  // more generous budget than a normal request/response round trip.
  const proxied = await fetchWithTimeout("https://r.jina.ai/" + url, {
    headers: { "Accept": "text/plain" }
  }, 25000);
  if (!proxied.ok) {
    throw new Error(`reader proxy HTTP ${proxied.status}`);
  }
  const text = (await proxied.text() || "").trim();
  return { text, kind: "html", pages: null };
}

// Every chunk of a document is a separate serverless request, and each one
// used to re-fetch and re-parse the WHOLE document from scratch just to
// slice out a different piece of already-known text — expensive, and for
// documents that need the slow reader-proxy fallback (see above), slow
// enough on its own to risk the function running out of time before it
// even gets to the translation step. Vercel often reuses the same "warm"
// function instance for requests that arrive close together (e.g. a user
// stepping through chunk 0, 1, 2... of the same document), so a simple
// in-memory cache at module scope — which survives between invocations on
// the same warm instance, though not guaranteed and not shared across
// instances — avoids redoing that work for every chunk of the same
// document in the common case. Not a substitute for real caching, just a
// best-effort speed-up; a cold start or a different instance still means
// a fresh fetch, which is fine (it just means that one request is slower).
const extractionCache = new Map();
const EXTRACTION_CACHE_MAX_AGE_MS = 10 * 60 * 1000;

// The AbortController timeout on fetch() only bounds the network request
// itself — downloading a large response body (upstream.arrayBuffer()) and
// then parsing it (pdf-parse, which is synchronous CPU work with no timeout
// hook of its own) happen afterwards, uncovered. For an unusually large or
// complex PDF (some official documents run 100+ pages), that uncovered time
// can add up enough to risk the whole function running out of time before
// it even reaches the translation step, with no clean error to show for it.
// This wraps any promise with a hard deadline so every stage — including
// body download and parsing, not just the initial connection — is bounded.
function withTimeout(promise, timeoutMs, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs / 1000}s`)), timeoutMs))
  ]);
}

async function extractText(url) {
  const cached = extractionCache.get(url);
  if (cached && Date.now() - cached.at < EXTRACTION_CACHE_MAX_AGE_MS) {
    return cached.result;
  }

  const knownText = KNOWN_DOCUMENT_TEXTS[url];
  if (knownText) {
    const result = { text: knownText.trim(), kind: "pdf", pages: null };
    extractionCache.set(url, { result, at: Date.now() });
    return result;
  }

  let result;
  try {
    result = await withTimeout(fetchDirect(url), 32000, "Direct fetch + parse");
  } catch (directErr) {
    try {
      result = await withTimeout(fetchViaReaderProxy(url), 28000, "Reader-proxy fetch");
    } catch (proxyErr) {
      console.error(`[translate-pdf] extraction failed for ${url}: direct=${directErr.message} proxy=${proxyErr.message}`);
      throw new Error(`Could not fetch the document (${directErr.message}); fallback fetch also failed (${proxyErr.message}). The source site may be blocking automated requests.`);
    }
  }

  extractionCache.set(url, { result, at: Date.now() });
  return result;
}

// Safety net: if extraction produced text that's mostly unprintable/control
// characters (a sign we accidentally read raw binary as if it were text —
// e.g. an undetected PDF, image, or other non-text file), don't hand that to
// the model. Count replacement/control characters in a sample of the text.
function looksLikeBinaryGarbage(text) {
  const sample = text.slice(0, 2000);
  if (!sample) return false;

  let bad = 0;
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    // allow common whitespace; count other control chars and the Unicode
    // replacement character (0xFFFD, produced by decoding invalid bytes) as "bad"
    if (code === 0xfffd || (code < 32 && code !== 9 && code !== 10 && code !== 13)) {
      bad++;
    }
  }
  if (bad / sample.length > 0.02) return true; // more than 2% control/garbage chars

  // Some design-tool-generated PDFs (e.g. an Illustrator-made cover page) have
  // no real control characters — the "text" pdf-parse pulls out is still just
  // literal PDF/design scaffolding (object markers, XMP metadata, font/color
  // definitions) rather than document prose. Count how much of the sample is
  // made of these known structural tokens; if it's a large share, this isn't
  // readable content even though it "looks like" plain text.
  const structuralTokens = /\b(obj|endobj|stream|endstream|xref|trailer|xmp|xmpmeta|rdf|cmyk|gotham|illustrator|colorswatch|flatedecode|sandoll)\b/gi;
  const tokenMatches = sample.match(structuralTokens) || [];
  const tokenCharCount = tokenMatches.join("").length;
  if (tokenCharCount / sample.length > 0.05) return true; // >5% of sample is structural jargon

  return false;
}

module.exports = async function handler(req, res) {
  // Top-level safety net: guarantees a clean JSON error response (with a
  // real message) even if something throws somewhere we didn't anticipate,
  // instead of Vercel's own generic crash page reaching the browser as an
  // unparseable response (which the front end then shows as a vague
  // "couldn't translate" fallback with no way to diagnose it).
  try {
    await handleTranslateRequest(req, res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Unexpected server error: " + (err && err.message ? err.message : String(err)) });
    }
  }
};

async function handleTranslateRequest(req, res) {
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

  const url = String(body.url || "").trim();
  const langCode = LANGUAGE_NAMES[body.lang] ? body.lang : "en";
  const requestedChunkIndex = Number.isInteger(body.chunkIndex) ? body.chunkIndex : parseInt(body.chunkIndex, 10);
  const chunkIndex = Number.isFinite(requestedChunkIndex) && requestedChunkIndex >= 0 ? requestedChunkIndex : 0;

  if (!url || !/^https?:\/\//i.test(url)) {
    res.status(400).json({ error: "Missing or invalid 'url' in request body." });
    return;
  }

  let extracted;
  try {
    extracted = await extractText(url);
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch or read the document: " + err.message });
    return;
  }

  if (!extracted.text || extracted.text.length < 20 || looksLikeBinaryGarbage(extracted.text)) {
    res.status(200).json({
      error: extracted.kind === "pdf"
        ? "This PDF appears to be a scanned image with no selectable text layer, so it can't be machine-translated. Please refer to the original document."
        : "This document's raw content couldn't be read as text (it may be a non-text file format the server didn't identify correctly). Please refer to the original document.",
      // Temporary diagnostic info (safe to show — not sent to the AI): helps
      // pinpoint why extraction failed without needing server log access.
      debugKind: extracted.kind,
      debugSample: (extracted.text || "").slice(0, 150)
    });
    return;
  }

  const truncatedOverall = extracted.text.length > MAX_TOTAL_CHARS;
  const totalChars = Math.min(extracted.text.length, MAX_TOTAL_CHARS);
  const totalChunks = Math.max(1, Math.ceil(totalChars / CHUNK_CHARS));
  const safeChunkIndex = Math.min(chunkIndex, totalChunks - 1);
  const chunkStart = safeChunkIndex * CHUNK_CHARS;
  const chunkEnd = Math.min(chunkStart + CHUNK_CHARS, totalChars);
  const sourceText = extracted.text.slice(chunkStart, chunkEnd);
  const isFirstChunk = safeChunkIndex === 0;
  const isLastChunk = safeChunkIndex === totalChunks - 1;
  const languageName = LANGUAGE_NAMES[langCode];

  const systemPrompt = [
    `You are translating an official government/regulatory document about a sustainable finance taxonomy into ${languageName}.`,
    totalChunks > 1
      ? `This is part ${safeChunkIndex + 1} of ${totalChunks} of a longer document, being translated section by section and reassembled by the reader's app. Translate only the text given below — do not summarize, and do not add any introduction, recap, or conclusion of your own.`
      : "Produce an accurate, complete translation of the text provided.",
    "Preserve headings, numbering, and paragraph structure where present, using Markdown formatting (## for headings, numbered/bulleted lists) so it reads clearly.",
    "Keep a formal, precise register appropriate to a legal/regulatory document. Do not omit or add commentary — translate what is given, faithfully and completely.",
    !isFirstChunk ? "This text continues directly from a previous part with no gap — if it begins mid-sentence or mid-paragraph, translate it as a continuation rather than starting a new heading or introduction." : "",
    !isLastChunk ? "This text continues into a further part after this one — if it ends mid-sentence or mid-paragraph, translate up to that exact cutoff point rather than inventing an ending." : "",
    isLastChunk && truncatedOverall ? `The source document was capped at ${MAX_TOTAL_CHARS} characters (out of ${extracted.text.length} total) as a sanity limit; translate only what is provided and do not invent an ending.` : "",
    "If the source text is fragmented or contains OCR artifacts, translate as faithfully as possible and don't try to silently 'fix' apparent errors beyond normal translation judgment."
  ].filter(Boolean).join("\n");

  try {
    const upstream = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: "user", content: sourceText }]
      })
    }, 65000);

    const data = await upstream.json();

    if (!upstream.ok) {
      const msg = (data && data.error && data.error.message) || `Upstream API error (HTTP ${upstream.status})`;
      console.error(`[translate-pdf] Anthropic API error for chunk ${safeChunkIndex}: ${msg}`);
      res.status(upstream.status).json({ error: msg });
      return;
    }

    const translatedText = Array.isArray(data.content)
      ? data.content.map(block => block.text || "").join("\n").trim()
      : "";

    res.status(200).json({
      translatedText: translatedText || "(The model returned an empty response.)",
      chunkIndex: safeChunkIndex,
      totalChunks,
      isLastChunk,
      truncatedOverall,
      sourceChars: extracted.text.length,
      pages: extracted.pages,
      lang: langCode
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach the AI provider: " + err.message });
  }
};
