# Story 1.2: Configure Tailwind Design Token System

Status: ready-for-dev

## Story

As a developer,
I want the full Tailwind design token system configured with all project-specific colour, typography, and breakpoint tokens,
so that every component can consume design values from a single source of truth with no magic numbers.

## Acceptance Criteria

1. All 8 colour tokens are available as Tailwind utility classes: `bg-ev-bg`, `bg-ev-surface`, `bg-ev-surface-2`, `text-ev-accent`, `bg-ev-accent`, `bg-ev-accent-hover`, `text-ev-text`, `text-ev-muted`, `text-ev-warning`.
2. Custom breakpoints are active: `sm` = 360px, `md` = 768px, `lg` = 1024px (overriding Tailwind defaults).
3. Inter is configured as the primary font family, falling back to `system-ui, -apple-system, sans-serif`.
4. A smoke-test component in `App.tsx` renders the dark background and teal accent colour visibly in the browser (`npm run dev`).
5. `npm run build` passes with no errors after token configuration.
6. No inline styles or hardcoded hex values exist in any component — all colours reference design tokens.

## Tasks / Subtasks

- [ ] Define colour tokens (AC: 1, 6)
  - [ ] In `src/index.css`, add `@theme` block with all 8 colour custom properties using Tailwind v4 syntax
  - [ ] Verify `bg-ev-bg`, `text-ev-text`, `text-ev-accent`, `bg-ev-surface`, etc. resolve correctly in browser
- [ ] Configure custom breakpoints (AC: 2)
  - [ ] In `src/index.css` `@theme` block, define `--breakpoint-sm: 360px`, `--breakpoint-md: 768px`, `--breakpoint-lg: 1024px`
- [ ] Configure Inter font (AC: 3)
  - [ ] Add Google Fonts Inter import to `index.html` (weights 400, 500, 600, 700, 800)
  - [ ] In `@theme` block, set `--font-sans: 'Inter', system-ui, -apple-system, sans-serif`
  - [ ] Apply `font-sans` as base on `body` via `@layer base` in `index.css`
- [ ] Smoke-test in App.tsx (AC: 4)
  - [ ] Update `App.tsx` to render a div with `className="min-h-screen bg-ev-bg text-ev-text font-sans"` containing a heading with `className="text-ev-accent"`
  - [ ] Confirm the dark background and teal text are visible in the browser
- [ ] Verify build (AC: 5)
  - [ ] Run `npm run build` — confirm zero errors

## Dev Notes

### Tailwind v4 Token Syntax — CRITICAL

Tailwind CSS v4 defines design tokens using CSS custom properties inside an `@theme` block in `index.css`, NOT via `tailwind.config.js` `extend.colors`. The correct approach:

```css
/* src/index.css */
@import 'tailwindcss';

@theme {
  /* Colours */
  --color-ev-bg: #0f1117;
  --color-ev-surface: #1a1d27;
  --color-ev-surface-2: #252836;
  --color-ev-accent: #2dd4bf;
  --color-ev-accent-hover: #14b8a6;
  --color-ev-text: #f8fafc;
  --color-ev-muted: #94a3b8;
  --color-ev-warning: #f59e0b;

  /* Breakpoints — override Tailwind defaults */
  --breakpoint-sm: 360px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

@layer base {
  body {
    @apply font-sans text-ev-text bg-ev-bg;
  }
}
```

This generates utility classes like `bg-ev-bg`, `text-ev-accent`, `border-ev-surface`, etc. automatically.

> ⚠️ Do NOT use `tailwind.config.js` `theme.extend.colors` — that is the v3 approach and will not work with `@tailwindcss/vite` plugin in v4.

[Source: ux-design-specification.md#Design System Foundation]

### Colour Token Reference

| Token             | Hex       | Tailwind Class                     | Use                                |
| ----------------- | --------- | ---------------------------------- | ---------------------------------- |
| `ev-bg`           | `#0f1117` | `bg-ev-bg`                         | Page background                    |
| `ev-surface`      | `#1a1d27` | `bg-ev-surface`                    | Cards, section backgrounds         |
| `ev-surface-2`    | `#252836` | `bg-ev-surface-2`                  | Nested surfaces, hover states      |
| `ev-accent`       | `#2dd4bf` | `text-ev-accent`, `bg-ev-accent`   | CTAs, highlights, active sliders   |
| `ev-accent-hover` | `#14b8a6` | `bg-ev-accent-hover`               | Hover/pressed accent state         |
| `ev-text`         | `#f8fafc` | `text-ev-text`                     | Primary text                       |
| `ev-muted`        | `#94a3b8` | `text-ev-muted`                    | Labels, timestamps, secondary text |
| `ev-warning`      | `#f59e0b` | `text-ev-warning`, `bg-ev-warning` | ANRE fallback indicator            |

[Source: ux-design-specification.md#Color System, architecture.md#Tailwind Design Tokens]

### Breakpoints — Override Reasoning

Tailwind v4 defaults: `sm=640px`, `md=768px`, `lg=1024px`. The project needs `sm=360px` (mid-range Android — primary device). Setting `--breakpoint-sm: 360px` overrides the Tailwind default. `md` and `lg` stay the same values but are explicitly set to document intent.

[Source: ux-design-specification.md#Responsive Design, prd.md#Responsive Design]

### Inter Font Loading

Add to `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

This is the only external font CDN call in the project. It does NOT violate NFR8 (no third-party tracking scripts) — Google Fonts is a font CDN, not a tracking script.

[Source: ux-design-specification.md#Typography System]

### Typography Scale Reference (for subsequent stories)

| Scale     | Size    | Weight | Tailwind                                          |
| --------- | ------- | ------ | ------------------------------------------------- |
| `display` | 48–72px | 800    | `text-5xl md:text-6xl lg:text-7xl font-extrabold` |
| `h1`      | 36px    | 700    | `text-4xl font-bold`                              |
| `h2`      | 24px    | 600    | `text-2xl font-semibold`                          |
| `body`    | 16px    | 400    | `text-base font-normal`                           |
| `label`   | 14px    | 500    | `text-sm font-medium`                             |
| `small`   | 13px    | 400    | `text-[13px] font-normal`                         |

These are **not** configured as `@theme` custom properties — they are applied via Tailwind utility class composition in each component. Document them here so later stories don't reinvent them.

[Source: ux-design-specification.md#Typography System]

### What This Story Does NOT Do

- Does NOT configure i18n (Story 1.3)
- Does NOT create any components beyond the smoke-test in `App.tsx`
- Does NOT configure `netlify.toml` (Story 1.4)
- The smoke-test in `App.tsx` will be replaced in Epic 2 — it is temporary scaffolding only

### Project Structure Notes

- Only files modified: `src/index.css`, `src/App.tsx`, `index.html`
- `tailwind.config.js` is not used for token definition in v4 — it can be left minimal or removed
- Do NOT create any new files in this story

### References

- [Source: ux-design-specification.md#Design System Foundation] — Tailwind token system rationale
- [Source: ux-design-specification.md#Color System] — all 8 colour tokens with hex values
- [Source: ux-design-specification.md#Typography System] — type scale reference
- [Source: ux-design-specification.md#Responsive Strategy] — breakpoint rationale
- [Source: architecture.md#Implementation Patterns] — no inline styles, Tailwind-only rule
- [Source: epics.md#Story 1.2] — acceptance criteria

## Dev Agent Record

### Agent Model Used

_to be filled on implementation_

### Debug Log References

### Completion Notes List

### File List

_to be filled on implementation_
