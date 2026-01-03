/**
 * Abstract Carrier Strategy
 * Defines the contract that all carrier implementations must follow.
 */
class AbstractCarrierStrategy {
  constructor(config) {
    if (this.constructor === AbstractCarrierStrategy) {
      throw new Error("Abstract classes can't be instantiated.")
    }
    this.config = config || {}
    this.name = 'AbstractCarrier'
  }

  /**
   * Fetch rates for a shipment
   * @param {object} shipment
   * @returns {Promise<object>} Rate details
   */
  async getRates(shipment) {
    throw new Error("Method 'getRates()' must be implemented.")
  }

  /**
   * Create a shipment/label
   * @param {object} order
   * @returns {Promise<object>} Shipment details
   */
  async createShipment(order) {
    throw new Error("Method 'createShipment()' must be implemented.")
  }

  /**
   * Track a shipment
   * @param {string} trackingDetails
   * @returns {Promise<object>} Tracking status
   */
  async trackShipment(trackingDetails) {
    throw new Error("Method 'trackShipment()' must be implemented.")
  }

  /**
   * Cancel a shipment
   * @param {string} shipmentId
   * @returns {Promise<boolean>} Success status
   */
  async cancelShipment(shipmentId) {
    throw new Error("Method 'cancelShipment()' must be implemented.")
  }

  /**
   * Common method to calculate volumetric weight
   * @param {number} l Length (cm)
   * @param {number} b Breadth (cm)
   * @param {number} h Height (cm)
   * @param {number} divisor Volumetric divisor (default 5000)
   * @returns {number} Weight in kg
   */
  calculateVolumetricWeight(l, b, h, divisor = 5000) {
    return (l * b * h) / divisor
  }
}

export default AbstractCarrierStrategy
