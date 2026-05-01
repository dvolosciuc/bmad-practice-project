# Story 6.1: Implement LanguageSwitcher Component

Status: ready-for-dev

## Story

As a visitor,
I want to switch the app language between Romanian and English using a clear UI control in the header,
so that I can read all content in my preferred language.

## Acceptance Criteria

1. Language switcher shows RO and EN as active options.
2. RU appears as a disabled option with label "RU (în curând)".
3. Selecting a language calls `i18next.changeLanguage(lang)`, saves to `localStorage['lang']`, and updates `document.documentElement.lang`.
4. Active language is visually distinct from inactive options.
5. Component has `role="combobox"` and `aria-live="polite"` region for screen reader announcement.
6. Component replaces the placeholder `<div>` in `StickyHeader` from Story 2.4.
7. On next page load, the persisted language from `localStorage` is correctly restored by `i18next-browser-languagedetector`.
8. `npm run build` passes.

## Tasks / Subtasks

- [ ] Create `src/components/LanguageSwitcher.tsx` (AC: 1–5)
  - [ ] Render RO / EN buttons and disabled RU
  - [ ] On click: call `i18next.changeLanguage`, set localStorage, update `document.documentElement.lang`
  - [ ] Apply active/inactive visual styles
  - [ ] Apply ARIA attributes
- [ ] Wire into `StickyHeader.tsx` (AC: 6)
  - [ ] Replace `{/* LanguageSwitcher placeholder */}` div with `<LanguageSwitcher />`
- [ ] Verify i18n persistence on reload (AC: 7)

## Dev Notes

### LanguageSwitcher Component

```tsx
// src/components/LanguageSwitcher.tsx
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const LANGUAGES = [
  { code: 'ro', label: 'RO', disabled: false },
  { code: 'en', label: 'EN', disabled: false },
  { code: 'ru', label: 'RU', disabled: true, note: '(în curând)' },
] as const

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.split('-')[0] ?? 'ro'

  const handleChange = (lang: string) => {
    i18next.changeLanguage(lang)
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }

  return (
    <div role="combobox" aria-label="Select language" className="flex items-center gap-1">
      <span aria-live="polite" className="sr-only">
        Language changed to {current}
      </span>
      {LANGUAGES.map(({ code, label, disabled, note }) => (
        <button
          key={code}
          onClick={() => !disabled && handleChange(code)}
          disabled={disabled}
          aria-pressed={current === code}
          className={`
            px-2 py-1 text-sm font-medium rounded transition-colors
            ${
              current === code
                ? 'bg-ev-accent text-ev-bg'
                : disabled
                  ? 'text-ev-muted cursor-not-allowed opacity-50'
                  : 'text-ev-muted hover:text-ev-text'
            }
          `}
        >
          {label}
          {note && <span className="text-xs ml-0.5 text-ev-muted">{note}</span>}
        </button>
      ))}
    </div>
  )
}
```

### i18n Language Detection

`i18next-browser-languagedetector` is configured in `src/i18n.ts` with `detection.lookupLocalStorage: 'lang'`. When the user picks a language and it's stored at `localStorage['lang']`, the next page load will automatically restore it. No manual restoration code is needed.

[Source: architecture.md#i18n config — `i18next-browser-languagedetector` with `lookupLocalStorage: 'lang'`]

### StickyHeader Wiring

Locate the placeholder comment in `StickyHeader.tsx` from Story 2.4:

```tsx
{
  /* LanguageSwitcher placeholder — replaced in Story 6.1 */
}
;<div className="w-16" />
```

Replace with:

```tsx
<LanguageSwitcher />
```

### aria-live Region

The `aria-live="polite"` span with `className="sr-only"` announces language changes to screen readers. The content should update when language changes — React handles this via the `current` variable already in state.

### role="combobox" Note

`role="combobox"` is applied to the wrapper `<div>`. This is a simplification; a full implementation would also add `aria-expanded`, `aria-controls`, etc. For V1, this level of ARIA is acceptable per the accessibility budget defined in architecture.md.

### Project Structure Notes

Files created:

- `src/components/LanguageSwitcher.tsx`

Files modified:

- `src/components/StickyHeader.tsx` — replace placeholder with `<LanguageSwitcher />`

### References

- [Source: ux-design-specification.md#LanguageSwitcher] — RO/EN active, RU disabled
- [Source: prd.md#FR22, FR23] — language switcher, localStorage persistence
- [Source: architecture.md#i18n] — i18next-browser-languagedetector config
- [Source: epics.md#Story 6.1] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
