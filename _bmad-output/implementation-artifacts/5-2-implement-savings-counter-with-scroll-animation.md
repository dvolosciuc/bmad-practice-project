# Story 5.2: Implement SavingsCounter with Scroll Animation

Status: ready-for-dev

## Story

As a visitor,
I want to see a large animated number count up from zero to my savings total as I scroll to the Savings section,
so that the financial impact becomes a visceral, memorable event rather than a static figure.

## Acceptance Criteria

1. Counter animates from 0 to the monthly saving value over 1.2 seconds using `requestAnimationFrame` when the section enters the viewport.
2. Animation triggers once per page load — does not re-trigger on scroll-away/back.
3. When `prefers-reduced-motion: reduce` is set, the counter shows the final value immediately with no animation.
4. After animation completes, subsequent slider changes update the displayed value immediately (no re-animation).
5. `SavingsCounter` manages its own `IntersectionObserver` and `requestAnimationFrame` state internally.
6. Counter displays in display-scale typography (same as `LossHeadline`).
7. `npm run build` passes.

## Tasks / Subtasks

- [ ] Create `src/components/SavingsCounter.tsx` (AC: 1–6)
  - [ ] Props: `targetValue: number`
  - [ ] Implement `IntersectionObserver` to detect section entry
  - [ ] Implement `requestAnimationFrame` count-up over 1.2s
  - [ ] Check `prefers-reduced-motion` media query; skip animation if set
  - [ ] Track `hasAnimated` with `useRef` to prevent re-triggering
  - [ ] Format final value with `Intl.NumberFormat`
- [ ] Replace placeholder div in `SavingsSection.tsx` with `<SavingsCounter />` (AC: 1)
  - [ ] Pass `savingsResult.monthly` as `targetValue`
- [ ] Verify behaviour on slider change post-animation (AC: 4)

## Dev Notes

### SavingsCounter Full Implementation

```tsx
// src/components/SavingsCounter.tsx
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface SavingsCounterProps {
  targetValue: number
}

export default function SavingsCounter({ targetValue }: SavingsCounterProps) {
  const { t } = useTranslation()
  const [displayed, setDisplayed] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const animFrameRef = useRef<number>(0)

  const prefersReducedMotion =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

  const runAnimation = (target: number) => {
    if (prefersReducedMotion) {
      setDisplayed(target)
      return
    }
    const duration = 1200 // ms
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * target))
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }
    animFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          runAnimation(targetValue)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(animFrameRef.current)
    }
  }, []) // Run once on mount — intentional empty deps

  // After animation completes, keep in sync with targetValue changes
  useEffect(() => {
    if (hasAnimated.current) {
      setDisplayed(targetValue)
    }
  }, [targetValue])

  const formatted = new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: 'MDL',
    maximumFractionDigits: 0,
  }).format(displayed)

  return (
    <div ref={containerRef} className="text-center py-8">
      <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
        {t('savings.counterLabel')}
      </p>
      <p className="text-5xl lg:text-7xl font-extrabold text-ev-accent [font-variant-numeric:tabular-nums] leading-none">
        {formatted}
      </p>
      <p className="text-sm text-ev-muted mt-2">{t('savings.counterSuffix')}</p>
    </div>
  )
}
```

### Why Empty Deps Array on the First useEffect

The `IntersectionObserver` is set up once on mount and disconnects itself after firing. The `targetValue` at the time of animation is captured via closure when `runAnimation` is called. The second `useEffect` (with `[targetValue]` deps) handles subsequent prop changes after animation completes.

This is the intentional architecture — `SavingsCounter` is one of two stateful components in the app (with `StickyHeader`). [Source: architecture.md#Component Patterns]

### Easing Function

The `1 - Math.pow(1 - progress, 3)` formula is a cubic ease-out — fast start, slow finish. This makes the counter feel energetic then settle dramatically on the final value.

### prefers-reduced-motion

Check via `window.matchMedia` synchronously before running any animation. If reduced motion is preferred, call `setDisplayed(target)` directly. Do NOT defer this to a `useEffect` — the check must happen before the animation decision.

[Source: prd.md#NFR5 — prefers-reduced-motion respected for SavingsCounter]

### Slider Change After Animation

After `hasAnimated.current = true`, the second `useEffect` keeps `displayed` in sync with `targetValue`. The user sees the updated value immediately (no re-animation). This is correct behaviour per AC4.

### i18n Keys to Add

```json
{
  "savings.counterLabel": "Economii lunare",
  "savings.counterSuffix": "față de mașina actuală"
}
```

### Project Structure Notes

Files created:

- `src/components/SavingsCounter.tsx`

Files modified:

- `src/components/SavingsSection.tsx` — replace placeholder with `<SavingsCounter targetValue={savingsResult.monthly} />`
- `src/locales/ro.json`, `src/locales/en.json` — add counter keys

### References

- [Source: ux-design-specification.md#SavingsCounter] — IntersectionObserver + rAF, triggers once
- [Source: prd.md#FR14] — animated savings counter
- [Source: prd.md#NFR5] — prefers-reduced-motion
- [Source: architecture.md#Component Patterns] — stateful exception for SavingsCounter
- [Source: epics.md#Story 5.2] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
