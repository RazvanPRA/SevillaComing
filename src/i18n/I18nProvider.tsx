import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext } from './context'
import { DICTS, LANGS, type Lang } from './translations'

const STORAGE_KEY = 'lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved in DICTS) return saved as Lang
  } catch {
    // localStorage indisponibil (mod privat etc.)
  }
  return 'ro'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignorăm
    }
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      locale: LANGS.find((l) => l.code === lang)!.locale,
      t: DICTS[lang],
      setLang,
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
