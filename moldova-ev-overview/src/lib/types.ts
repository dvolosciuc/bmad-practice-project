export type FuelType = 'benzina95' | 'motorina' | 'gpl'
export type Region = 'centru_sud' | 'nord' | 'nationwide'
export type ChargingMode = 'home_ac' | 'public_ac' | 'public_dc'

export interface InputState {
  kmPerMonth: number // 300–3000
  fuelType: FuelType
  vehicleWeightKg: number // 500–5000 — EV road tax basis
  engineCm3: number // 600–5000 — ICE road tax basis
  chargingMode: ChargingMode
  region: Region
}

export interface SavingsResult {
  monthly: number
  annual: number
  fiveYear: number
}

export interface PriceData {
  benzina95: number // MDL/litre
  motorina: number // MDL/litre
  gpl: number // MDL/litre
  lastVerified: string // ISO date string
  status: 'live' | 'fallback'
}

export interface OperatorTariff {
  region: string // display key: centru_sud | nord | nationwide
  acFromMDL: number // MDL/kWh
  acNightFromMDL?: number // MDL/kWh — optional night/off-peak tariff
  dcFromMDL?: number // MDL/kWh — optional (some operators AC only)
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
