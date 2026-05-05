import { useTranslation } from 'react-i18next'
import type { SavingsResult } from '../lib/types'
import StatGrid from './StatGrid'
import SavingsCounter from './SavingsCounter'
import { useInView } from '../lib/useInView'

interface SavingsSectionProps {
  savingsResult: SavingsResult
}

const fmtMDL = (n: number) =>
  new Intl.NumberFormat('ro-MD', { style: 'currency', currency: 'MDL', maximumFractionDigits: 0 }).format(n)

export default function SavingsSection({ savingsResult }: SavingsSectionProps) {
  const { t } = useTranslation()
  const [ref] = useInView()
  return (
    <section
      id="savings"
      ref={ref as React.RefObject<HTMLElement>}
      className="section-enter py-10 md:py-14 lg:py-16 bg-ev-surface"
    >
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('savings.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('savings.sectionTitle')}</h2>

        {/* Featured 5-year callout — the showstopper */}
        <div className="glow-pulse relative rounded-2xl bg-ev-surface-2 border border-ev-accent/20 p-8 text-center overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-ev-accent/10 via-transparent to-transparent pointer-events-none" />
          <p className="relative text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-3">
            {t('savings.fiveYearFeaturedLabel')}
          </p>
          <p className="relative text-6xl sm:text-7xl lg:text-8xl font-extrabold text-ev-accent leading-none [font-variant-numeric:tabular-nums]">
            {fmtMDL(savingsResult.fiveYear)}
          </p>
        </div>

        <SavingsCounter targetValue={savingsResult.monthly} />

        <StatGrid savingsResult={savingsResult} />

        <div className="mt-6 rounded-xl border border-ev-accent/30 bg-ev-accent/5 px-5 py-4 flex gap-3 items-start">
          <span className="text-ev-accent text-lg leading-none mt-0.5" aria-hidden="true">
            ⚡
          </span>
          <p className="text-ev-text text-sm leading-relaxed">{t('savings.maintenanceNote')}</p>
        </div>
      </div>
    </section>
  )
}
