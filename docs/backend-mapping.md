# Backend feature mapping

Source: `Backend/routes/*.js`, `controllers/*.js`, `middleware/*.js`. The Express API is **not** ported (plan section 4). Each route is listed with what replaces it.

Legend: **Native** = Shopify covers it, **App/Flow** = needs an app or Shopify Flow (nothing installed by this project), **Dropped** = not carried over.

## User routes (`/api/user`)

| Route | Source behaviour | Verdict | Replacement |
|---|---|---|---|
| `POST /register` | Create account, return JWT | Native | Shopify customer accounts (new customer accounts, passwordless email code). Header account icon links to it. |
| `POST /login` | Email and password login, return JWT | Native | Same. Existing MongoDB users are not migrated. |
| `POST /admin` | Admin login for the Admin dashboard | Dropped | Shopify admin and staff accounts. |

## Product routes (`/api/product`)

| Route | Source behaviour | Verdict | Replacement |
|---|---|---|---|
| `GET /list` | List all products | Native | Storefront objects (`collection.products`, `collections.all`). Catalog migrated in Phase 5. |
| `POST /single` | Get one product | Native | `product` object on `/products/<handle>`. |
| `POST /add` | Admin adds a product with up to 4 images (Cloudinary) | Native | Shopify admin, Products. |
| `POST /remove` | Admin deletes a product | Native | Shopify admin. |

## Cart routes (`/api/cart`)

| Route | Source behaviour | Verdict | Replacement |
|---|---|---|---|
| `POST /get` | Load saved cart for logged in user | Native | Shopify cart is session based (`/cart.js`) and carries over to checkout. Cross-device saved carts for logged-in customers are not provided by a plain theme. |
| `POST /add` | Add item and size | Native | `/cart/add.js` (used by `product-form`). |
| `POST /update` | Change quantity | Native | `/cart/change.js` (used by `cart-items`). |

## Order routes (`/api/order`)

| Route | Source behaviour | Verdict | Replacement |
|---|---|---|---|
| `POST /place` | Creates a Cash on Delivery order (`payment: false`), clears the cart | Native | Shopify checkout with a **manual payment method** "Cash on Delivery". Ahsan must enable it in Settings, Payments (not touched by this project). |
| `POST /usersorders` | Logged-in user's order history | Native | Customer account order history. |
| `POST /list` | Admin lists all orders | Native | Shopify admin, Orders. |
| `POST /status` | Admin updates order status | Native | Fulfilment status in Shopify admin. |

## Middleware and infrastructure

| Item | Verdict | Replacement |
|---|---|---|
| `auth.js` (JWT) and `adminAuth.js` | Dropped | Shopify accounts and staff permissions. |
| `multer.js` and `config/cloudinary.js` | Dropped | Shopify Files and product media. |
| `config/mongodb.js` | Dropped | Shopify data. |
| AWS SQS + Lambda order notifications | Native / Flow | Shopify order notification emails (Settings, Notifications). Shopify Flow if custom routing (for example WhatsApp or Slack alerts) is wanted. Nothing installed. |
| EasyPaisa option | Dropped in source too | `PlaceOrder.jsx` includes an EasyPaisa logo, but `orderController.js` implements COD only. A Pakistani payment gateway needs an app or a Shopify-supported provider. Flag for Ahsan. |
| Flat Rs. 100 delivery fee | Native | Shopify shipping rate. Set in Settings, Shipping. Not touched by this project. |

## Things that would need a custom app

None required. Optional: cross-device saved carts, and a COD-specific checkout message, would need an app or Shopify Functions. Not built.
