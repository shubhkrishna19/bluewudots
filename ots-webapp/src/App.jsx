import React, { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import { useData } from './context/DataContext'
import { useAuth } from './context/AuthContext'
import LoginPage from './components/Auth/LoginPage'
import UserProfile from './components/Auth/UserProfile'
import AnalyticsDashboard from './components/Dashboard/AnalyticsDashboard'
import MobileBottomNav from './components/Navigation/MobileBottomNav'
import ShortcutsModal from './components/Help/ShortcutsModal'
import NotificationCenter from './components/Notifications/NotificationCenter'
import QuickOrderForm from './components/Orders/QuickOrderForm'
import ServiceWorkerUpdater from './components/ServiceWorkerUpdater'
import ResponsiveLayout from './components/Shared/ResponsiveLayout'
import ErrorBoundary from './components/Shared/ErrorBoundary'
import { initShortcuts, registerDefaultShortcuts, destroyShortcuts } from './services/keyboardShortcuts'
import keyboardShortcuts from './services/keyboardShortcuts'
import { initWhatsAppService } from './services/whatsappService'
import { Guard, ROLES, PERMISSIONS } from './services/rbacMiddleware'

// Lazy Loaded Components
const PerformanceMetrics = lazy(() => import('./components/Dashboard/PerformanceMetrics'))
const OrderList = lazy(() => import('./components/Orders/OrderList'))
const BulkActions = lazy(() => import('./components/Orders/BulkActions'))
const RTOManager = lazy(() => import('./components/Orders/RTOManager'))
const ReturnsManager = lazy(() => import('./components/Orders/ReturnsManager'))
const CarrierSelection = lazy(() => import('./components/Logistics/CarrierSelection'))
const InternationalShipping = lazy(() => import('./components/Logistics/InternationalShipping'))
const CarrierPerformance = lazy(() => import('./components/Logistics/CarrierPerformance'))
const ZoneMap = lazy(() => import('./components/Logistics/ZoneMap'))
const ShipmentTracker = lazy(() => import('./components/Tracking/ShipmentTracker'))
const WarehouseManager = lazy(() => import('./components/Warehouse/WarehouseManager'))
const SKUMaster = lazy(() => import('./components/Commercial/SKUMaster'))
const StockOptix = lazy(() => import('./components/Inventory/StockOptix'))
const InvoiceGenerator = lazy(() => import('./components/Commercial/InvoiceGenerator'))
const FinancialCenter = lazy(() => import('./components/Commercial/FinancialCenter'))
const CommercialHub = lazy(() => import('./components/Commercial/CommercialHub'))
const CODReconciliation = lazy(() => import('./components/Commercial/CODReconciliation'))
const BarcodeDispatcher = lazy(() => import('./components/Orders/BarcodeDispatcher'))
const DealerLookup = lazy(() => import('./components/Dealers/DealerLookup'))
const DealerPortal = lazy(() => import('./components/Dealers/DealerPortal'))
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
const MarketplaceReconciliation = lazy(() => import('./components/Commercial/MarketplaceReconciliation'))
const MLAnalyticsDashboard = lazy(() => import('./components/Dashboard/MLAnalyticsDashboard'))

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showQuickOrder, setShowQuickOrder] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearchActive, setIsSearchActive] = useState(false)

  const { syncSKUMaster, syncStatus, universalSearch, orders, skuMaster } = useData()

  // Tab management by role
  useEffect(() => {
    if (user?.role === 'dealer') setActiveTab('dealer-portal')
    else setActiveTab('dashboard')
  }, [user?.role])

  // System Initialization
  useEffect(() => {
    if (isAuthenticated) {
      syncSKUMaster()
      initShortcuts()

      import('./services/pushNotificationService').then(s => s.subscribeUser())

      initWhatsAppService(
        import.meta.env.VITE_WHATSAPP_API_TOKEN,
        import.meta.env.VITE_WHATSAPP_BUSINESS_ID,
        import.meta.env.VITE_WHATSAPP_PHONE_ID
      )

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

  // Keyboard Event Handlers
  useEffect(() => {
    if (isAuthenticated) {
      keyboardShortcuts.on('commandPalette', () => document.querySelector('.search-bar input')?.focus())
      keyboardShortcuts.on('newOrder', () => setShowQuickOrder(true))
      keyboardShortcuts.on('showHelp', () => setShowShortcuts(true))

      return () => {
        keyboardShortcuts.off('commandPalette')
        keyboardShortcuts.off('newOrder')
      }
    }
  }, [isAuthenticated])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length >= 2) {
      const results = universalSearch ? universalSearch(query) : null
      setSearchResults(results)
      setIsSearchActive(true)
    } else {
      setSearchResults(null)
      setIsSearchActive(false)
    }
  }

  if (isLoading) {
    return (
      <div className="view-loader-full">
        <div className="logo-icon-pulse">B</div>
        <p>Initializing Control Node...</p>
      </div>
    )
  }

  if (!isAuthenticated) return <LoginPage />

  const Sidebar = (
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
            <Guard user={user} permission={PERMISSIONS.VIEW_REPORTS}>
              <li className={activeTab === 'metrics' ? 'active' : ''} onClick={() => { setActiveTab('metrics'); setIsMobileMenuOpen(false); }}>📈 KPIs</li>
            </Guard>
            <Guard user={user} permission={PERMISSIONS.MANAGE_ORDERS}>
              <li className={activeTab === 'orderlist' ? 'active' : ''} onClick={() => { setActiveTab('orderlist'); setIsMobileMenuOpen(false); }}>📋 Orders</li>
              <li className={activeTab === 'bulk' ? 'active' : ''} onClick={() => { setActiveTab('bulk'); setIsMobileMenuOpen(false); }}>⚡ Bulk</li>
              <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => { setActiveTab('rto'); setIsMobileMenuOpen(false); }}>↩️ RTO</li>
            </Guard>
            <li className={activeTab === 'tracking' ? 'active' : ''} onClick={() => { setActiveTab('tracking'); setIsMobileMenuOpen(false); }}>📡 Tracking</li>
          </ul>
        </div>

        <Guard user={user} permission={PERMISSIONS.MANAGE_INVENTORY}>
          <div className="nav-group">
            <label>LOGISTICS & WAREHOUSE</label>
            <ul className="nav-links">
              <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}>🏷️ SKU Master</li>
              <li className={activeTab === 'warehouse' ? 'active' : ''} onClick={() => { setActiveTab('warehouse'); setIsMobileMenuOpen(false); }}>🏭 Warehouse</li>
              <li className={activeTab === 'logistics' ? 'active' : ''} onClick={() => { setActiveTab('logistics'); setIsMobileMenuOpen(false); }}>🚚 Carriers</li>
            </ul>
          </div>
        </Guard>

        <Guard user={user} permission={PERMISSIONS.PROCESS_PAYMENTS}>
          <div className="nav-group">
            <label>COMMERCIAL</label>
            <ul className="nav-links">
              <li className={activeTab === 'finance' ? 'active' : ''} onClick={() => { setActiveTab('finance'); setIsMobileMenuOpen(false); }}>💹 Financials</li>
              <li className={activeTab === 'globalledger' ? 'active' : ''} onClick={() => { setActiveTab('globalledger'); setIsMobileMenuOpen(false); }}>🌍 Global Ledger</li>
              <li className={activeTab === 'custintel' ? 'active' : ''} onClick={() => { setActiveTab('custintel'); setIsMobileMenuOpen(false); }}>💎 Customer Intel</li>
            </ul>
          </div>
        </Guard>

        <div className="nav-group">
          <label>SYSTEM</label>
          <ul className="nav-links">
            <li className={activeTab === 'activity' ? 'active' : ''} onClick={() => { setActiveTab('activity'); setIsMobileMenuOpen(false); }}>📜 Activity</li>
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}>⚙️ Settings</li>
            <li className={activeTab === 'help' ? 'active' : ''} onClick={() => { setActiveTab('help'); setIsMobileMenuOpen(false); }}>❓ Help</li>
          </ul>
        </div>
      </div>

      <div className="nav-footer glass" onClick={() => setShowProfile(true)}>
        <div className="user-profile-small">
          <div className="avatar">{user?.name?.charAt(0)}</div>
          <div className="info">
            <p>{user?.name}</p>
            <span>{user?.role?.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </nav>
  )

  const Header = (
    <header className="top-bar">
      <button className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
      <div className="search-container">
        <div className="search-bar glass">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search commands, orders, SKUs..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchQuery.length >= 2 && setIsSearchActive(true)}
          />
        </div>

        {isSearchActive && searchResults && (
          <div className="search-dropdown glass animate-fade">
            <div className="search-results-header">
              <span>Results ({searchResults.totalResults})</span>
              <button onClick={() => setIsSearchActive(false)}>×</button>
            </div>
            <div className="search-scroll">
              {searchResults.orders?.map(order => (
                <div key={order.id} className="result-item" onClick={() => { setActiveTab('orderlist'); setIsSearchActive(false); }}>
                  <span className="id">{order.id}</span>
                  <span className="meta">{order.customerName} • {order.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="actions">
        <div className={`sync-indicator ${syncStatus}`}>
          <span className="dot"></span>
          {syncStatus.toUpperCase()}
        </div>
        <button className="btn-primary" onClick={() => setShowQuickOrder(true)}>+ New Order</button>
        <div className="notifications-trigger" style={{ cursor: 'pointer' }} onClick={() => setShowNotifications(true)}>🔔</div>
      </div>
    </header>
  )

  return (
    <ErrorBoundary>
      <ServiceWorkerUpdater />
      <div className="app-container">
        <ResponsiveLayout sidebar={Sidebar} header={Header}>
          <section className="view-container">
            <Suspense fallback={<div className="view-loader">Loading View...</div>}>
              {activeTab === 'dashboard' && <AnalyticsDashboard />}
              {activeTab === 'metrics' && <PerformanceMetrics />}
              {activeTab === 'orderlist' && <OrderList />}
              {activeTab === 'bulk' && <BulkActions />}
              {activeTab === 'rto' && <RTOManager />}
              {activeTab === 'returns' && <ReturnsManager />}
              {activeTab === 'logistics' && <CarrierSelection />}
              {activeTab === 'intlship' && <InternationalShipping />}
              {activeTab === 'carrierperf' && <CarrierPerformance />}
              {activeTab === 'zones' && <ZoneMap />}
              {activeTab === 'tracking' && <ShipmentTracker />}
              {activeTab === 'orders' && <UniversalImporter />}
              {activeTab === 'warehouse' && <WarehouseManager />}
              {activeTab === 'inventory' && <SKUMaster />}
              {activeTab === 'stockoptix' && <StockOptix />}
              {activeTab === 'dispatcher' && <BarcodeDispatcher />}
              {activeTab === 'invoice' && <InvoiceGenerator />}
              {activeTab === 'finance' && <FinancialCenter />}
              {activeTab === 'commhub' && <CommercialHub />}
              {activeTab === 'cod' && <CODReconciliation />}
              {activeTab === 'dealers' && <DealerLookup />}
              {activeTab === 'dealer-portal' && <DealerPortal />}
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
              {activeTab === 'ml-forecast' && <MLAnalyticsDashboard />}
              {activeTab === 'reconciliation' && <MarketplaceReconciliation />}
            </Suspense>
          </section>
        </ResponsiveLayout>

        {showQuickOrder && (
          <div className="modal-overlay" onClick={() => setShowQuickOrder(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
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
