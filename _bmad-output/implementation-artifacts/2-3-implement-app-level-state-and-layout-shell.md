# Story 2.3: Implement App-Level State and Layout Shell

Status: ready-for-dev

## Story

As a developer,
I want the `App.tsx` component to hold all input state with correct defaults and render the page section order,
so that all section components receive `inputs` and derived values as props from a single state owner.

## Acceptance Criteria

1. `useState<InputState>` in `App.tsx` is initialised with defaults: `kmPerMonth: 1200`, `fuelType: 'benzina95'`, `vehicleWeightKg: 1400`, `chargingMode: 'public_ac'`, `region: 'centru_sud'`.
2. All derived values (`SavingsResult`, `PriceData`, road tax delta) are computed inline during render via pure function calls — no `useEffect` for recalculation.
3. The page renders section placeholders in order: Hero → Charging → Tax → Savings → CO₂ → Next Steps, each as a `<section>` with the correct `id` attribute.
4. A max-width 720px centred container wrapper is applied to all section inner content.
5. Section padding: `py-10 md:py-14 lg:py-16` (40px / 56px / 64px).
6. `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [ ] Update `App.tsx` with state and layout (AC: 1–5)
  - [ ] Import `useState` from React, `useTranslation` from react-i18next
  - [ ] Import `InputState`, `SavingsResult`, `PriceData` from `../lib/types`
  - [ ] Import `calculateMonthlySavings`, `getRoadTax`, `calcCO2` from `../lib/calculations`
  - [ ] Import `fetchAnreData` from `../lib/anreFetch`; call inside `useEffect` on mount to set `priceData` state
  - [ ] Initialise `useState<InputState>` with correct defaults
  - [ ] Initialise `useState<PriceData>` with hardcoded fallback as initial value (from `anre.json` import)
  - [ ] Compute `savingsResult`, `roadTaxEV`, `roadTaxICE`, `co2Annual` inline during render
  - [ ] Render 6 `<section>` elements with correct `id` attributes and placeholder content
  - [ ] Apply container wrapper to each section
- [ ] Verify build (AC: 6)

## Dev Notes

### App.tsx Structure

```tsx
// src/App.tsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { InputState, PriceData } from './lib/types'
import { calculateMonthlySavings, getRoadTax, calcCO2 } from './lib/calculations'
import { fetchAnreData } from './lib/anreFetch'
import anreFallback from './data/anre.json'

const DEFAULT_INPUTS: InputState = {
  kmPerMonth: 1200,
  fuelType: 'benzina95',
  vehicleWeightKg: 1400,
  chargingMode: 'public_ac',
  region: 'centru_sud',
}

const DEFAULT_PRICES: PriceData = {
  benzina95: anreFallback.benzina95,
  motorina: anreFallback.motorina,
  gpl: anreFallback.gpl,
  lastVerified: anreFallback.lastVerified,
  status: 'fallback',
}

export default function App() {
  const { t } = useTranslation()
  const [inputs, setInputs] = useState<InputState>(DEFAULT_INPUTS)
  const [priceData, setPriceData] = useState<PriceData>(DEFAULT_PRICES)

  useEffect(() => {
    fetchAnreData().then(setPriceData)
  }, [])

  // All derived values computed inline — no useEffect
  const savingsResult = calculateMonthlySavings(inputs, priceData)
  const roadTaxEV = getRoadTax(inputs.vehicleWeightKg)
  const roadTaxICE = getRoadTax(inputs.vehicleWeightKg)  // identical in Moldova law
  const co2Annual = calcCO2(inputs.kmPerMonth, inputs.fuelType)

  return (
    <div className="min-h-screen bg-ev-bg text-ev-text font-sans">
      {/* StickyHeader — Story 2.4 */}
      <section id="hero" className="py-10 md:py-14 lg:py-16">
        <div className="max-w-[720px] mx-auto px-6">
          {/* LossHeadline + SliderGroup — Stories 2.5, 2.6 */}
          <p className="text-ev-muted">{t('app.title')} — hero placeholder</p>
        </div>
      </section>
      <section id="charging" className="py-10 md:py-14 lg:py-16">
        <div className="max-w-[720px] mx-auto px-6">
          <p className="text-ev-muted">Charging — placeholder</p>
        </div>
      </section>
      <section id="tax" className="py-10 md:py-14 lg:py-16">
        <div className="max-w-[720px] mx-auto px-6">
          <p className="text-ev-muted">Tax — placeholder</p>
        </div>
      </section>
      <section id="savings" className="py-10 md:py-14 lg:py-16">
        <div className="max-w-[720px] mx-auto px-6">
          <p className="text-ev-muted">Savings — placeholder</p>
        </div>
      </section>
      <section id="co2" className="py-10 md:py-14 lg:py-16">
        <div className="max-w-[720px] mx-auto px-6">
          <p className="text-ev-muted">CO₂ — placeholder</p>
        </div>
      </section>
      <section id="next-steps" className="py-10 md:py-14 lg:py-16">
        <div className="max-w-[720px] mx-auto px-6">
          <p className="text-ev-muted">Next Steps — placeholder</p>
        </div>
      </section>
    </div>
  )
}
```

### Why useEffect for ANRE fetch but NOT for calculations

- `fetchAnreData()` is async and has a side effect (network / async) — `useEffect` is correct here
- Calculations are synchronous pure functions — they belong inline during render; no `useEffect` needed
- This is the architecture decision: keep the render function as the source of truth for derived state

[Source: architecture.md#State Management — "no useEffect for calculations"]

### Handler Pattern for Child Components

When Stories 2.5 and 2.6 add slider components, they will call handlers defined in `App.tsx`:
```ts
const handleInputChange = (key: keyof InputState, value: InputState[typeof key]) => {
  setInputs(prev => ({ ...prev, [key]: value }))
}
```
Define this handler in this story so it is ready for Stories 2.5/2.6 to consume.

[Source: architecture.md#Naming Conventions — "handle prefix for event handlers"]

### Section IDs — Required for Anchor Navigation

The `id` attributes on `<section>` elements are consumed by the `StickyHeader` in Story 2.4:
- `id="hero"` (or use as the unnamed first section — header links to `#charging`, `#tax`, `#savings`, `#co2`)
- `id="charging"`
- `id="tax"`
- `id="savings"`
- `id="co2"`
- `id="next-steps"`

Do NOT change these IDs in later stories — the StickyHeader anchor links depend on them.

### What This Story Does NOT Do

- Does NOT implement any visual components (Stories 2.4–2.6)
- Does NOT pass `savingsResult`, `priceData` etc. as props yet — those are passed in Stories 2.5/2.6 when the recipient components exist

### Project Structure Notes

Files modified:
- `src/App.tsx` (replace placeholder content from Story 1.2 smoke-test)

### References

- [Source: architecture.md#State Management] — single useState, inline derived values
- [Source: architecture.md#Component Patterns] — stateless section components receive props from App
- [Source: architecture.md#Project Structure] — App.tsx as top-level state owner
- [Source: epics.md#Story 2.3] — acceptance criteria

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
