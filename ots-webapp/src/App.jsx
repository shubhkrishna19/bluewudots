import React, { useState, useEffect } from 'react'
import './App.css'
import { useData } from './context/DataContext'
import { useAuth } from './context/AuthContext'
import LoginPage from './components/Auth/LoginPage'
import UserProfile from './components/Auth/UserProfile'
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
import InvoiceGenerator from './components/Commercial/InvoiceGenerator'
import CODReconciliation from './components/Commercial/CODReconciliation'
import FinancialCenter from './components/Commercial/FinancialCenter'
import WarehouseManager from './components/Warehouse/WarehouseManager'
import MobileBottomNav from './components/Navigation/MobileBottomNav'
import CommercialHub from './components/Commercial/CommercialHub'
import MarketingCenter from './components/Marketing/MarketingCenter'
import CustomerAnalytics from './components/Customers/CustomerAnalytics'
import GlobalLedger from './components/Commercial/GlobalLedger'
import ProductionTracker from './components/SupplyChain/ProductionTracker'
import QualityGate from './components/SupplyChain/QualityGate'
import MarginGuard from './components/Commercial/MarginGuard'
import AmazonMapper from './components/Automation/AmazonMapper'
import ShortcutsModal from './components/Help/ShortcutsModal'
import InternationalShipping from './components/Logistics/InternationalShipping'
import { initShortcuts, registerDefaultShortcuts, destroyShortcuts } from './services/keyboardShortcuts'


function App() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showQuickOrder, setShowQuickOrder] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { syncSKUMaster, syncStatus, universalSearch, orders, skuMaster } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)

  // Auto-sync SKU Master on mount & Initialize Shortcuts & Push
  useEffect(() => {
    if (isAuthenticated) {
      syncSKUMaster();

      initShortcuts();

      // Subscribe to Push Notifications
      import('./services/pushNotificationService').then(service => {
        service.subscribeUser();
      });

      registerDefaultShortcuts({
        dashboard: () => setActiveTab('dashboard'),
        orders: () => setActiveTab('orderlist'),
        search: () => document.querySelector('.search-bar input')?.focus(),
        bulk: () => setActiveTab('bulk'),
        help: () => setShowShortcuts(true),
        closeModal: () => {
          setShowQuickOrder(false);
          setShowNotifications(false);
          setShowProfile(false);
          setShowShortcuts(false);
        }
      });
    }
    return () => destroyShortcuts();
  }, [isAuthenticated, syncSKUMaster]);


  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="logo-icon" style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>B</div>
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className={`app-container animate-fade ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* Sidebar Navigation */}
      <nav className={`sidebar glass ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="logo-section">
          <div className="logo-icon">B</div>
          <h2>Bluewud<span>OTS</span></h2>
          <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>


        <div className="nav-items">
          <div className="nav-group">
            <label>OPERATIONS</label>
            <ul className="nav-links">
              <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>📊 Analytics</li>
              {user?.role !== 'viewer' && <li className={activeTab === 'metrics' ? 'active' : ''} onClick={() => { setActiveTab('metrics'); setIsMobileMenuOpen(false); }}>📈 KPIs</li>}
              {user?.role !== 'viewer' && <li className={activeTab === 'orderlist' ? 'active' : ''} onClick={() => { setActiveTab('orderlist'); setIsMobileMenuOpen(false); }}>📋 Orders</li>}
              {['admin', 'manager'].includes(user?.role) && <li className={activeTab === 'bulk' ? 'active' : ''} onClick={() => { setActiveTab('bulk'); setIsMobileMenuOpen(false); }}>⚡ Bulk</li>}
              <li className={activeTab === 'tracking' ? 'active' : ''} onClick={() => { setActiveTab('tracking'); setIsMobileMenuOpen(false); }}>📡 Tracking</li>
              {user?.role !== 'viewer' && <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => { setActiveTab('rto'); setIsMobileMenuOpen(false); }}>↩️ RTO</li>}
            </ul>
          </div>

          {user?.role !== 'viewer' && (
            <div className="nav-group">
              <label>INVENTORY & IMPORT</label>
              <ul className="nav-links">
                <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}>🏷️ SKU Master</li>
                <li className={activeTab === 'warehouse' ? 'active' : ''} onClick={() => { setActiveTab('warehouse'); setIsMobileMenuOpen(false); }}>🏭 Warehouse</li>
                <li className={activeTab === 'dispatcher' ? 'active' : ''} onClick={() => { setActiveTab('dispatcher'); setIsMobileMenuOpen(false); }}>📷 Dispatch</li>
                <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}>📤 Universal Import</li>
                <li className={activeTab === 'automation' ? 'active' : ''} onClick={() => { setActiveTab('automation'); setIsMobileMenuOpen(false); }}>🤖 Amazon Mapper</li>
              </ul>
            </div>
          )}

          {user?.role !== 'operator' && user?.role !== 'viewer' && (
            <div className="nav-group">
              <label>LOGISTICS</label>
              <ul className="nav-links">
                <li className={activeTab === 'logistics' ? 'active' : ''} onClick={() => { setActiveTab('logistics'); setIsMobileMenuOpen(false); }}>🚚 Carriers</li>
                <li className={activeTab === 'intlship' ? 'active' : ''} onClick={() => { setActiveTab('intlship'); setIsMobileMenuOpen(false); }}>🌐 Int'l Shipping</li>
                <li className={activeTab === 'carrierperf' ? 'active' : ''} onClick={() => { setActiveTab('carrierperf'); setIsMobileMenuOpen(false); }}>🏆 Performance</li>
                <li className={activeTab === 'zones' ? 'active' : ''} onClick={() => { setActiveTab('zones'); setIsMobileMenuOpen(false); }}>🗺️ Zones</li>
              </ul>
            </div>
          )}

          {['admin', 'manager'].includes(user?.role) && (
            <div className="nav-group">
              <label>FINANCE</label>
              <ul className="nav-links">
                <li className={activeTab === 'finance' ? 'active' : ''} onClick={() => { setActiveTab('finance'); setIsMobileMenuOpen(false); }}>💹 Financials</li>
                <li className={activeTab === 'commhub' ? 'active' : ''} onClick={() => { setActiveTab('commhub'); setIsMobileMenuOpen(false); }}>💎 Comm. Hub</li>
                <li className={activeTab === 'guards' ? 'active' : ''} onClick={() => { setActiveTab('guards'); setIsMobileMenuOpen(false); }}>🛡️ Margin Guard</li>
                <li className={activeTab === 'globalledger' ? 'active' : ''} onClick={() => { setActiveTab('globalledger'); setIsMobileMenuOpen(false); }}>🌍 Global Ledger</li>
                <li className={activeTab === 'invoice' ? 'active' : ''} onClick={() => { setActiveTab('invoice'); setIsMobileMenuOpen(false); }}>🧾 Invoicing</li>
                <li className={activeTab === 'cod' ? 'active' : ''} onClick={() => { setActiveTab('cod'); setIsMobileMenuOpen(false); }}>💰 COD Recon</li>
              </ul>
            </div>
          )}

          {['admin', 'manager'].includes(user?.role) && (
            <div className="nav-group">
              <label>CRM & MARKETING</label>
              <ul className="nav-links">
                <li className={activeTab === 'customers' ? 'active' : ''} onClick={() => { setActiveTab('customers'); setIsMobileMenuOpen(false); }}>👥 Customers</li>
                <li className={activeTab === 'custintel' ? 'active' : ''} onClick={() => { setActiveTab('custintel'); setIsMobileMenuOpen(false); }}>💎 Customer Intel</li>
                <li className={activeTab === 'marketing' ? 'active' : ''} onClick={() => { setActiveTab('marketing'); setIsMobileMenuOpen(false); }}>🎯 Marketing</li>
                <li className={activeTab === 'dealers' ? 'active' : ''} onClick={() => { setActiveTab('dealers'); setIsMobileMenuOpen(false); }}>🤝 Dealers</li>
              </ul>
            </div>
          )}

          {['admin', 'manager'].includes(user?.role) && (
            <div className="nav-group">
              <label>SUPPLY CHAIN</label>
              <ul className="nav-links">
                <li className={activeTab === 'production' ? 'active' : ''} onClick={() => { setActiveTab('production'); setIsMobileMenuOpen(false); }}>🏭 Production</li>
                <li className={activeTab === 'qa' ? 'active' : ''} onClick={() => { setActiveTab('qa'); setIsMobileMenuOpen(false); }}>💎 Quality Gate</li>
              </ul>
            </div>
          )}

          <div className="nav-group">
            <label>ADMIN & SUPPORT</label>
            <ul className="nav-links">
              {user?.role === 'admin' && <li className={activeTab === 'activity' ? 'active' : ''} onClick={() => { setActiveTab('activity'); setIsMobileMenuOpen(false); }}>📜 Activity Log</li>}
              <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}>📄 Export</li>
              <li className={activeTab === 'roadmap' ? 'active' : ''} onClick={() => { setActiveTab('roadmap'); setIsMobileMenuOpen(false); }}>🛣️ Roadmap</li>
              <li className={activeTab === 'help' ? 'active' : ''} onClick={() => { setActiveTab('help'); setIsMobileMenuOpen(false); }}>❓ Help</li>
              {user?.role === 'admin' && <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}>⚙️ Settings</li>}
            </ul>
          </div>
        </div>



        <div className="nav-footer glass">
          <div className="user-profile" style={{ cursor: 'pointer' }} onClick={() => setShowProfile(true)}>
            <div className="avatar">{user?.avatar || 'U'}</div>
            <div className="user-info">
              <p className="username">{user?.name || 'User'}</p>
              <p className="role">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Role'}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-bar">
          <button className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
          <div className="search-bar glass" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search (Ctrl + K)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length > 1) {
                  setSearchResults(universalSearch(e.target.value));
                } else {
                  setSearchResults(null);
                }
              }}
            />

            {searchResults && (
              <div className="search-results-dropdown glass" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '10px',
                zIndex: 1000,
                padding: '12px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {searchResults.totalResults === 0 && <p className="text-muted" style={{ padding: '10px' }}>No matches found</p>}

                {searchResults.orders.length > 0 && (
                  <div className="search-group">
                    <label style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '800' }}>ORDERS</label>
                    {searchResults.orders.map(o => (
                      <div key={o.id} className="search-item glass-hover" style={{ padding: '8px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => { setActiveTab('orderlist'); setSearchQuery(''); setSearchResults(null); }}>
                        <span style={{ fontWeight: '700' }}>{o.id}</span> • {o.customerName}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.skus.length > 0 && (
                  <div className="search-group" style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: '800' }}>SKUS</label>
                    {searchResults.skus.map(s => (
                      <div key={s.sku} className="search-item glass-hover" style={{ padding: '8px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => { setActiveTab('inventory'); setSearchQuery(''); setSearchResults(null); }}>
                        <span style={{ fontWeight: '700' }}>{s.sku}</span> • {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="actions">
            <div className={`sync-indicator ${syncStatus}`} title={`Status: ${syncStatus}`}>
              <span className="dot"></span>
              <span className="sync-text">{syncStatus.toUpperCase()}</span>
            </div>
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
          {activeTab === 'intlship' && <InternationalShipping />}
          {activeTab === 'carrierperf' && <CarrierPerformance />}
          {activeTab === 'zones' && <ZoneMap />}
          {activeTab === 'tracking' && <ShipmentTracker />}
          {activeTab === 'orders' && <UniversalImporter />}
          {activeTab === 'warehouse' && <WarehouseManager />}
          {activeTab === 'inventory' && <SKUMaster />}
          {activeTab === 'invoice' && <InvoiceGenerator />}
          {activeTab === 'finance' && <FinancialCenter />}
          {activeTab === 'commhub' && <CommercialHub />}
          {activeTab === 'guards' && <MarginGuard />}
          {activeTab === 'globalledger' && <GlobalLedger />}
          {activeTab === 'cod' && <CODReconciliation />}

          {activeTab === 'dispatcher' && <BarcodeDispatcher />}
          {activeTab === 'dealers' && <DealerLookup />}
          {activeTab === 'customers' && <CustomerLookup />}
          {activeTab === 'custintel' && <CustomerAnalytics />}
          {activeTab === 'marketing' && <MarketingCenter />}
          {activeTab === 'production' && <ProductionTracker />}
          {activeTab === 'qa' && <QualityGate />}
          {activeTab === 'automation' && <AmazonMapper />}
          {activeTab === 'activity' && (user?.role === 'admin' ? <ActivityLog /> : <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>🚫 Access Restricted</div>)}
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

      {/* User Profile Panel */}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}

      {/* Shortcuts Modal */}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
