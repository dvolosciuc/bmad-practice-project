import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { InputState, PriceData } from './lib/types'
import { calculateMonthlySavings, getEvRoadTax, getIceRoadTax, calcCO2 } from './lib/calculations'
import { fetchAnreData } from './lib/anreFetch'
import anreFallback from './data/anre.json'
import operatorsRaw from './data/operators.json'
import type { OperatorData } from './lib/types'
import StickyHeader from './components/StickyHeader'
import SliderGroup from './components/SliderGroup'
import LossHeadline from './components/LossHeadline'
import AnreFreshnessBanner from './components/AnreFreshnessBanner'
import ChargingSection from './components/ChargingSection'
import TaxSection from './components/TaxSection'
import SavingsSection from './components/SavingsSection'
import CO2Section from './components/CO2Section'
import NextStepsSection from './components/NextStepsSection'
import HeroOrbs from './components/HeroOrbs'
import MapSection from './components/MapSection'
import GridScan from './components/GridScan'
import { useInView } from './lib/useInView'

function CommunityBanner() {
  const { t } = useTranslation()
  const [ref] = useInView()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="section-enter py-10 md:py-14 lg:py-16 bg-ev-surface">
      <div className="max-w-[720px] mx-auto px-6 text-center">
        <p className="text-6xl font-bold text-ev-accent mb-2">{t('community.stat')}</p>
        <p className="text-lg font-semibold text-ev-text mb-3">{t('community.statLabel')}</p>
        <p className="text-ev-muted">{t('community.cta')}</p>
      </div>
    </section>
  )
}

function assertOperators(data: unknown): asserts data is OperatorData[] {
  if (!Array.isArray(data)) throw new Error('operators.json must be an array')
}
assertOperators(operatorsRaw)
const operators: OperatorData[] = operatorsRaw as OperatorData[]

const DEFAULT_INPUTS: InputState = {
  kmPerMonth: 1200,
  fuelType: 'benzina95',
  vehicleWeightKg: 1400,
  engineCm3: 1600,
  chargingMode: 'home_ac',
  region: 'centru_sud',
}

const DEFAULT_PRICES: PriceData = {
  benzina95: anreFallback.benzina95,
  motorina: anreFallback.motorina,
  gpl: anreFallback.gpl,
  lastVerified: anreFallback.lastVerified,
  status: 'fallback',
}

export default function App() {
  const [inputs, setInputs] = useState<InputState>(DEFAULT_INPUTS)
  const [priceData, setPriceData] = useState<PriceData>(DEFAULT_PRICES)

  useEffect(() => {
    fetchAnreData().then(setPriceData)
  }, [])

  const handleInputChange = <K extends keyof InputState>(key: K, value: InputState[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  // Derived values computed inline — no useEffect
  const savingsResult = calculateMonthlySavings(inputs, priceData)
  const roadTaxEV = getEvRoadTax(inputs.vehicleWeightKg)
  const roadTaxICE = getIceRoadTax(inputs.engineCm3)
  const co2Annual = calcCO2(inputs.kmPerMonth, inputs.fuelType)

  return (
    <div className="min-h-screen bg-ev-bg text-ev-text font-sans">
      <GridScan />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ev-accent focus:text-ev-bg focus:rounded-lg focus:ring-2 focus:ring-ev-bg font-medium"
      >
        Treci la conținut
      </a>
      <StickyHeader />
      <main id="main-content">
        {/* StickyHeader — Story 2.4 */}
        <section id="hero" className="hero-glow relative pt-12 pb-6 md:py-14 lg:py-16">
          <HeroOrbs />
          <div className="max-w-[720px] mx-auto px-6 flex flex-col gap-8">
            <LossHeadline monthlyLoss={savingsResult.monthly} />
            <AnreFreshnessBanner status={priceData.status} lastVerified={priceData.lastVerified} />
            <SliderGroup inputs={inputs} onChange={handleInputChange} />
          </div>
        </section>
        <SavingsSection savingsResult={savingsResult} />
        <CO2Section co2AnnualKg={co2Annual} />
        <CommunityBanner />
        <MapSection />
        <TaxSection
          vehicleWeightKg={inputs.vehicleWeightKg}
          roadTaxEV={roadTaxEV}
          engineCm3={inputs.engineCm3}
          roadTaxICE={roadTaxICE}
          onChange={handleInputChange}
        />
        <ChargingSection operators={operators} />
        <NextStepsSection />
      </main>
    </div>
  )
}

