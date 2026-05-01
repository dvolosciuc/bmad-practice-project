# Story 2.4: Implement StickyHeader with Anchor Navigation

Status: ready-for-dev

## Story

As a visitor,
I want a sticky header with anchor links to all four content sections that transitions from transparent to solid on scroll,
so that I can jump directly to any section at any point in my reading.

## Acceptance Criteria

1. The header is sticky (`position: sticky; top: 0`) and always renders above section content (`z-index` above sections).
2. At scroll position 0px the header background is fully transparent.
3. When scrolled beyond 10px the header transitions to solid `ev-surface` background with `backdrop-filter: blur(12px)`.
4. The header contains four anchor links with Romanian labels via `t()`: Charging · Tax · Savings · CO₂.
5. Clicking an anchor link scrolls smoothly to the target section with an 80px offset to clear the sticky header.
6. On viewports below 768px, all four anchor links fit in one compact row — no hamburger menu required.
7. The active section is highlighted in the header as the user scrolls (via `IntersectionObserver`).
8. `LanguageSwitcher` placeholder is present in the header (will be wired in Story 6.1).

## Tasks / Subtasks

- [ ] Create `src/components/StickyHeader.tsx` (AC: 1–8)
  - [ ] Implement scroll listener using `useEffect` + `useState` for `.scrolled` class
  - [ ] Apply `sticky top-0 z-50` Tailwind classes
  - [ ] Apply conditional `bg-ev-surface/90 backdrop-blur-md` class when scrolled
  - [ ] Render four `<a>` anchor links with 80px scroll offset (see Dev Notes)
  - [ ] Implement `IntersectionObserver` for active section highlight
  - [ ] Add `LanguageSwitcher` placeholder `<div>` (replaced in Story 6.1)
- [ ] Wire `StickyHeader` into `App.tsx` (AC: 1)
  - [ ] Import and render `<StickyHeader />` as the first element inside the root `<div>` in `App.tsx`
- [ ] Add `scroll-behavior: smooth` to `index.css` global base styles (AC: 5)
- [ ] Verify on mobile viewport 360px (AC: 6)

## Dev Notes

### Scroll-Triggered Class Toggle

```tsx
// src/components/StickyHeader.tsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function StickyHeader() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ev-surface/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[720px] mx-auto px-6 py-3 flex items-center justify-between">
        <nav className="flex gap-4 text-sm font-medium">
          <a href="#charging" onClick={scrollWithOffset} className="text-ev-muted hover:text-ev-text transition-colors">
            {t('nav.charging')}
          </a>
          {/* repeat for tax, savings, co2 */}
        </nav>
        {/* LanguageSwitcher placeholder — wired in Story 6.1 */}
        <div className="w-16 h-6 bg-ev-surface-2 rounded opacity-30" aria-hidden="true" />
      </div>
    </header>
  )
}
```

### 80px Scroll Offset Pattern

CSS `scroll-behavior: smooth` handles smooth scrolling but does not apply an offset for the sticky header. Use a click handler:

```ts
function scrollWithOffset(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  const href = e.currentTarget.getAttribute('href')
  if (!href) return
  const target = document.querySelector(href)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top, behavior: 'smooth' })
}
```

Apply this handler to all four anchor links.

### Active Section Highlight via IntersectionObserver

```ts
useEffect(() => {
  const sections = document.querySelectorAll('section[id]')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id)
      })
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
  )
  sections.forEach((s) => observer.observe(s))
  return () => observer.disconnect()
}, [])
```

Active link gets `text-ev-accent` class; inactive gets `text-ev-muted`.

### Mobile Compact Row (360px)

Four short labels ("Încărcare", "Taxe", "Economii", "CO₂") fit in one flex row at 360px viewport with `gap-4 text-sm`. Do NOT add a hamburger/drawer — the UX spec explicitly says no hamburger needed. If labels wrap, reduce gap or use `text-xs`.

[Source: ux-design-specification.md#StickyHeader component spec, ux-design-specification.md#Responsive Strategy]

### i18n Keys for Nav Links

Add these to `ro.json` and `en.json` (and document for Story 6.2):

```json
{
  "nav.charging": "Încărcare",
  "nav.tax": "Taxe",
  "nav.savings": "Economii",
  "nav.co2": "CO₂"
}
```

### scroll-behavior in index.css

```css
@layer base {
  html {
    scroll-behavior: smooth;
  }
}
```

### Component Rules

- `StickyHeader` is one of two stateful components (manages its own scroll listener and active section state)
- All other section components are stateless presentational — they receive props from `App.tsx`
- The LanguageSwitcher placeholder `<div>` MUST be replaced in Story 6.1 — do not skip it

[Source: architecture.md#Component Patterns]

### Project Structure Notes

Files created:

- `src/components/StickyHeader.tsx` (new)

Files modified:

- `src/App.tsx` — import and render `<StickyHeader />`
- `src/index.css` — add `scroll-behavior: smooth`
- `src/locales/ro.json` — add `nav.*` keys
- `src/locales/en.json` — add `nav.*` keys

### References

- [Source: ux-design-specification.md#StickyHeader] — component spec, scroll behaviour
- [Source: ux-design-specification.md#Navigation Patterns] — 80px offset, smooth scroll
- [Source: architecture.md#Component Patterns] — stateful exception for StickyHeader
- [Source: epics.md#Story 2.4] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
