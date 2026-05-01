import { useTranslation } from 'react-i18next'
import type { OperatorData } from '../lib/types'
import OperatorCard from './OperatorCard'

interface ChargingSectionProps {
  operators: OperatorData[]
}

export default function ChargingSection({ operators }: ChargingSectionProps) {
  const { t } = useTranslation()
  return (
    <section id="charging" className="py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('charging.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('charging.sectionTitle')}</h2>
        <div className="flex flex-col gap-4">
          {operators.map((operator) => (
            <OperatorCard key={operator.id} operator={operator} />
          ))}
        </div>
      </div>
    </section>
  )
}
