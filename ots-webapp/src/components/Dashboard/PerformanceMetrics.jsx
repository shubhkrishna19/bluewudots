import React from 'react'
import { useData } from '../../context/DataContext'

const PerformanceMetrics = () => {
  const { orders, logistics, skuMaster } = useData()

  // Calculate metrics
  const totalOrders = orders.length
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length
  const deliveryRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0

  const inTransit = orders.filter((o) => o.status === 'In-Transit').length
  const pending = orders.filter((o) => o.status === 'Imported' || o.status === 'MTP-Applied').length
  const rtoCount = orders.filter((o) => o.status?.startsWith('RTO')).length
  const rtoRate = totalOrders > 0 ? ((rtoCount / totalOrders) * 100).toFixed(1) : 0

  const sourceDistribution = orders.reduce((acc, o) => {
    acc[o.source || 'Manual'] = (acc[o.source || 'Manual'] || 0) + 1
    return acc
  }, {})

  const avgWeight =
    orders.length > 0
      ? (orders.reduce((sum, o) => sum + (o.weight || 0), 0) / orders.length).toFixed(1)
      : 0

  const metrics = [
    {
      label: 'Delivery Rate',
      value: `${deliveryRate}%`,
      icon: '📈',
      color: 'var(--success)',
      desc: 'Orders successfully delivered',
    },
    {
      label: 'RTO Rate',
      value: `${rtoRate}%`,
      icon: '↩️',
      color: 'var(--danger)',
      desc: 'Returned to Origin rate',
    },
    {
      label: 'SKU Catalog',
      value: skuMaster.length,
      icon: '🏷️',
      color: 'var(--accent)',
      desc: 'Products tracked',
    },
    {
      label: 'Avg Weight',
      value: `${avgWeight} kg`,
      icon: '⚖️',
      color: 'var(--warning)',
      desc: 'Per order average',
    },
  ]

  return (
    <div className="performance-metrics animate-fade">
      <div className="section-header">
        <h2>Performance Metrics</h2>
        <p className="text-muted">Key operational KPIs</p>
      </div>

      {/* Main KPIs */}
      <div
        className="kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginTop: '32px',
        }}
      >
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="kpi-card glass glass-hover"
            style={{ padding: '24px', textAlign: 'center' }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{m.icon}</div>
            <p style={{ fontSize: '2.5rem', fontWeight: '800', color: m.color }}>{m.value}</p>
            <p style={{ fontWeight: '700', marginTop: '8px' }}>{m.label}</p>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '6px' }}>
              {m.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="status-breakdown glass" style={{ marginTop: '32px', padding: '28px' }}>
        <h3>Order Pipeline</h3>
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginTop: '20px',
            height: '40px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              flex: pending,
              background: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {pending > 0 && (
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{pending}</span>
            )}
          </div>
          <div
            style={{
              flex: inTransit,
              background: 'var(--info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {inTransit > 0 && (
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{inTransit}</span>
            )}
          </div>
          <div
            style={{
              flex: deliveredOrders,
              background: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {deliveredOrders > 0 && (
              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{deliveredOrders}</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
          <span
            className="text-muted"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                background: 'var(--warning)',
                borderRadius: '2px',
              }}
            ></span>
            Pending ({pending})
          </span>
          <span
            className="text-muted"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                background: 'var(--info)',
                borderRadius: '2px',
              }}
            ></span>
            In Transit ({inTransit})
          </span>
          <span
            className="text-muted"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                background: 'var(--success)',
                borderRadius: '2px',
              }}
            ></span>
            Delivered ({deliveredOrders})
          </span>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="channel-perf glass" style={{ marginTop: '24px', padding: '28px' }}>
        <h3>Channel Performance</h3>
        <div style={{ marginTop: '20px' }}>
          {Object.entries(sourceDistribution)
            .sort((a, b) => b[1] - a[1])
            .map(([source, count], idx) => (
              <div key={source} style={{ marginBottom: '16px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}
                >
                  <span>{source}</span>
                  <span style={{ fontWeight: '700' }}>{count} orders</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    background: 'var(--bg-accent)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(count / totalOrders) * 100}%`,
                      height: '100%',
                      background: idx === 0 ? 'var(--primary)' : 'var(--glass-border)',
                      borderRadius: '4px',
                    }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default PerformanceMetrics
