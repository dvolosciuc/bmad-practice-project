---
stepsCompleted: [1, 2, 3, 4]
status: complete
completedAt: '2026-04-30'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# Moldova EV Overview - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Moldova EV Overview, decomposing the requirements from the PRD, UX Design Specification, and Architecture Decision Document into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitors can configure monthly driving distance using an adjustable slider input
FR2: Visitors can select their current fuel type (Benzina 95, Motorina, or GPL)
FR3: Visitors can configure their vehicle weight using a slider to drive road tax calculations
FR4: Visitors can select a charging mode (public AC, public DC) to represent their expected EV charging behaviour
FR5: Visitors see all cost calculations update immediately as they adjust any input — no submit action required
FR6: Visitors see a meaningful default calculation on first load without needing to configure anything (defaults: 1,200 km/month · benzina 95 · 1,400 kg · public AC · Centru/Sud region)
FR7: Visitors can view EVPoint's current AC and DC charging tariffs differentiated by region (Centru/Sud and Nord)
FR8: Visitors can view cards for secondary operators (eCharge, ekofactor, eco drive, go to-u) indicating tariffs are not publicly listed and directing them to the operator's app
FR9: Visitors can access App Store and Play Store download links for the EVPoint mobile app
FR10: Visitors can compare the annual road tax cost for an EV vs their current ICE vehicle based on their configured weight
FR11: Visitors can understand how the "masa proprie" (unladen weight) concept applies to their specific vehicle type via an inline explainer
FR12: Visitors can learn where to find their vehicle's weight via a talon reference hint
FR13: Visitors can see their monthly financial loss from remaining in an ICE vehicle framed as an ongoing cost ("pierzi X MDL/lună"), not a future gain
FR14: Visitors can see a cumulative savings counter that animates into view as they scroll to the savings section
FR15: Visitors can see key savings statistics broken down by time period (monthly, annual, 5-year)
FR16: Visitors can see the break-even timeline showing when EV ownership pays for the switch
FR17: Visitors can see their estimated CO₂ savings expressed as a trees-equivalent figure (V1 optional)
FR18: Visitors can access clear next-step actions (EVPoint App Store / Play Store CTAs) at the end of the page
FR19: The app displays fuel prices sourced from the live ANRE regulatory feed on every page load (V2; V1 uses hardcoded fallback always)
FR20: When the live ANRE price source is unavailable, the app falls back to reference prices and clearly indicates the date those prices were last verified
FR21: Visitors can switch the interface language between Romanian and English
FR22: The app retains the visitor's language preference across return visits via localStorage
FR23: The maintainer can update all operator tariff data by editing operators.json without touching application code
FR24: Visitors can jump directly to any of the four content sections (Charging, Tax, Savings, CO₂) from the page header via anchor links
FR25: Visitors can use the product on any modern smartphone or desktop browser (Chrome, Safari, Firefox, Samsung Internet) without degraded layout or functionality
FR26: Visitors using keyboard navigation or screen readers can access and operate all interactive elements
FR27: Search engines can index the product's content for Romanian-language EV-related queries
FR28: The product can be shared on social platforms with a meaningful preview (title, description, Open Graph image)
FR29: The maintainer can publish an updated version by pushing to the main branch with no manual build or deploy steps required

### NonFunctional Requirements

NFR1: The page reaches First Contentful Paint in under 1.5 seconds on a 4G mobile connection
NFR2: All slider interactions produce updated calculations within 100 milliseconds
NFR3: The total JavaScript bundle (gzipped) does not exceed 150KB
NFR4: The ANRE fuel price fetch completes within 3 seconds; if it does not, the fallback activates automatically via AbortController
NFR5: The animated savings counter respects the user's `prefers-reduced-motion` preference — animation is skipped if the user has opted out of motion
NFR6: The application is served exclusively over HTTPS
NFR7: No personally identifiable information (PII) is collected, transmitted, or stored at any point
NFR8: No third-party analytics or tracking scripts are loaded in V1
NFR9: `localStorage` is used only for language preference — no sensitive data is persisted client-side
NFR10: The application meets WCAG 2.1 Level AA compliance
NFR11: All interactive elements (sliders, language dropdown, anchor links, CTAs) are fully operable via keyboard alone
NFR12: Colour contrast ratio meets at minimum 4.5:1 for normal text and 3:1 for large text against the dark background
NFR13: The language switcher announces the language change to screen reader users via aria-live region
NFR14: When the ANRE live fetch fails or times out, the fallback fuel prices displayed must have been manually verified within the last 90 days
NFR15: The ANRE fallback state must visibly indicate the date the reference prices were last verified — users must never see prices without knowing their source date
NFR16: The operators.json file must conform to a defined TypeScript schema; a malformed or mistyped file must cause the build to fail rather than deploy silently broken data

### Additional Requirements

- ARCH1: Project must be scaffolded using `npm create vite@latest moldova-ev-overview -- --template react-ts` — this is the mandatory starting point (Epic 1, Story 1)
- ARCH2: Post-scaffold installs required: `npm install -D tailwindcss @tailwindcss/vite` and `npm install react-i18next i18next i18next-browser-languagedetector`
- ARCH3: `netlify.toml` must be created with `build.command = "npm run build"` and `build.publish = "dist"` to enable auto-deploy on push to `main`
- ARCH4: All shared TypeScript types must live in `src/lib/types.ts` as the single source of truth — no type duplication across files
- ARCH5: `src/data/operators.json` must be typed against the `OperatorData` interface; a TypeScript import assertion or Zod-style check must prevent silent bad data
- ARCH6: `src/data/anre.json` ships hardcoded fallback prices with a `lastVerified` date; V1 always uses this file and always displays the fallback banner
- ARCH7: `src/data/roadTax.ts` must be a typed `const` table (not JSON) so TypeScript can verify bracket keys at compile time
- ARCH8: All calculation logic lives in `src/lib/calculations.ts` as pure functions with no React imports or side effects
- ARCH9: `src/lib/anreFetch.ts` is a stub in V1 (returns hardcoded data immediately); the module exists so V2 can replace it without touching call sites
- ARCH10: Naming conventions must be followed from project start: PascalCase `.tsx` components, camelCase `.ts` utilities, `handle` prefix for event handlers, `calculate`/`get` prefix for pure functions
- ARCH11: All UI string literals must go through `t('key')` — zero hardcoded strings in JSX
- ARCH12: `src/locales/ru.json` ships as an empty object `{}` at V1 launch; i18next falls back to Romanian for all missing keys
- ARCH13: No `console.error` in production builds — all data-layer failures resolve silently to the hardcoded fallback state with a visible UI indicator

### UX Design Requirements

UX-DR1: Implement the full Tailwind CSS design token system in `tailwind.config.js`: `ev-bg: #0f1117`, `ev-surface: #1a1d27`, `ev-surface-2: #252836`, `ev-accent: #2dd4bf`, `ev-accent-hover: #14b8a6`, `ev-text: #f8fafc`, `ev-muted: #94a3b8`, `ev-warning: #f59e0b`; breakpoints sm=360px, md=768px, lg=1024px; Inter typeface
UX-DR2: Implement the 6-level typography scale: display (56–72px / weight 800 / ev-accent — loss headline), h1 (36px/700), h2 (24px/600), body (16px/400), label (14px/500), small (13px/400 — dates/helper text)
UX-DR3: Implement `LossHeadline` — display scale, `ev-accent` colour, `aria-live="polite"` region; loss figure visible above fold on 360px mobile at first paint with defaults; updates on every slider change
UX-DR4: Implement `SliderInput` — `<input type="range">` with `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`; track height 20px, effective thumb tap target 44px+; label left / live value + unit right / hint text below
UX-DR5: Implement `SliderGroup` assembling all 4 slider inputs (km/month 300–3,000, fuel type segmented control, vehicle weight 500–5,000 kg step 50, charging mode segmented control)
UX-DR6: Implement `OperatorCard` in two variants: `full` (EVPoint — regional tariff table Centru/Sud and Nord + AC/DC rows + App Store links + lastVerified date) and `placeholder` (eCharge, ekofactor, eco drive, go to-u — "tariff not publicly listed" + app links)
UX-DR7: Implement `StatBox` + `StatGrid` — 3-column CSS Grid for monthly/annual/5-year savings; 3-col at ≥480px (sm:), single column below; `font-variant-numeric: tabular-nums` on all MDL figures
UX-DR8: Implement `SavingsCounter` — `IntersectionObserver` triggers on section entry; 0-to-final count-up over 1.2 seconds using `requestAnimationFrame`; triggers once, does not re-trigger; `prefers-reduced-motion` shows final value immediately
UX-DR9: Implement `StickyHeader` — transparent background at top; adds `.scrolled` class (solid `ev-surface` + `backdrop-filter: blur(12px)`) when scroll > 10px; compact 4-anchor row on <768px; no hamburger menu; active section highlighted via `IntersectionObserver`
UX-DR10: Implement `LanguageSwitcher` — RO/EN dropdown (RU listed but disabled in V1); persists to `localStorage['lang']`; calls `i18next.changeLanguage()`; updates `document.documentElement.lang`; `aria-live="polite"` announcement on change
UX-DR11: Implement `TaxComparison` — EV vs ICE road tax side-by-side table based on configured weight; `ProgressiveDisclosure` wrapper for masa explainer ("Găsește masa pe talonul mașinii") and talon hint
UX-DR12: Implement `AnreFreshnessBanner` — two states: `live` (teal dot + "Prețuri ANRE actualizate: HH:MM") and `fallback` (amber dot + "Prețuri din cache: dd mmm yyyy"); V1 always renders `fallback` state; never blocks content
UX-DR13: Implement `ProgressiveDisclosure` — native `<details>`/`<summary>` with smooth `max-height` CSS transition; keyboard accessible by default via native HTML behaviour
UX-DR14: Implement 300ms highlight pulse (`@keyframes` flash using `ev-accent` at low opacity) on all dependent numeric values when any slider input changes
UX-DR15: Implement 80px scroll offset for all anchor links to clear the sticky header; `scroll-behavior: smooth` on `<html>`
UX-DR16: Implement section label pattern across all sections — 11px, uppercase, letter-spacing 0.12em, `ev-accent` colour
UX-DR17: Implement `NextStepsCTA` — primary button style (`ev-accent` bg, `ev-bg` text, 8px radius, min-height 48px); App Store + Play Store deep links for EVPoint; ghost button style for secondary actions
UX-DR18: Implement `CO2Visual` — trees-planted-per-year figure with visual metaphor (V1 optional; section drops without breaking the financial argument)
UX-DR19: Implement skip link — visually hidden `<a href="#main-content">` as first DOM element; becomes visible on keyboard focus
UX-DR20: Implement mobile-first responsive layout — single column, max-width 720px centred; section padding: 40px mobile / 56px tablet / 64px desktop; card padding: 24px; all touch targets ≥44×44px

### FR Coverage Map

| FR        | Epic   | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| FR1–FR6   | Epic 2 | Sliders + live recalculation + defaults on load              |
| FR7–FR9   | Epic 3 | EVPoint tariffs + secondary operator cards + App Store links |
| FR10–FR12 | Epic 4 | Road tax comparison + masa explainer + talon hint            |
| FR13      | Epic 2 | Loss-aversion headline (pierzi X MDL/lună)                   |
| FR14–FR18 | Epic 5 | Savings counter + stat grid + break-even + CO₂ + CTAs        |
| FR19–FR20 | Epic 3 | ANRE fallback strategy + freshness banner                    |
| FR21–FR22 | Epic 6 | Language switch (RO/EN) + localStorage persistence           |
| FR23      | Epic 3 | Maintainer operators.json workflow                           |
| FR24      | Epic 2 | Anchor navigation from sticky header                         |
| FR25–FR28 | Epic 6 | Browser support + keyboard nav + SEO + OG social preview     |
| FR29      | Epic 1 | Auto-deploy on push to main                                  |

## Epic List

### Epic 1: Deployable Project Foundation

A working skeleton app is scaffolded using the Vite react-ts template, configured with the full Tailwind design token system and i18n plumbing, and auto-deploys to Netlify on every push to `main`. Andrei (the maintainer) can push and see a live deploy within 90 seconds from day one.
**FRs covered:** FR29
**NFRs:** NFR6
**ARCH:** ARCH1–ARCH4, ARCH10–ARCH13
**UX:** UX-DR1 (Tailwind tokens), UX-DR2 (typography scale)

### Epic 2: Live Cost Calculator — Core Value Proposition

Visitors see their personalised Moldova-specific monthly EV saving framed as a loss above the fold at first paint, with sensible defaults. All four sliders update every dependent value instantly. The sticky header with anchor navigation is in place. Ion completes his primary journey end-to-end.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR13, FR24
**NFRs:** NFR1, NFR2, NFR3
**ARCH:** ARCH5–ARCH9
**UX:** UX-DR3, UX-DR4, UX-DR5, UX-DR9, UX-DR14, UX-DR15, UX-DR16, UX-DR20

### Epic 3: Charging Operator Directory & Data Transparency

Visitors see EVPoint's real regional tariffs (AC/DC by Centru/Sud and Nord) plus placeholder cards for all other operators. The ANRE freshness banner is always present (V1 = fallback mode with visible date). Andrei can update tariffs by editing `operators.json` and pushing — schema is enforced at build time.
**FRs covered:** FR7, FR8, FR9, FR19, FR20, FR23
**NFRs:** NFR4, NFR14, NFR15, NFR16
**UX:** UX-DR6 (OperatorCard), UX-DR12 (AnreFreshnessBanner)

### Epic 4: Road Tax Education

Visitors see the EV vs ICE road tax side-by-side based on their configured vehicle weight. The "masa totală autorizată" concept is explained via progressive disclosure with a talon hint. The Moldova EV=ICE road tax myth is busted.
**FRs covered:** FR10, FR11, FR12
**UX:** UX-DR11 (TaxComparison), UX-DR13 (ProgressiveDisclosure)

### Epic 5: Savings Impact & Call to Action

Visitors see the full savings impact: monthly/annual/5-year stat grid, animated count-up counter triggered by scroll (respects `prefers-reduced-motion`), break-even timeline, CO₂ trees visualisation (V1 optional), and EVPoint App Store CTAs. Ion screenshots the 5-year figure and shares the link.
**FRs covered:** FR14, FR15, FR16, FR17, FR18
**NFRs:** NFR5
**UX:** UX-DR7 (StatBox/StatGrid), UX-DR8 (SavingsCounter), UX-DR17 (NextStepsCTA), UX-DR18 (CO2Visual)

### Epic 6: Internationalisation & Production Polish

Visitors can switch between Romanian and English with full page re-render and localStorage persistence. The app is SEO-indexed with Open Graph social preview. Keyboard accessibility and screen reader basics are complete. All browser targets pass. The product is ready for public launch.
**FRs covered:** FR21, FR22, FR25, FR26, FR27, FR28
**NFRs:** NFR7, NFR8, NFR9, NFR10, NFR11, NFR12, NFR13
**UX:** UX-DR10 (LanguageSwitcher), UX-DR19 (skip link)

---

## Epic 1: Deployable Project Foundation

A working skeleton app is scaffolded using the Vite react-ts template, configured with the full Tailwind design token system and i18n plumbing, and auto-deploys to Netlify on every push to `main`. Andrei (the maintainer) can push and see a live deploy within 90 seconds from day one.

### Story 1.1: Scaffold Project and Install Dependencies

As a developer,
I want the Vite react-ts project scaffolded with all required dependencies installed,
So that the team has a compilable, runnable starting point that matches the architecture spec.

**Acceptance Criteria:**

**Given** a clean working directory
**When** I run `npm create vite@latest moldova-ev-overview -- --template react-ts` followed by the post-scaffold installs
**Then** the project structure matches the Architecture spec (`src/`, `public/`, `index.html`, `vite.config.ts`, `tsconfig.json`)
**And** `npm run dev` starts the dev server with no errors
**And** `npm run build` produces a `dist/` folder with no TypeScript errors
**And** all required packages are present in `package.json`: `react`, `react-dom`, `react-i18next`, `i18next`, `i18next-browser-languagedetector`, `tailwindcss`, `@tailwindcss/vite`

### Story 1.2: Configure Tailwind Design Token System

As a developer,
I want the full Tailwind design token system configured with all project-specific colour, typography, and breakpoint tokens,
So that every component can consume design values from a single source of truth.

**Acceptance Criteria:**

**Given** the scaffolded project
**When** I view `tailwind.config.js`
**Then** all 8 colour tokens are defined: `ev-bg: #0f1117`, `ev-surface: #1a1d27`, `ev-surface-2: #252836`, `ev-accent: #2dd4bf`, `ev-accent-hover: #14b8a6`, `ev-text: #f8fafc`, `ev-muted: #94a3b8`, `ev-warning: #f59e0b`
**And** breakpoints are set to `sm: 360px`, `md: 768px`, `lg: 1024px`
**And** Inter is configured as the primary font family with `system-ui` fallback
**And** a minimal smoke-test component renders with `bg-ev-bg text-ev-text` and the correct colours are visible in the browser

### Story 1.3: Configure i18n Foundation

As a developer,
I want `react-i18next` initialised with RO (default) and EN locale files, language detection from `localStorage`, and RU as an empty stub,
So that every component can call `t('key')` and language preference persists across visits.

**Acceptance Criteria:**

**Given** the project with i18next installed
**When** the app mounts
**Then** `src/i18n.ts` initialises i18next with `i18next-browser-languagedetector`, fallback language `ro`, and loads `ro.json` and `en.json`
**And** `src/locales/ro.json` and `src/locales/en.json` contain at least one sample key (`{ "app.title": "Moldova EV Overview" }`)
**And** `src/locales/ru.json` exists as an empty object `{}`
**And** language preference is stored in and read from `localStorage` key `lang`
**And** calling `i18next.changeLanguage('en')` switches the app language without a page reload

### Story 1.4: Configure Netlify Auto-Deploy

As Andrei (the maintainer),
I want the project connected to Netlify with a `netlify.toml` build configuration,
So that every push to `main` automatically builds and deploys the app with no manual steps.

**Acceptance Criteria:**

**Given** the project repository on `main`
**When** I push a commit to `main`
**Then** Netlify triggers a build using `npm run build`
**And** the `dist/` folder is deployed as the published directory
**And** the deployed URL serves the app over HTTPS
**And** `netlify.toml` in the project root contains `[build] command = "npm run build"` and `publish = "dist"`
**And** a subsequent push with a visible text change is reflected on the live URL within 3 minutes

---

## Epic 2: Live Cost Calculator — Core Value Proposition

Visitors see their personalised Moldova-specific monthly EV saving framed as a loss above the fold at first paint, with sensible defaults. All four sliders update every dependent value instantly. The sticky header with anchor navigation is in place. Ion completes his primary journey end-to-end.

### Story 2.1: Define Shared Types and Data Files

As a developer,
I want all shared TypeScript types, calculation data files, and the typed road tax table in place,
So that all subsequent components have a single type contract to build against with no duplication.

**Acceptance Criteria:**

**Given** the scaffolded project
**When** I view `src/lib/types.ts`
**Then** `InputState`, `SavingsResult`, `PriceData`, `OperatorData`, `FuelType`, `Region`, and `ChargingMode` types are all defined and exported
**And** `src/data/anre.json` exists with hardcoded `benzina95`, `motorina`, `gpl` prices in MDL and a `lastVerified` date string
**And** `src/data/roadTax.ts` exists as a typed `const` bracket table (weight ranges → MDL/year for EV and ICE categories)
**And** `src/lib/anreFetch.ts` exists as a V1 stub that returns the hardcoded `anre.json` data immediately (no network call)
**And** `npm run build` passes with no TypeScript errors

### Story 2.2: Implement Pure Calculation Functions

As a developer,
I want all core calculation functions implemented as pure TypeScript functions with no React imports,
So that savings, road tax, CO₂, and break-even calculations can be unit-tested independently of the UI.

**Acceptance Criteria:**

**Given** the types defined in Story 2.1
**When** I call `calculateMonthlySavings(inputs, prices)` with valid `InputState` and `PriceData`
**Then** it returns a `SavingsResult` with correct `monthly`, `annual`, `fiveYear`, and `breakEvenMonths` values
**And** `getRoadTax(weightKg, vehicleType)` returns the correct MDL/year bracket value from `roadTax.ts`
**And** `calcCO2(kmPerMonth, fuelType)` returns an annual CO₂ saving in kg
**And** all functions handle edge cases: 0 km/month returns 0 savings, weight below minimum bracket returns minimum bracket value
**And** `src/lib/calculations.ts` has zero React imports and no module-level mutable state

### Story 2.3: Implement App-Level State and Layout Shell

As a developer,
I want the `App.tsx` component to hold all input state with correct defaults and render the page section order,
So that all section components receive `inputs` and derived values as props from a single state owner.

**Acceptance Criteria:**

**Given** the calculation functions from Story 2.2
**When** `App.tsx` mounts
**Then** `useState<InputState>` is initialised with defaults: `kmPerMonth: 1200`, `fuelType: 'benzina95'`, `vehicleWeightKg: 1400`, `chargingMode: 'public_ac'`, `region: 'centru_sud'`
**And** all derived values (`SavingsResult`, `PriceData`, road tax delta) are computed inline via pure function calls during render — no `useEffect` for calculations
**And** the page renders section placeholders in order: Hero → Charging → Tax → Savings → CO₂ → Next Steps
**And** the max-width 720px centred container wrapper is in place with correct section padding (40px mobile / 64px desktop)
**And** `npm run build` passes with no errors

### Story 2.4: Implement StickyHeader with Anchor Navigation

As a visitor,
I want a sticky header with anchor links to all four content sections that transitions from transparent to solid on scroll,
So that I can jump directly to any section at any point in my reading.

**Acceptance Criteria:**

**Given** the page is loaded on any device
**When** the page scroll position is 0px
**Then** the header background is fully transparent
**When** the page scrolls beyond 10px
**Then** the header background transitions to solid `ev-surface` with `backdrop-filter: blur(12px)`
**And** the header contains anchor links: Charging · Tax · Savings · CO₂ (Romanian labels via `t()`)
**And** clicking an anchor link scrolls smoothly to the target section with an 80px offset to clear the header
**And** on viewports below 768px, all four anchor links fit in one compact row — no hamburger menu
**And** the header is sticky (`position: sticky; top: 0`) and renders above all section content

### Story 2.5: Implement SliderGroup and SliderInput Components

As a visitor,
I want four slider controls (km/month, fuel type, vehicle weight, charging mode) with immediate live feedback,
So that I can adjust the calculation inputs to match my personal driving reality.

**Acceptance Criteria:**

**Given** the app with default `InputState`
**When** I view the slider group
**Then** all four controls are visible: km/month range slider (300–3,000), fuel type segmented control (Benzina 95 / Motorina / GPL), vehicle weight range slider (500–5,000 kg, step 50), charging mode segmented control (Public AC / Public DC)
**And** each slider shows: label on left · live value with unit on right · hint text below
**And** each `SliderInput` has `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` attributes
**And** the effective thumb tap target is at minimum 44×44px on touch devices
**And** all slider labels and hint text render via `t('key')` — no hardcoded strings in JSX

### Story 2.6: Implement LossHeadline with Live Recalculation

As Ion (a curious visitor),
I want to see my personalised monthly loss figure in large display-scale text above the fold the moment the page loads,
So that I understand the financial argument before touching anything.

**Acceptance Criteria:**

**Given** the page has loaded with defaults (1,200 km/month · benzina 95 · 1,400 kg · public AC)
**When** the hero section renders
**Then** the loss figure is displayed in display-scale typography (48px mobile / 68px desktop, weight 800, `ev-accent` colour)
**And** the figure is visible above the fold on a 360px viewport without scrolling
**And** the `LossHeadline` element has `aria-live="polite"` so screen readers announce updates
**When** I adjust any slider
**Then** the loss figure updates within 100ms with no button press required
**And** a 300ms highlight pulse animation fires on the headline and all other dependent numeric values simultaneously
**And** all text in the hero renders via `t('key')` with Romanian as the default language

---

## Epic 3: Charging Operator Directory & Data Transparency

Visitors see EVPoint's real regional tariffs (AC/DC by Centru/Sud and Nord) plus placeholder cards for all other operators. The ANRE freshness banner is always present (V1 = fallback mode with visible date). Andrei can update tariffs by editing `operators.json` and pushing — schema is enforced at build time.

### Story 3.1: Define and Validate operators.json Schema

As Andrei (the maintainer),
I want the operator tariff data structured in a typed `operators.json` with TypeScript schema enforcement at build time,
So that a malformed tariff file causes the build to fail rather than deploying silently broken data.

**Acceptance Criteria:**

**Given** the `OperatorData` type defined in `src/lib/types.ts`
**When** I view `src/data/operators.json`
**Then** it contains entries for EVPoint (full tariff data) and eCharge, ekofactor, eco drive, go to-u (placeholder entries)
**And** each entry includes: `id`, `name`, `variant: 'full' | 'placeholder'`, `lastVerified` date string, and for `full` variant: regional tariff rows (AC and DC prices per region in MDL)
**And** a TypeScript import of `operators.json` with type assertion against `OperatorData[]` exists in `App.tsx` or a data loader
**And** introducing a type error in `operators.json` (e.g., wrong field type) causes `npm run build` to fail with a TypeScript error
**And** EVPoint entries contain: `centru_sud` AC 7.44 MDL/kWh, DC 9.48 MDL/kWh; `nord` AC and DC values from `moldova-ev-market-data.json`

### Story 3.2: Implement OperatorCard Component

As a visitor,
I want to see EVPoint's charging tariffs in a regional breakdown card and placeholder cards for other operators directing me to their apps,
So that I can find real Moldova charging costs and know where to get tariffs for operators that don't publish them publicly.

**Acceptance Criteria:**

**Given** the `operators.json` data is loaded
**When** I view the Charging section
**Then** EVPoint renders as a `full` variant card: regional tariff table with Centru/Sud and Nord rows, AC and DC columns, prices in MDL/kWh, `lastVerified` date visible
**And** eCharge, ekofactor, eco drive, and go to-u each render as `placeholder` variant cards: operator name, "Tariful nu este publicat — vezi aplicația" message, and a link to the operator's app
**And** EVPoint's card includes App Store and Play Store deep-link buttons for the EVPoint mobile app
**And** all card text renders via `t('key')` — no hardcoded strings in JSX
**And** each card's `lastVerified` date is visible in `small` typography style (`ev-muted` colour)

### Story 3.3: Implement AnreFreshnessBanner

As a visitor,
I want a data freshness indicator that tells me whether fuel prices are live or from a cached fallback and when they were last verified,
So that I can trust the figures I'm seeing and understand their provenance.

**Acceptance Criteria:**

**Given** the V1 app uses hardcoded `anre.json` fallback always
**When** the hero section renders
**Then** the `AnreFreshnessBanner` displays in `fallback` state: amber dot (`ev-warning` colour) + "Prețuri din cache: [lastVerified date from anre.json]"
**And** the banner never blocks content rendering — it appears inline below or above the loss headline
**And** the banner text renders via `t('key')` with the date interpolated
**And** the component accepts a `status: 'live' | 'fallback'` prop so V2 can switch to live state without changing the component's internal logic
**When** `status` is `'live'`
**Then** the banner shows a teal dot (`ev-accent`) + "Prețuri ANRE actualizate: [HH:MM]"

---

## Epic 4: Road Tax Education

Visitors see the EV vs ICE road tax side-by-side based on their configured vehicle weight. The "masa totală autorizată" concept is explained via progressive disclosure with a talon hint. The Moldova EV=ICE road tax myth is busted.

### Story 4.1: Implement ProgressiveDisclosure Component

As a visitor,
I want expandable sections that reveal secondary detail on demand without a layout jump,
So that the primary information stays uncluttered and I can access deeper explanation when I need it.

**Acceptance Criteria:**

**Given** any section that contains secondary explanatory content
**When** I view a `ProgressiveDisclosure` component in its collapsed state
**Then** only the summary/trigger text is visible; the body content is hidden
**When** I click or tap the summary trigger
**Then** the body content expands with a smooth `max-height` CSS transition (no layout jump)
**And** the component is built on native `<details>` / `<summary>` elements — keyboard accessible by default (Enter/Space to toggle)
**When** I click again
**Then** the body content collapses smoothly
**And** the component accepts `summary` (string) and `children` (ReactNode) props with no other dependencies

### Story 4.2: Implement TaxComparison Section

As a visitor,
I want to see my EV and ICE road tax amounts side-by-side based on my configured vehicle weight, with an explainer for the "masa totală autorizată" concept,
So that I can verify the EV=ICE tax reality for Moldova and understand how to find my own vehicle's weight.

**Acceptance Criteria:**

**Given** the visitor has configured a vehicle weight via the slider (or default 1,400 kg)
**When** I scroll to the Tax section
**Then** two side-by-side values are displayed: "Taxa EV" and "Taxa benzină/motorină" both calculated from the same weight bracket using `getRoadTax()`
**And** for comparable weight inputs the EV and ICE values are equal, demonstrating the Moldova EV=ICE road tax reality
**And** a `ProgressiveDisclosure` component contains: explanation of "masa totală autorizată" vs "masa proprie", the instruction "Găsește masa pe talonul mașinii (certificatul de înmatriculare)", and a hint about the talon field name
**And** the Tax section has an `id="tax"` attribute for anchor navigation from the sticky header
**And** all section text renders via `t('key')` — no hardcoded strings in JSX
**When** the visitor adjusts the vehicle weight slider
**Then** both EV and ICE tax values update immediately without a page reload

---

## Epic 5: Savings Impact & Call to Action

Visitors see the full savings impact: monthly/annual/5-year stat grid, animated count-up counter triggered by scroll (respects `prefers-reduced-motion`), break-even timeline, CO₂ trees visualisation (V1 optional), and EVPoint App Store CTAs. Ion screenshots the 5-year figure and shares the link.

### Story 5.1: Implement StatGrid and StatBox Components

As a visitor,
I want to see my monthly, annual, and 5-year savings displayed in a clear 3-column grid,
So that I can instantly grasp the financial scale of switching to an EV.

**Acceptance Criteria:**

**Given** the `SavingsResult` is computed from the visitor's current `InputState`
**When** I view the Savings section
**Then** three `StatBox` components display: monthly saving (MDL), annual saving (MDL), and 5-year saving (MDL)
**And** the `StatGrid` uses CSS Grid `grid-template-columns: repeat(3, 1fr)` at ≥480px (`sm:`) and single column below 480px
**And** all MDL figures use `font-variant-numeric: tabular-nums` to prevent layout shift during updates
**When** the visitor adjusts any slider
**Then** all three stat values update within 100ms with the highlight pulse animation
**And** the break-even timeline ("Recuperezi investiția în X luni") is displayed below the stat grid using `SavingsResult.breakEvenMonths`
**And** when `breakEvenMonths` is `null` (savings are negligible), the stat grid shows "Economii minime la acest profil" — never a negative number

### Story 5.2: Implement SavingsCounter with Scroll Animation

As a visitor,
I want to see a large animated number count up from zero to my savings total as I scroll to the Savings section,
So that the financial impact becomes a visceral, memorable event rather than a static figure.

**Acceptance Criteria:**

**Given** the Savings section is below the fold
**When** the `SavingsCounter` component enters the viewport (detected via `IntersectionObserver`)
**Then** the counter animates from 0 to the computed monthly saving value over 1.2 seconds using `requestAnimationFrame`
**And** the animation triggers once per page load — it does not re-trigger if the user scrolls away and back
**And** the displayed MDL figure updates in sync with `SavingsResult.monthly` if the user adjusts a slider after the animation has completed (shows final value immediately on re-calculation)
**When** `prefers-reduced-motion: reduce` is set in the user's OS settings
**Then** the counter skips the animation entirely and displays the final value immediately on section entry
**And** the `SavingsCounter` manages its own `IntersectionObserver` and `requestAnimationFrame` state internally — it does not add event listeners to `App.tsx`

### Story 5.3: Implement NextStepsCTA and CO₂ Section

As Ion (a visitor who has seen the savings),
I want clear, frictionless next-step actions — app download links — at the end of the page, with an optional CO₂ trees figure above,
So that I can immediately act on what I've learned without searching for where to go next.

**Acceptance Criteria:**

**Given** the visitor has scrolled to the bottom of the page
**When** I view the Next Steps section
**Then** primary CTA buttons for EVPoint App Store (iOS) and Play Store (Android) are displayed with correct deep-link URLs
**And** the CTA buttons use primary button style: `ev-accent` background, `ev-bg` text, 8px border-radius, min-height 48px
**And** all CTA button text renders via `t('key')` — no hardcoded strings in JSX
**And** the Next Steps section has an `id="next-steps"` attribute
**And** the CO₂ section renders above Next Steps showing the trees-equivalent figure from `calcCO2()` (e.g., "Echivalent cu X copaci plantați pe an")
**And** if the CO₂ figure is zero or near-zero, the section still renders without showing a negative or misleading value
**When** the visitor adjusts a slider
**Then** the CO₂ trees figure updates within 100ms

---

## Epic 6: Internationalisation & Production Polish

Visitors can switch between Romanian and English with full page re-render and localStorage persistence. The app is SEO-indexed with Open Graph social preview. Keyboard accessibility and screen reader basics are complete. All browser targets pass. The product is ready for public launch.

### Story 6.1: Implement LanguageSwitcher Component

As Natalia (a Russian-speaking EV owner),
I want to switch the interface language between Romanian and English with an instant full-page re-render and my preference remembered on return visits,
So that I can use the app in my preferred language every time without re-selecting it.

**Acceptance Criteria:**

**Given** the app is loaded in Romanian (default)
**When** I select English from the `LanguageSwitcher` dropdown
**Then** the entire page re-renders in English instantly — all section labels, slider hints, operator card text, and banners
**And** the language preference is saved to `localStorage['lang']` and restored on the next page load
**And** `document.documentElement.lang` is updated to `'en'` (or `'ro'`) on every language change
**And** the switcher includes RO, EN, and RU options; RU is listed but disabled (greyed out) in V1 with a "(în curând)" label
**And** the `LanguageSwitcher` has `role="combobox"` and an `aria-live="polite"` region that announces the language change to screen readers
**And** the switcher is visible in the sticky header on all viewport sizes

### Story 6.2: Complete Full Romanian and English Locale Files

As a developer,
I want all UI string keys populated in both `ro.json` and `en.json` locale files,
So that zero raw i18n key strings are ever visible to users in either language.

**Acceptance Criteria:**

**Given** the complete app with all components implemented
**When** I run the app in Romanian
**Then** no raw i18n key strings (e.g., `hero.lossLabel`) are visible anywhere in the UI — every `t('key')` call resolves to a translated string
**When** I run the app in English
**Then** the same condition holds — all keys resolve correctly in English
**And** `ro.json` is the primary/complete file; `en.json` has a matching key set with English translations
**And** `ru.json` remains an empty object `{}`; i18next falls back to Romanian for all missing RU keys without throwing errors
**And** all locale key names follow `section.element` dot notation camelCase (e.g., `hero.lossLabel`, `charging.lastVerified`, `tax.masaExplainer`)

### Story 6.3: SEO Meta, Open Graph, and Semantic HTML

As a search engine or social media platform,
I want the page to have complete SEO metadata and Open Graph tags,
So that the app is discoverable for Romanian-language EV queries and renders meaningful social preview cards when shared.

**Acceptance Criteria:**

**Given** the production build is deployed
**When** a web crawler or social platform fetches the page URL
**Then** `index.html` contains a meaningful `<title>` tag (Romanian primary: "Calculator EV Moldova — Cât economisești trecând la electric?")
**And** `<meta name="description">` contains a 150-character Romanian summary of the tool
**And** Open Graph tags are present: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (static image in `public/`)
**And** the HTML structure uses correct heading hierarchy: one `<h1>` page title → `<h2>` section titles → `<h3>` card titles — no levels skipped
**And** `<html lang="ro">` is set in `index.html` (updated dynamically to `'en'` by `LanguageSwitcher`)
**And** `npm run build` produces an `index.html` with all meta tags intact in the `dist/` output

### Story 6.4: Keyboard Accessibility and Skip Link

As a visitor using keyboard navigation,
I want to navigate the entire page using only a keyboard and have a skip-to-content link as the first focusable element,
So that I can access all interactive controls without a mouse.

**Acceptance Criteria:**

**Given** I load the page and press Tab
**Then** a visually hidden "Salt la conținut principal" skip link becomes visible and is the first focusable element
**When** I activate the skip link
**Then** focus jumps to the `<main id="main-content">` element, bypassing the sticky header
**And** pressing Tab from the skip link cycles through: sticky header anchor links → language switcher → all four sliders → operator card app links → progressive disclosure triggers → CTA buttons — in natural DOM order
**And** all interactive elements show a visible focus ring: `focus-visible:ring-2 focus-visible:ring-ev-accent`
**And** no interactive element is reachable only via mouse (no `tabIndex="-1"` on focusable controls)
**And** `prefers-reduced-motion` is respected for the SavingsCounter (already implemented in Story 5.2 — verified here end-to-end)
