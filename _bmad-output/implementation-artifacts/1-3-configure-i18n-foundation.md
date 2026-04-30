# Story 1.3: Configure i18n Foundation

Status: ready-for-dev

## Story

As a developer,
I want `react-i18next` initialised with RO (default) and EN locale files, language detection from `localStorage`, and RU as an empty stub,
so that every component can call `t('key')` and language preference persists across return visits.

## Acceptance Criteria

1. `src/i18n.ts` initialises i18next with `i18next-browser-languagedetector`, fallback language `ro`, and loads both `ro.json` and `en.json`.
2. `src/locales/ro.json` and `src/locales/en.json` each contain at least one sample key: `{ "app.title": "Moldova EV Overview" }` / `{ "app.title": "Moldova EV Overview" }`.
3. `src/locales/ru.json` exists as an empty object `{}`.
4. Language preference is stored in and read from `localStorage` key `lang`.
5. `App.tsx` imports `./i18n` at the top (side-effect import) so i18next is initialised before any component renders.
6. The sample `app.title` key renders correctly via `t('app.title')` in `App.tsx` in the browser.
7. Calling `i18next.changeLanguage('en')` in the browser console switches the displayed language without a page reload.
8. `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [ ] Create locale files (AC: 2, 3)
  - [ ] Create `src/locales/ro.json` with `{ "app.title": "Moldova EV Overview" }`
  - [ ] Create `src/locales/en.json` with `{ "app.title": "Moldova EV Overview" }`
  - [ ] Create `src/locales/ru.json` with `{}`
- [ ] Create `src/i18n.ts` (AC: 1, 4)
  - [ ] Import `i18next`, `{ initReactI18next }` from `react-i18next`, `LanguageDetector` from `i18next-browser-languagedetector`
  - [ ] Import `ro` from `./locales/ro.json` and `en` from `./locales/en.json`
  - [ ] Call `i18next.use(LanguageDetector).use(initReactI18next).init({...})` — see Dev Notes for full config
  - [ ] Set `detection.lookupLocalStorage: 'lang'` and `detection.order: ['localStorage', 'navigator']`
  - [ ] Set `fallbackLng: 'ro'`, `interpolation: { escapeValue: false }`
- [ ] Wire i18n into app (AC: 5, 6, 7)
  - [ ] In `src/main.tsx`, add `import './i18n'` before the React root render call
  - [ ] Update `App.tsx` to call `const { t } = useTranslation()` and render `{t('app.title')}` as a visible heading
  - [ ] Verify in browser that the heading renders "Moldova EV Overview" and not the raw key
  - [ ] Verify `i18next.changeLanguage('en')` in console switches language without reload
- [ ] Verify build (AC: 8)
  - [ ] Run `npm run build` — confirm zero TypeScript errors

## Dev Notes

### i18n Initialisation — Full Config

```ts
// src/i18n.ts
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ro from './locales/ro.json'
import en from './locales/en.json'

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ro: { translation: ro },
      en: { translation: en },
    },
    fallbackLng: 'ro',
    supportedLngs: ['ro', 'en', 'ru'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
  })

export default i18next
```

> ⚠️ `ru` is listed in `supportedLngs` so `i18next.changeLanguage('ru')` does not throw — but no `ru` resource is loaded. i18next silently falls back to `ro` for all missing RU keys. This is the intended V1 behaviour. [Source: architecture.md#i18n Architecture]

### Import Order in main.tsx — CRITICAL

```tsx
// src/main.tsx
import './i18n'           // MUST be first — initialises i18next before React tree mounts
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

If `./i18n` is imported after the React root, components may render before translations are loaded and show raw keys.

### locale Key Naming Convention

All i18n keys follow `section.element` dot-notation camelCase:
- `hero.lossLabel`, `hero.lossUnit`
- `charging.sectionTitle`, `charging.lastVerified`
- `tax.sectionTitle`, `tax.masaExplainer`
- `savings.monthly`, `savings.annual`, `savings.fiveYear`
- `nav.charging`, `nav.tax`, `nav.savings`, `nav.co2`

The sample key `app.title` is a temporary placeholder — it will be replaced by the full key set in Story 6.2. Do NOT attempt to add all keys in this story — only the sample key needed to verify AC 6.

[Source: architecture.md#Naming Conventions, epics.md#Story 6.2]

### TypeScript JSON Import

With Vite's default TypeScript config, importing JSON files (`import ro from './locales/ro.json'`) works out of the box — Vite handles JSON as ES modules. No `resolveJsonModule` tsconfig flag needed (Vite handles this natively).

### RU Locale — Empty Object

`ru.json` must be `{}` (empty object), not `null` or an empty file. i18next expects a valid JSON object as a resource namespace. An empty file or `null` will throw a parse error.

[Source: architecture.md#i18n Architecture — "ru.json empty at v1 launch"]

### What This Story Does NOT Do

- Does NOT add all production i18n keys — that is Story 6.2
- Does NOT implement the `LanguageSwitcher` UI component — that is Story 6.1
- Does NOT update `document.documentElement.lang` on language change — that is Story 6.1

### Project Structure Notes

Files created in this story:
- `src/i18n.ts` (new)
- `src/locales/ro.json` (new — replaces `.gitkeep`)
- `src/locales/en.json` (new — replaces `.gitkeep`)
- `src/locales/ru.json` (new — replaces `.gitkeep`)

Files modified:
- `src/main.tsx` — add `import './i18n'` at top
- `src/App.tsx` — add `useTranslation` usage for smoke-test

### References

- [Source: architecture.md#i18n Architecture] — library choice, localStorage key `lang`, fallback strategy
- [Source: architecture.md#Naming Conventions] — i18n key naming pattern
- [Source: architecture.md#Implementation Patterns] — all strings through `t('key')`, zero hardcoded JSX strings
- [Source: epics.md#Story 1.3] — acceptance criteria
- [Source: epics.md#Story 6.2] — full locale file completion (future story, do not implement now)

## Dev Agent Record

### Agent Model Used

_to be filled on implementation_

### Debug Log References

### Completion Notes List

### File List

_to be filled on implementation_
