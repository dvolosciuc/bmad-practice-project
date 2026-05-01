import anreData from '../data/anre.json'
import type { PriceData } from './types'

// V1: always returns hardcoded fallback — no network call
// V2: replace this implementation with real fetch + AbortController timeout
export async function fetchAnreData(): Promise<PriceData> {
  return {
    benzina95: anreData.benzina95,
    motorina: anreData.motorina,
    gpl: anreData.gpl,
    lastVerified: anreData.lastVerified,
    status: 'fallback',
  }
}
