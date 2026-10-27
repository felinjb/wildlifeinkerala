/* Home page. Needs data.js and common.js loaded first. */

/* ---------- Hero ---------- */
const nightCounts = ROUTES.map(nightsOf);
$("#heroLead").textContent =
  `Routes of ${Math.min(...nightCounts)} to ${Math.max(...nightCounts)} nights. Pick one, or tell us your dates and we will adjust it.`;
if (whatsappReady) {
  const second = $("#heroSecondary");
  second.textContent = "Message us on WhatsApp";
  second.href = waLink("Hello Wildlife in Kerala, I would like to plan a wildlife trip.");
  second.target = "_blank";
  second.rel = "noopener";
}

/* ---------- Route cards: the comparison table ---------- */
$("#routeCards").innerHTML = ROUTES.map((r, i) => {
  const n = nightsOf(r);
  const first = nameOf(r.stops[0][0]), last = nameOf(r.stops[r.stops.length - 1][0]);
  return `
  <li class="card">
    <div class="card-photo">${photo(`route-${i + 1}`, "", `${r.title}`)}</div>
    <div class="card-body">
      <p class="label">Route ${i + 1}</p>
      <h3><a href="route.html?r=${i + 1}">${esc(r.title)}</a></h3>
      <p>${esc(r.tagline)}</p>
      ${strip(r)}
      <dl class="facts facts-card">
        <div><dt>Duration</dt><dd>${plural(n, "night")}, ${plural(n + 1, "day")}</dd></div>
        <div><dt>Stops</dt><dd>${r.stops.length}</dd></div>
        <div><dt>Route</dt><dd>${esc(first)} to ${esc(last)}</dd></div>
        <div><dt>Price</dt><dd>${esc(priceOf(r))}</dd></div>
      </dl>
      <div class="actions">
        <a class="btn btn-sm" href="route.html?r=${i + 1}">See route and map</a>
        <a class="btn btn-sm btn-outline" href="index.html?route=${i + 1}#contact" data-pick="${i + 1}">Enquire</a>
      </div>
    </div>
  </li>`;
}).join("");

$("#legend").innerHTML = Object.entries(TERRAINS).map(([k, label]) =>
  `<li><i class="t-${k}"></i>${esc(label)}</li>`).join("");

/* ---------- Overview map and place index ---------- */
$("#overviewMap").innerHTML = mapSVG(Object.keys(DESTINATIONS), { numbered: false, route: false, H: 600, padX: 116 });

$("#placeIndex").innerHTML = Object.entries(TERRAINS).map(([terrain, label]) => {
  const items = Object.entries(DESTINATIONS).filter(([, d]) => d.terrain === terrain).map(([key, d]) => `
    <li>
      <span class="place-name">${esc(d.name)} <span class="muted">${esc(d.state)}</span></span>
      <span class="place-routes">${routesVisiting(key).map((n) => `<a href="route.html?r=${n}" aria-label="Route ${n}, ${esc(d.name)}">${n}</a>`).join("")}</span>
    </li>`).join("");
  return `<section class="group t-${terrain}"><h3><i></i>${esc(label)}</h3><ul>${items}</ul></section>`;
}).join("") + `<p class="muted small">The numbers link to the routes that pass through each place.</p>`;

/* ---------- Species ---------- */
$("#speciesGrid").innerHTML = SPECIES.map((sp) => {
  const nums = [...new Set(sp.where.flatMap(routesVisiting))].sort();
  const terrain = DESTINATIONS[sp.where[0]].terrain;
  return `<li class="sp t-${terrain}">
    <div class="sp-photo">${photo(`species-${sp.file}`, "", sp.name)}</div>
    <div class="sp-body">
      <h3>${esc(sp.name)}</h3>
      <p>${esc(sp.note)}</p>
      <div class="place-routes"><span class="label">Routes</span>${nums.map((n) => `<a href="route.html?r=${n}" aria-label="Route ${n}">${n}</a>`).join("")}</div>
    </div>
  </li>`;
}).join("");

/* ---------- Team (only when filled in) ---------- */
$("#team").innerHTML = TEAM.map((p, i) => `
  <li>${photo(`team-${i + 1}`, "team-photo", p.name)}<div><h3>${esc(p.name)}</h3><p class="label">${esc(p.role)}</p><p>${esc(p.bio)}</p></div></li>`).join("");

/* ---------- Contact ---------- */
$("#contactList").innerHTML = [
  whatsappReady && `<li><span class="label">WhatsApp and phone</span><a href="tel:+${SETTINGS.whatsapp}">${esc(SETTINGS.phoneDisplay)}</a></li>`,
  `<li><span class="label">Email</span><a href="mailto:${esc(SETTINGS.email)}">${esc(SETTINGS.email)}</a></li>`,
  SETTINGS.address && `<li><span class="label">Based in</span>${esc(SETTINGS.address)}</li>`
].filter(Boolean).join("");

const form = $("#enquiryForm");
const status = $("#formStatus");
$("#f-route").insertAdjacentHTML("beforeend", ROUTES.map((r, i) =>
  `<option value="Route ${i + 1}: ${esc(r.title)}">Route ${i + 1}: ${esc(r.title)}</option>`).join(""));
$("#f-month").insertAdjacentHTML("beforeend", ["January","February","March","April","May","June","July","August","September","October","November","December"]
  .map((m) => `<option>${m}</option>`).join(""));
if (!whatsappReady) $("#submitBtn").textContent = "Send by email";

function pickRoute(n) {
  if (n >= 1 && n <= ROUTES.length) $("#f-route").selectedIndex = n;
}
pickRoute(Number(new URLSearchParams(location.search).get("route")));
document.addEventListener("click", (e) => {
  const pick = e.target.closest("[data-pick]");
  if (pick) pickRoute(Number(pick.dataset.pick));
});

const RULES = {
  fullName: { ok: (v) => v.trim().length > 0, msg: "Enter your name." },
  phone: { ok: (v) => v.replace(/\D/g, "").length >= 8, msg: "Enter a phone number we can reach you on, with at least 8 digits." }
};
function check(name) {
  const input = form.elements[name];
  const bad = !RULES[name].ok(input.value);
  input.setAttribute("aria-invalid", String(bad));
  $(`#err-${name}`).textContent = bad ? RULES[name].msg : "";
  return !bad;
}
for (const name of Object.keys(RULES)) {
  form.elements[name].addEventListener("blur", () => { if (form.elements[name].value) check(name); });
  form.elements[name].addEventListener("input", () => { if (form.elements[name].getAttribute("aria-invalid") === "true") check(name); });
}

function message() {
  const f = form.elements;
  return [
    "Hello Wildlife in Kerala, I would like to plan a trip.",
    `Name: ${f.fullName.value.trim()}`,
    `Phone: ${f.phone.value.trim()}`,
    f.email.value.trim() && `Email: ${f.email.value.trim()}`,
    `Route: ${f.route.value}`,
    `Month: ${f.month.value}`,
    `Travellers: ${f.travellers.value || 1}`,
    f.notes.value.trim() && `Notes: ${f.notes.value.trim()}`
  ].filter(Boolean).join("\n");
}
function validate() {
  const results = Object.keys(RULES).map(check);
  const firstBad = Object.keys(RULES).find((n) => form.elements[n].getAttribute("aria-invalid") === "true");
  if (firstBad) { form.elements[firstBad].focus(); status.textContent = ""; return false; }
  return true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;
  if (whatsappReady) {
    status.textContent = "Opening WhatsApp with your details. Press send there to reach us.";
    window.open(waLink(message()), "_blank", "noopener");
  } else {
    status.textContent = "Opening your email app with your details.";
    location.href = mailLink("Trip enquiry", message());
  }
});
$("#emailBtn").addEventListener("click", (e) => {
  e.preventDefault();
  if (!validate()) return;
  status.textContent = "Opening your email app with your details.";
  location.href = mailLink("Trip enquiry", message());
});

mountWhatsApp("Hello Wildlife in Kerala, I would like to plan a wildlife trip.");
