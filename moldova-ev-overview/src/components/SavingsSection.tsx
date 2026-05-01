import { useTranslation } from 'react-i18next'
import type { SavingsResult } from '../lib/types'
import StatGrid from './StatGrid'
import SavingsCounter from './SavingsCounter'

interface SavingsSectionProps {
  savingsResult: SavingsResult
}

export default function SavingsSection({ savingsResult }: SavingsSectionProps) {
  const { t } = useTranslation()
  return (
    <section id="savings" className="py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('savings.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('savings.sectionTitle')}</h2>

        <SavingsCounter targetValue={savingsResult.monthly} />

        <StatGrid savingsResult={savingsResult} />

        {savingsResult.breakEvenMonths !== null ? (
          <p className="text-sm text-ev-muted mt-4">
            {t('savings.breakEven', { months: savingsResult.breakEvenMonths })}
          </p>
        ) : (
          <p className="text-sm text-ev-muted mt-4">{t('savings.negligible')}</p>
        )}
      </div>
    </section>
  )
}
