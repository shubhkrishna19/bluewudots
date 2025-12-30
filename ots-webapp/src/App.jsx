import React, { useState } from 'react'
import './App.css'
import CarrierSelection from './components/Logistics/CarrierSelection'
import UniversalImporter from './components/Automation/UniversalImporter'
import SKUMaster from './components/Commercial/SKUMaster'
import BarcodeDispatcher from './components/Orders/BarcodeDispatcher'
import AnalyticsDashboard from './components/Dashboard/AnalyticsDashboard'
import DealerLookup from './components/Dealers/DealerLookup'
import SettingsPanel from './components/Settings/SettingsPanel'
import OrderList from './components/Orders/OrderList'
import ExportTools from './components/Reports/ExportTools'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

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
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📊 Analytics</li>
            <li className={activeTab === 'orderlist' ? 'active' : ''} onClick={() => setActiveTab('orderlist')}>📋 Orders</li>
            <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 Import</li>
            <li className={activeTab === 'logistics' ? 'active' : ''} onClick={() => setActiveTab('logistics')}>🚚 Logistics</li>
            <li className={activeTab === 'dispatcher' ? 'active' : ''} onClick={() => setActiveTab('dispatcher')}>📷 Dispatch</li>
            <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>🏷️ SKU Master</li>
            <li className={activeTab === 'dealers' ? 'active' : ''} onClick={() => setActiveTab('dealers')}>🤝 Dealers</li>
            <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>📄 Reports</li>
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>⚙️ Settings</li>
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
          {activeTab === 'orderlist' && <OrderList />}
          {activeTab === 'logistics' && <CarrierSelection />}
          {activeTab === 'orders' && <UniversalImporter />}
          {activeTab === 'inventory' && <SKUMaster />}
          {activeTab === 'dispatcher' && <BarcodeDispatcher />}
          {activeTab === 'dealers' && <DealerLookup />}
          {activeTab === 'reports' && <ExportTools />}
          {activeTab === 'settings' && <SettingsPanel />}
        </section>
      </main>
    </div>
  )
}

export default App
