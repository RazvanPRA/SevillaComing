import { createContext, useContext } from 'react'
import { DICTS, type Dict, type Lang } from './translations'

export interface I18n {
  lang: Lang
  /** Locale-ul pentru Intl (ex. 'ro-RO'). */
  locale: string
  t: Dict
  setLang: (lang: Lang) => void
}

export const I18nContext = createContext<I18n>({
  lang: 'ro',
  locale: 'ro-RO',
  t: DICTS.ro,
  setLang: () => {},
})

export const useI18n = () => useContext(I18nContext)
