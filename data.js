/* ============================================================
   WILDLIFE IN KERALA: all the content lives in this file.
   Night counts, totals, maps and tables on every page are
   generated from ROUTES below, so they can never disagree.
   ============================================================ */

/* ---------- SETTINGS (edit these first) ---------- */
const SETTINGS = {
  whatsapp: "910000000000",          // digits only, country code first (India: 91 + 10 digits)
  phoneDisplay: "+91 00000 00000",
  email: "info@wildlifeinkerala.com",
  address: ""                        // e.g. "Kochi, Kerala 682001". Shown in the footer when filled in.
};

/* ---------- LANDSCAPES (colour key for the route bars) ---------- */
const TERRAINS = {
  forest: "Forest and sanctuary",
  hill:   "Hills and tea country",
  water:  "Backwaters and coast",
  city:   "Cities"
};

/* ---------- DESTINATIONS ----------
   lat / lon place the stop on the maps (approximate town positions).
   side = where the map label sits: r, l, t or b.
   Optional photo: images/<key>.jpg                                        */
const DESTINATIONS = {
  kabini:      { name: "Kabini",         state: "Karnataka",  terrain: "forest", lat: 11.98, lon: 76.35, side: "l", blurb: "Kabini reservoir on the edge of Nagarhole, explored by boat and jeep safari.", look: "Elephants by the water. Leopard and tiger are possible but never certain." },
  thattekkad:  { name: "Thattekkad",     state: "Kerala",     terrain: "forest", lat: 10.12, lon: 76.70, side: "l", blurb: "Salim Ali Bird Sanctuary beside the Periyar river, on the edge of the Western Ghats.", look: "Malabar grey hornbill, Sri Lanka frogmouth and other forest birds." },
  thekkady:    { name: "Thekkady",       state: "Kerala",     terrain: "forest", lat: 9.60,  lon: 77.17, side: "r", blurb: "Periyar Tiger Reserve, with boat rides on the lake, forest walks and spice gardens.", look: "Elephants, sambar and gaur at the lake edge." },
  chinnar:     { name: "Chinnar",        state: "Kerala",     terrain: "forest", lat: 10.31, lon: 77.18, side: "r", blurb: "A dry-forest sanctuary in the rain shadow of the Ghats, good for walking and trekking.", look: "Grizzled giant squirrel, star tortoise and birds." },

  munnar:      { name: "Munnar",         state: "Kerala",     terrain: "hill",   lat: 10.09, lon: 77.06, side: "r", blurb: "Tea-covered hills and Eravikulam National Park.", look: "Nilgiri tahr." },
  valparai:    { name: "Valparai",       state: "Tamil Nadu", terrain: "hill",   lat: 10.33, lon: 76.95, side: "l", blurb: "The Anamalai hills, where tea estates wrap around fragments of rainforest.", look: "Lion-tailed macaque, Nilgiri langur and hornbills." },
  coonoor:     { name: "Coonoor / Ooty", state: "Tamil Nadu", terrain: "hill",   lat: 11.35, lon: 76.80, side: "r", blurb: "Nilgiri tea gardens, cool air and slow nature walks." },
  wayanad:     { name: "Wayanad",        state: "Kerala",     terrain: "hill",   lat: 11.70, lon: 76.10, side: "l", blurb: "Misty hills, spice estates, caves and wildlife sanctuary country.", look: "Elephants, gaur and hill birds." },

  houseboat:   { name: "Houseboat",      state: "Kerala",     terrain: "water",  lat: 9.49,  lon: 76.34, side: "b", blurb: "One night afloat on the Kerala backwaters.", look: "Kingfishers, egrets and darters." },
  mararikulam: { name: "Mararikulam",    state: "Kerala",     terrain: "water",  lat: 9.62,  lon: 76.30, side: "l", blurb: "A quiet beach and village stay to slow down after the forests." },
  neeleshwar:  { name: "Neeleshwar",     state: "Kerala",     terrain: "water",  lat: 12.25, lon: 75.12, side: "l", blurb: "Beaches and backwaters on the north Malabar coast, close to Bekal Fort." },

  cochin:      { name: "Cochin",         state: "Kerala",     terrain: "city",   lat: 9.93,  lon: 76.27, side: "l", blurb: "Fort Kochi's old quarter, Chinese fishing nets and spice markets. A gentle place to start or finish." },
  mysore:      { name: "Mysore",         state: "Karnataka",  terrain: "city",   lat: 12.30, lon: 76.65, side: "r", blurb: "Mysore Palace and Chamundi Hill, a heritage stop between Bangalore and Kabini." },
  bangalore:   { name: "Bangalore",      state: "Karnataka",  terrain: "city",   lat: 12.97, lon: 77.59, side: "l", blurb: "An easy arrival and departure city with an international airport." }
};

/* ---------- ROUTES ----------
   stops: [destinationKey, nights]
   price: leave "" to show "Quote on request". Otherwise e.g. "From ₹85,000 per person, 4 guests".
   Optional photo: images/route-<number>.jpg                                                    */
const ROUTES = [
  { title: "Western Ghats and Tiger Country",
    tagline: "Kerala birding, Anamalai forests, the Nilgiris and Kabini safaris.",
    price: "",
    stops: [["cochin",2],["thattekkad",2],["valparai",2],["coonoor",2],["kabini",2],["mysore",2],["bangalore",1]] },
  { title: "Kabini, Nilgiris and the Malabar Coast",
    tagline: "Start in Bangalore, then safari, hills, Wayanad and the northern coast.",
    price: "",
    stops: [["bangalore",1],["mysore",2],["kabini",2],["coonoor",2],["wayanad",2],["neeleshwar",2]] },
  { title: "Kerala Hills, Wildlife and Backwaters",
    tagline: "Birding, tea hills, Periyar, a houseboat night and a quiet beach.",
    price: "",
    stops: [["cochin",2],["thattekkad",2],["munnar",2],["thekkady",2],["houseboat",1],["mararikulam",2]] },
  { title: "The Grand South India Wildlife Trail",
    tagline: "The longest route: Karnataka, the Nilgiris, Chinnar and Kerala's birding belt.",
    price: "",
    stops: [["bangalore",1],["mysore",2],["kabini",2],["coonoor",2],["chinnar",2],["thattekkad",2],["cochin",2]] }
];

/* ---------- SPECIES ----------
   where: destination keys. Optional photo: images/species-<file>.jpg
   Delete any animal you are not comfortable promising.                */
const SPECIES = [
  { name: "Asian elephant",          file: "elephant", where: ["kabini","thekkady","wayanad"], note: "Herds come down to the water at Kabini. Also seen around Thekkady and Wayanad." },
  { name: "Gaur",                    file: "gaur",     where: ["thekkady","wayanad"],          note: "The largest wild cattle in the world, found in the hill forests." },
  { name: "Nilgiri tahr",            file: "tahr",     where: ["munnar"],                      note: "A mountain goat of the high grasslands around Munnar." },
  { name: "Lion-tailed macaque",     file: "macaque",  where: ["valparai"],                    note: "A rainforest monkey of the Anamalai hills." },
  { name: "Malabar grey hornbill",   file: "hornbill", where: ["thattekkad"],                  note: "A forest bird you can look for along the Periyar river." },
  { name: "Grizzled giant squirrel", file: "squirrel", where: ["chinnar"],                     note: "A rare tree squirrel of Chinnar's dry forest." },
  { name: "Leopard",                 file: "leopard",  where: ["kabini"],                      note: "Keeps to forest edges. Possible, and never certain." },
  { name: "Tiger",                   file: "tiger",    where: ["kabini"],                      note: "Kabini and Nagarhole have tigers, but sightings are rare. We will not promise one." }
];

/* ---------- TERMS (shown on every route page once filled in) ----------
   Fill these in with your real policies. Empty lists stay hidden and the
   page tells visitors to ask instead. Do not copy another company's terms. */
const TERMS = {
  included: [],        // e.g. ["Accommodation", "Breakfast", "Private vehicle and driver", "Safari fees listed in your quote"]
  excluded: [],        // e.g. ["Flights and trains", "Camera fees in parks", "Personal expenses"]
  payment: "",         // e.g. "A deposit confirms the booking. The balance is due 30 days before travel."
  cancellation: ""     // e.g. your cancellation steps in plain words
};

/* ---------- TEAM (named people build trust) ----------
   Add real people, with their photo in images/team-<n>.jpg (optional).
   Example: { name: "Your Name", role: "Founder and guide", bio: "Two sentences about you." } */
const TEAM = [];

/* ---------- PHOTO CREDITS ----------
   For any photo you did not take. Example:
   { file: "tiger", by: "Photographer name", source: "Wikimedia Commons", licence: "CC BY 4.0" } */
const CREDITS = [];
