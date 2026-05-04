import { useEffect, useRef, useState } from 'react'

/**
 * Returns [ref, inView] — adds `.in-view` class to the element when it enters
 * the viewport and optionally keeps it (default: stays visible once triggered).
 */
export function useInView(options?: IntersectionObserverInit & { once?: boolean }) {
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)
  const once = options?.once ?? true

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          el.classList.add('in-view')
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
          el.classList.remove('in-view')
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px', ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once]) // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView] as const
}
