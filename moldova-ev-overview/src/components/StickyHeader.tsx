import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_LINKS = [
  { key: 'nav.savings', href: '#savings' },
  { key: 'nav.co2', href: '#co2' },
  { key: 'nav.map', href: '#map' },
  { key: 'nav.tax', href: '#tax' },
  { key: 'nav.charging', href: '#charging' },
]

function scrollWithOffset(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  const href = e.currentTarget.getAttribute('href')
  if (!href) return
  const target = document.querySelector(href)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top, behavior: 'smooth' })
}

export default function StickyHeader() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ev-surface/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[720px] mx-auto px-6 py-3 flex items-center justify-between">
        <nav className="flex gap-4 text-sm font-medium">
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              onClick={scrollWithOffset}
              className={`transition-colors ${
                activeSection === href.slice(1) ? 'text-ev-accent' : 'text-ev-muted hover:text-ev-text'
              }`}
            >
              {t(key)}
            </a>
          ))}
        </nav>
        {/* LanguageSwitcher placeholder — wired in Story 6.1 */}
        <LanguageSwitcher />
      </div>
    </header>
  )
}
