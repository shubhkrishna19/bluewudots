import { describe, it, expect, vi, beforeEach } from 'vitest'
import { returnsAggregatorService } from '../returnsAggregatorService'
import marketplaceService from '../marketplaceService'

vi.mock('../marketplaceService', () => ({
  default: {
    fetchReturns: vi.fn(),
  },
}))

describe('ReturnsAggregatorService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should aggregate returns from all sources', async () => {
    marketplaceService.fetchReturns.mockResolvedValue([
      { id: 'RET-AMZ-1', source: 'Amazon', riskScore: 10, refundAmount: 1000 },
    ])

    const allReturns = await returnsAggregatorService.fetchPendingReturns()

    // Amazon (mocked above) + Local (hardcoded in service mock for now)
    expect(allReturns.length).toBeGreaterThan(1)
    expect(allReturns.some((r) => r.source === 'Amazon')).toBe(true)
    expect(allReturns.some((r) => r.source === 'Local')).toBe(true)
  })

  it('should correctly identify returns for auto-approval', () => {
    const lowRiskReturn = {
      riskScore: 10,
      refundAmount: 500,
      reason: 'Size/Fit Issue',
    }

    const highRiskReturn = {
      riskScore: 80,
      refundAmount: 5000,
      reason: 'Damaged on arrival',
    }

    expect(returnsAggregatorService.checkAutoApproval(lowRiskReturn).approved).toBe(true)
    expect(returnsAggregatorService.checkAutoApproval(highRiskReturn).approved).toBe(false)
  })
})
