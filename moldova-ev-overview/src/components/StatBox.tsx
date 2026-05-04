import { useState, useEffect } from 'react'

interface StatBoxProps {
  value: number
  label: string
}

export default function StatBox({ value, label }: StatBoxProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    setPulse(true)
    const timer = setTimeout(() => setPulse(false), 300)
    return () => clearTimeout(timer)
  }, [value])

  const formatted = new Intl.NumberFormat('ro-MD', {
    style: 'currency',
    currency: 'MDL',
    maximumFractionDigits: 0,
  }).format(value)

  return (
    <div
      className={`bg-ev-surface-2 rounded-xl p-6 text-center border-t-2 border-ev-accent/50 ${pulse ? 'highlight-pulse' : ''}`}
    >
      <p className="text-[13px] text-ev-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-ev-accent [font-variant-numeric:tabular-nums] leading-tight">{formatted}</p>
    </div>
  )
}
