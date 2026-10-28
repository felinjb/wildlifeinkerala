/* One page for every route: route.html?r=1 ... route.html?r=4
   Needs data.js and common.js loaded first. */

const num = Number(new URLSearchParams(location.search).get("r"));
const route = ROUTES[num - 1];
if (!route) { location.replace("index.html#routes"); throw new Error("Unknown route"); }

const total = nightsOf(route);
const keys = route.stops.map(([k]) => k);
const states = statesOf(route);
document.title = `${route.title} | Wildlife in Kerala`;
$('meta[name="description"]').content =
  `${plural(total, "night")} through ${states.join(", ")}: ${keys.map(nameOf).join(", ")}. ${route.tagline}`;

const waText = `Hello Wildlife in Kerala, I am interested in Route ${num}: ${route.title}. My dates are about...`;

/* ---------- Nights table and itinerary share one running count ---------- */
let night = 0;
const rows = route.stops.map(([key, nights], i) => {
  const from = night + 1;
  night += nights;
  return { key, nights, i, from, to: night, when: nights === 1 ? `Night ${from}` : `Nights ${from} to ${night}`, d: DESTINATIONS[key] };
});

const table = rows.map((r) => `
  <tr data-i="${r.i}">
    <th scope="row"><a href="#stop-${r.i + 1}"><span class="num t-${r.d.terrain}">${r.i + 1}</span>${esc(r.d.name)}</a></th>
    <td>${esc(r.d.state)}</td>
    <td>${plural(r.nights, "night")}</td>
    <td>${r.when}</td>
  </tr>`).join("");

const stops = rows.map((r) => `
  <details class="stop t-${r.d.terrain}" id="stop-${r.i + 1}">
    <summary>
      <span class="num">${r.i + 1}</span>
      <span class="stop-title"><b>${esc(r.d.name)}</b>, ${esc(r.d.state)}</span>
      <span class="stop-when">${r.when}</span>
    </summary>
    <div class="stop-body">
      <img class="stop-photo" src="images/${esc(r.key)}.jpg" alt="${esc(r.d.name)}, ${esc(r.d.state)}" hidden onload="this.hidden=false" onerror="this.remove()">
      <div>
        <p>${esc(r.d.blurb)}</p>
        ${r.d.look ? `<p class="look"><b>You might see</b> ${esc(r.d.look)}</p>` : ""}
      </div>
    </div>
  </details>`).join("");

const list = (items) => `<ul class="ticks">${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
const hasTerms = TERMS.included.length || TERMS.excluded.length || TERMS.payment || TERMS.cancellation;
const terms = hasTerms ? `
  <div class="terms">
    ${TERMS.included.length ? `<div><h3>Included</h3>${list(TERMS.included)}</div>` : ""}
    ${TERMS.excluded.length ? `<div><h3>Not included</h3>${list(TERMS.excluded)}</div>` : ""}
    ${TERMS.payment ? `<div><h3>Payment</h3><p>${esc(TERMS.payment)}</p></div>` : ""}
    ${TERMS.cancellation ? `<div><h3>Cancellation</h3><p>${esc(TERMS.cancellation)}</p></div>` : ""}
  </div>` : `<p>Ask us what is included and how cancellation works before you decide. We will put it in writing with your quote.</p>`;

const others = ROUTES.map((r, i) => ({ r, i })).filter(({ i }) => i !== num - 1).map(({ r, i }) => `
  <li class="card card-small">
    <div class="card-body">
      <p class="label">Route ${i + 1} · ${plural(nightsOf(r), "night")}</p>
      <h3><a href="route.html?r=${i + 1}">${esc(r.title)}</a></h3>
      ${strip(r, { compact: true })}
    </div>
  </li>`).join("");

const enquire = `index.html?route=${num}#contact`;

$("#routeRoot").innerHTML = `
  <section class="route-hero">
    ${photo(`route-${num}`, "hero-bg", route.title).replace('loading="lazy"', 'fetchpriority="high"')}
    <div class="wrap route-hero-inner">
      <p class="crumb"><a href="index.html#routes">All routes</a> <span aria-hidden="true">/</span> Route ${num}</p>
      <h1>${esc(route.title)}</h1>
      <p class="lead">${esc(route.tagline)}</p>
    </div>
  </section>

  <div class="wrap">
    <dl class="facts facts-page">
      <div><dt>Duration</dt><dd>${plural(total, "night")}, ${plural(total + 1, "day")}</dd></div>
      <div><dt>Stops</dt><dd>${route.stops.length}</dd></div>
      <div><dt>Starts and ends</dt><dd>${esc(nameOf(keys[0]))} to ${esc(nameOf(keys[keys.length - 1]))}</dd></div>
      <div><dt>States</dt><dd>${esc(states.join(", "))}</dd></div>
      <div><dt>Price</dt><dd>${esc(priceOf(route))}</dd></div>
    </dl>
  </div>

  <section class="block block-tight">
    <div class="wrap route-grid">
      <div class="map-box">${mapSVG(keys)}<p class="muted small">Stops are placed by position. Straight lines show the order of the stops, not the roads.</p></div>
      <div>
        <h2>Nights at each stop</h2>
        ${strip(route)}
        <table class="nights">
          <caption class="sr">Stops in order, with nights</caption>
          <thead><tr><th scope="col">Stop</th><th scope="col">State</th><th scope="col">Stay</th><th scope="col">When</th></tr></thead>
          <tbody>${table}</tbody>
        </table>
        <ul class="legend" aria-label="Colour key">${Object.entries(TERRAINS).map(([k, l]) => `<li><i class="t-${k}"></i>${esc(l)}</li>`).join("")}</ul>
      </div>
    </div>
  </section>

  <section class="block block-paper" id="plan">
    <div class="wrap narrow">
      <header class="block-head">
        <h2>Stop by stop</h2>
        <p>Where you stay and what to look for. Nothing here is guaranteed, because wild animals choose where they are.</p>
        <button class="btn btn-sm btn-outline" id="toggleAll" type="button" aria-pressed="false">Collapse all</button>
      </header>
      <div id="stops">${stops}</div>
    </div>
  </section>

  <section class="block">
    <div class="wrap narrow">
      <header class="block-head"><h2>What is included</h2></header>
      ${terms}
    </div>
  </section>

  <section class="block block-forest">
    <div class="wrap narrow cta-block">
      <h2>Interested in this route?</h2>
      <p>Tell us your month and how many people are travelling. We will reply with a plan and a price.</p>
      <div class="actions" id="ctaActions"></div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <header class="block-head"><h2>Other routes</h2></header>
      <ul class="cards cards-3">${others}</ul>
    </div>
  </section>

  <div class="sticky-cta" id="stickyCta"><span class="sticky-title">${esc(route.title)}</span><div class="actions" id="stickyActions"></div></div>
`;

/* ---------- Call-to-action buttons ---------- */
const enquireBtn = `<a class="btn" href="${enquire}">Enquire about this route</a>`;
const waBtn = whatsappReady
  ? `<a class="btn btn-wa" href="${waLink(waText)}" target="_blank" rel="noopener">${WA_ICON}WhatsApp us</a>` : "";
$("#ctaActions").innerHTML = waBtn + enquireBtn.replace('class="btn"', 'class="btn btn-ghost"') +
  `<a class="btn btn-ghost" href="index.html?load=${num}#build">Customise this route</a>`;
$("#stickyActions").innerHTML = (waBtn || "") + `<a class="btn btn-sm" href="${enquire}">Enquire</a>`;

/* ---------- Stops: open on wide screens, closed on phones ---------- */
const stopEls = $$("#stops details");
const wide = window.matchMedia("(min-width: 861px)");
stopEls.forEach((el) => { el.open = wide.matches; });
const toggle = $("#toggleAll");
const syncToggle = () => {
  const allOpen = stopEls.every((el) => el.open);
  toggle.textContent = allOpen ? "Collapse all" : "Expand all";
  toggle.setAttribute("aria-pressed", String(allOpen));
};
syncToggle();
toggle.addEventListener("click", () => {
  const open = !stopEls.every((el) => el.open);
  stopEls.forEach((el) => { el.open = open; });
  syncToggle();
});
stopEls.forEach((el) => el.addEventListener("toggle", syncToggle));

/* A map dot or table link opens its stop before scrolling to it. */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#stop-"]');
  if (!a) return;
  const target = $(a.getAttribute("href"));
  if (target) target.open = true;
});

/* ---------- Table row and map dot highlight each other ---------- */
const mark = (i, on) => {
  $$(`[data-i="${i}"]`).forEach((el) => el.classList.toggle("on", on));
};
$$("[data-i]").forEach((el) => {
  el.addEventListener("mouseenter", () => mark(el.dataset.i, true));
  el.addEventListener("mouseleave", () => mark(el.dataset.i, false));
  el.addEventListener("focusin", () => mark(el.dataset.i, true));
  el.addEventListener("focusout", () => mark(el.dataset.i, false));
});

if (!whatsappReady) $("#stickyCta").classList.add("no-wa");
