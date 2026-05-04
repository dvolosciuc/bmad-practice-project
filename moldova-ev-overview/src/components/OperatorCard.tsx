import { useTranslation } from 'react-i18next'
import type { OperatorData, OperatorTariff } from '../lib/types'

// ── Icons ──────────────────────────────────────────────────────────────────
function AcIcon({ size = 14 }: { size?: number }) {
  // Sine wave — the universal symbol for alternating current
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12 C5 4, 9 4, 12 12 C15 20, 19 20, 22 12" />
    </svg>
  )
}
function DcIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z" />
    </svg>
  )
}
function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}

// ── Price block — the main visual centrepiece ──────────────────────────────
function PriceBlock({ type, value, sublabel }: { type: 'ac' | 'dc'; value: number; sublabel?: string }) {
  const isAc = type === 'ac'
  return (
    <div className={`relative overflow-hidden rounded-xl p-4 flex flex-col gap-1 ${
      isAc
        ? 'bg-ev-accent/8 border border-ev-accent/20'
        : 'bg-violet-500/8 border border-violet-500/20'
    }`}>
      {/* Soft radial glow in corner */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl ${
        isAc ? 'bg-ev-accent/20' : 'bg-violet-500/20'
      }`} />
      {/* Label */}
      <div className={`relative flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] ${
        isAc ? 'text-ev-accent' : 'text-violet-400'
      }`}>
        {isAc ? <AcIcon size={13} /> : <DcIcon size={13} />}
        {isAc ? (sublabel ? `AC · ${sublabel}` : 'AC') : 'DC Fast'}
      </div>
      {/* Big price number */}
      <div className={`relative text-3xl font-black tabular-nums leading-none ${
        isAc ? 'text-ev-accent' : 'text-violet-400'
      }`}>
        {value}
      </div>
      <div className="relative text-[10px] text-ev-muted">MDL / kWh</div>
    </div>
  )
}

// ── Tariff section for one region ─────────────────────────────────────────
function TariffSection({ tariff, regionLabel }: { tariff: OperatorTariff; regionLabel: string }) {
  const hasDc = tariff.dcFromMDL != null
  const hasNight = tariff.acNightFromMDL != null
  // columns: day AC + optional night AC + optional DC
  const cols = (hasNight ? 2 : 1) + (hasDc ? 1 : 0)
  const gridCols = cols === 3 ? 'grid-cols-3' : cols === 2 ? 'grid-cols-2' : 'grid-cols-1'

  return (
    <div>
      {/* Region divider */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-[10px] uppercase tracking-[0.15em] text-ev-muted/60 px-1">{regionLabel}</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>
      {/* Price blocks */}
      <div className={`grid gap-3 ${gridCols}`}>
        <PriceBlock type="ac" value={tariff.acFromMDL} sublabel="Day" />
        {hasNight && <PriceBlock type="ac" value={tariff.acNightFromMDL!} sublabel="Night" />}
        {hasDc && <PriceBlock type="dc" value={tariff.dcFromMDL!} />}
      </div>
    </div>
  )
}

// ── App store links ────────────────────────────────────────────────────────
function StoreLinks({ operator, iosLabel, androidLabel }: { operator: OperatorData; iosLabel: string; androidLabel: string }) {
  return (
    <div className="flex gap-2 flex-wrap mt-5 pt-4 border-t border-white/5">
      {operator.appStoreUrl && (
        <a
          href={operator.appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[12px] text-ev-muted hover:text-ev-text transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          {iosLabel}
        </a>
      )}
      {operator.playStoreUrl && (
        <a
          href={operator.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[12px] text-ev-muted hover:text-ev-text transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.18 23.76c.3.17.64.22.99.14l13.2-7.62-2.82-2.82-11.37 10.3zm-1.07-20.7C2.04 3.3 2 3.57 2 3.86v16.28c0 .29.04.56.11.8l.06.06 9.12-9.12v-.2L2.17 2.99l-.06.07zm18.54 9.09l-2.64-1.53-3.06 3.06 3.06 3.06 2.66-1.54c.76-.44.76-1.61-.02-2.05zM4.17.28l13.2 7.62-2.82 2.82L3.18.42c.3-.17.67-.2.99-.14z"/></svg>
          {androidLabel}
        </a>
      )}
    </div>
  )
}

// ── Full operator card ─────────────────────────────────────────────────────
function FullCard({ operator }: { operator: OperatorData }) {
  const { t } = useTranslation()
  const hasDcAnywhere = operator.tariffs?.some((tr) => tr.dcFromMDL != null)

  return (
    <div className="operator-card">
      {/* Accent stripe */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-ev-accent/60 to-transparent" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
          <div>
            <h3 className="text-xl font-bold text-ev-text leading-tight">
              {operator.appUrl ? (
                <a
                  href={operator.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-ev-accent transition-colors"
                >
                  {operator.name}
                  <ExternalLinkIcon />
                </a>
              ) : (
                operator.name
              )}
            </h3>
          </div>
          {/* Connector capability chips */}
          <div className="flex gap-1.5 flex-shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ev-accent/10 border border-ev-accent/25 text-[10px] font-bold text-ev-accent uppercase tracking-wider">
              <AcIcon size={11} /> AC
            </span>
            {hasDcAnywhere && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-400/10 border border-violet-400/25 text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                <DcIcon size={11} /> DC
              </span>
            )}
          </div>
        </div>

        {/* Tariff sections */}
        <div className="flex flex-col gap-5">
          {operator.tariffs?.map((tariff) => (
            <TariffSection
              key={tariff.region}
              tariff={tariff}
              regionLabel={t(`charging.region.${tariff.region}`)}
            />
          ))}
        </div>

        <StoreLinks
          operator={operator}
          iosLabel={t('charging.appStore')}
          androidLabel={t('charging.playStore')}
        />
      </div>
    </div>
  )
}

// ── Placeholder card ───────────────────────────────────────────────────────
function PlaceholderCard({ operator }: { operator: OperatorData }) {
  const { t } = useTranslation()
  return (
    <div className="operator-card">
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-xl font-bold text-ev-text">
              {operator.appUrl ? (
                <a
                  href={operator.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-ev-accent transition-colors"
                >
                  {operator.name}
                  <ExternalLinkIcon />
                </a>
              ) : (
                operator.name
              )}
            </h3>
            <p className="text-[12px] text-ev-muted mt-1">{t('charging.tariffNotListed')}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {operator.appStoreUrl && (
              <a
                href={operator.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[12px] text-ev-muted hover:text-ev-text transition-colors"
              >
                {t('nextSteps.ios')}
              </a>
            )}
            {operator.playStoreUrl && (
              <a
                href={operator.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[12px] text-ev-muted hover:text-ev-text transition-colors"
              >
                {t('nextSteps.android')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OperatorCard({ operator }: { operator: OperatorData }) {
  return operator.variant === 'full' ? <FullCard operator={operator} /> : <PlaceholderCard operator={operator} />
}
