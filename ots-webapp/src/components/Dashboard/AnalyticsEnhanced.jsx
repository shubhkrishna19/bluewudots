/**
 * AnalyticsEnhanced.jsx
 * Advanced analytics dashboard for Bluewud OTS
 * Real-time metrics, trends, and business insights
 */

import React, { useState, useEffect } from 'react'

const AnalyticsEnhanced = ({ timeRange = '7days' }) => {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedRange, setSelectedRange] = useState(timeRange)

  useEffect(() => {
    fetchMetrics()
  }, [selectedRange])

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/metrics?range=${selectedRange}`)
      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      console.error('Failed to fetch metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (num) => {
    return '₹' + (num || 0).toLocaleString('en-IN')
  }

  return (
    <div className="analytics-dashboard glass">
      <div className="analytics-header">
        <h2>📊 Order Analytics</h2>
        <div className="range-selector">
          {['7days', '30days', '90days', 'yearly'].map((range) => (
            <button
              key={range}
              className={`range-btn ${selectedRange === range ? 'active' : ''}`}
              onClick={() => setSelectedRange(range)}
            >
              {range === '7days'
                ? '7D'
                : range === '30days'
                  ? '30D'
                  : range === '90days'
                    ? '90D'
                    : 'YTD'}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        {/* Total Orders */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <p className="metric-label">Total Orders</p>
            <p className="metric-value">{formatNumber(metrics?.totalOrders || 0)}</p>
            <p className="metric-change positive">↑ {metrics?.orderGrowth || 0}%</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <p className="metric-label">Revenue</p>
            <p className="metric-value">{formatCurrency(metrics?.totalRevenue || 0)}</p>
            <p className="metric-change positive">↑ {metrics?.revenueGrowth || 0}%</p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">💳</div>
          <div className="metric-content">
            <p className="metric-label">Avg Order Value</p>
            <p className="metric-value">{formatCurrency(metrics?.avgOrderValue || 0)}</p>
            <p className="metric-change neutral">→ {metrics?.aovChange || 0}%</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <p className="metric-label">Conversion</p>
            <p className="metric-value">{metrics?.conversionRate || 0}%</p>
            <p className="metric-change positive">↑ {metrics?.conversionChange || 0}%</p>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">✓</div>
          <div className="metric-content">
            <p className="metric-label">Delivered</p>
            <p className="metric-value">{formatNumber(metrics?.deliveredOrders || 0)}</p>
            <p className="metric-change neutral">{metrics?.deliveryRate || 0}% Success</p>
          </div>
        </div>

        {/* Avg Delivery Time */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <p className="metric-label">Avg Delivery</p>
            <p className="metric-value">{metrics?.avgDeliveryTime || 0} days</p>
            <p className="metric-change positive">↓ {metrics?.deliveryImprovement || 0}%</p>
          </div>
        </div>
      </div>

      {/* Top Performing Channels */}
      <div className="channels-section">
        <h3>Top Channels</h3>
        <div className="channels-list">
          {metrics?.topChannels?.map((channel, i) => (
            <div key={i} className="channel-item">
              <span className="channel-name">{channel.name}</span>
              <div className="channel-bar">
                <div
                  className="channel-fill"
                  style={{ width: `${(channel.orders / metrics.totalOrders) * 100}%` }}
                />
              </div>
              <span className="channel-count">{channel.orders} orders</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .analytics-dashboard {
          padding: 2rem;
          border-radius: 12px;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .analytics-header h2 {
          margin: 0;
          color: white;
        }

        .range-selector {
          display: flex;
          gap: 0.5rem;
        }

        .range-btn {
          padding: 0.5rem 1rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .range-btn.active {
          background: #4a90e2;
          border-color: #4a90e2;
          color: white;
        }

        .range-btn:hover:not(.active) {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          padding: 1.5rem;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .metric-icon {
          font-size: 2rem;
        }

        .metric-content {
          flex: 1;
        }

        .metric-label {
          margin: 0;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .metric-value {
          margin: 0.5rem 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
        }

        .metric-change {
          margin: 0;
          font-size: 0.75rem;
        }

        .metric-change.positive {
          color: #4ade80;
        }

        .metric-change.neutral {
          color: rgba(255, 255, 255, 0.6);
        }

        .channels-section {
          margin-top: 2rem;
        }

        .channels-section h3 {
          color: white;
          margin-bottom: 1rem;
        }

        .channels-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .channel-item {
          display: grid;
          grid-template-columns: 120px 1fr 100px;
          align-items: center;
          gap: 1rem;
        }

        .channel-name {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .channel-bar {
          height: 24px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          overflow: hidden;
        }

        .channel-fill {
          height: 100%;
          background: linear-gradient(90deg, #4a90e2, #7c3aed);
          border-radius: 4px;
        }

        .channel-count {
          text-align: right;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        }

        .analytics-loading {
          padding: 2rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 768px) {
          .analytics-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default AnalyticsEnhanced
