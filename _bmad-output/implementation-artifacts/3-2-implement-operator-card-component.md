# Story 3.2: Implement OperatorCard Component

Status: ready-for-dev

## Story

As a visitor,
I want to see EVPoint's charging tariffs in a regional breakdown card and placeholder cards for other operators directing me to their apps,
so that I can find real Moldova charging costs and know where to get tariffs for operators that don't publish them publicly.

## Acceptance Criteria

1. EVPoint renders as a `full` variant card: regional tariff table with Centru/Sud and Nord rows, AC and DC columns, prices in MDL/kWh, `lastVerified` date visible.
2. eCharge, ekofactor, eco drive, and go to-u render as `placeholder` cards: operator name, translated "tariff not publicly listed" message, and a link to the operator's app.
3. EVPoint's card includes App Store and Play Store CTA buttons.
4. All card text renders via `t('key')` — no hardcoded strings in JSX.
5. Each card shows `lastVerified` date in `small` typography (`text-[13px] text-ev-muted`).
6. The Charging section has `id="charging"` for anchor navigation.
7. `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [ ] Create `src/components/OperatorCard.tsx` (AC: 1–5)
  - [ ] Props: `operator: OperatorData`
  - [ ] Implement `full` variant: tariff table (rows = regions, cols = AC/DC) + App Store buttons
  - [ ] Implement `placeholder` variant: name + message + app link button
  - [ ] Apply `bg-ev-surface rounded-lg p-6` card styling
  - [ ] Show `lastVerified` in small muted text
- [ ] Create `src/components/ChargingSection.tsx` (AC: 6)
  - [ ] Props: `operators: OperatorData[]`
  - [ ] Section label + title + list of `<OperatorCard />`
  - [ ] Wrap with `id="charging"` section div
- [ ] Wire `ChargingSection` into `App.tsx` (AC: 1–7)
  - [ ] Import typed `operators` from Story 3.1
  - [ ] Replace charging section placeholder with `<ChargingSection operators={operators} />`
- [ ] Add i18n keys (AC: 4)
- [ ] Verify build (AC: 7)

## Dev Notes

### OperatorCard Full Variant

```tsx
// Full variant (EVPoint)
function FullCard({ operator }: { operator: OperatorData }) {
  const { t } = useTranslation()
  return (
    <div className="bg-ev-surface rounded-lg p-6">
      <h3 className="text-2xl font-semibold text-ev-text mb-4">{operator.name}</h3>
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-ev-muted text-[13px] uppercase tracking-wider">
            <th className="text-left py-1">{t('charging.region')}</th>
            <th className="text-right py-1">AC (MDL/kWh)</th>
            <th className="text-right py-1">DC (MDL/kWh)</th>
          </tr>
        </thead>
        <tbody>
          {operator.tariffs?.map(tariff => (
            <tr key={tariff.region} className="border-t border-ev-surface-2">
              <td className="py-2 text-ev-text">{t(`charging.region.${tariff.region}`)}</td>
              <td className="py-2 text-right text-ev-accent font-medium">{tariff.acFromMDL}</td>
              <td className="py-2 text-right text-ev-accent font-medium">{tariff.dcFromMDL}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[13px] text-ev-muted mb-4">
        {t('charging.lastVerified')}: {operator.lastVerified}
      </p>
      <div className="flex gap-3">
        {operator.appStoreUrl && (
          <a href={operator.appStoreUrl} target="_blank" rel="noopener noreferrer"
             className="px-4 py-2 bg-ev-accent text-ev-bg rounded-lg text-sm font-medium min-h-[44px] flex items-center">
            {t('charging.appStore')}
          </a>
        )}
        {operator.playStoreUrl && (
          <a href={operator.playStoreUrl} target="_blank" rel="noopener noreferrer"
             className="px-4 py-2 bg-ev-accent text-ev-bg rounded-lg text-sm font-medium min-h-[44px] flex items-center">
            {t('charging.playStore')}
          </a>
        )}
      </div>
    </div>
  )
}
```

### OperatorCard Placeholder Variant

```tsx
function PlaceholderCard({ operator }: { operator: OperatorData }) {
  const { t } = useTranslation()
  return (
    <div className="bg-ev-surface rounded-lg p-6 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-ev-text">{operator.name}</h3>
        <p className="text-[13px] text-ev-muted mt-1">{t('charging.tariffNotListed')}</p>
        <p className="text-[13px] text-ev-muted">{t('charging.lastVerified')}: {operator.lastVerified}</p>
      </div>
      {operator.appUrl && (
        <a href={operator.appUrl} target="_blank" rel="noopener noreferrer"
           className="px-4 py-2 border border-ev-accent text-ev-accent rounded-lg text-sm font-medium min-h-[44px] flex items-center">
          {t('charging.seeApp')}
        </a>
      )}
    </div>
  )
}

export default function OperatorCard({ operator }: { operator: OperatorData }) {
  return operator.variant === 'full'
    ? <FullCard operator={operator} />
    : <PlaceholderCard operator={operator} />
}
```

### i18n Keys to Add

```json
{
  "charging.sectionLabel": "Operatori de încărcare",
  "charging.sectionTitle": "Tarife de încărcare în Moldova",
  "charging.region": "Regiune",
  "charging.region.centru_sud": "Centru / Sud",
  "charging.region.nord": "Nord",
  "charging.lastVerified": "Verificat ultima dată",
  "charging.tariffNotListed": "Tariful nu este publicat — vezi aplicația",
  "charging.appStore": "App Store",
  "charging.playStore": "Play Store",
  "charging.seeApp": "Vezi aplicația"
}
```

### Section Label Pattern

All sections use the same label pattern:
```tsx
<p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
  {t('charging.sectionLabel')}
</p>
<h2 className="text-4xl font-bold text-ev-text mb-8">{t('charging.sectionTitle')}</h2>
```

[Source: ux-design-specification.md#UX Consistency Patterns — section label pattern]

### External Link Security

All external links must have `target="_blank"` AND `rel="noopener noreferrer"` to prevent tab-napping attacks. This is a security requirement. [OWASP: Unvalidated Redirects]

### Project Structure Notes

Files created:
- `src/components/OperatorCard.tsx`
- `src/components/ChargingSection.tsx`

Files modified:
- `src/App.tsx` — replace charging placeholder with `<ChargingSection />`
- `src/locales/ro.json` — add charging keys
- `src/locales/en.json` — add charging keys

### References

- [Source: ux-design-specification.md#OperatorCard] — full/placeholder variants, lastVerified
- [Source: prd.md#FR7–FR9] — EVPoint tariffs, secondary operators, App Store links
- [Source: architecture.md#Component Patterns] — stateless, props from App
- [Source: epics.md#Story 3.2] — acceptance criteria

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
