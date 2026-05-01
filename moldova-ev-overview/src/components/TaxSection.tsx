import { useTranslation } from 'react-i18next'
import ProgressiveDisclosure from './ProgressiveDisclosure'

interface TaxSectionProps {
  vehicleWeightKg: number
  roadTaxAmount: number
}

export default function TaxSection({ vehicleWeightKg, roadTaxAmount }: TaxSectionProps) {
  const { t } = useTranslation()
  const formatted = new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: 'MDL',
    maximumFractionDigits: 0,
  }).format(roadTaxAmount)

  return (
    <section id="tax" className="py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('tax.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('tax.sectionTitle')}</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-ev-surface rounded-lg p-6 text-center">
            <p className="text-[13px] text-ev-muted mb-2">{t('tax.ev')}</p>
            <p className="text-3xl font-bold text-ev-accent">{formatted}</p>
            <p className="text-[13px] text-ev-muted mt-1">{t('tax.perYear')}</p>
          </div>
          <div className="bg-ev-surface rounded-lg p-6 text-center">
            <p className="text-[13px] text-ev-muted mb-2">{t('tax.ice')}</p>
            <p className="text-3xl font-bold text-ev-text">{formatted}</p>
            <p className="text-[13px] text-ev-muted mt-1">{t('tax.perYear')}</p>
          </div>
        </div>

        <p className="text-sm text-ev-muted mb-4">
          {t('tax.equalNote', { weight: vehicleWeightKg })}
        </p>

        <ProgressiveDisclosure summary={t('tax.masaQuestion')}>
          <p className="mb-2">{t('tax.masaExplainer')}</p>
          <p className="mb-2 font-medium text-ev-text">{t('tax.talonInstruction')}</p>
          <p className="text-ev-muted">{t('tax.talonHint')}</p>
        </ProgressiveDisclosure>
      </div>
    </section>
  )
}
