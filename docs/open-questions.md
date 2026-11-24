# Open questions and decisions

## Decided by Ahsan (chat, Phase 0)

1. Brand spelling on the storefront: **Brewphoria**. The Shopify store itself is named "Brewforia".
2. Existing store products: **keep all**. Only add. Store currently has only the Horizon theme. Product count is checked in Phase 5.
3. Currency: **PKR**, matches the source (`Rs.`).
4. Reuse approval from Usman: approved by phone (verbal, not written). Recorded here.
5. Dark mode: port if the source has it. **Source has none**, so nothing to port.

## Open

| # | Question | Default used |
|---|---|---|
| 1 | Contact page shows `+92 330 865 3077`, `utanveer485@gmail.com`, "Karachi, Pakistan", "Mon - Sat, 10AM to 8PM". Footer shows placeholders `+1-000-000-0000` and `hello@brewphoria.com`. Which details are right for the Shopify store? | Copy both exactly as in the source and flag. Store email on file is a different address. |
| 2 | Footer "Instagram" link goes to `https://www.instagram.com/` (generic). Real profile URL? | Social link setting left empty, footer link hidden until set. |
| 3 | Footer "Delivery" and "Privacy policy" are plain text. Create policy pages in Shopify and link them? | Shown as text like the source. |
| 4 | Product page has filler tab text ("kopi-luwak, siphon, crema, and barista", "Coffee please") and a "Reviews" tab that does nothing. | Keep the Description tab with the real product description. Drop the filler and the dead Reviews tab. Tell me if you want them kept. |
| 5 | Newsletter box only shows a browser alert in the source. | Wire to Shopify's customer form (email marketing subscribe). |
| 6 | Hero text ("premium coffee and chocolates imported straight from the heart of Indonesia") and logo text are baked into `hero.png` / `logo.jpg`. | Reuse images as is. |
| 7 | Image licences. Product photos are hosted on Cloudinary (brand photos, not stock). `hero.png`, `logo.jpg`, `aboutus.jpeg`, `contact_img.png` have no licence info in the repo. | Assumed covered by Usman's approval. |
| 8 | No alt text in the source data. | Alt = product title. |
| 9 | Delivery fee Rs. 100 flat and Cash on Delivery are source behaviours. Shopify shipping and payments are off limits for me. | Listed in handover for Ahsan to configure. |
| 10 | Store is on a **trial** plan: checkout and selling need an upgrade. Preview links need the storefront password. | Noted for handover. |

## Fonts and licences

No web fonts are applied in the source (system stack). Google Fonts links in the source (Montserrat, Oswald, Poppins, Prata) are unused, so nothing is bundled and no font licence applies.

## Not portable

Login, sign-up, order history, order placing, cart server sync, admin dashboard, SQS/Lambda notifications, MongoDB accounts. See `docs/backend-mapping.md` (Phase 6).

## Reference screenshot caveats

`cart`, `placeorder` and `orders` captures show empty or logged-out states (no session, empty cart). Matching them to Shopify's cart page is done against the empty state and a cart with items built by hand in Phase 4.

## Added during Phase 4 to 6

| # | Question | Default used |
|---|---|---|
| 11 | Money format. The source prints "Rs.800" and "Rs. 1250". The theme uses Shopify's PKR money format, which may print "Rs. 800" or with commas. Changing the format is a store setting I do not touch. | `money_without_trailing_zeros`. Difference logged in `docs/visual-diff.md` after the preview exists. |
| 12 | Sort option typo "Relavent" in the source. | Fixed to "Relevant". |
| 13 | Source shows the search bar only on `/collection`. | Same: the header search icon opens the filter bar on collection pages and links to `/search` elsewhere. |
| 14 | Source shipping fee is a flat Rs. 100 shown in the cart total. Shopify calculates shipping at checkout. | Cart total shows "Calculated at checkout". Ahsan sets the rate in Shipping settings. |
| 15 | Default menus `main-menu` and `footer` exist. Editing them overwrites store data. | Create new menus instead (needs your OK before any write). |
| 16 | Theme upload route. `themeCreate` from a GitHub zip fails ("Src is empty", GitHub nests files in a folder). | Ask Ahsan to connect the repo through Shopify's GitHub integration (steps in README). |
| 17 | EasyPaisa appears in the source UI but is not implemented in the backend. | Not ported. Needs a payment provider decision. |
