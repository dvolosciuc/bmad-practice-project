export interface RoadTaxBracket {
  minKg: number
  maxKg: number // use Infinity for the last bracket
  ratePerKg: number // MDL per kg per year
}

// Source: Moldova Fiscal Code Title IX — electric passenger cars (from 2026)
// Basis: masa totală autorizată (maximum authorised mass), MDL per kg annually
// Verified: contabilsef.md/taxele-rutiere-2 (2026 column)
export const evRoadTaxBrackets: RoadTaxBracket[] = [
  { minKg: 1, maxKg: 1500, ratePerKg: 0.6 },
  { minKg: 1501, maxKg: 2500, ratePerKg: 0.9 },
  { minKg: 2501, maxKg: 3500, ratePerKg: 1.2 },
  { minKg: 3501, maxKg: 4500, ratePerKg: 1.5 },
  { minKg: 4501, maxKg: Infinity, ratePerKg: 1.5 },
]

/** @deprecated Use evRoadTaxBrackets directly */
export const roadTaxBrackets = evRoadTaxBrackets

export interface IceRoadTaxBracket {
  minCm3: number
  maxCm3: number // use Infinity for the last bracket
  ratePerCm3: number // MDL per cm³ per year
}

// Source: Moldova Fiscal Code Title IX — ICE passenger cars (autoturisme)
// Basis: capacitate cilindrică a motorului (engine displacement), MDL per cm³ annually
// No differentiation by fuel type (benzina/motorina/gpl) or production year in current code
// Verified: contabilsef.md/taxele-rutiere-2 (2022–2026 columns, unchanged)
export const iceRoadTaxBrackets: IceRoadTaxBracket[] = [
  { minCm3: 1, maxCm3: 2000, ratePerCm3: 0.6 },
  { minCm3: 2001, maxCm3: 3000, ratePerCm3: 0.9 },
  { minCm3: 3001, maxCm3: 4000, ratePerCm3: 1.2 },
  { minCm3: 4001, maxCm3: 5000, ratePerCm3: 1.5 },
  { minCm3: 5001, maxCm3: Infinity, ratePerCm3: 1.8 },
]
