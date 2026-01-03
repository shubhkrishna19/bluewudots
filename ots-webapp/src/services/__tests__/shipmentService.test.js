import { describe, it, expect, vi } from 'vitest'
import shipmentService, { createForwardShipment, trackShipment } from '../shipmentService'

// Mock dependencies
vi.mock('../carrierRateEngine', () => ({
  CARRIER_RATES: {
    delhivery: { name: 'Delhivery' },
    bluedart: { name: 'BlueDart' },
  },
}))

describe('shipmentService', () => {
  const mockOrder = {
    id: 'ORD-123',
    amount: 500,
    carrier: 'Delhivery',
    pincode: '560102',
  }

  it('should create a forward shipment (Simulation Fallback)', async () => {
    const result = await createForwardShipment(mockOrder)

    expect(result).toHaveProperty('success', true)
    expect(result).toHaveProperty('awb')
    expect(result.awb).toMatch(/^55\d+/) // Delhivery prefix
    expect(result.isSimulation).toBe(true)
  })

  it('should create a BlueDart shipment with correct prefix', async () => {
    const bluedartOrder = { ...mockOrder, carrier: 'BlueDart' }
    const result = await createForwardShipment(bluedartOrder)

    expect(result.awb).toMatch(/^78\d+/) // BlueDart prefix
    expect(result.carrier).toBe('BlueDart')
  })

  it('should track a shipment successfully', async () => {
    const result = await trackShipment('5512345678', 'delhivery')

    expect(result).toHaveProperty('currentStatus')
    expect(result).toHaveProperty('history')
    expect(result.history).toBeInstanceOf(Array)
    expect(result.history.length).toBeGreaterThan(0)
  })

  it('should handle manifest generation', async () => {
    const result = await shipmentService.generateManifest([{ id: '1' }, { id: '2' }])

    expect(result).toHaveProperty('manifestId')
    expect(result.count).toBe(2)
  })
})
