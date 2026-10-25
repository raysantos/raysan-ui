# Changelog

## v0.1.1 — 2026-10-25

- Scroll progress bar (`.scroll-progress` + `js/scroll-progress.js`), from raysandesigns.com: hero gradient grows along the header as you scroll.
- Top app bar gets a bottom outline and tints to `surface-container` once the page scrolls.
- `.hero-gradient`: the animated hero gradient (400% size, 15s drift), matching the site.
- Guidelines page replaces the docs page.
- Brand icons: `icons/brand/` set from raysandesigns.com, `_template.svg`, `.brand-icon` sizes and the `.brand-icon-ms` quick tile. Iconography guidelines split into brand and UI tiers.

## v0.1.0 — 2026-10-25

First release, extracted from raysandesigns.com.

- Tokens: M3 color roles for light and dark, error roles, brand accents (`--rd-*`), Sofia Sans / Google Sans Text type scale, shape, motion, layout.
- Base: reset, type role classes, Material Symbols, focus ring, state layer, brand bar, theme fade.
- Components: buttons (filled, tonal, outlined, text, large), icon button, chips, cards, text fields, top app bar.
- `<theme-toggle>` web component, compatible with the site's existing `theme` localStorage key.
- Starter template, brand theme example, docs page.
