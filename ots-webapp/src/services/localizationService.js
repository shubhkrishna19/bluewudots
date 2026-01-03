/**
 * Localization Service
 *
 * Provides locale-specific formatting and translations for
 * international market support.
 */

const LOCALES = {
  'en-IN': { name: 'English (India)', currency: 'INR', dateFormat: 'dd/MM/yyyy' },
  'en-US': { name: 'English (USA)', currency: 'USD', dateFormat: 'MM/dd/yyyy' },
  'en-GB': { name: 'English (UK)', currency: 'GBP', dateFormat: 'dd/MM/yyyy' },
  'ar-AE': { name: 'Arabic (UAE)', currency: 'AED', dateFormat: 'dd/MM/yyyy' },
}

let currentLocale = 'en-IN'

/**
 * Set the active locale
 * @param {string} locale
 */
export const setLocale = (locale) => {
  if (LOCALES[locale]) {
    currentLocale = locale
    localStorage.setItem('ots_locale', locale)
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
  formatCurrency,
  formatDate,
  getAvailableLocales,
  LOCALES,
}
