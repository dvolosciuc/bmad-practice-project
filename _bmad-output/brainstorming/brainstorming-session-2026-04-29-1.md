---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/moldova-ev-market-data.json
session_topic: 'Single-page React app for EV ownership overview in Moldova'
session_goals: 'Generate ideas for features, UX, content, business model, and differentiation for an EV cost/benefit app covering: public charging prices, road tax calculation, savings vs ICE cars, CO2 savings'
selected_approach: 'Progressive Technique Flow'
techniques_used:
  - phase1: 'What If Scenarios (6 volleys, 56 provocations)'
  - phase2: 'Mind Mapping (9 clusters, 40 confirmed ideas)'
  - phase3: 'SCAMPER Method (Savings section + Operator table)'
  - phase4: 'Six Thinking Hats (V1 scope decision)'
ideas_confirmed: 59
session_status: COMPLETE
output_artifact: '_bmad-output/planning-artifacts/moldova-ev-market-data.json'
context_file: '_bmad-output/planning-artifacts/moldova-ev-market-data.json'
---

## Session Overview

**Topic:** Single-page React app — EV ownership in Moldova
**Goals:** Ideate features, UX patterns, data visualisations, content structure, and potential differentiators for an app that helps Moldovan users understand the real cost and environmental benefit of owning an EV.
**Date:** 29 April 2026
**Approach:** Progressive Technique Flow — What If Scenarios → Mind Mapping → SCAMPER → Six Thinking Hats

### Context Loaded

- Fuel prices (ANRE, 29 Apr 2026): benzina 95 = 29.38 MDL/L, motorina = 30.13 MDL/L
- EVPoint tariffs: Centru/Sud AC from 7.44 MDL/EV, DC from 9.48 MDL/EV; Nord AC from 7.80, DC from 10.44
- Road tax: weight-bracket table (0.6–1.8 MDL/kg/year)
- Active operators confirmed: EVPoint, eCharge Moldova, EVGP (demoted), ekofactor, eco drive, go to-u (tariffs unknown)

---

## Phase 1 — Confirmed Ideas (59 total)

### Volleys 1–6: What If Scenarios

| # | Idea | Status |
|---|---|---|
| 1 | Dynamic monthly saving reflects current ANRE week's fuel prices | ✅ |
| 2 | Narrative framing: "You drove X km, that cost you Y MDL. An EV: Z MDL" | ✅ |
| 3 | Sensible defaults shown immediately, user adjusts from there | ✅ |
| 5 | CO₂ visualised as trees planted / km of forest | ✅ |
| 8 | Monthly AND 5-year savings totals side by side | ✅ |
| 12 | One dominant bold number: "You'd save X MDL/month" | ✅ |
| 13 | Break-even point: "Your EV pays for itself vs ICE in X years" | ✅ |
| 14 | Pure vertical single-scroll — no tabs, no routing | ✅ |
| 15 | "What changed this week" banner for ANRE price movements | ✅ |
| 16 | Fuel type selector: benzina 95 / motorina / GPL | ✅ |
| 17 | Road tax EV vs ICE side by side (same weight = same tax — no exemption) | ✅ |
| 18 | Charging mode: public stations vs. home charging | ✅ |
| 19 | "?" tooltips on all calculated values | ✅ |
| 20 | Defaults: 7 L/100km ICE · 18 kWh/100km EV · 1,200 km/month | ✅ |
| 21 | "Last verified: [date]" per data source | ✅ |
| 22 | Section summary lines: e.g. "You'd save ~2,400 MDL/month on fuel alone" | ✅ |
| 24 | Break-even includes maintenance savings (~500 MDL/year fixed estimate) | ✅ |
| 26 | All inputs as sliders | ✅ |
| 27 | Live recalculation — no "Calculate" button | ✅ |
| 28 | Dark background · electric green/teal accents | ✅ |
| 29 | Oversized bold typography for savings figure | ✅ |
| 30 | Languages: RO / RU / EN via dropdown | ✅ |
| 31 | Direct, provocative copy: "You're burning X MDL you don't have to" | ✅ |
| 36 | Next-steps CTA: direct App Store / Play Store links for all operators | ✅ |
| 38 | Header: 4 anchor links in scroll order — Încărcare · Taxe · Economii · CO₂ | ✅ |
| 39 | Transparent header on scroll-top → solid on scroll-down | ✅ |
| 40 | All content fully localizable (labels, units, copy) | ✅ |
| 41 | Charging section: operator cards/table for all Moldova operators | ✅ |
| 42 | Highlight most expensive fuel type dynamically based on ANRE data | ✅ |
| 43 | Generic defaults shown on load; user can override with their values | ✅ |
| 44 | Expandable "What is masa totală autorizată?" explainer in tax section | ✅ |
| 45 | Data freshness policy: "Last verified [date]" — manually maintained | ✅ |
| 46 | Next steps as checklist: ☐ Download EVPoint · ☐ Download eCharge · etc. | ✅ |
| 48 | Language switcher: dropdown (RO / RU / EN) | ✅ |
| 49 | Fuel prices: client-side fetch from ANRE on app load (with hardcoded fallback) | ✅ |
| 51 | Static hosting: Netlify or GitHub Pages | ✅ |
| 52 | Helper text below sliders ("Average Moldovan driver: 1,200 km/month") | ✅ |
| 53 | Tax section hint: "Find masa totală autorizată on your registration certificate (talon)" | ✅ |
| 54 | Savings: 3 stat boxes — Monthly · Annual · 5-Year | ✅ |
| 55 | Footer: data sources · last-updated date · one-line about | ✅ |
| 56 | Smooth scroll on anchor clicks (CSS scroll-behavior: smooth) | ✅ |
| 57 | Animated counter: savings number counts up from 0 on scroll into view | ✅ |
| 58 | Loss aversion framing: "You're losing X MDL/month by not switching" | ✅ |
| 59 | Operator display as cards: logo · tariff · "download app" CTA per operator | ✅ |

---

## Phase 2 — Mind Map Clusters

| Cluster | Theme | Key ideas |
|---|---|---|
| 1 | Page Structure & Layout | vertical scroll · 4-anchor header · transparent→solid header · smooth scroll |
| 2 | Inputs & Interactivity | sliders · live calc · defaults with helpers · fuel type · charging mode · highlight expensive fuel |
| 3 | Charging Section | operator cards · "what changed" banner · last-verified · tooltips · monthly+5yr |
| 4 | Road Tax Section | EV=ICE explainer · masa explainer · talon hint |
| 5 | Savings Section | loss framing · animated counter · big bold number · narrative · 3 stat boxes · break-even |
| 6 | CO₂ Section | trees/km visual · bottom of page (least priority for Moldovan audience) |
| 7 | Next Steps & Footer | checklist CTAs · app store links · footer sources/dates |
| 8 | Visual Design & Tone | dark/teal · oversized numbers · provocative copy · localizable |
| 9 | Technical & Hosting | client-side ANRE fetch · hardcoded fallback · static deploy |

---

## Phase 3 — SCAMPER Additions

**Savings section:**
- **Animate (M):** Counter animates from 0 on scroll-into-view → confirmed [57]
- **Reverse (R):** Loss aversion framing "you're losing X MDL/month" → confirmed [58]
- **Combine (C):** Break-even timeline bar + combined total cost of ownership figure → noted for v2
- **Adapt (A):** Narrative text adapts per fuel type (GPL vs benzina vs motorina) → v1 nice-to-have

**Operator section:**
- **Substitute (S):** Cards instead of table → confirmed [59]
- **Modify (M):** "Tariff not publicly listed — see app" badge for unknown operators → confirmed design pattern
- **Eliminate (E):** V1 shows EVPoint full detail + others as coming-soon cards → confirmed V1 scope

---

## Phase 4 — Six Hats: V1 Scope Decision

### ✅ V1 — Build Now

| Feature | Notes |
|---|---|
| Core inputs | km/month · fuel type · weight · charge mode — all sliders, live calc |
| Savings section | Loss framing · animated counter · 3 stat boxes · break-even incl. maintenance |
| Charging section | EVPoint full cards (tariff by region) · eCharge/ekofactor/eco drive/go to-u as "tariff not listed" cards |
| Tax section | Calculator · EV=ICE side-by-side · masa explainer · talon hint |
| CO₂ section | Trees/km visualisation · bottom of page |
| Next steps | App download CTAs for all operators |
| Header | 4 anchors (scroll order) · language dropdown (RO + EN in v1) |
| ANRE live fetch | Client-side on load · hardcoded fallback · "using cached prices from [date]" on failure |
| Visual design | Dark background · electric teal · oversized numbers · provocative copy |
| Static deploy | Netlify |

### 🔜 V2 — After Operator Research

- Full tariff cards for eCharge, ekofactor, eco drive, go to-u (pending tariff research)
- RU language
- Home charging mode calculator
- Break-even timeline visualisation bar

---

## Research Gaps (Must Resolve Before Build)

| Operator | Status | Action needed |
|---|---|---|
| ekofactor | Tariff unknown | Research website / app / direct contact |
| eco drive | Tariff unknown | Research website / app / direct contact |
| go to-u | Tariff unknown | Research website / app / direct contact |
| eCharge Moldova | App-only pricing | Note as "see app" in v1; attempt in-app tariff capture for v2 |

---

## Next Step

→ **Proceed to PRD creation** using `bmad-create-prd` skill with this session as primary input.
