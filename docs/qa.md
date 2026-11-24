# QA report

Date: 2026-11-24. Theme: `Brewforia Custom v0.1` (store theme name `brewforia/claude/charming-dirac-011pzn`, ID 189414670506, unpublished).

## What was run

| Check | Result |
|---|---|
| `shopify theme check` | **Pass.** 50 files, no offenses. Negative test confirmed the checker catches errors (a missing translation key fails). |
| `scripts/test-theme-js.mjs` (jsdom, mocked `fetch`) | **Pass, 14 of 14.** It found one real bug (size hint showed `__size__`), fixed in `assets/theme.js`. |
| Visual comparison | See `docs/visual-diff.md`. 1440px and 390px for most pages. |
| Real products in the preview | **Pass.** Home, collection, product, search all render the 8 migrated products. Search for "coffee" returns 5. |

JS tests cover: size selection, add to cart via `/cart/add.js` with badge update and reset, sold-out variant, API error message, cart quantity change via `/cart/change.js` with section re-render, empty or zero quantity ignored, remove, category filters (multi-select), sort low/high/relevant, name search with empty state, filter panel toggle, mobile menu open/close/Escape, search bar toggle, gallery thumbnails.

## Not done, and why

| Item | Why |
|---|---|
| Add to cart, quantity, remove, variant switch **on the live preview** | The connector's screenshot tool cannot click. A browser session against the storefront needs the storefront password and an allowed network host. Covered by the jsdom tests only. Please click through once in the preview. |
| Console errors, layout shift on load | Needs a real browser session. Not measured. |
| Lighthouse mobile performance | Not run, same reason. Known risk: `assets/hero.png` (1.1 MB) and `assets/contact.png` (1.0 MB) are the largest files. Upload them through the hero / contact image settings (Shopify resizes them) or compress them. |
| Theme editor add / reorder / edit | Not exercised (needs admin UI). All sections have schemas with defaults. Hero, product grid, newsletter, about intro, why choose us and contact have presets. |
| Keyboard navigation | Reviewed in code only: skip link, visible focus ring (`:focus-visible`), buttons for actions, labelled inputs, `aria-expanded` / `aria-pressed` / `aria-current`, `role="status"` live regions. Not tested with a real keyboard or screen reader. |
| Mobile menu and cart drawer at 375px | There is no cart drawer (the source has none). Mobile menu logic is tested in jsdom, not visually. |

## Colour contrast (source colours, kept as is)

WCAG AA needs 4.5:1 for normal text, 3:1 for large text.

| Pair | Ratio | Verdict |
|---|---|---|
| Body text `#6b5648` on page background | 5.89 | Pass |
| Price `#8a4f30` on page | 5.54 | Pass |
| Footer links `#4b5563` on page | 6.46 | Pass |
| White on primary `#2f1d14` | 16.07 | Pass |
| Nav text `#5f493d` on nav pill | 6.47 | Pass |
| Gray-500 `#6a7282` on page (section titles, descriptions, hints) | 4.13 | Fails AA for small text, passes for large titles |
| Copyright `#6b7280` on page | 4.13 | Fails AA |
| Eyebrow labels `#a8673f` / `#9a5a33` on cream | 4.2 / 4.1 | Fails AA (11px text) |
| Cart badge, white on `#d37b46` (10px) | 3.14 | Fails AA |
| Input placeholder `#957b6d` on white | 3.94 | Fails AA |
| Disabled add to cart | 3.2 | Disabled controls are exempt |

These values come from the source design. They were not changed because the plan says to keep the source look. To fix them, darken the colours in theme settings (Colors) and in `assets/base.css`.

## Known limits

- Money format, font rendering and ordering differences are listed in `docs/visual-diff.md`.
- Sync: Shopify's GitHub connection did not pull my pushes into the theme reliably. Theme edits were applied with the connector and Shopify wrote them back to the branch as `shopify[bot]` commits.
