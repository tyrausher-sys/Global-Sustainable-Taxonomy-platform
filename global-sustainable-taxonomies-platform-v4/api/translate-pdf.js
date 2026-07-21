/* /api/translate-pdf.js — Vercel serverless function (Node.js runtime)
 *
 * Lets a reader translate an official taxonomy document (PDF or HTML page)
 * into their selected site language, using the same Claude backend that
 * powers "Ask AI" (reads ANTHROPIC_API_KEY — no separate key needed).
 *
 * The front end (country.js, "Translate" button next to each official
 * document) POSTs { url, lang } here and gets back
 * { translatedText, truncated, sourceChars, lang }.
 *
 * How it works:
 *   1. Fetch the document from `url` server-side (browsers can't reliably
 *      fetch cross-origin PDFs, and we don't want to expose the Anthropic
 *      key to the browser anyway).
 *   2. If it's a PDF, extract raw text with `pdf-parse`. If it's HTML,
 *      strip tags down to plain text. If the PDF is a scanned image with no
 *      embedded text layer, pdf-parse returns little/nothing — we surface
 *      that honestly rather than pretending to translate empty content.
 *   3. Truncate to a safe length (long legal PDFs can run 50+ pages — well
 *      beyond what's useful or affordable to translate in one request) and
 *      say so plainly in the response.
 *   4. Ask Claude to translate the extracted text into the requested
 *      language, preserving headings/structure/numbering where present and
 *      keeping a formal, legal-document register.
 *
 * This is a machine translation of an official source, not a substitute for
 * it — the front end always keeps a link to the original PDF alongside the
 * translation and says so in the UI.
 */

const MAX_SOURCE_CHARS = 14000; // keeps request + response comfortably inside Vercel's serverless limits

const LANGUAGE_NAMES = {
  en: "English",
  sv: "Swedish (Svenska)",
  ko: "Korean (한국어)",
  es: "Spanish (Español)",
  fr: "French (Français)",
  de: "German (Deutsch)",
  ja: "Japanese (日本語)",
  zh: "Chinese (中文)"
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

async function extractText(url) {
  const upstream = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; GlobalSustainableTaxonomiesBot/1.0)" }
  });
  if (!upstream.ok) {
    throw new Error(`Could not fetch the document (HTTP ${upstream.status}).`);
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
  const structuralTokens = /\b(obj|endobj|stream|endstream|xref|trailer|xmpmeta|rdf:|cmyk|gotham|illustrator|colorswatch)\b/gi;
  const tokenMatches = sample.match(structuralTokens) || [];
  const tokenCharCount = tokenMatches.join("").length;
  if (tokenCharCount / sample.length > 0.08) return true; // >8% of sample is structural jargon

  return false;
}

module.exports = async function handler(req, res) {
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

  const truncated = extracted.text.length > MAX_SOURCE_CHARS;
  const sourceText = extracted.text.slice(0, MAX_SOURCE_CHARS);
  const languageName = LANGUAGE_NAMES[langCode];

  const systemPrompt = [
    `You are translating an official government/regulatory document about a sustainable finance taxonomy into ${languageName}.`,
    "Produce an accurate, complete translation of the text provided. Preserve headings, numbering, and paragraph structure where present, using Markdown formatting (## for headings, numbered/bulleted lists) so it reads clearly.",
    "Keep a formal, precise register appropriate to a legal/regulatory document. Do not summarize, omit, or add commentary — translate what is given.",
    truncated ? `The source text was truncated to the first ${MAX_SOURCE_CHARS} characters of the document (out of ${extracted.text.length}); translate only what is provided and do not invent an ending.` : "",
    "If the source text is fragmented or contains OCR artifacts, translate as faithfully as possible and don't try to silently 'fix' apparent errors beyond normal translation judgment."
  ].filter(Boolean).join("\n");

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
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
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const msg = (data && data.error && data.error.message) || `Upstream API error (HTTP ${upstream.status})`;
      res.status(upstream.status).json({ error: msg });
      return;
    }

    const translatedText = Array.isArray(data.content)
      ? data.content.map(block => block.text || "").join("\n").trim()
      : "";

    res.status(200).json({
      translatedText: translatedText || "(The model returned an empty response.)",
      truncated,
      sourceChars: extracted.text.length,
      pages: extracted.pages,
      lang: langCode,
      // Temporary diagnostic info (safe, not sent to the AI) so we can see
      // exactly what was extracted without needing server log access.
      debugKind: extracted.kind,
      debugSample: extracted.text.slice(0, 200)
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach the AI provider: " + err.message });
  }
};
