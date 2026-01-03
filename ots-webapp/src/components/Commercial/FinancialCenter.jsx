import React, { useState } from 'react'
import { useFinance } from '../../context/FinancialContext'
import { useData } from '../../context/DataContext'
import { calculateProfitability, getEnhancedSKU } from '../../utils/commercialUtils'

const FinancialCenter = () => {
  const { finStats, settlements } = useFinance()
  const { orders, skuMaster } = useData()
  const [selectedView, setSelectedView] = useState('overview')

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)

  return (
    <div className="financial-center-view animate-fade">
      <div
        className="section-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h2>Financial Reconciliation Hub</h2>
          <p className="text-muted">P&L Monitoring & Marketplace Remittance Tracker</p>
        </div>
        <div className="view-selector glass" style={{ display: 'flex', padding: '4px' }}>
          <button
            className={`btn-tab ${selectedView === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedView('overview')}
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            Overview
          </button>
          <button
            className={`btn-tab ${selectedView === 'settlements' ? 'active' : ''}`}
            onClick={() => setSelectedView('settlements')}
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            Settlements
          </button>
          <button
            className={`btn-tab ${selectedView === 'audit' ? 'active' : ''}`}
            onClick={() => setSelectedView('audit')}
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            Audit
          </button>
        </div>
      </div>

      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginTop: '32px',
        }}
      >
        <div
          className="stat-card glass"
          style={{ padding: '24px', borderTop: '4px solid var(--primary)' }}
        >
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            GROSS REVENUE
          </span>
          <h2 style={{ marginTop: '8px' }}>{formatINR(finStats.totalRevenue)}</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '4px' }}>
            ↑ 12% vs last month
          </p>
        </div>
        <div
          className="stat-card glass"
          style={{ padding: '24px', borderTop: '4px solid var(--warning)' }}
        >
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            TOTAL DEDUCTIONS
          </span>
          <h2 style={{ marginTop: '8px' }}>
            {formatINR(
              finStats.totalCommissions +
                finStats.totalGst +
                finStats.totalOverhead +
                finStats.totalShipping
            )}
          </h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Comms + GST + Ops + Ship
          </p>
        </div>
        <div
          className="stat-card glass"
          style={{ padding: '24px', borderTop: '4px solid var(--success)' }}
        >
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            NET REVENUE (EST)
          </span>
          <h2 style={{ marginTop: '8px' }}>{formatINR(finStats.netRevenue)}</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Expected in Bank
          </p>
        </div>

        <div
          className="stat-card glass"
          style={{
            padding: '24px',
            borderTop: `4px solid ${finStats.marginPercent > 15 ? 'var(--success)' : 'var(--danger)'}`,
          }}
        >
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            NET MARGIN
          </span>
          <h2 style={{ marginTop: '8px' }}>{finStats.marginPercent}%</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {formatINR(finStats.netProfit)} Total Profit
          </p>
        </div>

        {flaggedOrders.length > 0 && (
          <div
            className="stat-card glass animate-pulse"
            style={{
              padding: '24px',
              borderTop: '4px solid var(--danger)',
              background: 'rgba(239, 68, 68, 0.05)',
            }}
          >
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              RISK ALERT
            </span>
            <h2 style={{ marginTop: '8px', color: 'var(--danger)' }}>
              {flaggedOrders.length} Flags
            </h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--danger)', marginTop: '4px' }}>
              Orders below margin threshold
            </p>
          </div>
        )}
      </div>

      <div
        className="financial-layout"
        style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}
      >
        <div className="ledger-section">
          <div className="glass" style={{ padding: '24px' }}>
            <h3>Recent Transactions</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr
                  style={{
                    textAlign: 'left',
                    borderBottom: '1px solid var(--glass-border)',
                    opacity: 0.6,
                    fontSize: '0.8rem',
                  }}
                >
                  <th style={{ padding: '12px' }}>Order ID</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>
                    {selectedView === 'audit' ? 'Exp. Logistics' : 'Deductions'}
                  </th>
                  <th style={{ padding: '12px' }}>
                    {selectedView === 'audit' ? 'Actual Bill' : 'Net'}
                  </th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedView === 'overview'
                  ? orders.slice(0, 8).map((order) => {
                      const skuData = getEnhancedSKU(order.sku, skuMaster)
                      const analysis = calculateProfitability({
                        sellingPrice: order.amount,
                        bomCost: 0,
                        commissionPercent: 18,
                        tmsLevel: 'TL2',
                      })
                      const deductions =
                        analysis.breakdown.tax +
                        analysis.breakdown.commission +
                        analysis.breakdown.overhead +
                        analysis.breakdown.shipping

                      return (
                        <tr
                          key={order.id}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            fontSize: '0.85rem',
                          }}
                        >
                          <td style={{ padding: '12px' }}>
                            {order.id} <br />
                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                              {order.source}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>{formatINR(order.amount)}</td>
                          <td style={{ padding: '12px', color: 'var(--danger)' }}>
                            - {formatINR(deductions)}
                          </td>
                          <td style={{ padding: '12px', fontWeight: '700' }}>
                            {formatINR(analysis.netRevenue)}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span
                              className="badge"
                              style={{
                                background:
                                  order.status === 'Delivered'
                                    ? 'var(--success)'
                                    : 'var(--warning)',
                                fontSize: '0.6rem',
                              }}
                            >
                              {order.status === 'Delivered' ? 'Remitted' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  : selectedView === 'audit'
                    ? orders.slice(0, 10).map((order) => {
                        const expectedCost = 150
                        const actualCost = order.shippingCost || (order.amount > 5000 ? 250 : 175)
                        const diff = actualCost - expectedCost

                        return (
                          <tr
                            key={order.id}
                            style={{
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                              fontSize: '0.85rem',
                            }}
                          >
                            <td style={{ padding: '12px' }}>{order.id}</td>
                            <td style={{ padding: '12px' }}>{formatINR(expectedCost)}</td>
                            <td
                              style={{
                                padding: '12px',
                                color: diff > 0 ? 'var(--danger)' : 'var(--success)',
                              }}
                            >
                              {formatINR(actualCost)}
                            </td>
                            <td style={{ padding: '12px', fontWeight: '700' }}>
                              {formatINR(diff)}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span
                                className="badge"
                                style={{
                                  background:
                                    Math.abs(diff) > 20 ? 'var(--danger)' : 'var(--success)',
                                  fontSize: '0.6rem',
                                }}
                              >
                                {Math.abs(diff) > 20 ? 'Flagged' : 'Verified'}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    : settlements.map((set) => (
                        <tr
                          key={set.orderId}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            fontSize: '0.85rem',
                          }}
                        >
                          <td style={{ padding: '12px' }}>{set.orderId}</td>
                          <td style={{ padding: '12px' }}>{formatINR(set.amount)}</td>
                          <td style={{ padding: '12px' }}>Marketplace</td>
                          <td style={{ padding: '12px' }}>
                            {new Date(set.timestamp).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span
                              className="badge"
                              style={{
                                background:
                                  set.status === 'Matched'
                                    ? 'var(--success)'
                                    : set.status === 'Discrepancy'
                                      ? 'var(--danger)'
                                      : 'var(--warning)',
                                fontSize: '0.6rem',
                              }}
                            >
                              {set.status}
                            </span>
                          </td>
                        </tr>
                      ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="breakdown-section"
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <div className="glass" style={{ padding: '24px' }}>
            <h3>Deduction Analytics</h3>
            <div
              style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                >
                  <span style={{ fontSize: '0.8rem' }}>GST (18%)</span>
                  <span style={{ fontWeight: '700' }}>{formatINR(finStats.totalGst)}</span>
                </div>
                <div
                  className="progress-bar glass"
                  style={{ height: '8px', borderRadius: '4px', overflow: 'hidden' }}
                >
                  <div style={{ width: '18%', height: '100%', background: 'var(--primary)' }}></div>
                </div>
              </div>
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                >
                  <span style={{ fontSize: '0.8rem' }}>Marketplace Fee</span>
                  <span style={{ fontWeight: '700' }}>{formatINR(finStats.totalCommissions)}</span>
                </div>
                <div
                  className="progress-bar glass"
                  style={{ height: '8px', borderRadius: '4px', overflow: 'hidden' }}
                >
                  <div style={{ width: '22%', height: '100%', background: 'var(--warning)' }}></div>
                </div>
              </div>
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                >
                  <span style={{ fontSize: '0.8rem' }}>Op Overhead (TMS)</span>
                  <span style={{ fontWeight: '700' }}>{formatINR(finStats.totalOverhead)}</span>
                </div>
                <div
                  className="progress-bar glass"
                  style={{ height: '8px', borderRadius: '4px', overflow: 'hidden' }}
                >
                  <div
                    style={{ width: '15%', height: '100%', background: 'var(--secondary)' }}
                  ></div>
                </div>
              </div>
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                >
                  <span style={{ fontSize: '0.8rem' }}>Logistics (Est)</span>
                  <span style={{ fontWeight: '700' }}>{formatINR(finStats.totalShipping)}</span>
                </div>
                <div
                  className="progress-bar glass"
                  style={{ height: '8px', borderRadius: '4px', overflow: 'hidden' }}
                >
                  <div style={{ width: '8%', height: '100%', background: 'var(--primary)' }}></div>
                </div>
              </div>
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                >
                  <span style={{ fontSize: '0.8rem' }}>Payment Gateway (2%)</span>
                  <span style={{ fontWeight: '700' }}>{formatINR(finStats.totalGateway || 0)}</span>
                </div>
                <div
                  className="progress-bar glass"
                  style={{ height: '8px', borderRadius: '4px', overflow: 'hidden' }}
                >
                  <div style={{ width: '2%', height: '100%', background: 'var(--info)' }}></div>
                </div>
              </div>
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                >
                  <span style={{ fontSize: '0.8rem' }}>RTO Provision (5%)</span>
                  <span style={{ fontWeight: '700' }}>
                    {formatINR(finStats.totalReturnProvision || 0)}
                  </span>
                </div>
                <div
                  className="progress-bar glass"
                  style={{ height: '8px', borderRadius: '4px', overflow: 'hidden' }}
                >
                  <div style={{ width: '5%', height: '100%', background: 'var(--danger)' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="glass highlight-border"
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
            }}
          >
            <h3>MTP Sync Status</h3>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '8px' }}>
              Legacy master data is currently active.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className="pulse-icon"
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                  boxShadow: '0 0 10px var(--success)',
                }}
              ></div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                Bluewud Legacy Link: ACTIVE
              </span>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '20px', fontSize: '0.8rem' }}
            >
              Synchronize Nodes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialCenter
