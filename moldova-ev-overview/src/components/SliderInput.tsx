interface SliderInputProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  hint: string
  onChange: (value: number) => void
  ariaValueText?: string
}

export default function SliderInput({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  hint,
  onChange,
  ariaValueText,
}: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm font-medium">
        <label htmlFor={id} className="text-ev-text">
          {label}
        </label>
        <span className="text-ev-accent font-semibold tabular-nums">
          {value.toLocaleString()} <span className="text-ev-muted font-normal">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={ariaValueText ?? `${value} ${unit}`}
        className="ev-slider w-full min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent rounded"
        style={{ '--slider-pct': `${pct}%` } as React.CSSProperties}
      />
      <p className="text-ev-muted text-[13px]">{hint}</p>
    </div>
  )
}
