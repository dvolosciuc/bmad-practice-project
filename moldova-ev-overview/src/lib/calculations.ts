import type { FuelType, ChargingMode, Region, InputState, PriceData, SavingsResult } from './types'
import { evRoadTaxBrackets, iceRoadTaxBrackets } from '../data/roadTax'

const ICE_CONSUMPTION_L_100KM = 7.0
const EV_CONSUMPTION_KWH_100KM = 18.0

const EV_TARIFFS: Record<ChargingMode, Record<Region, number>> = {
  home_ac: { centru_sud: 3.56, nord: 3.56, nationwide: 3.56 },
  public_ac: { centru_sud: 7.44, nord: 7.8, nationwide: 7.44 },
  public_dc: { centru_sud: 9.48, nord: 10.44, nationwide: 9.48 },
}

const CO2_PER_LITRE: Record<FuelType, number> = {
  benzina95: 2.31,
  motorina: 2.68,
  gpl: 1.63,
}

/** EV road tax — based on masa totală autorizată (kg), Fiscal Code Title IX, from 2026 */
export function getEvRoadTax(weightKg: number): number {
  const bracket = evRoadTaxBrackets.find((b) => weightKg >= b.minKg && weightKg <= b.maxKg) ?? evRoadTaxBrackets[0]
  return weightKg * bracket.ratePerKg
}

/** @deprecated Use getEvRoadTax */
export const getRoadTax = getEvRoadTax

/** ICE road tax — based on engine displacement (cm³), Fiscal Code Title IX */
export function getIceRoadTax(engineCm3: number): number {
  const bracket =
    iceRoadTaxBrackets.find((b) => engineCm3 >= b.minCm3 && engineCm3 <= b.maxCm3) ?? iceRoadTaxBrackets[0]
  return engineCm3 * bracket.ratePerCm3
}

function calculateFuelCostPerMonth(
  kmPerMonth: number,
  fuelType: FuelType,
  prices: PriceData,
  consumptionL100km = ICE_CONSUMPTION_L_100KM
): number {
  if (kmPerMonth <= 0) return 0
  const litresPerMonth = (kmPerMonth / 100) * consumptionL100km
  return litresPerMonth * prices[fuelType]
}

function calculateChargingCostPerMonth(
  kmPerMonth: number,
  chargingMode: ChargingMode,
  region: Region,
  evConsumptionkWh100km = EV_CONSUMPTION_KWH_100KM
): number {
  if (kmPerMonth <= 0) return 0
  const kWhPerMonth = (kmPerMonth / 100) * evConsumptionkWh100km
  const tariff = EV_TARIFFS[chargingMode][region]
  return kWhPerMonth * tariff
}

export function calculateMonthlySavings(inputs: InputState, prices: PriceData): SavingsResult {
  const fuelCost = calculateFuelCostPerMonth(inputs.kmPerMonth, inputs.fuelType, prices)
  const chargingCost = calculateChargingCostPerMonth(inputs.kmPerMonth, inputs.chargingMode, inputs.region)
  const monthly = Math.max(0, fuelCost - chargingCost)
  const annual = monthly * 12
  const fiveYear = monthly * 60
  return { monthly, annual, fiveYear }
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
