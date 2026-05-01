import { useTranslation } from 'react-i18next'

const EVPOINT_APP_STORE = 'https://apps.apple.com/md/app/evpoint-moldova/id1536107978'
const EVPOINT_PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.evpoint.md'

export default function NextStepsSection() {
  const { t } = useTranslation()
  return (
    <section id="next-steps" className="py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('nextSteps.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-8">{t('nextSteps.sectionTitle')}</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={EVPOINT_APP_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-3 bg-ev-accent text-ev-bg rounded-lg font-semibold min-h-[48px] hover:bg-ev-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ev-bg"
          >
            {t('nextSteps.appStore')}
          </a>
          <a
            href={EVPOINT_PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-3 bg-ev-accent text-ev-bg rounded-lg font-semibold min-h-[48px] hover:bg-ev-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ev-bg"
          >
            {t('nextSteps.playStore')}
          </a>
        </div>
      </div>
    </section>
  )
}
