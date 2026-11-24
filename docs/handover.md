# Handover

Theme: **Brewforia Custom v0.1** (in the store as `brewforia/claude/charming-dirac-011pzn`, ID `189414670506`). It is **unpublished**. Nothing was published and the live theme (Horizon) was not changed.

Preview: `https://dprc58-up.myshopify.com/?preview_theme_id=189414670506` (storefront password applies while the store is on the trial plan).

## What was built

- Online Store 2.0 theme, vanilla JS only, no build step. Fonts, colours, spacing, radii, shadows and copy come from the Brewphoria source (`docs/design-tokens.md`).
- Pages: home, collection (category filters, sort, name search), product (gallery, size picker, add to cart), cart (quantity, remove), About, Contact, search, 404, password, gift card.
- Cart and variant actions use the Cart AJAX API in `assets/theme.js` (web components).
- Theme settings: brand colours, header gradient, logo, brand name (Brewphoria), Instagram URL.
- Newsletter box posts to Shopify's customer form.

## What was added to the store (with your approval)

- 8 products from the live Brewphoria API, set to **Active** and published to the Online Store, with 21 images, one Size variant each, and the metafield `custom.source_id`. Matched against `scripts/catalog.json`.
- 7 collections (Coffee, Hot Chocolate, Matcha & Friends, Chocolate, Munchables, Spreads, Best Sellers), published to the Online Store.
- Menus `brewphoria-main` and `brewphoria-footer`. The default `main-menu` and `footer` are untouched.
- Page "About" (template `about`). The "Contact" page already existed with the `contact` template and was used as is.
- Metafield definition `custom.source_id`.

Because the products and collections are published, they are also visible on the live Horizon theme. With the trial plan the storefront is password protected.

## What was dropped (replaced by Shopify)

Login and sign-up, order history, order placement, cart server sync, the Admin dashboard, the Express API and MongoDB, SQS and Lambda notifications. Details in `docs/backend-mapping.md`. Existing user accounts were not migrated.

## What you need to do by hand

| Area | Action |
|---|---|
| Plan | Upgrade from the trial plan before selling. |
| Payments | Enable a manual payment method named "Cash on Delivery" (the source's only working option). Decide on EasyPaisa or another local gateway; the source UI showed it but never implemented it. |
| Shipping | Create a shipping rate. The source charged a flat Rs. 100. The cart shows "Calculated at checkout". |
| Money format | Settings, General, Currency formatting, if you want `Rs.1250` style. The theme uses Shopify's format. |
| Policies | Create Delivery and Privacy policy pages. The footer shows both as plain text for now (same as the source). |
| Customer accounts | Turn on customer accounts so the header account menu appears. |
| Contact details | The Contact page uses the source's a dummy number `+92 300 0000000`, `utanveer485@gmail.com`, Islamabad. The footer uses the same dummy number and the source placeholder `hello@brewphoria.com`. Replace in the theme editor (open question 1). |
| Instagram | Paste the real profile URL in theme settings, Social links. The footer link is hidden until then. |
| Inventory | Products have no stock or SKU data in the source. Inventory tracking is off, so they can always be bought. Set quantities if you want stock control. |
| Home page collection | Shopify added the first product to the store's own "Home page" collection. Remove it there if unwanted. |
| Images | Upload the hero and contact images through the theme editor (1 MB each as shipped in `assets/`), so Shopify can resize them. |
| Colour contrast | Several source colours fail WCAG AA (`docs/qa.md`). Darken them in theme settings if accessibility matters. |
| Click-through | Add to cart, change quantity, remove, filters and the mobile menu were tested in jsdom only. Click through them once on the preview. |
| Publishing | When you are happy, publish the theme in Online Store, Themes. I will not do this. |

## Working on the theme

See `README.md`: structure, `theme check`, tests, upload, and connecting the repo through Shopify's GitHub integration. Remember that theme editor changes are committed back to the branch by `shopify[bot]`, so pull before you push.

## Open questions

See `docs/open-questions.md`.
