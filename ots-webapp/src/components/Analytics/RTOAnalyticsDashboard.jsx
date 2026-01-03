import React, { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { rtoService } from '../../services/rtoService'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

const RTOAnalyticsDashboard = () => {
  const { orders } = useData()

  // Memoize stats calculation
  const stats = useMemo(() => {
    // Calculate risks for all ACTIVE orders
    // Filter out Cancelled/Returned for risk prediction view to show potential risk
    const activeOrders = orders.filter(
      (o) => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Returned'
    )

    const riskAnalysis = activeOrders.map((order) => ({
      ...order,
      risk: rtoService.predictRisk(order),
    }))

    const criticalRisk = riskAnalysis.filter((o) => o.risk.riskLevel === 'CRITICAL')
    const highRisk = riskAnalysis.filter((o) => o.risk.riskLevel === 'HIGH')
    const mediumRisk = riskAnalysis.filter((o) => o.risk.riskLevel === 'MEDIUM')

    // Calculate potential loss
    const totalPotentialLoss = riskAnalysis
      .filter((o) => ['HIGH', 'CRITICAL'].includes(o.risk.riskLevel))
      .reduce((sum, o) => sum + (o.risk.potentialLoss || 0), 0)

    // Zone-wise risk distribution
    const zoneRisk = riskAnalysis.reduce((acc, curr) => {
      const zone = curr.risk.reasons.find((r) => r.includes('zone'))?.split(': ')[1] || 'General'
      if (!acc[zone]) acc[zone] = { zone, count: 0, loss: 0 }
      acc[zone].count += 1
      acc[zone].loss += curr.risk.potentialLoss
      return acc
    }, {})

    const zoneChartData = Object.values(zoneRisk)
      .sort((a, b) => b.loss - a.loss)
      .slice(0, 5)

    return {
      totalAnalysed: activeOrders.length,
      criticalCount: criticalRisk.length,
      highCount: highRisk.length,
      mediumCount: mediumRisk.length,
      totalPotentialLoss,
      zoneChartData,
    }
  }, [orders])

  return (
    <div className="rto-analytics animate-fade">
      <div className="section-header">
        <h2>📦 RTO Intelligence Hub</h2>
        <div className="flex gap-4">
          <span className="badge badge-warning">
            Risk Exposure: ₹{stats.totalPotentialLoss.toLocaleString('en-IN')}
          </span>
          <span className="badge badge-primary">
            {stats.criticalCount + stats.highCount} At-Risk Orders
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="glass card p-4 text-center">
          <h3 className="text-2xl font-bold text-red-500">{stats.criticalCount}</h3>
          <p className="text-sm text-gray-400">Critical Risk ({'>'}70%)</p>
        </div>
        <div className="glass card p-4 text-center">
          <h3 className="text-2xl font-bold text-orange-500">{stats.highCount}</h3>
          <p className="text-sm text-gray-400">High Risk ({'>'}50%)</p>
        </div>
        <div className="glass card p-4 text-center">
          <h3 className="text-2xl font-bold text-yellow-500">{stats.mediumCount}</h3>
          <p className="text-sm text-gray-400">Medium Risk ({'>'}30%)</p>
        </div>
        <div className="glass card p-4 text-center">
          <h3 className="text-2xl font-bold text-green-500">
            {Math.max(
              0,
              stats.totalAnalysed - (stats.criticalCount + stats.highCount + stats.mediumCount)
            )}
          </h3>
          <p className="text-sm text-gray-400">Safe Orders</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="glass card p-6">
          <h3 className="text-lg font-bold mb-4">Top Risk Zones (by Financial Impact)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.zoneChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="zone" type="category" width={100} tick={{ fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(20, 20, 20, 0.9)', border: '1px solid #333' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Potential Loss']}
                />
                <Legend />
                <Bar
                  dataKey="loss"
                  name="Potential Loss (₹)"
                  fill="#EF4444"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass card p-6">
          <h3 className="text-lg font-bold mb-4">Risk Recommendations</h3>
          <ul className="space-y-4">
            {stats.criticalCount > 0 && (
              <li className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <span className="text-xl">🛑</span>
                <div>
                  <h4 className="font-bold text-red-500">Stop List Action Required</h4>
                  <p className="text-sm text-gray-400">
                    {stats.criticalCount} orders flagged as Critical. Recommend immediate
                    verification call before shipping.
                  </p>
                </div>
              </li>
            )}
            {stats.totalPotentialLoss > 50000 && (
              <li className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <span className="text-xl">📉</span>
                <div>
                  <h4 className="font-bold text-orange-500">High Financial Exposure</h4>
                  <p className="text-sm text-gray-400">
                    Potential loss exceeds ₹50k. Consider disabling COD for high-risk pincodes
                    temporarily.
                  </p>
                </div>
              </li>
            )}
            <li className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <span className="text-xl">💡</span>
              <div>
                <h4 className="font-bold text-blue-500">Optimization Tip</h4>
                <p className="text-sm text-gray-400">
                  Prepaid conversion campaigns could save approx ₹
                  {Math.round(stats.totalPotentialLoss * 0.4).toLocaleString()} in RTO costs this
                  week.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RTOAnalyticsDashboard
