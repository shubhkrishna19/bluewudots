import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import localizationService, { t } from '../localizationService'

describe('LocalizationService', () => {
    beforeEach(() => {
        // Reset to default locale before each test
        localizationService.setLocale('en-IN')
        document.documentElement.lang = 'en'
        document.documentElement.dir = 'ltr'
    })

    it('should return default locale initially', () => {
        expect(localizationService.getLocale()).toBe('en-IN')
    })

    it('should change locale correctly', () => {
        localizationService.setLocale('hi-IN')
        expect(localizationService.getLocale()).toBe('hi-IN')
    })

    it('should update document attributes on locale change', () => {
        localizationService.setLocale('ar-AE')
        expect(document.documentElement.lang).toBe('ar')
        expect(document.documentElement.dir).toBe('rtl')

        localizationService.setLocale('en-IN')
        expect(document.documentElement.lang).toBe('en')
        expect(document.documentElement.dir).toBe('ltr')
    })

    it('should translate keys correctly for English', () => {
        localizationService.setLocale('en-IN')
        expect(t('common.search')).toBe('Search...')
        expect(t('nav.analytics')).toBe('Analytics')
    })

    it('should return key if translation is missing', () => {
        expect(t('non.existent.key')).toBe('non.existent.key')
    })

    it('should return fallback if provided', () => {
        expect(t('non.existent.key', 'Fallback Value')).toBe('Fallback Value')
    })

    it('should translate keys for Hindi (mock check since we load json in app)', () => {
        // Note: In unit tests without real file loading, we might rely on the internal dictionary if it was directly populated.
        // However, since we use `import` structure in the service often, let's verify if the service actually has the data loaded.
        // If the service imports the JSONs directly, this should work.

        // Based on previous file reads, localizationService imports JSON files.
        localizationService.setLocale('hi-IN')
        // We expect these to match what's in hi.json
        expect(t('nav.dashboard')).toBe('डैशबोर्ड')
    })

    it('should list available locales', () => {
        const locales = localizationService.getAvailableLocales()
        expect(locales.length).toBeGreaterThan(0)
        expect(locales.find(l => l.code === 'en-IN')).toBeTruthy()
        expect(locales.find(l => l.code === 'hi-IN')).toBeTruthy()
    })
})
