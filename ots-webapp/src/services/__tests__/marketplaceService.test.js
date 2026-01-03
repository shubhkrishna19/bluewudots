import { describe, it, expect, vi, beforeEach } from 'vitest'
import marketplaceService from '../marketplaceService'

describe('MarketplaceService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch orders in simulation mode when keys are missing', async () => {
    const platform = 'amazon'
    const orders = await marketplaceService.fetchOrders(platform)
    expect(orders).toBeInstanceOf(Array)
    expect(orders.length).toBeGreaterThan(0)
    expect(orders[0].source).toBe('Amazon')
    expect(orders[0].status).toBe('Unshipped')
  })

  it('should fetch returns in simulation mode', async () => {
    const platform = 'flipkart'
    const returns = await marketplaceService.fetchReturns(platform)
    expect(returns).toBeInstanceOf(Array)
    expect(returns.length).toBeGreaterThan(0)
    expect(returns[0].source).toBe('Flipkart')
    expect(returns[0].status).toBe('Pending')
  })

  it('should handle inventory sync in simulation mode', async () => {
    const result = await marketplaceService.syncInventory('SKU-123', 50, 'amazon')
    expect(result.success).toBe(true)
    expect(result.mode).toBe('live')
  })

  it('should generate consistent mock data for different platforms', () => {
    const amzOrders = marketplaceService.getMockOrders('amazon')
    const fkOrders = marketplaceService.getMockOrders('flipkart')

    expect(amzOrders[0].source).toBe('Amazon')
    expect(fkOrders[0].source).toBe('Flipkart')
  })
})
