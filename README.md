# raysan-ui

The Raysan Designs design system. Every new project starts from it, so all my sites and apps share the same color roles, type, shape, components and sun/moon theme toggle.

**Docs and live preview:** https://raysantos.github.io/raysan-ui/

## What's in it

| File | What it does |
| --- | --- |
| `css/tokens.css` | Design tokens: Material Design 3 color roles (light and dark), type scale, shape, motion, layout. Values come from raysandesigns.com. |
| `css/base.css` | Reset, page defaults, type role classes, Material Symbols (`.ms`), focus ring, state layer (`.sl`), brand bar, theme fade. |
| `css/components.css` | Buttons, icon button, chips, cards, text fields, top app bar, theme toggle styles. |
| `js/scroll-progress.js` | Reading-progress bar: the hero gradient grows along the bottom of the top app bar as the page scrolls. Also tints the app bar once you scroll. |
| `js/theme-toggle.js` | `<theme-toggle>` web component: icon-only sun/moon switch, remembered per device, synced across the page. |
| `themes/example.css` | How to brand one project (Porsche red, Anycubic blue…) by overriding a few tokens. |
| `template/index.html` | Starter page with everything wired up. Copy it to begin a new project. |

## Use it in a project

Paste into `<head>` (or start from `template/index.html`):

```html
<script>try{if(localStorage.getItem("theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Text:wght@400;500;700&family=Sofia+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/raysantos/raysan-ui@0.1/css/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/raysantos/raysan-ui@0.1/css/base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/raysantos/raysan-ui@0.1/css/components.css">
<script src="https://cdn.jsdelivr.net/gh/raysantos/raysan-ui@0.1/js/theme-toggle.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/raysantos/raysan-ui@0.1/js/scroll-progress.js" defer></script>
```

Then drop `<theme-toggle></theme-toggle>` wherever the switch should go, and put `<div class="scroll-progress" aria-hidden="true"></div>` as the first thing inside `<header class="top-app-bar">`.

## Rules for every project

1. **Never hard-code a color.** Use a token: `color: var(--md-on-surface-variant)`, `background: var(--md-surface-container)`.
2. **Pair containers with their "on" color.** `--md-primary-container` always gets `--md-on-primary-container` text.
3. **Type through roles.** `font: var(--title-m)` or `class="title-m"`, not raw sizes.
4. **Dark mode is free.** If you used tokens, dark already works. Check it with the toggle before shipping.
5. **Brand a project with a theme file**, loaded after raysan-ui, overriding only what changes. Don't fork the system.
6. **Project-only styles go in the project** (`app.css`). If two projects need the same thing, it moves here.

## Versions

Pin projects to a minor version (`@0.1`). jsDelivr serves the newest `0.1.x` tag, so fixes arrive automatically and breaking changes never do.

- **Patch** (`v0.1.1`): bug fixes, value tweaks that don't change layout.
- **Minor** (`v0.2.0`): new components or renamed tokens. Projects update their links when ready.

To release: commit, then `git tag v0.1.1 && git push --tags`. jsDelivr can take up to 12 hours to pick up a new tag on a range like `@0.1`; use the exact tag (`@v0.1.1`) to test immediately.

See `CHANGELOG.md` for what changed.
