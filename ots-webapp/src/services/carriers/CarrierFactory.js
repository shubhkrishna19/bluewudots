import DelhiveryStrategy from './DelhiveryStrategy'

/**
 * Carrier Factory
 * Creates and manages instances of carrier strategies.
 */
class CarrierFactory {
  constructor() {
    this.strategies = {}
  }

  /**
   * Get or create a carrier strategy instance
   * @param {string} carrierId - 'delhivery', 'bluedart', etc.
   * @returns {object} Carrier strategy instance
   */
  getCarrier(carrierId) {
    if (this.strategies[carrierId]) {
      return this.strategies[carrierId]
    }

    let strategy
    switch (carrierId.toLowerCase()) {
      case 'delhivery':
        strategy = new DelhiveryStrategy({
          token:
            import.meta.env.VITE_DELHIVERY_TOKEN ||
            (typeof process !== 'undefined' ? process.env.VITE_DELHIVERY_TOKEN : undefined),
          mode:
            import.meta.env.VITE_DELHIVERY_MODE ||
            (typeof process !== 'undefined' ? process.env.VITE_DELHIVERY_MODE : 'test'),
        })
        break
      // Future carriers:
      // case 'bluedart': strategy = new BlueDartStrategy(...); break;
      default:
        throw new Error(`Carrier '${carrierId}' not supported.`)
    }

    this.strategies[carrierId] = strategy
    return strategy
  }

  /**
   * Get all initialized carriers
   */
  getAllCarriers() {
    // For now, return list of supported IDs to force instantiation if needed
    const supported = ['delhivery']
    return supported.map((id) => this.getCarrier(id))
  }

  /**
   * Reset strategies (useful for testing)
   */
  reset() {
    this.strategies = {}
  }
}

// Export as Singleton
const carrierFactory = new CarrierFactory()
export default carrierFactory
