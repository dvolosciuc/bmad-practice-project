# Story 4.2: Implement TaxComparison Section

Status: ready-for-dev

## Story

As a visitor,
I want to see my EV and ICE road tax amounts side-by-side based on my configured vehicle weight, with an explainer for the "masa totală autorizată" concept,
so that I can verify the EV=ICE tax reality for Moldova and understand how to find my own vehicle's weight.

## Acceptance Criteria

1. Two values display side-by-side: "Taxa EV" and "Taxa benzină/motorină" — both computed from the same weight using `getRoadTax()`.
2. For the same weight input, EV and ICE values are equal (Moldova EV=ICE road tax reality).
3. A `ProgressiveDisclosure` contains: masa explanation, "Găsește masa pe talonul mașinii (certificatul de înmatriculare)" instruction, and talon field hint.
4. The Tax section has `id="tax"` for anchor navigation.
5. Changing the vehicle weight slider updates both values immediately.
6. All text renders via `t('key')` — no hardcoded strings.
7. `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [ ] Create `src/components/TaxSection.tsx` (AC: 1–6)
  - [ ] Props: `vehicleWeightKg: number`, `roadTaxAmount: number` (same value used for both EV and ICE)
  - [ ] Render two side-by-side stat boxes (EV tax / ICE tax) with equal values
  - [ ] Render `ProgressiveDisclosure` with masa explainer content
  - [ ] Apply section label pattern and `id="tax"`
- [ ] Wire into `App.tsx` (AC: 5)
  - [ ] Replace tax placeholder with `<TaxSection vehicleWeightKg={inputs.vehicleWeightKg} roadTaxAmount={roadTaxEV} />`
- [ ] Add i18n keys (AC: 6)

## Dev Notes

### TaxSection Component

```tsx
// src/components/TaxSection.tsx
import { useTranslation } from 'react-i18next'
import ProgressiveDisclosure from './ProgressiveDisclosure'

interface TaxSectionProps {
  vehicleWeightKg: number
  roadTaxAmount: number // MDL/year — same for EV and ICE in Moldova
}

export default function TaxSection({ vehicleWeightKg, roadTaxAmount }: TaxSectionProps) {
  const { t } = useTranslation()
  const formatted = new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: 'MDL',
    maximumFractionDigits: 0,
  }).format(roadTaxAmount)

  return (
    <section id="tax" className="py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('tax.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('tax.sectionTitle')}</h2>

        {/* Side-by-side tax comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-ev-surface rounded-lg p-6 text-center">
            <p className="text-[13px] text-ev-muted mb-2">{t('tax.ev')}</p>
            <p className="text-3xl font-bold text-ev-accent">{formatted}</p>
            <p className="text-[13px] text-ev-muted mt-1">{t('tax.perYear')}</p>
          </div>
          <div className="bg-ev-surface rounded-lg p-6 text-center">
            <p className="text-[13px] text-ev-muted mb-2">{t('tax.ice')}</p>
            <p className="text-3xl font-bold text-ev-text">{formatted}</p>
            <p className="text-[13px] text-ev-muted mt-1">{t('tax.perYear')}</p>
          </div>
        </div>

        <p className="text-sm text-ev-muted mb-4">{t('tax.equalNote', { weight: vehicleWeightKg })}</p>

        <ProgressiveDisclosure summary={t('tax.masaQuestion')}>
          <p className="mb-2">{t('tax.masaExplainer')}</p>
          <p className="mb-2 font-medium text-ev-text">{t('tax.talonInstruction')}</p>
          <p className="text-ev-muted">{t('tax.talonHint')}</p>
        </ProgressiveDisclosure>
      </div>
    </section>
  )
}
```

### EV = ICE Road Tax — Moldova Legal Reality

In Moldova, the road tax (taxa pentru folosirea drumurilor) is calculated identically for EV and ICE vehicles using the same `masa totală autorizată` brackets. This is a key myth-busting fact for the app. Both values will always be equal for the same weight input — this is intentional and correct.

[Source: prd.md#FR10, moldova-ev-market-data.json#road_tax]

### Masa vs Masa Proprie Distinction

"Masa totală autorizată" ≠ "masa proprie" (unladen/curb weight):

- **Masa proprie** = empty vehicle weight (what's printed on car body specs)
- **Masa totală autorizată** = maximum permissible loaded mass (what's on the talon/registration certificate)

The road tax uses **masa totală autorizată** from the vehicle registration certificate (talon). Most users confuse these — the explainer must clarify this.

[Source: prd.md#FR11, FR12]

### i18n Keys to Add

```json
{
  "tax.sectionLabel": "Taxa drumurilor",
  "tax.sectionTitle": "EV vs benzină: aceeași taxă",
  "tax.ev": "Vehicul electric",
  "tax.ice": "Vehicul pe benzină",
  "tax.perYear": "pe an",
  "tax.equalNote": "Ambele vehicule de {{weight}} kg plătesc aceeași taxă în Moldova",
  "tax.masaQuestion": "Ce este masa totală autorizată?",
  "tax.masaExplainer": "Masa totală autorizată este greutatea maximă admisă a vehiculului complet încărcat — nu masa proprie (greutatea goală).",
  "tax.talonInstruction": "Găsește masa totală autorizată pe talonul mașinii (certificatul de înmatriculare).",
  "tax.talonHint": "Pe talon se numește «Masa totală maximă admisă» sau câmpul G."
}
```

### App.tsx Change

Replace the tax placeholder section in `App.tsx` with `<TaxSection />`. Remove the `<section id="tax">` wrapper from `App.tsx` since `TaxSection` now renders its own `<section id="tax">`.

> ⚠️ Make sure `App.tsx` no longer renders a separate `<section id="tax">` wrapper after wiring in `TaxSection` — otherwise there will be two elements with `id="tax"`.

### Project Structure Notes

Files created:

- `src/components/TaxSection.tsx`

Files modified:

- `src/App.tsx` — replace tax placeholder with `<TaxSection />`
- `src/locales/ro.json` — add `tax.*` keys
- `src/locales/en.json` — add `tax.*` keys

### References

- [Source: ux-design-specification.md#TaxComparison] — component spec
- [Source: ux-design-specification.md#ProgressiveDisclosure] — used for masa explainer
- [Source: prd.md#FR10–FR12] — road tax comparison, masa explainer, talon reference
- [Source: moldova-ev-market-data.json] — road tax bracket data
- [Source: epics.md#Story 4.2] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
