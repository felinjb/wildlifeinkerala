# Wildlife in Kerala website

Plain HTML, CSS and JavaScript. No build step. Works on GitHub Pages.

```
index.html         home page
route.html         one template for all four routes (route.html?r=1 to ?r=4)
css/style.css      design
js/data.js         ALL your content: contact details, routes, places, animals, terms, team
js/common.js       shared code (maps, route bars, menu, WhatsApp button)
js/home.js         home page code
js/route.js        route page code
images/            your photos
CNAME              custom domain (wildlifeinkerala.com)
```

## Before you publish (checklist)

1. **Contact details.** In `js/data.js`, set `whatsapp`, `phoneDisplay`, `email` and `address`. Until a real WhatsApp number is set, the WhatsApp button is hidden and the form sends by email.
2. **Prices.** Each route in `js/data.js` has `price: ""`. Fill it in, for example `"From ₹85,000 per person, 4 guests"`. Empty shows "Quote on request". Say what the price is based on.
3. **Terms.** Fill in the `TERMS` block (included, not included, payment, cancellation) with your real policies. Until then each route page tells visitors to ask.
4. **Named people.** Add yourself and your guides to `TEAM`. Real names and photos build more trust than any slogan.
5. **Check every claim.** Check the "You might see" lines in `DESTINATIONS` and the `SPECIES` list. They were written from general knowledge, not from your own sightings. Delete anything you cannot stand behind.
6. **Season and closures.** The site does not state best months or park closures, because they differ by park and change. Check the forest department websites for each park and add what you verify to the descriptions.
7. **Registrations.** If you hold tourism registrations, add them with their numbers in the footer (`index.html` and `route.html`).
8. **No invented reviews.** Add real reviews only once guests have given them, ideally by linking to a Google Business or Tripadvisor page.

## Photos (all optional)

If a file is missing the site simply leaves it out. Use JPG files with these exact names, and compress each to under 200 KB (squoosh.app works well). Use only photos you own or have permission to use. Caption nothing falsely: a photo must show the place and animal it is labelled with.

| File | Where it appears | Size |
|---|---|---|
| `hero.jpg` | Home page top background (dark layer keeps text readable) | 2000x1100 |
| `route-1.jpg` to `route-4.jpg` | Route card and top of each route page | 1600x900 |
| `kabini.jpg`, `thattekkad.jpg`, `thekkady.jpg`, `chinnar.jpg`, `munnar.jpg`, `valparai.jpg`, `coonoor.jpg`, `wayanad.jpg`, `houseboat.jpg`, `mararikulam.jpg`, `neeleshwar.jpg`, `cochin.jpg`, `mysore.jpg`, `bangalore.jpg` | Stop-by-stop plan on route pages | 800x600 |
| `species-elephant.jpg`, `species-gaur.jpg`, `species-tahr.jpg`, `species-macaque.jpg`, `species-hornbill.jpg`, `species-squirrel.jpg`, `species-leopard.jpg`, `species-tiger.jpg` | "What you might see" cards | 900x600 |
| `about.jpg` | About section | 900x1125 |
| `team-1.jpg`, `team-2.jpg` ... | Round photos in `TEAM`, in the same order | 300x300 |

For any photo you did not take, add a line to `CREDITS` in `js/data.js`. A "Photo credits" link then appears in the footer.

## Changing routes

In `js/data.js`, each stop in `ROUTES` is `["destination-key", nights]`. Change a number or the order and everything updates together: the colour bars, the nights table, the map, the totals and the day counts. A stop's position on the map comes from its `lat` and `lon` in `DESTINATIONS`.

## Publish on GitHub Pages

1. Create a repository and upload everything in this folder, including `CNAME` and `.nojekyll`.
2. Settings > Pages > Deploy from a branch > `main` / root.
3. Under Custom domain enter `wildlifeinkerala.com`, then tick Enforce HTTPS when it appears.
4. At your domain registrar add four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` record for `www` pointing to `<your-github-username>.github.io`. Check GitHub's Pages documentation if these ever change.

GitHub Pages cannot receive form submissions, so the enquiry form opens WhatsApp (or your email app) with the details filled in.
