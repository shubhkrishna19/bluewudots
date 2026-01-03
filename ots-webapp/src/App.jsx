import React, { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import { useData } from './context/DataContext'
import { useAuth } from './context/AuthContext'
<<<<<<< HEAD
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
=======
import LoginPage from './components/Auth/LoginPage'
import UserProfile from './components/Auth/UserProfile'
import CarrierSelection from './components/Logistics/CarrierSelection'
import UniversalImporter from './components/Automation/UniversalImporter'
import SKUMaster from './components/Commercial/SKUMaster'
import BarcodeDispatcher from './components/Orders/BarcodeDispatcher'
import AnalyticsDashboard from './components/Dashboard/AnalyticsEnhanced'
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
import searchService from './services/searchService'
import pushNotificationService from './services/pushNotificationService'
import ResponsiveLayout from './components/Shared/ResponsiveLayout'
import ErrorBoundary from './components/Shared/ErrorBoundary'
import keyboardShortcuts from './services/keyboardShortcutsEnhanced'
import { initWhatsAppService } from './services/whatsappServiceEnhanced'
>>>>>>> bdfa91095dfdb711d0b2ac67852aebe794017405

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showQuickOrder, setShowQuickOrder] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
<<<<<<< HEAD
=======
  const { syncSKUMaster, syncStatus, universalSearch, orders, skuMaster } = useData()
>>>>>>> bdfa91095dfdb711d0b2ac67852aebe794017405
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearchActive, setIsSearchActive] = useState(false)

<<<<<<< HEAD
  const { syncSKUMaster, syncStatus, orders = [], skuMaster = [] } = useData()

  // Initialization
  useEffect(() => {
    if (isAuthenticated) {
      syncSKUMaster()
      initShortcuts()

      // Push Notifications
=======
  // Auto-sync SKU Master on mount & Initialize Shortcuts & Push
  useEffect(() => {
    if (isAuthenticated) {
      syncSKUMaster();

      initShortcuts();

      // Subscribe to Push Notifications
>>>>>>> bdfa91095dfdb711d0b2ac67852aebe794017405
      import('./services/pushNotificationService').then(service => {
        service.subscribeUser()
      })

      // Initialize WhatsApp Service
      initWhatsAppService(
        import.meta.env.VITE_WHATSAPP_API_TOKEN,
        import.meta.env.VITE_WHATSAPP_BUSINESS_ID,
        import.meta.env.VITE_WHATSAPP_PHONE_ID
      );

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
<<<<<<< HEAD
      // Use the injected searchService if available, otherwise fallback to local logic
      const targetData = { orders, skuMaster }
      const results = searchService?.universalSearch ? searchService.universalSearch(targetData, query) : null
      setSearchResults(results)
      setIsSearchActive(true)
=======
      // Use universalSearch from useData if available, otherwise fallback or implementation dependent
      // The original code used searchService.universalSearch OR universalSearch from context.
      // HEAD used universalSearch context function. Incoming used searchService directly.
      // We will prefer the Context one if it exists to respect current architecture,
      // but HEAD's universalSearch function signature might differ.
      // HEAD: setSearchResults(universalSearch(e.target.value));
      // Incoming: const results = searchService.universalSearch({ orders, skuMaster }, query);

      // Let's try to use the one that seems most robust. 'universalSearch' from context likely wraps logic.
      if (typeof universalSearch === 'function') {
        setSearchResults(universalSearch(query));
      } else {
        const results = searchService.universalSearch({ orders, skuMaster }, query);
        setSearchResults(results);
      }
      setIsSearchActive(true);
>>>>>>> bdfa91095dfdb711d0b2ac67852aebe794017405
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
<<<<<<< HEAD
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
=======
      <div className={`app-container animate-fade ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <ResponsiveLayout
          sidebar={
            <nav className={`sidebar glass ${isMobileMenuOpen ? 'open' : ''}`}>
              <div className="logo-section">
                <div className="logo-icon">B</div>
                <h2>Bluewud<span>OTS</span></h2>
                <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
>>>>>>> bdfa91095dfdb711d0b2ac67852aebe794017405
              </div>
            )}

<<<<<<< HEAD
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
=======
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
            </nav>}
        >
          <main className="main-content">
            <header className="top-bar">
              <button className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
              <div className="search-container">
                <div className="search-bar glass">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search orders, customers, or SKUs (Fuzzy)..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => searchQuery.length >= 2 && setIsSearchActive(true)}
                  />
                </div>

                {/* Using the search dropdown from incoming which supports 'searchResults' state structure */}
                {isSearchActive && searchResults && (
                  <div className="search-dropdown glass animate-fade">
                    <div className="search-results-header">
                      <span>Fuzzy Match Results ({searchResults.totalResults})</span>
                      <button onClick={() => setIsSearchActive(false)} className="close-search">×</button>
                    </div>
                    <div className="search-scroll">
                      {searchResults.orders && searchResults.orders.length > 0 && (
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

                      {searchResults.skus && searchResults.skus.length > 0 && (
                        <div className="result-group">
                          <label>SKU Catalog</label>
                          {searchResults.skus.map(sku => (
                            <div key={sku.code} className="result-item" onClick={() => { setActiveTab('inventory'); setIsSearchActive(false); }}>
                              <span className="id">{sku.code}</span>
                              <span className="meta">{sku.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
>>>>>>> bdfa91095dfdb711d0b2ac67852aebe794017405

              {isSearchActive && searchResults && (
                <div className="search-dropdown glass animate-fade">
                  <div className="search-results-header">
                    <span>Fuzzy Match Results ({searchResults.totalResults})</span>
                    <button onClick={() => setIsSearchActive(false)} className="close-search">×</button>
                  </div>
<<<<<<< HEAD
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
=======
                )}
              </div>
              <div className="actions">
                <div className={`sync-indicator ${syncStatus}`} title={`Status: ${syncStatus}`}>
                  <span className="dot"></span>
                  <span className="sync-text">{syncStatus ? syncStatus.toUpperCase() : 'SYNC'}</span>
                </div>
                <button className="btn-primary glass-hover" onClick={() => setShowQuickOrder(true)}>+ New Order</button>
                <div className="notifications glass" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setShowNotifications(true)}>
                  🔔
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%' }}></span>
                </div>
              </div>
            </header>
>>>>>>> bdfa91095dfdb711d0b2ac67852aebe794017405

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
<<<<<<< HEAD
              {activeTab === 'guards' && <MarginGuard />}
              {activeTab === 'globalledger' && <GlobalLedger />}
              {activeTab === 'activity' && <ActivityLog />}
=======
              {activeTab === 'activity' && (user?.role === 'admin' ? <ActivityLog /> : <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>🚫 Access Restricted</div>)}
>>>>>>> bdfa91095dfdb711d0b2ac67852aebe794017405
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
<<<<<<< HEAD

=======
>>>>>>> bdfa91095dfdb711d0b2ac67852aebe794017405
        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ErrorBoundary>
  )
}

export default App
