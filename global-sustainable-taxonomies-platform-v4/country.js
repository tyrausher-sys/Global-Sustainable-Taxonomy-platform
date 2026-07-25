/* Global Sustainable Taxonomy Website — Country Page */

const STATUS_LABEL = { established: "Developed", developing: "Under Development", none: "No Taxonomy" };

function bucketStatus(raw) {
  return (raw === "established" || raw === "developing") ? raw : "none";
}

const ICONS = {
  climate: '<path d="M12 3v6m0 6v6M4.2 4.2l4.2 4.2m7.2 7.2l4.2 4.2M3 12h6m6 0h6M4.2 19.8l4.2-4.2m7.2-7.2l4.2-4.2"/>',
  "climate-adapt": '<path d="M12 2l3 6-3 2-3-2 3-6z"/><path d="M5 22c1.5-4 4-6 7-6s5.5 2 7 6"/>',
  water: '<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z"/>',
  circular: '<path d="M4 9a8 8 0 0 1 14-4M20 15a8 8 0 0 1-14 4"/><path d="M17 2v4h-4M7 22v-4h4"/>',
  pollution: '<path d="M4 15a4 4 0 0 1 4-4h.3A5 5 0 0 1 18 9a4 4 0 0 1-.5 8H8a4 4 0 0 1-4-2z"/>',
  biodiversity: '<path d="M12 2c-3 3-4 6-4 9a4 4 0 0 0 8 0c0-3-1-6-4-9z"/><path d="M8 20c1-2 2-3 4-3s3 1 4 3"/>',
  energy: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',
  industry: '<path d="M3 21V10l6 4v-4l6 4V7l6-4v18H3z"/>',
  digital: '<rect x="4" y="4" width="16" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
  "carbon-capture": '<path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 3v6M21 12h-6"/>'
};
function icon(name) {
  return `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

// When a country has its own national taxonomy *and* is also covered by a
// regional overlay framework (ASEAN, UMOA, LAC Common Framework, etc.), make
// that dual coverage visible right in the header — not just buried in the
// "Also Applies" section further down the page.
function overlayHeaderTags(entry) {
  if (!entry || !entry.taxonomy || !entry.overlays || !entry.overlays.length) return "";
  const names = entry.overlays
    .map(o => o && o.name)
    .filter(n => n && !entry.taxonomy.includes(n));
  if (!names.length) return "";
  return names.map(n => `<span class="header-overlay-tag">+ ${escapeHtml(n)}</span>`).join("");
}

function renderHeader(entry, status, label, name) {
  const taxonomyName = entry && entry.taxonomy ? entry.taxonomy : "No taxonomy established";
  const overlayTags = overlayHeaderTags(entry);
  return `
    <section class="country-header-dark">
      <div class="country-header-inner">
        <div class="country-header-row">
          <div class="country-header-titles">
            <span class="badge badge-${status}">${label}</span>
            <h1>${name}</h1>
            <p class="country-header-sub">${taxonomyName}${entry && entry.year ? " · Published " + entry.year : ""}${overlayTags}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function overviewTable(entry, name, label) {
  const rows = [
    ["Country", name],
    ["Taxonomy Name", entry && entry.taxonomy ? entry.taxonomy : "Not established"],
    ["Status", label],
    ["Regulator", entry && entry.regulator ? entry.regulator : "Not publicly specified"],
    ["Year Published", entry && entry.year ? entry.year : "Not specified"],
    ["Region", entry && entry.region ? entry.region : "Not specified"]
  ];
  let html = `<table class="overview-table"><tbody>`;
  rows.forEach(([k, v]) => { html += `<tr><th>${k}</th><td>${v}</td></tr>`; });
  html += `</tbody></table>`;
  return html;
}

function objectivesSection(entry) {
  const objs = (entry && entry.objectives && entry.objectives.length) ? entry.objectives : null;
  if (!objs) {
    return `<p class="data-not-available">Not yet documented for this taxonomy.</p>`;
  }
  let html = `<ol class="objective-pills">`;
  objs.forEach((o, i) => {
    html += `<li><span class="pill-num">${i + 1}</span>${icon(o.icon)}<span>${o.label}</span></li>`;
  });
  html += `</ol>`;
  return html;
}

function criteriaTable(entry) {
  const real = entry && entry.activityList && entry.activityList.length;
  let html = "";

  if (real) {
    html += `<table class="criteria-table"><thead><tr><th>Activity</th><th>Screening Criteria</th><th>Threshold</th><th>DNSH</th></tr></thead><tbody>`;
    entry.activityList.forEach(a => {
      html += `<tr><td>${a.activity}</td><td>${a.criteria || "See official documentation"}</td><td>${a.threshold || "See official documentation"}</td><td>${a.dnsh || "Applies"}</td></tr>`;
    });
    html += `</tbody></table>`;
  } else {
    html += `<p class="data-not-available">Not yet documented for this taxonomy.</p>`;
  }

  if (entry && entry.source) {
    html += `<a class="btn-download" href="${entry.source}" target="_blank" rel="noopener">View All Criteria (Official Source) ↗</a>`;
  }
  return html;
}

function escapeAttr(s) {
  return String(s || "")
    .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Honest, site-wide date reflecting when the underlying dataset (data.js)
// was last substantively compiled/reviewed — not a per-country claim we
// can't verify, just a factual statement about this data file.
const DATA_LAST_REVIEWED = "2026-07-20";

// Turns inline "[1]", "[2]" markers written in fullDescription/features text into
// small superscript links pointing at the matching entry in that country's
// "citations" array (rendered via citationsListHtml). If the country has no
// citations array, markers are left as plain text (shouldn't normally happen).
function linkifyCitations(text) {
  return String(text).replace(/\[(\d+)\]/g, (m, n) => `<sup class="citation-mark"><a href="#cite-${n}">[${n}]</a></sup>`);
}

function citationsListHtml(entry) {
  if (!entry || !entry.citations || !entry.citations.length) return "";
  const items = entry.citations.map(c =>
    `<li id="cite-${c.id}">${c.id}. ${escapeHtml(c.label)}${c.url ? ` — <a href="${c.url}" target="_blank" rel="noopener">source ↗</a>` : ""}</li>`
  ).join("");
  return `<div class="citations-block"><h3>References</h3><ol class="citations-list">${items}</ol></div>`;
}

function sourcesNote() {
  const t = (typeof gstT === "function") ? gstT : (k => k);
  return `<p class="sources-note">${t("sources.note")} <span class="sources-reviewed">${t("sources.lastReviewed")} ${DATA_LAST_REVIEWED}</span></p>`;
}

// Cross-cutting reference resources — each one only actually documents a specific
// taxonomy family, so it's only relevant on the country page(s) for that family,
// not every country page. The full list (with descriptions) is always available
// on the About page (about.html#key-resources) via the footer "References" link.
const EU_TAXONOMY_COUNTRY_CODES = [
  "AUT","BEL","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA","DEU","GRC",
  "HUN","IRL","ITA","LVA","LTU","LUX","MLT","NLD","POL","PRT","ROU","SVK","SVN","ESP","SWE"
];

function relevantGeneralResources(iso, entry) {
  const resources = [];
  if (EU_TAXONOMY_COUNTRY_CODES.includes(iso)) {
    resources.push({ name: "EU Taxonomy", url: "https://finance.ec.europa.eu/sustainable-finance/tools-and-standards/eu-taxonomy-sustainable-activities_en" });
  }
  if (iso === "KOR") {
    resources.push({ name: "K-Taxonomy", url: "https://www.investkorea.org/upload/kotraexpress/2022/03/images/Special_Report.pdf" });
  }
  return resources;
}

function generalResourcesHtml(iso, entry) {
  const resources = relevantGeneralResources(iso, entry);
  if (!resources.length) return "";
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const items = resources.map(r =>
    `<li><a href="${r.url}" target="_blank" rel="noopener">${escapeHtml(r.name)} ↗</a></li>`
  ).join("");
  return `<div class="country-general-resources"><h3>${t("country.generalResources")}</h3><ul>${items}</ul></div>`;
}

function officialDocumentsSection(entry) {
  if (entry && entry.officialDocuments && entry.officialDocuments.length) {
    let html = `<ul class="docs-list">`;
    entry.officialDocuments.forEach(d => {
      html += `<li><a href="${d.url}" target="_blank" rel="noopener">${d.title}</a>${d.date ? `<span class="docs-date">${d.date}</span>` : ""} <button class="doc-translate-btn" type="button" data-doc-url="${escapeAttr(d.url)}" data-doc-title="${escapeAttr(d.title)}" data-i18n="translate.button">Translate</button></li>`;
    });
    html += `</ul>`;
    return html;
  }
  if (entry && entry.source) {
    return `
      <a class="source-card" href="${entry.source}" target="_blank" rel="noopener">
        <span class="dot established"></span>
        <span><strong>Official source:</strong> ${entry.regulator ? entry.regulator + " — " : ""}${entry.taxonomy || entry.name}</span>
        <svg class="arrow-out" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
      </a>
      <button class="doc-translate-btn" type="button" style="margin-left:0; margin-top:6px;" data-doc-url="${escapeAttr(entry.source)}" data-doc-title="${escapeAttr(entry.taxonomy || entry.name)}" data-i18n="translate.button">Translate</button>
      <p class="sample-note">Only a single general source link has been compiled for this country so far — a fuller list of official documents may be added later.</p>
    `;
  }
  return `<p class="sample-note">No official source link has been compiled for this country yet.</p>`;
}

function mediaFeed(entry) {
  let html = `<ul class="media-feed">`;
  if (entry && entry.source) {
    html += `<li><span class="media-tag">Document</span><a href="${entry.source}" target="_blank" rel="noopener">${entry.regulator ? entry.regulator + " — " : ""}Official Taxonomy Documentation</a>${entry.year ? `<span class="media-date">${entry.year}</span>` : ""}</li>`;
  }
  if (entry && entry.overlays && entry.overlays.length) {
    entry.overlays.forEach(o => {
      if (o.source) {
        html += `<li><span class="media-tag">Regional</span><a href="${o.source}" target="_blank" rel="noopener">${o.name}</a></li>`;
      }
    });
  }
  html += `<li class="media-placeholder">More updates coming soon</li>`;
  html += `</ul>`;
  return html;
}

function aiChatBoxHtml() {
  return `
    <div class="chat-log chat-log-compact" id="countryChatLog"></div>
    <div class="chat-examples" id="countryChatExamples"></div>
    <form class="chat-input-row" id="countryChatForm">
      <textarea id="countryChatInput" rows="2" placeholder="Ask a question…"></textarea>
      <button class="btn-primary" type="submit" id="countryChatSendBtn">Send</button>
    </form>
    <p class="sample-note">Calls a real AI model through a secure backend. If it doesn't respond, this site may not be deployed with an API key yet — see DEPLOY_INSTRUCTIONS.md.</p>
  `;
}

let countryChatHistory = [];
let countryChatBusy = false;
let countryChatWelcome = "Ask anything about this taxonomy.";

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderCountryChatLog() {
  const log = document.getElementById("countryChatLog");
  if (!log) return;
  const welcome = `<div class="chat-welcome">${countryChatWelcome}</div>`;
  const msgs = countryChatHistory.map(m => `
    <div class="chat-msg chat-msg-${m.role}">
      <div class="chat-bubble${m.pending ? " chat-bubble-pending" : ""}${m.error ? " chat-bubble-error" : ""}">${escapeHtml(m.content).replace(/\n/g, "<br>")}</div>
    </div>
  `).join("");
  log.innerHTML = countryChatHistory.length ? msgs : welcome;
  log.scrollTop = log.scrollHeight;
}

async function sendCountryChatMessage(question) {
  if (countryChatBusy) return;
  countryChatBusy = true;
  const sendBtn = document.getElementById("countryChatSendBtn");
  if (sendBtn) sendBtn.disabled = true;

  countryChatHistory.push({ role: "user", content: question });
  countryChatHistory.push({ role: "assistant", content: "Thinking…", pending: true });
  renderCountryChatLog();

  const historyForApi = countryChatHistory.slice(0, -2).map(m => ({ role: m.role, content: m.content }));

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, history: historyForApi })
    });
    let data;
    try { data = await res.json(); } catch (e) { data = {}; }

    countryChatHistory.pop();
    if (!res.ok) {
      countryChatHistory.push({
        role: "assistant",
        error: true,
        content: (data && data.error) || "This site doesn't seem to be deployed with the AI backend yet — see DEPLOY_INSTRUCTIONS.md."
      });
    } else {
      countryChatHistory.push({ role: "assistant", content: data.answer || "(no response)" });
    }
  } catch (err) {
    countryChatHistory.pop();
    countryChatHistory.push({
      role: "assistant",
      error: true,
      content: "Couldn't reach the AI backend (" + err.message + "). If you're opening this file directly rather than visiting a deployed Vercel URL, this chat isn't available yet — see DEPLOY_INSTRUCTIONS.md."
    });
  }

  renderCountryChatLog();
  countryChatBusy = false;
  if (sendBtn) sendBtn.disabled = false;
}

function setupCountryChat(name, taxonomy) {
  const form = document.getElementById("countryChatForm");
  if (!form) return;

  countryChatWelcome = `Ask anything about ${name}'s taxonomy — including how it compares to others, like the EU taxonomy or South Korea's K-Taxonomy.`;
  renderCountryChatLog();

  const examples = [
    `Compare ${name}'s taxonomy to the EU taxonomy`,
    `What are the key screening criteria under ${taxonomy || name + "'s taxonomy"}?`,
    `What documentation would I need to demonstrate compliance here?`,
    `Which other countries have similar taxonomies to ${name}?`
  ];
  const examplesWrap = document.getElementById("countryChatExamples");
  examplesWrap.innerHTML = examples.map(q => `<button class="example-card" type="button">${q}</button>`).join("");
  examplesWrap.querySelectorAll(".example-card").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      document.getElementById("countryChatInput").value = examples[i];
      document.getElementById("countryChatInput").focus();
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("countryChatInput");
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    sendCountryChatMessage(q);
  });
  document.getElementById("countryChatInput").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
}

/* ---------- Compare With Another Taxonomy (data-driven, no AI needed) ---------- */

function yn(v) {
  return v === true ? "Yes" : v === false ? "No" : "Not specified";
}

function compareRow(label, a, b) {
  return `<tr><th>${label}</th><td>${a}</td><td>${b}</td></tr>`;
}

function compareValues(entry) {
  const f = (entry && entry.facts) || {};
  return {
    taxonomy: entry && entry.taxonomy ? entry.taxonomy : "No taxonomy established",
    status: STATUS_LABEL[bucketStatus(entry ? entry.status : "none")],
    year: entry && entry.year ? entry.year : "Not specified",
    regulator: entry && entry.regulator ? entry.regulator : "Not publicly specified",
    region: entry && entry.region ? entry.region : "Not specified",
    mandatory: f.mandatory || "Not specified",
    dnsh: yn(f.dnsh),
    safeguards: yn(f.minimumSafeguards),
    objectives: (entry && entry.objectives && entry.objectives.length) ? entry.objectives.map(o => o.label).join(", ") : "Not documented",
    sectors: (entry && entry.sectors && entry.sectors.length) ? entry.sectors.join(", ") : "Not documented"
  };
}

function renderCompareTable(nameA, entryA, nameB, entryB) {
  const a = compareValues(entryA);
  const b = compareValues(entryB);
  let html = `<table class="compare-table"><thead><tr><th></th><th>${nameA}</th><th>${nameB}</th></tr></thead><tbody>`;
  html += compareRow("Taxonomy Name", a.taxonomy, b.taxonomy);
  html += compareRow("Status", a.status, b.status);
  html += compareRow("Year Published", a.year, b.year);
  html += compareRow("Regulator", a.regulator, b.regulator);
  html += compareRow("Region", a.region, b.region);
  html += compareRow("Mandatory / Voluntary", a.mandatory, b.mandatory);
  html += compareRow("Requires DNSH", a.dnsh, b.dnsh);
  html += compareRow("Requires Minimum Safeguards", a.safeguards, b.safeguards);
  html += compareRow("Environmental Objectives", a.objectives, b.objectives);
  html += compareRow("Sectors Covered", a.sectors, b.sectors);
  html += `</tbody></table>`;
  return html;
}

function pickDefaultCompareIso(currentIso) {
  if (currentIso !== "KOR" && window.TAXONOMY_DATA.KOR) return "KOR";
  if (window.TAXONOMY_DATA.DEU) return "DEU";
  const other = Object.keys(window.TAXONOMY_DATA).find(k => k !== currentIso);
  return other || currentIso;
}

function compareBlockHtml(iso, name) {
  return `
    <div class="compare-controls">
      <label for="compareSelect">Compare ${name}'s taxonomy with:</label>
      <select id="compareSelect"></select>
    </div>
    <div id="compareResult"></div>
  `;
}

function setupCompare(iso, name) {
  const sel = document.getElementById("compareSelect");
  if (!sel) return;

  Object.keys(window.TAXONOMY_DATA)
    .map(k => ({ iso: k, name: window.TAXONOMY_DATA[k].name }))
    .filter(c => c.iso !== iso)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.iso;
      opt.textContent = c.name;
      sel.appendChild(opt);
    });

  const defaultIso = pickDefaultCompareIso(iso);
  sel.value = defaultIso;

  function update() {
    const targetIso = sel.value;
    const targetEntry = window.TAXONOMY_DATA[targetIso];
    const targetName = targetEntry ? targetEntry.name : targetIso;
    document.getElementById("compareResult").innerHTML =
      renderCompareTable(name, window.TAXONOMY_DATA[iso], targetName, targetEntry);
  }

  sel.addEventListener("change", update);
  update();
}

/* ---------- Live content translation ----------
   The global nav language selector (global.js) only translates static UI
   chrome (nav labels, headings, buttons). The actual researched content for
   each country — description paragraphs, environmental objective labels,
   activity-table cells, overlay text — is still English in data.js, since
   hand-translating that for 107 countries × every language isn't something
   that can be done reliably at this scale. Instead, when a non-English
   language is selected, we translate that content live via the same AI
   backend that powers "Ask AI" and the document Translate button, cache the
   result per country+language for the rest of the session, and fall back to
   English (silently) if the request fails — the page never breaks, it just
   stays in English if translation isn't available. Proper nouns and
   anything that must stay verifiable against the original — country names,
   taxonomy titles, regulator names, official document titles, citation
   labels, and all URLs — are deliberately NOT sent through this pipeline. */

const gstCountryTranslationCache = {};

function extractTranslatable(entry) {
  const items = [];
  const manifest = [];
  if (entry.note) { manifest.push({ type: "note" }); items.push(entry.note); }
  (entry.fullDescription || []).forEach((p, i) => { manifest.push({ type: "fullDescription", i }); items.push(p); });
  (entry.objectives || []).forEach((o, i) => { manifest.push({ type: "objective", i }); items.push(o.label || ""); });
  (entry.activityList || []).forEach((a, i) => {
    ["activity", "criteria", "threshold", "dnsh"].forEach(f => {
      manifest.push({ type: "activity", i, f });
      items.push(a[f] || "");
    });
  });
  (entry.overlays || []).forEach((o, oi) => {
    manifest.push({ type: "overlayScope", oi });
    items.push(o.scope || "");
    (o.features || []).forEach((feat, fi) => {
      manifest.push({ type: "overlayFeature", oi, fi });
      items.push(feat);
    });
  });
  return { items, manifest };
}

function applyTranslated(entry, manifest, translated) {
  const clone = JSON.parse(JSON.stringify(entry));
  manifest.forEach((m, idx) => {
    const val = translated[idx];
    if (val === undefined || val === null) return;
    if (m.type === "note") clone.note = val;
    else if (m.type === "fullDescription") clone.fullDescription[m.i] = val;
    else if (m.type === "objective") clone.objectives[m.i].label = val;
    else if (m.type === "activity") clone.activityList[m.i][m.f] = val;
    else if (m.type === "overlayScope") clone.overlays[m.oi].scope = val;
    else if (m.type === "overlayFeature") clone.overlays[m.oi].features[m.fi] = val;
  });
  return clone;
}

async function maybeTranslateAndRender() {
  const params = new URLSearchParams(window.location.search);
  const iso = (params.get("iso") || "").toUpperCase();
  const entry = window.TAXONOMY_DATA ? window.TAXONOMY_DATA[iso] : null;
  const lang = (typeof gstCurrentLang !== "undefined" && gstCurrentLang) ? gstCurrentLang : "en";

  if (!entry || lang === "en") { renderCountry(entry); return; }

  const cacheKey = iso + "::" + lang;
  if (gstCountryTranslationCache[cacheKey]) { renderCountry(gstCountryTranslationCache[cacheKey]); return; }

  renderCountry(entry); // show English immediately, don't block on the network
  const el = document.getElementById("countryContent");
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const banner = document.createElement("div");
  banner.className = "content-translating-banner";
  banner.textContent = t("country.translatingContent");
  if (el.firstChild) el.insertBefore(banner, el.firstChild); else el.appendChild(banner);

  try {
    const { items, manifest } = extractTranslatable(entry);
    if (!items.length) return;
    const res = await fetch("/api/translate-content", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items, lang })
    });
    const data = await res.json();
    if (!res.ok || !Array.isArray(data.translated)) throw new Error((data && data.error) || "Translation failed");

    const translatedEntry = applyTranslated(entry, manifest, data.translated);
    gstCountryTranslationCache[cacheKey] = translatedEntry;

    // Only redraw if the user hasn't since navigated away or switched language again
    const stillSameIso = (new URLSearchParams(window.location.search).get("iso") || "").toUpperCase() === iso;
    const stillSameLang = (typeof gstCurrentLang !== "undefined" ? gstCurrentLang : "en") === lang;
    if (stillSameIso && stillSameLang) renderCountry(translatedEntry);
  } catch (err) {
    console.warn("Country content translation failed, showing English content:", err);
    // Already rendered English above — nothing more to do.
  }
}

function renderCountry(entryOverride) {
  const params = new URLSearchParams(window.location.search);
  const iso = (params.get("iso") || "").toUpperCase();
  const headerEl = document.getElementById("countryHeader");
  const el = document.getElementById("countryContent");
  const entry = entryOverride !== undefined ? entryOverride : window.TAXONOMY_DATA[iso];

  if (!iso) {
    headerEl.innerHTML = "";
    el.innerHTML = `<h1 class="report-title">No country selected</h1><p class="lede">Go back to the map and click on a country to view its taxonomy profile.</p>`;
    return;
  }

  const name = entry ? entry.name : iso;
  const status = bucketStatus(entry ? entry.status : "none");
  const label = STATUS_LABEL[status];

  headerEl.innerHTML = renderHeader(entry, status, label, name);

  let left = "";

  left += `<div class="card-block"><h2>Taxonomy Overview</h2>${overviewTable(entry, name, label)}</div>`;

  if (entry && entry.fullDescription && entry.fullDescription.length) {
    left += `<div class="card-block"><h2>About the Taxonomy</h2>` +
      entry.fullDescription.map(p => `<p class="section-text">${linkifyCitations(p)}</p>`).join("") +
      citationsListHtml(entry) + `</div>`;
  } else if (entry && entry.note) {
    left += `<div class="card-block"><h2>About the Taxonomy</h2><p class="section-text">${entry.note}</p><p class="sample-note">Limited public information compiled so far — this summary may be expanded as more sources are reviewed.</p></div>`;
  } else if (!entry) {
    left += `<div class="card-block"><p class="section-text">No taxonomy data has been compiled for this country yet.</p></div>`;
  }

  left += `<div class="card-block"><h2>Official Documents</h2>${officialDocumentsSection(entry)}${sourcesNote()}${generalResourcesHtml(iso, entry)}</div>`;
  left += `<div class="card-block"><h2>Environmental Objectives</h2>${objectivesSection(entry)}</div>`;
  left += `<div class="card-block"><h2>Technical Screening Criteria</h2>${criteriaTable(entry)}</div>`;

  if (entry && entry.overlays && entry.overlays.length) {
    left += `<div class="card-block"><h2>Also Applies</h2>` + entry.overlays.map(o =>
      `<div class="overlay-item"><strong>${o.name}</strong><br/>${o.scope}${o.source ? ` — <a href="${o.source}" target="_blank" rel="noopener">source</a>` : ""}</div>`
    ).join("") + `</div>`;
  }

  let right = "";
  right += `<div class="card-block"><h2>Related Media &amp; Updates</h2>${mediaFeed(entry)}</div>`;
  right += `<div class="card-block"><h2>AI Compliance Chat</h2>${aiChatBoxHtml()}</div>`;

  el.innerHTML = `
    <div class="country-columns">
      <div class="country-col-left">${left}</div>
      <div class="country-col-right">${right}</div>
    </div>

    <div class="card-block compare-block">
      <h2>Compare With Another Taxonomy</h2>
      ${compareBlockHtml(iso, name)}
    </div>

    <div class="country-footer-actions">
      <a class="btn-secondary" href="advisor.html?mode=compare">Compare All Countries</a>
    </div>
  `;

  setupCountryChat(name, entry && entry.taxonomy);
  setupCompare(iso, name);
}

/* ---------- Translate document modal ---------- */

/* Very small Markdown-ish renderer for the translated text Claude returns
   (## headings, numbered/bulleted lists, blank-line paragraphs, **bold**).
   Not a full Markdown parser — just enough to make a translated legal
   document readable in the modal without pulling in a dependency. */
function renderTranslatedMarkdown(text) {
  const escapeHtml = s => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = String(text || "").split("\n");
  let html = "";
  let inList = null; // "ul" | "ol" | null
  const closeList = () => { if (inList) { html += `</${inList}>`; inList = null; } };

  lines.forEach(raw => {
    const line = raw.trim();
    if (!line) { closeList(); return; }

    let m;
    if ((m = line.match(/^#{1,3}\s+(.*)$/))) {
      closeList();
      html += `<h3>${escapeHtml(m[1])}</h3>`;
      return;
    }
    if ((m = line.match(/^[-*]\s+(.*)$/))) {
      if (inList !== "ul") { closeList(); html += "<ul>"; inList = "ul"; }
      html += `<li>${escapeHtml(m[1])}</li>`;
      return;
    }
    if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
      if (inList !== "ol") { closeList(); html += "<ol>"; inList = "ol"; }
      html += `<li>${escapeHtml(m[1])}</li>`;
      return;
    }
    closeList();
    const withBold = escapeHtml(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html += `<p>${withBold}</p>`;
  });
  closeList();
  return html || `<p>${escapeHtml(text)}</p>`;
}

// Tracks which document is currently open in the modal, so the language
// picker can re-request a translation without needing the button's dataset.
let gstTranslateActiveUrl = null;
let gstTranslateActiveTitle = null;
// Bumped every time a new translation run starts (open, or language change).
// A running chunk loop checks this before applying each chunk, so an old,
// still-in-flight run can't overwrite a newer one's output if the reader
// switches language mid-translation.
let gstTranslateRequestId = 0;

// Populates the modal's own language <select> from the same GST_LANGUAGES
// list the sitewide language switcher uses (defined in global.js, loaded
// before this file in every built page), so a document can be translated
// into any language the site supports — independent of the site's current
// display language. Only needs to run once per page load.
function populateTranslateLangSelect() {
  const sel = document.getElementById("translateLangSelect");
  if (!sel || sel.dataset.populated) return;
  if (typeof GST_LANGUAGES === "undefined") return;
  sel.innerHTML = GST_LANGUAGES.map(l => `<option value="${l.code}">${l.label}</option>`).join("");
  sel.dataset.populated = "1";
}

// Rough heuristic for "does this URL point at a PDF" — used to decide how to
// embed the original document (see openTranslateModal below). Mirrors the
// pattern already used elsewhere in the project for the same purpose.
function looksLikePdf(url) {
  return /\.pdf(\?|$)/i.test(url) || /\/pdf\//i.test(url) || /[?&](format|type)=pdf/i.test(url);
}

// Translates the WHOLE document, not just its first few pages: the backend
// splits long documents into chunks server-side and this walks chunkIndex
// 0, 1, 2, ... until totalChunks is reached, appending each chunk's
// translation to the reader as it arrives and showing a "translating part X
// of Y" note in between (each chunk is its own request, so nothing appears
// until the first one finishes, then it grows chunk by chunk).
async function fetchTranslation(url, lang) {
  const body = document.getElementById("translateModalBody");
  const t = (typeof gstT === "function") ? gstT : (k => k);
  const myRequestId = ++gstTranslateRequestId;

  body.innerHTML = `<div class="translate-modal-loading"><span class="translate-spinner"></span><span>${t("translate.loading")}</span></div>`;

  let accumulatedHtml = "";
  let chunkIndex = 0;
  let totalChunks = 1;

  while (chunkIndex < totalChunks) {
    if (myRequestId !== gstTranslateRequestId) return; // superseded by a newer run

    if (chunkIndex > 0) {
      const progressLabel = t("translate.loadingPart")
        .replace("{n}", String(chunkIndex + 1))
        .replace("{total}", String(totalChunks));
      body.innerHTML = accumulatedHtml +
        `<div class="translate-modal-loading translate-modal-progress"><span class="translate-spinner"></span><span>${progressLabel}</span></div>`;
    }

    let ok, data, fetchErr = null;
    try {
      const res = await fetch("/api/translate-pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, lang, chunkIndex })
      });
      ok = res.ok;
      data = await res.json().catch(() => ({}));
    } catch (err) {
      fetchErr = err;
    }

    if (myRequestId !== gstTranslateRequestId) return;

    if (fetchErr) {
      // "Failed to fetch" means the request never reached a server at all —
      // typically because the site is being viewed as a local file (file://)
      // or a static host without the /api serverless functions, rather than
      // an actual Vercel deployment with ANTHROPIC_API_KEY set.
      const looksUndeployed = /failed to fetch|networkerror|load failed/i.test(fetchErr.message || "");
      body.innerHTML = accumulatedHtml + `<p class="translate-modal-error">${
        looksUndeployed ? t("translate.errorNotDeployed") : `${t("translate.errorGeneric")} (${fetchErr.message})`
      }</p>`;
      return;
    }

    if (!ok || !data || data.error) {
      const debugLine = data && data.debugKind
        ? `<p class="translate-modal-truncated-note">Debug: detected as "${data.debugKind}", sample: ${escapeAttr((data.debugSample || "").slice(0, 150))}</p>`
        : "";
      body.innerHTML = accumulatedHtml + `<p class="translate-modal-error">${(data && data.error) || t("translate.errorGeneric")}</p>${debugLine}`;
      return;
    }

    accumulatedHtml += renderTranslatedMarkdown(data.translatedText);
    totalChunks = data.totalChunks || 1;

    if (data.isLastChunk && data.truncatedOverall) {
      accumulatedHtml += `<p class="translate-modal-truncated-note">${t("translate.truncatedNote")}</p>`;
    }

    body.innerHTML = accumulatedHtml;
    chunkIndex++;
  }
}

function openTranslateModal(url, title) {
  const overlay = document.getElementById("translateModalOverlay");
  const docTitleEl = document.getElementById("translateDocTitle");
  const originalLink = document.getElementById("translateOriginalLink");
  const frame = document.getElementById("translateOriginalFrame");
  const langSelect = document.getElementById("translateLangSelect");

  gstTranslateActiveUrl = url;
  gstTranslateActiveTitle = title;

  docTitleEl.textContent = title || "";
  originalLink.href = url;
  // Embeds the original PDF/page alongside the translation so the reader can
  // check layout, tables and figures against the plain-text translation.
  // Many official PDF hosts send an X-Frame-Options header that silently
  // blocks direct iframe embedding (no visible error — it just stays blank),
  // so PDFs are routed through Google's own viewer, which fetches and
  // renders the file itself and isn't subject to the source's framing
  // restriction. Non-PDF pages are embedded directly. The "View Original
  // PDF" link in the footer remains as a fallback either way.
  if (frame) {
    frame.src = looksLikePdf(url)
      ? "https://docs.google.com/gview?url=" + encodeURIComponent(url) + "&embedded=true"
      : url;
  }
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  populateTranslateLangSelect();
  const lang = (typeof gstCurrentLang !== "undefined" && gstCurrentLang) ? gstCurrentLang : "en";
  if (langSelect) langSelect.value = lang;

  fetchTranslation(url, lang);
}

function closeTranslateModal() {
  document.getElementById("translateModalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  const frame = document.getElementById("translateOriginalFrame");
  if (frame) frame.src = "about:blank";
  gstTranslateActiveUrl = null;
  gstTranslateActiveTitle = null;
  gstTranslateRequestId++; // stops any still-running chunk loop from continuing to fetch after close
}

// Google's own translator reliably renders and translates PDFs (including
// scanned/design-heavy ones our own text-extraction pipeline struggles with),
// without needing our serverless backend at all. Simpler and more robust.
const GOOGLE_TRANSLATE_LANG = { en: "en", sv: "sv", ko: "ko", es: "es", fr: "fr", de: "de", ja: "ja", zh: "zh-CN" };

function openInGoogleTranslate(url) {
  const lang = (typeof gstCurrentLang !== "undefined" && gstCurrentLang) ? gstCurrentLang : "en";
  const tl = GOOGLE_TRANSLATE_LANG[lang] || "en";
  const translateUrl = "https://translate.google.com/translate?sl=auto&tl=" + encodeURIComponent(tl) + "&u=" + encodeURIComponent(url);
  window.open(translateUrl, "_blank", "noopener");
}

function setupTranslateModal() {
  document.addEventListener("click", e => {
    const btn = e.target.closest(".doc-translate-btn");
    if (btn) {
      openTranslateModal(btn.dataset.docUrl, btn.dataset.docTitle);
      return;
    }
    if (e.target.id === "translateModalCloseBtn" || e.target.closest("#translateModalCloseBtn") ||
        e.target.id === "translateModalCloseBtn2" || e.target.closest("#translateModalCloseBtn2")) {
      closeTranslateModal();
      return;
    }
    if (e.target.id === "translateModalOverlay") {
      closeTranslateModal();
    }
  });
  document.addEventListener("change", e => {
    if (e.target.id === "translateLangSelect" && gstTranslateActiveUrl) {
      fetchTranslation(gstTranslateActiveUrl, e.target.value);
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeTranslateModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  maybeTranslateAndRender();
  setupTranslateModal();
});

document.addEventListener("gst-lang-changed", () => {
  maybeTranslateAndRender();
});
