import React, { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import { useData } from './context/DataContext'
import { useAuth } from './context/AuthContext'

// Core Components
import LoginPage from './components/Auth/LoginPage'
import UserProfile from './components/Auth/UserProfile'
import AnalyticsDashboard from './components/Dashboard/AnalyticsDashboard'
import MobileBottomNav from './components/Navigation/MobileBottomNav'
import ResponsiveLayout from './components/Shared/ResponsiveLayout'
import ErrorBoundary from './components/Shared/ErrorBoundary'
import ShortcutsModal from './components/Help/ShortcutsModal'
import NotificationCenter from './components/Notifications/NotificationCenter'
import QuickOrderForm from './components/Orders/QuickOrderForm'
import ServiceWorkerUpdater from './components/ServiceWorkerUpdater'

// Lazy Loaded Components
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
import keyboardShortcuts from './services/keyboardShortcuts'
import pushNotificationService from './services/pushNotificationService'
import { initWhatsAppService } from './services/whatsappService'
import searchService from './services/searchService'

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showQuickOrder, setShowQuickOrder] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearchActive, setIsSearchActive] = useState(false)

  const { syncSKUMaster, orders = [], skuMaster = [], syncStatus = 'offline' } = useData()

  // Initialization
  useEffect(() => {
    if (isAuthenticated) {
      syncSKUMaster()
      pushNotificationService.registerServiceWorker()

      initWhatsAppService(
        import.meta.env.VITE_WHATSAPP_API_TOKEN,
        import.meta.env.VITE_WHATSAPP_BUSINESS_ID,
        import.meta.env.VITE_WHATSAPP_PHONE_ID
      )
    }
  }, [isAuthenticated, syncSKUMaster])

  // Keyboard Shortcuts
  useEffect(() => {
    if (isAuthenticated) {
      keyboardShortcuts.on('commandPalette', () => document.querySelector('.search-bar input')?.focus())
      keyboardShortcuts.on('newOrder', () => setShowQuickOrder(true))
      keyboardShortcuts.on('showHelp', () => setShowShortcuts(true))
      keyboardShortcuts.on('toggleDashboard', () => setActiveTab('dashboard'))
      keyboardShortcuts.on('openOrders', () => setActiveTab('orderlist'))

      return () => {
        // Cleanup handled by the service typically, but named off works too
      }
    }
  }, [isAuthenticated])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length >= 2) {
      const results = searchService.universalSearch({ orders, skuMaster }, query)
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
        <p>Initializing Bluewud Nodes...</p>
      </div>
    )
  }

  if (!isAuthenticated) return <LoginPage />

  const Sidebar = (
    <div className="sidebar-nav">
      <div className="logo-section">
        <div className="logo-icon">B</div>
        <h2>Bluewud<span>OTS</span></h2>
      </div>

      <div className="nav-items">
        <div className="nav-group">
          <label>OPERATIONS</label>
          <ul className="nav-links">
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📊 Analytics</li>
            {user?.role !== 'viewer' && <li className={activeTab === 'metrics' ? 'active' : ''} onClick={() => setActiveTab('metrics')}>📈 KPIs</li>}
            <li className={activeTab === 'orderlist' ? 'active' : ''} onClick={() => setActiveTab('orderlist')}>📋 Orders</li>
            {['admin', 'manager'].includes(user?.role) && <li className={activeTab === 'bulk' ? 'active' : ''} onClick={() => setActiveTab('bulk')}>⚡ Bulk</li>}
            <li className={activeTab === 'tracking' ? 'active' : ''} onClick={() => setActiveTab('tracking')}>📡 Tracking</li>
          </ul>
        </div>

        {user?.role !== 'viewer' && (
          <div className="nav-group">
            <label>INVENTORY</label>
            <ul className="nav-links">
              <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>🏷️ SKU Master</li>
              <li className={activeTab === 'warehouse' ? 'active' : ''} onClick={() => setActiveTab('warehouse')}>🏭 Warehouse</li>
              <li className={activeTab === 'dispatcher' ? 'active' : ''} onClick={() => setActiveTab('dispatcher')}>📷 Dispatch</li>
            </ul>
          </div>
        )}

        {['admin', 'manager'].includes(user?.role) && (
          <div className="nav-group">
            <label>COMMERCIAL</label>
            <ul className="nav-links">
              <li className={activeTab === 'finance' ? 'active' : ''} onClick={() => setActiveTab('finance')}>💹 Financials</li>
              <li className={activeTab === 'globalledger' ? 'active' : ''} onClick={() => setActiveTab('globalledger')}>🌍 Global Ledger</li>
              <li className={activeTab === 'custintel' ? 'active' : ''} onClick={() => setActiveTab('custintel')}>👥 Customers</li>
            </ul>
          </div>
        )}

        <div className="nav-group">
          <label>SYSTEM</label>
          <ul className="nav-links">
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>⚙️ Settings</li>
            <li className={activeTab === 'help' ? 'active' : ''} onClick={() => setActiveTab('help')}>❓ Help</li>
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
    </div>
  )

  const Header = (
    <div className="top-bar-content">
      <div className="search-container">
        <div className="search-bar glass">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search anything (Ctrl+K)..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="top-bar-actions">
        <div className={`sync-indicator ${syncStatus}`}>
          <span className="dot"></span>
          {syncStatus.toUpperCase()}
        </div>
        <button className="btn-primary" onClick={() => setShowQuickOrder(true)}>+ New Order</button>
        <div className="notification-trigger" onClick={() => setShowNotifications(true)}>🔔</div>
      </div>
    </div>
  )

  return (
    <ErrorBoundary>
      <ServiceWorkerUpdater />
      <ResponsiveLayout sidebar={Sidebar} header={Header}>
        <div className="view-container">
          <Suspense fallback={<div className="view-loader">Initializing Node...</div>}>
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
        </div>
      </ResponsiveLayout>

      {/* Overlays */}
      {showQuickOrder && <div className="modal-overlay"><QuickOrderForm onClose={() => setShowQuickOrder(false)} /></div>}
      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </ErrorBoundary>
  )
}

export default App
