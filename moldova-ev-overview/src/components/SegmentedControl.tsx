interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-ev-text">{label}</span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1 bg-ev-surface-2 rounded-xl p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              value === opt.value ? 'bg-ev-accent text-ev-bg shadow-sm' : 'text-ev-muted hover:text-ev-text'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
