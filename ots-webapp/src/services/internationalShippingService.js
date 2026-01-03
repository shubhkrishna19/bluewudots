/**
 * International Shipping Service
 *
 * API stubs for international carriers (DHL, FedEx, Aramex).
 * These will be connected to live APIs when credentials are available.
 */

const CARRIERS = {
  DHL: {
    id: 'dhl',
    name: 'DHL Express',
    logo: '📦',
    baseUrl: 'https://api.dhl.com',
    supportedCountries: ['USA', 'UK', 'Germany', 'UAE', 'Australia', 'Singapore'],
  },
  FEDEX: {
    id: 'fedex',
    name: 'FedEx International',
    logo: '✈️',
    baseUrl: 'https://apis.fedex.com',
    supportedCountries: ['USA', 'Canada', 'Mexico', 'UK', 'Germany', 'France'],
  },
  ARAMEX: {
    id: 'aramex',
    name: 'Aramex',
    logo: '🚚',
    baseUrl: 'https://ws.aramex.net',
    supportedCountries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'India'],
  },
}

// Rate tables (INR per KG) by zone
const RATE_TABLES = {
  dhl: {
    'Zone-1': 2200, // Asia
    'Zone-2': 2800, // Middle East
    'Zone-3': 3500, // Europe
    'Zone-4': 4200, // Americas
  },
  fedex: {
    'Zone-1': 2100,
    'Zone-2': 2600,
    'Zone-3': 3200,
    'Zone-4': 3800,
  },
  aramex: {
    'Zone-1': 1800,
    'Zone-2': 1200, // Middle East specialization
    'Zone-3': 2800,
    'Zone-4': 3600,
  },
}

/**
 * Determine shipping zone for a country
 * @param {string} country
 * @returns {string}
 */
const getZoneForCountry = (country) => {
  const zones = {
    'Zone-1': ['Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Japan'],
    'Zone-2': ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain'],
    'Zone-3': ['UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands'],
    'Zone-4': ['USA', 'Canada', 'Mexico', 'Brazil', 'Australia'],
  }

  for (const [zone, countries] of Object.entries(zones)) {
    if (countries.includes(country)) return zone
  }
  return 'Zone-4' // Default to highest zone
}

/**
 * Get shipping rate estimate for international carrier
 * @param {string} carrierId
 * @param {string} country
 * @param {number} weight
 * @returns {object}
 */
export const getInternationalRate = (carrierId, country, weight) => {
  const zone = getZoneForCountry(country)
  const ratePerKg = RATE_TABLES[carrierId]?.[zone] || 3000
  const baseRate = ratePerKg * weight
  const fuelSurcharge = baseRate * 0.12 // 12% fuel surcharge
  const total = baseRate + fuelSurcharge

  return {
    carrier: CARRIERS[carrierId.toUpperCase()]?.name || carrierId,
    zone,
    baseRate: Math.round(baseRate),
    fuelSurcharge: Math.round(fuelSurcharge),
    total: Math.round(total),
    currency: 'INR',
    estimatedDays: zone === 'Zone-1' ? '3-5' : zone === 'Zone-2' ? '4-6' : '5-8',
  }
}

/**
 * Get all international carrier rates for comparison
 * @param {string} country
 * @param {number} weight
 * @returns {object[]}
 */
export const compareInternationalRates = (country, weight) => {
  return Object.keys(CARRIERS)
    .map((key) => {
      const carrier = CARRIERS[key]
      if (!carrier.supportedCountries.includes(country)) {
        return null
      }
      return {
        ...getInternationalRate(carrier.id, country, weight),
        logo: carrier.logo,
        carrierId: carrier.id,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.total - b.total)
}

/**
 * Create shipment (MOCK)
 * @param {object} order
 * @param {string} carrierId
 * @returns {Promise<object>}
 */
export const createInternationalShipment = async (order, carrierId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const trackingNumber = `INT-${carrierId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

  console.log(`[Int'l Shipping] Created shipment ${trackingNumber} via ${carrierId}`)

  return {
    success: true,
    trackingNumber,
    carrier: carrierId,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Label Created',
  }
}

/**
 * Track international shipment (MOCK)
 * @param {string} trackingNumber
 * @returns {Promise<object>}
 */
export const trackInternationalShipment = async (trackingNumber) => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    trackingNumber,
    status: 'In Transit',
    lastUpdate: new Date().toISOString(),
    events: [
      {
        timestamp: new Date().toISOString(),
        event: 'Shipment departed origin facility',
        location: 'Mumbai, India',
      },
      {
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        event: 'Label created',
        location: 'Bangalore, India',
      },
    ],
  }
}

export default {
  CARRIERS,
  getInternationalRate,
  compareInternationalRates,
  createInternationalShipment,
  trackInternationalShipment,
}
