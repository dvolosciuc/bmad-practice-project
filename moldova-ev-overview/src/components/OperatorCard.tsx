import { useTranslation } from 'react-i18next'
import type { OperatorData } from '../lib/types'

function FullCard({ operator }: { operator: OperatorData }) {
  const { t } = useTranslation()
  return (
    <div className="bg-ev-surface rounded-lg p-6">
      <h3 className="text-2xl font-semibold text-ev-text mb-4">{operator.name}</h3>
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-ev-muted text-[13px] uppercase tracking-wider">
            <th className="text-left py-1">{t('charging.region')}</th>
            <th className="text-right py-1">AC (MDL/kWh)</th>
            <th className="text-right py-1">DC (MDL/kWh)</th>
          </tr>
        </thead>
        <tbody>
          {operator.tariffs?.map((tariff) => (
            <tr key={tariff.region} className="border-t border-ev-surface-2">
              <td className="py-2 text-ev-text">{t(`charging.region.${tariff.region}`)}</td>
              <td className="py-2 text-right text-ev-accent font-medium">{tariff.acFromMDL}</td>
              <td className="py-2 text-right text-ev-accent font-medium">{tariff.dcFromMDL}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[13px] text-ev-muted mb-4">
        {t('charging.lastVerified')}: {operator.lastVerified}
      </p>
      <div className="flex gap-3 flex-wrap">
        {operator.appStoreUrl && (
          <a
            href={operator.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-ev-accent text-ev-bg rounded-lg text-sm font-medium min-h-[44px] flex items-center"
          >
            {t('charging.appStore')}
          </a>
        )}
        {operator.playStoreUrl && (
          <a
            href={operator.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-ev-accent text-ev-bg rounded-lg text-sm font-medium min-h-[44px] flex items-center"
          >
            {t('charging.playStore')}
          </a>
        )}
      </div>
    </div>
  )
}

function PlaceholderCard({ operator }: { operator: OperatorData }) {
  const { t } = useTranslation()
  return (
    <div className="bg-ev-surface rounded-lg p-6 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-ev-text">{operator.name}</h3>
        <p className="text-[13px] text-ev-muted mt-1">{t('charging.tariffNotListed')}</p>
        <p className="text-[13px] text-ev-muted">
          {t('charging.lastVerified')}: {operator.lastVerified}
        </p>
      </div>
      {operator.appUrl && (
        <a
          href={operator.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 border border-ev-accent text-ev-accent rounded-lg text-sm font-medium min-h-[44px] flex items-center"
        >
          {t('charging.seeApp')}
        </a>
      )}
    </div>
  )
}

export default function OperatorCard({ operator }: { operator: OperatorData }) {
  return operator.variant === 'full' ? (
    <FullCard operator={operator} />
  ) : (
    <PlaceholderCard operator={operator} />
  )
}
