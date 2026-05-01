import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface SavingsCounterProps {
  targetValue: number
}

export default function SavingsCounter({ targetValue }: SavingsCounterProps) {
  const { t } = useTranslation()
  const [displayed, setDisplayed] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const animFrameRef = useRef<number>(0)

  const prefersReducedMotion =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

  const runAnimation = (target: number) => {
    if (prefersReducedMotion) {
      setDisplayed(target)
      return
    }
    const duration = 1200 // ms
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * target))
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }
    animFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          runAnimation(targetValue)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(animFrameRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- intentional: IntersectionObserver fires once on mount

  // After animation completes, keep in sync with targetValue changes
  useEffect(() => {
    if (hasAnimated.current) {
      setDisplayed(targetValue)
    }
  }, [targetValue])

  const formatted = new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: 'MDL',
    maximumFractionDigits: 0,
  }).format(displayed)

  return (
    <div ref={containerRef} className="text-center py-8">
      <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
        {t('savings.counterLabel')}
      </p>
      <p className="text-5xl lg:text-7xl font-extrabold text-ev-accent [font-variant-numeric:tabular-nums] leading-none">
        {formatted}
      </p>
      <p className="text-sm text-ev-muted mt-2">{t('savings.counterSuffix')}</p>
    </div>
  )
}
