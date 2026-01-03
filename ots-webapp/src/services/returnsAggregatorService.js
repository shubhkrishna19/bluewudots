/**
 * Returns Aggregator Service
 * Unifies return requests from Local Orders, Amazon, and Flipkart.
 * Provides automated risk scoring and auto-approval logic.
 */

import marketplaceService from './marketplaceService'
import reverseLogisticsService from './reverseLogisticsService'

class ReturnsAggregatorService {
  /**
   * Fetch all pending returns from all sources
   */
  async fetchPendingReturns() {
    const sources = ['amazon', 'flipkart', 'local']
    const results = await Promise.all(sources.map((s) => this.fetchFromSource(s)))

    // Flatten and sort by riskScore (high risk first) or date
    return results.flat().sort((a, b) => b.riskScore - a.riskScore)
  }

  /**
   * Fetch returns from a specific source
   */
  async fetchFromSource(source) {
    if (source === 'local') {
      // Local returns from DataContext/ReverseLogistics
      // This would normally come from a database, using mock for now
      return [
        {
          id: 'RET-1001',
          orderId: 'BW-5521',
          source: 'Local',
          customerName: 'Rahul Sharma',
          reason: 'Damaged on arrival',
          riskScore: 85,
          refundAmount: 4500,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        },
      ]
    }

    // Marketplace returns
    const mpReturns = await marketplaceService.fetchReturns(source)

    return mpReturns
  }

  /**
   * Check if a return qualifies for Auto-Approval
   */
  checkAutoApproval(returnRequest) {
    const rules = [
      { name: 'Low Risk', check: (r) => r.riskScore < 30 },
      { name: 'Low Value', check: (r) => r.refundAmount < 2000 },
      { name: 'Not Damaged', check: (r) => r.reason !== 'Damaged on arrival' },
    ]

    const failedRules = rules.filter((rule) => !rule.check(returnRequest))

    if (failedRules.length === 0) {
      return { approved: true, reason: 'System Auto-Approval (Low Risk)' }
    }

    return {
      approved: false,
      reason: `Manual Review Required: ${failedRules.map((f) => f.name).join(', ')}`,
    }
  }

  /**
   * Process refund for a return
   */
  async processRefund(returnId, amount) {
    console.log(`[Aggregator] Processing refund for ${returnId}: ₹${amount}`)
    // Simulate API call to payment gateway or marketplace
    await new Promise((r) => setTimeout(r, 1000))
    return { success: true, txnId: `TXN-${Math.floor(Math.random() * 1000000)}` }
  }
}

export const returnsAggregatorService = new ReturnsAggregatorService()
export default returnsAggregatorService
