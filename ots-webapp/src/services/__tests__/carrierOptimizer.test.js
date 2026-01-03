import { describe, it, expect, vi, beforeEach } from 'vitest'
import carrierOptimizer from '../carrierOptimizer'
import * as offlineCache from '../offlineCacheService'

vi.mock('../offlineCacheService', () => ({
    cacheData: vi.fn(),
    retrieveCachedData: vi.fn()
}))

describe('carrierOptimizer AI Scoring (Phase 35)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should select the cheapest carrier for standard orders with same SLA', async () => {
        offlineCache.retrieveCachedData.mockResolvedValue({})

        const order = {
            pincode: '400001',
            weight: 0.5,
            amount: 1000,
            zone: 'tier3', // Both Delhivery and XpressBees have 5 day SLA in Tier 3
            cod_required: false
        }

        const result = await carrierOptimizer.getOptimalCarrier(order)
        expect(result.carrier.id).toBe('xpressbees')
    })

    it('should penalize degraded carriers (AI Safety Net)', async () => {
        // Mock XpressBees as degraded in history
        offlineCache.retrieveCachedData.mockResolvedValue({
            xpressbees: { total_shipments: 20, successful: 10, is_degraded: true }
        })

        const order = {
            pincode: '110001',
            weight: 0.5,
            amount: 1000,
            zone: 'metro',
            cod_required: false
        }

        const result = await carrierOptimizer.getOptimalCarrier(order)

        // Even if XpressBees is cheaper, degradation penalty (-40) should make Delhivery or BlueDart win
        expect(result.carrier.id).not.toBe('xpressbees')
        expect(result.score).toBeGreaterThan(0)
    })

    it('should favor BlueDart for fast SLA in metro zones', async () => {
        offlineCache.retrieveCachedData.mockResolvedValue({})

        const order = {
            pincode: '400001',
            weight: 2.0,
            amount: 5000,
            zone: 'metro',
            cod_required: false,
            priority: 'express'
        }

        const result = await carrierOptimizer.getOptimalCarrier(order)

        // BlueDart has base 65 but superior SLA (1 day). 
        // Express priority should boost it.
        expect(result.carrier.id).toBe('bluedart')
    })

    it('should calculate international rates correctly (Comparison logic)', () => {
        const { compareInternationalRates } = require('../internationalShippingService').default
        const rates = compareInternationalRates('USA', 2.5)

        expect(rates.length).toBeGreaterThan(0)
        expect(rates[0].total).toBeGreaterThan(0)
        expect(rates[0].currency).toBe('INR')
        expect(rates[0].zone).toBe('Zone-4')
    })
})
