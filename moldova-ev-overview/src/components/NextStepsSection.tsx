import { useTranslation } from 'react-i18next'
import { useInView } from '../lib/useInView'

const EV_999_URL = 'https://999.md/ro/list/transport/cars?o_4_151=12617'

export default function NextStepsSection() {
  const { t } = useTranslation()
  const [ref] = useInView()
  return (
    <section
      id="next-steps"
      ref={ref as React.RefObject<HTMLElement>}
      className="section-enter py-10 md:py-14 lg:py-16 bg-ev-surface"
    >
      <div className="max-w-[720px] mx-auto px-6">
        <h2 className="text-4xl font-bold text-ev-text mb-3">{t('nextSteps.payoffTitle')}</h2>
        <p className="text-ev-muted mb-6">{t('nextSteps.payoffBody')}</p>

        {/* 999.md EV listings card */}
        <div className="rounded-xl border border-ev-accent/30 bg-ev-surface-2 overflow-hidden">
          <div className="px-5 pt-5 pb-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-1">999.md</p>
              <h3 className="text-lg font-semibold text-ev-text">{t('nextSteps.find999Title')}</h3>
              <p className="text-ev-muted text-sm mt-1">{t('nextSteps.find999Body')}</p>
            </div>
            <a
              href={EV_999_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer flex-shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ev-bg"
            >
              {t('nextSteps.find999Cta')} ↗
            </a>
          </div>
          <iframe
            id="ev-999-iframe"
            src={EV_999_URL}
            title={t('nextSteps.find999IframeTitle')}
            className="w-full border-t border-ev-accent/20"
            style={{ height: '720px' }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}


