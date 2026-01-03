/**
 * AI-Powered Margin Protection Service
 *
 * Protects profitability by analyzing orders and flagged those that fall
 * below acceptable margin thresholds based on real-time cost data.
 */

import { calculateProfitability } from '../utils/commercialUtils'

const DEFAULT_MIN_MARGIN = 12.0
const CRITICAL_MARGIN_LIMIT = 5.0 // Hard prevention limit

/**
 * Get system-wide margin thresholds
 */
export const getMarginThresholds = () => {
  // This could eventually come from a database or localStorage settings
  return {
    target: DEFAULT_MIN_MARGIN,
    critical: CRITICAL_MARGIN_LIMIT,
  }
}

export const validateMargin = (order, skuData) => {
  if (!skuData) return { isProtected: false, alert: 'Incomplete SKU metadata', shouldBlock: false }

  const { target, critical } = getMarginThresholds()

  const analysis = calculateProfitability({
    sellingPrice: order.amount,
    bomCost: skuData.bomCost || 0,
    commissionPercent: skuData.commissionPercent || 15,
    tmsLevel: skuData.tmsLevel || 'TL2',
    gstRate: 18,
    shippingCost: order.shippingCost || 0,
  })

  const marginThreshold = skuData.minMarginThreshold || target
  const currentMargin = parseFloat(analysis.marginPercent)

  if (currentMargin < critical) {
    return {
      isProtected: false,
      shouldBlock: true,
      alert: `CRITICAL LOSS: Margin (${currentMargin}%) is below the absolute minimum of ${critical}%. Order creation blocked.`,
      analysis,
    }
  }

  if (currentMargin < marginThreshold) {
    return {
      isProtected: false,
      shouldBlock: false,
      alert: `WARNING: Low Margin detected (${currentMargin}%). Below target ${marginThreshold}%. Flagged for review.`,
      analysis,
    }
  }

  return { isProtected: true, alert: null, shouldBlock: false, analysis }
}

/**
 * Batch analyze recent orders for margin leakage
 * @param {object[]} orders
 * @param {object[]} skuMaster
 * @returns {object[]} - Flagged orders
 */
export const detectMarginLeakage = (orders, skuMaster) => {
  return orders
    .map((order) => {
      const skuData = skuMaster.find((s) => s.sku === order.sku)
      const validation = validateMargin(order, skuData)
      return {
        ...order,
        marginAlert: validation.alert,
        marginAnalysis: validation.analysis,
      }
    })
    .filter((o) => o.marginAlert !== null)
}

export default {
  validateMargin,
  detectMarginLeakage,
  DEFAULT_MIN_MARGIN,
}
