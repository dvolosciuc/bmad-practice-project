# Story 2.6: Implement LossHeadline with Live Recalculation

Status: ready-for-dev

## Story

As Ion (a curious visitor),
I want to see my personalised monthly loss figure in large display-scale text above the fold the moment the page loads,
so that I understand the financial argument before touching anything.

## Acceptance Criteria

1. The loss figure displays in display-scale typography: 48px mobile / 68px desktop, weight 800, `ev-accent` colour.
2. The figure is visible above the fold on a 360px viewport without scrolling.
3. `LossHeadline` has `aria-live="polite"` so screen readers announce updates on slider change.
4. The loss figure updates within 100ms on any slider adjustment — no button press.
5. A 300ms highlight pulse animation fires on the headline and all dependent numeric values when any slider changes.
6. All text renders via `t('key')` — no hardcoded Romanian strings in JSX.
7. When `savingsResult.monthly` is 0 or near-zero, shows "Economii minime" — never a negative number.
8. `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [ ] Create `src/components/LossHeadline.tsx` (AC: 1–4, 6, 7)
  - [ ] Props: `monthlyLoss: number`
  - [ ] Display formatted MDL amount in display scale with `aria-live="polite"`
  - [ ] Format number with `Intl.NumberFormat` for comma-separated MDL (see Dev Notes)
  - [ ] Handle zero/negative case with fallback message
- [ ] Implement highlight pulse animation (AC: 5)
  - [ ] Add `@keyframes` pulse to `index.css`
  - [ ] Create `useHighlightOnChange` hook or apply CSS animation class when value changes
- [ ] Wire `LossHeadline` and `SliderGroup` together in Hero section of `App.tsx` (AC: 4)
  - [ ] Pass `savingsResult.monthly` to `<LossHeadline />`
  - [ ] Wrap dependent numeric elements with pulse trigger class
- [ ] Add section label above headline (AC: 6)
  - [ ] 11px uppercase letter-spacing `ev-accent` section label pattern
- [ ] Add i18n keys (AC: 6)
- [ ] Verify above-fold on 360px (AC: 2)

## Dev Notes

### LossHeadline Component

```tsx
// src/components/LossHeadline.tsx
import { useTranslation } from 'react-i18next'

interface LossHeadlineProps {
  monthlyLoss: number
}

export default function LossHeadline({ monthlyLoss }: LossHeadlineProps) {
  const { t } = useTranslation()
  const formatted = new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: 'MDL',
    maximumFractionDigits: 0,
  }).format(Math.max(0, monthlyLoss))

  const isNegligible = monthlyLoss < 50  // threshold for "minimal savings"

  return (
    <div aria-live="polite" aria-atomic="true">
      <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
        {t('hero.sectionLabel')}
      </p>
      {isNegligible ? (
        <p className="text-4xl font-bold text-ev-text">{t('hero.negligibleSavings')}</p>
      ) : (
        <p className="text-5xl lg:text-7xl font-extrabold text-ev-accent leading-none">
          {t('hero.lossPrefix')} {formatted} {t('hero.lossSuffix')}
        </p>
      )}
    </div>
  )
}
```

### Display Scale Typography

| Viewport | Size | Tailwind Class |
|---|---|---|
| Mobile (default) | 48px | `text-5xl` (48px) |
| Desktop (lg+) | 68–72px | `lg:text-7xl` (72px) |
| Weight | 800 | `font-extrabold` |
| Colour | ev-accent | `text-ev-accent` |

[Source: ux-design-specification.md#Typography System — display scale 56-72px weight 800]

### Highlight Pulse Animation

Add to `src/index.css`:
```css
@keyframes value-highlight {
  0%   { background-color: transparent; }
  30%  { background-color: color-mix(in srgb, var(--color-ev-accent) 15%, transparent); }
  100% { background-color: transparent; }
}

.highlight-pulse {
  animation: value-highlight 300ms ease-out;
}
```

Trigger by adding/removing the class when the value prop changes. Use a `useEffect` on `monthlyLoss`:
```tsx
const [pulse, setPulse] = useState(false)
useEffect(() => {
  setPulse(true)
  const t = setTimeout(() => setPulse(false), 300)
  return () => clearTimeout(t)
}, [monthlyLoss])
```
Apply `pulse ? 'highlight-pulse' : ''` to the headline wrapper. The same mechanism should be applied to `StatGrid` values in Story 5.1 — document this pattern there.

### Number Formatting

Use `Intl.NumberFormat('ro-MD', { style: 'currency', currency: 'MDL', maximumFractionDigits: 0 })`. This produces "1.840 MDL" in Romanian locale formatting.

> ⚠️ Do NOT use `toLocaleString()` without a locale argument — results differ across browsers. Always pass `'ro-MD'` explicitly.

### i18n Keys to Add

```json
{
  "hero.sectionLabel": "Costul real al mașinii tale",
  "hero.lossPrefix": "Cu mașina curentă, pierzi",
  "hero.lossSuffix": "pe lună față de un EV",
  "hero.negligibleSavings": "Economii minime la acest profil"
}
```

### Above-the-Fold on 360px

The hero section must show the loss figure without scrolling on a 360×780px viewport (standard mid-range Android). The StickyHeader is ~56px. The section label + headline should render in the remaining ~700px. Keep the hero section padding tight: `pt-12 pb-6` on mobile (reduced from the standard `py-10`).

[Source: ux-design-specification.md#Critical Success Moments — "T+0s: Loss-aversion headline visible above fold"]

### Loss Framing Language

The headline uses loss-aversion framing: "pierzi X MDL/lună" (you're losing X MDL/month). This is a deliberate product decision grounded in behavioural economics — do NOT change to a gain framing ("economisești") even if it seems more positive. [Source: prd.md#Innovation — Loss-aversion as primary framing]

### Hero Section Final Structure

```
HeroSection (id="hero")
├── LossHeadline (receives savingsResult.monthly)
├── AnreFreshnessBanner (receives priceData — added in Story 3.3)
└── SliderGroup (receives inputs + handleInputChange — added in Story 2.5)
```

### Project Structure Notes

Files created:
- `src/components/LossHeadline.tsx`

Files modified:
- `src/App.tsx` — import and render `<LossHeadline />` in Hero section; pass `savingsResult.monthly`
- `src/index.css` — add `@keyframes value-highlight` and `.highlight-pulse`
- `src/locales/ro.json` — add `hero.*` keys
- `src/locales/en.json` — add `hero.*` keys

### References

- [Source: ux-design-specification.md#LossHeadline] — component spec, aria-live
- [Source: ux-design-specification.md#Feedback Patterns] — 300ms highlight pulse on slider change
- [Source: ux-design-specification.md#Typography System] — display scale
- [Source: prd.md#FR13] — loss-aversion framing requirement
- [Source: prd.md#NFR2] — slider interactions < 100ms
- [Source: epics.md#Story 2.6] — acceptance criteria

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
