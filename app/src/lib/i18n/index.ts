import {
  en,
  zhCN,
  TranslationDictionary,
  TranslationKey,
} from './locales'

export type SupportedLocale = 'en' | 'zh-CN'
export type LocalePreference = SupportedLocale | null

type TranslationValues = Readonly<Record<string, string | number>>
type TranslationWarningHandler = (message: string) => void

interface ILocaleInitializationOptions {
  readonly preferredLocale?: string | null
  readonly systemLocale?: string | null
}

export const localePreferenceKey = 'locale'

export const supportedLocales: ReadonlyArray<SupportedLocale> = ['en', 'zh-CN']

const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  en,
  'zh-CN': zhCN,
}

let currentLocale: SupportedLocale = 'en'
let translationWarningHandler: TranslationWarningHandler | null = null

function resolveSupportedLocale(
  locale: string | null | undefined
): SupportedLocale | null {
  if (!locale) {
    return null
  }

  const normalized = locale.toLowerCase()
  if (normalized.startsWith('zh')) {
    return 'zh-CN'
  }

  if (normalized.startsWith('en')) {
    return 'en'
  }

  return null
}

export function resolveLocale(
  locale: string | null | undefined
): SupportedLocale {
  return resolveSupportedLocale(locale) ?? 'en'
}

export function resolveLocalePreference(
  locale: string | null | undefined
): LocalePreference {
  return resolveSupportedLocale(locale)
}

export function resolveAppLocale({
  preferredLocale,
  systemLocale,
}: ILocaleInitializationOptions): SupportedLocale {
  return (
    resolveSupportedLocale(preferredLocale) ??
    resolveSupportedLocale(systemLocale) ??
    'en'
  )
}

export function initializeLocale(
  options: ILocaleInitializationOptions
): SupportedLocale {
  currentLocale = resolveAppLocale(options)
  return currentLocale
}

export function setLocale(locale: string | null | undefined): SupportedLocale {
  currentLocale = resolveLocale(locale)
  return currentLocale
}

export function getLocale(): SupportedLocale {
  return currentLocale
}

export function getStoredLocalePreference(): LocalePreference {
  return resolveLocalePreference(localStorage.getItem(localePreferenceKey))
}

export function setStoredLocalePreference(
  locale: LocalePreference
): LocalePreference {
  if (locale === null) {
    localStorage.removeItem(localePreferenceKey)
  } else {
    localStorage.setItem(localePreferenceKey, locale)
  }

  return locale
}

export function setTranslationWarningHandler(
  handler: TranslationWarningHandler | null
) {
  translationWarningHandler = handler
}

function format(template: string, values?: TranslationValues) {
  if (!values) {
    return template
  }

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = values[key]
    return value === undefined ? `{${key}}` : `${value}`
  })
}

function warnMissingTranslation(key: TranslationKey, locale: SupportedLocale) {
  if (!__DEV__) {
    return
  }

  const message = `Missing translation for "${key}" in locale "${locale}"`
  if (translationWarningHandler !== null) {
    translationWarningHandler(message)
  } else {
    console.warn(message)
  }
}

export function t(key: TranslationKey, values?: TranslationValues) {
  const localized = dictionaries[currentLocale][key]

  if (localized === undefined) {
    warnMissingTranslation(key, currentLocale)
    return format(dictionaries.en[key] ?? key, values)
  }

  return format(localized, values)
}
