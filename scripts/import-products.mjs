// Uploads the 20 starter designs (photos + details) into Sanity, one time.
// Run this ONCE. Running it again will not create copies, but it WILL overwrite any
// prices, stock changes or edits the client has made in the Studio since.
//
// Usage (from this folder):
//   npm install
//   SANITY_PROJECT_ID=xxxx SANITY_TOKEN=yyyy node import-products.mjs
// Optional: SANITY_DATASET=production   DRY_RUN=1 (checks files only, uploads nothing)
//
// Tip: before running, open ../site/products.json and fill in "price" for each design.

import {readFileSync, existsSync, createReadStream} from 'node:fs'
import {resolve, dirname, basename} from 'node:path'
import {fileURLToPath} from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const siteDir = resolve(here, '../site')
const products = JSON.parse(readFileSync(resolve(siteDir, 'products.json'), 'utf8'))

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_TOKEN
const dry = !!process.env.DRY_RUN

const missing = products.filter((p) => !existsSync(resolve(siteDir, p.image)))
if (missing.length) {
  console.error('Missing image files:', missing.map((p) => p.image))
  process.exit(1)
}
console.log(`Found ${products.length} designs and all photos.`)
if (dry) {
  console.log('DRY_RUN: nothing uploaded.')
  process.exit(0)
}
if (!projectId || !token) {
  console.error('Set SANITY_PROJECT_ID and SANITY_TOKEN (an Editor token). See README.')
  process.exit(1)
}

const {createClient} = await import('@sanity/client')
const client = createClient({projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false})

for (const p of products) {
  const file = resolve(siteDir, p.image)
  const asset = await client.assets.upload('image', createReadStream(file), {filename: basename(file)})
  const doc = {
    _id: `product-${p.id}`,
    _type: 'product',
    name: p.name,
    colour: p.colour,
    sizes: p.sizes,
    inStock: p.inStock !== false,
    order: p.order,
    photo: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
  }
  if (typeof p.price === 'number') doc.price = p.price
  await client.createOrReplace(doc)
  console.log('Imported:', p.name, `(${p.colour})`)
}
console.log('Done. Open your Studio to review and add prices.')
