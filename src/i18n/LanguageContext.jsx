import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const LANG_KEY = 'weatherweb-lang'
const LanguageContext = createContext(null)

function lookup(dict, key) {
  return key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), dict)
}

function interpolate(text, vars) {
  if (!vars) return text
  return Object.entries(vars).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    text,
  )
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => (localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'tr'))

  const t = useCallback(
    (key, vars) => {
      const raw = lookup(translations[lang], key) ?? lookup(translations.tr, key) ?? key
      return typeof raw === 'string' ? interpolate(raw, vars) : raw
    },
    [lang],
  )

  const toggleLang = useCallback(() => {
    setLang((current) => {
      const next = current === 'tr' ? 'en' : 'tr'
      localStorage.setItem(LANG_KEY, next)
      return next
    })
  }, [])

  const locale = lang === 'en' ? 'en-US' : 'tr-TR'

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t('pageTitle')
  }, [lang, t])

  const value = useMemo(
    () => ({ lang, locale, t, toggleLang, apiLang: lang }),
    [lang, locale, t, toggleLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
