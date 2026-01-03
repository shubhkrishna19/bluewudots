/**
 * International Shipping Service v2
 *
 * Handles global carrier logic, customs paperwork (E-Way bills, Commercial Invoices),
 * and realistic API stubs for DHL, FedEx, and Aramex.
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

const RATE_TABLES = {
  dhl: { 'Zone-1': 2200, 'Zone-2': 2800, 'Zone-3': 3500, 'Zone-4': 4200 },
  fedex: { 'Zone-1': 2100, 'Zone-2': 2600, 'Zone-3': 3200, 'Zone-4': 3800 },
  aramex: { 'Zone-1': 1800, 'Zone-2': 1200, 'Zone-3': 2800, 'Zone-4': 3600 },
}

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
  return 'Zone-4'
}

/**
 * Generate Customs Paperwork (Commercial Invoice / E-Way Bill)
 * @param {Object} order
 */
export const generateCustomsPaperwork = (order) => {
  console.log(
    `[Customs] Generating paperwork for Order ${order.id} to ${order.country || 'International'}`
  )
  return {
    invoiceNumber: `INV-${order.id}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    hsnCode: order.hsnCode || '9403', // Furniture/WMS Default
    declaredValue: order.amount || 0,
    currency: 'INR',
    terms: 'DAP (Delivered at Place)',
    generatedAt: new Date().toISOString(),
  }
}

export const getInternationalRate = (carrierId, country, weight) => {
  const zone = getZoneForCountry(country)
  const ratePerKg = RATE_TABLES[carrierId]?.[zone] || 3000
  const baseRate = ratePerKg * weight
  const fuelSurcharge = baseRate * 0.12
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

export const compareInternationalRates = (country, weight) => {
  return Object.keys(CARRIERS)
    .map((key) => {
      const carrier = CARRIERS[key]
      if (!carrier.supportedCountries.includes(country)) return null
      return {
        ...getInternationalRate(carrier.id, country, weight),
        logo: carrier.logo,
        carrierId: carrier.id,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.total - b.total)
}

export const createInternationalShipment = async (order, carrierId) => {
  console.log(`[Int'l Shipping] Validating customs for ${order.id}...`)
  const customsDoc = generateCustomsPaperwork(order)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  const trackingNumber = `INT-${carrierId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

  return {
    success: true,
    trackingNumber,
    carrier: carrierId,
    customsDetails: customsDoc,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Label Created',
    paperworkUrl: `https://api.bluewud.com/v1/logistics/labels/${trackingNumber}.pdf`,
  }
}

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
  generateCustomsPaperwork,
}
