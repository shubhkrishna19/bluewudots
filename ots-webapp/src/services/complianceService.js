/**
 * Compliance Service
 * Handles HSN/SAC code mapping, GST calculations, and E-way bill generation.
 */

// HSN Code Mapping (Furniture-specific)
const HSN_MAP = {
  STUDY_TABLE: '94035090',
  OFFICE_CHAIR: '94013000',
  BOOKSHELF: '94036000',
  SOFA: '94016100',
  BED: '94042100',
  DEFAULT: '94039000',
}

// GST Rates by Category
const GST_RATES = {
  FURNITURE: 18,
  HARDWARE: 12,
  FABRIC: 5,
}

// Legacy Database for backward compatibility if needed
export const HSN_DATABASE = {
  9403: { description: 'Furniture & Bedding', gstRate: 18, exportDuty: 0 },
  9401: { description: 'Seats and Chairs', gstRate: 18, exportDuty: 0 },
  8302: { description: 'Base Metal Fittings', gstRate: 18, exportDuty: 0 },
  7309: { description: 'Iron/Steel Containers', gstRate: 18, exportDuty: 0 },
}

class ComplianceService {
  /**
   * Get HSN code for a given SKU.
   * @param {string} sku - Product SKU
   * @returns {string} HSN Code
   */
  getHSNCode(sku) {
    const skuUpper = sku?.toUpperCase() || ''
    for (const [key, code] of Object.entries(HSN_MAP)) {
      if (skuUpper.includes(key)) return code
    }
    return HSN_MAP.DEFAULT
  }

  /**
   * Get applicable GST rate based on SKU category.
   * @param {string} sku
   * @returns {number} GST percentage
   */
  getGSTRate(sku) {
    const skuUpper = sku?.toUpperCase() || ''
    if (skuUpper.includes('CHAIR') || skuUpper.includes('TABLE') || skuUpper.includes('SHELF')) {
      return GST_RATES.FURNITURE
    }
    if (skuUpper.includes('HINGE') || skuUpper.includes('SCREW')) {
      return GST_RATES.HARDWARE
    }
    return GST_RATES.FURNITURE // Default
  }

  /**
   * Determine if E-way bill is required.
   * @param {number} invoiceValue
   * @param {string} originState
   * @param {string} destState
   * @returns {boolean}
   */
  isEwayBillRequired(invoiceValue, originState, destState) {
    // E-way bill required for goods > ₹50,000 or inter-state movement
    return invoiceValue > 50000 || originState !== destState
  }

  /**
   * Generate E-way bill data structure.
   * @param {Object} order
   * @returns {Object} E-way bill details
   */
  generateEwayBill(order) {
    const ewayNumber = `EWB${Date.now().toString(36).toUpperCase()}`
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 3) // 3-day validity

    return {
      ewayNumber,
      generatedAt: new Date().toISOString(),
      validUntil: validUntil.toISOString(),
      orderId: order.id,
      originState: 'Maharashtra',
      destState: order.state || 'N/A',
      invoiceValue: order.total || 0,
      hsnCode: this.getHSNCode(order.sku),
      gstRate: this.getGSTRate(order.sku),
      vehicleNumber: 'MH-02-XX-1234',
      transporterName: order.carrier || 'Logistics',
    }
  }

  // Legacy method adapters
  validateHSN(hsnCode) {
    const prefix = hsnCode?.substring(0, 4)
    return HSN_DATABASE[prefix] || null
  }
}

const service = new ComplianceService()

export const validateHSN = (code) => service.validateHSN(code)
export const getHSNCode = (sku) => service.getHSNCode(sku)

export default service
