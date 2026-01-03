// Carrier Optimizer Service
// Intelligent carrier selection based on cost, delivery time, service rates,
// and historical performance data for optimal logistics routing.

import { cacheData, retrieveCachedData } from './offlineCacheService'

const CARRIER_CONFIG = {
  delhivery: {
    id: 'delhivery',
    name: 'Delhivery',
    weight_limit: 30,
    cod_enabled: true,
    base_rate: 45,
    zones: ['metro', 'tier1', 'tier2', 'tier3'],
    sla_days: { metro: 1, tier1: 2, tier2: 3, tier3: 5 },
  },
  xpressbees: {
    id: 'xpressbees',
    name: 'XpressBees',
    weight_limit: 25,
    cod_enabled: true,
    base_rate: 50,
    zones: ['metro', 'tier1', 'tier2', 'tier3'],
    sla_days: { metro: 2, tier1: 2, tier2: 3, tier3: 5 },
  },
  fedex: {
    id: 'fedex',
    name: 'FedEx',
    weight_limit: 50,
    cod_enabled: false,
    base_rate: 75,
    zones: ['metro', 'tier1'],
    sla_days: { metro: 1, tier1: 1 },
  },
}

/**
 * Get optimal carrier for an order
 * @param {Object} order - Order data {pincode, weight, amount, zone, delivery_type}
 * @returns {Promise<Object>} - Recommended carrier with cost details
 */
export const getOptimalCarrier = async (order) => {
  try {
    // Validate order
    if (!order.pincode || !order.weight || !order.zone) {
      throw new Error('Missing required fields: pincode, weight, zone')
    }

    // Get historical performance data
    const historicalData = (await retrieveCachedData(`carrier:history:${order.zone}`)) || {}

    // Filter carriers based on constraints
    const eligibleCarriers = Object.values(CARRIER_CONFIG).filter((carrier) => {
      return (
        carrier.weight_limit >= order.weight &&
        carrier.zones.includes(order.zone) &&
        (!order.cod_required || carrier.cod_enabled)
      )
    })

    if (eligibleCarriers.length === 0) {
      throw new Error('No eligible carriers for this order')
    }

    // Score each carrier
    const scoredCarriers = eligibleCarriers.map((carrier) => {
      const score = calculateCarrierScore(carrier, order, historicalData[carrier.id])
      return { carrier, score }
    })

    // Sort by score and return best option
    const best = scoredCarriers.sort((a, b) => b.score - a.score)[0]
    const cost = calculateShippingCost(best.carrier, order)

    const result = {
      carrier: best.carrier,
      cost,
      sla_days: best.carrier.sla_days[order.zone],
      score: best.score,
      alternates: scoredCarriers.slice(1, 3).map((sc) => ({
        carrier: sc.carrier,
        cost: calculateShippingCost(sc.carrier, order),
        sla_days: sc.carrier.sla_days[order.zone],
      })),
    }

    console.log('[Optimizer] Selected carrier:', result.carrier.name, 'Cost: ₹' + cost)
    return result
  } catch (err) {
    console.error('[Optimizer] Error:', err)
    return null
  }
}

/**
 * Record carrier performance for future optimization
 * @param {String} carrierId - Carrier ID
 * @param {Object} performance - {zone, delivery_time_days, success, cost, weight}
 */
export const recordCarrierPerformance = async (carrierId, performance) => {
  try {
    const key = `carrier:history:${performance.zone}`
    const history = (await retrieveCachedData(key)) || {}

    if (!history[carrierId]) {
      history[carrierId] = {
        total_shipments: 0,
        successful: 0,
        failed: 0,
        avg_delivery_days: 0,
        avg_cost: 0,
      }
    }

    const stats = history[carrierId]
    stats.total_shipments += 1
    if (performance.success) stats.successful += 1
    else stats.failed += 1

    // Update averages
    stats.avg_delivery_days =
      (stats.avg_delivery_days * (stats.total_shipments - 1) + performance.delivery_time_days) /
      stats.total_shipments
    stats.avg_cost =
      (stats.avg_cost * (stats.total_shipments - 1) + performance.cost) / stats.total_shipments
    stats.success_rate = ((stats.successful / stats.total_shipments) * 100).toFixed(2)

    await cacheData(key, history, 90 * 24 * 60 * 60 * 1000) // 90 days
    console.log(`[Optimizer] Recorded ${carrierId} performance`)
  } catch (err) {
    console.error('[Optimizer] Performance record failed:', err)
  }
}

/**
 * Get all carriers matching zone
 */
export const getCarriersByZone = (zone) => {
  return Object.values(CARRIER_CONFIG).filter((c) => c.zones.includes(zone))
}

// ===== Private Helpers =====

function calculateCarrierScore(carrier, order, historicalData) {
  let score = 100

  // Cost factor (lower is better)
  const cost = calculateShippingCost(carrier, order)
  score -= (cost / 200) * 20 // Max 20 point deduction

  // SLA factor (faster is better)
  const sla = carrier.sla_days[order.zone]
  score -= sla * 2 // 2 points per day

  // Historical performance (if available)
  if (historicalData && historicalData.success_rate) {
    score += (historicalData.success_rate / 100) * 30 // Max 30 points
  }

  // COD convenience
  if (order.cod_required && carrier.cod_enabled) {
    score += 10
  }

  return Math.max(0, score)
}

function calculateShippingCost(carrier, order) {
  let cost = carrier.base_rate

  // Weight surcharge (if over base)
  if (order.weight > 0.5) {
    cost += (order.weight - 0.5) * 15 // ₹15 per additional 100g
  }

  // COD surcharge
  if (order.cod_required && order.amount > 0) {
    cost += Math.ceil(order.amount * 0.01) // 1% of order value
  }

  // Zone premium
  const zonePremium = {
    metro: 0,
    tier1: 10,
    tier2: 20,
    tier3: 30,
  }
  cost += zonePremium[order.zone] || 0

  return Math.round(cost * 100) / 100 // Round to 2 decimals
}

export default {
  getOptimalCarrier,
  recordCarrierPerformance,
  getCarriersByZone,
  CARRIER_CONFIG,
}
