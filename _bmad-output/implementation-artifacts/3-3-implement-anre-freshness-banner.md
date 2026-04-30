# Story 3.3: Implement AnreFreshnessBanner

Status: ready-for-dev

## Story

As a visitor,
I want a data freshness indicator that tells me whether fuel prices are live or from a cached fallback and when they were last verified,
so that I can trust the figures I'm seeing and understand their provenance.

## Acceptance Criteria

1. The banner displays in `fallback` state in V1: amber dot (`ev-warning`) + translated "Prețuri din cache: [lastVerified date]".
2. The banner never blocks content rendering — it appears inline, not as a modal or overlay.
3. The component accepts `status: 'live' | 'fallback'` and `lastVerified: string` props.
4. In `live` state, banner shows teal dot (`ev-accent`) + translated "Prețuri ANRE actualizate: [time]".
5. In `fallback` state, dot colour is `ev-warning: #f59e0b` (amber).
6. Banner text renders via `t('key')` with the date/time interpolated.
7. `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [ ] Create `src/components/AnreFreshnessBanner.tsx` (AC: 1–6)
  - [ ] Props: `status: 'live' | 'fallback'`, `lastVerified: string`
  - [ ] Render status dot + translated message
  - [ ] Apply correct dot colour per status
- [ ] Wire into `App.tsx` Hero section (AC: 2)
  - [ ] Pass `priceData.status` and `priceData.lastVerified` from App state
  - [ ] Place below `LossHeadline`, above `SliderGroup`
- [ ] Add i18n keys (AC: 6)
- [ ] Verify V1 always renders in fallback state (since `anreFetch.ts` always returns `'fallback'`)

## Dev Notes

### AnreFreshnessBanner Component

```tsx
// src/components/AnreFreshnessBanner.tsx
import { useTranslation } from 'react-i18next'

interface AnreFreshnessBannerProps {
  status: 'live' | 'fallback'
  lastVerified: string   // ISO date string or HH:MM time string
}

export default function AnreFreshnessBanner({ status, lastVerified }: AnreFreshnessBannerProps) {
  const { t } = useTranslation()
  const isLive = status === 'live'

  return (
    <div className="flex items-center gap-2 py-1">
      {/* Status dot */}
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          isLive ? 'bg-ev-accent' : 'bg-ev-warning'
        }`}
        aria-hidden="true"
      />
      <p className="text-[13px] text-ev-muted">
        {isLive
          ? t('anre.live', { time: lastVerified })
          : t('anre.fallback', { date: lastVerified })
        }
      </p>
    </div>
  )
}
```

### i18n Keys with Interpolation

```json
{
  "anre.live": "Prețuri ANRE actualizate: {{time}}",
  "anre.fallback": "Prețuri din cache: {{date}}"
}
```

react-i18next uses `{{variable}}` for interpolation in translation strings. [Source: react-i18next docs]

### V1 Behaviour

In V1, `anreFetch.ts` always returns `status: 'fallback'` and the `lastVerified` date from `anre.json`. The banner will always show the amber fallback state at launch. This is honest and intentional — users see the data source date, not false "live" claims.

[Source: architecture.md#ANRE Fetch Strategy — "intentionally honest: fallback banner always shown in V1"]

### Data Flow

```
anre.json → anreFetch.ts (stub) → App.tsx useState<PriceData> → AnreFreshnessBanner props
```

`priceData.lastVerified` is the date string from `anre.json` (e.g., `"2026-04-30"`). Format it for display:
```ts
const displayDate = new Intl.DateTimeFormat('ro-MD', { day: 'numeric', month: 'short', year: 'numeric' })
  .format(new Date(lastVerified))
// → "30 apr. 2026"
```
Do this formatting inside the component or pass a pre-formatted string from App.tsx.

### Hero Section Order

The Hero section now has:
1. `LossHeadline` (loss figure)
2. `AnreFreshnessBanner` (data source transparency)
3. `SliderGroup` (personalisation controls)

This order satisfies the UX spec requirement: number first, trust signal second, personalisation third.

[Source: ux-design-specification.md#Experience Mechanics]

### Project Structure Notes

Files created:
- `src/components/AnreFreshnessBanner.tsx`

Files modified:
- `src/App.tsx` — render `<AnreFreshnessBanner />` in Hero section
- `src/locales/ro.json` — add `anre.*` keys
- `src/locales/en.json` — add `anre.*` keys

### References

- [Source: ux-design-specification.md#AnreFreshnessBanner] — two states, dot colours
- [Source: ux-design-specification.md#Data State Patterns] — fallback state behaviour
- [Source: architecture.md#ANRE Fetch Strategy] — V1 always fallback
- [Source: prd.md#FR19, FR20] — ANRE fetch + fallback with last-verified date
- [Source: epics.md#Story 3.3] — acceptance criteria

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
