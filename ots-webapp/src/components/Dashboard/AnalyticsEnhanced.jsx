/**
 * AnalyticsEnhanced.jsx
 * Advanced analytics dashboard for Bluewud OTS
 * Real-time metrics, trends, and business insights
 */

import { useTranslation } from '@/context/LocalizationContext'

const AnalyticsEnhanced = ({ timeRange = '7days' }) => {
  const { t, locale } = useTranslation()
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
    return (
      <div className="flex items-center justify-center p-20 glass animate-pulse">
        {t('common.loading')}
      </div>
    )
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
        <h2>📊 {t('nav.analytics')}</h2>
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
            <p className="metric-label">{t('dashboard.total_orders')}</p>
            <p className="metric-value">{formatNumber(metrics?.totalOrders || 0)}</p>
            <p className="metric-change positive">↑ {metrics?.orderGrowth || 0}%</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <p className="metric-label">{t('dashboard.revenue')}</p>
            <p className="metric-value">{formatCurrency(metrics?.totalRevenue || 0)}</p>
            <p className="metric-change positive">↑ {metrics?.revenueGrowth || 0}%</p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">💳</div>
          <div className="metric-content">
            <p className="metric-label">{t('dashboard.avg_order_value')}</p>
            <p className="metric-value">{formatCurrency(metrics?.avgOrderValue || 0)}</p>
            <p className="metric-change neutral">→ {metrics?.aovChange || 0}%</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <p className="metric-label">{t('dashboard.conversion_rate')}</p>
            <p className="metric-value">{metrics?.conversionRate || 0}%</p>
            <p className="metric-change positive">↑ {metrics?.conversionChange || 0}%</p>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">✓</div>
          <div className="metric-content">
            <p className="metric-label">{t('dashboard.delivered_orders')}</p>
            <p className="metric-value">{formatNumber(metrics?.deliveredOrders || 0)}</p>
            <p className="metric-change neutral">{metrics?.deliveryRate || 0}% {t('common.success')}</p>
          </div>
        </div>

        {/* Avg Delivery Time */}
        <div className="metric-card glass-hover">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <p className="metric-label">{t('dashboard.avg_delivery_time')}</p>
            <p className="metric-value">{metrics?.avgDeliveryTime || 0} {t('common.days')}</p>
            <p className="metric-change positive">↓ {metrics?.deliveryImprovement || 0}%</p>
          </div>
        </div>
      </div>

      {/* Top Performing Channels */}
      <div className="analytics-lower-grid">
        <div className="channels-section">
          <h3>{t('dashboard.top_channels')}</h3>
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
                <span className="channel-count">{channel.orders} {t('common.orders')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier Health Section (Phase 35) */}
        <div className="carrier-health-section glass">
          <div className="section-header">
            <h3>{t('dashboard.carrier_health')}</h3>
            <span className="live-dot animate-pulse"></span>
          </div>
          <div className="carrier-health-list">
            {[
              { name: 'Delhivery', status: 'Operational', latency: '112ms', reliability: '94%' },
              { name: 'BlueDart', status: 'Operational', latency: '82ms', reliability: '99%' },
              { name: 'XpressBees', status: 'Degraded', latency: '445ms', reliability: '72%' },
              { name: 'FedEx', status: 'Operational', latency: '156ms', reliability: '98%' }
            ].map((carrier, i) => (
              <div key={i} className="carrier-health-item">
                <div className="carrier-brief">
                  <span className="carrier-name-small">{carrier.name}</span>
                  <span className={`health-badge ${carrier.status.toLowerCase()}`}>{carrier.status}</span>
                </div>
                <div className="carrier-stats-row">
                  <div className="health-stat">
                    <span>LATENCY</span>
                    <b>{carrier.latency}</b>
                  </div>
                  <div className="health-stat">
                    <span>UPTIME</span>
                    <b>{carrier.reliability}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

        .analytics-lower-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .carrier-health-section {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
        }

        .section-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 1.5rem;
        }

        .section-header h3 { margin: 0; color: white; }

        .live-dot {
           width: 8px;
           height: 8px;
           background: #4ade80;
           border-radius: 50%;
           box-shadow: 0 0 10px #4ade80;
        }

        .carrier-health-list {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
           gap: 1rem;
        }

        .carrier-health-item {
           padding: 1rem;
           background: rgba(0, 0, 0, 0.2);
           border-radius: 8px;
           border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .carrier-brief {
           display: flex;
           flex-direction: column;
           gap: 0.25rem;
           margin-bottom: 0.75rem;
        }

        .carrier-name-small {
           font-size: 0.75rem;
           font-weight: 700;
           color: white;
           text-transform: uppercase;
           letter-spacing: 0.5px;
        }

        .health-badge {
           font-size: 0.6rem;
           padding: 2px 6px;
           border-radius: 4px;
           font-weight: 800;
           text-transform: uppercase;
           width: fit-content;
        }

        .health-badge.operational { background: rgba(74, 222, 128, 0.1); color: #4ade80; }
        .health-badge.degraded { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

        .carrier-stats-row {
           display: flex;
           justify-content: space-between;
           border-top: 1px solid rgba(255, 255, 255, 0.05);
           padding-top: 0.5rem;
        }

        .health-stat {
           display: flex;
           flex-direction: column;
        }

        .health-stat span {
           font-size: 0.5rem;
           color: rgba(255, 255, 255, 0.4);
        }

        .health-stat b {
           font-size: 0.7rem;
           color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 1024px) {
           .analytics-lower-grid { grid-template-columns: 1fr; }
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
