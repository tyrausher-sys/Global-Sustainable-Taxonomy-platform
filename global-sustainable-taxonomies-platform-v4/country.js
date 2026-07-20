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

const DEFAULT_OBJECTIVES = [
  { icon: "climate", label: "Climate Change Mitigation" },
  { icon: "climate-adapt", label: "Climate Change Adaptation" },
  { icon: "water", label: "Sustainable Use of Water & Marine Resources" },
  { icon: "circular", label: "Transition to a Circular Economy" },
  { icon: "pollution", label: "Pollution Prevention & Control" },
  { icon: "biodiversity", label: "Protection of Biodiversity & Ecosystems" }
];

const GENERIC_ACTIVITIES = ["Renewable energy generation", "Low-carbon transport", "Sustainable buildings"];

function renderHeader(entry, status, label, name) {
  const taxonomyName = entry && entry.taxonomy ? entry.taxonomy : "No taxonomy established";
  return `
    <section class="country-header-dark">
      <div class="country-header-inner">
        <div class="country-header-row">
          <div class="country-header-titles">
            <span class="badge badge-${status}">${label}</span>
            <h1>${name}</h1>
            <p class="country-header-sub">${taxonomyName}${entry && entry.year ? " · Published " + entry.year : ""}</p>
          </div>
          <div class="lang-select-wrap">
            <label for="langSelect">Language</label>
            <select id="langSelect">
              <option value="en">English</option>
              <option value="native" disabled>Original language (coming soon)</option>
            </select>
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
  const list = objs || DEFAULT_OBJECTIVES;
  let html = `<ol class="objective-pills${objs ? "" : " objective-pills-generic"}">`;
  list.forEach((o, i) => {
    html += `<li><span class="pill-num">${i + 1}</span>${icon(o.icon)}<span>${o.label}</span></li>`;
  });
  html += `</ol>`;
  if (!objs) {
    html += `<p class="sample-note">Illustrative reference set — this taxonomy's specific objective structure has not yet been documented.</p>`;
  }
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
    const activities = (entry && entry.sectors && entry.sectors.length) ? entry.sectors.slice(0, 3) : GENERIC_ACTIVITIES;
    html += `<p class="sample-note">Illustrative example criteria — refer to the official documentation below for authoritative thresholds.</p>`;
    html += `<table class="criteria-table"><thead><tr><th>Activity</th><th>Screening Criteria</th><th>Threshold</th><th>DNSH</th></tr></thead><tbody>`;
    activities.forEach(a => {
      html += `<tr><td>${a}</td><td>Meets sector emissions / technology pathway</td><td>See official guidance</td><td>Applies</td></tr>`;
    });
    html += `</tbody></table>`;
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

function renderCountry() {
  const params = new URLSearchParams(window.location.search);
  const iso = (params.get("iso") || "").toUpperCase();
  const headerEl = document.getElementById("countryHeader");
  const el = document.getElementById("countryContent");
  const entry = window.TAXONOMY_DATA[iso];

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
      entry.fullDescription.map(p => `<p class="section-text">${p}</p>`).join("") + `</div>`;
  } else if (entry && entry.note) {
    left += `<div class="card-block"><h2>About the Taxonomy</h2><p class="section-text">${entry.note}</p><p class="sample-note">Limited public information compiled so far — this summary may be expanded as more sources are reviewed.</p></div>`;
  } else if (!entry) {
    left += `<div class="card-block"><p class="section-text">No taxonomy data has been compiled for this country yet.</p></div>`;
  }

  left += `<div class="card-block"><h2>Official Documents</h2>${officialDocumentsSection(entry)}</div>`;
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

function openTranslateModal(url, title) {
  const overlay = document.getElementById("translateModalOverlay");
  const body = document.getElementById("translateModalBody");
  const docTitleEl = document.getElementById("translateDocTitle");
  const originalLink = document.getElementById("translateOriginalLink");

  docTitleEl.textContent = title || "";
  originalLink.href = url;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  const t = (typeof gstT === "function") ? gstT : (k => k);
  body.innerHTML = `<div class="translate-modal-loading"><span class="translate-spinner"></span><span>${t("translate.loading")}</span></div>`;

  const lang = (typeof gstCurrentLang !== "undefined" && gstCurrentLang) ? gstCurrentLang : "en";

  fetch("/api/translate-pdf", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url, lang })
  })
    .then(res => res.json().catch(() => ({})).then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (!ok || !data || data.error) {
        body.innerHTML = `<p class="translate-modal-error">${(data && data.error) || t("translate.errorGeneric")}</p>`;
        return;
      }
      let html = renderTranslatedMarkdown(data.translatedText);
      if (data.truncated) {
        html += `<p class="translate-modal-truncated-note">${t("translate.truncatedNote")}</p>`;
      }
      body.innerHTML = html;
    })
    .catch(err => {
      // "Failed to fetch" means the request never reached a server at all —
      // typically because the site is being viewed as a local file (file://)
      // or a static host without the /api serverless functions, rather than
      // an actual Vercel deployment with ANTHROPIC_API_KEY set.
      const looksUndeployed = /failed to fetch|networkerror|load failed/i.test(err.message || "");
      body.innerHTML = looksUndeployed
        ? `<p class="translate-modal-error">${t("translate.errorNotDeployed")}</p>`
        : `<p class="translate-modal-error">${t("translate.errorGeneric")} (${err.message})</p>`;
    });
}

function closeTranslateModal() {
  document.getElementById("translateModalOverlay").classList.remove("open");
  document.body.style.overflow = "";
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
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeTranslateModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCountry();
  setupTranslateModal();
});
