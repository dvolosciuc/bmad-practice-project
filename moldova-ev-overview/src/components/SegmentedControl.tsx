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
      <div role="group" aria-label={label} className="flex gap-1 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`min-h-[44px] px-4 py-2 rounded text-sm font-medium transition-colors ${
              value === opt.value ? 'bg-ev-accent text-ev-bg' : 'bg-ev-surface-2 text-ev-muted hover:bg-ev-surface'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
