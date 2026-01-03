import React, { useState, useEffect } from 'react'
import { getKPIs, getOrderTrend, forecastOrderVolume } from '../../services/analyticsService'
import { ChevronUp, TrendingUp, Package, Truck, AlertCircle } from 'lucide-react'

/**
 * DashboardMetrics Component
 * Displays KPI cards, trend indicators, and forecast data
 * Integrates analyticsService for real-time metrics
 */
export const DashboardMetrics = ({ orders = [] }) => {
  const [kpis, setKpis] = useState(null)
  const [trend, setTrend] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orders || orders.length === 0) {
      setLoading(false)
      return
    }

    try {
      // Calculate KPIs for today
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const kpiData = getKPIs(orders, today, tomorrow)
      const trendData = getOrderTrend(orders, 30)
      const forecastData = forecastOrderVolume(orders, 7)

      setKpis(kpiData)
      setTrend(trendData)
      setForecast(forecastData)
    } catch (err) {
      console.error('[DashboardMetrics] Error calculating metrics:', err)
    } finally {
      setLoading(false)
    }
  }, [orders])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 animate-pulse"
          >
            <div className="h-12 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!kpis) {
    return (
      <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-400" />
        <p className="text-yellow-100">No order data available to calculate metrics</p>
      </div>
    )
  }

  const MetricCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend: trendValue,
    color = 'blue',
  }) => (
    <div
      className={`bg-gradient-to-br from-${color}-900 to-${color}-950 rounded-xl p-6 backdrop-blur-sm border border-${color}-700 border-opacity-30`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <Icon className={`w-8 h-8 text-${color}-400`} />
      </div>
      {trendValue && (
        <div className="flex items-center gap-1 text-green-400 text-sm">
          <ChevronUp className="w-4 h-4" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Package}
          title="Total Orders"
          value={kpis.totalOrders}
          subtitle="Today"
          trendValue={trend?.trend}
          color="blue"
        />
        <MetricCard
          icon={Truck}
          title="Success Rate"
          value={`${kpis.deliverySuccessRate}%`}
          subtitle="On-time delivery"
          color="green"
        />
        <MetricCard
          icon={AlertCircle}
          title="RTO Rate"
          value={`${kpis.rtoRate}%`}
          subtitle="Return to origin"
          color="orange"
        />
        <MetricCard
          icon={TrendingUp}
          title="Revenue"
          value={`₹${kpis.totalRevenue.toLocaleString()}`}
          subtitle={`₹${kpis.avgOrderValue} avg`}
          color="purple"
        />
      </div>

      {/* Trend & Forecast Section */}
      {trend && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 backdrop-blur-sm border border-gray-700 border-opacity-30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 30-Day Trend */}
            <div>
              <h4 className="text-white font-semibold mb-4">30-Day Trend</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Slope:</span>
                  <span className="text-white font-medium">{trend.slope} orders/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">R²:</span>
                  <span className="text-white font-medium">{(trend.r2 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Direction:</span>
                  <span
                    className={`font-medium ${trend.trend === 'upward' ? 'text-green-400' : trend.trend === 'downward' ? 'text-red-400' : 'text-blue-400'}`}
                  >
                    {trend.trend.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            {forecast && (
              <div>
                <h4 className="text-white font-semibold mb-4">7-Day Forecast</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {forecast.slice(0, 7).map((day, idx) => (
                    <div key={idx} className="flex justify-between text-sm items-center">
                      <span className="text-gray-400">Day {day.day}</span>
                      <div className="flex-1 mx-3 bg-gray-700 rounded h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded transition-all"
                          style={{
                            width: `${Math.min((day.predictedVolume / Math.max(...forecast.map((f) => f.predictedVolume), 100)) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-white font-medium w-12 text-right">
                        {day.predictedVolume}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardMetrics
