import React, { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import { useData } from './context/DataContext'
import { useAuth } from './context/AuthContext'
import ServiceWorkerUpdater from './components/ServiceWorkerUpdater'

// Essential Components (Sync Loading for LCP)
import LoginPage from './components/Auth/LoginPage'
import AnalyticsDashboard from './components/Dashboard/AnalyticsEnhanced'
// import NavigationSidebar from './components/Navigation/Sidebar' // I'll move sidebar to its own component to simplify App.jsx
import MobileBottomNav from './components/Navigation/MobileBottomNav'
import ErrorBoundary from './components/ErrorBoundary'
import ShortcutsModal from './components/Help/ShortcutsModal'
import NotificationCenter from './components/Notifications/NotificationCenter'
import QuickOrderForm from './components/Orders/QuickOrderForm'
import UserProfile from './components/Auth/UserProfile'
import ServiceWorkerUpdater from './components/ServiceWorkerUpdater'

// Lazy Loaded Components (Phase 15 optimization)
const PerformanceMetrics = lazy(() => import('./components/Dashboard/PerformanceMetrics'))
const OrderList = lazy(() => import('./components/Orders/OrderList'))
const BulkActions = lazy(() => import('./components/Orders/BulkActions'))
const RTOManager = lazy(() => import('./components/Orders/RTOManager'))
const CarrierSelection = lazy(() => import('./components/Logistics/CarrierSelection'))
const InternationalShipping = lazy(() => import('./components/Logistics/InternationalShipping'))
const CarrierPerformance = lazy(() => import('./components/Logistics/CarrierPerformance'))
const ZoneMap = lazy(() => import('./components/Logistics/ZoneMap'))
const ShipmentTracker = lazy(() => import('./components/Tracking/ShipmentTracker'))
const WarehouseManager = lazy(() => import('./components/Warehouse/WarehouseManager'))
const SKUMaster = lazy(() => import('./components/Commercial/SKUMaster'))
const InvoiceGenerator = lazy(() => import('./components/Commercial/InvoiceGenerator'))
const FinancialCenter = lazy(() => import('./components/Commercial/FinancialCenter'))
const CommercialHub = lazy(() => import('./components/Commercial/CommercialHub'))
const CODReconciliation = lazy(() => import('./components/Commercial/CODReconciliation'))
const BarcodeDispatcher = lazy(() => import('./components/Orders/BarcodeDispatcher'))
const DealerLookup = lazy(() => import('./components/Dealers/DealerLookup'))
const CustomerLookup = lazy(() => import('./components/Customers/CustomerLookup'))
const CustomerAnalytics = lazy(() => import('./components/Customers/CustomerAnalytics'))
const MarketingCenter = lazy(() => import('./components/Marketing/MarketingCenter'))
const ProductionTracker = lazy(() => import('./components/SupplyChain/ProductionTracker'))
const QualityGate = lazy(() => import('./components/SupplyChain/QualityGate'))
const ActivityLog = lazy(() => import('./components/Activity/ActivityLog'))
const ExportTools = lazy(() => import('./components/Reports/ExportTools'))
const RoadmapPage = lazy(() => import('./components/Roadmap/RoadmapPage'))
const HelpCenter = lazy(() => import('./components/Help/HelpCenter'))
const SettingsPanel = lazy(() => import('./components/Settings/SettingsPanel'))
const GlobalLedger = lazy(() => import('./components/Commercial/GlobalLedger'))
const MarginGuard = lazy(() => import('./components/Commercial/MarginGuard'))
const AmazonMapper = lazy(() => import('./components/Automation/AmazonMapper'))
const UniversalImporter = lazy(() => import('./components/Automation/UniversalImporter'))

// Services
import { initShortcuts, registerDefaultShortcuts, destroyShortcuts } from './services/keyboardShortcuts'
import searchService from './services/searchService'

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showQuickOrder, setShowQuickOrder] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearchActive, setIsSearchActive] = useState(false)

  const { syncSKUMaster, syncStatus, orders = [], skuMaster = [] } = useData()

  // Initialization
  useEffect(() => {
    if (isAuthenticated) {
      syncSKUMaster()
      initShortcuts()

      // Push Notifications
      import('./services/pushNotificationService').then(service => {
        service.subscribeUser()
      })

      registerDefaultShortcuts({
        dashboard: () => setActiveTab('dashboard'),
        orders: () => setActiveTab('orderlist'),
        search: () => document.querySelector('.search-bar input')?.focus(),
        bulk: () => setActiveTab('bulk'),
        help: () => setShowShortcuts(true),
        closeModal: () => {
          setShowQuickOrder(false)
          setShowNotifications(false)
          setShowProfile(false)
          setShowShortcuts(false)
        }
      })
    }
    return () => destroyShortcuts()
  }, [isAuthenticated, syncSKUMaster])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length >= 2) {
      // Use the injected searchService if available, otherwise fallback to local logic
      const targetData = { orders, skuMaster }
      const results = searchService?.universalSearch ? searchService.universalSearch(targetData, query) : null
      setSearchResults(results)
      setIsSearchActive(true)
    } else {
      setSearchResults(null)
      setIsSearchActive(false)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader">B</div>
        <p>Initializing Systems...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <ErrorBoundary>
      <ServiceWorkerUpdater />
      <div className={`app-container animate-fade ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>

        {/* Navigation Sidebar */}
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
                <li className={activeTab === 'orderlist' ? 'active' : ''} onClick={() => { setActiveTab('orderlist'); setIsMobileMenuOpen(false); }}>📋 Orders</li>
                {['admin', 'manager'].includes(user?.role) && <li className={activeTab === 'bulk' ? 'active' : ''} onClick={() => { setActiveTab('bulk'); setIsMobileMenuOpen(false); }}>⚡ Bulk</li>}
                <li className={activeTab === 'tracking' ? 'active' : ''} onClick={() => { setActiveTab('tracking'); setIsMobileMenuOpen(false); }}>📡 Tracking</li>
                {user?.role !== 'viewer' && <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => { setActiveTab('rto'); setIsMobileMenuOpen(false); }}>↩️ RTO</li>}
              </ul>
            </div>

            {user?.role !== 'viewer' && (
              <div className="nav-group">
                <label>INVENTORY & ASSETS</label>
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
                <label>FINANCE & COMM.</label>
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
                <label>CRM & SUPPLY CHAIN</label>
                <ul className="nav-links">
                  <li className={activeTab === 'custintel' ? 'active' : ''} onClick={() => { setActiveTab('custintel'); setIsMobileMenuOpen(false); }}>💎 Customer Intel</li>
                  <li className={activeTab === 'production' ? 'active' : ''} onClick={() => { setActiveTab('production'); setIsMobileMenuOpen(false); }}>🏭 Production</li>
                  <li className={activeTab === 'qa' ? 'active' : ''} onClick={() => { setActiveTab('qa'); setIsMobileMenuOpen(false); }}>💎 Quality Gate</li>
                </ul>
              </div>
            )}

            <div className="nav-group">
              <label>SYSTEM</label>
              <ul className="nav-links">
                {user?.role === 'admin' && <li className={activeTab === 'activity' ? 'active' : ''} onClick={() => { setActiveTab('activity'); setIsMobileMenuOpen(false); }}>📜 Activity</li>}
                <li className={activeTab === 'roadmap' ? 'active' : ''} onClick={() => { setActiveTab('roadmap'); setIsMobileMenuOpen(false); }}>🛣️ Roadmap</li>
                <li className={activeTab === 'help' ? 'active' : ''} onClick={() => { setActiveTab('help'); setIsMobileMenuOpen(false); }}>❓ Help</li>
                {user?.role === 'admin' && <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}>⚙️ Settings</li>}
              </ul>
            </div>
          </div>

          <div className="nav-footer glass" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }}>
            <div className="user-profile-small">
              <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
              <div className="info">
                <p>{user?.name}</p>
                <span>{user?.role?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <header className="top-bar">
            <button className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
            <div className="search-container">
              <div className="search-bar glass">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search orders, customers, or SKUs (Ctrl+K)..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => searchQuery.length >= 2 && setIsSearchActive(true)}
                />
              </div>

              {isSearchActive && searchResults && (
                <div className="search-dropdown glass animate-fade">
                  <div className="search-results-header">
                    <span>Fuzzy Match Results ({searchResults.totalResults})</span>
                    <button onClick={() => setIsSearchActive(false)} className="close-search">×</button>
                  </div>
                  <div className="search-scroll">
                    {searchResults.orders?.length > 0 && (
                      <div className="result-group">
                        <label>Orders</label>
                        {searchResults.orders.map(order => (
                          <div key={order.id} className="result-item" onClick={() => { setActiveTab('orderlist'); setIsSearchActive(false); }}>
                            <span className="id">{order.id}</span>
                            <span className="meta">{order.customerName} • {order.status}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.skus?.length > 0 && (
                      <div className="result-group">
                        <label>SKU Catalog</label>
                        {searchResults.skus.map(sku => (
                          <div key={sku.code || sku.sku} className="result-item" onClick={() => { setActiveTab('inventory'); setIsSearchActive(false); }}>
                            <span className="id">{sku.code || sku.sku}</span>
                            <span className="meta">{sku.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.totalResults === 0 && (
                      <div className="no-results">No matches found for "{searchQuery}"</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="actions">
              <div className={`sync-indicator ${syncStatus}`}>
                <span className="dot"></span>
                <span className="text">{syncStatus.toUpperCase()}</span>
              </div>
              <button className="btn-primary glass-hover" onClick={() => setShowQuickOrder(true)}>+ New Order</button>
              <div className="notifications glass" onClick={() => setShowNotifications(true)}>
                🔔
                <span className="badge"></span>
              </div>
            </div>
          </header>

          <section className="view-container">
            <Suspense fallback={<div className="view-loader">Loading View...</div>}>
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
              {activeTab === 'cod' && <CODReconciliation />}
              {activeTab === 'dispatcher' && <BarcodeDispatcher />}
              {activeTab === 'dealers' && <DealerLookup />}
              {activeTab === 'customers' && <CustomerLookup />}
              {activeTab === 'custintel' && <CustomerAnalytics />}
              {activeTab === 'marketing' && <MarketingCenter />}
              {activeTab === 'production' && <ProductionTracker />}
              {activeTab === 'qa' && <QualityGate />}
              {activeTab === 'automation' && <AmazonMapper />}
              {activeTab === 'guards' && <MarginGuard />}
              {activeTab === 'globalledger' && <GlobalLedger />}
              {activeTab === 'activity' && <ActivityLog />}
              {activeTab === 'reports' && <ExportTools />}
              {activeTab === 'roadmap' && <RoadmapPage />}
              {activeTab === 'help' && <HelpCenter />}
              {activeTab === 'settings' && <SettingsPanel />}
            </Suspense>
          </section>
        </main>

        {/* Modals & Overlays */}
        {showQuickOrder && (
          <div className="modal-overlay" onClick={() => setShowQuickOrder(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <QuickOrderForm onClose={() => setShowQuickOrder(false)} />
            </div>
          </div>
        )}

        <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
        {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}

        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ErrorBoundary>
  )
}

export default App
