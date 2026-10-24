/* ============================================================
   WILDLIFE IN KERALA
   Edit SETTINGS, DESTINATIONS and ROUTES below. Nothing else
   needs to change when you add or reorder stops.
   ============================================================ */

/* ---------- SETTINGS ---------- */
const SETTINGS = {
  whatsapp: "910000000000",        // digits only, country code first (India: 91 + 10 digits)
  phoneDisplay: "+91 00000 00000",
  email: "info@wildlifeinkerala.com"
};

/* ---------- LANDSCAPES (colour key for every strip) ---------- */
const TERRAINS = {
  forest: "Forest & sanctuary",
  hill:   "Hills & tea country",
  water:  "Backwaters & coast",
  city:   "Cities"
};

/* ---------- DESTINATIONS ----------
   The key is also the photo name: images/<key>.jpg (optional thumbnail). */
const DESTINATIONS = {
  kabini:      { name: "Kabini",         state: "Karnataka",  terrain: "forest", blurb: "Kabini reservoir on the edge of Nagarhole, explored by boat and jeep safari.", look: "Elephants by the water. Leopard and tiger if you are lucky." },
  thattekkad:  { name: "Thattekkad",     state: "Kerala",     terrain: "forest", blurb: "Salim Ali Bird Sanctuary beside the Periyar river, on the edge of the Western Ghats.", look: "Malabar grey hornbill, Sri Lanka frogmouth, forest birds." },
  thekkady:    { name: "Thekkady",       state: "Kerala",     terrain: "forest", blurb: "Periyar Tiger Reserve, with boat rides on the lake, forest walks and spice gardens.", look: "Elephants, sambar and gaur at the lake edge." },
  chinnar:     { name: "Chinnar",        state: "Kerala",     terrain: "forest", blurb: "A dry-forest sanctuary in the rain shadow of the Ghats, good for walking and trekking.", look: "Grizzled giant squirrel, star tortoise, birds." },

  munnar:      { name: "Munnar",         state: "Kerala",     terrain: "hill",   blurb: "Tea-covered hills and Eravikulam National Park.", look: "Nilgiri tahr." },
  valparai:    { name: "Valparai",       state: "Tamil Nadu", terrain: "hill",   blurb: "The Anamalai hills, where tea estates wrap around fragments of rainforest.", look: "Lion-tailed macaque, Nilgiri langur, hornbills." },
  coonoor:     { name: "Coonoor / Ooty", state: "Tamil Nadu", terrain: "hill",   blurb: "Nilgiri tea gardens, cool air and slow nature walks." },
  wayanad:     { name: "Wayanad",        state: "Kerala",     terrain: "hill",   blurb: "Misty hills, spice estates, caves and wildlife sanctuary country.", look: "Elephants, gaur and hill birds." },

  houseboat:   { name: "Houseboat",      state: "Kerala",     terrain: "water",  blurb: "One night afloat on the Kerala backwaters.", look: "Kingfishers, egrets and darters." },
  mararikulam: { name: "Mararikulam",    state: "Kerala",     terrain: "water",  blurb: "A quiet beach and village stay to slow down after the forests." },
  neeleshwar:  { name: "Neeleshwar",     state: "Kerala",     terrain: "water",  blurb: "Beaches and backwaters on the north Malabar coast, close to Bekal Fort." },

  cochin:      { name: "Cochin",         state: "Kerala",     terrain: "city",   blurb: "Fort Kochi's old quarter, Chinese fishing nets and spice markets. A gentle place to start or finish." },
  mysore:      { name: "Mysore",         state: "Karnataka",  terrain: "city",   blurb: "Mysore Palace and Chamundi Hill, a heritage stop between Bangalore and Kabini." },
  bangalore:   { name: "Bangalore",      state: "Karnataka",  terrain: "city",   blurb: "An easy arrival and departure city with an international airport." }
};

/* ---------- ROUTES ----------
   stops: [destinationKey, nights]. Package photo: images/route-<n>.jpg (optional). */
const ROUTES = [
  { title: "Western Ghats & Tiger Country",
    tagline: "Kerala birding, Anamalai forests, the Nilgiris and Kabini safaris.",
    stops: [["cochin",2],["thattekkad",2],["valparai",2],["coonoor",2],["kabini",2],["mysore",2],["bangalore",1]] },
  { title: "Kabini, Nilgiris & the Malabar Coast",
    tagline: "Start in Bangalore, then safari, hills, Wayanad and the northern coast.",
    stops: [["bangalore",1],["mysore",2],["kabini",2],["coonoor",2],["wayanad",2],["neeleshwar",2]] },
  { title: "Kerala Hills, Wildlife & Backwaters",
    tagline: "Birding, tea hills, Periyar, a houseboat night and a quiet beach.",
    stops: [["cochin",2],["thattekkad",2],["munnar",2],["thekkady",2],["houseboat",1],["mararikulam",2]] },
  { title: "The Grand South India Wildlife Trail",
    tagline: "The longest route: Karnataka, the Nilgiris, Chinnar and Kerala's birding belt.",
    stops: [["bangalore",1],["mysore",2],["kabini",2],["coonoor",2],["chinnar",2],["thattekkad",2],["cochin",2]] }
];

/* ---------- SPECIES ----------
   where: destination keys. Photo: images/species-<file>.jpg (optional). */
const SPECIES = [
  { name: "Tiger",                   file: "tiger",     where: ["kabini"],              note: "Kabini and Nagarhole. Rare to see, and the one everyone hopes for." },
  { name: "Asian elephant",          file: "elephant",  where: ["kabini","thekkady","wayanad"], note: "Herds come down to the water at Kabini. Also seen around Thekkady and Wayanad." },
  { name: "Leopard",                 file: "leopard",   where: ["kabini"],              note: "Keeps to forest edges. Early starts and patience help." },
  { name: "Gaur",                    file: "gaur",      where: ["thekkady","wayanad"],  note: "The largest wild cattle in the world, found in the hill forests." },
  { name: "Nilgiri tahr",            file: "tahr",      where: ["munnar"],              note: "A mountain goat of the high grasslands around Munnar." },
  { name: "Lion-tailed macaque",     file: "macaque",   where: ["valparai"],            note: "A rainforest monkey of the Anamalai hills." },
  { name: "Malabar grey hornbill",   file: "hornbill",  where: ["thattekkad"],          note: "A forest bird you can look for along the Periyar river." },
  { name: "Grizzled giant squirrel", file: "squirrel",  where: ["chinnar"],             note: "A rare tree squirrel of Chinnar's dry forest." }
];

/* ---------- HELPERS ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
const nightsOf = (route) => route.stops.reduce((sum, [, n]) => sum + n, 0);
const photo = (file, cls) => `<img class="${cls}" src="images/${esc(file)}.jpg" alt="" loading="lazy" onerror="this.remove()">`;
const whatsappReady = !/^\d{2}0{10}$/.test(SETTINGS.whatsapp);

/* ---------- ROUTE STRIP (the signature element) ----------
   One segment per stop; its size follows the number of nights. */
function strip(route, { compact = false } = {}) {
  const total = nightsOf(route);
  const segs = route.stops.map(([key, nights], i) => {
    const d = DESTINATIONS[key];
    const label = compact ? "" : `<span class="seg-name">${esc(d.name)}</span><span class="seg-n">${nights}N</span>`;
    return `<li class="seg t-${d.terrain}" style="--n:${nights};--i:${i}" title="${esc(d.name)}, ${plural(nights, "night")}">${label}</li>`;
  }).join("");
  return `<ol class="strip${compact ? " strip-compact" : ""}" style="--total:${total}">${segs}</ol>`;
}

/* ---------- HERO BOARD + LEGEND ---------- */
$("#board").innerHTML = ROUTES.map((r, i) => `
  <a class="board-row" href="#route-${i + 1}" aria-label="Route ${i + 1}: ${esc(r.title)}, ${plural(nightsOf(r), "night")}">
    <span class="mono">Route ${i + 1}</span>
    ${strip(r, { compact: true })}
    <span class="mono board-n">${nightsOf(r)}N</span>
  </a>`).join("");

$("#legend").innerHTML = Object.entries(TERRAINS).map(([k, label]) =>
  `<li><i class="t-${k}"></i>${esc(label)}</li>`).join("");

/* ---------- ROUTE LIST ---------- */
$("#routeList").innerHTML = ROUTES.map((r, i) => {
  const total = nightsOf(r);
  let night = 0;
  const plan = r.stops.map(([key, nights]) => {
    const d = DESTINATIONS[key];
    const from = night + 1;
    night += nights;
    const when = nights === 1 ? `Night ${from}` : `Nights ${from}–${night}`;
    return `<li class="t-${d.terrain}">
      <span class="mono when">${when}</span>
      <div><h4>${esc(d.name)}, ${esc(d.state)}</h4><p>${esc(d.blurb)}</p>${d.look ? `<p class="look"><b>Look for</b> ${esc(d.look)}</p>` : ""}</div>
    </li>`;
  }).join("");

  return `
  <article class="route" id="route-${i + 1}">
    <div class="route-head">
      <div>
        <p class="mono">Route ${i + 1} · ${plural(total, "night")} / ${plural(total + 1, "day")} · ${plural(r.stops.length, "stop")}</p>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.tagline)}</p>
      </div>
      ${photo(`route-${i + 1}`, "route-photo")}
    </div>
    ${strip(r)}
    <details class="plan">
      <summary>Stop-by-stop plan</summary>
      <ol class="plan-list">${plan}</ol>
    </details>
    <div class="actions">
      <a class="btn" href="#contact" data-pick="${i}">Enquire about route ${i + 1}</a>
    </div>
  </article>`;
}).join("");

/* ---------- PLACE INDEX (grouped by landscape, with the routes that visit) ---------- */
const routesVisiting = (key) => ROUTES.flatMap((r, i) => r.stops.some(([k]) => k === key) ? [i + 1] : []);

$("#placeIndex").innerHTML = Object.entries(TERRAINS).map(([terrain, label]) => {
  const rows = Object.entries(DESTINATIONS).filter(([, d]) => d.terrain === terrain).map(([key, d]) => `
    <li class="place">
      ${photo(key, "thumb")}
      <div class="place-body">
        <h4>${esc(d.name)} <span class="mono">${esc(d.state)}</span></h4>
        <p>${esc(d.blurb)}</p>
        ${d.look ? `<p class="look"><b>Look for</b> ${esc(d.look)}</p>` : ""}
      </div>
      <div class="place-routes"><span class="mono">Routes</span>${routesVisiting(key).map((n) => `<a href="#route-${n}" aria-label="Route ${n}">${n}</a>`).join("")}</div>
    </li>`).join("");
  return `<section class="group t-${terrain}"><h3><i></i>${esc(label)}</h3><ul>${rows}</ul></section>`;
}).join("");

/* ---------- SPECIES ---------- */
$("#speciesGrid").innerHTML = SPECIES.map((sp) => {
  const nums = [...new Set(sp.where.flatMap(routesVisiting))].sort();
  const terrain = DESTINATIONS[sp.where[0]].terrain;
  return `<li class="sp t-${terrain}">
    ${photo(`species-${sp.file}`, "sp-photo")}
    <div class="sp-body">
      <h3>${esc(sp.name)}</h3>
      <p>${esc(sp.note)}</p>
      <div class="place-routes"><span class="mono">Routes</span>${nums.map((n) => `<a href="#route-${n}" aria-label="Route ${n}">${n}</a>`).join("")}</div>
    </div>
  </li>`;
}).join("");

/* ---------- CONTACT DETAILS ---------- */
$("#contactList").innerHTML = [
  whatsappReady && `<li><span class="mono">WhatsApp / phone</span><a href="tel:+${SETTINGS.whatsapp}">${esc(SETTINGS.phoneDisplay)}</a></li>`,
  `<li><span class="mono">Email</span><a href="mailto:${esc(SETTINGS.email)}">${esc(SETTINGS.email)}</a></li>`,
  `<li><span class="mono">Based in</span>Kerala, India</li>`
].filter(Boolean).join("");

$("#routeSelect").insertAdjacentHTML("beforeend", ROUTES.map((r, i) =>
  `<option value="Route ${i + 1}: ${esc(r.title)}">Route ${i + 1}: ${esc(r.title)}</option>`).join(""));

document.addEventListener("click", (e) => {
  const pick = e.target.closest("[data-pick]");
  if (pick) $("#routeSelect").selectedIndex = Number(pick.dataset.pick) + 1;
});

/* ---------- ENQUIRY FORM -> WHATSAPP ---------- */
const form = $("#enquiryForm");
const status = $("#formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = form.elements;
  const messages = { fullName: "Enter your name.", phone: "Enter a phone number we can reach you on." };
  const missing = Object.keys(messages).filter((n) => !f[n].value.trim());
  for (const n of Object.keys(messages)) {
    f[n].setAttribute("aria-invalid", String(missing.includes(n)));
    $(`#err-${n}`).textContent = missing.includes(n) ? messages[n] : "";
  }
  if (missing.length) {
    status.textContent = "";
    f[missing[0]].focus();
    return;
  }
  const text = [
    "Hello Wildlife in Kerala, I would like to plan a trip.",
    `Name: ${f.fullName.value.trim()}`,
    `Phone: ${f.phone.value.trim()}`,
    f.email.value.trim() && `Email: ${f.email.value.trim()}`,
    `Route: ${f.route.value}`,
    f.date.value && `Travel date: ${f.date.value}`,
    `Travellers: ${f.travellers.value || 1}`,
    f.notes.value.trim() && `Notes: ${f.notes.value.trim()}`
  ].filter(Boolean).join("\n");

  if (!whatsappReady) {
    status.innerHTML = `WhatsApp is not available right now. Please email us at <a href="mailto:${esc(SETTINGS.email)}?subject=${encodeURIComponent("Trip enquiry")}&body=${encodeURIComponent(text)}">${esc(SETTINGS.email)}</a>.`;
    return;
  }
  status.textContent = "Opening WhatsApp with your details.";
  window.open(`https://wa.me/${SETTINGS.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

/* ---------- NAV ---------- */
const nav = $("#nav");
const links = $("#navLinks");
const burger = $("#burger");
const setMenu = (open) => {
  links.classList.toggle("open", open);
  nav.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", String(open));
};
burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- GALLERY: show the section only if at least one photo loads ---------- */
window.addEventListener("load", () => {
  if ($("#galleryGrid").children.length) $("#gallery").hidden = false;
});

$("#year").textContent = new Date().getFullYear();
