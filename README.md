# Elite Content Writing Services

A premium, multi-page marketing site for a content writing studio that outperforms traditional agencies for roughly half the price.

## Pages

- `index.html` — home (hero, value pillars, services preview, vs-agency, work, process, pricing, testimonials, FAQ, CTA)
- `about.html` — origin story, principles, team
- `services.html` — full services, vs-agency table, process, pricing
- `blog.html` — blog index with 6 cards (3 unique posts, 3 demo entries)
  - `blog/half-the-price-twice-the-output.html`
  - `blog/seo-content-that-ranks-in-2026.html`
  - `blog/ghostwriting-founders-on-linkedin.html`
- `contact.html` — long-form contact form, channels, FAQ
- `terms.html` — Terms & Conditions
- `privacy.html` — Privacy Policy

Shared `styles.css` and `script.js`. No build step, no dependencies.

## Play Store / Android app

This site is configured as an installable **Progressive Web App** and can be wrapped into a **Trusted Web Activity (TWA)** for Play Store. See [`TWA_BUILD.md`](./TWA_BUILD.md) for step-by-step build instructions.

PWA pieces shipped:

- `manifest.webmanifest` — web app manifest with icons, theme colors, and app shortcuts
- `sw.js` — service worker (network-first HTML, cache-first assets, offline fallback)
- `icons/` — 192/512 PNG, maskable 512 PNG, 2048 splash, SVG source
- `.well-known/assetlinks.json` — Digital Asset Links file (fingerprint placeholder to fill after first Play Console upload)
- `twa-manifest.json` — Bubblewrap config to generate the `.aab` artifact for Play Store

## Run locally

Because pages link with absolute paths (`/about.html`, `/styles.css`), serve from the repo root rather than opening files directly:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Editing voice / pricing

All copy lives in the HTML files. The pricing benchmark numbers (`$2,400`, `$6,800`, `$14,500` and the `<s>` strike-through agency comparisons) and team bios are illustrative — swap in your own before going live. The contact form is currently UI-only (it shows a success state on submit); wire it to your inbox or a form service like Formspree before launching.

## Brand

- Fonts: Inter + Instrument Serif (Google Fonts)
- Palette: warm gradient (amber → orange → magenta → violet) on near-black
- Tokens defined as CSS custom properties at the top of `styles.css`
