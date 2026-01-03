/**
 * Localization Service
 *
 * Provides locale-specific formatting and translations for
 * international market support.
 */

import enBundle from '../locales/en.json'
import hiBundle from '../locales/hi.json'

const LOCALES = {
  'en-IN': {
    name: 'English (India)',
    currency: 'INR',
    dateFormat: 'dd/MM/yyyy',
    translations: enBundle,
    dir: 'ltr',
    lang: 'en',
  },
  'hi-IN': {
    name: 'Hindi (India)',
    currency: 'INR',
    dateFormat: 'dd/MM/yyyy',
    translations: hiBundle,
    dir: 'ltr',
    lang: 'hi',
  },
  'es-ES': {
    name: 'Spanish (Spain)',
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    translations: enBundle, // Fallback to EN for now
    dir: 'ltr',
    lang: 'es',
  },
  'ar-AE': {
    name: 'Arabic (UAE)',
    currency: 'AED',
    dateFormat: 'yyyy/MM/dd',
    translations: {}, // Empty for now, just for structure check
    dir: 'rtl',
    lang: 'ar',
  }
}

let currentLocale = 'en-IN'

/**
 * Set the active locale and update document attributes
 * @param {string} locale
 */
export const setLocale = (locale) => {
  if (LOCALES[locale]) {
    currentLocale = locale
    localStorage.setItem('ots_locale', locale)

    // Update Document Attributes for global directionality/lang
    const config = LOCALES[locale]
    if (typeof document !== 'undefined') {
      document.documentElement.lang = config.lang || 'en'
      document.documentElement.dir = config.dir || 'ltr'
    }
  }
}

/**
 * Get active locale
 * @returns {string}
 */
export const getLocale = () => {
  return localStorage.getItem('ots_locale') || currentLocale
}

/**
 * Hierarchical translation lookups
 * @param {string} key - e.g., 'nav.analytics'
 * @param {object|string} params - Substitution params OR Default Value string
 * @returns {string}
 */
export const t = (key, params = {}) => {
  const locale = getLocale()
  const dictionary = LOCALES[locale]?.translations || LOCALES['en-IN'].translations

  let fallback = null
  let textParams = params

  // Handle signature t(key, defaultValue)
  if (typeof params === 'string') {
    fallback = params
    textParams = {}
  }

  // Resolve recursive key
  const resolve = (obj, path) => {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null
    }, obj)
  }

  let text = resolve(dictionary, key)

  // Fallback to English if missing in current locale
  if (!text && locale !== 'en-IN') {
    text = resolve(LOCALES['en-IN'].translations, key)
  }

  // If still not found, return fallback (if provided) or key
  if (typeof text !== 'string') {
    return fallback || key
  }

  // Simple interpolation
  Object.entries(textParams).forEach(([k, v]) => {
    text = text.replace(`{{${k}}}`, v)
  })

  return text
}

/**
 * Format currency based on locale
 * @param {number} value
 * @param {string} localeOverride
 * @returns {string}
 */
export const formatCurrency = (value, localeOverride = null) => {
  const locale = localeOverride || getLocale()
  const config = LOCALES[locale] || LOCALES['en-IN']

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format date based on locale
 * @param {Date|string} date
 * @param {string} localeOverride
 * @returns {string}
 */
export const formatDate = (date, localeOverride = null) => {
  const locale = localeOverride || getLocale()
  return new Date(date).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Get all available locales
 * @returns {object[]}
 */
export const getAvailableLocales = () => {
  return Object.entries(LOCALES).map(([code, data]) => ({
    code,
    ...data,
  }))
}

export default {
  setLocale,
  getLocale,
  t,
  formatCurrency,
  formatDate,
  getAvailableLocales,
  LOCALES,
}
