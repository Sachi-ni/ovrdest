# OVRZD website: developer setup

What this is: a fast static website (`site/`) that reads its products (name, price, sizes, stock, photo) from **Sanity**, a free online admin. The client edits products in Sanity. No backend to build or maintain.

```
site/            the website (upload this folder to hosting)
sanity-schema/   the product form for the Sanity admin (Studio)
scripts/         one-time script that loads the 20 starter designs into Sanity
CLIENT-GUIDE.md  plain-language guide to give the client
```

The site works **right now** with no setup: if Sanity cannot be reached, it shows `site/products.json`. The Home page (`index.html`) contains all sections, and `collection.html`, `delivery.html`, `about.html` and `contact.html` are also available as separate pages. Shared styling is in `site/styles.css`, settings/common code in `site/site.js`, and product/search/order code in `site/shop.js` (loaded on Home and Collection). Open any page through a local server to preview it. Opening the file by double-click will not load products, because browsers block local file requests. Use a local server (for example `python -m http.server 8000` inside `site/`) or just upload to hosting.

## Step 1. Create the accounts in the CLIENT'S name
Use the client's email (e.g. ovrzdest@gmail.com) for: Sanity, hosting (Cloudflare Pages or Netlify) and the domain. Add yourself as a collaborator if you need access. This makes handover clean.

## Step 2. Create the Sanity project and admin (Studio)
1. Install Node.js (LTS) on your computer.
2. In a terminal, run `npm create sanity@latest`. Log in with the client's Sanity account.
3. Choose: create a new project, dataset **production**, **public** dataset visibility, and a **clean project with no predefined schemas**. JavaScript or TypeScript is fine. If you pick TypeScript, rename the two files in `sanity-schema/schemaTypes` to `.ts`.
4. In the new Studio folder, replace its `schemaTypes` folder with `sanity-schema/schemaTypes` from this project. Check that `sanity.config` imports `schemaTypes` from `./schemaTypes`, which is the default.
5. Run `npm run dev` and open the Studio on your computer. You should see "T-shirt" with the form fields.
6. Run `npx sanity deploy` to put the Studio online at a web address like `ovrzd.sanity.studio`. That address is what the client logs in to.
7. Write down your **Project ID**. It is shown in the Studio folder's `sanity.config` and at sanity.io/manage.

## Step 3. Load the 20 starter designs (once)
1. Open `site/products.json` and fill in `"price"` for each design (numbers only, e.g. `3500`). Leave `null` to show "Message us for price". You can also add prices later in the Studio.
2. At sanity.io/manage choose the project, then API, then Tokens, then Add token, with **Editor** permission. Copy it.
3. In the `scripts` folder:
   ```
   npm install
   SANITY_PROJECT_ID=yourProjectId SANITY_TOKEN=yourToken node import-products.mjs
   ```
   On Windows PowerShell use: `$env:SANITY_PROJECT_ID="..."; $env:SANITY_TOKEN="..."; node import-products.mjs`
   Add `DRY_RUN=1` first if you only want to check the files.
4. Open the Studio. All 20 designs should be there with photos. The import creates **published** documents.
5. Delete the token afterwards at sanity.io/manage so it cannot be misused.

## Step 4. Connect the website to Sanity
1. Open `site/site.js`, find the SETTINGS block near the top, and paste the project ID:
   `const SANITY_PROJECT_ID = "yourProjectId";`
2. Check the WhatsApp numbers and email in the same block.
3. If the browser blocks the data request after you go live, go to sanity.io/manage, then API, then CORS origins, and add your website address (e.g. `https://ovrzd.lk`). No credentials needed.

## Step 5. Edit the delivery, payment and returns text
In `site/index.html` and `site/delivery.html`, find the comment `DELIVERY, PAYMENT, RETURNS`. Keep both copies identical when editing. The text is written without numbers on purpose, because I do not know the client's real fees and times. Replace the sentences with the confirmed details, for example the courier name, delivery days, delivery fee, and the exchange period.

## Step 6. Put the site online
Upload the **`site` folder only** (not `sanity-schema` or `scripts`).
- **Cloudflare Pages**: create a project and choose Direct Upload, then upload the `site` folder.
- **Netlify**: drag the `site` folder onto the deploy area.
Then connect the domain in the hosting dashboard and confirm HTTPS works. Whenever you edit the site files, upload the folder again.

## Step 7. Test like the client
- On a phone, open the Studio, add a test product with a photo, tap **Publish**, then reload the site. It should appear within a minute or so.
- Change the price, then mark it out of stock and publish. The card should show "Sold out" and the buttons should be disabled.
- Tap WhatsApp and Email on a real phone and check the message, including size and price.
- Delete the test product.

## Step 8. Hand over
- Give the client the Studio address and login, and the hosting and domain logins.
- Send them `CLIENT-GUIDE.md` (or turn it into a short screen recording).
- Agree who pays for the domain and who to call if something breaks.

## How it behaves
- If Sanity cannot be reached, the site falls back to `site/products.json`. That file is only a snapshot of the starter designs, so it will not include products the client added later.
- Only **published** products appear. Drafts in the Studio do not show on the site.
- Photos are served by Sanity's image service and resized to 900 px wide automatically, so the client can upload normal phone photos.
- Please check Sanity's current free plan limits (storage, bandwidth, API requests) at sanity.io/pricing before promising the client it is free. A shop this size should sit well within typical free limits, but confirm.

## Not tested
I could not connect to Sanity from my environment, so the Sanity steps (Studio setup, import, live data) are untested against a real project. The website code was tested in a browser against a simulated Sanity response and against the `products.json` fallback.
