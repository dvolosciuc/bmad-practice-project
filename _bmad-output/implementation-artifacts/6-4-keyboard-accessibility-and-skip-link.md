# Story 6.4: Keyboard Accessibility and Skip Link

Status: ready-for-dev

## Story

As a keyboard or screen reader user,
I want to skip repetitive navigation, navigate all interactive elements with Tab, and have focus clearly visible at all times,
so that I can use the app without a mouse.

## Acceptance Criteria

1. A visually-hidden skip link `<a href="#main-content">Treci la conținut</a>` is the first element in the DOM.
2. The skip link becomes visible and focused when it receives keyboard focus.
3. All interactive elements (buttons, links, sliders, language switcher) have `focus-visible:ring-2 focus-visible:ring-ev-accent` focus indicator.
4. Natural DOM tab order is correct — tab sequence follows visual reading order.
5. `prefers-reduced-motion` is verified end-to-end: `SavingsCounter` animation skips, other transitions are minimal.
6. `npm run build` passes.

## Tasks / Subtasks

- [ ] Add skip link as first element in `App.tsx` (AC: 1–2)
  - [ ] Position with `sr-only focus:not-sr-only` pattern or equivalent
  - [ ] Ensure it's the first focusable DOM element
- [ ] Add `.sr-only` and `.focus-visible-ring` utilities to `src/index.css` (AC: 2, 3)
- [ ] Audit all interactive elements for focus ring (AC: 3)
  - [ ] `<button>` elements
  - [ ] `<a>` links
  - [ ] Range `<input type="range">` sliders
  - [ ] LanguageSwitcher buttons
- [ ] Verify tab order (AC: 4)
- [ ] Verify `prefers-reduced-motion` end-to-end (AC: 5)

## Dev Notes

### Skip Link Pattern

Add as the VERY FIRST element inside `<body>` / root render, before `<StickyHeader>`:

```tsx
// In App.tsx, as first child in the JSX tree:
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ev-accent focus:text-ev-bg focus:rounded-lg focus:ring-2 focus:ring-ev-bg font-medium"
>
  Treci la conținut
</a>
```

The `sr-only focus:not-sr-only` pattern hides the element visually until focused, then reveals it as a visible skip button.

### sr-only CSS Class

Tailwind includes a built-in `sr-only` class. Verify it is available (it should be — it's a standard Tailwind utility).

If for any reason a custom `.sr-only` is needed in `index.css`:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Focus Ring on Interactive Elements

Use Tailwind `focus-visible:ring-2 focus-visible:ring-ev-accent focus-visible:outline-none` on all interactive elements. `focus-visible` fires only on keyboard focus, not mouse — this is the correct pattern (do NOT use `focus:` alone).

#### Elements to audit:

- `LanguageSwitcher` buttons
- All CTA `<a>` links in `NextStepsSection`
- `<button>` in `ProgressiveDisclosure` (toggle)
- Range sliders in `SliderInput`
- Any other buttons added throughout the app

#### Pattern to add to interactive elements:

```tsx
className = '... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent'
```

### Tab Order Verification

The natural DOM order should follow the visual reading order:

1. Skip link (before header)
2. Navigation links in `StickyHeader`
3. Language switcher in `StickyHeader`
4. Slider inputs (in order of appearance)
5. ProgressiveDisclosure toggle in charging section
6. ProgressiveDisclosure toggle in tax section
7. CTA links in NextStepsSection

Ensure NO `tabindex` manipulation is needed — the DOM order should be correct from the component structure. If any element is visually repositioned via CSS but needs a different tab order, use `tabindex` carefully.

### prefers-reduced-motion End-to-End Check

`SavingsCounter` already handles `prefers-reduced-motion` per Story 5.2. Verify:

1. `window.matchMedia('(prefers-reduced-motion: reduce)').matches` returns `true` in browser devtools when forced
2. `SavingsCounter` shows final value immediately (no count-up)
3. Tailwind `transition-*` classes: Tailwind v4 respects the `@media (prefers-reduced-motion: reduce)` at the framework level for `transition-*` utilities — no additional work needed

> In Chrome DevTools: Rendering tab → "Emulate CSS media feature prefers-reduced-motion" → "reduce"

### CSS Additions to index.css

Only add custom CSS if the Tailwind utilities are insufficient. The `sr-only` and focus ring patterns are all available as Tailwind utilities. Prefer utility classes over custom CSS.

### Project Structure Notes

Files modified:

- `src/App.tsx` — add skip link as first element
- `src/index.css` — add `.sr-only` only if Tailwind's built-in is insufficient
- `src/components/LanguageSwitcher.tsx` — add focus-visible ring to buttons
- `src/components/NextStepsSection.tsx` — add focus-visible ring to CTA links
- `src/components/ProgressiveDisclosure.tsx` — add focus-visible ring to toggle button
- `src/components/SliderInput.tsx` — add focus-visible ring to range input

### References

- [Source: ux-design-specification.md#Accessibility] — skip link, focus-visible, tab order
- [Source: prd.md#NFR6, NFR7] — keyboard navigation, WCAG AA partial
- [Source: architecture.md#Accessibility budget] — V1 scope: colour contrast + keyboard nav
- [Source: epics.md#Story 6.4] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
