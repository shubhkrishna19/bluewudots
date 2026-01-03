import { describe, it, expect, vi, beforeEach } from 'vitest'
import { calculateRate, getAllRates, getRecommendation } from '../carrierRateEngine'
import carrierFactory from '../carriers/CarrierFactory'

// Mock ENV
// vi.stubGlobal('import.meta', { env: { VITE_DELHIVERY_TOKEN: 'mock-token' } });
vi.stubEnv('VITE_DELHIVERY_TOKEN', 'mock-token')

describe('Carrier Rate Engine', () => {
  beforeEach(() => {
    carrierFactory.reset()
  })
  it('should calculate static rates correctly', () => {
    const shipment = { state: 'Maharashtra', city: 'Satara', weight: 0.5 }
    const rate = calculateRate('delhivery', shipment)

    expect(rate.carrierId).toBe('delhivery')
    expect(rate.total).toBeGreaterThan(0)
    expect(rate.zone).toBe('ADJACENT') // Origin South -> West (and not Metro)
  })

  it('should recommend smartest carrier', async () => {
    const shipment = { weight: 1.0, state: 'Karnataka', city: 'Bangalore' } // Local
    const recommendation = await getRecommendation(shipment, 'smart')

    expect(recommendation).toBeDefined()
    expect(recommendation.zone).toBe('LOCAL')
    // Standard logic often prefers local carrier
  })

  it('should merge live rates if credentials exist', async () => {
    const shipment = { weight: 0.5, state: 'Delhi' }
    const rates = await getAllRates(shipment)

    // We mocked ENV, so fetchLiveRates should run and push simulated 'Live' rates
    const liveRate = rates.find((r) => r.isLive)
    expect(liveRate).toBeDefined()
    expect(liveRate.carrierName).toContain('(Live)')
  })
})
