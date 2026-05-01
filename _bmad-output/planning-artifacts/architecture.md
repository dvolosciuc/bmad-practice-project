---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: complete
completedAt: '2026-04-30'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/moldova-ev-market-data.json
  - _bmad-output/brainstorming/brainstorming-session-2026-04-29-1.md
workflowType: 'architecture'
project_name: 'Moldova EV Overview'
user_name: 'Dumitru.volosciuc'
date: '2026-04-30'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Functional Scope

- Client-side ANRE fuel price fetch on mount (3s timeout + hardcoded fallback)
- Live slider recalculation engine — pure functions, zero server calls
- Full i18n: RO (default) + EN at launch; RU in v2
- Static operator tariff data bundled as `src/data/operators.json`
- Animated savings counter driven by `IntersectionObserver`
- App Store / Play Store deep links (EVPoint)
- Single-page anchor navigation — no client-side routing
- `localStorage` for language preference persistence

### Critical Non-Functional Requirements

| NFR                                | Target                                       |
| ---------------------------------- | -------------------------------------------- |
| First Contentful Paint (4G mobile) | < 1.5s                                       |
| Time to Interactive                | < 2s                                         |
| Total JS bundle (gzipped)          | < 150KB                                      |
| ANRE fetch timeout                 | 3s — fallback activates silently             |
| Deployment                         | Fully static — zero server-side dependencies |

### Unique Technical Challenges

1. **ANRE live fetch** — client-side parsing of a third-party government HTML page (CORS implications, parse fragility, silent fallback required)
2. **i18n architecture** — full page re-render on language switch without React Router
3. **Slider-triggered recalculation** — must feel instantaneous (no debounce; pure function recalc on every `onChange`)
4. **Animated counter** — `IntersectionObserver` + `requestAnimationFrame`; `prefers-reduced-motion` respected minimally

### Project Scale

- Complexity: Low-Medium
- Domain: React SPA / frontend-only / static deploy
- Accessibility: Basic only (colour contrast + keyboard nav — full WCAG compliance deprioritised)

## Starter Template

### Primary Technology Domain

React SPA — static site, no SSR, no backend, Vite build tooling.

### Selected Starter: `create vite@latest` — `react-ts` template

**Initialization Command:**

```bash
npm create vite@latest moldova-ev-overview -- --template react-ts
cd moldova-ev-overview
npm install
```

**Rationale:**

- The PRD specifies Vite + React explicitly
- `react-ts` template provides TypeScript out of the box — type safety on operator JSON shapes and i18n keys
- Zero framework overhead (no Next.js SSR, no routing): output is a pure static `dist/` folder
- Smallest possible footprint; aligns with <150KB bundle target
- First-party Vite support; actively maintained (Vite 6+, Node.js 20.19+ required)
- Netlify and GitHub Pages both have native Vite static deploy support

**Architectural Decisions Provided by Starter:**

| Area        | Decision                      |
| ----------- | ----------------------------- |
| Language    | TypeScript (strict mode)      |
| Build tool  | Vite (Rolldown bundler)       |
| Dev server  | Vite HMR                      |
| JSX         | React 19+                     |
| Entry point | `index.html` → `src/main.tsx` |
| Output      | Static `dist/` folder         |
| Scripts     | `dev` · `build` · `preview`   |

**Additional dependencies to install post-scaffold:**

```bash
npm install -D tailwindcss @tailwindcss/vite
npm install react-i18next i18next
```

## Core Architectural Decisions

### State Management

Single `useState` object at `<App />` level. No Redux, no Zustand.

```ts
// App.tsx
const [inputs, setInputs] = useState<InputState>({
  kmPerMonth: 1200,
  fuelType: 'benzina95',
  vehicleWeightKg: 1400,
  chargingMode: 'public_ac',
  region: 'centru_sud',
})
```

All derived values (monthly savings, annual savings, tax delta, CO₂) are computed as pure functions called inline during render — no `useEffect`, no derived state store. Language is the only persistent state, managed via `i18next` + `localStorage`.

### i18n Architecture

**Library:** `react-i18next` + `i18next` + `i18next-browser-languagedetector`

- Locale files: `src/locales/ro.json`, `src/locales/en.json`, `src/locales/ru.json` (ru empty at v1 launch)
- Initialised in `src/i18n.ts`; language persisted in `localStorage`
- `i18next.changeLanguage(lang)` triggers full React tree re-render via context — no page reload, no partial state

### ANRE Fetch Strategy

**V1: Hardcoded fallback only.** Direct client-side fetch of `anre.md` will be blocked by CORS in production. V1 ships with `src/data/anre.json` (hardcoded prices + `lastVerified` date) and always displays the fallback banner.

**V2: GitHub Actions scheduled fetch** → writes `src/data/anre.json` → commits → triggers Netlify deploy. No runtime backend required.

This is intentionally honest: the fallback banner is always shown in V1 with a clear last-verified date. Users are never misled.

### Deployment

**Platform: Netlify**

- Auto-deploy on push to `main`
- `netlify.toml`: `build.command = "npm run build"`, `build.publish = "dist"`
- PR preview deploys for tariff update review (Andrei's journey)
- Free tier sufficient

### Project Structure

```
src/
  components/         # One file per component, PascalCase
  data/
    operators.json    # Static operator tariffs (version-controlled)
    anre.json         # Hardcoded ANRE fallback + lastVerified date
    roadTax.ts        # Road tax bracket table as typed const
  locales/
    ro.json
    en.json
    ru.json           # Empty at v1 launch
  lib/
    calculations.ts   # Pure calculation functions — no React imports
    anreFetch.ts      # ANRE fetch + timeout logic (v2)
  i18n.ts             # i18next initialisation
  App.tsx             # Top-level state + layout shell
  main.tsx            # React root mount
```

## Implementation Patterns & Consistency Rules

### Naming Conventions

| Category            | Convention                                              | Example                                   |
| ------------------- | ------------------------------------------------------- | ----------------------------------------- |
| Component files     | PascalCase `.tsx`                                       | `LossHeadline.tsx`, `OperatorCard.tsx`    |
| Utility / lib files | camelCase `.ts`                                         | `calculations.ts`, `anreFetch.ts`         |
| Styling             | Tailwind classes only — no CSS modules, no `.css` files | `className="text-ev-accent font-bold"`    |
| i18n keys           | `section.element` dot notation, camelCase               | `hero.lossLabel`, `charging.lastVerified` |
| JSON data keys      | camelCase                                               | `lastVerified`, `acFromMDL`, `dcFromMDL`  |
| Props interfaces    | `ComponentNameProps` suffix                             | `OperatorCardProps`, `SliderInputProps`   |
| Event handlers      | `handle` prefix                                         | `handleKmChange`, `handleFuelTypeChange`  |
| Pure functions      | verb + noun                                             | `calculateMonthlySavings`, `getRoadTax`   |

### Component Patterns

- All section components are **stateless/presentational** — receive `inputs` and derived values as props; never call `useState` internally
- Exceptions: `StickyHeader` (manages scroll listener), `SavingsCounter` (manages animation frame)
- One named export per file — no barrel `index.ts` re-exports in `components/`
- No `style={{}}` inline styles — all styling via Tailwind utility classes
- All UI string literals go through `t('key')` — never hardcoded in JSX

### Calculation Layer Rules

- `src/lib/calculations.ts` contains **pure functions only** — no React imports, no side effects
- All functions take explicit typed parameters; never read from global state or module-level variables
- Data constants (`operators.json`, `roadTax.ts`) are imported only in `App.tsx` and passed down as props
- Signature pattern: `calculateMonthlySavings(inputs: InputState, prices: PriceData): SavingsResult`

### Shared Type Contract

All shared types live in `src/lib/types.ts` — single source of truth:

```ts
type FuelType = 'benzina95' | 'motorina' | 'gpl'
type Region = 'centru_sud' | 'nord'
type ChargingMode = 'public_ac' | 'public_dc'

interface InputState {
  kmPerMonth: number // 300–3000
  fuelType: FuelType
  vehicleWeightKg: number // 500–5000
  chargingMode: ChargingMode
  region: Region
}

interface SavingsResult {
  monthly: number
  annual: number
  fiveYear: number
  breakEvenMonths: number | null
}
```

### Error / Fallback Patterns

- ANRE fetch: `AbortController` with 3s timeout → `try/catch` → on any failure set `anreStatus: 'fallback'`
- All data-layer failures resolve to the hardcoded fallback state — never throw to the UI
- No `console.error` in production builds — errors handled silently with visible UI fallback indicator

## Project Structure & Boundaries

### Complete Project Tree

```
moldova-ev-overview/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js          # Design tokens: ev-bg, ev-accent, type scale
├── netlify.toml                # build.command + build.publish = "dist"
├── .gitignore
├── index.html                  # App shell — SEO meta, OG tags, lang="ro"
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                # React root mount, i18n init import
    ├── App.tsx                 # InputState useState, layout shell, section order
    ├── i18n.ts                 # i18next config, language detection, localStorage
    ├── lib/
    │   ├── types.ts            # InputState, SavingsResult, OperatorData, PriceData
    │   ├── calculations.ts     # calculateMonthlySavings, getRoadTax, calcCO2, calcBreakEven
    │   └── anreFetch.ts        # fetch + AbortController timeout (stub in v1, active in v2)
    ├── data/
    │   ├── operators.json      # EVPoint, EVGP, eCharge tariffs + lastVerified per operator
    │   ├── anre.json           # Hardcoded fallback: { benzina95, motorina, gpl, lastVerified }
    │   └── roadTax.ts          # Weight bracket → MDL/kg/year typed const table
    ├── locales/
    │   ├── ro.json             # Romanian — default, complete at launch
    │   ├── en.json             # English — complete at launch
    │   └── ru.json             # Russian — empty object at v1 launch, completed in v2
    └── components/
        ├── StickyHeader.tsx        # Anchor nav + LanguageSwitcher; scroll → solid bg
        ├── LanguageSwitcher.tsx    # RO/EN/RU dropdown, calls i18next.changeLanguage
        ├── HeroSection.tsx         # LossHeadline + SliderGroup + AnreFreshnessBanner
        ├── LossHeadline.tsx        # Display-scale loss figure, aria-live region
        ├── AnreFreshnessBanner.tsx # Live/fallback status dot + date
        ├── SliderGroup.tsx         # All 4 sliders; passes onChange up to App
        ├── SliderInput.tsx         # Single labelled range + live value + hint text
        ├── ChargingSection.tsx     # Section wrapper + OperatorCard list
        ├── OperatorCard.tsx        # Full/placeholder variants; tariff rows + lastVerified
        ├── TaxSection.tsx          # EV vs ICE side-by-side + ProgressiveDisclosure
        ├── ProgressiveDisclosure.tsx # <details>/<summary> expandable wrapper
        ├── SavingsSection.tsx      # LossStatement + StatGrid + SavingsCounter
        ├── StatGrid.tsx            # 3-column monthly / annual / 5yr grid
        ├── StatBox.tsx             # Single stat: value + label
        ├── SavingsCounter.tsx      # IntersectionObserver + rAF count-up animation
        ├── CO2Section.tsx          # Trees-per-year visualisation (v1 optional)
        ├── NextStepsSection.tsx    # App Store + Play Store CTAs
        └── Footer.tsx              # Data sources + last-updated + one-liner about
```

### Integration Boundaries

| Boundary                          | Description                                                                |
| --------------------------------- | -------------------------------------------------------------------------- |
| `App.tsx` → `lib/calculations.ts` | Calls pure functions with `InputState`; receives typed result objects      |
| `App.tsx` → `data/*`              | Imports `operators.json`, `anre.json`, `roadTax.ts` at module load         |
| `App.tsx` → section components    | Passes `inputs`, `SavingsResult`, `PriceData` as explicit props            |
| `i18n.ts` → `locales/*.json`      | Loaded by i18next on init; `useTranslation()` available in any component   |
| `anreFetch.ts` → external         | `fetch('https://anre.md/...')` — isolated in one module; unused stub in v1 |
| `netlify.toml` → Netlify CI       | Push to `main` → `npm run build` → `dist/` deployed automatically          |

## Architecture Validation

### Coherence Check

| Check                                                          | Result                                    |
| -------------------------------------------------------------- | ----------------------------------------- |
| Vite + React + TypeScript + Tailwind compatibility             | ✅ All well-established, no conflicts     |
| `react-i18next` with React context re-render                   | ✅ Standard pattern                       |
| Pure functions in `calculations.ts` + React state in `App.tsx` | ✅ Clean separation of concerns           |
| Static deploy (Netlify) + Vite SPA (no SSR)                    | ✅ Perfect fit                            |
| `operators.json` bundled + zero backend                        | ✅ Consistent with static-only constraint |
| Tailwind design tokens + no CSS modules                        | ✅ Single styling system, no conflicts    |

### Requirements Coverage

| PRD Requirement                | Architectural Coverage                                       |
| ------------------------------ | ------------------------------------------------------------ |
| Live ANRE fuel prices          | `anreFetch.ts` (v2) / `anre.json` fallback (v1)              |
| Operator tariffs               | `data/operators.json` → `OperatorCard.tsx`                   |
| Road tax calculation           | `data/roadTax.ts` → `calculations.ts` → `TaxSection.tsx`     |
| 4 sliders + live recalculation | `SliderGroup.tsx` → `App.tsx` state → pure calc functions    |
| Loss-aversion headline         | `LossHeadline.tsx` with display-scale typography             |
| Animated savings counter       | `SavingsCounter.tsx` (IntersectionObserver + rAF)            |
| i18n RO/EN at launch + RU v2   | `i18n.ts` + `locales/*.json` + `LanguageSwitcher.tsx`        |
| Static deploy                  | Vite `dist/` + `netlify.toml`                                |
| Bundle < 150KB                 | Vite tree-shaking + no heavy UI library                      |
| App Store CTAs                 | `NextStepsSection.tsx`                                       |
| Data freshness transparency    | `AnreFreshnessBanner.tsx` + `lastVerified` in all data files |

All PRD functional requirements have architectural coverage.

### Known Gaps (Accepted)

| Gap                                   | Severity | Resolution                                                                    |
| ------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| ANRE live fetch blocked by CORS in v1 | Accepted | Hardcoded fallback always shown in v1; v2 uses GitHub Actions scheduled fetch |
| No test framework configured          | Deferred | Not in PRD scope; Vitest can be added in v2                                   |
| `ru.json` empty at launch             | Accepted | i18next falls back to Romanian for missing keys                               |
| SEO/OG meta static only               | Accepted | Static `index.html` tags sufficient for a non-SSR app                         |
