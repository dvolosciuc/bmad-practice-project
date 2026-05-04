import { useTranslation } from 'react-i18next'
import { useInView } from '../lib/useInView'
import { useCountUp } from '../lib/useCountUp'

interface CO2SectionProps {
  co2AnnualKg: number
}

export default function CO2Section({ co2AnnualKg }: CO2SectionProps) {
  const { t } = useTranslation()
  const trees = Math.max(0, Math.round(co2AnnualKg / 21.7))
  const [ref, inView] = useInView()
  const animatedTrees = useCountUp(trees, inView, 1600)

  return (
    <section id="co2" ref={ref as React.RefObject<HTMLElement>} className="section-enter py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('co2.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-6">{t('co2.sectionTitle')}</h2>
        {trees > 0 ? (
          <div>
            <div className="flex items-end gap-5 flex-wrap mb-4">
              <span className="text-8xl lg:text-9xl font-extrabold text-ev-accent leading-none [font-variant-numeric:tabular-nums]">
                {animatedTrees}
              </span>
              <div className="pb-2">
                <p className="text-2xl font-semibold text-ev-text">{t('co2.treesLabel')}</p>
                <p className="text-ev-muted text-sm">{t('co2.treesSubline')}</p>
              </div>
            </div>
            <p className="text-sm text-ev-muted">{t('co2.kgEmissions', { kg: Math.round(co2AnnualKg) })}</p>
          </div>
        ) : (
          <p className="text-ev-muted">{t('co2.negligible')}</p>
        )}
      </div>
    </section>
  )
}
