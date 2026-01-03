/**
 * Wholesale Service
 * Manages tiered pricing for bulk orders and credit limit validations for dealers.
 */

const PRICE_TIERS = [
  { minQty: 100, discount: 0.2 }, // 20% discount
  { minQty: 50, discount: 0.15 }, // 15% discount
  { minQty: 10, discount: 0.1 }, // 10% discount
  { minQty: 0, discount: 0.0 }, // Base price
]

class WholesaleService {
  /**
   * Calculates the discounted unit price based on quantity.
   * @param {number} basePrice - The standard retail price
   * @param {number} quantity - Number of units being ordered
   * @returns {number} The discounted unit price
   */
  calculateTieredPrice(basePrice, quantity) {
    if (quantity <= 0) return basePrice

    const tier = PRICE_TIERS.find((t) => quantity >= t.minQty)
    const discountAmount = basePrice * (tier ? tier.discount : 0)
    return Math.floor(basePrice - discountAmount)
  }

  /**
   * Validates if a dealer has sufficient credit for an order.
   * @param {Object} dealer - The dealer object with creditLimit
   * @param {number} orderAmount - Total amount of the proposed order
   * @returns {Object} { success: boolean, message: string, remainingCredit: number }
   */
  validateCredit(dealer, orderAmount) {
    if (!dealer || typeof dealer.creditLimit !== 'number') {
      return { success: false, message: 'Invalid dealer credit information', remainingCredit: 0 }
    }

    // In a real system, we would subtract currently pending/unpaid orders.
    // For this simulation, we check against the total credit limit.
    const isApproved = orderAmount <= dealer.creditLimit

    return {
      success: isApproved,
      message: isApproved ? 'Credit Approved' : `Insufficient Credit. Limit: ${dealer.creditLimit}`,
      remainingCredit: Math.max(0, dealer.creditLimit - orderAmount),
    }
  }

  /**
   * Returns price breakdown for display in UI
   */
  getPriceTiers() {
    return PRICE_TIERS
  }
}

export default new WholesaleService()
