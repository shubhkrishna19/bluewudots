// Carrier Optimizer Service v2
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
  bluedart: {
    id: 'bluedart',
    name: 'BlueDart',
    weight_limit: 40,
    cod_enabled: true,
    base_rate: 65,
    zones: ['metro', 'tier1', 'tier2'],
    sla_days: { metro: 1, tier1: 1, tier2: 2 },
  },
  xpressbees: {
    id: 'xpressbees',
    name: 'XpressBees',
    weight_limit: 25,
    cod_enabled: true,
    base_rate: 40,
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

const PERFORMANCE_WEIGHTS = {
  COST: 0.4,
  SLA: 0.3,
  RELIABILITY: 0.3,
}

/**
 * Get optimal carrier for an order using dynamic weighted scoring
 * @param {Object} order - Order data {pincode, weight, amount, zone, delivery_type}
 * @returns {Promise<Object>} - Recommended carrier with cost details
 */
export const getOptimalCarrier = async (order) => {
  try {
    if (!order.pincode || !order.weight || !order.zone) {
      throw new Error('Missing required fields: pincode, weight, zone')
    }

    const historicalData = (await retrieveCachedData(`carrier:history:${order.zone}`)) || {}

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

    const scoredCarriers = eligibleCarriers.map((carrier) => {
      const score = calculateCarrierScore(carrier, order, historicalData[carrier.id])
      return { carrier, score }
    })

    // Sort by score descending (using raw precision)
    scoredCarriers.sort((a, b) => b.score - a.score)

    const best = scoredCarriers[0]
    const cost = calculateShippingCost(best.carrier, order)

    const result = {
      carrier: best.carrier,
      cost,
      sla_days: best.carrier.sla_days[order.zone],
      score: Math.min(100, Math.round(best.score * 10) / 10), // Keep 1 decimal for result
      alternates: scoredCarriers.slice(1, 3).map((sc) => ({
        carrier: sc.carrier,
        cost: calculateShippingCost(sc.carrier, order),
        sla_days: sc.carrier.sla_days[order.zone],
        score: Math.min(100, Math.round(sc.score * 10) / 10)
      })),
      timestamp: new Date().toISOString(),
    }

    console.log(`[Optimizer] Hub Route Selected: ${result.carrier.name} (Score: ${result.score})`)
    return result
  } catch (err) {
    console.error('[Optimizer] AI Route Calculation Error:', err)
    return null
  }
}

/**
 * Dynamic Scoring Engine (P32 Extension)
 */
function calculateCarrierScore(carrier, order, historicalData) {
  let score = 0

  // 1. Cost Score (0-100, Normalized)
  const cost = calculateShippingCost(carrier, order)
  const maxExpectedCost = 300
  const costScore = Math.max(0, 100 - (cost / maxExpectedCost) * 100)

  // 2. SLA Score (0-100)
  const sla = carrier.sla_days[order.zone] || 5
  const slaScore = Math.max(0, 100 - (sla - 1) * 20) // 1 day = 100, 5 days = 20

  // 3. Reliability Score (0-100)
  let reliabilityScore = 80 // Base reliability for carriers with no history
  if (historicalData && historicalData.total_shipments > 5) {
    const successRate = (historicalData.successful / historicalData.total_shipments) * 100
    reliabilityScore = successRate
  }

  // 4. Weighted Calculation
  score = (costScore * PERFORMANCE_WEIGHTS.COST) +
    (slaScore * PERFORMANCE_WEIGHTS.SLA) +
    (reliabilityScore * PERFORMANCE_WEIGHTS.RELIABILITY)

  // 5. Contextual Modifiers
  if (order.priority === 'express') {
    if (sla <= 1) score += 15 // Increased boost for super-fast carriers
    if (carrier.id === 'bluedart' || carrier.id === 'fedex') score += 10 // Premium Carrier Trust Boost
  }

  if (historicalData && historicalData.is_degraded) score -= 50

  return score
}

/**
 * Record carrier performance for future optimization
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
        is_degraded: false,
      }
    }

    const stats = history[carrierId]
    stats.total_shipments += 1
    if (performance.success) stats.successful += 1
    else stats.failed += 1

    stats.avg_delivery_days =
      (stats.avg_delivery_days * (stats.total_shipments - 1) + performance.delivery_time_days) /
      stats.total_shipments
    stats.avg_cost =
      (stats.avg_cost * (stats.total_shipments - 1) + performance.cost) / stats.total_shipments

    // Auto-degradation logic: If last 3 shipments failed or success rate < 60% with enough volume
    if (stats.total_shipments > 10 && stats.successful / stats.total_shipments < 0.6) {
      stats.is_degraded = true
    } else {
      stats.is_degraded = false
    }

    await cacheData(key, history, 90 * 24 * 60 * 60 * 1000)
    console.log(`[Optimizer] Performance Updated for ${carrierId}`)
  } catch (err) {
    console.error('[Optimizer] Performance record failed:', err)
  }
}

function calculateShippingCost(carrier, order) {
  let cost = carrier.base_rate
  if (order.weight > 0.5) cost += (order.weight - 0.5) * 15
  if (order.cod_required && order.amount > 0) cost += Math.ceil(order.amount * 0.01)

  const zonePremium = { metro: 0, tier1: 10, tier2: 20, tier3: 30 }
  cost += zonePremium[order.zone] || 0

  return Math.round(cost * 100) / 100
}

export const getCarriersByZone = (zone) => {
  return Object.values(CARRIER_CONFIG).filter((c) => c.zones.includes(zone))
}

export default {
  getOptimalCarrier,
  recordCarrierPerformance,
  getCarriersByZone,
  CARRIER_CONFIG,
}
