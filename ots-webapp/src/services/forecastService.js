/**
 * Demand Forecasting Service
 * Provides insights into future order volumes based on historical data.
 */

/**
 * Calculate Simple Moving Average (SMA) for order volumes
 * @param {Array} orders - List of order objects
 * @param {number} days - Number of days to look back
 * @param {number} forecastDays - Number of days to forecast ahead
 * @returns {Array} List of { date, actual, forecast } objects
 */
export const calculateSMAForecast = (orders, days = 30, forecastDays = 7) => {
  if (!orders || orders.length === 0) return []

  // Group orders by date
  const dailyCounts = {}
  orders.forEach((order) => {
    const date = order.createdAt ? order.createdAt.split('T')[0] : null
    if (date) {
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    }
  })

  // Get sorted list of dates
  const dates = Object.keys(dailyCounts).sort()
  if (dates.length === 0) return []

  const firstDate = new Date(dates[0])
  const lastDate = new Date()
  const result = []

  // Fill in missing dates and calculate SMA
  let current = new Date(firstDate)
  const window = []

  while (current <= lastDate) {
    const dateStr = current.toISOString().split('T')[0]
    const actual = dailyCounts[dateStr] || 0

    window.push(actual)
    if (window.length > days) window.shift()

    const sma = window.reduce((a, b) => a + b, 0) / window.length

    result.push({
      date: dateStr,
      actual: actual,
      forecast: Math.round(sma * 10) / 10,
    })

    current.setDate(current.getDate() + 1)
  }

  // Forecast ahead
  const lastSMA = result[result.length - 1]?.forecast || 0
  for (let i = 1; i <= forecastDays; i++) {
    const forecastDate = new Date(lastDate)
    forecastDate.setDate(lastDate.getDate() + i)
    result.push({
      date: forecastDate.toISOString().split('T')[0],
      actual: null,
      forecast: lastSMA,
    })
  }

  return result
}

/**
 * Predict future demand for a specific SKU
 * @param {Array} orders - List of all orders
 * @param {string} sku - SKU code
 * @param {number} days - Historical window
 * @returns {number} Predicted quantity needed for next 30 days
 */
export const predictSKUDemand = (orders, sku, days = 30) => {
  const skuOrders = orders.filter((o) => o.sku === sku)
  if (skuOrders.length === 0) return 0

  const totalQuantity = skuOrders.reduce((sum, o) => sum + (parseInt(o.quantity) || 1), 0)
  const dailyAvg = totalQuantity / days

  return Math.ceil(dailyAvg * 30 * 1.1) // Add 10% buffer
}

/**
 * Predict arrival date for a vendor shipment based on historical lead times
 * @param {string} vendorId
 * @param {string} sku
 * @returns {Object} { predictedDate, riskLevel }
 */
export const predictVendorArrival = (vendorId, sku) => {
  // Simulated: In production, this would look at historical lead times in IndexedDB/Zoho
  const baseLeadTime = vendorId === 'V002' ? 12 : 40
  const variance = Math.floor(Math.random() * 7) - 2 // -2 to +4 days variance
  const finalLeadTime = baseLeadTime + variance

  const predictedDate = new Date()
  predictedDate.setDate(predictedDate.getDate() + finalLeadTime)

  return {
    date: predictedDate.toISOString().split('T')[0],
    leadTime: finalLeadTime,
    riskLevel: finalLeadTime > baseLeadTime + 3 ? 'HIGH' : 'LOW',
  }
}

export default {
  calculateSMAForecast,
  predictSKUDemand,
  predictVendorArrival,
}
