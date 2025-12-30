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
import QuickOrderForm from './components/Orders/QuickOrderForm'
import NotificationCenter from './components/Notifications/NotificationCenter'
import ActivityLog from './components/Activity/ActivityLog'
import BulkActions from './components/Orders/BulkActions'
import ZoneMap from './components/Logistics/ZoneMap'
import HelpCenter from './components/Help/HelpCenter'
import CustomerLookup from './components/Customers/CustomerLookup'
import PerformanceMetrics from './components/Dashboard/PerformanceMetrics'
import RoadmapPage from './components/Roadmap/RoadmapPage'
import RTOManager from './components/Orders/RTOManager'
import CarrierPerformance from './components/Logistics/CarrierPerformance'
import ShipmentTracker from './components/Tracking/ShipmentTracker'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showQuickOrder, setShowQuickOrder] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

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
            <li className={activeTab === 'metrics' ? 'active' : ''} onClick={() => setActiveTab('metrics')}>📈 KPIs</li>
            <li className={activeTab === 'orderlist' ? 'active' : ''} onClick={() => setActiveTab('orderlist')}>📋 Orders</li>
            <li className={activeTab === 'bulk' ? 'active' : ''} onClick={() => setActiveTab('bulk')}>⚡ Bulk</li>
            <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => setActiveTab('rto')}>↩️ RTO</li>
            <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 Import</li>
            <li className={activeTab === 'tracking' ? 'active' : ''} onClick={() => setActiveTab('tracking')}>📡 Tracking</li>
            <li className={activeTab === 'logistics' ? 'active' : ''} onClick={() => setActiveTab('logistics')}>🚚 Carriers</li>
            <li className={activeTab === 'carrierperf' ? 'active' : ''} onClick={() => setActiveTab('carrierperf')}>🏆 Performance</li>
            <li className={activeTab === 'zones' ? 'active' : ''} onClick={() => setActiveTab('zones')}>🗺️ Zones</li>
            <li className={activeTab === 'dispatcher' ? 'active' : ''} onClick={() => setActiveTab('dispatcher')}>📷 Dispatch</li>
            <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>🏷️ SKU</li>
            <li className={activeTab === 'dealers' ? 'active' : ''} onClick={() => setActiveTab('dealers')}>🤝 Dealers</li>
            <li className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>👥 Customers</li>
            <li className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>📜 Log</li>
            <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>📄 Export</li>
            <li className={activeTab === 'roadmap' ? 'active' : ''} onClick={() => setActiveTab('roadmap')}>🛣️ Roadmap</li>
            <li className={activeTab === 'help' ? 'active' : ''} onClick={() => setActiveTab('help')}>❓ Help</li>
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
            <button className="btn-primary glass-hover" onClick={() => setShowQuickOrder(true)}>+ New Order</button>
            <div className="notifications glass" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setShowNotifications(true)}>
              🔔
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%' }}></span>
            </div>
          </div>
        </header>

        <section className="view-container">
          {activeTab === 'dashboard' && <AnalyticsDashboard />}
          {activeTab === 'metrics' && <PerformanceMetrics />}
          {activeTab === 'orderlist' && <OrderList />}
          {activeTab === 'bulk' && <BulkActions />}
          {activeTab === 'rto' && <RTOManager />}
          {activeTab === 'logistics' && <CarrierSelection />}
          {activeTab === 'carrierperf' && <CarrierPerformance />}
          {activeTab === 'zones' && <ZoneMap />}
          {activeTab === 'tracking' && <ShipmentTracker />}
          {activeTab === 'orders' && <UniversalImporter />}
          {activeTab === 'inventory' && <SKUMaster />}
          {activeTab === 'dispatcher' && <BarcodeDispatcher />}
          {activeTab === 'dealers' && <DealerLookup />}
          {activeTab === 'customers' && <CustomerLookup />}
          {activeTab === 'activity' && <ActivityLog />}
          {activeTab === 'reports' && <ExportTools />}
          {activeTab === 'roadmap' && <RoadmapPage />}
          {activeTab === 'help' && <HelpCenter />}
          {activeTab === 'settings' && <SettingsPanel />}
        </section>
      </main>

      {/* Quick Order Modal */}
      {showQuickOrder && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowQuickOrder(false)}>
          <div style={{ maxWidth: '700px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <QuickOrderForm onClose={() => setShowQuickOrder(false)} />
          </div>
        </div>
      )}

      {/* Notification Panel */}
      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  )
}

export default App
