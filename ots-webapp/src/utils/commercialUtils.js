/**
 * Commercial Utilities - Business logic for pricing, commissions, and profitability
 * Based on legacy Bluewud Commercial Model (Deluge)
 */

export const TMS_LEVELS = {
  TL1: { name: 'Level 1', overhead: 18, desc: 'High touch / Premium' },
  TL2: { name: 'Level 2', overhead: 12, desc: 'Standard' },
  TL3: { name: 'Level 3', overhead: 8, desc: 'Low touch / Bulk' },
}

/**
 * Calculate net profitability for an SKU/Order
 * @param {object} params - { sellingPrice, bomCost, commissionPercent, tmsLevel, gstRate, shippingCost }
 * @returns {object} - Detailed profit breakdown
 */
export const calculateProfitability = ({
  sellingPrice,
  bomCost,
  commissionPercent = 15,
  tmsLevel = 'TL1',
  gstRate = 18,
  shippingCost = 0,
  gatewayFeePercent = 2.0, // New: Payment Gateway/PG Charges
  returnRatePercent = 5.0, // New: Expected RTO/Return Provision
}) => {
  // 1. GST Calculation (Inclusive)
  const basePrice = sellingPrice / (1 + gstRate / 100)
  const gstAmount = sellingPrice - basePrice

  // 2. Marketplace Commission
  const commissionAmount = (sellingPrice * commissionPercent) / 100

  // 3. Operational Overhead (TMS Level) on Base Price
  const overheadPercent = TMS_LEVELS[tmsLevel]?.overhead || 18
  const overheadAmount = (basePrice * overheadPercent) / 100

  // 4. Shipping Estimate
  const activeShipping = shippingCost || sellingPrice * 0.08

  // 5. NEW: Gateway Fee
  const gatewayFee = (sellingPrice * gatewayFeePercent) / 100

  // 6. NEW: Return/RTO Provision (Estimated cost of returns spread across all orders)
  // Formula: (Shipping Cost * 2 [Round trip]) * Return Rate %
  const returnProvision = activeShipping * 2 * (returnRatePercent / 100)

  // 7. Net Revenue
  const totalCosts =
    gstAmount + commissionAmount + activeShipping + overheadAmount + gatewayFee + returnProvision
  const netRevenue = sellingPrice - totalCosts

  // 8. Net Profit
  const netProfit = netRevenue - bomCost
  const marginPercent = basePrice > 0 ? (netProfit / basePrice) * 100 : 0

  return {
    grossRevenue: sellingPrice,
    bomCost,
    breakdown: {
      tax: Math.round(gstAmount),
      commission: Math.round(commissionAmount),
      overhead: Math.round(overheadAmount),
      shipping: Math.round(activeShipping),
      gateway: Math.round(gatewayFee),
      returnProvision: Math.round(returnProvision),
    },
    netRevenue: Math.round(netRevenue),
    netProfit: Math.round(netProfit),
    marginPercent: marginPercent.toFixed(2),
    isHealthy: marginPercent > 12,
  }
}

/**
 * Get Enhanced SKU with Parent Inheritance
 * @param {string} skuCode - Child SKU Code
 * @param {array} skuMaster - Master list of all SKUs (Parent & Child)
 * @returns {object} - SKU with inherited attributes
 */
export const getEnhancedSKU = (skuCode, skuMaster = []) => {
  const sku = skuMaster.find((s) => s.sku === skuCode)
  if (!sku) return null

  // If it's a child and has a parent reference, inherit attributes
  if (sku.parentSku) {
    const parent = skuMaster.find((s) => s.sku === sku.parentSku)
    if (parent) {
      return {
        ...parent,
        ...sku,
        // Ensure child specific overrides are kept, but parent provides base dimensions/weight
        dimensions: sku.dimensions || parent.dimensions,
        weight: sku.weight || parent.weight,
        bomCost: sku.bomCost || parent.bomCost,
        tmsLevel: sku.tmsLevel || parent.tmsLevel,
      }
    }
  }
  return sku
}

/**
 * Resolve SKU Aliases to Parent MTP Code
 * @param {string} alias - The incoming SKU from marketplace (e.g. 'BW-CHAIR-BLK-AMZ')
 * @param {array} aliasMaster - Array of { alias, parentCode }
 * @returns {string} - Parent MTP Code
 */
export const resolveSkuAlias = (alias, aliasMaster = []) => {
  const found = aliasMaster.find((item) => item.alias === alias)
  return found ? found.parentCode : alias
}

export default {
  TMS_LEVELS,
  calculateProfitability,
  getEnhancedSKU,
  resolveSkuAlias,
}
