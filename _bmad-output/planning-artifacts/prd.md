---
stepsCompleted:
  [
    step-01-init,
    step-02-discovery,
    step-02b-vision,
    step-02c-executive-summary,
    step-03-success,
    step-04-journeys,
    step-05-domain,
    step-06-innovation,
    step-07-project-type,
    step-08-scoping,
    step-09-functional,
    step-10-nonfunctional,
    step-11-polish,
  ]
releaseMode: phased
inputDocuments:
  - _bmad-output/planning-artifacts/moldova-ev-market-data.json
  - _bmad-output/brainstorming/brainstorming-session-2026-04-29-1.md
workflowType: 'prd'
briefCount: 0
researchCount: 1
brastormingCount: 1
projectDocsCount: 0
classification:
  projectType: web_app
  domain: Consumer Information / EV Awareness Tool
  complexity: low-medium
  projectContext: greenfield
  keyConcerns: i18n (RO/EN/RU), ANRE data freshness, operator tariff accuracy, mobile responsiveness
---

# Product Requirements Document - Moldova EV Overview App

**Author:** Dumitru Volosciuc
**Date:** 2026-04-29

## Executive Summary

Moldova EV Overview is a greenfield React single-page application that gives Moldovan drivers a clear, Moldova-specific financial answer to one question: does switching to an EV actually make sense for me? The tool aggregates live ANRE fuel prices, real public charging tariffs from all active Moldova operators, and the Moldova road tax table to compute personalised monthly savings, annual savings, 5-year savings, and break-even point — all in MDL, updated automatically.

Target users are Moldovan residents actively considering or already owning an EV who need trustworthy local data, not generic EU calculators irrelevant to their context. The app is accessible in Romanian, English, and Russian.

### What Makes This Special

No equivalent Moldova-specific EV calculator exists. Existing information is fragmented across operator apps, ANRE's website, and the Fiscal Code — all requiring separate lookups and manual calculations. Moldova EV Overview is the single source that combines all four pillars (charging cost, fuel cost, road tax, CO₂ impact) with live ANRE data and real operator tariffs for EVPoint, eCharge, ekofactor, eco drive, and go to-u.

The core differentiator is honest framing: rather than promotional "here's what you'd save" messaging, the app uses loss-aversion language — "you're losing X MDL/month by not switching" — which reflects financial reality more accurately and resonates with a cost-conscious Moldovan audience. Combined with a dark high-contrast design, oversized financial numbers, and zero marketing noise, the app is designed to be trusted and shared.

The ANRE live fetch (client-side on load, hardcoded fallback with last-verified date on failure) ensures fuel price data is always current without any backend infrastructure or maintenance burden.

### Project Classification

| Attribute                  | Value                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Project Type**           | Web Application — React SPA                                                                                |
| **Domain**                 | Consumer Information / EV Awareness                                                                        |
| **Complexity**             | Low-Medium                                                                                                 |
| **Project Context**        | Greenfield                                                                                                 |
| **Deployment**             | Static hosting (Netlify / GitHub Pages)                                                                    |
| **Languages**              | Romanian (primary), English, Russian                                                                       |
| **Key Technical Concerns** | ANRE live data fetch with graceful fallback · operator tariff accuracy · full i18n · mobile responsiveness |

## Success Criteria

### User Success

- A user with no EV knowledge arrives at the page and within 30 seconds — without changing any defaults — understands approximately how much they'd save monthly by switching to an EV in Moldova.
- A user who adjusts sliders (km/month, vehicle weight, fuel type) receives an immediately updated, personalised result with no page reload or button press required.
- A user who doesn't know their _masa totală autorizată_ understands via the inline explainer what it means and where to find it (vehicle registration certificate / talon).
- A user can complete the full page scroll — Charging → Tax → Savings → CO₂ → Next Steps — in one session and leave with at least one actionable next step taken (operator app download or RFID card awareness).

### Business Success

This is a public information tool, not a revenue product. Success is measured by reach and trust:

- The tool becomes the go-to reference shared in Moldovan EV communities (Facebook groups, Telegram channels) — evidenced by inbound referral traffic from these sources.
- Data accuracy maintained: fuel prices never more than 24 hours stale; operator tariffs verified with visible last-verified timestamps.
- Zero reported incorrect calculations — trust is the primary asset.

### Technical Success

- Page loads in under 2 seconds on a mid-range Android device on Moldova 4G mobile data.
- ANRE live fetch completes or falls back gracefully — users never see a broken or empty data state.
- All content renders correctly in Romanian and English at v1 launch; Russian added in v2.
- Deploys as a fully static build with zero server-side dependencies.

### Measurable Outcomes

| Outcome                | Metric                                   | Target                                               |
| ---------------------- | ---------------------------------------- | ---------------------------------------------------- |
| First impression speed | Time to meaningful result with defaults  | < 30 seconds                                         |
| Page performance       | Load time on 4G mobile                   | < 2 seconds                                          |
| Data freshness         | Max age of ANRE fuel price               | 24 hours                                             |
| Calculation accuracy   | User-reported errors                     | 0 in first 3 months                                  |
| Reach                  | Organic shares in Moldova EV communities | Measurable referral traffic within 30 days of launch |

## Product Scope

### MVP — v1 (Build Now)

Deliver the complete emotional arc — Charging → Tax → Savings → CO₂ — for Moldovan users on any device. All four journeys (Ion, Natalia, Andrei, Vasile) are fully supported at launch. Full capability detail in [Project Scoping & Phased Development](#project-scoping--phased-development).

**Defaults on load:** 7 L/100km ICE · 18 kWh/100km EV · 1,200 km/month · benzina 95. Four sliders, live recalculation, no Calculate button. Dark/teal design, loss-aversion framing, static deploy.

### Growth — v2 (After Operator Research)

- Full tariff cards for eCharge, ekofactor, eco drive, and go to-u (pending tariff data collection)
- Russian language (RU) added to language switcher
- Home charging cost calculator (electricity tariff per kWh input)
- Break-even timeline visualisation bar (horizontal, year-by-year)

### Vision — Future

- Embeddable widget version for Moldovan car dealer websites
- Community-contributed operator tariff update mechanism
- Historical ANRE price chart (fuel cost trend over 12 months)

## User Journeys

### Journey 1 — Ion, the Curious Commuter (Primary · Happy Path)

Ion is a 34-year-old accountant in Chișinău. He drives a 2017 Dacia Logan, filling up with benzina 95 twice a month. He's been seeing EV charging stations popping up around the city and his colleague just bought a BYD. He's curious but sceptical — "EVs are for rich people, right? And what about the taxes?"

He opens a link someone shared on a Moldova automotive Facebook group on his Android phone during his lunch break.

The page loads. Dark background, teal accents. A large number is immediately visible: _"Cu mașina curentă, pierzi ~1,840 MDL pe lună față de un EV."_ He hasn't touched anything. The defaults are close enough to his reality — 1,200 km/month, benzina 95.

He scrolls to **Charging** — sees EVPoint's tariff card, recognises the brand, notes the AC/DC price. He slides km/month to 1,500. Numbers update instantly.

He reaches **Tax** — reads the EV=ICE explainer. "Wait, EVs pay the same road tax as petrol cars in Moldova?" He enters his Logan's weight. The calculation appears immediately.

He reaches **Savings** — the animated counter rolls up to 2,100 MDL/month. He sees monthly, annual, and 5-year boxes. The 5-year figure stops him: 126,000 MDL. He screenshots it.

He scrolls to **CO₂** — equivalent of 14 trees planted per year.

He reaches **Next Steps** — taps the EVPoint App Store button. He shares the link in two Telegram groups.

### Journey 2 — Natalia, the Already-Converted (Primary · Edge Case / Regional)

Natalia already owns a Nissan Leaf. She wants to show her sceptical husband exactly how much they're saving compared to their old Skoda Octavia (motorina, ~1,800 km/month).

She switches the language to Russian. Everything re-renders instantly — labels, helper text, units. She switches fuel type to motorina. She increases km/month to 1,800. She enters the Leaf's weight.

The tax section shows the same annual tax for the Leaf and the Skoda at comparable weights — she appreciates the honesty. She shows her husband the 5-year saving. Done.

### Journey 3 — Andrei, the Data Maintainer (Admin / Operator)

Andrei maintains the app. EVPoint announces a tariff change. He opens `src/data/operators.json`, updates the MDL values and the `lastVerified` date, commits, pushes. Netlify auto-deploys in 90 seconds. The app reflects new prices immediately.

No CMS, no dashboard, no login — pure JSON file maintenance with automatic deploy.

### Journey 4 — Vasile, the Nord-Region Driver (Primary · Regional Variation)

Vasile lives in Bălți and drives 900 km/month. He opens the app and notes EVPoint's Nord region tariff is slightly higher than Centru/Sud. He adjusts sliders to 900 km and sees his personalised Nord-region charging cost. He also notes the EVGP station at str. Orhei 5 — the only DC fast-charger near him.

### Journey Requirements Summary

| Journey              | Capabilities Required                                                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ion (commuter)       | Defaults on load · live sliders · mobile render · loss-framing headline · EVPoint tariff card · tax myth-buster · animated counter · App Store deep links |
| Natalia (EV owner)   | Language switcher with full page re-render · motorina fuel type · weight input · tax side-by-side                                                         |
| Andrei (maintainer)  | Operator tariffs in structured JSON · lastVerified field per operator · automatic static deploy on push                                                   |
| Vasile (Nord region) | EVPoint regional tariff differentiation visible in card · station location data for secondary operators                                                   |

## Innovation & Novel Patterns

### Detected Innovation Areas

**Moldova-first information gap:** No Moldova-specific EV cost calculator exists. This product fills a genuine vacuum rather than competing in a crowded category, giving it immediate SEO and word-of-mouth authority in a small, well-connected market.

**Loss-aversion as primary framing:** The headline user message is deliberately framed as a loss ("you're losing X MDL/month by not switching") rather than a gain. Grounded in behavioural economics (Prospect Theory) — people respond more strongly to avoiding losses than acquiring equivalent gains. Applied to EV adoption, this reframes the decision from "optional upgrade" to "ongoing financial bleed." Few if any EV calculators globally use this framing as the primary UX pattern.

**Static site + live regulatory data:** Client-side fetch of ANRE fuel prices on page load delivers always-current data without any backend infrastructure, server costs, or maintenance burden. The hardcoded fallback with visible "using cached prices from [date]" ensures the product remains trustworthy and functional even when the external fetch fails.

### Validation Approach

- Loss-aversion framing validates through share rates: if the tool spreads organically in Moldova EV communities, the framing is effective. A/B testing (gain vs. loss headline) is feasible in v2 if share tracking is implemented.
- ANRE fetch validates through monitoring: if the fallback state triggers frequently, ANRE's page structure has changed and the parser needs updating.

### Risk Mitigation

- If ANRE changes their page structure, the hardcoded fallback activates automatically with a visible date — users are never misled. A lightweight uptime monitor on the fetch endpoint can alert the maintainer when live data stops flowing.
- If loss-aversion framing feels too aggressive for some users, the copy can be softened without changing the underlying calculation architecture.

## Web App Specific Requirements

### Project-Type Overview

Moldova EV Overview is a **single-page application (SPA)** built with React. It has no routing — the entire experience is a single vertically-scrolling document. There is no server-side rendering, no API backend, no authentication. All computation happens client-side in the browser. The only external call is a one-time ANRE fuel price fetch on load.

### Technical Architecture Considerations

- **SPA (no MPA):** One HTML document, one React root, no React Router. Anchor links use native smooth scroll to page sections.
- **State management:** Local React state only (no Redux/Zustand needed) — inputs are ephemeral slider values, calculations are pure functions.
- **Data layer:** Two sources — (1) `src/data/operators.json` (static, version-controlled) and (2) ANRE live fetch (client-side, with fallback).
- **i18n:** All UI strings in `src/locales/{ro,en,ru}.json`. Language preference stored in `localStorage`. Full re-render on language switch — no partial hydration.
- **Build:** Vite + React. Output: static `dist/` folder. Deploy: Netlify or GitHub Pages via push-triggered CI.

### Browser Matrix

| Browser                    | Support Level                      |
| -------------------------- | ---------------------------------- |
| Chrome (Android + Desktop) | Full — primary target              |
| Safari (iOS + macOS)       | Full                               |
| Firefox                    | Full                               |
| Samsung Internet           | Full (major Moldova Android share) |
| IE / Legacy Edge           | Not supported                      |

### Responsive Design

- **Mobile-first** — designed for 360px+ viewport (mid-range Android).
- Breakpoints: mobile (< 768px) · tablet (768–1024px) · desktop (> 1024px).
- Sliders must be touch-friendly with adequate tap targets (min 44px).
- Header collapses to compact mode on small screens; language dropdown accessible on mobile.

### Performance Targets

| Metric                             | Target                              |
| ---------------------------------- | ----------------------------------- |
| First Contentful Paint (4G mobile) | < 1.5s                              |
| Time to Interactive                | < 2s                                |
| Total JS bundle (gzipped)          | < 150KB                             |
| ANRE fetch timeout                 | 3s — fallback activates if exceeded |
| Largest Contentful Paint           | < 2.5s                              |

### SEO Strategy

- Static HTML shell with meaningful `<title>`, `<meta description>`, Open Graph tags (Romanian primary).
- Semantic HTML structure (h1 → h2 → h3 hierarchy matching page sections).
- Page is indexable — no login gate, no JS-only render blocking meaningful content.
- Target keywords: "calculator EV Moldova", "taxa drumuri vehicule electrice", "EVPoint tarife".

### Accessibility Level

- WCAG 2.1 AA target.
- All interactive elements keyboard-navigable.
- Sliders have visible labels and ARIA attributes.
- Colour contrast ratios meet AA minimums (dark background + teal accents verified).
- Language switcher announces language change to screen readers.

### Implementation Considerations

- **ANRE fetch:** `fetch()` on component mount with a 3-second timeout. On success, update fuel price state. On failure or timeout, use hardcoded fallback values and display "using cached prices from [lastVerifiedDate]" indicator.
- **Animated counter:** Uses `IntersectionObserver` to trigger count-up animation when savings section enters viewport. Respects `prefers-reduced-motion`.
- **Smooth scroll:** CSS `scroll-behavior: smooth` on `<html>`. Header anchor links use `href="#section-id"`.
- **No cookies, no tracking, no analytics by default** — keeps the app trust-forward and GDPR-trivial.

## Project Scoping & Phased Development

### Strategy & Philosophy

**Delivery Mode:** Phased (V1 → V2 → Vision)
**MVP Approach:** Experience MVP — the product must feel complete and trustworthy from day one. A partial calculator that can't handle all inputs, or one missing the savings headline, fails to make the argument. V1 ships the full emotional arc: see the cost → understand the tax → feel the loss → act.
**Resource Requirements:** 1 developer (Dumitru), 0 backend infrastructure, 0 ongoing server cost.

### V1 — Core Launch (Must-Have)

**Core User Journeys Supported:** Ion (commuter), Natalia (EV owner), Andrei (maintainer), Vasile (Nord region)

**Must-Have Capabilities:**

- Vertical single-scroll SPA: Charging → Tax → Savings → CO₂ sections
- Header with 4 anchor links + RO/EN language dropdown; transparent → solid on scroll
- Input sliders (km/month, fuel type, vehicle weight, charging mode) with immediate defaults and live recalculation — no Calculate button
- Defaults: 7 L/100km ICE · 18 kWh/100km EV · 1,200 km/month · Benzina 95
- Charging section: EVPoint operator card (full 3-region tariff table) + eCharge/ekofactor/eco drive/go to-u cards ("tariff not publicly listed — see app")
- Tax section: EV vs ICE road tax side-by-side + masa explainer + talon hint
- Savings section: loss-aversion headline ("you're losing X MDL/month") + animated counter + 3 stat boxes + break-even timeline
- CO₂ section: trees-per-km visualisation
- Next steps: App Store + Play Store CTAs for EVPoint app
- ANRE live client-side fetch with 3s timeout + hardcoded fallback + "using cached prices from [date]" indicator
- Operator tariffs in `src/data/operators.json` (static, version-controlled)
- Full i18n: Romanian (default) + English
- Mobile-first responsive design, dark/teal design system
- Static deploy (Netlify or GitHub Pages)

**Nice-to-Have for V1 (defer if time-constrained):**

- CO₂ trees visualisation — drops without breaking the financial argument
- Open Graph / social preview image — improves sharing but not core functionality

### V2 — Expansion

- Russian language support (`src/locales/ru.json`)
- Actual ekofactor / eco drive / go to-u tariffs (blocked on external research)
- Home charging cost calculator (electricity tariff per kWh input)
- Break-even timeline visualisation bar (horizontal, year-by-year)
- Share button with UTM tracking for engagement analytics
- A/B test: gain vs. loss headline (requires share tracking to validate)

### Vision

- Additional operators as Moldova's charging network grows
- Map view of charging station locations
- Community-submitted tariff tips / freshness reports
- Embeddable widget version for Moldovan car dealer websites
- Historical ANRE price chart (12-month fuel cost trend)

### Risk Mitigation

**Technical:** ANRE fetch parser must handle irregular HTML — hardcoded fallback is always active. Monitor fallback trigger frequency as an alert signal.
**Market:** Distribution relies on Moldova EV communities (Facebook groups, Telegram). SEO on Romanian-language keywords accelerates organic discovery.
**Resource:** If V1 is time-constrained, defer CO₂ section and OG image. All financial calculation components are non-negotiable for the core value proposition.

## Functional Requirements

### Input & Live Calculation

- FR1: Visitors can configure monthly driving distance using an adjustable input
- FR2: Visitors can select their current fuel type (benzina 95 or motorina)
- FR3: Visitors can configure their vehicle weight to drive road tax calculations
- FR4: Visitors can select a charging mode (home AC, public AC, public DC) to represent their expected EV charging behaviour
- FR5: Visitors see all cost calculations update immediately as they adjust any input — no submit action required
- FR6: Visitors see a meaningful default calculation on first load without needing to configure anything

### Charging Operator Information

- FR7: Visitors can view EVPoint's current AC and DC charging tariffs differentiated by region (Centru, Sud, Nord)
- FR8: Visitors can view cards for secondary operators (eCharge, ekofactor, eco drive, go to-u) that indicate tariffs are not publicly listed and direct them to the operator's app
- FR9: Visitors can access App Store and Play Store download links for the EVPoint mobile app

### Road Tax Comparison

- FR10: Visitors can compare the annual road tax cost for an EV vs their current ICE vehicle based on their configured weight
- FR11: Visitors can understand how the "masa proprie" (unladen weight) concept applies to their specific vehicle type
- FR12: Visitors can learn where to find their vehicle's weight (talon reference)

### Savings & Environmental Impact

- FR13: Visitors can see their monthly financial loss from remaining in an ICE vehicle framed as an ongoing cost, not a future gain
- FR14: Visitors can see a cumulative savings counter that animates into view as they scroll to the savings section
- FR15: Visitors can see key savings statistics broken down by time period (monthly, annual, multi-year)
- FR16: Visitors can see the break-even timeline showing when EV ownership pays for the switch
- FR17: Visitors can see their estimated CO₂ savings expressed as a trees-equivalent figure
- FR18: Visitors can access clear next-step actions (operator app downloads, further research CTAs) at the end of the page

### Data Freshness & Localisation

- FR19: The app displays fuel prices sourced from the live ANRE regulatory feed on every page load
- FR20: When the live ANRE price source is unavailable, the app falls back to reference prices and clearly indicates the date those prices were last verified
- FR21: Visitors can switch the interface language between Romanian and English
- FR22: The app retains the visitor's language preference across return visits
- FR23: The maintainer can update all operator tariff data (rates, dates, metadata) by editing a structured data file without touching application code

### Navigation, Accessibility & Reach

- FR24: Visitors can jump directly to any of the four content sections (Charging, Tax, Savings, CO₂) from the page header
- FR25: Visitors can use the product on any modern smartphone or desktop browser without degraded layout or functionality
- FR26: Visitors using keyboard navigation or screen readers can access and operate all interactive elements
- FR27: Search engines can index the product's content for Romanian-language EV-related queries
- FR28: The product can be shared on social platforms with a meaningful preview (title, description, image)
- FR29: The maintainer can publish an updated version of the product by pushing to the main branch, with no manual build or deploy steps required

## Non-Functional Requirements

### Performance

- NFR1: The page reaches First Contentful Paint in under 1.5 seconds on a 4G mobile connection
- NFR2: All slider interactions produce updated calculations within 100 milliseconds
- NFR3: The total JavaScript bundle (gzipped) does not exceed 150KB
- NFR4: The ANRE fuel price fetch completes within 3 seconds; if it does not, the fallback activates automatically
- NFR5: The animated savings counter respects the user's `prefers-reduced-motion` preference — animation is skipped if the user has opted out of motion

### Security & Privacy

- NFR6: The application is served exclusively over HTTPS
- NFR7: No personally identifiable information (PII) is collected, transmitted, or stored at any point
- NFR8: No third-party analytics or tracking scripts are loaded in V1
- NFR9: `localStorage` is used only for language preference — no sensitive data is persisted client-side

### Accessibility

- NFR10: The application meets WCAG 2.1 Level AA compliance
- NFR11: All interactive elements (sliders, language dropdown, anchor links, CTAs) are fully operable via keyboard alone
- NFR12: Colour contrast ratio meets at minimum 4.5:1 for normal text and 3:1 for large text against the dark background
- NFR13: The language switcher announces the language change to screen reader users

### Integration

- NFR14: When the ANRE live fetch fails or times out, the fallback fuel prices displayed must have been manually verified within the last 90 days
- NFR15: The ANRE fallback state must visibly indicate the date the reference prices were last verified — users must never see prices without knowing their source date
- NFR16: The operator tariff data file (`operators.json`) must conform to a defined schema; a malformed file must cause the build to fail rather than deploy silently broken data
