import { useState, useEffect, useRef, useCallback } from 'react'

const prefersReducedMotion =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

/**
 * Animates a number from 0 to `target` when `trigger` becomes true.
 * Uses an ease-out cubic over `duration` ms.
 */
export function useCountUp(target: number, trigger: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  const animFrameRef = useRef<number>(0)
  const hasRun = useRef(false)

  const run = useCallback(
    (t: number) => {
      if (prefersReducedMotion) {
        setValue(t)
        return
      }
      const start = performance.now()
      const animate = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(eased * t))
        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate)
        }
      }
      animFrameRef.current = requestAnimationFrame(animate)
    },
    [duration]
  )

  useEffect(() => {
    if (trigger && !hasRun.current) {
      hasRun.current = true
      run(target)
    }
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [trigger, target, run])

  // Keep in sync after initial animation
  useEffect(() => {
    if (hasRun.current) setValue(target)
  }, [target])

  return value
}
