# Page map

| Source route | Shopify template | Sections / blocks needed |
|---|---|---|
| `/` | `templates/index.json` | `hero-banner`, `product-grid` (What's NEW, from all products, 10), `product-grid` (BEST SELLER, collection `best-sellers`, 5), `newsletter` |
| `/collection` | `templates/collection.json` (all products via `/collections/all`) | `collection-header` (Title), `collection-filters` (category checkboxes + sort), `product-grid` |
| (new) | `templates/list-collections.json` | `collection-list` (Shopify requires it, not in source, minimal) |
| `/product/:id` | `templates/product.json` | `product-gallery`, `product-info` (title, price, description, size picker, add to cart, trust list), `product-tabs` (Description), `related-products` |
| `/cart` | `templates/cart.json` | `cart-items`, `cart-summary` (links to Shopify checkout). No drawer: the source has none. Header cart icon links to `/cart`. |
| `/placeorder` | Shopify checkout | Not a theme template. Address form and COD are native. |
| `/orders`, `/login` | New customer accounts | Header account icon links to `routes.account_login_url`. No theme templates (new accounts). |
| `/about` | `templates/page.about.json` | `about-intro` (image, eyebrow, copy, mission card), `why-choose-us` (3 numbered cards) |
| `/contact` | `templates/page.contact.json` | `contact-panels` (4 info tiles + chips), `contact-aside` (image, copy, two buttons). Adds a Shopify contact form only if Ahsan wants it (open question). |
| Search (SearchBar on `/collection`) | `templates/search.json` | `search-results`, header search input |
| not in source | `templates/page.json`, `404.json`, `password.json`, `gift_card.liquid` | Minimal, styled with the same tokens |
| Footer "Delivery", "Privacy policy" (text only) | Shopify policy pages | Linked once Ahsan creates them (open question) |
| Layout | `layout/theme.liquid`, `sections/header-group.json`, `sections/footer-group.json` | `header` (NavBar), `footer` (Footer), `announcement` not in source so not built |

Every source route is covered above (9 of 9).
