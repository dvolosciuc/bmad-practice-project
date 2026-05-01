import type { FuelType, ChargingMode, Region, InputState, PriceData, SavingsResult } from './types'
import { roadTaxBrackets } from '../data/roadTax'

const ICE_CONSUMPTION_L_100KM = 7.0
const EV_CONSUMPTION_KWH_100KM = 18.0
const EV_AVERAGE_PREMIUM_MDL = 120000

const EV_TARIFFS: Record<ChargingMode, Record<Region, number>> = {
  public_ac: { centru_sud: 7.44, nord: 7.8 },
  public_dc: { centru_sud: 9.48, nord: 10.44 },
}

const CO2_PER_LITRE: Record<FuelType, number> = {
  benzina95: 2.31,
  motorina: 2.68,
  gpl: 1.63,
}

export function getRoadTax(weightKg: number): number {
  const bracket =
    roadTaxBrackets.find((b) => weightKg >= b.minKg && weightKg <= b.maxKg) ??
    roadTaxBrackets[0]
  return weightKg * bracket.ratePerKg
}

function calculateFuelCostPerMonth(
  kmPerMonth: number,
  fuelType: FuelType,
  prices: PriceData,
  consumptionL100km = ICE_CONSUMPTION_L_100KM,
): number {
  if (kmPerMonth <= 0) return 0
  const litresPerMonth = (kmPerMonth / 100) * consumptionL100km
  return litresPerMonth * prices[fuelType]
}

function calculateChargingCostPerMonth(
  kmPerMonth: number,
  chargingMode: ChargingMode,
  region: Region,
  evConsumptionkWh100km = EV_CONSUMPTION_KWH_100KM,
): number {
  if (kmPerMonth <= 0) return 0
  const kWhPerMonth = (kmPerMonth / 100) * evConsumptionkWh100km
  const tariff = EV_TARIFFS[chargingMode][region]
  return kWhPerMonth * tariff
}

export function calculateMonthlySavings(inputs: InputState, prices: PriceData): SavingsResult {
  const fuelCost = calculateFuelCostPerMonth(inputs.kmPerMonth, inputs.fuelType, prices)
  const chargingCost = calculateChargingCostPerMonth(
    inputs.kmPerMonth,
    inputs.chargingMode,
    inputs.region,
  )
  const monthly = Math.max(0, fuelCost - chargingCost)
  const annual = monthly * 12
  const fiveYear = monthly * 60
  const breakEvenMonths = calcBreakEven(monthly, EV_AVERAGE_PREMIUM_MDL)
  return { monthly, annual, fiveYear, breakEvenMonths }
}

export function calcCO2(kmPerMonth: number, fuelType: FuelType): number {
  if (kmPerMonth <= 0) return 0
  const litresPerMonth = (kmPerMonth / 100) * ICE_CONSUMPTION_L_100KM
  const kgCO2PerMonth = litresPerMonth * CO2_PER_LITRE[fuelType]
  return Math.round(kgCO2PerMonth * 12)
}

export function calcBreakEven(monthlySavings: number, evPremiumMDL: number): number | null {
  if (monthlySavings <= 0) return null
  return Math.ceil(evPremiumMDL / monthlySavings)
}
