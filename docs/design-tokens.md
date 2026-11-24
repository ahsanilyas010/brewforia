# Design tokens

All values come from `Frontend/frontend/src` unless marked **(Tailwind default)**, meaning the source uses a Tailwind CSS 4 utility class without overriding it. Tailwind 4 is declared in `package.json` (`tailwindcss ^4.2.1`). No `tailwind.config` exists, so defaults apply.

## Fonts

| Item | Value | Source |
|---|---|---|
| Font family (everything) | `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` | Tailwind default `font-sans`. Confirmed with computed style on the live site (body, headings, buttons). |
| Google Fonts requested | Montserrat, Oswald, Poppins (`index.html:9`), Prata (`style.css:1`) | **Never applied.** No `font-family` rule or `font-*` class uses them. `document.fonts` on the live site shows all four as `unloaded`. `Login.jsx` uses class `prata-regular`, but that class is not defined anywhere. |
| Decision | Use the system stack. No font files. No `font_picker` needed beyond a body/heading setting defaulting to the system stack. | |
| Base size / weight / line height | 16px / 400 / 24px | Tailwind default, verified live |

Type scale in use (Tailwind defaults): `text-xs` 12/16, `text-sm` 14/20, `text-base` 16/24, `text-lg` 18/28, `text-2xl` 24/32, `text-3xl` 30/36, `text-4xl` 36/40. Px sizes used directly: `text-[11px]`, `text-[12px]`, `text-[13px]`, `text-[15px]`, `text-[26px]`, `text-[0.65rem]`.
Weights: 400, 500 (`font-medium`), 600 (`font-semibold`), 700 (`font-bold`).
Letter spacing in use: nav `tracking-[0.22em]`, mobile nav `0.25em`, eyebrow labels `0.25em`/`0.28em`/`0.35em`, buttons `0.18em`/`0.2em`/`0.28em`, hero button inline `0.18em`, product price `0.08em`, product name `0.01em`, `tracking-tight` on footer headings.

## Colors

Page background: `rgba(236, 228, 228, 0.648)` on `body` (`style.css`). Over the white browser canvas this renders as about `#f1ecec`.
Default text: black (`rgb(0,0,0)`), inherited. Neutral greys used: `gray-300`, `gray-400`, `gray-500`, `gray-700`, `gray-200`, `neutral-900/800/300/500`, `#374151`, `#4b5563`, `#6b7280`.

Brand brown scale (hex counts are occurrences in JSX):

| Role | Hex | Where |
|---|---|---|
| Primary dark (buttons, active nav pill, cart button, badges) | `#2f1d14` (22), `#2e1d14` (8) | Shop Now, Subscribe, Checkout, active link, headings |
| Primary dark hover | `#493024` (4), `#472d21` | Button hover |
| Heading text | `#3f2b21` (7), `#2f1d14`, `#352117`, `#3a2418`, `#3b2417` | Titles, product names |
| Body text | `#6b5648` (8), `#6d584b` (5), `#735748` (4), `#6e5447`, `#684d3f`, `#5d4639`, `#5f493d` | Descriptions, nav text |
| Accent text (price, eyebrows) | `#8a4f30`, `#8f5231`, `#a8673f`, `#a0582b`, `#9a5a33`, `#8f5a39`, `#7d4b2f` | Price "From Rs.", labels, checkbox accent |
| Accent fills | `#d37b46` (cart badge), `#c76d3a`, `#9a4e23` | Cart count, About step circles 02 and 03 |
| Borders | `#ead0bf` (5), `#d8b8a4` (4), `#ead5c7`, `#edcdb7`, `#e2bfa8`, `#dfc2ae`, `#dec1ad`, `#efcdb8`, others | Icon buttons, inputs, cards, dividers |
| Soft surfaces | `#ead9cd` (image placeholder), `#fff7f1`, `#fff6ef`, `#fffaf5`, `#fff9f5`, `#fff8f2`, `#fff3e8`, `#f8e3d3`, `#f8e1d0`, `#f5e4d7` | Cards, panels, hover |
| Header gradient | `linear-gradient(135deg, #b89b7a, #7a5a3a)`, border `#b08a6a` | NavBar |
| Placeholder | `#957b6d`, `#9a8374` | Inputs |
| Success dot | `green-500` | Orders status |

The full 80-hex list is greppable with:
`grep -rhoE "#[0-9a-fA-F]{6}" Frontend/frontend/src --include=*.jsx`.
Panel gradients (About, Contact, filter box, mobile menu) are one-off combinations of the soft surfaces plus `rgba(255,249,244,.96~.98)`, `rgba(245,226,212,.92)`, `rgba(246,220,200,.98)`, `rgba(249,223,203,.9)`, `rgba(235,184,146,.82)`. Exact strings are in `About.jsx`, `Contact.jsx`, `Collection.jsx`, `NavBar.jsx`.

Dark mode: **none**. No `dark:` classes or `prefers-color-scheme`. Nothing to port.

## Spacing, layout, breakpoints

- Spacing unit: 0.25rem (Tailwind default).
- Page gutter: `px-4` (<640), `5vw` (sm), `7vw` (md), `9vw` (lg and up). No max width cap. Content is fluid inside the gutter.
- Breakpoints **(Tailwind default)**: sm 640px, md 768px, lg 1024px, xl 1280px.
- Product grids: Home `grid-cols-1 sm:2 lg:4 xl:5`, gap 1.25rem. Collection `2 / md:3 / lg:4`, gap 1rem, row gap 1.75rem. Related `2 / sm:3 / md:4 / lg:5`.
- Section rhythm: `my-20` (5rem) between home sections, footer `mt-32`, hero `mt-28`.

## Radii

`rounded-full` (pills, inputs, buttons, icon buttons), `rounded-xl` (logo), `rounded-2xl`, `1rem`, `1.2rem` (cart thumbs), `1.4rem` (product image, filter box), `1.5rem` (cart total), `1.75rem` (navbar), `2rem` (About/Contact panels), hero `clamp(1rem, 5vw, 2rem)`.

## Shadows

| Use | Value |
|---|---|
| Navbar | `0 20px 50px rgba(80,40,20,0.18)` |
| Account dropdown | `0 18px 40px rgba(94,50,25,0.16)` |
| Filter box | `0 14px 35px rgba(118,63,29,0.08)` |
| Cart total | `0 10px 30px rgba(118,63,29,0.06)` |
| Price chips | `0 6px 18px rgba(118,63,29,0.06)` |
| About image | `0 24px 60px rgba(64,34,16,0.16)` |
| About "why" panel | `0 28px 80px rgba(119,60,26,0.14)` |
| Contact panels | `0 30px 70px rgba(110,63,32,0.14)`, `0 30px 70px rgba(120,67,31,0.16)` |
| Contact image | `0 18px 45px rgba(76,43,22,0.18)` |
| Add to cart | `0 14px 30px rgba(17,17,17,0.18)`, hover `0 18px 36px rgba(17,17,17,0.24)` |

## Transitions and animation

- Buttons, links, cards: `transition` / `transition-all duration-300`.
- Product image zoom: `duration-500 ease-in-out`, `group-hover:scale-110`. Card lift `hover:-translate-y-1` over 300ms.
- Mobile menu: `transition-all`, width 0 to full.
- Hero: `fade-in` 1.2s `cubic-bezier(0.4,0,0.2,1)` (opacity 0 to 1, scale 1.04 to 1), overlay `hero-fade` 1.5s delay 0.2s (opacity .5 to .3), Shop Now uses Tailwind `animate-bounce`.

## Components

- **Primary button** (Shop Now, Subscribe, Checkout, Call Support): bg `#2f1d14`, white text, `rounded-full` (Subscribe `rounded-[1rem]`), uppercase, tracking 0.18 to 0.28em, font 600, hover `#493024`.
- **Add to cart**: bg `neutral-900`, white, `rounded-full`, px 2rem py 1rem, `text-sm` 600, tracking 0.28em, disabled bg `neutral-300` text `neutral-500`, hover lifts 2px.
- **Secondary button** (Email Team): border `#7a4d35`, bg white/75, text `#4b2f22`, `rounded-full`.
- **Icon button**: 44px circle, border `#ead0bf`, bg white/75. Cart variant bg `#2f1d14` with `#d37b46` badge.
- **Input (login, newsletter, search, sort)**: `rounded-full`, border `#d8b8a4` or `#dec1ad`, bg white/85, text `#3f2b21`, px 1.25rem py 0.875rem, no outline, placeholder `#957b6d`.
- **Input (place order form)**: `border border-gray-500 rounded py-1.5 px-3.5`.
- **Product card**: image h-14rem `rounded-[1.4rem]` on `#ead9cd`, name 15px 500 `#463126`, price 15px 600 tracking 0.08em `#8a4f30`.
- **Size button**: border `gray-300`, bg white, `rounded-none`, px 1rem py 0.5rem. Selected: border `yellow-400` bg `yellow-100`.
- **Panel/card**: border `#e2c8b7` or `#dfc2ae`, bg white/60 or soft gradients, radius 1.4 to 2rem.
