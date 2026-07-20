/* Global Sustainable Taxonomies — Home / Interactive Map */

const STATUS_LABEL = {
  established: "Developed",
  developing: "Under Development",
  none: "No Taxonomy"
};

const STATUS_COLOR = {
  established: "#15803D",
  developing: "#D97706",
  none: "#B8C0CC"
};

const GEOJSON_URL = "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json";
const GEOJSON_FALLBACK_URL = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

let map, geoLayer;
let currentRegion = "All";
let currentStatus = "All";
const layerByIso = {};

function getEntry(iso) {
  return window.TAXONOMY_DATA[iso] || null;
}

function getStatus(iso) {
  const entry = getEntry(iso);
  const raw = entry ? entry.status : "none";
  return (raw === "established" || raw === "developing") ? raw : "none";
}

function matchesFilters(iso) {
  const entry = getEntry(iso);
  const status = getStatus(iso);
  const region = entry ? entry.region : null;
  if (currentStatus !== "All" && status !== currentStatus) return false;
  if (currentRegion !== "All" && region !== currentRegion) return false;
  return true;
}

function styleFeature(feature) {
  const status = getStatus(feature.id);
  const match = matchesFilters(feature.id);
  return {
    fillColor: STATUS_COLOR[status],
    weight: 0.7,
    color: "#ffffff",
    fillOpacity: match ? 0.9 : 0.12,
    opacity: match ? 1 : 0.35
  };
}

function buildPopupHtml(feature) {
  const iso = feature.id;
  const entry = getEntry(iso);
  const name = entry ? entry.name : feature.properties.name;
  const status = getStatus(iso);
  const label = STATUS_LABEL[status];

  let html = `<div class="taxo-popup">`;
  html += `<h3>${name}</h3>`;
  html += `<span class="badge badge-${status}">${label}</span>`;
  if (entry && entry.taxonomy) {
    html += `<div class="taxo-name">${entry.taxonomy}${entry.year ? " (" + entry.year + ")" : ""}</div>`;
  }
  if (entry && entry.regulator) {
    html += `<div class="taxo-meta">${entry.regulator}</div>`;
  }
  if (!entry) {
    html += `<div class="taxo-meta">No taxonomy data compiled for this country yet.</div>`;
  }
  html += `<div class="taxo-actions">`;
  html += `<a class="btn-primary" href="country.html?iso=${iso}">View Full Taxonomy</a>`;
  html += `<a class="btn-secondary-sm" href="advisor.html?mode=country&amp;iso=${iso}">AI Compliance Check</a>`;
  html += `</div></div>`;
  return html;
}

function onEachFeature(feature, layer) {
  const iso = feature.id;
  layerByIso[iso] = layer;
  layer.bindPopup(buildPopupHtml(feature));

  layer.on({
    mouseover: e => {
      const l = e.target;
      l.setStyle({ weight: 2, color: "#0F172A" });
      l.bringToFront();
    },
    mouseout: e => {
      geoLayer.resetStyle(e.target);
    }
  });
}

function renderStats() {
  const counts = { established: 0, developing: 0, none: 0 };
  // Count every country actually shown on the map (all geoJSON features),
  // not just the ones with a research entry — otherwise countries with no
  // entry (rendered gray/"No Taxonomy" on the map) were left out of the total.
  const isoList = Object.keys(layerByIso).length ? Object.keys(layerByIso) : Object.keys(window.TAXONOMY_DATA);
  isoList.forEach(iso => {
    const bucket = getStatus(iso);
    counts[bucket] += 1;
  });
  const total = counts.established + counts.developing + counts.none;

  const totalEl = document.getElementById("statTotal");
  const estEl = document.getElementById("statEstablished");
  const devEl = document.getElementById("statDeveloping");
  const noneEl = document.getElementById("statNone");
  if (totalEl) totalEl.textContent = total;
  if (estEl) estEl.textContent = counts.established;
  if (devEl) devEl.textContent = counts.developing;
  if (noneEl) noneEl.textContent = counts.none;
}

function renderRecentUpdates() {
  const list = document.getElementById("recentList");
  if (!list) return;

  const dated = Object.entries(window.TAXONOMY_DATA)
    .map(([iso, e]) => ({
      iso,
      name: e.name,
      year: parseInt(e.year, 10),
      taxonomy: e.taxonomy || "National sustainable finance taxonomy"
    }))
    .filter(e => !isNaN(e.year));

  dated.sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));

  const top = dated.slice(0, 3);
  list.innerHTML = top.map(e => `
    <li>
      <a href="country.html?iso=${e.iso}">
        <div class="recent-top"><strong>${e.name}</strong></div>
        <div class="recent-sub"><span>${e.taxonomy}</span><span class="recent-date">${e.year}</span></div>
      </a>
    </li>
  `).join("");
}

function refreshMapStyles() {
  if (!geoLayer) return;
  geoLayer.eachLayer(l => l.setStyle(styleFeature(l.feature)));
}

function setupChips() {
  document.querySelectorAll("#regionChips .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#regionChips .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentRegion = btn.dataset.region;
      refreshMapStyles();
    });
  });
  document.querySelectorAll("#statusChips .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#statusChips .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentStatus = btn.dataset.status;
      refreshMapStyles();
    });
  });
}

function highlightLayer(layer) {
  Object.values(layerByIso).forEach(l => geoLayer.resetStyle(l));
  layer.setStyle({ weight: 3, color: "#22C55E" });
  layer.bringToFront();
  map.fitBounds(layer.getBounds(), { maxZoom: 5, padding: [30, 30] });
  layer.openPopup();
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  function matchesQuery(entry, name, q) {
    if (name.toLowerCase().includes(q)) return true;
    if (entry && entry.taxonomy && entry.taxonomy.toLowerCase().includes(q)) return true;
    if (entry && entry.regulator && entry.regulator.toLowerCase().includes(q)) return true;
    return false;
  }

  function search() {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = "";
    if (!q) { results.classList.remove("show"); return; }

    const matches = [];
    Object.keys(layerByIso).forEach(iso => {
      const entry = getEntry(iso);
      const layer = layerByIso[iso];
      const name = entry ? entry.name : layer.feature.properties.name;
      if (matchesQuery(entry, name, q)) matches.push({ name, iso, layer, entry });
    });

    if (!matches.length) {
      results.innerHTML = `<div class="search-empty">No matches</div>`;
    } else {
      matches.slice(0, 8).forEach(m => {
        const div = document.createElement("div");
        div.className = "search-result-item";
        const sub = m.entry && m.entry.taxonomy ? m.entry.taxonomy : "No taxonomy data";
        div.innerHTML = `<span class="sr-name">${m.name}</span><span class="sr-sub">${sub}</span>`;
        div.addEventListener("click", () => {
          highlightLayer(m.layer);
          results.classList.remove("show");
          input.value = m.name;
        });
        results.appendChild(div);
      });
    }
    results.classList.add("show");
  }

  input.addEventListener("input", search);
  document.addEventListener("click", e => {
    if (!e.target.closest(".hero-dark-inner")) results.classList.remove("show");
  });
}

async function init() {
  map = L.map("map", {
    worldCopyJump: false,
    minZoom: 1,
    maxZoom: 6,
    zoomControl: true,
    attributionControl: false
  }).setView([20, 10], 2);

  let world = null;
  for (const url of [GEOJSON_URL, GEOJSON_FALLBACK_URL]) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      world = await res.json();
      break;
    } catch (err) {
      console.warn("GeoJSON load failed from", url, err);
    }
  }

  if (world) {
    geoLayer = L.geoJSON(world, { style: styleFeature, onEachFeature }).addTo(map);
    map.fitBounds(geoLayer.getBounds(), { padding: [10, 10] });
  } else {
    document.getElementById("map").innerHTML =
      '<p style="padding:20px;color:#B8433F;">Could not load world map data (check your internet connection) — please reload the page.</p>';
  }

  renderStats();
  renderRecentUpdates();
  setupChips();
  setupSearch();
}

document.addEventListener("DOMContentLoaded", init);
