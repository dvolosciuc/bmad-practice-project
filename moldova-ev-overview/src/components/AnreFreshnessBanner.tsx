import { useTranslation } from 'react-i18next'

interface AnreFreshnessBannerProps {
  status: 'live' | 'fallback'
  lastVerified: string
}

export default function AnreFreshnessBanner({ status, lastVerified }: AnreFreshnessBannerProps) {
  const { t } = useTranslation()
  const isLive = status === 'live'

  const displayDate = new Intl.DateTimeFormat('ro-MD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(lastVerified))

  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${isLive ? 'bg-ev-accent' : 'bg-ev-warning'}`}
        aria-hidden="true"
      />
      <p className="text-[13px] text-ev-muted">{t('anre.live', { time: displayDate })}</p>
    </div>
  )
}
