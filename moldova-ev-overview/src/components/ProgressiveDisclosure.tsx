import { useState, useRef } from 'react'

interface ProgressiveDisclosureProps {
  summary: string
  children: React.ReactNode
}

export default function ProgressiveDisclosure({ summary, children }: ProgressiveDisclosureProps) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <details open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)} className="group">
      <summary
        className="flex items-center gap-2 cursor-pointer list-none text-ev-muted text-sm font-medium py-2 hover:text-ev-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent rounded"
        onClick={(e) => {
          e.preventDefault()
          setOpen((prev) => !prev)
        }}
      >
        <span className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`} aria-hidden="true">
          ›
        </span>
        {summary}
      </summary>
      <div
        style={{ maxHeight: open ? (contentRef.current?.scrollHeight ?? 0) + 'px' : '0' }}
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
      >
        <div ref={contentRef} className="pt-3 pb-1 text-sm text-ev-muted leading-relaxed">
          {children}
        </div>
      </div>
    </details>
  )
}
