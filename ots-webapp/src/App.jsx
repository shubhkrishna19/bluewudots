import React, { useState } from 'react'
import './App.css'
import CarrierSelection from './components/Logistics/CarrierSelection'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const stats = [
    { label: 'Pending Orders', value: '124', trend: '+12%', color: 'var(--primary)' },
    { label: 'In Transit', value: '45', trend: 'Global', color: 'var(--accent)' },
    { label: 'Delivered', value: '890', trend: 'Today', color: 'var(--success)' },
    { label: 'Alerts', value: '3', trend: 'High', color: 'var(--danger)' }
  ]

  return (
    <div className="app-container animate-fade">
      {/* Sidebar Navigation */}
      <nav className="sidebar glass">
        <div className="logo-section">
          <div className="logo-icon">B</div>
          <h2>Bluewud<span>OTS</span></h2>
        </div>

        <div className="nav-items">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`nav-btn ${activeTab === 'logistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('logistics')}
          >
            Logistics
          </button>
          <button
            className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            SKU Master
          </button>
        </div>

        <div className="nav-footer glass">
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info">
              <p className="username">Admin User</p>
              <p className="role">Logistics Head</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar glass">
            <input type="text" placeholder="Search orders, tracking IDs, or customers..." />
          </div>
          <div className="actions">
            <button className="btn-primary glass-hover">New Order</button>
            <div className="notifications glass">🔔</div>
          </div>
        </header>

        <section className="view-container">
          {activeTab === 'dashboard' && (
            <div className="dashboard-view">
              <div className="welcome-header">
                <h1>Logistics Command Centre</h1>
                <p>Real-time Pan-India Operational Overview</p>
              </div>

              <div className="stats-grid">
                {stats.map((stat, i) => (
                  <div key={i} className="stat-card glass glass-hover">
                    <p className="stat-label">{stat.label}</p>
                    <div className="stat-value-row">
                      <h2 style={{ color: stat.color }}>{stat.value}</h2>
                      <span className="stat-trend">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="content-grid">
                <div className="chart-placeholder glass">
                  <h3>Shipment Velocity</h3>
                  <div className="visual-indicator"></div>
                </div>
                <div className="recent-activity glass">
                  <h3>Recent Transformations</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <p>Order #BW-9901 mapped to SKU: BL-DESK-01</p>
                      <span>2 mins ago</span>
                    </div>
                    <div className="activity-item">
                      <p>Carrier Assigned: Delhivery (Zone: North)</p>
                      <span>15 mins ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logistics' && <CarrierSelection />}

          {['orders', 'inventory'].includes(activeTab) && (
            <div className="placeholder-view glass animate-fade">
              <h2>Module Under Development</h2>
              <p>The {activeTab} orchestration logic is being deployed.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
