# Story 2.1: Define Shared Types and Data Files

Status: ready-for-dev

## Story

As a developer,
I want all shared TypeScript types, calculation data files, and the typed road tax table in place,
so that all subsequent components have a single type contract to build against with no duplication.

## Acceptance Criteria

1. `src/lib/types.ts` exports: `FuelType`, `Region`, `ChargingMode`, `InputState`, `SavingsResult`, `PriceData`, `OperatorData` — all as named exports.
2. `src/data/anre.json` exists with hardcoded `benzina95`, `motorina`, `gpl` prices in MDL and a `lastVerified` ISO date string.
3. `src/data/roadTax.ts` exists as a typed `const` bracket table — weight ranges map to MDL/year for both EV and ICE.
4. `src/lib/anreFetch.ts` exists as a V1 stub: exports an `async` function `fetchAnreData()` that immediately returns the hardcoded `anre.json` data (no network call).
5. `npm run build` passes with zero TypeScript errors.
6. No type is defined outside `src/lib/types.ts` — no inline type declarations in component files.

## Tasks / Subtasks

- [ ] Create `src/lib/types.ts` (AC: 1, 6)
  - [ ] Define and export all 7 types — see exact definitions in Dev Notes
- [ ] Create `src/data/anre.json` (AC: 2)
  - [ ] Populate with current Moldova fuel prices + `lastVerified` date
- [ ] Create `src/data/roadTax.ts` (AC: 3)
  - [ ] Define typed const bracket table — see Dev Notes for schema
- [ ] Create `src/lib/anreFetch.ts` stub (AC: 4)
  - [ ] Implement V1 stub that imports and returns `anre.json` data
- [ ] Verify build (AC: 5)
  - [ ] `npm run build` — zero errors

## Dev Notes

### `src/lib/types.ts` — Complete Definition

```ts
export type FuelType = 'benzina95' | 'motorina' | 'gpl'
export type Region = 'centru_sud' | 'nord'
export type ChargingMode = 'public_ac' | 'public_dc'

export interface InputState {
  kmPerMonth: number        // 300–3000
  fuelType: FuelType
  vehicleWeightKg: number   // 500–5000
  chargingMode: ChargingMode
  region: Region
}

export interface SavingsResult {
  monthly: number
  annual: number
  fiveYear: number
  breakEvenMonths: number | null  // null when savings are negligible
}

export interface PriceData {
  benzina95: number   // MDL/litre
  motorina: number    // MDL/litre
  gpl: number         // MDL/litre
  lastVerified: string // ISO date string
  status: 'live' | 'fallback'
}

export interface OperatorTariff {
  region: Region
  acFromMDL: number   // MDL/kWh
  dcFromMDL: number   // MDL/kWh
}

export interface OperatorData {
  id: string
  name: string
  variant: 'full' | 'placeholder'
  lastVerified: string
  tariffs?: OperatorTariff[]        // only on 'full' variant
  appStoreUrl?: string
  playStoreUrl?: string
  appUrl?: string                   // generic app URL for placeholder variant
}
```

[Source: architecture.md#Shared Type Contract]

### `src/data/anre.json` — Initial Values

```json
{
  "benzina95": 29.38,
  "motorina": 30.13,
  "gpl": 14.50,
  "lastVerified": "2026-04-30"
}
```

Prices sourced from `moldova-ev-market-data.json`. The `status` field is NOT stored in the JSON — it is computed at runtime by `anreFetch.ts` (always `'fallback'` in V1).

[Source: _bmad-output/planning-artifacts/moldova-ev-market-data.json]

### `src/data/roadTax.ts` — Bracket Table Schema

Moldova road tax is calculated per `lei/kg` per bracket. Both EV and ICE use the same bracket table (the EV=ICE tax myth is literally true in Moldova law). Structure:

```ts
// src/data/roadTax.ts
export interface RoadTaxBracket {
  minKg: number
  maxKg: number          // use Infinity for the last bracket
  ratePerKg: number      // MDL per kg per year
}

export const roadTaxBrackets: RoadTaxBracket[] = [
  { minKg: 0,    maxKg: 1000, ratePerKg: 0.25 },
  { minKg: 1001, maxKg: 1500, ratePerKg: 0.30 },
  { minKg: 1501, maxKg: 2000, ratePerKg: 0.40 },
  { minKg: 2001, maxKg: 2500, ratePerKg: 0.50 },
  { minKg: 2501, maxKg: Infinity, ratePerKg: 0.60 },
]
```

> ⚠️ Verify exact bracket thresholds and rates against `moldova-ev-market-data.json` before finalising. The values above are illustrative — use the research data as the authoritative source.

[Source: _bmad-output/planning-artifacts/moldova-ev-market-data.json]

### `src/lib/anreFetch.ts` — V1 Stub

```ts
// src/lib/anreFetch.ts
import anreData from '../data/anre.json'
import type { PriceData } from './types'

export async function fetchAnreData(): Promise<PriceData> {
  // V1: always returns hardcoded fallback — no network call
  // V2: replace this implementation with real fetch + AbortController timeout
  return {
    benzina95: anreData.benzina95,
    motorina: anreData.motorina,
    gpl: anreData.gpl,
    lastVerified: anreData.lastVerified,
    status: 'fallback',
  }
}
```

The async signature is intentional — it means V2 can replace the body with a real fetch without changing any call site in `App.tsx`.

[Source: architecture.md#ANRE Fetch Strategy]

### What This Story Does NOT Do

- Does NOT implement any calculation logic (Story 2.2)
- Does NOT implement `App.tsx` state (Story 2.3)
- Does NOT create `operators.json` (Story 3.1)
- The `OperatorData` type is defined here so it is available to Story 3.1 without a type refactor later

### Project Structure Notes

Files created:
- `src/lib/types.ts` (new — replaces `.gitkeep` in `src/lib/`)
- `src/lib/anreFetch.ts` (new)
- `src/data/anre.json` (new — replaces `.gitkeep` in `src/data/`)
- `src/data/roadTax.ts` (new)

### References

- [Source: architecture.md#Shared Type Contract] — full type definitions
- [Source: architecture.md#ANRE Fetch Strategy] — stub pattern rationale
- [Source: architecture.md#Project Structure] — file locations
- [Source: moldova-ev-market-data.json] — authoritative price and tax bracket data
- [Source: epics.md#Story 2.1] — acceptance criteria

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
