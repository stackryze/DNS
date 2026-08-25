# Stackryze DNS — Copilot instructions

Vite + React 19 + Tailwind v4 (dark-only) frontend. Design system lives in
`src/index.css` (OKLCH tokens, electric-indigo accent, Bricolage/Geist/Geist Mono).
UI primitives are Radix-based in `src/components/ui/`. Toasts use `sonner`.

## Design & UI skills (installed in `.agents/skills/`)

Before building, redesigning, reviewing, or animating any UI, read the relevant
`SKILL.md` under `.agents/skills/<name>/` and apply it. Key skills:

- **impeccable** — anti-"AI slop" checklist. Run this mentally on every UI change
  and before shipping (`npx impeccable detect src/`). No side-tab borders, no
  gradient text, no pulsing decorative dots, no hairline+shadow doubling, pair a
  display + body font, AA contrast.
- **web-design-guidelines** — Web Interface Guidelines review (a11y, focus, states,
  forms, keyboard). Use for "review my UI".
- **design-taste-frontend** / **high-end-visual-design** / **redesign-existing-projects**
  — art direction and premium quality bar for landing pages and redesigns.
- **awesome-design-md** — 74 brand design systems (Linear, Vercel, Stripe, …) to
  ground direction in a proven visual language (fetch `getdesign.md/<brand>/design-md`).
- **image-to-code** / **imagegen-frontend-web** — image-first design pipeline (needs an
  image-gen tool). When unavailable, validate visually with Playwright screenshots.
- **emil-design-eng**, **animate**, **review-animations**, **improve-animations**,
  **animation-vocabulary**, **find-animation-opportunities**, **apple-design** —
  motion craft: ease-out curves (no bounce/elastic on UI), transform/opacity only,
  content visible at rest, motion only where it helps.
- **playwright-cli** — browser automation to validate UI at breakpoints.
- **pick-ui-library**, **ask-sonner** — library choices; toast wiring.

Other bundled skills (vercel-*, deploy-to-vercel, write-swift, minimalist-ui,
industrial-brutalist-ui, brandkit, stitch-design-taste, gpt-taste) are available in
`.agents/skills/` for their specific domains.

## Project conventions
- Dark-only. Never reintroduce hardcoded hex (`#38BDF8`, `#1a1a1a`, …) — use tokens
  (`bg-card`, `text-muted-foreground`, `border-border`, `text-primary`, …).
- Premium surfaces use the `.panel` utility (top-highlight + hairline + elevation);
  global depth comes from the `body::before/after` atmosphere + grain.
- Headings use the display font automatically (`h1–h3`); records/data use `font-mono`.
- Keep motion tasteful and accessible; respect `prefers-reduced-motion`.
- Validate changes with `npm run build`; there is pre-existing lint debt in
  `Settings.jsx` (dead password code) — do not "fix" it unless re-enabling.
