import React, { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
<<<<<<< HEAD
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { useLocalization } from '@/context/LocalizationContext'
import LoginPage from '@/components/Auth/LoginPage'
import ErrorBoundary from '@/components/Shared/ErrorBoundary'
import { Guard, ROLES, PERMISSIONS } from '@/services/rbacMiddleware'
import ResponsiveLayout from '@/components/Shared/ResponsiveLayout'
import MobileBottomNav from '@/components/Navigation/MobileBottomNav'
import SkeletonLoader from '@/components/Common/SkeletonLoader'
import NotificationCenter from '@/components/Notifications/NotificationCenter'

// Service & Utility Imports
import { initShortcuts, registerDefaultShortcuts, destroyShortcuts } from './services/keyboardShortcuts'
import keyboardShortcuts from './services/keyboardShortcuts'
import { initWhatsAppService } from '@/services/whatsappService'
import searchService from '@/services/searchService'

// --- Lazy Loaded Components (Performance Optimization) ---
// Auth
const UserProfile = React.lazy(() => import('@/components/Auth/UserProfile'))

// Dashboard & Analytics
const AnalyticsDashboard = React.lazy(() => import('@/components/Dashboard/AnalyticsEnhanced'))
const PerformanceMetrics = React.lazy(() => import('@/components/Dashboard/PerformanceMetrics'))
const ActivityLog = React.lazy(() => import('@/components/Activity/ActivityLog'))
const DemandForecast = React.lazy(() => import('@/components/Analytics/DemandForecast'))
const ReturnsDashboard = React.lazy(() => import('@/components/Commercial/ReturnsDashboard'))

// Orders
const OrderList = React.lazy(() => import('@/components/Orders/OrderList'))
const QuickOrderForm = React.lazy(() => import('@/components/Orders/QuickOrderForm'))
const BulkActions = React.lazy(() => import('@/components/Orders/BulkActions'))
const RTOManager = React.lazy(() => import('@/components/Orders/RTOManager'))
const ReturnsManager = React.lazy(() => import('@/components/Orders/ReturnsManager'))
const BarcodeDispatcher = React.lazy(() => import('@/components/Orders/BarcodeDispatcher'))

// Logistics
const CarrierSelection = React.lazy(() => import('@/components/Logistics/CarrierSelection'))
const ZoneMap = React.lazy(() => import('@/components/Logistics/ZoneMap'))
const CarrierPerformance = React.lazy(() => import('@/components/Logistics/CarrierPerformance'))
const ShipmentTracker = React.lazy(() => import('@/components/Tracking/ShipmentTracker'))
const LabelTemplateManager = React.lazy(() => import('@/components/Logistics/LabelTemplateManager'))
const InternationalShipping = React.lazy(
  () => import('@/components/Logistics/InternationalShipping')
)
const LogisticsHQ = React.lazy(() => import('@/components/Logistics/LogisticsHQ'))

// Inventory & Warehouse
const SKUMaster = React.lazy(() => import('@/components/Commercial/SKUMaster'))
const StockOptix = React.lazy(() => import('@/components/Inventory/StockOptix'))
const WarehouseManager = React.lazy(() => import('@/components/Warehouse/WarehouseManager'))
const UniversalImporter = React.lazy(() => import('@/components/Automation/UniversalImporter'))
const AmazonMapper = React.lazy(() => import('@/components/Automation/AmazonMapper'))

// Commercial & Finance
const FinancialCenter = React.lazy(() => import('@/components/Commercial/FinancialCenter'))
const CommercialHub = React.lazy(() => import('@/components/Commercial/CommercialHub'))
const GlobalLedger = React.lazy(() => import('@/components/Commercial/GlobalLedger'))
const MarginGuard = React.lazy(() => import('@/components/Commercial/MarginGuard'))
const InvoiceGenerator = React.lazy(() => import('@/components/Commercial/InvoiceGenerator'))
const CODReconciliation = React.lazy(() => import('@/components/Commercial/CODReconciliation'))
const MarketplaceReconciliation = React.lazy(
  () => import('@/components/Commercial/MarketplaceReconciliation')
)

// CRM & Marketing
const DealerLookup = React.lazy(() => import('@/components/Dealers/DealerLookup'))
const CustomerLookup = React.lazy(() => import('@/components/Customers/CustomerLookup'))
const CustomerAnalytics = React.lazy(() => import('@/components/Customers/CustomerAnalytics'))
const MarketingCenter = React.lazy(() => import('@/components/Marketing/MarketingCenter'))
const WhatsAppTemplateManager = React.lazy(
  () => import('@/components/Marketing/WhatsAppTemplateManager')
)
const DealerPortal = React.lazy(() => import('@/components/Dealers/DealerPortal'))

// Supply Chain
const ProductionTracker = React.lazy(() => import('@/components/SupplyChain/ProductionTracker'))
const QualityGate = React.lazy(() => import('@/components/SupplyChain/QualityGate'))

// Settings & Support
const SettingsPanel = React.lazy(() => import('@/components/Settings/SettingsPanel'))
const HelpCenter = React.lazy(() => import('@/components/Help/HelpCenter'))
const ShortcutsModal = React.lazy(() => import('@/components/Help/ShortcutsModal'))

// Reuseable Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center p-20 h-full animate-fade">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400 text-sm">Loading module...</p>
    </div>
  </div>
)

function App() {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth()
  const { t, locale, changeLocale, availableLocales } = useLocalization()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Set default tab based on role
  useEffect(() => {
    if (user?.role === 'dealer') {
      setActiveTab('dealer-portal')
    } else {
      setActiveTab('dashboard')
    }
  }, [user?.role])

  const {
    syncSKUMaster,
    syncStatus,
    universalSearch,
    orders,
    skuMaster,
  } = useData()

=======
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
const ReturnsManager = lazy(() => import('./components/Commercial/ReturnsDashboard'))
const CarrierSelection = lazy(() => import('./components/Logistics/CarrierSelection'))
const InternationalShipping = lazy(() => import('./components/Logistics/InternationalShipping'))
const CarrierPerformance = lazy(() => import('./components/Logistics/CarrierPerformance'))
const ZoneMap = lazy(() => import('./components/Logistics/ZoneMap'))
const ShipmentTracker = lazy(() => import('./components/Tracking/ShipmentTracker'))
const WarehouseManager = lazy(() => import('./components/Warehouse/WarehouseManager'))
const SKUMaster = lazy(() => import('./components/Commercial/SKUMaster'))
const StockOptix = lazy(() => import('./components/Inventory/StockOptix'))
const StockAudit = lazy(() => import('./components/Warehouse/StockAudit'))
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
const DemandForecast = lazy(() => import('./components/Analytics/DemandForecast'))

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showQuickOrder, setShowQuickOrder] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
>>>>>>> 7843ee3b00ee6342e6e93acc44652609ac78119e
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearchActive, setIsSearchActive] = useState(false)

<<<<<<< HEAD
  // UI State Modals & Menus
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showQuickOrder, setShowQuickOrder] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Auto-sync SKU Master on mount & Initialize Shortcuts & Push
=======
  const { syncSKUMaster, syncStatus, universalSearch, orders, skuMaster } = useData()

  // Tab management by role
  useEffect(() => {
    if (user?.role === 'dealer') setActiveTab('dealer-portal')
    else setActiveTab('dashboard')
  }, [user?.role])

  // System Initialization
>>>>>>> 7843ee3b00ee6342e6e93acc44652609ac78119e
  useEffect(() => {
    if (isAuthenticated) {
      syncSKUMaster()
      initShortcuts()
<<<<<<< HEAD

      // Subscribe to Push Notifications
      import('./services/pushNotificationService').then((service) => {
        service.subscribeUser()
      })

      // Initialize WhatsApp Service
=======

      import('./services/pushNotificationService').then(s => s.subscribeUser())

>>>>>>> 7843ee3b00ee6342e6e93acc44652609ac78119e
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
<<<<<<< HEAD
        },
=======
        }
>>>>>>> 7843ee3b00ee6342e6e93acc44652609ac78119e
      })
    }
    return () => destroyShortcuts()
  }, [isAuthenticated, syncSKUMaster])

  // Keyboard Event Handlers
  useEffect(() => {
    if (isAuthenticated) {
<<<<<<< HEAD
      keyboardShortcuts.on('commandPalette', () => {
        document.querySelector('.search-bar input')?.focus()
      })
      keyboardShortcuts.on('newOrder', () => setShowQuickOrder(true))
=======
      keyboardShortcuts.on('commandPalette', () => document.querySelector('.search-bar input')?.focus())
      keyboardShortcuts.on('newOrder', () => setShowQuickOrder(true))
      keyboardShortcuts.on('showHelp', () => setShowShortcuts(true))
>>>>>>> 7843ee3b00ee6342e6e93acc44652609ac78119e

      return () => {
        keyboardShortcuts.off('commandPalette')
        keyboardShortcuts.off('newOrder')
      }
    }
  }, [isAuthenticated])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
<<<<<<< HEAD

    if (query.length >= 2) {
      if (typeof universalSearch === 'function') {
        setSearchResults(universalSearch(query))
      } else {
        const results = searchService.universalSearch({ orders, skuMaster }, query)
        setSearchResults(results)
      }
=======
    if (query.length >= 2) {
      const results = universalSearch ? universalSearch(query) : null
      setSearchResults(results)
>>>>>>> 7843ee3b00ee6342e6e93acc44652609ac78119e
      setIsSearchActive(true)
    } else {
      setSearchResults(null)
      setIsSearchActive(false)
    }
  }

  if (isLoading) {
    return (
<<<<<<< HEAD
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-extrabold text-white shadow-xl shadow-indigo-500/20">
            B
          </div>
          <p className="text-slate-400 font-medium">Loading...</p>
        </div>
=======
      <div className="view-loader-full">
          <div className="logo-icon-pulse">B</div>
          <p>Initializing Control Node...</p>
>>>>>>> 7843ee3b00ee6342e6e93acc44652609ac78119e
        </div>
    )
  }

<<<<<<< HEAD
    if (!isAuthenticated) {
      return <LoginPage />
    }
=======
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
              <li className={activeTab === 'stock-audit' ? 'active' : ''} onClick={() => { setActiveTab('stock-audit'); setIsMobileMenuOpen(false); }}>🛡️ Stock Audit</li>
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
>>>>>>> 7843ee3b00ee6342e6e93acc44652609ac78119e

    const renderView = () => {
      switch (activeTab) {
        case 'dashboard': return <AnalyticsDashboard />
        case 'metrics': return <PerformanceMetrics />
        case 'orderlist': return <OrderList />
        case 'bulk': return <BulkActions />
        case 'rto': return <RTOManager />
        case 'returns': return <ReturnsManager />
        case 'logistics': return <CarrierSelection />
        case 'intlship': return <InternationalShipping />
        case 'logisticshq': return <LogisticsHQ />
        case 'carrierperf': return <CarrierPerformance />
        case 'label-templates': return <LabelTemplateManager />
        case 'zones': return <ZoneMap />
        case 'tracking': return <ShipmentTracker />
        case 'orders': return <UniversalImporter />
        case 'warehouse': return <WarehouseManager />
        case 'inventory': return <SKUMaster />
        case 'stockoptix': return <StockOptix />
        case 'dispatcher': return <BarcodeDispatcher />
        case 'automation': return <AmazonMapper />
        case 'invoice': return <InvoiceGenerator />
        case 'finance': return <FinancialCenter />
        case 'commhub': return <CommercialHub />
        case 'guards': return <MarginGuard />
        case 'reconciliation': return <MarketplaceReconciliation />
        case 'globalledger': return <GlobalLedger />
        case 'cod': return <CODReconciliation />
        case 'dealer-portal': return <DealerPortal />
        case 'dealers': return <DealerLookup />
        case 'customers': return <CustomerLookup />
        case 'custintel': return <CustomerAnalytics />
        case 'marketing': return <MarketingCenter />
        case 'whatsapp-templates': return <WhatsAppTemplateManager />
        case 'production': return <ProductionTracker />
        case 'qa': return <QualityGate />
        case 'marketplace-recon': return <MarketplaceReconciliation />
        case 'activity': return <ActivityLog />
        case 'stock-audit': return <StockAudit />
        case 'ml-forecast': return <DemandForecast />
        case 'settings': return <SettingsPanel />
        case 'help': return <HelpCenter />
        case 'performance': return <PerformanceMetrics />
        default: return <AnalyticsDashboard />
      }
    }

    return (
      <ErrorBoundary>
<<<<<<< HEAD
    <div className={`app-container animate-fade ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <ResponsiveLayout
        sidebar={
          <nav className={`sidebar glass ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="logo-section">
              <div className="logo-icon">B</div>
              <h2>Bluewud<span>OTS</span></h2>
              <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>×</button>
            </div>

            <div className="nav-items">
              <div className="nav-group">
                <label>{t('nav.ops', 'OPERATIONS')}</label>
                <ul className="nav-links">
                  <Guard user={user} permission={PERMISSIONS.VIEW_ANALYTICS}>
                    <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
                      📊 {t('nav.analytics', 'Analytics')}
                    </li>
                  </Guard>

                  <Guard user={user} permission={PERMISSIONS.VIEW_FINANCE}>
                    <li className={activeTab === 'marketplace-recon' ? 'active' : ''} onClick={() => { setActiveTab('marketplace-recon'); setIsMobileMenuOpen(false); }}>
                      📊 {t('nav.audit', 'Marketplace Audit')}
                    </li>
                  </Guard>

                  <li className={activeTab === 'returns' ? 'active' : ''} onClick={() => { setActiveTab('returns'); setIsMobileMenuOpen(false); }}>
                    🔄 {t('nav.returns', 'Returns')}
                  </li>

                  <Guard user={user} permission={PERMISSIONS.VIEW_REPORTS}>
                    <li className={activeTab === 'metrics' ? 'active' : ''} onClick={() => { setActiveTab('metrics'); setIsMobileMenuOpen(false); }}>
                      📈 {t('nav.kpis', 'KPIs')}
                    </li>
                  </Guard>

                  <Guard user={user} permission={PERMISSIONS.MANAGE_ORDERS}>
                    <li className={activeTab === 'orderlist' ? 'active' : ''} onClick={() => { setActiveTab('orderlist'); setIsMobileMenuOpen(false); }}>
                      📋 {t('nav.orders', 'Orders')}
                    </li>
                  </Guard>

                  <Guard user={user} permission={PERMISSIONS.PLACE_WHOLESALE_ORDER}>
                    <li className={activeTab === 'dealer-portal' ? 'active' : ''} onClick={() => { setActiveTab('dealer-portal'); setIsMobileMenuOpen(false); }}>
                      🛒 {t('nav.partner_portal', 'Partner Portal')}
                    </li>
                  </Guard>

                  <Guard user={user} permission={PERMISSIONS.MANAGE_ORDERS}>
                    <li className={activeTab === 'bulk' ? 'active' : ''} onClick={() => { setActiveTab('bulk'); setIsMobileMenuOpen(false); }}>
                      ⚡ {t('nav.bulk', 'Bulk Actions')}
                    </li>
                  </Guard>

                  <li className={activeTab === 'tracking' ? 'active' : ''} onClick={() => { setActiveTab('tracking'); setIsMobileMenuOpen(false); }}>
                    📡 {t('nav.tracking', 'Tracking')}
                  </li>

                  <Guard user={user} permission={PERMISSIONS.MANAGE_ORDERS}>
                    <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => { setActiveTab('rto'); setIsMobileMenuOpen(false); }}>
                      ↩️ {t('nav.rto', 'RTO')}
                    </li>
                  </Guard>
                </ul>
              </div>

              <Guard user={user} permission={PERMISSIONS.MANAGE_INVENTORY}>
                <div className="nav-group">
                  <label>{t('nav.fulfillment', 'FULFILLMENT')}</label>
                  <ul className="nav-links">
                    <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}>
                      🏷️ {t('nav.sku_master', 'Inventory')}
                    </li>
                    <li className={activeTab === 'stockoptix' ? 'active' : ''} onClick={() => { setActiveTab('stockoptix'); setIsMobileMenuOpen(false); }}>
                      🧠 {t('nav.stockoptix', 'StockOptix')}
                    </li>
                    <li className={activeTab === 'warehouse' ? 'active' : ''} onClick={() => { setActiveTab('warehouse'); setIsMobileMenuOpen(false); }}>
                      🏭 {t('nav.warehouse', 'Warehouse')}
                    </li>
                    <li className={activeTab === 'dispatcher' ? 'active' : ''} onClick={() => { setActiveTab('dispatcher'); setIsMobileMenuOpen(false); }}>
                      📷 {t('nav.dispatch', 'Dispatch')}
                    </li>
                    <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}>
                      📤 {t('nav.importer', 'Import')}
                    </li>
                    <li className={activeTab === 'automation' ? 'active' : ''} onClick={() => { setActiveTab('automation'); setIsMobileMenuOpen(false); }}>
                      🤖 {t('nav.amazon_mapper', 'Amazon Mapper')}
                    </li>
                  </ul>
                </div>
              </Guard>

              <Guard user={user} permission={PERMISSIONS.MANAGE_CARRIERS}>
                <div className="nav-group">
                  <label>{t('nav.logistics', 'LOGISTICS')}</label>
                  <ul className="nav-links">
                    <li className={activeTab === 'logistics' ? 'active' : ''} onClick={() => { setActiveTab('logistics'); setIsMobileMenuOpen(false); }}>
                      🚚 {t('nav.logistics', 'Carriers')}
                    </li>
                    <li className={activeTab === 'logisticshq' ? 'active' : ''} onClick={() => { setActiveTab('logisticshq'); setIsMobileMenuOpen(false); }}>
                      🎯 {t('nav.logistics_hq', 'Logistics HQ')}
                    </li>
                    <li className={activeTab === 'intlship' ? 'active' : ''} onClick={() => { setActiveTab('intlship'); setIsMobileMenuOpen(false); }}>
                      🌐 {t('nav.intl_shipping', 'Intl Shipping')}
                    </li>
                    <li className={activeTab === 'carrierperf' ? 'active' : ''} onClick={() => { setActiveTab('carrierperf'); setIsMobileMenuOpen(false); }}>
                      🏆 {t('nav.performance', 'Carrier Perf')}
                    </li>
                  </ul>
                </div>
              </Guard>

              <Guard user={user} permission={PERMISSIONS.PROCESS_PAYMENTS}>
                <div className="nav-group">
                  <label>{t('nav.finance', 'FINANCE')}</label>
                  <ul className="nav-links">
                    <li className={activeTab === 'finance' ? 'active' : ''} onClick={() => { setActiveTab('finance'); setIsMobileMenuOpen(false); }}>
                      💹 {t('nav.finance', 'Financials')}
                    </li>
                    <li className={activeTab === 'commhub' ? 'active' : ''} onClick={() => { setActiveTab('commhub'); setIsMobileMenuOpen(false); }}>
                      💎 {t('nav.commhub', 'Comm. Hub')}
                    </li>
                    <li className={activeTab === 'globalledger' ? 'active' : ''} onClick={() => { setActiveTab('globalledger'); setIsMobileMenuOpen(false); }}>
                      🌍 {t('nav.ledger', 'Global Ledger')}
                    </li>
                  </ul>
                </div>
              </Guard>

              <div className="nav-group mb-6 mt-auto border-t border-slate-800 pt-4">
                <label>{t('common.language', 'LANGUAGE')}</label>
                <div className="px-4 py-2">
                  <select
                    className="glass w-full p-2 text-xs border-none outline-none appearance-none cursor-pointer text-slate-300"
                    value={locale}
                    onChange={(e) => changeLocale(e.target.value)}
                  >
                    {availableLocales.map((l) => (
                      <option key={l.code} value={l.code} className="bg-slate-900">
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="nav-group">
                <ul className="nav-links">
                  <Guard user={user} permission={PERMISSIONS.MANAGE_SETTINGS}>
                    <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}>
                      ⚙️ {t('nav.settings', 'Settings')}
                    </li>
                  </Guard>
                  <li className={activeTab === 'help' ? 'active' : ''} onClick={() => { setActiveTab('help'); setIsMobileMenuOpen(false); }}>
                    ❓ {t('nav.help', 'Help')}
                  </li>
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
        }
      >
        <main className="main-content">
          <header className="top-bar">
            <button className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
            <div className="header-actions">
              <div className="search-bar glass">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder={t('common.search', 'Search orders, customers, or SKUs...')}
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
                        {searchResults.orders.map((order) => (
                          <div key={order.id} className="result-item" onClick={() => { setActiveTab('orderlist'); setIsSearchActive(false); }}>
                            <span className="id">{order.id}</span>
                            <span className="meta">{order.customerName} • {order.status}</span>
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
              <div className={`sync-indicator ${syncStatus}`} title={`Status: ${syncStatus}`}>
                <span className="dot"></span>
                <span className="sync-text">{syncStatus?.toUpperCase() || 'SYNC'}</span>
              </div>
              <button className="btn-primary glass-hover" onClick={() => setShowQuickOrder(true)}>
                + {t('dashboard.new_order', 'New Order')}
              </button>
              <div className="notifications glass" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setShowNotifications(true)}>
                🔔
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%' }}></span>
              </div>
            </div>
          </header>

          <section className="view-container">
            <React.Suspense fallback={<PageLoader />}>
              <div key={activeTab} className="page-transition">
                {renderView()}
              </div>
            </React.Suspense>
          </section>
        </main>
      </ResponsiveLayout>

      {showQuickOrder && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowQuickOrder(false)}>
          <div style={{ maxWidth: '700px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
=======
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
>>>>>>> 7843ee3b00ee6342e6e93acc44652609ac78119e
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
