# Story 5.3: Implement NextStepsCTA and CO₂ Section

Status: ready-for-dev

## Story

As Ion (a visitor who has seen the savings),
I want clear, frictionless next-step actions at the end of the page with a CO₂ trees figure above,
so that I can immediately act on what I've learned without searching for where to go next.

## Acceptance Criteria

1. Primary CTA buttons for EVPoint App Store (iOS) and Play Store (Android) display with correct deep-link URLs.
2. CTA buttons use primary style: `ev-accent` background, `ev-bg` text, 8px border-radius, min-height 48px.
3. All text via `t('key')`.
4. Next Steps section has `id="next-steps"`.
5. CO₂ section renders above Next Steps showing trees-equivalent from `calcCO2()`.
6. CO₂ section has `id="co2"` for anchor navigation.
7. If CO₂ figure is zero/near-zero, section still renders without showing negative values.
8. CO₂ value updates within 100ms when slider changes.
9. `npm run build` passes.

## Tasks / Subtasks

- [ ] Create `src/components/CO2Section.tsx` (AC: 5–8)
  - [ ] Props: `co2AnnualKg: number`
  - [ ] Compute trees equivalent (1 tree ≈ 21.7 kg CO₂/year)
  - [ ] Render trees count with section label, `id="co2"`
  - [ ] Handle zero case gracefully
- [ ] Create `src/components/NextStepsSection.tsx` (AC: 1–4)
  - [ ] Render EVPoint App Store + Play Store buttons
  - [ ] Apply primary button styles + min-height 48px
  - [ ] Apply `id="next-steps"` + `rel="noopener noreferrer"`
- [ ] Wire both into `App.tsx` (AC: 8)
  - [ ] Pass `co2Annual` to `<CO2Section />`
  - [ ] Render `<NextStepsSection />`
- [ ] Add i18n keys (AC: 3)

## Dev Notes

### CO₂ to Trees Conversion

```ts
const TREES_PER_KG_CO2_PER_YEAR = 1 / 21.7 // 1 tree absorbs ~21.7 kg CO₂/year (IPCC estimate)
const treesPerYear = Math.max(0, Math.round(co2AnnualKg * TREES_PER_KG_CO2_PER_YEAR))
```

Display: "Echivalent cu X copaci plantați pe an"

If `co2AnnualKg === 0` or `treesPerYear === 0`, show a graceful fallback: "Impact CO₂ minim la acest profil" — never show "0 copaci" or a negative value.

[Source: prd.md#FR17]

### CO2Section Component

```tsx
// src/components/CO2Section.tsx
import { useTranslation } from 'react-i18next'

interface CO2SectionProps {
  co2AnnualKg: number
}

export default function CO2Section({ co2AnnualKg }: CO2SectionProps) {
  const { t } = useTranslation()
  const trees = Math.max(0, Math.round(co2AnnualKg / 21.7))

  return (
    <section id="co2" className="py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('co2.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-4">{t('co2.sectionTitle')}</h2>
        {trees > 0 ? (
          <p className="text-2xl text-ev-text">{t('co2.treesEquivalent', { count: trees })}</p>
        ) : (
          <p className="text-ev-muted">{t('co2.negligible')}</p>
        )}
      </div>
    </section>
  )
}
```

### NextStepsSection Component

```tsx
// src/components/NextStepsSection.tsx
import { useTranslation } from 'react-i18next'

// Deep-link URLs — verify from moldova-ev-market-data.json or EVPoint website
const EVPOINT_APP_STORE = 'https://apps.apple.com/md/app/evpoint/id...'
const EVPOINT_PLAY_STORE = 'https://play.google.com/store/apps/details?id=...'

export default function NextStepsSection() {
  const { t } = useTranslation()
  return (
    <section id="next-steps" className="py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('nextSteps.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('nextSteps.sectionTitle')}</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={EVPOINT_APP_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-3 bg-ev-accent text-ev-bg rounded-lg font-semibold min-h-[48px] hover:bg-ev-accent-hover transition-colors"
          >
            {t('nextSteps.appStore')}
          </a>
          <a
            href={EVPOINT_PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-3 bg-ev-accent text-ev-bg rounded-lg font-semibold min-h-[48px] hover:bg-ev-accent-hover transition-colors"
          >
            {t('nextSteps.playStore')}
          </a>
        </div>
      </div>
    </section>
  )
}
```

### External Link Security

All external links MUST have `rel="noopener noreferrer"` to prevent tab-napping. [OWASP: DOM-based XSS / window.opener attacks]

### EVPoint App Store URLs

Verify the actual App Store and Play Store URLs from `moldova-ev-market-data.json` or the EVPoint website. The placeholder URLs in this file are illustrative.

### i18n Keys to Add

```json
{
  "co2.sectionLabel": "Impactul asupra mediului",
  "co2.sectionTitle": "Amprentă de carbon redusă",
  "co2.treesEquivalent": "Echivalent cu {{count}} copaci plantați pe an",
  "co2.negligible": "Impact CO₂ minim la acest profil",
  "nextSteps.sectionLabel": "Ce urmează",
  "nextSteps.sectionTitle": "Începe tranziția azi",
  "nextSteps.appStore": "Descarcă EVPoint pe iOS",
  "nextSteps.playStore": "Descarcă EVPoint pe Android"
}
```

### Project Structure Notes

Files created:

- `src/components/CO2Section.tsx`
- `src/components/NextStepsSection.tsx`

Files modified:

- `src/App.tsx` — wire both sections, pass `co2Annual`
- `src/locales/ro.json`, `src/locales/en.json` — add co2 and nextSteps keys

### References

- [Source: ux-design-specification.md#NextStepsCTA] — primary button style, min-height 48px
- [Source: ux-design-specification.md#CO2Visual] — trees metaphor
- [Source: prd.md#FR17, FR18] — CO₂ trees, App Store CTAs
- [Source: epics.md#Story 5.3] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
