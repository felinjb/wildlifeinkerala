/* Route builder: pick a start on the map, then add, skip and reorder stops.
   "Usual" links are the ones that already appear in one of the four routes in data.js.
   Needs data.js, common.js and home.js loaded first. */
(() => {
  const ALL = Object.keys(DESTINATIONS);
  const MIN_NIGHTS = 1, MAX_NIGHTS = 7;

  /* ---------- What our routes already connect ---------- */
  const linkKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const LINKS = new Set(ROUTES.flatMap((r) => r.stops.slice(1).map((s, i) => linkKey(r.stops[i][0], s[0]))));
  const isUsual = (a, b) => LINKS.has(linkKey(a, b));
  const usualNext = (k) => ALL.filter((o) => o !== k && isUsual(k, o));
  const STARTS = [...new Set(ROUTES.map((r) => r.stops[0][0]))];

  const DEFAULT_NIGHTS = {};
  ROUTES.forEach((r) => r.stops.forEach(([k, n]) => { if (!(k in DEFAULT_NIGHTS)) DEFAULT_NIGHTS[k] = n; }));

  const km = (a, b) => {
    const A = DESTINATIONS[a], B = DESTINATIONS[b], rad = Math.PI / 180;
    const dLat = (B.lat - A.lat) * rad, dLon = (B.lon - A.lon) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(A.lat * rad) * Math.cos(B.lat * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  };

  /* Ready-made routes that pass through a stop, read forwards or backwards from it. */
  function suggestionsFrom(start) {
    const seen = new Set(), out = [];
    ROUTES.forEach((r, i) => {
      const idx = r.stops.findIndex(([k]) => k === start);
      if (idx < 0) return;
      const forward = r.stops.slice(idx);
      const backward = r.stops.slice(0, idx + 1).reverse();
      [[forward, false], [backward, true]].forEach(([stops, reversed]) => {
        const sig = stops.map(([k]) => k).join(">");
        if (stops.length < 3 || seen.has(sig)) return;
        seen.add(sig);
        const whole = stops.length === r.stops.length;
        out.push({
          label: `${whole ? "Route" : "Part of route"} ${i + 1}${reversed ? ", in reverse" : ""}`,
          stops: stops.map(([key, nights]) => ({ key, nights }))
        });
      });
    });
    return out.sort((a, b) => b.stops.length - a.stops.length).slice(0, 6);
  }

  /* ---------- State ---------- */
  let trip = [];
  let suggestions = [];
  const mapEl = $("#buildMap"), panel = $("#buildPanel"), live = $("#buildStatus");
  const proj = projector(ALL, { W: 480, H: 600, padX: 116, padY: 54 });

  const inTrip = (k) => trip.some((t) => t.key === k);
  const last = () => trip[trip.length - 1];
  const totalNights = () => trip.reduce((sum, t) => sum + t.nights, 0);
  const say = (text) => { live.textContent = text; };
  const summary = () => `${plural(trip.length, "stop")}, ${plural(totalNights(), "night")}`;

  /* ---------- Map ---------- */
  function drawMap() {
    const { X, Y, W, H } = proj;
    const pt = (la, lo) => `${X(lo).toFixed(1)},${Y(la).toFixed(1)}`;
    const land = [...COAST.map(([la, lo]) => pt(la, lo)), pt(7, 80), pt(15, 80), pt(15, COAST[0][1])].join(" ");
    const states = STATE_LABELS.map((s) =>
      `<text class="state-label" x="${X(s.lon).toFixed(1)}" y="${Y(s.lat).toFixed(1)}" text-anchor="middle">${s.t}</text>`).join("");

    const legs = trip.slice(1).map((t, i) => {
      const a = DESTINATIONS[trip[i].key], b = DESTINATIONS[t.key];
      return `<line class="leg-line ${isUsual(trip[i].key, t.key) ? "ok" : "new"}" x1="${X(a.lon).toFixed(1)}" y1="${Y(a.lat).toFixed(1)}" x2="${X(b.lon).toFixed(1)}" y2="${Y(b.lat).toFixed(1)}"/>`;
    }).join("");

    const nexts = new Set(trip.length ? usualNext(last().key) : STARTS);
    const dots = ALL.map((k) => {
      const d = DESTINATIONS[k];
      const idx = trip.findIndex((t) => t.key === k);
      const x = X(d.lon), y = Y(d.lat);
      const kind = idx >= 0 ? "in" : nexts.has(k) ? "next" : "other";
      const r = { in: 14, next: 9, other: 7 }[kind];
      const off = r + 8;
      const [lx, ly, anchor] = { r: [x + off, y + 5, "start"], l: [x - off, y + 5, "end"], t: [x, y - off, "middle"], b: [x, y + off + 10, "middle"] }[d.side || "r"];
      const tip = idx >= 0 ? `${d.name}, stop ${idx + 1}` : trip.length ? `Add ${d.name}` : `Start at ${d.name}`;
      return `<g class="bd t-${d.terrain} ${kind}" data-key="${k}">
        <title>${esc(tip)}</title>
        <circle class="hit" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22"/>
        <circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>
        ${idx >= 0 ? `<text class="map-num" x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle">${idx + 1}</text>` : ""}
        <text class="map-label" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}">${esc(d.name)}</text>
      </g>`;
    }).join("");

    mapEl.innerHTML = `<svg class="map" viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <rect class="sea" width="${W}" height="${H}"/><polygon class="land" points="${land}"/>${states}${legs}${dots}</svg>`;
  }

  /* ---------- Panel ---------- */
  const chip = (k, extra = "") => {
    const d = DESTINATIONS[k];
    return `<button type="button" class="chip t-${d.terrain} ${extra}" data-act="add" data-key="${k}" data-fk="add:${k}"><i></i>${esc(d.name)}</button>`;
  };

  function startPanel() {
    const rest = ALL.filter((k) => !STARTS.includes(k));
    return `
      <h3 id="buildHead" tabindex="-1">Where do you want to start?</h3>
      <p>Click a stop on the map, or choose one below.</p>
      <p class="label">Where our routes start</p>
      <div class="chips">${STARTS.map((k) => chip(k, "usual")).join("")}</div>
      <p class="label">Other places to start</p>
      <div class="chips">${rest.map((k) => chip(k)).join("")}</div>
      <h4>Or start from one of our routes and change it</h4>
      <ul class="presets">${ROUTES.map((r, i) => `
        <li><button type="button" class="preset" data-act="load" data-r="${i + 1}" data-fk="load:${i + 1}">
          <b>Route ${i + 1}: ${esc(r.title)}</b>
          <span>${r.stops.map(([k]) => esc(nameOf(k))).join(" → ")}</span>
        </button></li>`).join("")}</ul>`;
  }

  function tripPanel() {
    const items = trip.map((t, i) => {
      const d = DESTINATIONS[t.key];
      const next = trip[i + 1];
      let leg = "";
      if (next) {
        const usual = isUsual(t.key, next.key);
        const dist = Math.round(km(t.key, next.key) / 10) * 10;
        leg = `<p class="leg ${usual ? "ok" : "new"}">${usual
          ? `Usual link in our routes`
          : `Not one of our usual drives. We will check the drive time`} · about ${dist} km in a straight line</p>`;
      }
      return `<li class="trip-item t-${d.terrain}">
        <div class="trip-row">
          <span class="num">${i + 1}</span>
          <div class="trip-main"><b>${esc(d.name)}</b></div>
          <div class="stepper" role="group" aria-label="Nights in ${esc(d.name)}">
            <button type="button" data-act="less" data-i="${i}" data-fk="less:${i}" aria-label="Fewer nights in ${esc(d.name)}" ${t.nights <= MIN_NIGHTS ? "disabled" : ""}>−</button>
            <output>${plural(t.nights, "night")}</output>
            <button type="button" data-act="more" data-i="${i}" data-fk="more:${i}" aria-label="More nights in ${esc(d.name)}" ${t.nights >= MAX_NIGHTS ? "disabled" : ""}>+</button>
          </div>
        </div>
        <div class="trip-tools">
          <button type="button" data-act="up" data-i="${i}" data-fk="up:${i}" aria-label="Move ${esc(d.name)} earlier" ${i === 0 ? "disabled" : ""}>Earlier</button>
          <button type="button" data-act="down" data-i="${i}" data-fk="down:${i}" aria-label="Move ${esc(d.name)} later" ${i === trip.length - 1 ? "disabled" : ""}>Later</button>
          <button type="button" data-act="skip" data-i="${i}" data-fk="skip:${i}" aria-label="Skip ${esc(d.name)}">Skip</button>
        </div>
        ${leg}
      </li>`;
    }).join("");

    const nexts = usualNext(last().key).filter((k) => !inTrip(k));
    const others = ALL.filter((k) => !inTrip(k) && !nexts.includes(k));
    const add = !others.length && !nexts.length ? `<p>Every stop is in your route.</p>` : `
      <h4>Add the next stop</h4>
      <p class="label">Usual next stops from ${esc(nameOf(last().key))}</p>
      ${nexts.length ? `<div class="chips">${nexts.map((k) => chip(k, "usual")).join("")}</div>`
        : `<p class="muted small">None left. Our routes do not continue from here, but you can still add any stop below.</p>`}
      ${others.length ? `<p class="label">Other stops. We will check the drive time</p><div class="chips">${others.map((k) => chip(k, "other")).join("")}</div>` : ""}`;

    const ideas = trip.length === 1 && suggestions.length ? `
      <h4>Ready-made routes from ${esc(nameOf(trip[0].key))}</h4>
      <ul class="presets">${suggestions.map((s, i) => `
        <li><button type="button" class="preset" data-act="preset" data-s="${i}" data-fk="preset:${i}">
          <b>${esc(s.label)}: ${plural(s.stops.reduce((n, x) => n + x.nights, 0), "night")}</b>
          <span>${s.stops.map((x) => esc(nameOf(x.key))).join(" → ")}</span>
        </button></li>`).join("")}</ul>` : "";

    const ready = trip.length >= 2;
    const wa = ready && whatsappReady
      ? `<a class="btn btn-wa" href="${waLink("Hello Wildlife in Kerala, I would like to plan this route:\n" + planText())}" target="_blank" rel="noopener">${WA_ICON}WhatsApp this plan</a>` : "";

    return `
      <h3 id="buildHead" tabindex="-1">Your route</h3>
      <p class="trip-total"><b>${summary()}</b>${ready ? `, ${plural(totalNights() + 1, "day")}` : ""}</p>
      <ol class="trip">${items}</ol>
      ${add}
      ${ideas}
      <div class="actions build-actions">
        <button type="button" class="btn" data-act="enquire" ${ready ? "" : "disabled"}>Enquire about this route</button>
        ${wa}
        <button type="button" class="btn btn-outline" data-act="reset">Start again</button>
      </div>
      ${ready ? "" : `<p class="muted small">Add at least two stops to send your route.</p>`}`;
  }

  function planText() {
    let n = 0;
    const lines = trip.map((t, i) => { n += t.nights; return `${i + 1}. ${nameOf(t.key)}: ${plural(t.nights, "night")}`; });
    const checks = trip.slice(1).flatMap((t, i) => isUsual(trip[i].key, t.key) ? [] : [`${nameOf(trip[i].key)} to ${nameOf(t.key)}`]);
    return [`My route (${plural(n, "night")}, ${plural(n + 1, "day")}):`, ...lines,
      checks.length ? `Drives to check: ${checks.join(", ")}` : ""].filter(Boolean).join("\n");
  }

  /* ---------- Render, with focus kept where the visitor was ---------- */
  function render(focus) {
    drawMap();
    panel.innerHTML = trip.length ? tripPanel() : startPanel();
    if (focus === undefined) return;
    const target = focus === "firstAdd" ? panel.querySelector('[data-act="add"]')
      : focus ? panel.querySelector(`[data-fk="${focus}"]`) : null;
    (target && !target.disabled ? target : $("#buildHead")).focus({ preventScroll: true });
  }

  /* ---------- Actions ---------- */
  function addStop(key) {
    if (inTrip(key)) return;
    trip.push({ key, nights: DEFAULT_NIGHTS[key] || 2 });
    if (trip.length === 1) {
      suggestions = suggestionsFrom(key);
      say(`Starting at ${nameOf(key)}. Now choose the next stop.`);
    } else {
      say(`Added ${nameOf(key)}. ${summary()}.`);
    }
    render("firstAdd");
  }

  function onPanel(e) {
    const b = e.target.closest("[data-act]");
    if (!b || b.disabled) return;
    const i = Number(b.dataset.i);
    switch (b.dataset.act) {
      case "add": addStop(b.dataset.key); return;
      case "load": loadRoute(Number(b.dataset.r)); return;
      case "preset":
        trip = suggestions[Number(b.dataset.s)].stops.map((s) => ({ ...s }));
        say(`Loaded ${suggestions[Number(b.dataset.s)].label}. ${summary()}.`);
        render(""); return;
      case "less": trip[i].nights = Math.max(MIN_NIGHTS, trip[i].nights - 1); say(`${nameOf(trip[i].key)}: ${plural(trip[i].nights, "night")}. ${summary()}.`); render(`less:${i}`); return;
      case "more": trip[i].nights = Math.min(MAX_NIGHTS, trip[i].nights + 1); say(`${nameOf(trip[i].key)}: ${plural(trip[i].nights, "night")}. ${summary()}.`); render(`more:${i}`); return;
      case "up": [trip[i - 1], trip[i]] = [trip[i], trip[i - 1]]; say(`Moved ${nameOf(trip[i - 1].key)} to stop ${i}.`); render(`up:${i - 1}`); return;
      case "down": [trip[i + 1], trip[i]] = [trip[i], trip[i + 1]]; say(`Moved ${nameOf(trip[i + 1].key)} to stop ${i + 2}.`); render(`down:${i + 1}`); return;
      case "skip": {
        const name = nameOf(trip[i].key);
        trip.splice(i, 1);
        if (!trip.length) suggestions = [];
        else if (trip.length === 1) suggestions = suggestionsFrom(trip[0].key);
        say(`Skipped ${name}. ${trip.length ? summary() + "." : "Your route is empty."}`);
        render(""); return;
      }
      case "reset": trip = []; suggestions = []; say("Route cleared."); render(""); return;
      case "enquire": enquire(); return;
    }
  }

  function loadRoute(n) {
    const r = ROUTES[n - 1];
    if (!r) return;
    trip = r.stops.map(([key, nights]) => ({ key, nights }));
    suggestions = [];
    say(`Loaded route ${n}. ${summary()}. Change it however you like.`);
    render("");
  }

  /* Puts the plan into the enquiry form, so the visitor only adds a name and number. */
  function enquire() {
    const route = $("#f-route"), notes = $("#f-notes");
    route.value = "My own route";
    const own = notes.value.replace(/^My route[\s\S]*?(\n\n|$)/, "").trim();
    notes.value = planText() + (own ? `\n\n${own}` : "");
    $("#contact").scrollIntoView();
    $("#f-name").focus({ preventScroll: true });
    $("#formStatus").textContent = "Your route is in the message box. Add your name and number, then send.";
  }

  panel.addEventListener("click", onPanel);
  mapEl.addEventListener("click", (e) => {
    const g = e.target.closest(".bd");
    if (g) addStop(g.dataset.key);
  });

  /* A route page can open the builder with one of the routes loaded: index.html?load=2#build */
  const wanted = Number(new URLSearchParams(location.search).get("load"));
  if (wanted) loadRoute(wanted); else render();
})();
