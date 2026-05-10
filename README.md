# Elite Content Writing Services

A premium, single-page marketing site for a content writing studio that outperforms traditional agencies for roughly half the price.

## What's inside

- `index.html` — fully semantic single-page site
- `styles.css` — design system, dark theme, gradient accents, responsive layout
- `script.js` — nav state, scroll reveal, light parallax on the hero

No build step, no dependencies. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Sections

1. Hero with floating social-proof card
2. Trusted-by logo strip
3. Value pillars (senior writers, ranking-grade SEO, editorial taste, half the invoice)
4. Services grid (SEO, thought leadership, lifecycle, brand, reports, retainer)
5. Vs.-agency comparison table
6. Case studies with hard metrics
7. Four-step process
8. Three-tier pricing with agency price benchmarks
9. Testimonials
10. FAQ
11. Contact CTA with inline form
12. Footer

## Editing voice / pricing

All copy lives in `index.html`. The pricing benchmark numbers (`$2,400`, `$6,800`, `$14,500` and the `<s>` strike-through agency comparisons) are illustrative — swap in your own before going live.

## Brand

- Fonts: Inter + Instrument Serif (Google Fonts)
- Palette: warm gradient (amber → orange → magenta → violet) on near-black
- Tokens defined as CSS custom properties at the top of `styles.css`
