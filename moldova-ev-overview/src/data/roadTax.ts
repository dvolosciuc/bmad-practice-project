export interface RoadTaxBracket {
  minKg: number
  maxKg: number // use Infinity for the last bracket
  ratePerKg: number // MDL per kg per year
}

// Source: Moldova Fiscal Code Title IX, Annex 2
// Rates provided by stakeholder (Dumitru Volosciuc)
// Annual tax = vehicleWeightKg × ratePerKg
export const roadTaxBrackets: RoadTaxBracket[] = [
  { minKg: 1, maxKg: 1500, ratePerKg: 0.6 },
  { minKg: 1501, maxKg: 2500, ratePerKg: 0.9 },
  { minKg: 2501, maxKg: 3500, ratePerKg: 1.2 },
  { minKg: 3501, maxKg: 4500, ratePerKg: 1.5 },
  { minKg: 4501, maxKg: Infinity, ratePerKg: 1.8 },
]
