import { useTranslation } from 'react-i18next'
import type { OperatorData } from '../lib/types'
import OperatorCard from './OperatorCard'
import { useInView } from '../lib/useInView'

interface ChargingSectionProps {
  operators: OperatorData[]
}

export default function ChargingSection({ operators }: ChargingSectionProps) {
  const { t } = useTranslation()
  const [ref] = useInView()
  const [listRef] = useInView()
  return (
    <section
      id="charging"
      ref={ref as React.RefObject<HTMLElement>}
      className="section-enter py-10 md:py-14 lg:py-16 bg-ev-bg"
    >
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('charging.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('charging.sectionTitle')}</h2>
        <div ref={listRef as React.RefObject<HTMLDivElement>} className="stagger-enter flex flex-col gap-4">
          {operators.map((operator) => (
            <OperatorCard key={operator.id} operator={operator} />
          ))}
        </div>
      </div>
    </section>
  )
}
