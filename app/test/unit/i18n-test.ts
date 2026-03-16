import assert from 'node:assert'
import { afterEach, beforeEach, describe, it } from 'node:test'
import {
  getStoredLocalePreference,
  localePreferenceKey,
  resolveLocale,
  resolveLocalePreference,
  resolveAppLocale,
  setLocale,
  setStoredLocalePreference,
  getLocale,
  setTranslationWarningHandler,
  t,
} from '../../src/lib/i18n'
import { zhCN, TranslationKey } from '../../src/lib/i18n/locales'

const mutableZhCN = zhCN as Record<TranslationKey, string | undefined>
const fallbackKey: TranslationKey = 'menu.file.darwin'
const originalFallbackTranslation = mutableZhCN[fallbackKey]
const originalDev = __DEV__
const mutableGlobals = globalThis as unknown as { __DEV__: boolean }

describe('i18n', () => {
  beforeEach(() => {
    setLocale('en')
    setTranslationWarningHandler(null)
    mutableZhCN[fallbackKey] = originalFallbackTranslation
    mutableGlobals.__DEV__ = originalDev
    localStorage.removeItem(localePreferenceKey)
  })

  afterEach(() => {
    setLocale('en')
    setTranslationWarningHandler(null)
    mutableZhCN[fallbackKey] = originalFallbackTranslation
    mutableGlobals.__DEV__ = originalDev
    localStorage.removeItem(localePreferenceKey)
  })

  describe('resolveLocale', () => {
    it('resolves supported locales and falls back to english', () => {
      assert.equal(resolveLocale('zh'), 'zh-CN')
      assert.equal(resolveLocale('zh-CN'), 'zh-CN')
      assert.equal(resolveLocale('en-US'), 'en')
      assert.equal(resolveLocale(null), 'en')
    })
  })

  describe('resolveLocalePreference', () => {
    it('returns null for unsupported locales so the app can follow the system default', () => {
      assert.equal(resolveLocalePreference('fr-FR'), null)
      assert.equal(resolveLocalePreference(null), null)
      assert.equal(resolveLocalePreference('zh'), 'zh-CN')
    })
  })

  describe('resolveAppLocale', () => {
    it('prefers a supported user locale over the system locale', () => {
      assert.equal(
        resolveAppLocale({ preferredLocale: 'zh-CN', systemLocale: 'en-US' }),
        'zh-CN'
      )
    })

    it('falls back to the system locale when the preferred locale is unsupported', () => {
      assert.equal(
        resolveAppLocale({ preferredLocale: 'fr-FR', systemLocale: 'zh-TW' }),
        'zh-CN'
      )
    })

    it('falls back to english when neither locale is supported', () => {
      assert.equal(
        resolveAppLocale({ preferredLocale: 'fr-FR', systemLocale: 'de-DE' }),
        'en'
      )
    })
  })

  describe('t', () => {
    it('formats interpolation values', () => {
      setLocale('en')

      assert.equal(
        t('dialog.removeRepository.moveToTrash', { trashName: 'Trash' }),
        'Also move this repository to Trash'
      )
    })

    it('leaves missing interpolation values untouched', () => {
      setLocale('en')

      assert.equal(
        t('dialog.removeRepository.moveToTrash'),
        'Also move this repository to {trashName}'
      )
    })

    it('falls back to english and emits a warning when a locale is missing a translation', () => {
      const warnings: string[] = []
      mutableGlobals.__DEV__ = true
      setTranslationWarningHandler(message => warnings.push(message))
      setLocale('zh-CN')
      delete mutableZhCN[fallbackKey]

      assert.equal(t(fallbackKey), 'File')
      assert.deepEqual(warnings, [
        'Missing translation for "menu.file.darwin" in locale "zh-CN"',
      ])
    })

    it('tracks the current locale', () => {
      setLocale('zh')

      assert.equal(getLocale(), 'zh-CN')
    })
  })

  describe('stored locale preference', () => {
    it('persists and clears a preferred locale', () => {
      assert.equal(getStoredLocalePreference(), null)

      setStoredLocalePreference('zh-CN')
      assert.equal(localStorage.getItem(localePreferenceKey), 'zh-CN')
      assert.equal(getStoredLocalePreference(), 'zh-CN')

      setStoredLocalePreference(null)
      assert.equal(localStorage.getItem(localePreferenceKey), null)
      assert.equal(getStoredLocalePreference(), null)
    })
  })
})
