# Story 5.1: Implement StatGrid and StatBox Components

Status: ready-for-dev

## Story

As a visitor,
I want to see my monthly, annual, and 5-year savings displayed in a clear 3-column grid,
so that I can instantly grasp the financial scale of switching to an EV.

## Acceptance Criteria

1. Three `StatBox` components display: monthly saving (MDL), annual saving (MDL), 5-year saving (MDL).
2. `StatGrid` uses CSS Grid `grid-cols-3` at ≥480px (`sm:`) and `grid-cols-1` below.
3. All MDL figures use `font-variant-numeric: tabular-nums` to prevent layout shift during updates.
4. All three values update within 100ms when any slider changes (highlight pulse fires).
5. Break-even timeline shows below the grid using `savingsResult.breakEvenMonths`.
6. When `breakEvenMonths` is `null`, shows "Economii minime la acest profil".
7. Savings section has `id="savings"` for anchor navigation.
8. All text via `t('key')`.
9. `npm run build` passes.

## Tasks / Subtasks

- [ ] Create `src/components/StatBox.tsx` (AC: 1, 3)
  - [ ] Props: `value: number`, `label: string`, `period: string`
  - [ ] Format value with `Intl.NumberFormat` + `tabular-nums`
  - [ ] Apply highlight pulse when value changes
- [ ] Create `src/components/StatGrid.tsx` (AC: 1, 2, 4)
  - [ ] Props: `savingsResult: SavingsResult`
  - [ ] Compose 3 `StatBox` components in CSS Grid
- [ ] Create `src/components/SavingsSection.tsx` (AC: 5–8)
  - [ ] Props: `savingsResult: SavingsResult`
  - [ ] Render `SavingsCounter` (Story 5.2 — use placeholder div for now)
  - [ ] Render `StatGrid`
  - [ ] Render break-even text below grid
  - [ ] Apply section label + `id="savings"`
- [ ] Wire into `App.tsx` (AC: 4)
  - [ ] Pass `savingsResult` to `<SavingsSection />`
- [ ] Add i18n keys (AC: 8)

## Dev Notes

### StatBox Component

```tsx
// src/components/StatBox.tsx
import { useState, useEffect } from 'react'

interface StatBoxProps {
  value: number
  label: string    // e.g. "lunar", "anual", "5 ani"
  period: string   // e.g. "pe lună", "pe an", "în 5 ani"
}

export default function StatBox({ value, label, period }: StatBoxProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 300)
    return () => clearTimeout(t)
  }, [value])

  const formatted = new Intl.NumberFormat('ro-MD', {
    style: 'currency', currency: 'MDL', maximumFractionDigits: 0
  }).format(value)

  return (
    <div className={`bg-ev-surface rounded-lg p-6 text-center ${pulse ? 'highlight-pulse' : ''}`}>
      <p className="text-[13px] text-ev-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-ev-accent [font-variant-numeric:tabular-nums] leading-tight">
        {formatted}
      </p>
      <p className="text-[13px] text-ev-muted mt-1">{period}</p>
    </div>
  )
}
```

### StatGrid Component

```tsx
// src/components/StatGrid.tsx
import type { SavingsResult } from '../lib/types'
import StatBox from './StatBox'
import { useTranslation } from 'react-i18next'

export default function StatGrid({ savingsResult }: { savingsResult: SavingsResult }) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatBox value={savingsResult.monthly} label={t('savings.monthly')} period={t('savings.perMonth')} />
      <StatBox value={savingsResult.annual} label={t('savings.annual')} period={t('savings.perYear')} />
      <StatBox value={savingsResult.fiveYear} label={t('savings.fiveYear')} period={t('savings.inFiveYears')} />
    </div>
  )
}
```

### `tabular-nums` in Tailwind

Use Tailwind arbitrary property: `[font-variant-numeric:tabular-nums]`. This prevents the numbers from shifting width as they update — critical for the animation feel.

### Break-even Display

```tsx
{savingsResult.breakEvenMonths !== null ? (
  <p className="text-sm text-ev-muted mt-4">
    {t('savings.breakEven', { months: savingsResult.breakEvenMonths })}
  </p>
) : (
  <p className="text-sm text-ev-muted mt-4">{t('savings.negligible')}</p>
)}
```

i18n key: `"savings.breakEven": "Recuperezi investiția în {{months}} luni"`

### SavingsCounter Placeholder

Story 5.2 adds `SavingsCounter`. For this story, render a placeholder `<div>` where `SavingsCounter` will go, with a comment:
```tsx
{/* SavingsCounter — implemented in Story 5.2 */}
<div className="h-20" />
```

### Highlight Pulse Reuse

The same `highlight-pulse` CSS class from Story 2.6 (`@keyframes value-highlight`) is reused here. Do NOT add a duplicate keyframe definition — it is already in `index.css`.

### i18n Keys to Add

```json
{
  "savings.sectionLabel": "Impactul financiar",
  "savings.sectionTitle": "Ce pierzi în fiecare lună",
  "savings.monthly": "Lunar",
  "savings.annual": "Anual",
  "savings.fiveYear": "5 ani",
  "savings.perMonth": "pe lună",
  "savings.perYear": "pe an",
  "savings.inFiveYears": "în 5 ani",
  "savings.breakEven": "Recuperezi investiția în {{months}} luni",
  "savings.negligible": "Economii minime la acest profil"
}
```

### Project Structure Notes

Files created:
- `src/components/StatBox.tsx`
- `src/components/StatGrid.tsx`
- `src/components/SavingsSection.tsx`

Files modified:
- `src/App.tsx` — wire `<SavingsSection />`
- `src/locales/ro.json`, `src/locales/en.json` — add savings keys

### References

- [Source: ux-design-specification.md#StatBox/StatGrid] — 3-column grid, tabular-nums
- [Source: ux-design-specification.md#Feedback Patterns] — 300ms highlight pulse
- [Source: prd.md#FR14–FR16] — savings counter, stat boxes, break-even
- [Source: epics.md#Story 5.1] — acceptance criteria

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
