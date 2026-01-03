import { describe, it, expect } from 'vitest'
import mlForecastService from '../mlForecastService'

describe('MLForecastService', () => {
  const mockOrders = [
    { sku: 'TEST-SKU', quantity: 1, createdAt: '2025-12-01T10:00:00Z' },
    { sku: 'TEST-SKU', quantity: 1, createdAt: '2025-12-02T10:00:00Z' },
    { sku: 'TEST-SKU', quantity: 1, createdAt: '2025-12-03T10:00:00Z' },
    { sku: 'TEST-SKU', quantity: 2, createdAt: '2025-12-04T10:00:00Z' },
    { sku: 'TEST-SKU', quantity: 1, createdAt: '2025-12-05T10:00:00Z' },
    { sku: 'TEST-SKU', quantity: 3, createdAt: '2025-12-06T10:00:00Z' },
    { sku: 'TEST-SKU', quantity: 4, createdAt: '2025-12-07T10:00:00Z' }, // Weekend spike
  ]

  it('should return error for insufficient data', () => {
    const result = mlForecastService.predictDemand([], 'FAKE')
    expect(result.error).toBeDefined()
  })

  it('should calculate additive decomposition correctly', () => {
    const result = mlForecastService.predictDemand(mockOrders, 'TEST-SKU')
    expect(result.forecast).toHaveLength(30)
    expect(result.metrics.growthRate).toBeDefined()

    // Check confidence bands exist and are ordered
    const firstDay = result.forecast[0]
    expect(firstDay.high95).toBeGreaterThanOrEqual(firstDay.high80)
    expect(firstDay.low80).toBeGreaterThanOrEqual(firstDay.low95)
  })

  it('should predict stock-out date correctly', () => {
    // Mocking steady demand of ~2 units/day in the forecast period
    const currentStock = 10
    const result = mlForecastService.predictStockOutDate(mockOrders, 'TEST-SKU', currentStock)

    expect(result.days).toBeGreaterThan(0)
    expect(result.days).toBeLessThan(14) // 10 stock / ~1.8 demand ≈ 5.5 days
    expect(result.urgency).toBeDefined()
  })

  it('should handle zero stock immediately', () => {
    const result = mlForecastService.predictStockOutDate(mockOrders, 'TEST-SKU', 0)
    expect(result.date).toBe('OUT_OF_STOCK')
    expect(result.days).toBe(0)
  })

  it('should calculate RRQ including safety buffer', () => {
    const result = mlForecastService.predictDemand(mockOrders, 'TEST-SKU')
    const rrq = mlForecastService.calculateRRQ(result, 7, 1.96)

    const baseDemand = result.forecast.slice(0, 7).reduce((a, b) => a + b.quantity, 0)
    expect(rrq).toBeGreaterThan(baseDemand) // Buffer should be added
  })
})
