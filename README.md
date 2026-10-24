# Wildlife in Kerala website

Plain HTML, CSS and JavaScript. No build step. Works on GitHub Pages.

```
index.html          page structure and text
css/style.css       design
js/main.js          settings, destinations and routes (edit here)
images/             your photos
CNAME               custom domain (wildlifeinkerala.com)
```

## 1. Set your contact details (required)

Open `js/main.js` and change the `SETTINGS` block at the top:

- `whatsapp`: digits only, country code first, e.g. `919876543210`
- `phoneDisplay`: how the number is shown
- `email`: your business email

Until you set a real WhatsApp number, the form falls back to an email link and the phone line is hidden.

## 2. Add your photos

Every photo is optional. If a file is missing, that photo simply does not appear and the layout adjusts. Use JPG files with these exact names:

| File | Where it appears | Suggested size |
|---|---|---|
| `hero.jpg` | Full background of the first screen (a dark overlay keeps the text readable; without it you see a forest-green background) | 2000x1100 |
| `about.jpg` | About section (portrait) | 900x1125 |
| `route-1.jpg` to `route-4.jpg` | Top right of each route card | 1000x750 |
| `species-tiger.jpg`, `species-elephant.jpg`, `species-leopard.jpg`, `species-gaur.jpg`, `species-tahr.jpg`, `species-macaque.jpg`, `species-hornbill.jpg`, `species-squirrel.jpg` | "Who you might meet" cards | 800x600 |
| `gallery-1.jpg` to `gallery-6.jpg` | Gallery (section appears only if at least one exists) | 1200 wide, any height |
| `kabini.jpg`, `thattekkad.jpg`, `thekkady.jpg`, `chinnar.jpg`, `munnar.jpg`, `valparai.jpg`, `coonoor.jpg`, `wayanad.jpg`, `houseboat.jpg`, `mararikulam.jpg`, `neeleshwar.jpg`, `cochin.jpg`, `mysore.jpg`, `bangalore.jpg` | Small square thumbnail in the Places list | 400x400 |

Keep each file under 400 KB (squoosh.app compresses well) and use only photos you own or have permission to use.

## 3. Edit routes and places

All in `js/main.js`:

- `ROUTES`: each stop is `["destination-key", nights]`. Change the numbers or the order and the strips, night counts and plans update.
- `SPECIES`: the animal cards. Remove any you do not want to promise.
- `DESTINATIONS`: the description and the "Look for" line for each place. Please check these match what you actually offer; remove "look" lines you cannot stand behind.

The strips are the main design idea: each colour block is one stop, and its length is the number of nights there.

## 4. Things I left out on purpose

- Guest reviews: add real ones to `index.html` once you have them.
- Prices: add them to the route cards when you are ready.

## 5. Publish on GitHub Pages

1. Create a repository and upload everything in this folder, including `CNAME` and `.nojekyll`.
2. Settings > Pages > Deploy from a branch > `main` / root.
3. Under Custom domain enter `wildlifeinkerala.com`, then tick Enforce HTTPS when it appears.
4. At your domain registrar add four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` record for `www` pointing to `<your-github-username>.github.io`. Check GitHub's Pages documentation if these ever change.
