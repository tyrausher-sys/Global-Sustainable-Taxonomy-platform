/* Global Sustainable Taxonomies — Media & Trend Hub (Screen 4)
   NOTE: There is no live media feed behind this page. All items, trend cards
   and the thematic chart are generic sample/placeholder content clearly
   labelled as such. The taxonomy-development timeline chart is the one
   exception — it is built from the real "year" field in data.js. */

const CONTENT_TYPES = ["News", "Reports", "Videos", "Papers", "Podcasts"];

const TREND_CARDS = [
  {
    title: "Interoperability Momentum",
    teaser: "Regulators are increasingly referencing each other's taxonomies to reduce duplication for cross-border issuers.",
    detail: "Sample AI analysis: mentions of \"mutual recognition\", \"common ground taxonomy\" and \"interoperability\" appear across a growing share of sample content in this illustrative demo, suggesting a thematic cluster around aligning definitions between jurisdictions rather than each market building in isolation."
  },
  {
    title: "Asia-Pacific Expansion",
    teaser: "A wave of new and updated taxonomies across Asia-Pacific markets continues to reshape the regional landscape.",
    detail: "Sample AI analysis: this illustrative demo groups content referencing ASEAN Taxonomy updates, and national frameworks in the Asia-Pacific region into a single expanding-activity theme."
  },
  {
    title: "Transition Finance Gains Ground",
    teaser: "More frameworks are carving out explicit categories for transition activities, not just pure-green ones.",
    detail: "Sample AI analysis: sample content in this demo increasingly separates \"transition\" activities (e.g. gas-to-coal switching, industrial decarbonisation pathways) from strictly green ones, mirroring real-world debate over transition taxonomies."
  },
  {
    title: "Disclosure & Assurance Tightening",
    teaser: "Regulators are raising the bar on third-party verification and assurance of taxonomy-aligned disclosures.",
    detail: "Sample AI analysis: this illustrative theme reflects a broader pattern of taxonomies pairing screening criteria with stronger assurance and reporting requirements over time."
  }
];

const SOURCE_TAGS = ["Sample Source", "Sample Wire", "Sample Bulletin", "Sample Review"];

function buildSampleItems() {
  const countries = Object.values(window.TAXONOMY_DATA || {});
  const names = countries.map(c => c.name);
  const pick = (arr, i) => arr[i % arr.length];

  const templates = [
    { type: "News", title: "{c} regulator signals review of taxonomy screening criteria" },
    { type: "News", title: "Draft guidance published on aligning {c}'s taxonomy with international standards" },
    { type: "Reports", title: "Annual review of sustainable finance taxonomies — {c} spotlight" },
    { type: "Reports", title: "Comparative study: DNSH implementation across {c} and regional peers" },
    { type: "Videos", title: "Explainer: how {c}'s taxonomy classifies eligible activities" },
    { type: "Videos", title: "Panel discussion — taxonomy interoperability and {c}'s approach" },
    { type: "Papers", title: "Working paper on transition activities within {c}'s framework" },
    { type: "Papers", title: "Academic review of minimum safeguards provisions, referencing {c}" },
    { type: "Podcasts", title: "Podcast: what {c}'s taxonomy means for green bond issuers" },
    { type: "Podcasts", title: "Weekly roundup — taxonomy developments including {c}" },
    { type: "News", title: "Consultation opens on proposed updates to {c}'s sector coverage" },
    { type: "Reports", title: "Investor briefing on taxonomy-aligned capital flows into {c}" },
    { type: "Videos", title: "Webinar recording: technical screening criteria in {c}" },
    { type: "Papers", title: "Policy brief: lessons from {c} for emerging-market taxonomies" },
    { type: "News", title: "{c} taxonomy secretariat outlines 2026–2027 workplan" }
  ];

  const dates = ["Jul 2026", "Jun 2026", "Jun 2026", "May 2026", "May 2026", "Apr 2026", "Apr 2026", "Mar 2026", "Mar 2026", "Feb 2026", "Feb 2026", "Jan 2026", "Jan 2026", "Dec 2025", "Dec 2025"];

  return templates.map((t, i) => ({
    type: t.type,
    title: t.title.replace("{c}", names.length ? pick(names, i * 7 + 3) : "a national"),
    source: pick(SOURCE_TAGS, i),
    date: dates[i % dates.length]
  }));
}

let ITEMS = [];
let currentType = "All";

function typeTagHtml(type) {
  return `<span class="type-tag">${type}</span>`;
}

function renderTrendCards() {
  const wrap = document.getElementById("trendGrid");
  wrap.innerHTML = TREND_CARDS.map((t, i) => `
    <div class="trend-card" data-idx="${i}">
      <h3>${t.title}</h3>
      <p>${t.teaser}</p>
      <span class="trend-toggle">Expand analysis ▾</span>
      <div class="trend-detail">${t.detail}</div>
    </div>
  `).join("");

  wrap.querySelectorAll(".trend-card").forEach(card => {
    card.addEventListener("click", () => {
      const expanded = card.classList.toggle("expanded");
      card.querySelector(".trend-toggle").textContent = expanded ? "Collapse analysis ▴" : "Expand analysis ▾";
    });
  });
}

function renderFeatured() {
  const f = ITEMS[0];
  const card = document.getElementById("featuredCard");
  card.innerHTML = `
    <div>
      ${typeTagHtml(f.type)}
      <h2>${f.title}</h2>
      <p class="section-text">Sample featured item for demonstration — illustrates how a lead story would appear once real media ingestion is connected.</p>
      <div class="media-meta">${f.source} · ${f.date}</div>
    </div>
    <div class="featured-visual">Featured visual placeholder</div>
  `;
  card.style.cursor = "pointer";
  card.addEventListener("click", () => openMediaModal(f));
}

function matchesFilter(item, query) {
  if (currentType !== "All" && item.type !== currentType) return false;
  if (query) {
    const q = query.toLowerCase();
    if (!item.title.toLowerCase().includes(q) && !item.source.toLowerCase().includes(q) && !item.type.toLowerCase().includes(q)) {
      return false;
    }
  }
  return true;
}

let currentGridItems = [];

function renderGrid() {
  const query = document.getElementById("mediaSearchInput").value.trim();
  const grid = document.getElementById("mediaGrid");
  const rest = ITEMS.slice(1).filter(item => matchesFilter(item, query));
  currentGridItems = rest;

  if (!rest.length) {
    grid.innerHTML = `<p class="section-text" style="grid-column:1/-1;color:var(--text-muted);">No sample items match this filter.</p>`;
    return;
  }

  grid.innerHTML = rest.map((item, i) => `
    <a class="media-card" href="#" data-idx="${i}">
      ${typeTagHtml(item.type)}
      <h3>${item.title}</h3>
      <div class="media-meta">${item.source} · ${item.date}</div>
    </a>
  `).join("");

  grid.querySelectorAll(".media-card").forEach(card => {
    card.addEventListener("click", e => {
      e.preventDefault();
      const idx = parseInt(card.dataset.idx, 10);
      openMediaModal(currentGridItems[idx]);
    });
  });
}

function setupFilterChips() {
  document.querySelectorAll("#typeChips .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#typeChips .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentType = btn.dataset.type;
      renderGrid();
    });
  });
  document.getElementById("mediaSearchInput").addEventListener("input", renderGrid);
}

/* ---------- Real data chart: taxonomy development timeline ---------- */
function renderTimelineChart() {
  const counts = {};
  Object.values(window.TAXONOMY_DATA || {}).forEach(e => {
    const y = parseInt(e.year, 10);
    if (!isNaN(y)) counts[y] = (counts[y] || 0) + 1;
  });
  const years = Object.keys(counts).map(Number).sort((a, b) => a - b);
  if (!years.length) {
    document.getElementById("timelineChart").innerHTML = "<p class=\"section-text\">No dated entries available.</p>";
    return;
  }
  const w = 480, h = 190, pad = 26;
  const maxCount = Math.max(...years.map(y => counts[y]));
  const barW = (w - pad * 2) / years.length;

  let svg = `<svg class="hub-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">`;
  years.forEach((y, i) => {
    const val = counts[y];
    const barH = (val / maxCount) * (h - pad * 2 - 16);
    const x = pad + i * barW;
    const yPos = h - pad - barH;
    svg += `<rect x="${(x + barW * 0.15).toFixed(1)}" y="${yPos.toFixed(1)}" width="${(barW * 0.7).toFixed(1)}" height="${barH.toFixed(1)}" fill="var(--green)" rx="2"/>`;
  });
  svg += `</svg>`;
  document.getElementById("timelineChart").innerHTML = svg;

  const labelStep = Math.ceil(years.length / 8);
  const labels = years.filter((_, i) => i % labelStep === 0);
  document.getElementById("timelineLabels").innerHTML = labels.map(y => `<span>${y}</span>`).join("");
}

/* ---------- Illustrative chart: thematic weighting ---------- */
function renderThematicChart() {
  const themes = [
    { label: "Interoperability", value: 34 },
    { label: "Asia-Pacific Expansion", value: 27 },
    { label: "Transition Finance", value: 22 },
    { label: "Disclosure & Assurance", value: 17 }
  ];
  const html = themes.map(t => `
    <div class="thematic-row">
      <span class="thematic-label">${t.label}</span>
      <div class="thematic-bar-bg"><div class="thematic-bar-fill" style="width:${t.value * 2}%;"></div></div>
      <span class="thematic-value">${t.value}%</span>
    </div>
  `).join("");
  document.getElementById("thematicChart").innerHTML = html;
}

/* ---------- Media card detail modal (sample content, no live source yet) ---------- */

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const TYPE_VIEWER_NOTE = {
  News: "open the original news article",
  Reports: "open the full report (PDF or embedded viewer)",
  Videos: "play the video in an embedded viewer",
  Papers: "open the paper (PDF viewer)",
  Podcasts: "play the episode in an embedded audio player"
};

function openMediaModal(item) {
  const modal = document.getElementById("mediaModal");
  const overlay = document.getElementById("mediaModalOverlay");
  const viewerAction = TYPE_VIEWER_NOTE[item.type] || "open the original source";

  modal.innerHTML = `
    <button class="modal-close" id="mediaModalClose" aria-label="Close" type="button">✕</button>
    ${typeTagHtml(item.type)}
    <h3>${escapeHtml(item.title)}</h3>
    <div class="media-meta">${escapeHtml(item.source)} · ${escapeHtml(item.date)}</div>
    <p class="modal-body-text">Sample summary: this illustrative ${item.type.toLowerCase()} item stands in for a real feed entry. Once a live media source is connected, clicking this card will ${viewerAction} for "${escapeHtml(item.title)}".</p>
    <div class="modal-disclaimer">This is sample content for demonstration only — no live media feed or real source is connected yet.</div>
  `;

  overlay.classList.add("open");
  document.getElementById("mediaModalClose").addEventListener("click", closeMediaModal);
}

function closeMediaModal() {
  document.getElementById("mediaModalOverlay").classList.remove("open");
}

function setupMediaModal() {
  const overlay = document.getElementById("mediaModalOverlay");
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeMediaModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeMediaModal();
  });
}

function init() {
  ITEMS = buildSampleItems();
  renderTrendCards();
  renderFeatured();
  renderGrid();
  setupFilterChips();
  renderTimelineChart();
  renderThematicChart();
  setupMediaModal();
}

document.addEventListener("DOMContentLoaded", init);
