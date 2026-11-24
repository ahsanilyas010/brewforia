# Audit: Brewphoria storefront

Source: `UsmmmanT/Brewphoria`, `Frontend/frontend/` (React 18 + Vite 7 + Tailwind CSS 4 + react-router-dom 7).
Reference captures: `docs/reference/<page>-<width>.png` (live site, widths 375, 768, 1440).

## 1. Routes and pages (`src/App.jsx`)

Every route renders `NavBar` + `SearchBar` above and `Footer` below, inside a shared page gutter.
Gutter: `px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]`.

| Route | Page file | Components used | Data source |
|---|---|---|---|
| `/` | `Pages/Home.jsx` | `Hero`, `LatestCollection`, `BestSeller`, `NewsletterBox` | `GET /api/product/list` |
| `/collection` | `Pages/Collection.jsx` | `Title`, `ProductItem`, filter sidebar, sort select, `SearchBar` | products |
| `/product/:productId` | `Pages/Product.jsx` | image gallery, size selector, add to cart, description/reviews tabs, `RelatedProducts` | products |
| `/cart` | `Pages/Cart.jsx` | `Title`, `CartTotal` | cart (localStorage + server) |
| `/placeorder` | `Pages/PlaceOrder.jsx` | `Title`, `CartTotal`, address form, payment method | `POST /api/order/place` |
| `/orders` | `Pages/Orders.jsx` | `Title` | `POST /api/order/usersorders` |
| `/login` | `Pages/Login.jsx` | login / sign-up form | `POST /api/user/login`, `/register` |
| `/about` | `Pages/About.jsx` | `Title` | static copy |
| `/contact` | `Pages/Contact.jsx` | `Title` | static copy |

No blog, no FAQ, no 404 route, no password page. `vercel.json` rewrites everything to `/` (SPA).

## 2. Reusable components

| Component | What it does |
|---|---|
| `NavBar` | Brown gradient pill header: logo, 4 links (HOME, PRODUCTS, ABOUT, CONTACT), search button, account icon with hover menu (Profile, Orders, Logout), cart icon with count badge, hamburger (below `sm`). Full-screen mobile menu slides in from the right. |
| `SearchBar` | Shown only on `/collection` once the search icon is clicked. Text input filters products by name. Close icon hides it. |
| `Hero` | Full-width rounded banner (`hero.png` background, 30% black overlay), "Shop Now" pill button linking to `/collection`. Fade-in and bounce animations. |
| `Title` | Two-tone heading (`text1` grey, `text2` darker) followed by a short rule line. |
| `ProductItem` | Card: image (h-56, rounded 1.4rem, zoom on hover), name, "From Rs.<lowest price>". |
| `LatestCollection` | "What's NEW": first 10 products, grid 1/2/4/5 columns. |
| `BestSeller` | "BEST SELLER": products with `bestSeller === true`, max 5. |
| `RelatedProducts` | "RELATED PRODUCTS": same category, excluding current, max 5. |
| `CartTotal` | Sub total, shipping fee (Rs. 100 flat), total. |
| `NewsletterBox` | Email field + SUBSCRIBE. Source only shows `alert()`. Nothing is stored. |
| `Footer` | Logo + blurb, COMPANY links, GET IN TOUCH links, copyright line. |

## 3. Interactions

- **Cart**: local state persisted to `localStorage.cartItems`, keyed by product id then size. Synced to the server when logged in. Add requires a size. Quantity is a number input (min 1). Remove is a bin icon. Flat Rs. 100 delivery fee.
- **Variant picker**: size buttons per product. The price shown changes per size (`sizePrices`). Add to cart is disabled until a size is picked. Caption reads "Select a size to continue" / "Ready to add size X".
- **Collection filters**: six category checkboxes (multi select), sort select (Relavent / Low to High / High to Low), name search.
- **Gallery**: thumbnail strip, click swaps the main image.
- **Mobile menu**: full-screen overlay, active link is a dark pill.
- **Account menu**: hover dropdown on desktop.
- **Animations**: hero fade-in (1.2s) and overlay fade, "Shop Now" bounce, product image zoom on hover (500ms), card lift on hover (`-translate-y-1`).
- **Toasts**: react-toastify for login, logout and "select a size" errors.
- **Scroll**: scrollbars hidden globally; product page scrolls to top on id change.

## 4. Third party libraries

| Library | Use | Shopify replacement |
|---|---|---|
| react, react-dom | UI | Liquid + vanilla JS web components |
| react-router-dom | Routing | Shopify routes and templates |
| axios | API calls | Cart AJAX API (`fetch`) |
| react-toastify | Toasts | Small inline notice component |
| tailwindcss 4 + `@tailwindcss/vite` | All styling | CSS custom properties and hand written CSS in `assets/` |
| Google Fonts link (Montserrat, Oswald, Poppins, Prata) | Declared but **never applied** (see design tokens) | Not needed |

## 5. Not ported (replaced by Shopify)

Login, sign-up, orders list, place order (address form, COD payment option), the cart server sync. See `docs/backend-mapping.md` (Phase 6).

## 6. Source oddities worth knowing

- The Product page "Description / Reviews" tab block shows hard coded filler text ("kopi-luwak, siphon, crema, and barista", "Coffee please"). Reviews is not a real tab.
- Footer phone `+1-000-000-0000` and email `hello@brewphoria.com` are placeholders. Contact page uses different, real looking details.
- "Delivery" and "Privacy policy" in the footer are plain text, not links.
- `assets.js` holds 52 demo products from a clothing tutorial. They are not used by the live site, which reads from the API.
- Typo "Relavent" in the sort dropdown.
