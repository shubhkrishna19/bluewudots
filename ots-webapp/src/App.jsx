import React, { useState } from 'react'
import './App.css'
import CarrierSelection from './components/Logistics/CarrierSelection'
import UniversalImporter from './components/Automation/UniversalImporter'
import SKUMaster from './components/Commercial/SKUMaster'
import BarcodeDispatcher from './components/Orders/BarcodeDispatcher'
import AnalyticsDashboard from './components/Dashboard/AnalyticsDashboard'

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
          <ul className="nav-links">
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Analytics</li>
            <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>OMS Import</li>
            <li className={activeTab === 'logistics' ? 'active' : ''} onClick={() => setActiveTab('logistics')}>Logistics</li>
            <li className={activeTab === 'dispatcher' ? 'active' : ''} onClick={() => setActiveTab('dispatcher')}>Dispatch</li>
            <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>SKU Master</li>
          </ul>
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
          {activeTab === 'dashboard' && <AnalyticsDashboard />}

          {activeTab === 'logistics' && <CarrierSelection />}

          {activeTab === 'orders' && <UniversalImporter />}

          {activeTab === 'inventory' && <SKUMaster />}

          {activeTab === 'dispatcher' && <BarcodeDispatcher />}

          {['settings'].includes(activeTab) && (
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
