# Story 4.1: Implement ProgressiveDisclosure Component

Status: ready-for-dev

## Story

As a visitor,
I want expandable sections that reveal secondary detail on demand without a layout jump,
so that the primary information stays uncluttered and I can access deeper explanation when I need it.

## Acceptance Criteria

1. In collapsed state, only the summary/trigger text is visible; body content is hidden.
2. Clicking the trigger expands the body with a smooth `max-height` CSS transition — no layout jump.
3. Built on native `<details>` / `<summary>` elements — keyboard accessible (Enter/Space to toggle) by default.
4. Clicking again collapses smoothly.
5. Accepts `summary` (string) and `children` (ReactNode) props with no other dependencies.
6. `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [ ] Create `src/components/ProgressiveDisclosure.tsx` (AC: 1–6)
  - [ ] Props: `summary: string`, `children: React.ReactNode`
  - [ ] Use `<details>` / `<summary>` HTML elements
  - [ ] Apply smooth `max-height` transition via CSS (see Dev Notes)
  - [ ] Style summary trigger with chevron indicator
- [ ] Add CSS for smooth open/close transition (AC: 2, 4)
  - [ ] Add to `src/index.css` or use Tailwind arbitrary transitions

## Dev Notes

### Component Implementation

```tsx
// src/components/ProgressiveDisclosure.tsx
interface ProgressiveDisclosureProps {
  summary: string
  children: React.ReactNode
}

export default function ProgressiveDisclosure({ summary, children }: ProgressiveDisclosureProps) {
  return (
    <details className="group">
      <summary className="flex items-center gap-2 cursor-pointer list-none text-ev-muted text-sm font-medium py-2 hover:text-ev-text transition-colors">
        <span className="transition-transform duration-200 group-open:rotate-90">›</span>
        {summary}
      </summary>
      <div className="overflow-hidden">
        <div className="pt-3 pb-1 text-sm text-ev-muted leading-relaxed">
          {children}
        </div>
      </div>
    </details>
  )
}
```

### Smooth Transition Approach

CSS `max-height` animation on `<details>` content is tricky because the browser doesn't know the final height before opening. Two approaches:

**Option A (simplest — use for V1):** Accept a subtle jump with just `transition-colors` on the summary. The content appears/disappears instantly, but the chevron rotation is smooth. Acceptable for this use case.

**Option B (smooth):** Use `useRef` + `useState` to measure the content height and animate programmatically:
```tsx
const [open, setOpen] = useState(false)
const contentRef = useRef<HTMLDivElement>(null)
// ...
<div
  style={{ maxHeight: open ? contentRef.current?.scrollHeight + 'px' : '0' }}
  className="overflow-hidden transition-[max-height] duration-300 ease-out"
>
  <div ref={contentRef}>...</div>
</div>
```

Use Option A for V1 unless the smooth transition is important to Dumitru.

> The UX spec calls for "smooth `max-height` CSS transition — no layout jump" — Option B is preferred if implementation complexity is acceptable.

### `<details>` / `<summary>` Browser Support

Native `<details>` / `<summary>` is supported in all target browsers: Chrome, Safari, Firefox, Samsung Internet. No polyfill needed.

[Source: ux-design-specification.md#ProgressiveDisclosure component spec]

### Accessibility — Built-in

Native `<details>` / `<summary>` provides keyboard accessibility for free:
- `Tab` focuses the `<summary>` element
- `Enter` or `Space` toggles open/closed
- Screen readers announce the expanded/collapsed state via the `open` attribute

No additional ARIA attributes needed.

[Source: ux-design-specification.md#ProgressiveDisclosure — "keyboard accessible by default via native HTML behaviour"]

### Reusability

This component will be used in:
- Story 4.2: Tax section (masa explainer)
- Potentially other secondary content areas

Keep it fully generic — accept any `children`, no domain-specific props.

### Project Structure Notes

Files created:
- `src/components/ProgressiveDisclosure.tsx`

### References

- [Source: ux-design-specification.md#ProgressiveDisclosure] — native details/summary, smooth transition
- [Source: ux-design-specification.md#Feedback Patterns] — disclosure expanded state
- [Source: epics.md#Story 4.1] — acceptance criteria

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
