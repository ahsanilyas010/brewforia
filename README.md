# Brewforia Custom (Shopify theme)

A custom Online Store 2.0 theme that rebuilds the Brewphoria storefront
(source: `UsmmmanT/Brewphoria`, reference only) on Shopify. Shopify replaces the
original Node API, so the theme only contains Liquid, CSS and vanilla JavaScript.

Status: **v0.1.0, Phase 2 scaffold.** Design tokens, real sections and catalog migration land in later phases.
See `docs/` for the audit, design tokens, product model and page map.

## Structure

```
assets/      CSS, JS, images
blocks/      theme blocks
config/      settings_schema.json, settings_data.json
layout/      theme.liquid, password.liquid
locales/     en.default.json, en.default.schema.json
sections/    sections and section groups (header-group, footer-group)
snippets/    reusable fragments (meta-tags, product-card, pagination)
templates/   JSON templates (gift_card.liquid is the only Liquid template, Shopify requires it)
docs/        audit, design tokens, page map, QA, handover (not uploaded)
scripts/     catalog data and migration helpers (not uploaded)
```

`.shopifyignore` keeps `docs/` and `scripts/` out of Shopify CLI operations.

## Rules for editing

- All user facing text goes through `locales/en.default.json`. Editor labels go through `locales/en.default.schema.json`.
- Vanilla JS only. No build step, no jQuery, no React.
- Every section has a schema and, if merchants can add it, a preset.

## Check the theme

```bash
npx @shopify/cli@latest theme check --path .
```

Must report no errors before every commit.

## Upload (never to the live theme)

This theme must only be uploaded as a new **unpublished** theme. Publishing is a manual step done by the store owner.

Using the Shopify CLI (needs a login to the store):

```bash
shopify theme push --unpublished --theme "Brewforia Custom v0.1" --store <store>.myshopify.com
```

Connecting the repo through Shopify's GitHub integration is covered in the handover notes (Phase 9).
