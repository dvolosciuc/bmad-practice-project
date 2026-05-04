import { useTranslation } from 'react-i18next'
import type { OperatorData } from '../lib/types'

interface NextStepsSectionProps {
  operators: OperatorData[]
}

const BTN = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm min-h-[40px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ev-bg'
const BTN_PRIMARY = `${BTN} bg-ev-accent text-ev-bg hover:bg-ev-accent-hover`
const BTN_OUTLINE = `${BTN} border border-ev-accent text-ev-accent hover:bg-ev-accent/10`

export default function NextStepsSection({ operators }: NextStepsSectionProps) {
  const { t } = useTranslation()
  return (
    <section id="next-steps" className="py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('nextSteps.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('nextSteps.sectionTitle')}</h2>
        <div className="flex flex-col gap-4">
          {operators.map((op) => (
            <div key={op.id} className="bg-ev-surface rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="font-semibold text-ev-text min-w-[140px]">{op.name}</span>
              <div className="flex flex-wrap gap-2">
                {op.appStoreUrl && (
                  <a href={op.appStoreUrl} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
                    {t('nextSteps.ios')}
                  </a>
                )}
                {op.playStoreUrl && (
                  <a href={op.playStoreUrl} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
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
