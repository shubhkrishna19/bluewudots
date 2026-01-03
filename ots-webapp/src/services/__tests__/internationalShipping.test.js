import { describe, it, expect } from 'vitest'
import intlService from '../internationalShippingService'

describe('internationalShippingService', () => {
    const mockOrder = {
        id: 'ORD-INT-TEST',
        country: 'USA',
        amount: 5000,
        weight: 1.5
    }

    it('should return correct zone for countries', () => {
        // This relies on getZoneForCountry which is internal, but we test through getRate
        const dhlRate = intlService.getInternationalRate('dhl', 'USA', 1.0)
        expect(dhlRate.zone).toBe('Zone-4')

        const sgRate = intlService.getInternationalRate('dhl', 'Singapore', 1.0)
        expect(sgRate.zone).toBe('Zone-1')
    })

    it('should compare rates correctly favoring cheapest', () => {
        const rates = intlService.compareInternationalRates('USA', 2.0)
        expect(rates.length).toBeGreaterThan(0)
        // FedEx is usually cheaper in our mock logic for Zone-4
        expect(rates[0].total).toBeLessThanOrEqual(rates[rates.length - 1].total)
    })

    it('should generate customs paperwork with required fields', () => {
        const docs = intlService.generateCustomsPaperwork(mockOrder)
        expect(docs).toHaveProperty('invoiceNumber')
        expect(docs).toHaveProperty('hsnCode')
        expect(docs.declaredValue).toBe(5000)
    })

    it('should create international shipment and return tracking', async () => {
        const result = await intlService.createInternationalShipment(mockOrder, 'fedex')
        expect(result.success).toBe(true)
        expect(result.trackingNumber).toContain('INT-FEDEX')
    })
})
