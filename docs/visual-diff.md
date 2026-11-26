# Visual diff: theme preview vs live Brewphoria site

Reference: `docs/reference/` (live site, Playwright). Preview: unpublished theme `brewforia/claude/charming-dirac-011pzn` (ID 189414670506), captured with the Shopify connector's screenshot tool, which supports **1440px and 390px only** (not 375 or 768). 390px is compared against the 375px references.

## Coverage

| Page | 1440 | 390 | Result |
|---|---|---|---|
| Home | checked | checked | Matches: header, hero, titles, product grid, newsletter, footer. |
| Collection (all products) | checked | checked | Matches: filter box, sort select, 4 / 2 column grid. |
| Product | checked | checked | Matches: gallery, price, size picker, add to cart, trust list, tab box, related products. |
| Cart | not checked | empty state checked | A cart with items cannot be created from here (needs a browser session). Layout follows `Cart.jsx` CSS but is **not visually verified**. |
| About | checked | checked | Matches. |
| Contact | checked | checked | Matches. Differs only in the footer (see below). |
| Search | checked | checked | No source equivalent (source filters on the collection page only). Styled with the same tokens. |
| 404 | not checked | checked | No source equivalent. |
| Password page, gift card, style guide page | not checked | not checked | Not rendered. The style guide needs a page created with the `styleguide` template. |
| 768px (any page) | not checked | | The screenshot tool has no 768px option. CSS breakpoints follow the source (640 / 768 / 1024 / 1280). |
| Mobile menu open, account dropdown, hover states | not checked | | Behaviour covered by `scripts/test-theme-js.mjs` only. |

## Known differences

| Where | Difference | Reason |
|---|---|---|
| All pages | Typeface looks different between the two captures (reference renders Inter, the preview renders Ubuntu). | The source sets no font. Both use the system stack `ui-sans-serif, system-ui, sans-serif`, so the glyphs come from whichever machine renders them. Same CSS, different capture machines. Not a theme difference. |
| Prices | Preview shows `Rs.1,250`, source `Rs.1250` (cards) and `Rs. 1250` (product page). | The theme uses Shopify's PKR money format. Changing the format is a store setting (Settings, General, Currency formatting) that this project does not touch. |
| Home "What's NEW" order | Alphabetical (Caffino first). Source shows API order (Krakakoa Creamy first). | `collections.all` has no manual order. A manual "What's New" collection would fix it. Not created. |
| Home "BEST SELLER" | Same product, same layout. | None. |
| Footer, GET IN TOUCH | No "Instagram" link. | The source links to the generic `https://www.instagram.com/`. Hidden until a real profile URL is set in theme settings (open question 2). |
| Footer text wrap | Description wraps at slightly different words. | Font difference above. |
| Product page tab | One "Description" tab with the real description. Source had a dead "Reviews" tab and filler text. | Decision in `docs/open-questions.md` (4). |
| Cart total | "Shipping Fee: Calculated at checkout" instead of Rs. 100.00. | Shipping is configured in Shopify, not the theme. |
| Collection sort | "Sort by: Relevant". Source says "Relavent". | Typo fix. |
| Search bar | Opens from the header search icon on collection pages, links to `/search` elsewhere. | Source shows the bar only on `/collection`. |
| Newsletter | Submits to Shopify's customer form. Source showed a browser alert. | Real signup. |
| Header menu | HOME / PRODUCTS / ABOUT / CONTACT come from the `brewphoria-main` menu. | Same labels as the source. |
