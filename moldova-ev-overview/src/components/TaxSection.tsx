import { useTranslation } from 'react-i18next'
import type { InputState } from '../lib/types'
import SliderInput from './SliderInput'
import ProgressiveDisclosure from './ProgressiveDisclosure'
import { useInView } from '../lib/useInView'

interface TaxSectionProps {
  vehicleWeightKg: number
  roadTaxEV: number
  engineCm3: number
  roadTaxICE: number
  onChange: <K extends keyof InputState>(key: K, value: InputState[K]) => void
}

export default function TaxSection({ vehicleWeightKg, roadTaxEV, engineCm3, roadTaxICE, onChange }: TaxSectionProps) {
  const { t } = useTranslation()
  const [ref] = useInView()
  const fmt = (n: number) =>
    new Intl.NumberFormat('ro-MD', { style: 'currency', currency: 'MDL', maximumFractionDigits: 0 }).format(n)

  return (
    <section
      id="tax"
      ref={ref as React.RefObject<HTMLElement>}
      className="section-enter py-10 md:py-14 lg:py-16 bg-ev-surface"
    >
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('tax.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('tax.sectionTitle')}</h2>

        <div className="flex flex-col gap-6 mb-8">
          <SliderInput
            id="engine-displacement"
            label={t('slider.engineCm3')}
            value={engineCm3}
            min={600}
            max={5000}
            step={100}
            unit="cm³"
            hint={t('slider.engineCm3Hint')}
            onChange={(v) => onChange('engineCm3', v)}
            ariaValueText={`${engineCm3} cm³`}
          />
          <SliderInput
            id="vehicle-weight"
            label={t('slider.vehicleWeight')}
            value={vehicleWeightKg}
            min={500}
            max={5000}
            step={50}
            unit="kg"
            hint={t('slider.vehicleWeightHint')}
            onChange={(v) => onChange('vehicleWeightKg', v)}
            ariaValueText={`${vehicleWeightKg} kg`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-ev-surface-2 rounded-xl p-6 text-center border border-ev-accent/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ev-accent/10 via-transparent to-transparent pointer-events-none" />
            <p className="relative text-[11px] uppercase tracking-widest text-ev-accent font-semibold mb-2">
              {t('tax.ev')}
            </p>
            <p className="relative text-3xl font-bold text-ev-accent">{fmt(roadTaxEV)}</p>
            <p className="relative text-[13px] text-ev-muted mt-1">{t('tax.perYear')}</p>
            <p className="relative text-[11px] text-ev-muted mt-2 opacity-70">
              {t('tax.evBasis', { weight: vehicleWeightKg })}
            </p>
          </div>
          <div className="bg-ev-surface-2 rounded-xl p-6 text-center border border-ev-surface-2">
            <p className="text-[11px] uppercase tracking-widest text-ev-muted font-semibold mb-2">{t('tax.ice')}</p>
            <p className="text-3xl font-bold text-ev-muted">{fmt(roadTaxICE)}</p>
            <p className="text-[13px] text-ev-muted mt-1">{t('tax.perYear')}</p>
            <p className="text-[11px] text-ev-muted mt-2 opacity-70">{t('tax.iceBasis', { cm3: engineCm3 })}</p>
          </div>
        </div>

        <p className="text-sm text-ev-muted mb-4">{t('tax.basisNote')}</p>

        <ProgressiveDisclosure summary={t('tax.masaQuestion')}>
          <p className="mb-2">{t('tax.masaExplainer')}</p>
          <p className="mb-2 font-medium text-ev-text">{t('tax.talonInstruction')}</p>
          <p className="text-ev-muted">{t('tax.talonHint')}</p>
        </ProgressiveDisclosure>
      </div>
    </section>
  )
}
