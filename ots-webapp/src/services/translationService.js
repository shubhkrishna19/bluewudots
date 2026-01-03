/**
 * Translation Service
 * Handles string lookups, interpolation, and fallbacks.
 */

import localizationService from './localizationService';

class TranslationService {
    /**
     * Get translation for a key in the current or specified locale
     * @param {string} key - Dot-notated key (e.g., 'nav.orders')
     * @param {object} params - Interpolation params (e.g., { name: 'Admin' })
     * @param {string} localeOverride - Optional locale to use
     * @returns {string}
     */
    t(key, params = {}, localeOverride = null) {
        const locale = localeOverride || localizationService.getLocale();
        const dictionary = localizationService.LOCALES[locale]?.translations ||
            localizationService.LOCALES['en-IN'].translations;

        // 1. Precise lookup first
        let value = dictionary[key];

        // 2. Nested lookup if not found (e.g., 'nav.home')
        if (!value && key.includes('.')) {
            value = key.split('.').reduce((obj, part) => obj && obj[part], dictionary);
        }

        // 3. Fallback to English if still not found
        if (!value && locale !== 'en-IN') {
            const enDict = localizationService.LOCALES['en-IN'].translations;
            value = enDict[key] || (key.includes('.') ? key.split('.').reduce((obj, part) => obj && obj[part], enDict) : null);
        }

        // 4. Return key itself as last resort
        if (!value) return key;

        // 5. Interpolation (e.g., "Hello {name}")
        return value.replace(/\{(\w+)\}/g, (match, prop) => {
            return params[prop] !== undefined ? params[prop] : match;
        });
    }
}

export const translationService = new TranslationService();
export default translationService;
