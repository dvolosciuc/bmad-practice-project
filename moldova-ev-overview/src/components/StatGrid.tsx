import { useTranslation } from 'react-i18next'
import type { SavingsResult } from '../lib/types'
import StatBox from './StatBox'
import { useInView } from '../lib/useInView'

interface StatGridProps {
  savingsResult: SavingsResult
}

export default function StatGrid({ savingsResult }: StatGridProps) {
  const { t } = useTranslation()
  const [ref] = useInView()
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="stagger-enter grid grid-cols-2 gap-4">
      <StatBox value={savingsResult.monthly} label={t('savings.monthly')} period={t('savings.perMonth')} />
      <StatBox value={savingsResult.annual} label={t('savings.annual')} period={t('savings.perYear')} />
    </div>
  )
}
