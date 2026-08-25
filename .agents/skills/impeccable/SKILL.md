---
name: impeccable
description: Detects and removes "AI slop" from UI. A checklist of the default patterns AI generators reach for, plus the CLI to flag them. Use when building or reviewing any interface to keep it looking intentional and production-grade rather than templated. Run before shipping UI changes.
license: See https://impeccable.style (created by Paul Bakaus)
---

# Impeccable — anti-AI-slop design review

The missing design vocabulary for agents. Catches the defaults generators keep
reaching for. Source: https://impeccable.style · CLI: `npx impeccable`.

## CLI
- `npx impeccable detect src/` — deterministic detector over files/dirs (CI-friendly, JSON + exit codes).
- `npx impeccable critique` — LLM design review with the overlay.
- `npx impeccable install` — installs the full skill for your harness (interactive).

## The slop checklist — flag and fix these

### Visual details
- Decorative grid-line background with no canvas/measurement purpose.
- Border accent / **side-tab accent border** on a rounded card (the #1 AI tell) — remove it.
- Glassmorphism used as decoration, not to solve layering.
- **Hairline border + wide diffuse shadow together** — commit to ONE (edge OR elevation).
- Repeating-gradient stripes as surface decoration.
- Extreme border-radius (24px+) on small cards — cards top out ~12–16px.
- Hand-drawn/shape-assembled SVG scenes.

### Typography
- Kicker/eyebrow label or **pill chip above a hero headline** — fold into headline or drop.
- Undersized functional text (<11px); tiny body text (<12px).
- Flat type hierarchy (sizes too close; aim ≥1.25 ratio).
- **Icon tile stacked above heading** (the universal AI feature-card) — use side-by-side.
- Italic serif display hero.
- Oversized long-sentence hero headline.
- Crushed/wide letter spacing on body.
- **Overused font (Inter, Geist, Space Grotesk, Instrument Serif)**; single font for everything — pair a display + body.
- All-caps body passages.

### Color & contrast
- Radial-gradient background halo / decorative spotlight glow.
- **AI palette: purple/violet gradients, cyan-on-dark.**
- Dark mode with glowing colored box-shadows.
- **Gradient text** on headings/metrics — use solid.
- Gray text on colored background; cream/beige "tasteful" default bg.

### Layout & space
- Tiny numbered section labels; hero-metric template; identical icon+heading card grids.
- Monotonous spacing (no rhythm); nested cards; line length >80ch.
- Content overflow; positioned child clipped by overflow container.
- Heading crowded against previous block (more space above than below).

### Motion
- **Pulsing status dot** / decorative blinking cursor — animate only live data.
- Auto-scrolling marquee; bounce/elastic easing on UI (use ease-out quart/quint/expo).
- Animating layout props (width/height/padding) — use transform/opacity.
- Image hover scale/rotate.

### Copy
- Em-dash overuse; marketing buzzwords (streamline, empower, supercharge, enterprise-grade);
  aphoristic manufactured-contrast cadence; "theater" framing; repeated labels in one card.

### General quality
- Content invisible at rest (reveal-only); cramped padding (<8–16px); low contrast (<AA);
  skipped heading levels; tight line-height (<1.3); justified body text.

## How to apply
1. While building UI, keep this list in view; prefer the non-slop alternative by default.
2. Before shipping, run `npx impeccable detect src/` and resolve findings.
3. In reviews, walk each category against the changed screens.
