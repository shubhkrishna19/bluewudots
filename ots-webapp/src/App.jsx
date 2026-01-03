import React, { useState, useEffect } from 'react'
import './App.css'
import { useData } from './context/DataContext'
import { useAuth } from './context/AuthContext'
import LoginPage from './components/Auth/LoginPage'
import UserProfile from './components/Auth/UserProfile'
import CarrierSelection from './components/Logistics/CarrierSelection'
import UniversalImporter from './components/Automation/UniversalImporter'
import SKUMaster from './components/Commercial/SKUMaster'
import StockOptix from './components/Inventory/StockOptix'
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
import ReturnsManager from './components/Orders/ReturnsManager'
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
import MarketplaceReconciliation from './components/Commercial/MarketplaceReconciliation'
import MLAnalyticsDashboard from './components/Dashboard/MLAnalyticsDashboard'
import { initShortcuts, registerDefaultShortcuts, destroyShortcuts } from './services/keyboardShortcuts'
import searchService from './services/searchService'
import pushNotificationService from './services/pushNotificationService'
import ResponsiveLayout from './components/Shared/ResponsiveLayout'
import ErrorBoundary from './components/Shared/ErrorBoundary'
import keyboardShortcuts from './services/keyboardShortcutsEnhanced'
import { initWhatsAppService } from './services/whatsappServiceEnhanced'
import { Guard, ROLES, PERMISSIONS } from './services/rbacMiddleware'
import DealerPortal from './components/Dealers/DealerPortal'
// import { PERMISSIONS } from './utils/permissionUtils' // Deprecated/Duplicate

function App() {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Set default tab based on role
  useEffect(() => {
    if (user?.role === 'dealer') {
      setActiveTab('dealer-portal');
    } else {
      setActiveTab('dashboard');
    }
  }, [user?.role]);
  const { syncSKUMaster, syncStatus, universalSearch, orders, skuMaster } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearchActive, setIsSearchActive] = useState(false)

  // Auto-sync SKU Master on mount & Initialize Shortcuts & Push
  useEffect(() => {
    if (isAuthenticated) {
      syncSKUMaster();

      initShortcuts();

      // Subscribe to Push Notifications
      import('./services/pushNotificationService').then(service => {
        service.subscribeUser();
      });

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
          setShowQuickOrder(false);
          setShowNotifications(false);
          setShowProfile(false);
          setShowShortcuts(false);
        }
      });
    }
    return () => destroyShortcuts();
  }, [isAuthenticated, syncSKUMaster]);

  // Initialize enhanced keyboard shortcuts
  useEffect(() => {
    if (isAuthenticated) {
      // Example: Ctrl+K opens search
      keyboardShortcuts.on('commandPalette', () => {
        document.querySelector('.search-bar input')?.focus();
      });
      // Ctrl+N for new order
      keyboardShortcuts.on('newOrder', () => setShowQuickOrder(true));

      return () => {
        keyboardShortcuts.off('commandPalette');
        keyboardShortcuts.off('newOrder');
      };
    }
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
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
    } else {
      setSearchResults(null);
      setIsSearchActive(false);
    }
  };


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
    <ErrorBoundary>
      <div className={`app-container animate-fade ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <ResponsiveLayout
          sidebar={
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
                    </Guard>

                    <Guard user={user} permission={PERMISSIONS.PLACE_WHOLESALE_ORDER}>
                      <li className={activeTab === 'dealer-portal' ? 'active' : ''} onClick={() => { setActiveTab('dealer-portal'); setIsMobileMenuOpen(false); }}>🛒 Partner Portal</li>
                    </Guard>

                    <Guard user={user} permission={PERMISSIONS.MANAGE_ORDERS}>
                      <li className={activeTab === 'bulk' ? 'active' : ''} onClick={() => { setActiveTab('bulk'); setIsMobileMenuOpen(false); }}>⚡ Bulk</li>
                    </Guard>

                    <li className={activeTab === 'tracking' ? 'active' : ''} onClick={() => { setActiveTab('tracking'); setIsMobileMenuOpen(false); }}>📡 Tracking</li>

                    <Guard user={user} permission={PERMISSIONS.MANAGE_ORDERS}>
                      <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => { setActiveTab('rto'); setIsMobileMenuOpen(false); }}>↩️ RTO</li>
                      <li className={activeTab === 'returns' ? 'active' : ''} onClick={() => { setActiveTab('returns'); setIsMobileMenuOpen(false); }}>🔄 Returns (RMA)</li>
                    </Guard>
                  </ul>
                </div>

                <Guard user={user} permission={PERMISSIONS.MANAGE_INVENTORY}>
                  <div className="nav-group">
                    <label>INVENTORY & IMPORT</label>
                    <ul className="nav-links">
                      <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}>🏷️ SKU Master</li>
                      <li className={activeTab === 'stockoptix' ? 'active' : ''} onClick={() => { setActiveTab('stockoptix'); setIsMobileMenuOpen(false); }}>🧠 StockOptix™</li>
                      <li className={activeTab === 'warehouse' ? 'active' : ''} onClick={() => { setActiveTab('warehouse'); setIsMobileMenuOpen(false); }}>🏭 Warehouse</li>
                      <li className={activeTab === 'dispatcher' ? 'active' : ''} onClick={() => { setActiveTab('dispatcher'); setIsMobileMenuOpen(false); }}>📷 Dispatch</li>
                      <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}>📤 Universal Import</li>
                      <li className={activeTab === 'automation' ? 'active' : ''} onClick={() => { setActiveTab('automation'); setIsMobileMenuOpen(false); }}>🤖 Amazon Mapper</li>
                    </ul>
                  </div>
                </Guard>

                <Guard user={user} permission={PERMISSIONS.MANAGE_CARRIERS}>
                  <div className="nav-group">
                    <label>LOGISTICS</label>
                    <ul className="nav-links">
                      <li className={activeTab === 'logistics' ? 'active' : ''} onClick={() => { setActiveTab('logistics'); setIsMobileMenuOpen(false); }}>🚚 Carriers</li>
                      <li className={activeTab === 'intlship' ? 'active' : ''} onClick={() => { setActiveTab('intlship'); setIsMobileMenuOpen(false); }}>🌐 Int'l Shipping</li>
                      <li className={activeTab === 'carrierperf' ? 'active' : ''} onClick={() => { setActiveTab('carrierperf'); setIsMobileMenuOpen(false); }}>🏆 Performance</li>
                      <li className={activeTab === 'zones' ? 'active' : ''} onClick={() => { setActiveTab('zones'); setIsMobileMenuOpen(false); }}>🗺️ Zones</li>
                    </ul>
                  </div>
                </Guard>

                <Guard user={user} permission={PERMISSIONS.PROCESS_PAYMENTS}>
                  <div className="nav-group">
                    <label>FINANCE</label>
                    <ul className="nav-links">
                      <li className={activeTab === 'finance' ? 'active' : ''} onClick={() => { setActiveTab('finance'); setIsMobileMenuOpen(false); }}>💹 Financials</li>
                      <li className={activeTab === 'commhub' ? 'active' : ''} onClick={() => { setActiveTab('commhub'); setIsMobileMenuOpen(false); }}>💎 Comm. Hub</li>
                      <li className={activeTab === 'guards' ? 'active' : ''} onClick={() => { setActiveTab('guards'); setIsMobileMenuOpen(false); }}>🛡️ Margin Guard</li>
                      <li className={activeTab === 'globalledger' ? 'active' : ''} onClick={() => { setActiveTab('globalledger'); setIsMobileMenuOpen(false); }}>🌍 Global Ledger</li>
                      <li className={activeTab === 'reconciliation' ? 'active' : ''} onClick={() => { setActiveTab('reconciliation'); setIsMobileMenuOpen(false); }}>⚖️ Marketplace Audit</li>
                      <li className={activeTab === 'invoice' ? 'active' : ''} onClick={() => { setActiveTab('invoice'); setIsMobileMenuOpen(false); }}>🧾 Invoicing</li>
                      <li className={activeTab === 'cod' ? 'active' : ''} onClick={() => { setActiveTab('cod'); setIsMobileMenuOpen(false); }}>💰 COD Recon</li>
                    </ul>
                  </div>
                </Guard>

                <Guard user={user} permission={PERMISSIONS.VIEW_REPORTS}>
                  <div className="nav-group">
                    <label>CRM & MARKETING</label>
                    <ul className="nav-links">
                      <li className={activeTab === 'customers' ? 'active' : ''} onClick={() => { setActiveTab('customers'); setIsMobileMenuOpen(false); }}>👥 Customers</li>
                      <li className={activeTab === 'custintel' ? 'active' : ''} onClick={() => { setActiveTab('custintel'); setIsMobileMenuOpen(false); }}>💎 Customer Intel</li>
                      <li className={activeTab === 'marketing' ? 'active' : ''} onClick={() => { setActiveTab('marketing'); setIsMobileMenuOpen(false); }}>🎯 Marketing</li>
                      <li className={activeTab === 'dealers' ? 'active' : ''} onClick={() => { setActiveTab('dealers'); setIsMobileMenuOpen(false); }}>🤝 Dealers</li>
                    </ul>
                  </div>
                </Guard>

                <Guard user={user} permission={PERMISSIONS.PROCESS_QC}>
                  <div className="nav-group">
                    <label>SUPPLY CHAIN</label>
                    <ul className="nav-links">
                      <li className={activeTab === 'production' ? 'active' : ''} onClick={() => { setActiveTab('production'); setIsMobileMenuOpen(false); }}>🏭 Production</li>
                      <li className={activeTab === 'qa' ? 'active' : ''} onClick={() => { setActiveTab('qa'); setIsMobileMenuOpen(false); }}>💎 Quality Gate</li>
                    </ul>
                  </div>
                </Guard>

                <div className="nav-group">
                  <label>ADMIN & SUPPORT</label>
                  <ul className="nav-links">
                    <Guard user={user} permission={PERMISSIONS.VIEW_ACTIVITY_LOG}>
                      <li className={activeTab === 'activity' ? 'active' : ''} onClick={() => { setActiveTab('activity'); setIsMobileMenuOpen(false); }}>📜 Activity Log</li>
                    </Guard>
                    <Guard user={user} permission={PERMISSIONS.VIEW_REPORTS}>
                      <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}>📄 Export</li>
                    </Guard>
                    <li className={activeTab === 'performance' ? 'active' : ''} onClick={() => { setActiveTab('performance'); setIsMobileMenuOpen(false); }}>📈 Performance Score</li>
                    <li className={activeTab === 'ml-forecast' ? 'active' : ''} onClick={() => { setActiveTab('ml-forecast'); setIsMobileMenuOpen(false); }}>🧠 ML Forecast</li>
                    <li className={activeTab === 'roadmap' ? 'active' : ''} onClick={() => { setActiveTab('roadmap'); setIsMobileMenuOpen(false); }}>🛣️ Product Roadmap</li>
                    <li className={activeTab === 'help' ? 'active' : ''} onClick={() => { setActiveTab('help'); setIsMobileMenuOpen(false); }}>❓ Help</li>
                    <Guard user={user} permission={PERMISSIONS.MANAGE_SETTINGS}>
                      <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}>⚙️ Settings</li>
                    </Guard>
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
                  <span className="sync-text">{syncStatus ? syncStatus.toUpperCase() : 'SYNC'}</span>
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

              <Guard user={user} permission={PERMISSIONS.VIEW_REPORTS} fallback={<div className="glass p-20 text-center">🚫 Restricted View</div>}>
                {activeTab === 'metrics' && <PerformanceMetrics />}
              </Guard>

              <Guard user={user} permission={PERMISSIONS.MANAGE_ORDERS} fallback={<div className="glass p-20 text-center">🚫 Access Denied</div>}>
                {activeTab === 'orderlist' && <OrderList />}
                {activeTab === 'bulk' && <BulkActions />}
                {activeTab === 'rto' && <RTOManager />}
                {activeTab === 'returns' && <ReturnsManager />}
              </Guard>

              <Guard user={user} permission={PERMISSIONS.MANAGE_CARRIERS}>
                {activeTab === 'logistics' && <CarrierSelection />}
                {activeTab === 'intlship' && <InternationalShipping />}
                {activeTab === 'carrierperf' && <CarrierPerformance />}
                {activeTab === 'zones' && <ZoneMap />}
              </Guard>

              {activeTab === 'tracking' && <ShipmentTracker />}

              <Guard user={user} permission={PERMISSIONS.MANAGE_INVENTORY}>
                {activeTab === 'orders' && <UniversalImporter />}
                {activeTab === 'warehouse' && <WarehouseManager />}
                {activeTab === 'inventory' && <SKUMaster />}
                {activeTab === 'stockoptix' && <StockOptix />}
                {activeTab === 'dispatcher' && <BarcodeDispatcher />}
                {activeTab === 'automation' && <AmazonMapper />}
              </Guard>

              <Guard user={user} permission={PERMISSIONS.PROCESS_PAYMENTS}>
                {activeTab === 'invoice' && <InvoiceGenerator />}
                {activeTab === 'finance' && <FinancialCenter />}
                {activeTab === 'commhub' && <CommercialHub />}
                {activeTab === 'guards' && <MarginGuard />}
                {activeTab === 'reconciliation' && <MarketplaceReconciliation />}
                {activeTab === 'globalledger' && <GlobalLedger />}
                {activeTab === 'cod' && <CODReconciliation />}
              </Guard>

              <Guard user={user} permission={PERMISSIONS.PLACE_WHOLESALE_ORDER}>
                {activeTab === 'dealer-portal' && <DealerPortal />}
              </Guard>

              <Guard user={user} permission={PERMISSIONS.VIEW_REPORTS}>
                {activeTab === 'dealers' && <DealerLookup />}
                {activeTab === 'customers' && <CustomerLookup />}
                {activeTab === 'custintel' && <CustomerAnalytics />}
                {activeTab === 'marketing' && <MarketingCenter />}
                {activeTab === 'reports' && <ExportTools />}
              </Guard>

              <Guard user={user} permission={PERMISSIONS.PROCESS_QC}>
                {activeTab === 'production' && <ProductionTracker />}
                {activeTab === 'qa' && <QualityGate />}
              </Guard>

              <Guard user={user} permission={PERMISSIONS.VIEW_ACTIVITY_LOG}>
                {activeTab === 'activity' && <ActivityLog />}
              </Guard>

              {activeTab === 'ml-forecast' && <MLAnalyticsDashboard />}
              {activeTab === 'performance' && <PerformanceMetrics />}
              {activeTab === 'roadmap' && <RoadmapPage />}
              {activeTab === 'help' && <HelpCenter />}

              <Guard user={user} permission={PERMISSIONS.MANAGE_SETTINGS}>
                {activeTab === 'settings' && <SettingsPanel />}
              </Guard>
            </section>
          </main>
        </ResponsiveLayout>

        {/* Overlays/Modals */}
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

        <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
        {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ErrorBoundary>
  )
}

export default App
