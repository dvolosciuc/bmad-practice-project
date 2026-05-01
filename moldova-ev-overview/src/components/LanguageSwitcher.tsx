import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const LANGUAGES: { code: string; label: string; disabled: boolean; note?: string }[] = [
  { code: 'ro', label: 'RO', disabled: false },
  { code: 'en', label: 'EN', disabled: false },
  { code: 'ru', label: 'RU', disabled: true, note: '(în curând)' },
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
      {LANGUAGES.map(({ code, label, disabled, note }) => (
        <button
          key={code}
          onClick={() => !disabled && handleChange(code)}
          disabled={disabled}
          aria-pressed={current === code}
          className={`
            px-2 py-1 text-sm font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ev-accent
            ${
              current === code
                ? 'bg-ev-accent text-ev-bg'
                : disabled
                  ? 'text-ev-muted cursor-not-allowed opacity-50'
                  : 'text-ev-muted hover:text-ev-text'
            }
          `}
        >
          {label}
          {note && <span className="text-xs ml-0.5 text-ev-muted">{note}</span>}
        </button>
      ))}
    </div>
  )
}
