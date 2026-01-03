/**
 * Dealer Service
 * Handles wholesale logic, credit limits, and tiered pricing for B2B partners.
 */

export const DEALER_TIERS = {
  SILVER: { minMonthlyVolume: 0, discountPercent: 25, creditLimit: 50000 },
  GOLD: { minMonthlyVolume: 100000, discountPercent: 30, creditLimit: 200000 },
  PLATINUM: { minMonthlyVolume: 500000, discountPercent: 35, creditLimit: 1000000 },
}

class DealerService {
  /**
   * Calculate discounted price for a dealer based on their tier.
   * @param {number} basePrice - Retail price
   * @param {string} tier - Dealer tier (SILVER, GOLD, PLATINUM)
   * @returns {number}
   */
  calculateWholesalePrice(basePrice, tier = 'SILVER') {
    const tierConfig = DEALER_TIERS[tier] || DEALER_TIERS.SILVER
    const discountAmount = basePrice * (tierConfig.discountPercent / 100)
    return Math.floor(basePrice - discountAmount)
  }

  /**
   * Check if a dealer has enough credit for an order.
   * @param {number} orderTotal
   * @param {number} currentUsedCredit
   * @param {string} tier
   * @returns {Object} { allowed: boolean, reason?: string }
   */
  checkCreditLimit(orderTotal, currentUsedCredit, tier = 'SILVER') {
    const tierConfig = DEALER_TIERS[tier] || DEALER_TIERS.SILVER
    const availableCredit = tierConfig.creditLimit - currentUsedCredit

    if (orderTotal > availableCredit) {
      return {
        allowed: false,
        reason: `Credit limit exceeded. Available: ₹${availableCredit}. Order Total: ₹${orderTotal}`,
      }
    }

    return { allowed: true }
  }

  /**
   * Get dealer tier based on monthly sales volume.
   * @param {number} monthlyVolume
   * @returns {string} Tier key
   */
  determineTier(monthlyVolume) {
    if (monthlyVolume >= DEALER_TIERS.PLATINUM.minMonthlyVolume) return 'PLATINUM'
    if (monthlyVolume >= DEALER_TIERS.GOLD.minMonthlyVolume) return 'GOLD'
    return 'SILVER'
  }

  /**
   * Extract dealer metadata from order data if available.
   */
  getDealerContext(orderData) {
    if (!orderData || !orderData.dealerId) return null
    return {
      id: orderData.dealerId,
      tier: orderData.dealerTier || 'SILVER',
      usedCredit: orderData.usedCredit || 0,
    }
  }
}

export default new DealerService()
