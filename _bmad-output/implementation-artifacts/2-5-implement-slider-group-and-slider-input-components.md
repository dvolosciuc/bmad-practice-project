# Story 2.5: Implement SliderGroup and SliderInput Components

Status: ready-for-dev

## Story

As a visitor,
I want four slider controls (km/month, fuel type, vehicle weight, charging mode) with immediate live feedback,
so that I can adjust the calculation inputs to match my personal driving reality.

## Acceptance Criteria

1. All four controls are visible: km/month range slider (300–3,000), fuel type segmented control (Benzina 95 / Motorina / GPL), vehicle weight range slider (500–5,000 kg, step 50), charging mode segmented control (Public AC / Public DC).
2. Each `SliderInput` shows: label on left · live value with unit on right · hint text below.
3. Each `<input type="range">` has: `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`.
4. Effective thumb tap target is minimum 44×44px on touch devices.
5. All labels and hint text render via `t('key')` — zero hardcoded strings in JSX.
6. Changing any slider calls the `handleInputChange` handler from `App.tsx` and the displayed value updates instantly.
7. `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [ ] Create `src/components/SliderInput.tsx` (AC: 2–5)
  - [ ] Props interface: `SliderInputProps` with `id`, `label`, `value`, `min`, `max`, `step`, `unit`, `hint`, `onChange`, `ariaValueText`
  - [ ] Render label row (left: label, right: value + unit)
  - [ ] Render `<input type="range">` with all ARIA attributes
  - [ ] Render hint text below in `text-ev-muted text-[13px]`
  - [ ] Apply thumb tap target CSS (see Dev Notes)
- [ ] Create `src/components/SegmentedControl.tsx` (AC: 1, 5, 6)
  - [ ] Props interface: `SegmentedControlProps` with `options: {value, label}[]`, `value`, `onChange`
  - [ ] Render button group; active option gets `bg-ev-accent text-ev-bg`, inactive gets `bg-ev-surface-2 text-ev-muted`
- [ ] Create `src/components/SliderGroup.tsx` (AC: 1, 6)
  - [ ] Compose `SliderInput` × 2 + `SegmentedControl` × 2
  - [ ] Props: `inputs: InputState`, `onChange: (key, value) => void`
  - [ ] Wire all four controls to `onChange` handler
- [ ] Wire `SliderGroup` into `App.tsx` Hero section (AC: 6)
  - [ ] Pass `inputs` and `handleInputChange` as props to `<SliderGroup />`
- [ ] Add i18n keys for all slider labels and hints (AC: 5)
- [ ] Verify on 360px viewport (AC: 4)

## Dev Notes

### SliderInput Props Interface

```tsx
interface SliderInputProps {
  id: string
  label: string // already translated by caller
  value: number
  min: number
  max: number
  step: number
  unit: string // e.g. "km/lună", "kg"
  hint: string // already translated by caller
  onChange: (value: number) => void
  ariaValueText?: string // e.g. "1200 km pe lună"
}
```

### Touch Target for Range Thumb

Browsers render range thumbs at ~16–20px visually. To achieve 44px effective tap target, use:

```css
/* in index.css @layer components or via Tailwind arbitrary */
input[type='range']::-webkit-slider-thumb {
  width: 28px;
  height: 28px;
}
```

Additionally, ensure the entire `<input>` element has `min-h-[44px]` padding so the hit area extends to 44px total.

[Source: ux-design-specification.md#SliderInput component spec — "track 20px, thumb 28px, 44px effective"]

### SegmentedControl Pattern

```tsx
interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}
```

Use `<div role="group" aria-label={label}>` wrapper with `<button>` elements (not radio inputs) for the segmented control. Active button: `bg-ev-accent text-ev-bg`. Inactive: `bg-ev-surface-2 text-ev-muted hover:bg-ev-surface`.

Fuel type options:

```ts
;[
  { value: 'benzina95', label: t('slider.benzina95') },
  { value: 'motorina', label: t('slider.motorina') },
  { value: 'gpl', label: t('slider.gpl') },
]
```

### i18n Keys to Add

```json
{
  "slider.kmPerMonth": "Km pe lună",
  "slider.kmPerMonthHint": "Distanța medie lunară",
  "slider.fuelType": "Tip combustibil",
  "slider.benzina95": "Benzină 95",
  "slider.motorina": "Motorină",
  "slider.gpl": "GPL",
  "slider.vehicleWeight": "Masa vehiculului",
  "slider.vehicleWeightHint": "Găsește masa pe talonul mașinii",
  "slider.chargingMode": "Mod de încărcare",
  "slider.publicAC": "AC public",
  "slider.publicDC": "DC rapid"
}
```

### SliderGroup Composition

```
SliderGroup
├── SliderInput (km/month: 300–3000, step 100, unit "km/lună")
├── SegmentedControl (fuel type: benzina95 | motorina | gpl)
├── SliderInput (weight: 500–5000, step 50, unit "kg")
└── SegmentedControl (charging mode: public_ac | public_dc)
```

### No Default Export on SliderInput

All components use named exports... wait — architecture says one named export per file. Use:

```ts
export default function SliderInput(...) { ... }
export default function SegmentedControl(...) { ... }
export default function SliderGroup(...) { ... }
```

[Source: architecture.md#Component Patterns — "one named export per file"]

### Project Structure Notes

Files created:

- `src/components/SliderInput.tsx`
- `src/components/SegmentedControl.tsx`
- `src/components/SliderGroup.tsx`

Files modified:

- `src/App.tsx` — import and render `<SliderGroup />` in Hero section
- `src/locales/ro.json` — add slider keys
- `src/locales/en.json` — add slider keys

### References

- [Source: ux-design-specification.md#SliderInput] — full component spec including ARIA attributes
- [Source: ux-design-specification.md#Form/Input Patterns] — segmented control (not `<select>`), slider specs
- [Source: architecture.md#Component Patterns] — stateless components receive props from App
- [Source: prd.md#FR1–FR4] — four input controls required
- [Source: epics.md#Story 2.5] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
