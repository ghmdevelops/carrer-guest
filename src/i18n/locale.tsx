import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Locale, Localized, LocalizedList } from '../data/career'
import { strings, type StringKey } from './strings'

const STORAGE_KEY = 'career-quest:locale'

interface LocaleValue {
  locale: Locale
  setLocale: (next: Locale) => void
  toggle: () => void
  t: (key: StringKey) => string
  L: (value: Localized) => string
  LL: (value: LocalizedList) => string[]
}

const LocaleContext = createContext<LocaleValue | null>(null)

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'pt'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'pt' || saved === 'en') return saved
  return window.navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next === 'pt' ? 'pt-BR' : 'en'
  }, [])

  const value = useMemo<LocaleValue>(
    () => ({
      locale,
      setLocale,
      toggle: () => setLocale(locale === 'pt' ? 'en' : 'pt'),
      t: (key) => strings[key][locale],
      L: (v) => v[locale],
      LL: (v) => v[locale],
    }),
    [locale, setLocale],
  )

  return <LocaleContext value={value}>{children}</LocaleContext>
}

export function useI18n(): LocaleValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useI18n must be used inside <LocaleProvider>')
  return ctx
}
