export type FuelType = 'benzina95' | 'motorina' | 'gpl'
export type Region = 'centru_sud' | 'nord'
export type ChargingMode = 'public_ac' | 'public_dc'

export interface InputState {
  kmPerMonth: number // 300–3000
  fuelType: FuelType
  vehicleWeightKg: number // 500–5000
  chargingMode: ChargingMode
  region: Region
}

export interface SavingsResult {
  monthly: number
  annual: number
  fiveYear: number
  breakEvenMonths: number | null // null when savings are negligible
}

export interface PriceData {
  benzina95: number // MDL/litre
  motorina: number // MDL/litre
  gpl: number // MDL/litre
  lastVerified: string // ISO date string
  status: 'live' | 'fallback'
}

export interface OperatorTariff {
  region: Region
  acFromMDL: number // MDL/kWh
  dcFromMDL: number // MDL/kWh
}

export interface OperatorData {
  id: string
  name: string
  variant: 'full' | 'placeholder'
  lastVerified: string
  tariffs?: OperatorTariff[] // only on 'full' variant
  appStoreUrl?: string
  playStoreUrl?: string
  appUrl?: string // generic app URL for placeholder variant
}
