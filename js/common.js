/* Shared helpers and behaviour for every page. Needs data.js loaded first. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const nightsOf = (route) => route.stops.reduce((sum, [, n]) => sum + n, 0);
const statesOf = (route) => [...new Set(route.stops.map(([k]) => DESTINATIONS[k].state))];
const nameOf = (key) => DESTINATIONS[key].name;
const routesVisiting = (key) => ROUTES.flatMap((r, i) => r.stops.some(([k]) => k === key) ? [i + 1] : []);
const priceOf = (route) => route.price || "Quote on request";

const whatsappReady = !/^\d{2}0{10}$/.test(SETTINGS.whatsapp);
const waLink = (text) => `https://wa.me/${SETTINGS.whatsapp}?text=${encodeURIComponent(text)}`;
const mailLink = (subject, body) => `mailto:${SETTINGS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/* Optional photo: if the file is missing the image removes itself. */
const photo = (file, cls, alt = "") =>
  `<img class="${cls}" src="images/${esc(file)}.jpg" alt="${esc(alt)}" loading="lazy" onerror="this.remove()">`;

const WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 0 1 0 16.2 8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.1.81.83-3.03-.2-.31A8.1 8.1 0 0 1 12.04 3.8zM8.6 7.5c-.2 0-.5.07-.76.35-.26.28-1 .98-1 2.4s1.03 2.78 1.17 2.97c.14.2 2 3.2 4.9 4.36 2.4.95 2.9.76 3.42.7.52-.05 1.68-.69 1.92-1.35.24-.66.24-1.23.17-1.35-.07-.12-.26-.2-.55-.33-.28-.14-1.68-.83-1.94-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.1-.16.2-.33.22-.62.08-.28-.14-1.2-.44-2.28-1.4-.84-.75-1.41-1.68-1.58-1.96-.16-.28-.02-.43.12-.58.13-.13.28-.33.43-.5.14-.16.19-.28.28-.47.1-.2.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49z"/></svg>';

/* ---------- Route bar: one block per stop, its length follows the nights ---------- */
function strip(route, { compact = false } = {}) {
  const total = nightsOf(route);
  const segs = route.stops.map(([key, nights], i) => {
    const d = DESTINATIONS[key];
    const label = compact ? "" : `<span class="seg-name">${esc(d.name)}</span><span class="seg-n">${nights}N</span>`;
    return `<li class="seg t-${d.terrain}" style="--n:${nights};--i:${i}" title="${esc(d.name)}, ${plural(nights, "night")}"><span class="sr">${esc(d.name)}, ${plural(nights, "night")}</span>${label}</li>`;
  }).join("");
  return `<ol class="strip${compact ? " strip-compact" : ""}" style="--total:${total}" aria-label="Nights at each stop">${segs}</ol>`;
}

/* ---------- Map: stops placed by latitude and longitude ----------
   Straight lines show the order of stops, not roads. */
function mapSVG(keys, { numbered = true, route = true, W = 480, H = 560, padX = 118, padY = 54 } = {}) {
  const pts = keys.map((k) => ({ key: k, ...DESTINATIONS[k] }));
  const lats = pts.map((p) => p.lat), lons = pts.map((p) => p.lon);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const kx = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
  const spanX = Math.max((maxLon - minLon) * kx, 0.05), spanY = Math.max(maxLat - minLat, 0.05);
  const s = Math.min((W - 2 * padX) / spanX, (H - 2 * padY) / spanY);
  const ox = (W - spanX * s) / 2, oy = (H - spanY * s) / 2;
  const X = (lon) => ox + (lon - minLon) * kx * s;
  const Y = (lat) => oy + (maxLat - lat) * s;
  const r = numbered ? 14 : 6;

  const line = route && pts.length > 1
    ? `<polyline class="map-line" points="${pts.map((p) => `${X(p.lon).toFixed(1)},${Y(p.lat).toFixed(1)}`).join(" ")}"/>` : "";

  const dots = pts.map((p, i) => {
    const x = X(p.lon), y = Y(p.lat);
    const off = r + 8;
    const pos = { r: [x + off, y + 5, "start"], l: [x - off, y + 5, "end"], t: [x, y - off, "middle"], b: [x, y + off + 10, "middle"] }[p.side || "r"];
    const inner = numbered ? `<text class="map-num" x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle">${i + 1}</text>` : "";
    const tag = numbered ? "a" : "g";
    const attrs = numbered ? ` href="#stop-${i + 1}" data-i="${i}"` : "";
    return `<${tag} class="map-stop t-${p.terrain}"${attrs}>
      <title>${esc(p.name)}</title>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>${inner}
      <text class="map-label" x="${pos[0].toFixed(1)}" y="${pos[1].toFixed(1)}" text-anchor="${pos[2]}">${esc(p.name)}</text>
    </${tag}>`;
  }).join("");

  return `<svg class="map" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of the stops. The table beside it lists every stop in order.">${line}${dots}</svg>`;
}

/* ---------- Navigation ---------- */
function initNav() {
  const nav = $("#nav"), links = $("#navLinks"), burger = $("#burger");
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Floating WhatsApp button (only when a real number is set) ---------- */
function mountWhatsApp(text) {
  if (!whatsappReady) return;
  const a = document.createElement("a");
  a.className = "wa-float";
  a.href = waLink(text);
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with us on WhatsApp");
  a.innerHTML = `${WA_ICON}<span>WhatsApp</span>`;
  document.body.appendChild(a);
}

/* ---------- Footer ---------- */
function initFooter() {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
  const addr = $("#footAddress");
  if (addr && SETTINGS.address) addr.textContent = SETTINGS.address;
  const credits = $("#credits");
  if (credits && CREDITS.length) {
    credits.hidden = false;
    $("#creditsList", credits).innerHTML = CREDITS.map((c) =>
      `<li>${esc(c.file)}: ${esc(c.by)}, ${esc(c.source)}, ${esc(c.licence)}</li>`).join("");
  }
}

initNav();
initFooter();
