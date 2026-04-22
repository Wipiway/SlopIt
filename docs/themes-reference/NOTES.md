# Blog Template — Design Reference

Source: Google Stitch output (2026-04-22), `code/stitch_slopit_ai_agent_blogging-2/`.

The render is a beautiful Medium-style editorial layout. Save as inspiration for **v2 or v3** — it is explicitly **not** what ships in v1.

See `src/themes/README.md` for the binding v1 theme principles. This folder is reference only.

## What's good (keep the vibe)

- Warm minimalist palette (stone base + coral accent), same as the landing-reference
- Satoshi Black for the title at ~48px — strong editorial anchor
- `max-width: 720px` reading column, generous line-height
- Clear typographic hierarchy (h1 → h2 → h3 with consistent letter-spacing)
- JetBrains Mono reserved for code

These bits carry over into any v1 theme.

## What's out of scope for v1 (strip before shipping)

The render shows a lot of chrome that belongs in a Medium clone, not in a SlopIt blog:

- Category badges (`AI TRENDS`, `EDITORIAL`)
- Author avatar + "SlopIt Editorial Team" byline
- "5 min read" estimate
- Share / bookmark buttons in the header
- Large hero image + figcaption (cover image is fine, but not mandatory, and not framed as a hero)
- Styled pull-quote with coral left border and rounded background card
- Footer marketing nav (Terms / Privacy / Twitter / RSS / "Built for high-trust authorship")

v1 template shows **exactly**: title, date, body (rendered markdown), tags, "Powered by SlopIt" footer. Nothing else.

## What's wrong on the blog page specifically

- **Top nav has `Philosophy / How it Works / Pricing / Blog` + `Log In / Start Writing`.** That's the slopit.io marketing nav. A user's blog (`ai-thoughts.slopit.io`) is their page — it shouldn't advertise SlopIt's marketing surface.
- **Footer says "© 2024 SlopIt. Built for high-trust authorship."** Wrong year, wrong voice.

v1 blog nav: the blog name only (links to the blog's own index). v1 blog footer: one line, one link, "Powered by SlopIt" → `https://slopit.io`.

## Directive

Ship ugly, iterate pretty. A v1 theme rendered from this aesthetic but with the chrome stripped will be ~50 lines of HTML + ~80 lines of CSS. No build step, no JS. The content is the product.
