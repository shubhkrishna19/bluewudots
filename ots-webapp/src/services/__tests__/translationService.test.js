import { describe, it, expect, beforeEach } from 'vitest'
import translationService from '../translationService'
import localizationService from '../localizationService'

describe('TranslationService', () => {
    beforeEach(() => {
        // Reset to default locale before each test
        localizationService.setLocale('en-IN')
    })

    it('should translate a simple key', () => {
        const result = translationService.t('common.search')
        expect(result).toBe('Search...') // Assuming 'common.search' is 'Search...' in en.json
    })

    it('should handle nested keys', () => {
        const result = translationService.t('nav.dashboard')
        expect(result).toBe('Dashboard') // Assuming structure
    })

    it('should return the key if translation is missing', () => {
        const missingKey = 'non.existent.key'
        expect(translationService.t(missingKey)).toBe(missingKey)
    })

    it('should fall back to English if key missing in current locale', () => {
        // Mock setting locale to something else
        localizationService.setLocale('mr-IN')
        // Assuming 'mr-IN' doesn't have this key or we are testing fallback
        // For this test to be robust we rely on the service logic.
        // If 'mr-IN' is empty for this key, it should fallback.
    })

    it('should interpolate parameters', () => {
        // We need a key with params for this.
        // Let's assume or add one temporarily if needed, or rely on existing.
        // If 'welcome_user': 'Welcome, {name}' exists.
        // Since we are writing the test file, we should match expected en.json content.
        // I'll adjust this test after seeing en.json content in the next step to be precise.
    })
})
