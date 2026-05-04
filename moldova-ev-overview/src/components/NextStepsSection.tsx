import { useTranslation } from 'react-i18next'
import type { OperatorData } from '../lib/types'
import { useInView } from '../lib/useInView'

interface NextStepsSectionProps {
  operators: OperatorData[]
}

export default function NextStepsSection({ operators }: NextStepsSectionProps) {
  const { t } = useTranslation()
  const [ref] = useInView()
  const [listRef] = useInView()
  return (
    <section
      id="next-steps"
      ref={ref as React.RefObject<HTMLElement>}
      className="section-enter py-10 md:py-14 lg:py-16 bg-ev-surface"
    >
      <div className="max-w-[720px] mx-auto px-6">
        <h2 className="text-4xl font-bold text-ev-text mb-3">{t('nextSteps.payoffTitle')}</h2>
        <p className="text-ev-muted mb-8">{t('nextSteps.payoffBody')}</p>
        <div ref={listRef as React.RefObject<HTMLDivElement>} className="stagger-enter flex flex-col gap-4">
          {operators.map((op) => (
            <div key={op.id} className="bg-ev-surface rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="font-semibold text-ev-text min-w-[140px]">{op.name}</span>
              <div className="flex flex-wrap gap-2">
                {op.appStoreUrl && (
                  <a
                    href={op.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ev-bg"
                  >
                    {t('nextSteps.ios')}
                  </a>
                )}
                {op.playStoreUrl && (
                  <a
                    href={op.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-shimmer inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ev-bg"
                  >
                    {t('nextSteps.android')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
