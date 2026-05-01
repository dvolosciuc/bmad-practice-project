import { useTranslation } from 'react-i18next'

interface CO2SectionProps {
  co2AnnualKg: number
}

export default function CO2Section({ co2AnnualKg }: CO2SectionProps) {
  const { t } = useTranslation()
  const trees = Math.max(0, Math.round(co2AnnualKg / 21.7))

  return (
    <section id="co2" className="py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('co2.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-4">{t('co2.sectionTitle')}</h2>
        {trees > 0 ? (
          <p className="text-2xl text-ev-text">{t('co2.treesEquivalent', { count: trees })}</p>
        ) : (
          <p className="text-ev-muted">{t('co2.negligible')}</p>
        )}
      </div>
    </section>
  )
}
