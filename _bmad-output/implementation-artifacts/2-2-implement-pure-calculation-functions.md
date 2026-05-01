# Story 2.2: Implement Pure Calculation Functions

Status: ready-for-dev

## Story

As a developer,
I want all core calculation functions implemented as pure TypeScript functions with no React imports,
so that savings, road tax, CO₂, and break-even calculations can be verified independently of the UI.

## Acceptance Criteria

1. `calculateMonthlySavings(inputs, prices)` returns a correct `SavingsResult` for valid `InputState` and `PriceData`.
2. `getRoadTax(weightKg)` returns the correct annual MDL amount from the `roadTaxBrackets` table.
3. `calcCO2(kmPerMonth, fuelType)` returns annual CO₂ saving in kg.
4. `calcBreakEven(savingsPerMonth, evPremiumMDL)` returns months to break-even or `null` if savings ≤ 0.
5. Edge cases: 0 km/month → 0 savings; weight below minimum bracket → minimum bracket rate.
6. `src/lib/calculations.ts` contains zero React imports and no module-level mutable state.
7. `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [ ] Create `src/lib/calculations.ts` (AC: 1–7)
  - [ ] Implement `getRoadTax(weightKg: number): number`
  - [ ] Implement `calculateFuelCostPerMonth(kmPerMonth, fuelType, prices): number`
  - [ ] Implement `calculateChargingCostPerMonth(kmPerMonth, chargingMode, region, operators): number`
  - [ ] Implement `calculateMonthlySavings(inputs, prices): SavingsResult`
  - [ ] Implement `calcCO2(kmPerMonth, fuelType): number`
  - [ ] Implement `calcBreakEven(monthlySavings, evPremiumMDL): number | null`
  - [ ] Add edge case guards throughout
- [ ] Verify build (AC: 7)

## Dev Notes

### Key Calculation Logic

**Fuel cost per month (ICE):**

```ts
function calculateFuelCostPerMonth(
  kmPerMonth: number,
  fuelType: FuelType,
  prices: PriceData,
  consumptionL100km = 7.0
): number {
  const litresPerMonth = (kmPerMonth / 100) * consumptionL100km
  return litresPerMonth * prices[fuelType]
}
```

Default consumption 7L/100km is the app default. The slider in Story 2.5 controls `kmPerMonth` — consumption is fixed at 7L/100km in V1 (not a slider input). [Source: prd.md#V1 Must-Have — "Defaults: 7 L/100km ICE"]

**EV charging cost per month:**

```ts
function calculateChargingCostPerMonth(
  kmPerMonth: number,
  chargingMode: ChargingMode,
  region: Region,
  evConsumptionkWh100km = 18.0
): number {
  // evConsumptionkWh100km fixed at 18 kWh/100km in V1
  const kWhPerMonth = (kmPerMonth / 100) * evConsumptionkWh100km
  const tariff = getEvTariff(chargingMode, region) // from operators.json / const
  return kWhPerMonth * tariff
}
```

EV consumption fixed at 18 kWh/100km. [Source: prd.md#Defaults — "18 kWh/100km EV"]

**EVPoint tariffs (hardcode for calculation layer):**
Rather than importing `operators.json` into `calculations.ts`, define a small inline const for tariff lookup:

```ts
const EV_TARIFFS: Record<ChargingMode, Record<Region, number>> = {
  public_ac: { centru_sud: 7.44, nord: 7.8 },
  public_dc: { centru_sud: 9.48, nord: 10.44 },
}
```

These match `operators.json` EVPoint data. [Source: moldova-ev-market-data.json]

**`calculateMonthlySavings`:**

```ts
export function calculateMonthlySavings(inputs: InputState, prices: PriceData): SavingsResult {
  const fuelCost = calculateFuelCostPerMonth(inputs.kmPerMonth, inputs.fuelType, prices)
  const chargingCost = calculateChargingCostPerMonth(inputs.kmPerMonth, inputs.chargingMode, inputs.region)
  const monthly = Math.max(0, fuelCost - chargingCost)
  const annual = monthly * 12
  const fiveYear = monthly * 60
  const breakEvenMonths = calcBreakEven(monthly, EV_AVERAGE_PREMIUM_MDL)
  return { monthly, annual, fiveYear, breakEvenMonths }
}
```

**EV premium for break-even:** Use a constant `EV_AVERAGE_PREMIUM_MDL = 120000` (approximate premium over a comparable ICE vehicle in Moldova, in MDL). This is a V1 simplification — not user-configurable. [Source: prd.md#FR16 — break-even timeline]

**`getRoadTax`:**

```ts
export function getRoadTax(weightKg: number): number {
  const bracket = roadTaxBrackets.find((b) => weightKg >= b.minKg && weightKg <= b.maxKg) ?? roadTaxBrackets[0] // fallback to minimum bracket
  return weightKg * bracket.ratePerKg
}
```

**`calcCO2`:**
Use IPCC standard: petrol = 2.31 kg CO₂/litre, diesel = 2.68 kg CO₂/litre. EV CO₂ is context-dependent but for this tool, assume zero (Moldova's grid mix is not relevant — the tool is about financial savings, CO₂ is illustrative).

```ts
export function calcCO2(kmPerMonth: number, fuelType: FuelType): number {
  const CO2_PER_LITRE: Record<FuelType, number> = {
    benzina95: 2.31,
    motorina: 2.68,
    gpl: 1.63,
  }
  const litresPerMonth = (kmPerMonth / 100) * 7.0
  const kgCO2PerMonth = litresPerMonth * CO2_PER_LITRE[fuelType]
  return Math.round(kgCO2PerMonth * 12) // annual kg
}
```

### Critical Rules

- **Zero React imports** — this file must be usable in Node.js unit tests without React
- **No side effects** — no `console.log`, no module-level state mutation, no `fetch` calls
- **All functions pure** — same inputs always produce same outputs
- **No barrel exports** — import directly from `src/lib/calculations.ts` at call sites

[Source: architecture.md#Calculation Layer Rules]

### What This Story Does NOT Do

- Does NOT render any UI component
- Does NOT import from React or react-i18next
- Does NOT read from localStorage or window

### Project Structure Notes

Files created:

- `src/lib/calculations.ts` (new)

No other files modified.

### References

- [Source: architecture.md#Calculation Layer Rules] — pure functions, no React imports
- [Source: architecture.md#Shared Type Contract] — `InputState`, `SavingsResult`, `PriceData`
- [Source: prd.md#Defaults] — 7 L/100km, 18 kWh/100km defaults
- [Source: moldova-ev-market-data.json] — EVPoint tariff values
- [Source: epics.md#Story 2.2] — acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
