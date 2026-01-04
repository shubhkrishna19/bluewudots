import React, { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { useLocalization } from '@/context/LocalizationContext'
import LoginPage from '@/components/Auth/LoginPage'
import ErrorBoundary from '@/components/Shared/ErrorBoundary'
import { Guard, ROLES, PERMISSIONS } from '@/services/rbacMiddleware'
import ResponsiveLayout from '@/components/Shared/ResponsiveLayout'
import MobileBottomNav from '@/components/Navigation/MobileBottomNav'
import NotificationCenter from '@/components/Notifications/NotificationCenter'
import QuickOrderForm from '@/components/Orders/QuickOrderForm'
import ServiceWorkerUpdater from '@/components/ServiceWorkerUpdater'
import UserProfile from '@/components/Auth/UserProfile'

// Service & Utility Imports
import { initShortcuts, registerDefaultShortcuts, destroyShortcuts } from './services/keyboardShortcuts'
import keyboardShortcuts from './services/keyboardShortcuts'
import { initWhatsAppService } from '@/services/whatsappService'
import searchService from '@/services/searchService'

// --- Lazy Loaded Components (Performance Optimization) ---
// Dashboard & Analytics
const AnalyticsDashboard = lazy(() => import('@/components/Dashboard/AnalyticsDashboard'))
const PerformanceMetrics = lazy(() => import('@/components/Dashboard/PerformanceMetrics'))
const ActivityLog = lazy(() => import('@/components/Activity/ActivityLog'))
const DemandForecast = lazy(() => import('@/components/Analytics/DemandForecast'))
const RTOAnalyticsDashboard = lazy(() => import('@/components/Analytics/RTOAnalyticsDashboard'))

// Orders
const OrderList = lazy(() => import('@/components/Orders/OrderList'))
const BulkActions = lazy(() => import('@/components/Orders/BulkActions'))
const RTOManager = lazy(() => import('@/components/Orders/RTOManager'))
const ReturnsManager = lazy(() => import('@/components/Commercial/ReturnsDashboard'))
const BarcodeDispatcher = lazy(() => import('@/components/Orders/BarcodeDispatcher'))

// Logistics
const CarrierSelection = lazy(() => import('@/components/Logistics/CarrierSelection'))
const ZoneMap = lazy(() => import('@/components/Logistics/ZoneMap'))
const CarrierPerformance = lazy(() => import('@/components/Logistics/CarrierPerformance'))
const ShipmentTracker = lazy(() => import('@/components/Tracking/ShipmentTracker'))
const InternationalShipping = lazy(() => import('@/components/Logistics/InternationalShipping'))

// Inventory & Warehouse
const SKUMaster = lazy(() => import('@/components/Commercial/SKUMaster'))
const StockOptix = lazy(() => import('@/components/Inventory/StockOptix'))
const WarehouseManager = lazy(() => import('@/components/Warehouse/WarehouseManager'))
const StockAudit = lazy(() => import('@/components/Warehouse/StockAudit'))
const UniversalImporter = lazy(() => import('@/components/Automation/UniversalImporter'))
const AmazonMapper = lazy(() => import('@/components/Automation/AmazonMapper'))

// Commercial & Finance
const FinancialCenter = lazy(() => import('@/components/Commercial/FinancialCenter'))
const CommercialHub = lazy(() => import('@/components/Commercial/CommercialHub'))
const GlobalLedger = lazy(() => import('@/components/Commercial/GlobalLedger'))
const MarginGuard = lazy(() => import('@/components/Commercial/MarginGuard'))
const InvoiceGenerator = lazy(() => import('@/components/Commercial/InvoiceGenerator'))
const CODReconciliation = lazy(() => import('@/components/Commercial/CODReconciliation'))
const MarketplaceReconciliation = lazy(() => import('@/components/Commercial/MarketplaceReconciliation'))

// CRM & Marketing
const DealerLookup = lazy(() => import('@/components/Dealers/DealerLookup'))
const CustomerLookup = lazy(() => import('@/components/Customers/CustomerLookup'))
const CustomerAnalytics = lazy(() => import('@/components/Customers/CustomerAnalytics'))
const MarketingCenter = lazy(() => import('@/components/Marketing/MarketingCenter'))
const DealerPortal = lazy(() => import('@/components/Dealers/DealerPortal'))

// Supply Chain
const ProductionTracker = lazy(() => import('@/components/SupplyChain/ProductionTracker'))
const QualityGate = lazy(() => import('@/components/SupplyChain/QualityGate'))

// Settings & Support
const SettingsPanel = lazy(() => import('@/components/Settings/SettingsPanel'))
const HelpCenter = lazy(() => import('@/components/Help/HelpCenter'))
const ShortcutsModal = lazy(() => import('@/components/Help/ShortcutsModal'))
const RoadmapPage = lazy(() => import('@/components/Roadmap/RoadmapPage'))
const ReportBuilder = lazy(() => import('@/components/Reports/ReportBuilder'))

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
  const { isAuthenticated, isLoading, user } = useAuth()
  const { t, locale, changeLocale, availableLocales } = useLocalization()
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

  // Set default tab based on role
  useEffect(() => {
    if (user?.role === 'dealer') {
      setActiveTab('dealer-portal')
    } else {
      setActiveTab('dashboard')
    }
  }, [user?.role])

  // System Initialization
  useEffect(() => {
    if (isAuthenticated) {
      syncSKUMaster()
      initShortcuts()

      // Subscribe to Push Notifications
      import('./services/pushNotificationService').then((service) => {
        service.subscribeUser()
      })

      // Initialize WhatsApp Service
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
        },
      })
    }
    return () => destroyShortcuts()
  }, [isAuthenticated, syncSKUMaster])

  // Keyboard Event Handlers
  useEffect(() => {
    if (isAuthenticated) {
      keyboardShortcuts.on('commandPalette', () => {
        document.querySelector('.search-bar input')?.focus()
      })
      keyboardShortcuts.on('newOrder', () => setShowQuickOrder(true))
      keyboardShortcuts.on('showHelp', () => setShowShortcuts(true))

      return () => {
        keyboardShortcuts.off('commandPalette')
        keyboardShortcuts.off('newOrder')
        keyboardShortcuts.off('showHelp')
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
        <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>×</button>
      </div>

      <div className="nav-items">
        <div className="nav-group">
          <label>{t('nav.ops', 'OPERATIONS')}</label>
          <ul className="nav-links">
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
              📊 {t('nav.analytics', 'Analytics')}
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
              <li className={activeTab === 'bulk' ? 'active' : ''} onClick={() => { setActiveTab('bulk'); setIsMobileMenuOpen(false); }}>
                ⚡ {t('nav.bulk', 'Bulk')}
              </li>
              <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => { setActiveTab('rto'); setIsMobileMenuOpen(false); }}>
                ↩️ {t('nav.rto', 'RTO')}
              </li>
            </Guard>
            <li className={activeTab === 'returns' ? 'active' : ''} onClick={() => { setActiveTab('returns'); setIsMobileMenuOpen(false); }}>
              🔄 {t('nav.returns', 'Returns')}
            </li>
            <li className={activeTab === 'tracking' ? 'active' : ''} onClick={() => { setActiveTab('tracking'); setIsMobileMenuOpen(false); }}>
              📡 {t('nav.tracking', 'Tracking')}
            </li>
          </ul>
        </div>

        <Guard user={user} permission={PERMISSIONS.MANAGE_INVENTORY}>
          <div className="nav-group">
            <label>{t('nav.fulfillment', 'FULFILLMENT')}</label>
            <ul className="nav-links">
              <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}>
                🏷️ {t('nav.sku_master', 'SKU Master')}
              </li>
              <li className={activeTab === 'warehouse' ? 'active' : ''} onClick={() => { setActiveTab('warehouse'); setIsMobileMenuOpen(false); }}>
                🏭 {t('nav.warehouse', 'Warehouse')}
              </li>
              <li className={activeTab === 'stock-audit' ? 'active' : ''} onClick={() => { setActiveTab('stock-audit'); setIsMobileMenuOpen(false); }}>
                🛡️ {t('nav.stock_audit', 'Stock Audit')}
              </li>
              <li className={activeTab === 'stockoptix' ? 'active' : ''} onClick={() => { setActiveTab('stockoptix'); setIsMobileMenuOpen(false); }}>
                🧠 {t('nav.stockoptix', 'StockOptix')}
              </li>
              <li className={activeTab === 'logistics' ? 'active' : ''} onClick={() => { setActiveTab('logistics'); setIsMobileMenuOpen(false); }}>
                🚚 {t('nav.logistics', 'Carriers')}
              </li>
              <li className={activeTab === 'intlship' ? 'active' : ''} onClick={() => { setActiveTab('intlship'); setIsMobileMenuOpen(false); }}>
                🌐 {t('nav.intl_shipping', 'Intl Shipping')}
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
              <li className={activeTab === 'globalledger' ? 'active' : ''} onClick={() => { setActiveTab('globalledger'); setIsMobileMenuOpen(false); }}>
                🌍 {t('nav.ledger', 'Global Ledger')}
              </li>
              <li className={activeTab === 'marketplace-recon' ? 'active' : ''} onClick={() => { setActiveTab('marketplace-recon'); setIsMobileMenuOpen(false); }}>
                📊 {t('nav.audit', 'Marketplace Audit')}
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
          <label>SYSTEM</label>
          <ul className="nav-links">
            <li className={activeTab === 'activity' ? 'active' : ''} onClick={() => { setActiveTab('activity'); setIsMobileMenuOpen(false); }}>
              📜 {t('nav.activity', 'Activity')}
            </li>
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}>
              ⚙️ {t('nav.settings', 'Settings')}
            </li>
            <li className={activeTab === 'help' ? 'active' : ''} onClick={() => { setActiveTab('help'); setIsMobileMenuOpen(false); }}>
              ❓ {t('nav.help', 'Help')}
            </li>
            <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}>
              📄 {t('nav.reports', 'Reports')}
            </li>
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
            placeholder={t('common.search', "Search orders, customers, or SKUs...")}
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
        <button className="btn-primary" onClick={() => setShowQuickOrder(true)}>+ {t('dashboard.new_order', 'New Order')}</button>
        <div className="notifications-trigger" style={{ cursor: 'pointer' }} onClick={() => setShowNotifications(true)}>🔔</div>
      </div>
    </header>
  )

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
      case 'zones': return <ZoneMap />
      case 'carrierperf': return <CarrierPerformance />
      case 'tracking': return <ShipmentTracker />
      case 'warehouse': return <WarehouseManager />
      case 'inventory': return <SKUMaster />
      case 'stock-audit': return <StockAudit />
      case 'stockoptix': return <StockOptix />
      case 'dispatcher': return <BarcodeDispatcher />
      case 'finance': return <FinancialCenter />
      case 'commhub': return <CommercialHub />
      case 'globalledger': return <GlobalLedger />
      case 'marketplace-recon': return <MarketplaceReconciliation />
      case 'cod': return <CODReconciliation />
      case 'dealer-portal': return <DealerPortal />
      case 'activity': return <ActivityLog />
      case 'settings': return <SettingsPanel />
      case 'help': return <HelpCenter />
      case 'roadmap': return <RoadmapPage />
      case 'reports': return <ReportBuilder />
      case 'ml-forecast': return <DemandForecast />
      default: return <AnalyticsDashboard />
    }
  }

  return (
    <ErrorBoundary>
      <ServiceWorkerUpdater />
      <div className="app-container">
        <ResponsiveLayout sidebar={Sidebar} header={Header}>
          <section className="view-container">
            <Suspense fallback={<PageLoader />}>
              {renderView()}
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
