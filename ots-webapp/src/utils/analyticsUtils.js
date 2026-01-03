/**
 * Analytics Utilities
 * Functions for data analysis, forecasting, and anomaly detection
 */

/**
 * Calculate simple moving average
 */
export const calculateMovingAverage = (data, windowSize = 7) => {
  if (!Array.isArray(data) || data.length < windowSize) return []
  const result = []
  for (let i = windowSize - 1; i < data.length; i++) {
    const window = data.slice(i - windowSize + 1, i + 1)
    const avg = window.reduce((sum, val) => sum + val, 0) / windowSize
    result.push(avg)
  }
  return result
}

/**
 * Detect anomalies using standard deviation
 */
export const detectAnomalies = (data, threshold = 2.5) => {
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
  const stdDev = Math.sqrt(variance)

  return data.map((val, idx) => ({
    index: idx,
    value: val,
    isAnomaly: Math.abs(val - mean) > threshold * stdDev,
    zScore: (val - mean) / stdDev,
  }))
}

/**
 * Linear regression forecast
 */
export const linearRegression = (data, forecastDays = 7) => {
  const n = data.length
  const sumX = (n * (n + 1)) / 2
  const sumY = data.reduce((a, b) => a + b, 0)
  const sumXY = data.reduce((sum, y, i) => sum + (i + 1) * y, 0)
  const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const forecast = []
  for (let i = 1; i <= forecastDays; i++) {
    forecast.push(slope * (n + i) + intercept)
  }
  return forecast
}

/**
 * Calculate growth rate
 */
export const calculateGrowthRate = (current, previous) => {
  if (previous === 0) return 0
  return ((current - previous) / Math.abs(previous)) * 100
}

/**
 * Aggregate data by period (day/week/month)
 */
export const aggregateByPeriod = (data, period = 'day') => {
  const aggregated = {}

  data.forEach((item) => {
    let key
    const date = new Date(item.date || item.createdAt)

    if (period === 'day') {
      key = date.toISOString().split('T')[0]
    } else if (period === 'week') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      key = weekStart.toISOString().split('T')[0]
    } else if (period === 'month') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }

    if (!aggregated[key]) {
      aggregated[key] = { count: 0, total: 0, items: [] }
    }
    aggregated[key].count++
    aggregated[key].total += item.amount || item.value || 0
    aggregated[key].items.push(item)
  })

  return Object.entries(aggregated).map(([period, data]) => ({
    period,
    count: data.count,
    total: data.total,
    average: data.total / data.count,
  }))
}

/**
 * Calculate percentiles
 */
export const calculatePercentile = (data, percentile) => {
  const sorted = [...data].sort((a, b) => a - b)
  const index = (percentile / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index % 1

  if (lower === upper) return sorted[lower]
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

/**
 * Get distribution stats
 */
export const getDistributionStats = (data) => {
  const sorted = [...data].sort((a, b) => a - b)
  const n = sorted.length
  const mean = data.reduce((a, b) => a + b, 0) / n
  const median = sorted[Math.floor(n / 2)]
  const mode = data.reduce((prev, current) =>
    data.filter((v) => v === current).length > data.filter((v) => v === prev).length
      ? current
      : prev
  )

  return { mean, median, mode, min: sorted[0], max: sorted[n - 1] }
}

/**
 * Calculate cohort retention
 */
export const calculateRetention = (cohortData) => {
  const retention = {}

  cohortData.forEach((user) => {
    const joinDate = new Date(user.joinDate).toISOString().split('T')[0]
    if (!retention[joinDate]) retention[joinDate] = { total: 0, retained: {} }

    retention[joinDate].total++
    const daysSinceJoin = Math.floor((new Date() - new Date(user.joinDate)) / (1000 * 86400))
    retention[joinDate].retained[daysSinceJoin] =
      (retention[joinDate].retained[daysSinceJoin] || 0) + (user.active ? 1 : 0)
  })

  return retention
}

export default {
  calculateMovingAverage,
  detectAnomalies,
  linearRegression,
  calculateGrowthRate,
  aggregateByPeriod,
  calculatePercentile,
  getDistributionStats,
  calculateRetention,
}
