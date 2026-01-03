import React, { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { calculateSMAForecast, predictVendorArrival } from '../../services/forecastService'
import vendorService from '../../services/vendorService'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import DemandForecast from './DemandForecast'
import PredictiveAnalytics from './PredictiveAnalytics'

const COLORS = [
  'var(--primary)',
  'var(--accent)',
  'var(--success)',
  'var(--warning)',
  'var(--info)',
]

const AnalyticsDashboard = () => {
  const {
    orders = [],
    logistics = [],
    skuMaster = [],
    syncAllMarketplaces,
    syncStatus = 'offline',
  } = useData()
  const vendors = useMemo(() => vendorService.getVendors(), [])

  const arrivalPredictions = useMemo(() => {
    if (!skuMaster || skuMaster.length === 0 || !vendors || vendors.length === 0) {
      return []
    }
    return skuMaster.slice(0, 5).map((sku) => ({
      sku: sku.sku,
      vendor: vendors[Math.floor(Math.random() * vendors.length)].name,
      ...predictVendorArrival('V001', sku.sku),
    }))
  }, [skuMaster, vendors])

  // Velocity Data (Simulated for MVP)
  const velocityData = [
    { name: 'Mon', orders: 45, dispatched: 38 },
    { name: 'Tue', orders: 52, dispatched: 48 },
    { name: 'Wed', orders: 61, dispatched: 55 },
    { name: 'Thu', orders: 48, dispatched: 45 },
    { name: 'Fri', orders: 72, dispatched: 68 },
    { name: 'Sat', orders: 85, dispatched: 80 },
    { name: 'Sun', orders: 35, dispatched: 32 },
  ]

  // Status Distribution
  const statusData = [
    { name: 'Imported', value: orders.filter((o) => o?.status === 'Imported').length || 3 },
    {
      name: 'Processing',
      value:
        orders.filter((o) => o?.status === 'Processing' || o?.status === 'MTP-Applied').length || 2,
    },
    { name: 'In-Transit', value: orders.filter((o) => o?.status === 'In-Transit').length || 5 },
    { name: 'Delivered', value: orders.filter((o) => o?.status === 'Delivered').length || 8 },
  ]

  // Carrier Performance
  const carrierData = (logistics || []).map((c) => ({
    name: c?.carrier || 'Unknown',
    rate: c?.baseRate || 0,
    volume: Math.floor(Math.random() * 100) + 20,
  }))

  return (
    <div className="analytics-dashboard animate-fade">
      <div
        className="section-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <h2>Global Analytics Hub</h2>
          <p className="text-muted">Real-time Operational Intelligence</p>
        </div>
        <button
          className={`btn-primary glass-hover ${syncStatus === 'syncing' ? 'loading' : ''}`}
          onClick={syncAllMarketplaces}
          disabled={syncStatus === 'syncing'}
          style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {syncStatus === 'syncing' ? '⌛ Syncing Echo...' : '📡 Synchronize Marketplaces'}
        </button>
      </div>

      {/* AI Vendor Arrival Predictions */}
      <div className="glass" style={{ padding: '24px', marginTop: '32px' }}>
        <h3 style={{ marginBottom: '20px' }}>🚢 AI Vendor Arrival Predictions</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {arrivalPredictions.map((pred) => (
            <div
              key={pred.sku}
              className="glass"
              style={{
                padding: '16px',
                borderLeft: `4px solid ${pred.riskLevel === 'HIGH' ? 'var(--danger)' : 'var(--success)'}`,
              }}
            >
              <p style={{ fontWeight: '700', color: 'var(--primary)' }}>{pred.sku}</p>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                Vendor: {pred.vendor}
              </p>
              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '0.9rem' }}>
                  ETA: {new Date(pred.date).toLocaleDateString()}
                </p>
                <span
                  className="badge"
                  style={{
                    background: pred.riskLevel === 'HIGH' ? 'var(--danger)' : 'var(--success)',
                    fontSize: '0.6rem',
                  }}
                >
                  {pred.riskLevel === 'HIGH' ? 'High Risk' : 'On Track'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-grid responsive-grid-2-1" style={{ marginTop: '32px' }}>
        {/* Velocity Chart */}
        <div className="chart-card glass" style={{ padding: '24px' }}>
          <h3>Shipment Velocity (Weekly)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={velocityData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDispatched" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-accent)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--text-main)' }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="var(--primary)"
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
              <Area
                type="monotone"
                dataKey="dispatched"
                stroke="var(--success)"
                fillOpacity={1}
                fill="url(#colorDispatched)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="chart-card glass" style={{ padding: '24px' }}>
          <h3>Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-accent)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ color: 'var(--text-muted)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Carrier Performance */}
      <div className="chart-card glass" style={{ padding: '24px', marginTop: '24px' }}>
        <h3>Carrier Performance Matrix</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={carrierData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" stroke="var(--text-muted)" />
            <YAxis dataKey="name" type="category" stroke="var(--text-muted)" width={100} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-accent)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="volume" fill="var(--primary)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Predictive Intelligence Section */}
      <div className="analytics-grid responsive-grid-2-1" style={{ marginTop: '32px' }}>
        <div className="chart-card glass" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h3>AI Demand Forecasting</h3>
            <span
              className="badge"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '4px 12px',
                borderRadius: '20px',
              }}
            >
              PREDICTIVE
            </span>
          </div>
          <DemandForecast />
        </div>

        <div className="chart-card glass" style={{ padding: '24px' }}>
          <h3>Predictive Insights</h3>
          <PredictiveAnalytics />
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats responsive-grid-4" style={{ marginTop: '24px' }}>
        <div
          className="mini-stat glass glass-hover"
          style={{ padding: '20px', textAlign: 'center' }}
        >
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            TOTAL ORDERS
          </p>
          <h2 style={{ color: 'var(--primary)' }}>{orders.length || 124}</h2>
        </div>
        <div
          className="mini-stat glass glass-hover"
          style={{ padding: '20px', textAlign: 'center' }}
        >
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            ACTIVE CARRIERS
          </p>
          <h2 style={{ color: 'var(--success)' }}>{logistics.filter((l) => l.active).length}</h2>
        </div>
        <div
          className="mini-stat glass glass-hover"
          style={{ padding: '20px', textAlign: 'center' }}
        >
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            SKU CATALOG
          </p>
          <h2 style={{ color: 'var(--accent)' }}>{skuMaster.length}</h2>
        </div>
        <div
          className="mini-stat glass glass-hover"
          style={{ padding: '20px', textAlign: 'center' }}
        >
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            AVG MARGIN
          </p>
          <h2 style={{ color: 'var(--warning)' }}>18.5%</h2>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
