import { useTranslation } from 'react-i18next'
import type { SavingsResult } from '../lib/types'
import StatBox from './StatBox'

interface StatGridProps {
  savingsResult: SavingsResult
}

export default function StatGrid({ savingsResult }: StatGridProps) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatBox
        value={savingsResult.monthly}
        label={t('savings.monthly')}
        period={t('savings.perMonth')}
      />
      <StatBox
        value={savingsResult.annual}
        label={t('savings.annual')}
        period={t('savings.perYear')}
      />
      <StatBox
        value={savingsResult.fiveYear}
        label={t('savings.fiveYear')}
        period={t('savings.inFiveYears')}
      />
    </div>
  )
}
