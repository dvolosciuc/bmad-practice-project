import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface LossHeadlineProps {
  monthlyLoss: number
}

export default function LossHeadline({ monthlyLoss }: LossHeadlineProps) {
  const { t } = useTranslation()
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    setPulse(true)
    const timer = setTimeout(() => setPulse(false), 300)
    return () => clearTimeout(timer)
  }, [monthlyLoss])

  const formatted = new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: 'MDL',
    maximumFractionDigits: 0,
  }).format(Math.max(0, monthlyLoss))

  const isNegligible = monthlyLoss < 50

  return (
    <div aria-live="polite" aria-atomic="true" className={pulse ? 'highlight-pulse' : ''}>
      <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
        {t('hero.sectionLabel')}
      </p>
      {isNegligible ? (
        <h1 className="text-4xl font-bold text-ev-text">{t('hero.negligibleSavings')}</h1>
      ) : (
        <h1 className="text-5xl lg:text-7xl font-extrabold text-ev-accent leading-none">
          {t('hero.lossPrefix')} {formatted} {t('hero.lossSuffix')}
        </h1>
      )}
    </div>
  )
}
