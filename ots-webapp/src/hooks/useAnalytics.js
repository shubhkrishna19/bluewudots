import { useEffect, useState } from 'react'
import { analyticsService } from '../../src/services/analyticsService'

/**
 * useAnalytics Hook
 * Provides analytics data and KPI calculations
 */
export const useAnalytics = (dateRange = 7) => {
  const [metrics, setMetrics] = useState(null)
  const [trend, setTrend] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const kpis = analyticsService.getKPIs?.(
          undefined,
          new Date(Date.now() - dateRange * 86400000),
          new Date()
        ) // Pass dates if needed, or update service to handle defaults
        const trendData = analyticsService.getOrderTrend?.(undefined, dateRange) // Service expects orders, days
        const forecastData = analyticsService.forecastOrderVolume?.(undefined, dateRange) // Service expects orders, daysAhead

        setMetrics(kpis)
        setTrend(trendData)
        setForecast(forecastData)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange])

  return { metrics, trend, forecast, loading, error }
}

export default useAnalytics
