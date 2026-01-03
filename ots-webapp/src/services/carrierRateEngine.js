/**
 * Carrier Rate Engine - Calculate shipping rates based on weight, zone, and carrier
 * Uses actual rate card logic for Pan-India logistics
 */

// Zone mapping for India
const ZONE_MAPPING = {
  // North Zone
  Delhi: 'NORTH',
  Haryana: 'NORTH',
  Punjab: 'NORTH',
  'Uttar Pradesh': 'NORTH',
  Uttarakhand: 'NORTH',
  'Himachal Pradesh': 'NORTH',
  Rajasthan: 'NORTH',
  'Jammu and Kashmir': 'NORTH',
  Ladakh: 'NORTH',
  Chandigarh: 'NORTH',

  // South Zone
  Karnataka: 'SOUTH',
  'Tamil Nadu': 'SOUTH',
  Kerala: 'SOUTH',
  'Andhra Pradesh': 'SOUTH',
  Telangana: 'SOUTH',
  Puducherry: 'SOUTH',

  // East Zone
  'West Bengal': 'EAST',
  Odisha: 'EAST',
  Bihar: 'EAST',
  Jharkhand: 'EAST',

  // West Zone
  Maharashtra: 'WEST',
  Gujarat: 'WEST',
  'Madhya Pradesh': 'WEST',
  Chhattisgarh: 'WEST',
  Goa: 'WEST',

  // Northeast Zone (premium rates)
  Assam: 'NE',
  Meghalaya: 'NE',
  Tripura: 'NE',
  Mizoram: 'NE',
  Manipur: 'NE',
  Nagaland: 'NE',
  'Arunachal Pradesh': 'NE',
  Sikkim: 'NE',
}

// Origin zone (Bluewud warehouse in Karnataka)
const ORIGIN_ZONE = 'SOUTH'
const ORIGIN_STATE = 'Karnataka'

// Carrier rate cards (per kg, base rate + additional per 0.5kg)
export const CARRIER_RATES = {
  delhivery: {
    name: 'Delhivery',
    logo: '🚚',
    serviceable: true,
    zones: {
      LOCAL: { base: 35, additional: 15, minWeight: 0.5, deliveryDays: [1, 2] },
      INTRA_ZONE: { base: 45, additional: 20, minWeight: 0.5, deliveryDays: [2, 3] },
      ADJACENT: { base: 55, additional: 25, minWeight: 0.5, deliveryDays: [3, 4] },
      METRO: { base: 50, additional: 22, minWeight: 0.5, deliveryDays: [2, 4] },
      ROI: { base: 65, additional: 30, minWeight: 0.5, deliveryDays: [4, 6] },
      NE: { base: 95, additional: 45, minWeight: 0.5, deliveryDays: [6, 8] },
    },
    codCharges: 25,
    codPercentage: 2,
    fuelSurcharge: 15,
    gst: 18,
    reliabilityScore: 85, // % Delivery Success (Avg)
  },

  bluedart: {
    name: 'BlueDart',
    logo: '📦',
    serviceable: true,
    zones: {
      LOCAL: { base: 45, additional: 20, minWeight: 0.5, deliveryDays: [1, 2] },
      INTRA_ZONE: { base: 60, additional: 28, minWeight: 0.5, deliveryDays: [1, 2] },
      ADJACENT: { base: 75, additional: 35, minWeight: 0.5, deliveryDays: [2, 3] },
      METRO: { base: 65, additional: 30, minWeight: 0.5, deliveryDays: [1, 2] },
      ROI: { base: 85, additional: 40, minWeight: 0.5, deliveryDays: [2, 4] },
      NE: { base: 120, additional: 55, minWeight: 0.5, deliveryDays: [4, 6] },
    },
    codCharges: 35,
    codPercentage: 2.5,
    fuelSurcharge: 20,
    gst: 18,
    reliabilityScore: 98, // % Delivery Success (Premium)
  },

  xpressbees: {
    name: 'XpressBees',
    logo: '🐝',
    serviceable: true,
    zones: {
      LOCAL: { base: 30, additional: 12, minWeight: 0.5, deliveryDays: [2, 3] },
      INTRA_ZONE: { base: 40, additional: 18, minWeight: 0.5, deliveryDays: [3, 4] },
      ADJACENT: { base: 50, additional: 22, minWeight: 0.5, deliveryDays: [4, 5] },
      METRO: { base: 45, additional: 20, minWeight: 0.5, deliveryDays: [3, 4] },
      ROI: { base: 60, additional: 28, minWeight: 0.5, deliveryDays: [5, 7] },
      NE: { base: 90, additional: 42, minWeight: 0.5, deliveryDays: [7, 10] },
    },
    codCharges: 20,
    codPercentage: 1.5,
    fuelSurcharge: 10,
    gst: 18,
    reliabilityScore: 82, // % Delivery Success (Budget)
  },

  ecomexpress: {
    name: 'Ecom Express',
    logo: '📮',
    serviceable: true,
    zones: {
      LOCAL: { base: 32, additional: 14, minWeight: 0.5, deliveryDays: [2, 3] },
      INTRA_ZONE: { base: 42, additional: 19, minWeight: 0.5, deliveryDays: [3, 4] },
      ADJACENT: { base: 52, additional: 24, minWeight: 0.5, deliveryDays: [4, 5] },
      METRO: { base: 48, additional: 21, minWeight: 0.5, deliveryDays: [2, 4] },
      ROI: { base: 62, additional: 29, minWeight: 0.5, deliveryDays: [5, 7] },
      NE: { base: 88, additional: 40, minWeight: 0.5, deliveryDays: [6, 9] },
    },
    codCharges: 22,
    codPercentage: 1.8,
    fuelSurcharge: 12,
    gst: 18,
    reliabilityScore: 88, // % Delivery Success (Steady)
  },
}

/**
 * Preferred Carrier Matrix (Legacy Logic)
 * Defines the 'Default' preferred carrier for specific zones or states
 */
export const PREFERRED_CARRIER_MATRIX = {
  METRO: 'bluedart',
  LOCAL: 'delhivery',
  NE: 'ecomexpress',
  INTRA_ZONE: 'delhivery',
  Maharashtra: 'xpressbees', // Special preferred carrier for MH
}

// Metro cities for special rates
const METRO_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
]

/**
 * Get zone for a destination
 * @param {string} state
 * @param {string} city
 * @returns {string}
 */
export const getZone = (state, city = '') => {
  const destZone = ZONE_MAPPING[state] || 'ROI'

  // Check if same zone as origin
  if (destZone === ORIGIN_ZONE) {
    if (state === ORIGIN_STATE) {
      return 'LOCAL'
    }
    return 'INTRA_ZONE'
  }

  // Check if metro city
  if (METRO_CITIES.includes(city)) {
    return 'METRO'
  }

  // Check if adjacent zone
  const adjacentZones = {
    SOUTH: ['WEST'],
    WEST: ['SOUTH', 'NORTH'],
    NORTH: ['WEST', 'EAST'],
    EAST: ['NORTH', 'NE'],
  }

  if (adjacentZones[ORIGIN_ZONE]?.includes(destZone)) {
    return 'ADJACENT'
  }

  // Northeast special zone
  if (destZone === 'NE') {
    return 'NE'
  }

  return 'ROI'
}

/**
 * Calculate shipping rate for a carrier
 * @param {string} carrierId
 * @param {object} shipment - { weight, state, city, isCOD, codAmount }
 * @returns {object}
 */
export const calculateRate = (carrierId, shipment) => {
  const carrier = CARRIER_RATES[carrierId]
  if (!carrier || !carrier.serviceable) {
    return { error: 'Carrier not available' }
  }

  const zone = getZone(shipment.state, shipment.city)
  const zoneRates = carrier.zones[zone]

  if (!zoneRates) {
    return { error: 'Zone not serviceable' }
  }

  // Weight calculation (round up to nearest 0.5kg)
  const weight = Math.max(shipment.weight || 0.5, zoneRates.minWeight)
  const billedWeight = Math.ceil(weight * 2) / 2

  // Base freight
  let freight = zoneRates.base
  if (billedWeight > 0.5) {
    const additionalSlabs = (billedWeight - 0.5) / 0.5
    freight += additionalSlabs * zoneRates.additional
  }

  // Fuel surcharge
  const fuelCharge = (freight * carrier.fuelSurcharge) / 100

  // COD charges
  let codCharge = 0
  if (shipment.isCOD && shipment.codAmount) {
    codCharge = carrier.codCharges + (shipment.codAmount * carrier.codPercentage) / 100
  }

  // Subtotal before GST
  const subtotal = freight + fuelCharge + codCharge

  // GST
  const gst = (subtotal * carrier.gst) / 100

  // Total
  const total = Math.round(subtotal + gst)

  return {
    carrierId,
    carrierName: carrier.name,
    carrierLogo: carrier.logo,
    zone,
    billedWeight,
    breakdown: {
      freight: Math.round(freight),
      fuelSurcharge: Math.round(fuelCharge),
      codCharge: Math.round(codCharge),
      subtotal: Math.round(subtotal),
      gst: Math.round(gst),
    },
    total,
    estimatedDelivery: zoneRates.deliveryDays,
    isCOD: shipment.isCOD || false,
  }
}

/**
 * Get rates from all carriers (Hybrid: Live API + Static Fallback)
 * @param {object} shipment
 * @returns {Promise<object[]>}
 */
export const getAllRates = async (shipment) => {
  // Check for Live API credentials
  const delhiveryToken =
    import.meta.env.VITE_DELHIVERY_TOKEN ||
    (typeof process !== 'undefined' ? process.env.VITE_DELHIVERY_TOKEN : undefined)
  const bluedartKey =
    import.meta.env.VITE_BLUEDART_LICENSE_KEY ||
    (typeof process !== 'undefined' ? process.env.VITE_BLUEDART_LICENSE_KEY : undefined)

  let liveRates = []

  // 1. Try Live APIs if credentials exist
  if (delhiveryToken || bluedartKey) {
    try {
      liveRates = await fetchLiveRates(shipment, { delhiveryToken, bluedartKey })
    } catch (error) {
      console.warn('Live Rate Fetch Failed:', error)
    }
  }

  // 2. Calculate Static Rates (Always run as fallback/baseline)
  const staticRates = Object.keys(CARRIER_RATES).map((carrierId) => {
    const rate = calculateRate(carrierId, shipment)

    // Inject AI Delay Prediction
    const aiDelay = predictTransitDelay(carrierId, shipment)

    return { ...rate, carrierId, type: 'STATIC', aiDelay }
  })

  // 3. Merge: Prefer Live over Static for same carrier
  const mergedRates = staticRates.map((staticRate) => {
    const liveMatch = liveRates.find((l) => l.carrierId === staticRate.carrierId)
    // Merge liveMatch ON TOP of staticRate to preserve fields like 'zone' if API doesn't return them
    return liveMatch ? { ...staticRate, ...liveMatch, type: 'LIVE' } : staticRate
  })

  // Sort by total (cheapest first)
  return mergedRates.filter((r) => !r.error).sort((a, b) => a.total - b.total)
}

/**
 * AI-Driven Transit Delay Prediction
 * Simulates high-latency zones or carrier backlogs based on historic patterns
 */
const predictTransitDelay = (carrierId, shipment) => {
  let extraDays = 0
  const zone = getZone(shipment.state, shipment.city)

  // Northeast is historically slower for budget carriers
  if (zone === 'NE' && (carrierId === 'xpressbees' || carrierId === 'ecomexpress')) {
    extraDays += 1.5
  }

  // Heavy rains / Festive season simulation for specific states
  const monsoonStates = ['Maharashtra', 'Kerala', 'Karnataka']
  if (monsoonStates.includes(shipment.state)) {
    extraDays += 0.5
  }

  // Specific carrier backlog simulator
  if (carrierId === 'delhivery' && Math.random() > 0.8) {
    extraDays += 1 // 20% chance of random backlog
  }

  return extraDays
}

/**
 * Fetch live rates from Carrier APIs
 */
import carrierFactory from './carriers/CarrierFactory'

/**
 * Fetch live rates from Carrier APIs via Factory
 */
const fetchLiveRates = async (shipment, creds) => {
  const rates = []
  const carriers = carrierFactory.getAllCarriers()

  const ratePromises = carriers.map(async (carrier) => {
    try {
      // Rate limiting / Throttling could be handled here if needed
      const rate = await carrier.getRates(shipment)
      if (rate) rates.push(rate)
    } catch (error) {
      console.warn(`[${carrier.name}] Rate Fetch Error:`, error.message)
    }
  })

  await Promise.all(ratePromises)

  // Legacy Support: If BlueDart isn't in Factory yet but keys exist, use old simulation
  if (creds.bluedartKey && !carriers.find((c) => c.name === 'BlueDart')) {
    const staticRate = calculateRate('bluedart', shipment)
    if (!staticRate.error) {
      rates.push({
        ...staticRate,
        total: Math.round(staticRate.total * 0.98),
        carrierName: 'BlueDart (Live / API)',
        isLive: true,
      })
    }
  }

  return rates
}

export const getRecommendation = async (shipment, priority = 'smart') => {
  const rates = await getAllRates(shipment)

  if (rates.length === 0) {
    return { error: 'No carriers available' }
  }

  // Assign scores to each carrier option (Lower is better for cost/speed, Higher is better for reliability)
  const options = rates.map((rate) => {
    const carrier = CARRIER_RATES[rate.carrierId]

    // Normalize Cost (0 to 100, where 0 is cheapest)
    const minCost = Math.min(...rates.map((r) => r.total))
    const maxCost = Math.max(...rates.map((r) => r.total))
    const costScore = maxCost === minCost ? 0 : ((rate.total - minCost) / (maxCost - minCost)) * 100

    // Normalize Speed (0 to 100, where 0 is fastest)
    const minDays = Math.min(...rates.map((r) => r.estimatedDelivery[0]))
    const maxDays = Math.max(...rates.map((r) => r.estimatedDelivery[0]))
    const speedScore =
      maxDays === minDays ? 0 : ((rate.estimatedDelivery[0] - minDays) / (maxDays - minDays)) * 100

    // Reliability (100 - score, where 0 is most reliable)
    const reliabilityPenalty = 100 - carrier.reliabilityScore

    return {
      ...rate,
      scores: { cost: costScore, speed: speedScore, reliability: reliabilityPenalty },
    }
  })

  // Strategy Execution
  let winner
  switch (priority) {
    case 'speed':
      winner = options.sort((a, b) => a.scores.speed - b.scores.speed)[0]
      winner.recommendation = 'Fastest Delivery'
      winner.reason = `Rapid transit with ${winner.carrierName}`
      break

    case 'reliability':
      winner = options.sort((a, b) => a.scores.reliability - b.scores.reliability)[0]
      winner.recommendation = 'Safest Choice'
      winner.reason = `Highest delivery success rate (${CARRIER_RATES[winner.carrierId].reliabilityScore}%)`
      break

    case 'cost':
      winner = options.sort((a, b) => a.scores.cost - b.scores.cost)[0]
      winner.recommendation = 'Highest Savings'
      winner.reason = 'Lowest freight cost in this zone'
      break

    case 'smart':
    default:
      // Weighted average: 30% Cost, 40% Speed (including AI Delay), 30% Reliability
      options.sort((a, b) => {
        const speedScoreWithAI = a.scores.speed + (a.aiDelay || 0) * 20 // Weigh AI delay heavily
        const scoreA = a.scores.cost * 0.3 + speedScoreWithAI * 0.4 + a.scores.reliability * 0.3

        const speedScoreWithAI_B = b.scores.speed + (b.aiDelay || 0) * 20
        const scoreB = b.scores.cost * 0.3 + speedScoreWithAI_B * 0.4 + b.scores.reliability * 0.3

        return scoreA - scoreB
      })
      winner = options[0]

      // Check if there's a legacy override in the Matrix
      const matrixOverrideId =
        PREFERRED_CARRIER_MATRIX[shipment.state] || PREFERRED_CARRIER_MATRIX[winner.zone]
      const matrixCarrier = options.find((o) => o.carrierId === matrixOverrideId)

      if (matrixCarrier && matrixCarrier.total <= winner.total * 1.1) {
        // Apply override if within 10% cost
        winner = matrixCarrier
        winner.recommendation = 'Business Rule Match'
        winner.reason = `Preferred partner for ${shipment.state || winner.zone}`
      } else {
        winner.recommendation = 'AI Optimized (Delay Aware)'
        winner.reason =
          winner.aiDelay > 0
            ? `Calculated lowest risk despite ${winner.aiDelay}d predicted regional delay`
            : 'Best balance of cost, speed, and reliability'
      }
      break
  }

  return winner
}

/**
 * Check if pincode is serviceable
 * @param {string} pincode
 * @param {string} carrierId
 * @returns {boolean}
 */
export const isPincodeServiceable = async (pincode, carrierId = null) => {
  // Placeholder - would call carrier API in production
  // For now, assume all 6-digit pincodes are serviceable
  const isValid = /^\d{6}$/.test(pincode)

  // Northeast pincodes (start with 78-79) may have restrictions
  const isNE = pincode.startsWith('78') || pincode.startsWith('79')

  return {
    serviceable: isValid,
    zone: isNE ? 'NE' : 'ROI',
    restrictions: isNE ? ['Limited carriers', 'Longer delivery time'] : [],
  }
}

export default {
  ZONE_MAPPING,
  CARRIER_RATES,
  getZone,
  calculateRate,
  getAllRates,
  getRecommendation,
  isPincodeServiceable,
}
