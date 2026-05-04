import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const LANGUAGES: { code: string; label: string }[] = [
  { code: 'ro', label: 'RO' },
  { code: 'en', label: 'EN' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.split('-')[0] ?? 'ro'

  const handleChange = (lang: string) => {
    i18next.changeLanguage(lang)
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }

  return (
    <div role="combobox" aria-label="Select language" className="flex items-center gap-1">
      <span aria-live="polite" className="sr-only">
        Language changed to {current}
      </span>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          aria-pressed={current === code}
          className={`
            px-2 py-1 text-sm font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent
            ${current === code ? 'bg-ev-accent text-ev-bg' : 'text-ev-muted hover:text-ev-text'}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
