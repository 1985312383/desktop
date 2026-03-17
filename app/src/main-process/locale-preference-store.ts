import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'
import { join } from 'path'
import { LocalePreference, resolveLocalePreference } from '../lib/i18n'

const localePreferenceFileName = '.locale-preference'

function getLocalePreferencePath() {
  return join(app.getPath('userData'), localePreferenceFileName)
}

export function getStoredLocalePreferenceForMain(): LocalePreference {
  const path = getLocalePreferencePath()

  if (!existsSync(path)) {
    return null
  }

  try {
    const value = readFileSync(path, 'utf8').trim()
    return resolveLocalePreference(value)
  } catch (e) {
    log.error('Failed reading stored locale preference', e)
    return null
  }
}

export function setStoredLocalePreferenceForMain(locale: LocalePreference) {
  const path = getLocalePreferencePath()

  try {
    if (locale === null) {
      if (existsSync(path)) {
        unlinkSync(path)
      }
      return
    }

    writeFileSync(path, locale, 'utf8')
  } catch (e) {
    log.error('Failed writing stored locale preference', e)
  }
}
