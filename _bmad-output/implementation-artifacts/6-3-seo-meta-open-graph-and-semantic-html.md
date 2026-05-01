# Story 6.3: SEO Meta, Open Graph, and Semantic HTML

Status: ready-for-dev

## Story

As a potential visitor arriving from a social share or Google search,
I want the page to have a compelling title, description, and social preview card,
so that the link looks professional and I understand what the page offers before clicking.

## Acceptance Criteria

1. `<title>` is "Calculator EV Moldova — Cât economisești trecând la electric?".
2. `<meta name="description">` provides a concise summary of the page purpose.
3. Open Graph tags present: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`.
4. `og:type` is `website`.
5. `og:image` references a static image in the `public/` directory.
6. Heading hierarchy is correct: exactly one `<h1>`, `<h2>` per section, no skipped levels.
7. `<html lang="ro">` is set in `index.html` (LanguageSwitcher updates it dynamically at runtime).
8. `<main id="main-content">` wraps the main content (required by Story 6.4 skip link).
9. `npm run build` passes.

## Tasks / Subtasks

- [ ] Update `index.html` with title and meta tags (AC: 1–5, 7)
  - [ ] Set `<html lang="ro">`
  - [ ] Set `<title>`
  - [ ] Add `<meta name="description">`
  - [ ] Add OG meta tags
- [ ] Audit heading hierarchy across all components (AC: 6)
  - [ ] Ensure each section component uses `<h2>` for section title
  - [ ] Ensure hero has `<h1>`
  - [ ] Fix any skipped heading levels
- [ ] Add `<main id="main-content">` wrapper in `App.tsx` (AC: 8)
- [ ] Add `og:image` placeholder to `public/` (AC: 5)

## Dev Notes

### index.html Changes

```html
<!doctype html>
<html lang="ro">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Calculator EV Moldova — Cât economisești trecând la electric?</title>
    <meta
      name="description"
      content="Calculează cât cheltuiești cu benzina față de un vehicul electric în Moldova. Prețuri ANRE actualizate, tarife EVPoint reale, comparație taxă de drum."
    />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://ev.md/" />
    <meta property="og:title" content="Calculator EV Moldova — Cât economisești trecând la electric?" />
    <meta
      property="og:description"
      content="Calculează cât cheltuiești cu benzina față de un vehicul electric în Moldova. Prețuri ANRE actualizate, tarife EVPoint reale."
    />
    <meta property="og:image" content="https://ev.md/og-preview.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

> ⚠️ Update `og:url` and `og:image` URLs to match the actual deployed Netlify domain once known. Use the placeholder `https://ev.md/` for now.

### og:image Placeholder

Create `public/og-preview.png` — a simple 1200×630px image (standard OG dimensions). For V1, this can be a basic placeholder. The agent should create a simple image or note that a proper design asset is needed.

If no image generation capability is available, create a placeholder `public/og-preview.png` note file and add a TODO comment in `index.html`:

```html
<!-- TODO: Replace og:image with actual 1200x630 social preview image -->
```

### Heading Hierarchy Audit

Required heading structure across the app:

```
<h1> — Hero section (LossHeadline or hero title)
<h2> — "Operatori de încărcare" (ChargingSection)
<h2> — "EV vs benzină: aceeași taxă" (TaxSection)
<h2> — "Ce pierzi în fiecare lună" (SavingsSection)
<h2> — "Amprentă de carbon redusă" (CO2Section)
<h2> — "Începe tranziția azi" (NextStepsSection)
```

Check each section component uses `<h2>` for its section title. If any currently uses `<h3>` or `<p>` for what is semantically a section title, upgrade to `<h2>`.

No `<h1>` should appear in section components — only in the hero area. No levels should be skipped (e.g., no `<h4>` without an `<h3>` above it).

### main Element in App.tsx

```tsx
// In App.tsx, wrap sections:
<main id="main-content">{/* All section components */}</main>
```

The `id="main-content"` is required for the skip link in Story 6.4 to work.

### LanguageSwitcher Integration

`<html lang="ro">` is the static default. The `LanguageSwitcher` component dynamically updates `document.documentElement.lang` when the user switches language (implemented in Story 6.1). `index.html` only needs the static default.

### Project Structure Notes

Files modified:

- `index.html` — meta tags, title, OG, lang attribute
- `src/App.tsx` — add `<main id="main-content">` wrapper
- `src/components/*.tsx` — audit and fix heading levels if needed

Files created:

- `public/og-preview.png` — 1200×630 placeholder (or TODO note)

### References

- [Source: prd.md#NFR11, NFR12] — SEO, Open Graph
- [Source: ux-design-specification.md#SemanticHTML] — heading hierarchy
- [Source: epics.md#Story 6.3] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
