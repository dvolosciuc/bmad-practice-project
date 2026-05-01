# Story 3.1: Define and Validate operators.json Schema

Status: ready-for-dev

## Story

As Andrei (the maintainer),
I want the operator tariff data structured in a typed `operators.json` with TypeScript schema enforcement at build time,
so that a malformed tariff file causes the build to fail rather than deploying silently broken data.

## Acceptance Criteria

1. `src/data/operators.json` exists with entries for all 5 operators: EVPoint (full), eCharge, ekofactor, eco drive, go to-u (placeholder).
2. Each entry conforms to `OperatorData` type from `src/lib/types.ts`.
3. EVPoint has two `tariffs` entries: `centru_sud` (AC 7.44, DC 9.48) and `nord` (AC 7.80, DC 10.44).
4. EVPoint has `appStoreUrl` and `playStoreUrl` fields.
5. Placeholder operators have `appUrl` fields (their app/website link) and no `tariffs`.
6. A TypeScript import assertion (`operators.json` as `OperatorData[]`) in `App.tsx` or a data loader causes `npm run build` to fail when `operators.json` contains a type error.
7. Each operator entry has a `lastVerified` ISO date string.

## Tasks / Subtasks

- [ ] Create `src/data/operators.json` (AC: 1–5, 7)
  - [ ] Populate all 5 operators with correct data from `moldova-ev-market-data.json`
  - [ ] Verify EVPoint tariff values match research data
- [ ] Add TypeScript import assertion in `App.tsx` (AC: 6)
  - [ ] Import operators with type cast: `import operatorsRaw from './data/operators.json'`
  - [ ] Cast to `OperatorData[]` and verify TypeScript accepts it; introduce a deliberate error to confirm build failure
- [ ] Update `App.tsx` to pass `operators` as prop (AC: 6)
  - [ ] Store typed `operators` in a module-level const (not state)

## Dev Notes

### operators.json Full Structure

```json
[
  {
    "id": "evpoint",
    "name": "EVPoint",
    "variant": "full",
    "lastVerified": "2026-04-30",
    "tariffs": [
      { "region": "centru_sud", "acFromMDL": 7.44, "dcFromMDL": 9.48 },
      { "region": "nord", "acFromMDL": 7.8, "dcFromMDL": 10.44 }
    ],
    "appStoreUrl": "https://apps.apple.com/app/evpoint/id...",
    "playStoreUrl": "https://play.google.com/store/apps/details?id=..."
  },
  {
    "id": "echarge",
    "name": "eCharge",
    "variant": "placeholder",
    "lastVerified": "2026-04-30",
    "appUrl": "https://echarge.md"
  },
  {
    "id": "ekofactor",
    "name": "ekofactor",
    "variant": "placeholder",
    "lastVerified": "2026-04-30",
    "appUrl": "https://ekofactor.md"
  },
  {
    "id": "ecodrive",
    "name": "eco drive",
    "variant": "placeholder",
    "lastVerified": "2026-04-30",
    "appUrl": "https://ecodrive.md"
  },
  {
    "id": "gotou",
    "name": "go to-u",
    "variant": "placeholder",
    "lastVerified": "2026-04-30",
    "appUrl": "https://gotou.md"
  }
]
```

> ⚠️ Verify the actual App Store / Play Store URLs and placeholder app URLs from `moldova-ev-market-data.json`. The URLs above are illustrative.

[Source: moldova-ev-market-data.json, architecture.md#Project Structure]

### TypeScript Type Enforcement Pattern

In `App.tsx` (or a dedicated `src/data/index.ts` loader):

```ts
import operatorsRaw from './data/operators.json'
import type { OperatorData } from './lib/types'

// Type assertion — if operators.json doesn't match OperatorData[], this line errors at build time
const operators: OperatorData[] = operatorsRaw as unknown as OperatorData[]
```

> ⚠️ Vite imports JSON as `any` by default. The `as unknown as OperatorData[]` cast is a runtime-only assertion — it won't catch structural mismatches at build time on its own. To get a true compile-time check, use a satisfies assertion or a Zod schema. For V1 simplicity, use:

```ts
function assertOperators(data: unknown): asserts data is OperatorData[] {
  // Minimal runtime check — enough to catch obvious structural errors
  if (!Array.isArray(data)) throw new Error('operators.json must be an array')
}
assertOperators(operatorsRaw)
const operators = operatorsRaw as OperatorData[]
```

This gives a runtime crash (caught at deploy test) rather than silent bad data. [Source: prd.md#NFR16]

### Maintainer Update Workflow

When EVPoint changes tariffs, Andrei:

1. Opens `src/data/operators.json`
2. Updates `acFromMDL`, `dcFromMDL`, and `lastVerified` for the relevant entry
3. Commits and pushes to `main` — Netlify deploys in ~90 seconds

No other files need to change for a tariff update.

[Source: prd.md#Journey 3 — Andrei, the Data Maintainer]

### Project Structure Notes

Files created:

- `src/data/operators.json`

Files modified:

- `src/App.tsx` — import and type-assert operators data

### References

- [Source: prd.md#FR23] — maintainer updates operators.json without touching app code
- [Source: prd.md#NFR16] — malformed file must cause build to fail
- [Source: moldova-ev-market-data.json] — authoritative tariff values
- [Source: architecture.md#Project Structure] — operators.json location
- [Source: epics.md#Story 3.1] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
