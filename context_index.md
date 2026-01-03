# Bluewud OTS: Global Context Index

Generated on 2026-01-03T21:40:15.058Z

## [App.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/App.jsx)
> No summary available.

```javascript
function App() {
```

```javascript
useEffect(() => {
```

```javascript
useEffect(() => {
```

```javascript
import('./services/pushNotificationService').then(service => {
```

```javascript
dashboard: () => setActiveTab('dashboard'),
```

```javascript
orders: () => setActiveTab('orderlist'),
```

```javascript
search: () => document.querySelector('.search-bar input')?.focus(),
```

```javascript
bulk: () => setActiveTab('bulk'),
```

```javascript
help: () => setShowShortcuts(true),
```

```javascript
closeModal: () => {
```

```javascript
return () => destroyShortcuts();
```

```javascript
useEffect(() => {
```

```javascript
keyboardShortcuts.on('commandPalette', () => {
```

```javascript
keyboardShortcuts.on('newOrder', () => setShowQuickOrder(true));
```

```javascript
return () => {
```

```javascript
const handleSearch = (e) => {
```

```javascript
// HEAD used universalSearch context function. Incoming used searchService directly.
```

```javascript
// but HEAD's universalSearch function signature might differ.
```

```javascript
if (typeof universalSearch === 'function') {
```

```javascript
<button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
```

```javascript
<li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>📊 Analytics</li>
```

```javascript
<li className={activeTab === 'metrics' ? 'active' : ''} onClick={() => { setActiveTab('metrics'); setIsMobileMenuOpen(false); }}>📈 KPIs</li>
```

```javascript
<li className={activeTab === 'orderlist' ? 'active' : ''} onClick={() => { setActiveTab('orderlist'); setIsMobileMenuOpen(false); }}>📋 Orders</li>
```

```javascript
<li className={activeTab === 'dealer-portal' ? 'active' : ''} onClick={() => { setActiveTab('dealer-portal'); setIsMobileMenuOpen(false); }}>🛒 Partner Portal</li>
```

```javascript
<li className={activeTab === 'bulk' ? 'active' : ''} onClick={() => { setActiveTab('bulk'); setIsMobileMenuOpen(false); }}>⚡ Bulk</li>
```

```javascript
<li className={activeTab === 'tracking' ? 'active' : ''} onClick={() => { setActiveTab('tracking'); setIsMobileMenuOpen(false); }}>📡 Tracking</li>
```

```javascript
<li className={activeTab === 'rto' ? 'active' : ''} onClick={() => { setActiveTab('rto'); setIsMobileMenuOpen(false); }}>↩️ RTO</li>
```

```javascript
<li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}>🏷️ SKU Master</li>
```

```javascript
<li className={activeTab === 'warehouse' ? 'active' : ''} onClick={() => { setActiveTab('warehouse'); setIsMobileMenuOpen(false); }}>🏭 Warehouse</li>
```

```javascript
<li className={activeTab === 'dispatcher' ? 'active' : ''} onClick={() => { setActiveTab('dispatcher'); setIsMobileMenuOpen(false); }}>📷 Dispatch</li>
```

```javascript
<li className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}>📤 Universal Import</li>
```

```javascript
<li className={activeTab === 'automation' ? 'active' : ''} onClick={() => { setActiveTab('automation'); setIsMobileMenuOpen(false); }}>🤖 Amazon Mapper</li>
```

```javascript
<li className={activeTab === 'logistics' ? 'active' : ''} onClick={() => { setActiveTab('logistics'); setIsMobileMenuOpen(false); }}>🚚 Carriers</li>
```

```javascript
<li className={activeTab === 'intlship' ? 'active' : ''} onClick={() => { setActiveTab('intlship'); setIsMobileMenuOpen(false); }}>🌐 Int'l Shipping</li>
```

```javascript
<li className={activeTab === 'carrierperf' ? 'active' : ''} onClick={() => { setActiveTab('carrierperf'); setIsMobileMenuOpen(false); }}>🏆 Performance</li>
```

```javascript
<li className={activeTab === 'zones' ? 'active' : ''} onClick={() => { setActiveTab('zones'); setIsMobileMenuOpen(false); }}>🗺️ Zones</li>
```

```javascript
<li className={activeTab === 'finance' ? 'active' : ''} onClick={() => { setActiveTab('finance'); setIsMobileMenuOpen(false); }}>💹 Financials</li>
```

```javascript
<li className={activeTab === 'commhub' ? 'active' : ''} onClick={() => { setActiveTab('commhub'); setIsMobileMenuOpen(false); }}>💎 Comm. Hub</li>
```

```javascript
<li className={activeTab === 'guards' ? 'active' : ''} onClick={() => { setActiveTab('guards'); setIsMobileMenuOpen(false); }}>🛡️ Margin Guard</li>
```

```javascript
<li className={activeTab === 'globalledger' ? 'active' : ''} onClick={() => { setActiveTab('globalledger'); setIsMobileMenuOpen(false); }}>🌍 Global Ledger</li>
```

```javascript
<li className={activeTab === 'invoice' ? 'active' : ''} onClick={() => { setActiveTab('invoice'); setIsMobileMenuOpen(false); }}>🧾 Invoicing</li>
```

```javascript
<li className={activeTab === 'cod' ? 'active' : ''} onClick={() => { setActiveTab('cod'); setIsMobileMenuOpen(false); }}>💰 COD Recon</li>
```

```javascript
<li className={activeTab === 'customers' ? 'active' : ''} onClick={() => { setActiveTab('customers'); setIsMobileMenuOpen(false); }}>👥 Customers</li>
```

```javascript
<li className={activeTab === 'custintel' ? 'active' : ''} onClick={() => { setActiveTab('custintel'); setIsMobileMenuOpen(false); }}>💎 Customer Intel</li>
```

```javascript
<li className={activeTab === 'marketing' ? 'active' : ''} onClick={() => { setActiveTab('marketing'); setIsMobileMenuOpen(false); }}>🎯 Marketing</li>
```

```javascript
<li className={activeTab === 'dealers' ? 'active' : ''} onClick={() => { setActiveTab('dealers'); setIsMobileMenuOpen(false); }}>🤝 Dealers</li>
```

```javascript
<li className={activeTab === 'production' ? 'active' : ''} onClick={() => { setActiveTab('production'); setIsMobileMenuOpen(false); }}>🏭 Production</li>
```

```javascript
<li className={activeTab === 'qa' ? 'active' : ''} onClick={() => { setActiveTab('qa'); setIsMobileMenuOpen(false); }}>💎 Quality Gate</li>
```

```javascript
<li className={activeTab === 'activity' ? 'active' : ''} onClick={() => { setActiveTab('activity'); setIsMobileMenuOpen(false); }}>📜 Activity Log</li>
```

```javascript
<li className={activeTab === 'reports' ? 'active' : ''} onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}>📄 Export</li>
```

```javascript
<li className={activeTab === 'performance' ? 'active' : ''} onClick={() => { setActiveTab('performance'); setIsMobileMenuOpen(false); }}>📈 Performance Score</li>
```

```javascript
<li className={activeTab === 'ml-forecast' ? 'active' : ''} onClick={() => { setActiveTab('ml-forecast'); setIsMobileMenuOpen(false); }}>🧠 ML Forecast</li>
```

```javascript
<li className={activeTab === 'roadmap' ? 'active' : ''} onClick={() => { setActiveTab('roadmap'); setIsMobileMenuOpen(false); }}>🛣️ Product Roadmap</li>
```

```javascript
<li className={activeTab === 'help' ? 'active' : ''} onClick={() => { setActiveTab('help'); setIsMobileMenuOpen(false); }}>❓ Help</li>
```

```javascript
<li className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}>⚙️ Settings</li>
```

```javascript
<div className="user-profile" style={{ cursor: 'pointer' }} onClick={() => setShowProfile(true)}>
```

```javascript
<button className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
```

```javascript
onFocus={() => searchQuery.length >= 2 && setIsSearchActive(true)}
```

```javascript
<button onClick={() => setIsSearchActive(false)} className="close-search">×</button>
```

```javascript
{searchResults.orders.map(order => (
```

```javascript
<div key={order.id} className="result-item" onClick={() => { setActiveTab('orderlist'); setIsSearchActive(false); }}>
```

```javascript
{searchResults.skus.map(sku => (
```

```javascript
<div key={sku.code} className="result-item" onClick={() => { setActiveTab('inventory'); setIsSearchActive(false); }}>
```

```javascript
<button className="btn-primary glass-hover" onClick={() => setShowQuickOrder(true)}>+ New Order</button>
```

```javascript
<div className="notifications glass" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setShowNotifications(true)}>
```

```javascript
}} onClick={() => setShowQuickOrder(false)}>
```

```javascript
<div style={{ maxWidth: '700px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
```

```javascript
<QuickOrderForm onClose={() => setShowQuickOrder(false)} />
```

```javascript
<NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
```

```javascript
{showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
```

```javascript
{showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
```

## [BridgeFunctions.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/catalyst/BridgeFunctions.js)
> Bridge Functions - Catalyst Backend
  API gateway functions for frontend-backend communication

```javascript
/**
* Bridge Functions - Catalyst Backend
* API gateway functions for frontend-backend communication
*/
export const createOrder = async (orderData) => {
```

```javascript
export const updateOrderStatus = async (orderId, newStatus) => {
```

```javascript
export const getOrder = async (orderId) => {
```

```javascript
export const updateInventory = async (productId, quantity) => {
```

```javascript
export const getInventory = async (productId) => {
```

```javascript
export const createCustomer = async (customerData) => {
```

```javascript
export const getCustomer = async (customerId) => {
```

```javascript
const logActivity = async (action, resourceId, details = {}) => {
```

```javascript
export const getOrderAnalytics = async (dateRange) => {
```

```javascript
export const sendNotification = async (userId, notification) => {
```

## [sdk.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/catalyst/sdk.js)
> No summary available.

```javascript
export const catalyst = {
```

```javascript
datastore: () => ({
```

```javascript
table: (name) => ({
```

```javascript
getFile: () => console.log(`Fetching from ${name}...`),
```

```javascript
insertRow: (data) => console.log(`Inserting into ${name}:`, data),
```

```javascript
auth: () => ({
```

```javascript
signIn: () => console.log('Initiating Zoho SSO...'),
```

## [zohoIntegration.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/catalyst/zohoIntegration.js)
> Zoho Catalyst Integration
  Backend functions for Zoho Creator and Catalyst integration
  Handles API calls, data syncing, and business logic

```javascript
/**
* Zoho Catalyst Integration
* Backend functions for Zoho Creator and Catalyst integration
* Handles API calls, data syncing, and business logic
*/
/**
* Create a new order in Zoho Creator
*/
export const createOrderInZoho = async (orderData) => {
```

```javascript
/**
* Update existing order in Zoho Creator
*/
export const updateOrderInZoho = async (rowId, orderData) => {
```

```javascript
/**
* Fetch orders from Zoho Creator
*/
export const fetchOrdersFromZoho = async (filters = {}) => {
```

```javascript
/**
* Sync orders between local state and Zoho
*/
export const syncOrdersToZoho = async (localOrders) => {
```

```javascript
/**
* Fetch inventory from Zoho CRM
*/
export const fetchInventoryFromZohoCRM = async () => {
```

```javascript
/**
* Log activity to Zoho Creator activity table
*/
export const logActivityToZoho = async (activity) => {
```

```javascript
/**
* Fetch analytics/metrics from Zoho
*/
export const fetchAnalyticsFromZoho = async (dateRange = {}) => {
```

```javascript
/**
* Aggregate raw order data into analytics
*/
const aggregateAnalyticsData = (orders) => {
```

```javascript
orders.forEach(order => {
```

```javascript
order.items.forEach(item => {
```

```javascript
/**
* Validate Zoho connection
*/
export const validateZohoConnection = async () => {
```

## [ActivityLog.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Activity/ActivityLog.jsx)
> No summary available.

```javascript
const ActivityLog = () => {
```

```javascript
useEffect(() => {
```

```javascript
const fetchActivities = () => {
```

```javascript
const generateFromOrders = () => {
```

```javascript
orders.forEach(order => {
```

```javascript
return generated.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
```

```javascript
const getActivityIcon = (type) => {
```

```javascript
const getActivityColor = (type) => {
```

```javascript
onChange={(e) => setSearchQuery(e.target.value)}
```

```javascript
onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
```

```javascript
onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
```

```javascript
onClick={() => {
```

```javascript
{filterOptions.map(f => (
```

```javascript
onClick={() => setFilter(f.key)}
```

```javascript
{activities.slice(0, 50).map((activity, idx) => (
```

```javascript
{Object.entries(activity.details).slice(0, 3).map(([key, value]) => (
```

```javascript
{activities.filter(a => a.type === ACTIVITY_TYPES.ORDER_CREATE).length}
```

```javascript
{activities.filter(a => a.type === ACTIVITY_TYPES.CARRIER_ASSIGN).length}
```

```javascript
{activities.filter(a => a.type === ACTIVITY_TYPES.LABEL_GENERATE).length}
```

```javascript
{activities.filter(a => a.type === ACTIVITY_TYPES.ORDER_STATUS_CHANGE).length}
```

## [LoginPage.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Auth/LoginPage.jsx)
> No summary available.

```javascript
const LoginPage = () => {
```

```javascript
const handleSubmit = async (e) => {
```

```javascript
const fillDemo = (account) => {
```

```javascript
onChange={(e) => setEmail(e.target.value)}
```

```javascript
onChange={(e) => setPassword(e.target.value)}
```

```javascript
onClick={() => setShowPassword(!showPassword)}
```

```javascript
{demoAccounts.map(acc => (
```

```javascript
onClick={() => fillDemo(acc)}
```

## [UserProfile.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Auth/UserProfile.jsx)
> No summary available.

```javascript
const UserProfile = ({ onClose }) => {
```

```javascript
const getRoleBadgeColor = (role) => {
```

```javascript
.filter(([key, value]) => value === true)
```

```javascript
.map(([key]) => key.replace('can', '').replace(/([A-Z])/g, ' $1').trim());
```

```javascript
{permissionsList.map(perm => (
```

## [AmazonMapper.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Automation/AmazonMapper.jsx)
> No summary available.

```javascript
const AmazonMapper = () => {
```

```javascript
const handleFileUpload = (e) => {
```

```javascript
complete: (results) => {
```

```javascript
const transformed = rawData.map(row => ({
```

```javascript
setOrders(prev => [...transformed, ...prev]);
```

```javascript
error: (err) => {
```

```javascript
{orders.filter(o => o.source === 'Amazon' || o.status === 'Imported').map(order => (
```

## [ChannelSelector.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Automation/ChannelSelector.jsx)
> No summary available.

```javascript
const ChannelSelector = ({ onSelect, selectedChannel }) => {
```

```javascript
{CHANNELS.map(channel => (
```

```javascript
onClick={() => onSelect(channel.id)}
```

## [UniversalImporter.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Automation/UniversalImporter.jsx)
> No summary available.

```javascript
const UniversalImporter = () => {
```

```javascript
const handleFileUpload = (e) => {
```

```javascript
complete: (results) => {
```

```javascript
const transformed = rawData.map(row => ({
```

```javascript
setOrders(prev => [...transformed, ...prev]);
```

```javascript
error: (err) => {
```

```javascript
const importedOrders = orders.filter(o => o.status === 'Imported' || o.source);
```

```javascript
onClick={() => { setSelectedChannel(null); setStats(null); }}
```

```javascript
{importedOrders.slice(0, 6).map(order => (
```

## [CODReconciliation.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Commercial/CODReconciliation.jsx)
> No summary available.

```javascript
const CODReconciliation = () => {
```

```javascript
.filter(order => order.amount > 0) // Simplified filter for COD orders (in reality would check payment_mode)
```

```javascript
.map(order => {
```

```javascript
const totalCollected = codRemittances.reduce((sum, c) => sum + c.codAmount, 0);
```

```javascript
const pendingAmount = codRemittances.filter(c => c.status !== 'Remitted').reduce((sum, c) => sum + c.codAmount, 0);
```

```javascript
const overdueAmount = codRemittances.filter(c => c.status === 'Overdue').reduce((sum, c) => sum + c.codAmount, 0);
```

```javascript
const filteredRemittances = codRemittances.filter(c => {
```

```javascript
const getStatusColor = (status) => {
```

```javascript
{['all', 'collected', 'pending', 'remitted', 'overdue'].map(f => (
```

```javascript
onClick={() => setFilter(f)}
```

```javascript
{filteredRemittances.map(cod => (
```

## [CommercialHub.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Commercial/CommercialHub.jsx)
> No summary available.

```javascript
const PricingSimulator = ({ sku, getSKUProfitability }) => {
```

```javascript
onChange={(e) => setSimPrice(parseInt(e.target.value))}
```

```javascript
const CommercialHub = () => {
```

```javascript
const parents = useMemo(() => skuMaster.filter(s => s.isParent), [skuMaster]);
```

```javascript
const children = useMemo(() => skuMaster.filter(s => !s.isParent), [skuMaster]);
```

```javascript
const categories = useMemo(() => ['All', ...new Set(parents.map(p => p.category))], [parents]);
```

```javascript
: parents.filter(p => p.category === selectedCategory);
```

```javascript
{categories.map(cat => (
```

```javascript
onClick={() => setSelectedCategory(cat)}
```

```javascript
{filteredParents.map(parent => (
```

```javascript
{children.filter(c => c.parentSku === parent.sku).map(child => {
```

```javascript
onClick={() => setSelectedSkuForSim(child)}
```

```javascript
{filteredParents.slice(0, 5).map(p => (
```

## [FinancialCenter.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Commercial/FinancialCenter.jsx)
> No summary available.

```javascript
const FinancialCenter = () => {
```

```javascript
const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
```

```javascript
onClick={() => setSelectedView('overview')}
```

```javascript
onClick={() => setSelectedView('settlements')}
```

```javascript
onClick={() => setSelectedView('audit')}
```

```javascript
orders.slice(0, 8).map(order => {
```

```javascript
orders.slice(0, 10).map(order => {
```

```javascript
settlements.map(set => (
```

## [GlobalLedger.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Commercial/GlobalLedger.jsx)
> No summary available.

```javascript
const GlobalLedger = () => {
```

```javascript
const totals = orders.reduce((acc, order) => {
```

```javascript
onChange={(e) => setTargetCurrency(e.target.value)}
```

```javascript
{Object.keys(CURRENCY_DATABASE).map(code => (
```

```javascript
{orders.slice(0, 10).map(order => (
```

## [InvoiceGenerator.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Commercial/InvoiceGenerator.jsx)
> No summary available.

```javascript
const InvoiceGenerator = () => {
```

```javascript
const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.total, 0);
```

```javascript
const totalGST = mockInvoices.reduce((sum, inv) => sum + inv.gstAmount, 0);
```

```javascript
const generateInvoicePDF = (invoice) => {
```

```javascript
const generateEwayBill = (invoice) => {
```

```javascript
{mockInvoices.filter(i => i.status === 'Pending').length}
```

```javascript
{mockInvoices.map(invoice => (
```

```javascript
onClick={() => setSelectedOrder(invoice)}
```

```javascript
onClick={() => generateInvoicePDF(invoice)}
```

```javascript
onClick={() => generateEwayBill(invoice)}
```

```javascript
}} onClick={() => setSelectedOrder(null)}>
```

```javascript
}} onClick={(e) => e.stopPropagation()}>
```

```javascript
{selectedOrder.items.map((item, idx) => (
```

```javascript
onClick={() => { generateInvoicePDF(selectedOrder); setSelectedOrder(null); }}
```

## [MarginGuard.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Commercial/MarginGuard.jsx)
> No summary available.

```javascript
const MarginGuard = () => {
```

```javascript
const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
```

```javascript
flaggedOrders.map(order => (
```

```javascript
<button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => resolveFlag(order.id)}>Approve Exception</button>
```

```javascript
{formatINR(flaggedOrders.reduce((sum, o) => sum + o.amount, 0))}
```

## [PricingHeatmap.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Commercial/PricingHeatmap.jsx)
> No summary available.

```javascript
const PricingHeatmap = () => {
```

```javascript
.filter(s => !s.isParent)
```

```javascript
.map(child => {
```

```javascript
const CustomTooltip = ({ active, payload, label }) => {
```

```javascript
{data.map((entry, index) => (
```

```javascript
{data.map((entry, index) => (
```

## [SKUMaster.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Commercial/SKUMaster.jsx)
> No summary available.

```javascript
const SKUMaster = () => {
```

```javascript
.filter(sku => !sku.isParent) // Only show sellable child products
```

```javascript
.filter(sku =>
```

```javascript
const renderProfitMetric = (label, value, color = 'var(--text)') => (
```

```javascript
onChange={(e) => setSearchTerm(e.target.value)}
```

```javascript
{filteredSKUs.map((sku, idx) => {
```

```javascript
{(() => {
```

```javascript
onClick={() => setSelectedSKU(enhancedSku)}
```

```javascript
<button className="btn-icon" onClick={() => setSelectedSKU(null)}>✕</button>
```

```javascript
{(() => {
```

```javascript
<button className="btn-primary" onClick={() => setSelectedSKU(null)}>Close Insight</button>
```

## [WhatsAppTemplateManager.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Commercial/WhatsAppTemplateManager.jsx)
> WhatsAppTemplateManager Component
  Manages WhatsApp message templates for bulk messaging

```javascript
/**
* WhatsAppTemplateManager Component
* Manages WhatsApp message templates for bulk messaging
*/
const WhatsAppTemplateManager = () => {
```

```javascript
const handleSaveTemplate = async () => {
```

```javascript
? templates.map(t => t.id === currentTemplate.id ? currentTemplate : t)
```

```javascript
const handleDeleteTemplate = (id) => {
```

```javascript
setTemplates(templates.filter(t => t.id !== id));
```

```javascript
const handleEditTemplate = (template) => {
```

```javascript
onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
```

```javascript
onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
```

```javascript
onClick={() => { setCurrentTemplate({ name: '', body: '' }); setIsEditing(false); }}
```

```javascript
templates.map(template => (
```

```javascript
onClick={() => handleEditTemplate(template)}
```

```javascript
onClick={() => handleDeleteTemplate(template.id)}
```

## [CustomerAnalytics.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Customers/CustomerAnalytics.jsx)
> No summary available.

```javascript
const CustomerAnalytics = () => {
```

```javascript
const analysis = useMemo(() => {
```

```javascript
customerMaster.forEach(c => {
```

```javascript
const segmentData = Object.keys(segments).map(name => ({ name, value: segments[name] }));
```

```javascript
const ltvData = Object.keys(ltvBySegment).map(name => ({ name, ltv: Math.round(ltvBySegment[name]) }));
```

```javascript
topCustomers.sort((a, b) => b.ltv - a.ltv);
```

```javascript
{analysis.segmentData.map((entry, index) => (
```

```javascript
{analysis.ltvData.map((entry, index) => (
```

```javascript
{analysis.top5.map((c, i) => (
```

## [CustomerLookup.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Customers/CustomerLookup.jsx)
> No summary available.

```javascript
const CustomerLookup = () => {
```

```javascript
const filteredCustomers = useMemo(() => {
```

```javascript
let customers = customerMaster?.map(c => ({
```

```javascript
customers = customers.filter(c => c.churn.riskLevel === 'HIGH' || c.churn.riskLevel === 'CRITICAL');
```

```javascript
customers = customers.filter(c =>
```

```javascript
const sendReactivationMessage = async (customer) => {
```

```javascript
onChange={(e) => setSearchTerm(e.target.value)}
```

```javascript
onClick={() => setShowAtRiskOnly(!showAtRiskOnly)}
```

```javascript
{filteredCustomers.map((customer, idx) => {
```

```javascript
onClick={() => setSelectedCustomer(customer)}
```

```javascript
onClick={(e) => { e.stopPropagation(); sendReactivationMessage(customer); }}
```

```javascript
{selectedCustomer && (() => {
```

```javascript
onClick={() => setSelectedCustomer(null)}
```

```javascript
{metrics.orders.map(order => (
```

## [AnalyticsCharts.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dashboard/AnalyticsCharts.jsx)
> AnalyticsCharts Component
  Displays analytics data with charts and KPI metrics

```javascript
/**
* AnalyticsCharts Component
* Displays analytics data with charts and KPI metrics
*/
const AnalyticsCharts = ({ dateRange = 7 }) => {
```

```javascript
useEffect(() => {
```

```javascript
const loadAnalytics = async () => {
```

```javascript
].map((kpi, idx) => (
```

```javascript
{trend.dataPoints?.slice(0, 7).map((point, idx) => (
```

## [AnalyticsDashboard.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dashboard/AnalyticsDashboard.jsx)
> No summary available.

```javascript
const AnalyticsDashboard = () => {
```

```javascript
const vendors = useMemo(() => vendorService.getVendors(), []);
```

```javascript
const arrivalPredictions = useMemo(() => {
```

```javascript
return skuMaster.slice(0, 5).map(sku => ({
```

```javascript
{ name: 'Imported', value: orders.filter(o => o?.status === 'Imported').length || 3 },
```

```javascript
{ name: 'Processing', value: orders.filter(o => o?.status === 'Processing' || o?.status === 'MTP-Applied').length || 2 },
```

```javascript
{ name: 'In-Transit', value: orders.filter(o => o?.status === 'In-Transit').length || 5 },
```

```javascript
{ name: 'Delivered', value: orders.filter(o => o?.status === 'Delivered').length || 8 }
```

```javascript
const carrierData = (logistics || []).map(c => ({
```

```javascript
{arrivalPredictions.map(pred => (
```

```javascript
{statusData.map((entry, index) => (
```

```javascript
<h2 style={{ color: 'var(--success)' }}>{logistics.filter(l => l.active).length}</h2>
```

## [AnalyticsEnhanced.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dashboard/AnalyticsEnhanced.jsx)
> AnalyticsEnhanced.jsx
  Advanced analytics dashboard for Bluewud OTS
  Real-time metrics, trends, and business insights

```javascript
/**
* AnalyticsEnhanced.jsx
* Advanced analytics dashboard for Bluewud OTS
* Real-time metrics, trends, and business insights
*/
const AnalyticsEnhanced = ({ timeRange = '7days' }) => {
```

```javascript
useEffect(() => {
```

```javascript
const fetchMetrics = async () => {
```

```javascript
const formatNumber = (num) => {
```

```javascript
const formatCurrency = (num) => {
```

```javascript
{['7days', '30days', '90days', 'yearly'].map(range => (
```

```javascript
onClick={() => setSelectedRange(range)}
```

```javascript
{metrics?.topChannels?.map((channel, i) => (
```

## [DashboardMetrics.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dashboard/DashboardMetrics.jsx)
> DashboardMetrics Component
  Displays KPI cards, trend indicators, and forecast data
  Integrates analyticsService for real-time metrics

```javascript
/**
* DashboardMetrics Component
* Displays KPI cards, trend indicators, and forecast data
* Integrates analyticsService for real-time metrics
*/
export const DashboardMetrics = ({ orders = [] }) => {
```

```javascript
useEffect(() => {
```

```javascript
{[1, 2, 3, 4].map(i => (
```

```javascript
const MetricCard = ({ icon: Icon, title, value, subtitle, trend: trendValue, color = 'blue' }) => (
```

```javascript
{forecast.slice(0, 7).map((day, idx) => (
```

```javascript
style={{ width: `${Math.min((day.predictedVolume / Math.max(...forecast.map(f => f.predictedVolume), 100)) * 100, 100)}%` }}
```

## [DemandForecast.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dashboard/DemandForecast.jsx)
> No summary available.

```javascript
const DemandForecast = () => {
```

```javascript
const data = useMemo(() => {
```

```javascript
tickFormatter={(str) => {
```

## [MLAnalyticsDashboard.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dashboard/MLAnalyticsDashboard.jsx)
> No summary available.

```javascript
const MLAnalyticsDashboard = () => {
```

```javascript
const analysis = useMemo(() => {
```

```javascript
const stockOut = useMemo(() => {
```

```javascript
onChange={e => setSelectedSKU(e.target.value)}
```

```javascript
{skuMaster.map(s => <option key={s.sku} value={s.sku}>{s.name} ({s.sku})</option>)}
```

```javascript
...analysis.history.map(h => ({ ...h, type: 'actual', isHistorical: true })),
```

```javascript
...analysis.forecast.map(f => ({ ...f, type: 'forecast', isHistorical: false }))
```

```javascript
const getUrgencyColor = (urgency) => {
```

```javascript
onClick={() => setViewMode('forecast')}
```

```javascript
onClick={() => setViewMode('decomposition')}
```

```javascript
onChange={e => setSelectedSKU(e.target.value)}
```

```javascript
{skuMaster.map(s => <option key={s.sku} value={s.sku}>{s.name}</option>)}
```

```javascript
<ComposedChart data={chartData.filter(d => !d.isHistorical)} margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
```

## [PerformanceMetrics.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dashboard/PerformanceMetrics.jsx)
> No summary available.

```javascript
const PerformanceMetrics = () => {
```

```javascript
const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
```

```javascript
const inTransit = orders.filter(o => o.status === 'In-Transit').length;
```

```javascript
const pending = orders.filter(o => o.status === 'Imported' || o.status === 'MTP-Applied').length;
```

```javascript
const rtoCount = orders.filter(o => o.status?.startsWith('RTO')).length;
```

```javascript
const sourceDistribution = orders.reduce((acc, o) => {
```

```javascript
? (orders.reduce((sum, o) => sum + (o.weight || 0), 0) / orders.length).toFixed(1)
```

```javascript
{metrics.map((m, idx) => (
```

```javascript
{Object.entries(sourceDistribution).sort((a, b) => b[1] - a[1]).map(([source, count], idx) => (
```

## [PredictiveAnalytics.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dashboard/PredictiveAnalytics.jsx)
> No summary available.

```javascript
const PredictiveAnalytics = () => {
```

```javascript
const trend = useMemo(() => getTrend(15), [getTrend, orders]);
```

```javascript
const revenueProjection = useMemo(() => getRevenueProjection(30), [getRevenueProjection, orders]);
```

```javascript
const chartData = useMemo(() => {
```

```javascript
return trend.trendLine.map(item => ({
```

```javascript
actual: orders?.filter(o => o.createdAt?.startsWith(item.date)).length || 0
```

## [DealerLookup.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dealers/DealerLookup.jsx)
> No summary available.

```javascript
const DealerLookup = () => {
```

```javascript
const filteredDealers = MOCK_DEALERS.filter(dealer => {
```

```javascript
const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
```

```javascript
onBack={() => setIsCreatingOrder(false)}
```

```javascript
onComplete={() => {
```

```javascript
onChange={(e) => setSearchTerm(e.target.value)}
```

```javascript
onChange={(e) => setFilterType(e.target.value)}
```

```javascript
{filteredDealers.map(dealer => (
```

```javascript
onClick={() => setSelectedDealer(dealer)}
```

```javascript
onClick={() => setIsCreatingOrder(true)}
```

## [DealerOrderEntry.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dealers/DealerOrderEntry.jsx)
> DealerOrderEntry Component
  A specialized form for placing B2B wholesale orders.
  Handles quantity-based tiered pricing and credit limit validation.

```javascript
/**
* DealerOrderEntry Component
* A specialized form for placing B2B wholesale orders.
* Handles quantity-based tiered pricing and credit limit validation.
*/
const DealerOrderEntry = ({ dealer, onBack, onComplete }) => {
```

```javascript
const availableSkus = skuMaster.filter(s => !s.isParent);
```

```javascript
useEffect(() => {
```

```javascript
const sku = availableSkus.find(s => s.sku === selectedSku);
```

```javascript
const handleSubmit = async (e) => {
```

```javascript
setTimeout(() => onComplete(), 2000);
```

```javascript
onChange={(e) => setSelectedSku(e.target.value)}
```

```javascript
{availableSkus.map(s => (
```

```javascript
onChange={(e) => setQuantity(e.target.value)}
```

## [DealerPortal.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Dealers/DealerPortal.jsx)
> No summary available.

```javascript
const DealerPortal = () => {
```

```javascript
const dealerOrders = useMemo(() => {
```

```javascript
return orders.filter(o => o.dealerId === user.id);
```

```javascript
const stats = useMemo(() => {
```

```javascript
.filter(o => {
```

```javascript
.reduce((sum, o) => sum + o.amount, 0);
```

```javascript
onBack={() => setView('dashboard')}
```

```javascript
onComplete={() => setView('dashboard')}
```

```javascript
<div className="glass p-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setView('order')}>
```

```javascript
{dealerOrders.map(o => (
```

## [ErrorBoundary.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/ErrorBoundary.jsx)
> ErrorBoundary Component
  Catches JavaScript errors in child components and displays fallback UI
  Integrates with errorHandlerService for error logging and recovery suggestions

```javascript
/**
* ErrorBoundary Component
* Catches JavaScript errors in child components and displays fallback UI
* Integrates with errorHandlerService for error logging and recovery suggestions
*/
class ErrorBoundary extends React.Component {
```

```javascript
handleReset = () => {
```

```javascript
{this.state.recoveryHints.map((hint, idx) => (
```

## [HelpCenter.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Help/HelpCenter.jsx)
> No summary available.

```javascript
const HelpCenter = () => {
```

```javascript
const renderContent = () => {
```

```javascript
{shortcuts.map((s, idx) => (
```

```javascript
{s.keys.map((key, i) => (
```

```javascript
{faqs.map((faq, idx) => (
```

```javascript
{sections.map(s => (
```

```javascript
onClick={() => setActiveSection(s.id)}
```

## [KeyboardShortcutsHud.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Help/KeyboardShortcutsHud.jsx)
> KeyboardShortcutsHud Component
  Displays available keyboard shortcuts in a floating HUD

```javascript
/**
* KeyboardShortcutsHud Component
* Displays available keyboard shortcuts in a floating HUD
*/
const KeyboardShortcutsHud = () => {
```

```javascript
useEffect(() => {
```

```javascript
const getShortcuts = async () => {
```

```javascript
const handleKeyPress = (e) => {
```

```javascript
return () => window.removeEventListener('keydown', handleKeyPress);
```

```javascript
onClick={() => setIsVisible(!isVisible)}
```

```javascript
onClick={() => setIsVisible(false)}
```

```javascript
shortcuts.map((shortcut, idx) => (
```

## [ShortcutsModal.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Help/ShortcutsModal.jsx)
> No summary available.

```javascript
const ShortcutsModal = ({ onClose }) => {
```

```javascript
}} onClick={(e) => e.stopPropagation()}>
```

```javascript
{shortcuts.map((s, idx) => (
```

## [OrderImport.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Import/OrderImport.jsx)
> No summary available.

```javascript
const OrderImport = () => {
```

```javascript
const parseCSV = (content) => {
```

```javascript
const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
```

```javascript
const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
```

```javascript
headers.forEach((header, idx) => {
```

```javascript
const handleFileUpload = (event) => {
```

```javascript
reader.onload = (e) => {
```

```javascript
const normalized = records.map(raw => normalizeOrder(raw, selectedSource));
```

```javascript
const validationResults = normalized.map(order => ({
```

```javascript
const executeImport = async () => {
```

```javascript
.filter(r => r.validation.valid)
```

```javascript
.map(r => r.order);
```

```javascript
await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
```

```javascript
const downloadTemplate = () => {
```

```javascript
onClick={() => setImportStatus(null)}
```

```javascript
{errors.map((err, i) => (
```

```javascript
{sources.map(source => (
```

```javascript
onClick={() => setSelectedSource(source.id)}
```

```javascript
<h4>📋 Preview ({previewData.filter(r => r.validation.valid).length} valid / {previewData.length} total)</h4>
```

```javascript
disabled={isProcessing || previewData.filter(r => r.validation.valid).length === 0}
```

```javascript
{isProcessing ? '⏳ Importing...' : `✅ Import ${previewData.filter(r => r.validation.valid).length} Orders`}
```

```javascript
{previewData.slice(0, 20).map((row, idx) => (
```

```javascript
{orders.filter(o => o.source === 'Amazon').length}
```

```javascript
{orders.filter(o => o.source === 'Flipkart').length}
```

```javascript
{orders.filter(o => !['Amazon', 'Flipkart', 'Shopify'].includes(o.source)).length}
```

## [CarrierPerformance.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Logistics/CarrierPerformance.jsx)
> No summary available.

```javascript
const CarrierPerformance = () => {
```

```javascript
const pieData = carrierData.map(c => ({ name: c.name, value: c.totalShipments }));
```

```javascript
{carrierData.map((carrier, idx) => (
```

```javascript
{pieData.map((entry, index) => (
```

```javascript
{carrierData.map((c, idx) => (
```

## [CarrierSelection.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Logistics/CarrierSelection.jsx)
> No summary available.

```javascript
const CarrierSelection = () => {
```

```javascript
const pendingAssignment = orders.filter(o =>
```

```javascript
const handleAssignCarrier = (order, carrier) => {
```

```javascript
const updateShipment = (field, value) => {
```

```javascript
setShipment(prev => ({ ...prev, [field]: value }));
```

```javascript
onChange={(e) => updateShipment('weight', parseFloat(e.target.value) || 0.5)}
```

```javascript
onChange={(e) => updateShipment('state', e.target.value)}
```

```javascript
{Object.keys(STATE_CODES).map(state => (
```

```javascript
onChange={(e) => updateShipment('city', e.target.value)}
```

```javascript
<input type="radio" checked={!shipment.isCOD} onChange={() => updateShipment('isCOD', false)} />
```

```javascript
<input type="radio" checked={shipment.isCOD} onChange={() => updateShipment('isCOD', true)} />
```

```javascript
onChange={(e) => updateShipment('codAmount', parseFloat(e.target.value) || 0)}
```

```javascript
onChange={(e) => setPriority(e.target.value)}
```

```javascript
{rates.map((rate, idx) => (
```

```javascript
{pendingAssignment.slice(0, 6).map(order => (
```

```javascript
onClick={() => {
```

## [CarrierSelector.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Logistics/CarrierSelector.jsx)
> CarrierSelector Component
  Allows users to select carriers with real-time performance metrics
  Integrates with carrierOptimizer for intelligent selection

```javascript
/**
* CarrierSelector Component
* Allows users to select carriers with real-time performance metrics
* Integrates with carrierOptimizer for intelligent selection
*/
const CarrierSelector = ({ orderId, destination, weight, callback }) => {
```

```javascript
useEffect(() => {
```

```javascript
const loadCarriers = async () => {
```

```javascript
const handleSelect = async (carrier) => {
```

```javascript
{carriers.map(carrier => (
```

```javascript
onClick={() => handleSelect(carrier)}
```

## [InternationalShipping.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Logistics/InternationalShipping.jsx)
> No summary available.

```javascript
const InternationalShipping = () => {
```

```javascript
const fetchRates = () => {
```

```javascript
const handleBooking = async () => {
```

```javascript
onChange={(e) => setCountry(e.target.value)}
```

```javascript
{countries.map(c => <option key={c} value={c}>{c}</option>)}
```

```javascript
onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
```

```javascript
{rates.map((rate, idx) => (
```

```javascript
onClick={() => setSelectedRate(rate)}
```

## [ZoneMap.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Logistics/ZoneMap.jsx)
> No summary available.

```javascript
const ZoneMap = () => {
```

```javascript
const getZoneForState = (state) => {
```

```javascript
const zoneStats = Object.keys(INDIA_ZONES).reduce((acc, zone) => {
```

```javascript
total: orders.filter(o => getZoneForState(o.state) === zone).length,
```

```javascript
delivered: orders.filter(o => getZoneForState(o.state) === zone && o.status === 'Delivered').length,
```

```javascript
inTransit: orders.filter(o => getZoneForState(o.state) === zone && o.status === 'In-Transit').length
```

```javascript
const topStates = orders.reduce((acc, order) => {
```

```javascript
const sortedStates = Object.entries(topStates).sort((a, b) => b[1] - a[1]).slice(0, 5);
```

```javascript
{Object.entries(INDIA_ZONES).map(([zone, data]) => (
```

```javascript
{sortedStates.map(([state, count], idx) => (
```

```javascript
{Object.entries(INDIA_ZONES).map(([zone, data]) => (
```

## [MarketingCenter.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Marketing/MarketingCenter.jsx)
> No summary available.

```javascript
const MarketingCenter = () => {
```

```javascript
const segmentedData = useMemo(() => {
```

```javascript
customerMaster.forEach(customer => {
```

```javascript
const stats = useMemo(() => {
```

```javascript
return Object.keys(segmentedData).map(key => ({
```

```javascript
revenue: segmentedData[key].reduce((sum, c) => sum + c.totalSpend, 0)
```

```javascript
const handleExport = (segment) => {
```

```javascript
data.map(c => `"${c.name}","${c.phone}","${c.email}",${c.totalSpend},${c.orderCount}`).join("\n");
```

```javascript
{stats.map(s => (
```

```javascript
{Object.keys(segmentedData).map(segment => (
```

```javascript
onClick={() => handleExport(segment)}
```

```javascript
segmentedData[segment].slice(0, 5).map(c => (
```

## [WhatsAppTemplateManager.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Marketing/WhatsAppTemplateManager.jsx)
> WhatsAppTemplateManager Component
  Manages WhatsApp message templates for bulk messaging

```javascript
/**
* WhatsAppTemplateManager Component
* Manages WhatsApp message templates for bulk messaging
*/
const WhatsAppTemplateManager = () => {
```

```javascript
const handleSaveTemplate = async () => {
```

```javascript
? templates.map(t => t.id === currentTemplate.id ? currentTemplate : t)
```

```javascript
const handleDeleteTemplate = (id) => {
```

```javascript
setTemplates(templates.filter(t => t.id !== id));
```

```javascript
const handleEditTemplate = (template) => {
```

```javascript
onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
```

```javascript
onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
```

```javascript
onClick={() => { setCurrentTemplate({ name: '', body: '' }); setIsEditing(false); }}
```

```javascript
templates.map(template => (
```

```javascript
onClick={() => handleEditTemplate(template)}
```

```javascript
onClick={() => handleDeleteTemplate(template.id)}
```

## [KeyboardShortcutsHud.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Navigation/KeyboardShortcutsHud.jsx)
> KeyboardShortcutsHud Component
  Displays available keyboard shortcuts in a floating HUD

```javascript
/**
* KeyboardShortcutsHud Component
* Displays available keyboard shortcuts in a floating HUD
*/
const KeyboardShortcutsHud = () => {
```

```javascript
useEffect(() => {
```

```javascript
const getShortcuts = async () => {
```

```javascript
const handleKeyPress = (e) => {
```

```javascript
return () => window.removeEventListener('keydown', handleKeyPress);
```

```javascript
onClick={() => setIsVisible(!isVisible)}
```

```javascript
onClick={() => setIsVisible(false)}
```

```javascript
shortcuts.map((shortcut, idx) => (
```

## [MobileBottomNav.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Navigation/MobileBottomNav.jsx)
> No summary available.

```javascript
const MobileBottomNav = ({ activeTab, onTabChange, notificationCount = 0 }) => {
```

```javascript
const handleTap = (id) => {
```

```javascript
{navItems.map((item) => (
```

```javascript
onClick={() => handleTap(item.id)}
```

## [NotificationCenter.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Notifications/NotificationCenter.jsx)
> No summary available.

```javascript
const NotificationCenter = ({ isOpen, onClose }) => {
```

```javascript
useEffect(() => {
```

```javascript
const refreshNotifications = () => {
```

```javascript
const unsubscribe = subscribe((newNotif) => {
```

```javascript
setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);
```

```javascript
return () => unsubscribe();
```

```javascript
const seedDemoNotifications = () => {
```

```javascript
const handleMarkAsRead = (id) => {
```

```javascript
setNotifications(prev => prev.map(n =>
```

```javascript
const handleMarkAllRead = () => {
```

```javascript
setNotifications(prev => prev.map(n => ({ ...n, read: true })));
```

```javascript
const filteredNotifications = notifications.filter(n => {
```

```javascript
const getTypeColor = (type, priority) => {
```

```javascript
].map(f => (
```

```javascript
onClick={() => setFilter(f.key)}
```

```javascript
filteredNotifications.map(notif => (
```

```javascript
onClick={() => handleMarkAsRead(notif.id)}
```

```javascript
onClick={(e) => {
```

```javascript
onClick={() => {
```

## [NotificationHub.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Notifications/NotificationHub.jsx)
> NotificationHub - Unified Notification Center
  Consolidates WhatsApp, Push, and System alerts in one premium UI.

```javascript
/**
* NotificationHub - Unified Notification Center
* Consolidates WhatsApp, Push, and System alerts in one premium UI.
*/
const NotificationHub = ({ isOpen, onClose }) => {
```

```javascript
useEffect(() => {
```

```javascript
const refreshNotifications = () => {
```

```javascript
const unsubscribe = subscribe((newNotif) => {
```

```javascript
setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);
```

```javascript
return () => unsubscribe();
```

```javascript
const seedDemoNotifications = () => {
```

```javascript
const handleMarkAsRead = (id) => {
```

```javascript
setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
```

```javascript
const handleMarkAllRead = () => {
```

```javascript
setNotifications(prev => prev.map(n => ({ ...n, read: true })));
```

```javascript
const filteredNotifications = useMemo(() => {
```

```javascript
return notifications.filter(n => {
```

```javascript
const getTypeColor = (type, priority) => {
```

```javascript
{Object.values(CHANNELS).map(channel => (
```

```javascript
onClick={() => setActiveChannel(channel.key)}
```

```javascript
filteredNotifications.map(notif => (
```

```javascript
onClick={() => handleMarkAsRead(notif.id)}
```

## [OrderNotificationCenter.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Notifications/OrderNotificationCenter.jsx)
> OrderNotificationCenter Component
  Displays order notifications and integrates with push notification and offline cache services
  Shows toast-like notifications with support for multiple notification types

```javascript
/**
* OrderNotificationCenter Component
* Displays order notifications and integrates with push notification and offline cache services
* Shows toast-like notifications with support for multiple notification types
*/
const OrderNotificationCenter = () => {
```

```javascript
useEffect(() => {
```

```javascript
const loadNotifications = async () => {
```

```javascript
const handleNotification = (notification) => {
```

```javascript
setNotifications(prev => [newNotification, ...prev]);
```

```javascript
const timer = setTimeout(() => {
```

```javascript
return () => clearTimeout(timer);
```

```javascript
const dismissNotification = (id) => {
```

```javascript
setNotifications(prev => prev.filter(n => n.id !== id));
```

```javascript
const getIcon = (type) => {
```

```javascript
const getTypeStyles = (type) => {
```

```javascript
onClick={() => setIsVisible(!isVisible)}
```

```javascript
onClick={() => setIsVisible(false)}
```

```javascript
{notifications.map(notification => (
```

```javascript
onClick={() => dismissNotification(notification.id)}
```

## [BarcodeDispatcher.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Orders/BarcodeDispatcher.jsx)
> No summary available.

```javascript
const BarcodeDispatcher = () => {
```

```javascript
useEffect(() => {
```

```javascript
const onScanSuccess = async (decodedText) => {
```

```javascript
const order = orders.find(o => o.id === decodedText || o.orderId === decodedText);
```

```javascript
setScanLog(prev => [{ id: order.id, time: new Date().toLocaleTimeString(), status: 'OK' }, ...prev]);
```

```javascript
scanner.render(onScanSuccess, (err) => {
```

```javascript
return () => {
```

```javascript
scanner.clear().catch(error => console.error("Scanner Cleanup Failed:", error));
```

```javascript
const handlePrint = async (order) => {
```

```javascript
onChange={(e) => setSelectedCarrier(e.target.value)}
```

```javascript
onChange={(e) => setPrintFormat(e.target.value)}
```

```javascript
onChange={(e) => setAutoPrint(e.target.checked)}
```

```javascript
onClick={() => handlePrint(orders.find(o => o.id === lastScan.id))}
```

```javascript
{scanLog.map((log, idx) => (
```

## [BulkActions.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Orders/BulkActions.jsx)
> No summary available.

```javascript
const BulkActions = () => {
```

```javascript
const pendingOrders = orders.filter(o => o.status !== 'Delivered' && !o.status.startsWith('RTO') && o.status !== 'Cancelled');
```

```javascript
const toggleSelect = (orderId) => {
```

```javascript
setSelectedOrders(prev =>
```

```javascript
? prev.filter(id => id !== orderId)
```

```javascript
const selectAll = () => {
```

```javascript
setSelectedOrders(pendingOrders.map(o => o.id));
```

```javascript
const selectByStatus = (status) => {
```

```javascript
const filtered = pendingOrders.filter(o => o.status === status).map(o => o.id);
```

```javascript
const executeBulkAction = async () => {
```

```javascript
const ordersToPrint = orders.filter(o => selectedOrders.includes(o.id));
```

```javascript
ordersToPrint.forEach(order => generateShippingLabel(order));
```

```javascript
setResults({ successful: ordersToPrint.map(o => o.id), failed: [] });
```

```javascript
await new Promise(resolve => setTimeout(resolve, 500));
```

```javascript
setSelectedOrders(result.failed.map(f => f.orderId)); // Keep failed ones selected
```

```javascript
const getStatusColor = (status) => {
```

```javascript
const getStatusIcon = (status) => {
```

```javascript
onClick={() => setResults(null)}
```

```javascript
{results.failed.slice(0, 3).map(f => (
```

```javascript
onClick={() => selectByStatus('Pending')}
```

```javascript
onClick={() => selectByStatus('MTP-Applied')}
```

```javascript
onClick={() => selectByStatus('Carrier-Assigned')}
```

```javascript
onChange={(e) => setBulkAction(e.target.value)}
```

```javascript
{availableActions.map(action => (
```

```javascript
onChange={(e) => setActionReason(e.target.value)}
```

```javascript
{pendingOrders.map(order => (
```

```javascript
onClick={() => toggleSelect(order.id)}
```

## [OrderJourney.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Orders/OrderJourney.jsx)
> No summary available.

```javascript
const OrderJourney = ({ orderId }) => {
```

```javascript
const order = orders.find(o => o.id === orderId);
```

```javascript
const currentStageIndex = STAGES.findIndex(s => s.key === order.status);
```

```javascript
const handleGenerateLabel = (type) => {
```

```javascript
{STAGES.map((stage, idx) => {
```

```javascript
onClick={() => updateOrderStatus(orderId, stage.key)}
```

```javascript
onClick={() => setShowLabelMenu(!showLabelMenu)}
```

```javascript
onClick={() => handleGenerateLabel('packing')}
```

```javascript
onClick={() => handleGenerateLabel('thermal')}
```

## [OrderList.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Orders/OrderList.jsx)
> No summary available.

```javascript
const OrderList = () => {
```

```javascript
const filteredOrders = orders.filter(order => {
```

```javascript
const uniqueSources = [...new Set(orders.map(o => o.source).filter(Boolean))];
```

```javascript
const uniqueStatuses = [...new Set(orders.map(o => o.status).filter(Boolean))];
```

```javascript
const getStatusColor = (status) => {
```

```javascript
const toggleOrderSelection = (id) => {
```

```javascript
setSelectedOrders(prev =>
```

```javascript
prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
```

```javascript
const handleSmartAssign = async () => {
```

```javascript
const order = orders.find(o => o.id === orderId);
```

```javascript
<span className="badge" style={{ background: 'var(--success)' }}>{orders.filter(o => o.status === 'Delivered').length} Delivered</span>
```

```javascript
onClick={() => labelPrintService.printManifest(filteredOrders.filter(o => o.status === 'Ready-to-Ship'), 'Filtered Batch')}
```

```javascript
onChange={(e) => setSearchTerm(e.target.value)}
```

```javascript
onChange={(e) => setStatusFilter(e.target.value)}
```

```javascript
{uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
```

```javascript
onChange={(e) => setSourceFilter(e.target.value)}
```

```javascript
{uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
```

```javascript
<button className="btn-secondary glass-hover" style={{ padding: '12px 20px' }} onClick={() => { setSearchTerm(''); setStatusFilter('all'); setSourceFilter('all'); }}>
```

```javascript
onChange={(e) => setSelectedOrders(e.target.checked ? filteredOrders.map(o => o.id) : [])}
```

```javascript
filteredOrders.map((order, idx) => (
```

```javascript
onClick={() => setSelectedOrder(order)}
```

```javascript
onClick={(e) => e.stopPropagation()}
```

```javascript
onChange={() => toggleOrderSelection(order.id)}
```

```javascript
(() => {
```

```javascript
onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
```

```javascript
}} onClick={() => setSelectedOrder(null)}>
```

```javascript
}} onClick={(e) => e.stopPropagation()}>
```

```javascript
onClick={() => setSelectedOrder(null)}
```

```javascript
{(() => {
```

```javascript
onClick={() => alert(`Initiating manual verification call for ${selectedOrder.id}...`)}
```

```javascript
onClick={() => {
```

```javascript
onClick={() => labelPrintService.printLabel(selectedOrder)}
```

```javascript
onClick={() => {
```

```javascript
printWindow.onload = () => printWindow.print();
```

```javascript
<button className="btn-secondary glass-hover" style={{ flex: 1 }} onClick={() => setSelectedOrder(null)}>Close</button>
```

## [QuickOrderForm.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Orders/QuickOrderForm.jsx)
> No summary available.

```javascript
const QuickOrderForm = ({ onClose }) => {
```

```javascript
const currencies = useMemo(() => currencyService.getSupportedCurrencies(), []);
```

```javascript
const convertedAmount = useMemo(() => {
```

```javascript
const handleSubmit = (e) => {
```

```javascript
syncOrderToZoho(result.order).then(res => {
```

```javascript
setTimeout(() => {
```

```javascript
const handleChange = (field, value) => {
```

```javascript
setFormData(prev => ({ ...prev, [field]: value }));
```

```javascript
const sku = skuMaster.find(s => s.code === value);
```

```javascript
setFormData(prev => ({
```

```javascript
const calculateRates = () => {
```

```javascript
setFormData(prev => ({
```

```javascript
{errors.map((err, i) => (
```

```javascript
onChange={(e) => handleChange('customerName', e.target.value)}
```

```javascript
onChange={(e) => handleChange('phone', e.target.value)}
```

```javascript
onChange={(e) => handleChange('address', e.target.value)}
```

```javascript
onChange={(e) => handleChange('city', e.target.value)}
```

```javascript
onChange={(e) => handleChange('state', e.target.value)}
```

```javascript
{STATES.map(s => <option key={s} value={s}>{s}</option>)}
```

```javascript
onChange={(e) => handleChange('pincode', e.target.value)}
```

```javascript
onChange={(e) => handleChange('sku', e.target.value)}
```

```javascript
{skuMaster.map(s => (
```

```javascript
onChange={(e) => handleChange('quantity', e.target.value)}
```

```javascript
onChange={(e) => handleChange('weight', e.target.value)}
```

```javascript
onChange={(e) => handleChange('amount', e.target.value)}
```

```javascript
onChange={(e) => setSelectedCurrency(e.target.value)}
```

```javascript
{currencies.map(c => (
```

```javascript
onChange={(e) => handleChange('source', e.target.value)}
```

```javascript
onChange={() => handleChange('isCOD', false)}
```

```javascript
onChange={() => handleChange('isCOD', true)}
```

```javascript
onChange={(e) => handleChange('codAmount', e.target.value)}
```

```javascript
{shippingRates?.map((rate, i) => (
```

```javascript
onClick={() => setFormData(prev => ({ ...prev, carrierId: rate.carrierId, carrierName: rate.carrierName }))}
```

## [RTOManager.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Orders/RTOManager.jsx)
> No summary available.

```javascript
const RTOManager = () => {
```

```javascript
const rtoOrders = orders.filter(o => o.status.startsWith('RTO'));
```

```javascript
const getReasonColor = (reason) => {
```

```javascript
const totalRTOValue = rtoOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
```

```javascript
const handleAction = (orderId, action) => {
```

```javascript
{rtoOrders.filter(o => o.reason === 'Customer Refused').length}
```

```javascript
{rtoOrders.filter(o => o.reason === 'Incorrect Address').length}
```

```javascript
{rtoOrders.filter(o => o.reason === 'Damaged in Transit').length}
```

```javascript
{rtoOrders.reduce((sum, o) => sum + o.attemptCount, 0)}
```

```javascript
{rtoOrders.map(rto => (
```

```javascript
onClick={() => setSelectedRTO(selectedRTO?.id === rto.id ? null : rto)}
```

```javascript
<button className="btn-primary glass-hover" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); handleAction(rto.id, 'reattempt'); }}>
```

```javascript
<button className="btn-secondary glass-hover" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); handleAction(rto.id, 'refund'); }}>
```

```javascript
<button className="btn-secondary glass-hover" style={{ padding: '0 16px' }} onClick={(e) => { e.stopPropagation(); handleAction(rto.id, 'writeoff'); }}>
```

## [ExportTools.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Reports/ExportTools.jsx)
> No summary available.

```javascript
const ExportTools = () => {
```

```javascript
const exportToCSV = (data, filename, columns = null) => {
```

```javascript
setTimeout(() => setExportStatus(null), 3000);
```

```javascript
const exportToJSON = (data, filename) => {
```

```javascript
setTimeout(() => setExportStatus(null), 3000);
```

```javascript
const filterByDate = (data) => {
```

```javascript
return data.filter(item => {
```

```javascript
const generateInvoiceReport = () => {
```

```javascript
.filter(o => o.status === 'Delivered')
```

```javascript
.map(o => {
```

```javascript
const generateCarrierReport = () => {
```

```javascript
orders.forEach(o => {
```

```javascript
const reportData = Object.entries(carrierStats).map(([carrier, stats]) => ({
```

```javascript
const generateInventoryReport = () => {
```

```javascript
const invData = skuMaster.map(sku => {
```

```javascript
const inv = inventory.find(i => i.sku === sku.code) || {};
```

```javascript
data: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status) && !o.status.startsWith('RTO')),
```

```javascript
count: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status) && !o.status.startsWith('RTO')).length,
```

```javascript
data: orders.filter(o => o.status === 'Delivered'),
```

```javascript
count: orders.filter(o => o.status === 'Delivered').length,
```

```javascript
data: orders.filter(o => o.status.startsWith('RTO')),
```

```javascript
count: orders.filter(o => o.status.startsWith('RTO')).length,
```

```javascript
onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
```

```javascript
onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
```

```javascript
onClick={() => setDateRange({ start: '', end: '' })}
```

```javascript
{reports.map((report, idx) => (
```

```javascript
onClick={() => exportToCSV(report.data, report.name.replace(/\s/g, '_'), report.columns)}
```

```javascript
onClick={() => exportToJSON(report.data, report.name.replace(/\s/g, '_'))}
```

```javascript
{specialReports.map((report, idx) => (
```

## [RoadmapPage.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Roadmap/RoadmapPage.jsx)
> No summary available.

```javascript
const RoadmapPage = () => {
```

```javascript
{ name: 'SKU Inheritance', desc: 'Parent->Child attribute inheritance (Dimensions, Weight, Costing) is fully functional', status: 'live', module: 'Warehouse' },
```

```javascript
{ phase: 'Phase 5', title: 'MVP Complete', status: 'Complete', desc: '26 modules with full functionality' },
```

```javascript
{developmentPhases.map((p, idx) => (
```

```javascript
{completedFeatures.map((f, idx) => (
```

```javascript
{upcomingFeatures.map((f, idx) => (
```

```javascript
{techStack.map((t, idx) => (
```

## [IPWhitelistManager.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Settings/IPWhitelistManager.jsx)
> IPWhitelistManager.jsx
  IP whitelist management component for restricted access
  Add, remove, and manage allowed IP addresses

```javascript
/**
* IPWhitelistManager.jsx
* IP whitelist management component for restricted access
* Add, remove, and manage allowed IP addresses
*/
const IPWhitelistManager = ({ onIpListUpdate }) => {
```

```javascript
useEffect(() => {
```

```javascript
const fetchWhitelist = async () => {
```

```javascript
const validateIp = (ip) => {
```

```javascript
return parts.every(p => parseInt(p) <= 255);
```

```javascript
const handleAddIp = async () => {
```

```javascript
setTimeout(() => setMessage(''), 3000);
```

```javascript
const handleRemoveIp = async (ip) => {
```

```javascript
const updated = ipList.filter(i => i !== ip);
```

```javascript
setTimeout(() => setMessage(''), 3000);
```

```javascript
const filteredIps = ipList.filter(ip => ip.includes(filter));
```

```javascript
onChange={(e) => setNewIp(e.target.value)}
```

```javascript
onKeyPress={(e) => e.key === 'Enter' && handleAddIp()}
```

```javascript
onChange={(e) => setFilter(e.target.value)}
```

```javascript
filteredIps.map(ip => (
```

```javascript
onClick={() => handleRemoveIp(ip)}
```

## [SettingsPanel.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Settings/SettingsPanel.jsx)
> No summary available.

```javascript
const SettingsPanel = () => {
```

```javascript
const handleToggle = (key) => {
```

```javascript
setSettings(prev => ({ ...prev, [key]: !prev[key] }));
```

```javascript
onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
```

```javascript
onChange={(e) => setSettings(prev => ({ ...prev, gstNumber: e.target.value }))}
```

```javascript
onChange={(e) => setSettings(prev => ({ ...prev, warehouse: e.target.value }))}
```

```javascript
onChange={(e) => setSettings(prev => ({ ...prev, defaultCarrier: e.target.value }))}
```

```javascript
onClick={() => handleToggle('autoAssignCarrier')}
```

```javascript
onClick={() => handleToggle('emailNotifications')}
```

```javascript
onClick={() => handleToggle('smsAlerts')}
```

```javascript
onChange={(e) => setSettings(prev => ({ ...prev, minMargin: parseFloat(e.target.value) }))}
```

```javascript
onChange={(e) => setSettings(prev => ({ ...prev, criticalMargin: parseFloat(e.target.value) }))}
```

```javascript
onVerificationSuccess={() => console.log('2FA Enabled')}
```

```javascript
onCancel={() => console.log('2FA Setup Cancelled')}
```

```javascript
<IPWhitelistManager onIpListUpdate={(list) => console.log('IP Whitelist Updated', list)} />
```

```javascript
onClick={() => handleToggle('pushNotifications')}
```

## [TwoFactorAuth.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Settings/TwoFactorAuth.jsx)
> TwoFactorAuth.jsx
  Two-Factor Authentication component for secure user access
  Supports OTP via email/SMS, verification, and account recovery

```javascript
/**
* TwoFactorAuth.jsx
* Two-Factor Authentication component for secure user access
* Supports OTP via email/SMS, verification, and account recovery
*/
}) => {
```

```javascript
const formatTime = (seconds) => {
```

```javascript
React.useEffect(() => {
```

```javascript
const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
```

```javascript
return () => clearTimeout(timer);
```

```javascript
const handleMethodSelect = async (chosenMethod) => {
```

```javascript
setTimeout(() => setSuccessMessage(''), 3000);
```

```javascript
const handleVerifyOTP = async () => {
```

```javascript
setTimeout(() => onVerificationSuccess?.(), 2000);
```

```javascript
const handleOtpChange = (e) => {
```

```javascript
onClick={() => handleMethodSelect('email')}
```

```javascript
onClick={() => handleMethodSelect('sms')}
```

```javascript
onClick={() => handleMethodSelect(selectedMethod)}
```

## [ContextProviders.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Shared/ContextProviders.jsx)
> ContextProviders Layout Component
  Wraps the application with all necessary context providers
  This includes error handling, notifications, analytics, etc.

```javascript
/**
* ContextProviders Layout Component
* Wraps the application with all necessary context providers
* This includes error handling, notifications, analytics, etc.
*/
const ContextProviders = ({ children }) => {
```

```javascript
// - Offline sync context for offline-first functionality
```

```javascript
function App() {
```

## [ErrorBoundary.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Shared/ErrorBoundary.jsx)
> ErrorBoundary Component
  Catches JavaScript errors in child components and displays fallback UI
  Integrates with errorHandlerService for error logging and recovery suggestions

```javascript
/**
* ErrorBoundary Component
* Catches JavaScript errors in child components and displays fallback UI
* Integrates with errorHandlerService for error logging and recovery suggestions
*/
class ErrorBoundary extends React.Component {
```

```javascript
handleReset = () => {
```

```javascript
{this.state.recoveryHints.map((hint, idx) => (
```

## [MainLayout.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Shared/MainLayout.jsx)
> MainLayout Component
  Primary layout wrapper for authenticated pages
  Includes header, sidebar, main content area, and footer

```javascript
/**
* MainLayout Component
* Primary layout wrapper for authenticated pages
* Includes header, sidebar, main content area, and footer
*/
const MainLayout = () => {
```

## [ResponsiveLayout.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Shared/ResponsiveLayout.jsx)
> ResponsiveLayout.jsx
  Responsive layout component for Bluewud OTS
  Provides adaptive layouts for desktop, tablet, and mobile views
  Uses Bluewud Dark Elite glassmorphism theme

```javascript
/**
* ResponsiveLayout.jsx
* Responsive layout component for Bluewud OTS
* Provides adaptive layouts for desktop, tablet, and mobile views
* Uses Bluewud Dark Elite glassmorphism theme
*/
}) => {
```

```javascript
const getViewportType = (width) => {
```

```javascript
const handleResize = useCallback(() => {
```

```javascript
React.useEffect(() => {
```

```javascript
return () => window.removeEventListener('resize', handleResize);
```

```javascript
onClick={() => setSidebarOpen(!sidebarOpen)}
```

## [ProductionTracker.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/SupplyChain/ProductionTracker.jsx)
> No summary available.

```javascript
const ProductionTracker = () => {
```

```javascript
const activeSkus = useMemo(() => skuMaster.filter(s => !s.isParent), [skuMaster]);
```

```javascript
const handleSkuChange = (sku) => {
```

```javascript
const handleAIScan = async () => {
```

```javascript
const handleReceive = () => {
```

```javascript
setTimeout(() => {
```

```javascript
onChange={(e) => handleSkuChange(e.target.value)}
```

```javascript
{activeSkus.map(sku => (
```

```javascript
onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
```

```javascript
{batches.slice().reverse().slice(0, 8).map(batch => (
```

## [QualityGate.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/SupplyChain/QualityGate.jsx)
> No summary available.

```javascript
const QualityGate = () => {
```

```javascript
const pendingQA = useMemo(() =>
```

```javascript
orders.filter(o => o.status === ORDER_STATUSES.PENDING || o.status === ORDER_STATUSES.MTP_APPLIED),
```

```javascript
const handleScan = (e) => {
```

```javascript
const order = pendingQA.find(o => o.id === scanInput || o.awb === scanInput);
```

```javascript
const toggleCheck = (key) => {
```

```javascript
setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
```

```javascript
const isPassed = Object.values(checklist).every(v => v);
```

```javascript
const handlePass = () => {
```

```javascript
onChange={(e) => setScanInput(e.target.value)}
```

```javascript
{pendingQA.slice(0, 5).map(o => (
```

```javascript
onClick={() => setSelectedOrder(o)}
```

```javascript
<button className="btn-pill" onClick={() => setSelectedOrder(null)} style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
```

```javascript
{Object.keys(checklist).map(key => (
```

```javascript
onClick={() => toggleCheck(key)}
```

```javascript
<input type="checkbox" checked={checklist[key]} onChange={() => { }} />
```

```javascript
onClick={() => { updateOrderStatus(selectedOrder.id, ORDER_STATUSES.ON_HOLD, { reason: 'QA Failed' }); setSelectedOrder(null); alert('Order Marked ON HOLD (QA Failed)'); }}
```

## [ShortageAlerts.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/SupplyChain/ShortageAlerts.jsx)
> No summary available.

```javascript
const ShortageAlerts = () => {
```

```javascript
const alerts = useMemo(() => {
```

```javascript
.filter(s => !s.isParent)
```

```javascript
.map(sku => ({
```

```javascript
<span className="badge" style={{ background: alerts.some(a => a.urgency === 'CRITICAL') ? 'var(--danger)' : 'var(--warning)' }}>
```

```javascript
{alerts.map((alert, i) => (
```

## [ShipmentTracker.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Tracking/ShipmentTracker.jsx)
> No summary available.

```javascript
const ShipmentTracker = () => {
```

```javascript
.filter(order => transitStatuses.includes(order.status))
```

```javascript
.map(order => {
```

```javascript
const events = (order.statusHistory || []).map(h => ({
```

```javascript
{activeShipments.map(shipment => (
```

```javascript
{shipment.events.map((event, idx) => (
```

## [WarehouseManager.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Warehouse/WarehouseManager.jsx)
> No summary available.

```javascript
const WarehouseManager = () => {
```

```javascript
const inventory = useMemo(() => {
```

```javascript
.filter(sku => !sku.isParent)
```

```javascript
.map(sku => ({
```

```javascript
const categories = useMemo(() => ['All', ...new Set(inventory.map(i => i.category))], [inventory]);
```

```javascript
const filteredInventory = inventory.filter(item => {
```

```javascript
const totalUnits = inventory.reduce((sum, i) => sum + i.inStock, 0);
```

```javascript
const lowStockItems = inventory.filter(i => i.available <= (i.reorderLevel || 15));
```

```javascript
const handleTransfer = (skuId) => {
```

```javascript
const confirmTransfer = (from, to, qty) => {
```

```javascript
onChange={(e) => setRoutingPincode(e.target.value)}
```

```javascript
onClick={() => setRoutedWarehouse(routeOrderToWarehouse(routingPincode))}
```

```javascript
onChange={(e) => setSearchTerm(e.target.value)}
```

```javascript
onChange={(e) => setSelectedCategory(e.target.value)}
```

```javascript
{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
```

```javascript
{filteredInventory.map(item => (
```

```javascript
onClick={() => handleTransfer(item.sku)}
```

```javascript
onClick={() => adjustStock(item.sku, 1)}
```

```javascript
onClick={() => adjustStock(item.sku, -1)}
```

```javascript
{batches.slice(-6).reverse().map(batch => (
```

```javascript
{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
```

```javascript
onClick={() => confirmTransfer(
```

```javascript
onClick={() => setTransferModal({ show: false, sku: null })}
```

## [WarehouseSelector.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/components/Warehouse/WarehouseSelector.jsx)
> Warehouse Selector Component
  Displays warehouse utilization and allows manual override of warehouse selection.

```javascript
/**
* Warehouse Selector Component
* Displays warehouse utilization and allows manual override of warehouse selection.
*/
const WarehouseSelector = ({ selectedWarehouse, onSelect, order = null, currentLoads = {} }) => {
```

```javascript
const utilization = useMemo(() => warehouseOptimizer.getUtilizationMetrics(currentLoads), [currentLoads]);
```

```javascript
const recommendation = useMemo(() => {
```

```javascript
const getStatusColor = (status) => {
```

```javascript
{utilization.map(wh => {
```

```javascript
onClick={() => onSelect?.(wh.id)}
```

## [AuthContext.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/context/AuthContext.jsx)
> No summary available.

```javascript
export const AuthProvider = ({ children }) => {
```

```javascript
useEffect(() => {
```

```javascript
const login = async (email, password) => {
```

```javascript
await new Promise(resolve => setTimeout(resolve, 800));
```

```javascript
const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
```

```javascript
const logout = () => {
```

```javascript
const hasPermission = (permission) => {
```

```javascript
export const useAuth = () => {
```

## [ContextProviders.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/context/ContextProviders.jsx)
> ContextProviders Layout Component
  Wraps the application with all necessary context providers
  This includes error handling, notifications, analytics, etc.

```javascript
/**
* ContextProviders Layout Component
* Wraps the application with all necessary context providers
* This includes error handling, notifications, analytics, etc.
*/
const ContextProviders = ({ children }) => {
```

```javascript
// - Offline sync context for offline-first functionality
```

```javascript
function App() {
```

## [DataContext.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/context/DataContext.jsx)
> Smart routing for regional warehouse selection with real-time load balancing

```javascript
export const DataProvider = ({ children }) => {
```

```javascript
useEffect(() => {
```

```javascript
cache.initialize().then(async () => {
```

```javascript
setOrders(cachedOrders.map(c => c.data));
```

```javascript
useEffect(() => {
```

```javascript
const unsubscribe = webhookService.subscribe(({ type, data }) => {
```

```javascript
setOrders(prev => {
```

```javascript
const updatedOrders = prev.map(o => o.id === data.id ? { ...o, ...data } : o);
```

```javascript
setAgentMetadata(m => ({ ...m, mutations: m.mutations + 1 }));
```

```javascript
setInventoryLevels(prev => ({ ...prev, [data.sku]: data.levels }));
```

```javascript
orders.forEach(o => cacheService.cacheData('orders', o.id, o));
```

```javascript
const syncInterval = setInterval(() => {
```

```javascript
syncDeltaOrders(orders).catch(err => console.error('Delta Sync Failed:', err));
```

```javascript
return () => {
```

```javascript
useEffect(() => {
```

```javascript
const initializeData = async () => {
```

```javascript
...Array(6).fill(0).map((_, i) => ({
```

```javascript
const invEntry = cachedMetadata?.find(m => m.key === 'inventoryLevels');
```

```javascript
const loadEntry = cachedMetadata?.find(m => m.key === 'warehouseLoads');
```

```javascript
const creditEntry = cachedMetadata?.find(m => m.key === 'dealerCredits');
```

```javascript
SKU_MASTER.filter(s => !s.isParent).forEach(child => {
```

```javascript
const batchEntry = cachedBatches?.find(m => m.key === 'batches');
```

```javascript
SKU_MASTER.filter(s => !s.isParent).forEach(sku => {
```

```javascript
useEffect(() => {
```

```javascript
useEffect(() => {
```

```javascript
useEffect(() => {
```

```javascript
useEffect(() => {
```

```javascript
useEffect(() => {
```

```javascript
useEffect(() => {
```

```javascript
const interval = setInterval(() => {
```

```javascript
setOrders(prev => prev.map(order => {
```

```javascript
return () => clearInterval(interval);
```

```javascript
/**
* Smart routing for regional warehouse selection with real-time load balancing
*/
const smartRouteOrder = useCallback((pincode, state) => {
```

```javascript
useEffect(() => {
```

```javascript
orders.forEach(o => {
```

```javascript
/**
* Add a new order
*/
const addOrder = useCallback((orderData) => {
```

```javascript
setDealerCredits(prev => ({
```

```javascript
const skuData = skuMaster.find(s => s.sku === newOrder.sku);
```

```javascript
setFlaggedOrders(prev => [...prev, newOrder]);
```

```javascript
setOrders(prev => deduplicateOrders(prev, [newOrder]));
```

```javascript
setInventoryLevels(prev => ({
```

```javascript
setCustomerMaster(prev => deduplicateCustomers([...prev, customer]));
```

```javascript
/**
* Update order status with state machine validation
*/
const updateOrder = useCallback((orderId, updates) => {
```

```javascript
setOrders(prev => prev.map(order =>
```

```javascript
const updateOrderStatus = useCallback((orderId, newStatus, metadata = {}) => {
```

```javascript
setOrders(prev => prev.map(order => {
```

```javascript
setInventoryLevels(p => ({
```

```javascript
setInventoryLevels(p => ({
```

```javascript
/**
* Bulk update order statuses
*/
const bulkUpdateStatus = useCallback((orderIds, newStatus, metadata = {}) => {
```

```javascript
const ordersToUpdate = orders.filter(o => orderIds.includes(o.id));
```

```javascript
setOrders(prev => {
```

```javascript
const successIds = results.successful.map(o => o.id);
```

```javascript
return prev.map(order =>
```

```javascript
? results.successful.find(o => o.id === order.id)
```

```javascript
/**
* Assign carrier to order
*/
const assignCarrier = useCallback((orderId, carrierId, carrierName) => {
```

```javascript
setOrders(prev => prev.map(order => {
```

```javascript
/**
* Import orders from external source
*/
const importOrders = useCallback((rawOrders, source) => {
```

```javascript
const imported = rawOrders.map(raw => {
```

```javascript
setOrders(prev => deduplicateOrders(prev, imported));
```

```javascript
const newCustomers = imported.map(o => ({
```

```javascript
setCustomerMaster(prev => deduplicateCustomers([...prev, ...newCustomers]));
```

```javascript
/**
* Sync SKU Master from Zoho CRM
*/
const syncSKUMaster = useCallback(async () => {
```

```javascript
/**
* Sync Order to Zoho CRM
*/
const syncOrderToZoho = useCallback(async (order) => {
```

```javascript
setOrders(prev => prev.map(o => o.id === order.id ? { ...o, zoho_id: result.zoho_id } : o));
```

```javascript
/**
* Warehouse: Adjust stock levels
*/
const adjustStock = useCallback((skuId, adjustment) => {
```

```javascript
setInventoryLevels(prev => ({
```

```javascript
/**
* Warehouse: Set location
*/
const setStockLocation = useCallback((skuId, location) => {
```

```javascript
setInventoryLevels(prev => ({
```

```javascript
/**
* Warehouse: Transfer stock between locations/bins
*/
const transferStock = useCallback((sku, fromBin, toBin, qty) => {
```

```javascript
setInventoryLevels(prev => {
```

```javascript
setActivityLog(prev => [{
```

```javascript
/**
* Supply Chain: Receive new stock batch
*/
const receiveStock = useCallback((skuId, vendor, quantity) => {
```

```javascript
setBatches(prev => [...prev, newBatch]);
```

```javascript
setInventoryLevels(prev => ({
```

```javascript
/**
* Get carrier rates for a shipment
*/
const getCarrierRates = useCallback((shipment) => {
```

```javascript
/**
* Get recommended carrier
*/
const getCarrierRecommendation = useCallback((shipment, priority = 'cost') => {
```

```javascript
/**
* Get valid next statuses for an order
*/
const getOrderNextStatuses = useCallback((orderId) => {
```

```javascript
const order = orders.find(o => o.id === orderId);
```

```javascript
/**
* Multi-Channel: Sync all marketplaces
*/
const syncAllMarketplaces = useCallback(async () => {
```

```javascript
const exportOrders = useCallback((format = 'csv', filter = {}) => {
```

```javascript
data = data.filter(o => o.status === filter.status);
```

```javascript
data = data.filter(o => o.source === filter.source);
```

```javascript
const getOrderStats = useCallback(() => {
```

```javascript
const delivered = orders.filter(o => o.status === 'Delivered').length;
```

```javascript
const inTransit = orders.filter(o => ['In-Transit', 'Out-for-Delivery', 'Picked-Up'].includes(o.status)).length;
```

```javascript
const pending = orders.filter(o => ['Pending', 'MTP-Applied', 'Carrier-Assigned'].includes(o.status)).length;
```

```javascript
const rto = orders.filter(o => o.status.startsWith('RTO')).length;
```

```javascript
/**
* Customer Intelligence: Get LTV and Stats
*/
const getCustomerMetrics = useCallback((phone) => {
```

```javascript
const customerOrders = orders.filter(o =>
```

```javascript
const totalSpend = customerOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
```

```javascript
? new Date(Math.max(...customerOrders.map(o => new Date(o.createdAt || Date.now()))))
```

```javascript
getDemandForecast: (days, forecastDays) => calculateSMAForecast(orders, days, forecastDays),
```

```javascript
getSKUPrediction: (sku, days) => predictSKUDemand(orders, sku, days),
```

```javascript
getTrend: (days) => getOrderTrend(orders, days),
```

```javascript
getRevenueProjection: (nextDays) => projectRevenue(orders, nextDays),
```

```javascript
getSKUProfitability: (skuId, price) => {
```

```javascript
const sku = skuMaster.find(s => s.sku === skuId);
```

```javascript
getMLDemandForecast: (skuId) => mlForecastService.predictDemand(orders, skuId),
```

```javascript
universalSearch: (query) => searchService.universalSearch({ orders, skuMaster }, query),
```

```javascript
quickLookup: (id) => searchService.quickLookup(orders, id),
```

```javascript
resolveFlag: (orderId) => setFlaggedOrders(prev => prev.filter(o => o.id !== orderId)),
```

```javascript
getRecommendations: (state, city, weight) => getAllRates({ state, city, weight }),
```

```javascript
/**
* Initialize push notifications on app load
*/
const initializePushNotifications = useCallback(async () => {
```

```javascript
/**
* Register for push notifications
*/
const enablePushNotifications = useCallback(async () => {
```

```javascript
/**
* Add order to offline queue
*/
const queueOrderOffline = useCallback((order) => {
```

```javascript
setOfflineQueue(prev => [...prev, { ...order, queuedAt: new Date().toISOString() }]);
```

```javascript
/**
* Sync offline orders when coming online
*/
const syncOfflineOrders = useCallback(async () => {
```

```javascript
offlineQueue.map(order => importOrders([order], 'offline-sync'))
```

```javascript
const synced = results.reduce((sum, r) => sum + (r.count || 0), 0);
```

```javascript
useEffect(() => {
```

```javascript
export const useData = () => {
```

## [FinancialContext.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/context/FinancialContext.jsx)
> No summary available.

```javascript
export const FinancialProvider = ({ children }) => {
```

```javascript
useEffect(() => {
```

```javascript
const calculateTotals = () => {
```

```javascript
orders.forEach(order => {
```

```javascript
const fetchSettlements = async () => {
```

```javascript
const mockSettlements = orders.map(order => ({
```

```javascript
export const useFinance = () => useContext(FinancialContext);
```

## [NotificationContext.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/context/NotificationContext.jsx)
> Notification Context - Unified Notification Hub
  
  Provides a single React context to manage all notification channels:
  - In-App Toasts
  - Notification Center (sidebar panel)
  - Web Push Notifications
  - WhatsApp Business Alerts (mock)

```javascript
/**
* Notification Context - Unified Notification Hub
*
* Provides a single React context to manage all notification channels:
* - In-App Toasts
* - Notification Center (sidebar panel)
* - Web Push Notifications
* - WhatsApp Business Alerts (mock)
*/
export const NotificationProvider = ({ children }) => {
```

```javascript
useEffect(() => {
```

```javascript
const unsubscribe = notificationService.subscribe((newNotif) => {
```

```javascript
setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);
```

```javascript
return () => unsubscribe();
```

```javascript
/**
* Show a transient toast notification
*/
const showToast = useCallback((notification) => {
```

```javascript
setToasts(prev => [...prev, toast]);
```

```javascript
setTimeout(() => {
```

```javascript
setToasts(prev => prev.filter(t => t.toastId !== toastId));
```

```javascript
/**
* Dismiss a specific toast
*/
const dismissToast = useCallback((toastId) => {
```

```javascript
setToasts(prev => prev.filter(t => t.toastId !== toastId));
```

```javascript
/**
* Mark a notification as read
*/
const markRead = useCallback((notificationId) => {
```

```javascript
setNotifications(prev => prev.map(n =>
```

```javascript
/**
* Mark all as read
*/
const markAllRead = useCallback(() => {
```

```javascript
setNotifications(prev => prev.map(n => ({ ...n, read: true })));
```

```javascript
/**
* Push a custom notification (from UI)
*/
const pushNotification = useCallback((type, title, message, data = {}) => {
```

```javascript
/**
* Toast Container Component
*/
const ToastContainer = ({ toasts, onDismiss }) => {
```

```javascript
{toasts.map(toast => (
```

```javascript
onClick={() => onDismiss(toast.toastId)}
```

```javascript
export const useNotifications = () => {
```

## [skuMasterData.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/data/skuMasterData.js)
> SKU Master Data - Aligned with Legacy Excel Structure
  Parent SKUs: Internal referencing (Design/Dimensions/Weight)
  Child SKUs: Sellable products with color variations

```javascript
/**
* SKU Master Data - Aligned with Legacy Excel Structure
* Parent SKUs: Internal referencing (Design/Dimensions/Weight)
* Child SKUs: Sellable products with color variations
*/
export const SKU_MASTER = [
```

```javascript
export const SKU_ALIASES = [
```

## [warehouseData.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/data/warehouseData.js)
> Warehouse Metadata
  Unified source of truth for the Bluewud warehouse network.

```javascript
/**
* Warehouse Metadata
* Unified source of truth for the Bluewud warehouse network.
*/
export const WAREHOUSES = {
```

## [useAPI.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/hooks/useAPI.js)
> Custom hook for making API requests with loading and error states
  @param {string} endpoint - API endpoint
  @param {Object} options - Request options
  @returns {Object} - {data, loading, error, refetch}

```javascript
/**
* Custom hook for making API requests with loading and error states
* @param {string} endpoint - API endpoint
* @param {Object} options - Request options
* @returns {Object} - {data, loading, error, refetch}
*/
export const useAPI = (endpoint, options = {}) => {
```

```javascript
const fetchData = useCallback(async () => {
```

```javascript
useEffect(() => {
```

```javascript
return () => {
```

```javascript
/**
* Custom hook for POST/PUT/DELETE requests
* @param {string} endpoint - API endpoint
* @param {string} method - HTTP method (POST, PUT, DELETE)
* @returns {Object} - {execute, data, loading, error}
*/
export const useMutation = (endpoint, method = 'POST') => {
```

```javascript
async (body = null, options = {}) => {
```

```javascript
useEffect(() => {
```

```javascript
return () => {
```

```javascript
/**
* Custom hook for batch API requests
* @param {Array} requests - Array of [endpoint, options] tuples
* @returns {Object} - {data, loading, error}
*/
export const useBatchAPI = (requests) => {
```

```javascript
useEffect(() => {
```

```javascript
const fetchBatch = async () => {
```

```javascript
return () => {
```

```javascript
/**
* Custom hook for paginated API requests
* @param {string} endpoint - API endpoint
* @param {number} pageSize - Items per page
* @returns {Object} - {items, page, nextPage, prevPage, loading, error}
*/
export const usePaginatedAPI = (endpoint, pageSize = 20) => {
```

```javascript
useEffect(() => {
```

```javascript
const fetchPage = async () => {
```

```javascript
return () => {
```

```javascript
const nextPage = useCallback(() => {
```

```javascript
if (hasMore) setPage((p) => p + 1);
```

```javascript
const prevPage = useCallback(() => {
```

```javascript
setPage((p) => Math.max(1, p - 1));
```

## [useAnalytics.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/hooks/useAnalytics.js)
> useAnalytics Hook
  Provides analytics data and KPI calculations

```javascript
/**
* useAnalytics Hook
* Provides analytics data and KPI calculations
*/
export const useAnalytics = (dateRange = 7) => {
```

```javascript
useEffect(() => {
```

```javascript
const fetchAnalytics = async () => {
```

## [useErrorHandler.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/hooks/useErrorHandler.js)
> useErrorHandler Hook
  Provides error state management and recovery handling

```javascript
/**
* useErrorHandler Hook
* Provides error state management and recovery handling
*/
export const useErrorHandler = () => {
```

```javascript
const handleError = useCallback((err, context = {}) => {
```

```javascript
const clearError = useCallback(() => {
```

```javascript
const attemptRecovery = useCallback(async (recoveryFn) => {
```

## [useNotifications.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/hooks/useNotifications.js)
> useNotifications Hook
  Manages notification state and lifecycle

```javascript
/**
* useNotifications Hook
* Manages notification state and lifecycle
*/
export const useNotifications = () => {
```

```javascript
const addNotification = useCallback((notification) => {
```

```javascript
setNotifications(prev => [newNotif, ...prev]);
```

```javascript
setUnreadCount(prev => prev + 1);
```

```javascript
const markAsRead = useCallback((id) => {
```

```javascript
setNotifications(prev => {
```

```javascript
const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
```

```javascript
setUnreadCount(prev => Math.max(0, prev - 1));
```

```javascript
const removeNotification = useCallback((id) => {
```

```javascript
setNotifications(prev => prev.filter(n => n.id !== id));
```

```javascript
const clearAll = useCallback(() => {
```

## [useStorage.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/hooks/useStorage.js)
> Custom hook for managing localStorage with React state
  @param {string} key - Storage key
  @param {} initialValue - Initial value if not in storage
  @param {number} expiryMs - Optional expiry time in milliseconds
  @returns {[, function]} - [value, setValue]

```javascript
/**
* Custom hook for managing localStorage with React state
* @param {string} key - Storage key
* @param {*} initialValue - Initial value if not in storage
* @param {number} expiryMs - Optional expiry time in milliseconds
* @returns {[*, function]} - [value, setValue]
*/
export const useLocalStorage = (key, initialValue, expiryMs = null) => {
```

```javascript
const [storedValue, setStoredValue] = useState(() => {
```

```javascript
(value) => {
```

```javascript
/**
* Custom hook for managing sessionStorage with React state
* @param {string} key - Storage key
* @param {*} initialValue - Initial value if not in storage
* @returns {[*, function]} - [value, setValue]
*/
export const useSessionStorage = (key, initialValue) => {
```

```javascript
const [storedValue, setStoredValue] = useState(() => {
```

```javascript
(value) => {
```

```javascript
/**
* Custom hook for managing multiple localStorage values
* @param {string} namespace - Namespace for grouped keys
* @param {Object} initialState - Initial state object
* @returns {[Object, function]} - [state, setState]
*/
export const useLocalStorageState = (namespace, initialState) => {
```

```javascript
const [state, setState] = useState(() => {
```

```javascript
(updates) => {
```

```javascript
setState((prevState) => {
```

```javascript
/**
* Custom hook for managing preferences with localStorage
* @param {string} key - Preference key
* @param {*} defaultValue - Default preference value
* @returns {[*, function]} - [preference, setPreference]
*/
export const usePreference = (key, defaultValue) => {
```

```javascript
/**
* Custom hook for managing user settings with localStorage
* @param {Object} initialSettings - Initial settings object
* @returns {[Object, function, function]} - [settings, updateSetting, reset]
*/
export const useUserSettings = (initialSettings) => {
```

```javascript
(key, value) => {
```

```javascript
const resetSettings = useCallback(() => {
```

```javascript
/**
* Custom hook for managing temporary session data
* @param {string} key - Session key
* @param {*} initialValue - Initial value
* @returns {[*, function]} - [value, setValue]
*/
export const useSessionValue = (key, initialValue) => {
```

## [ContextProviders.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/layouts/ContextProviders.jsx)
> ContextProviders Layout Component
  Wraps the application with all necessary context providers
  This includes error handling, notifications, analytics, etc.

```javascript
/**
* ContextProviders Layout Component
* Wraps the application with all necessary context providers
* This includes error handling, notifications, analytics, etc.
*/
const ContextProviders = ({ children }) => {
```

```javascript
// - Offline sync context for offline-first functionality
```

```javascript
function App() {
```

## [MainLayout.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/layouts/MainLayout.jsx)
> MainLayout Component
  Primary layout wrapper for authenticated pages
  Includes header, sidebar, main content area, and footer

```javascript
/**
* MainLayout Component
* Primary layout wrapper for authenticated pages
* Includes header, sidebar, main content area, and footer
*/
const MainLayout = () => {
```

## [main.jsx](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/main.jsx)
> No summary available.

```javascript
window.addEventListener('load', () => {
```

```javascript
.then((registration) => {
```

```javascript
.catch((error) => {
```

## [activityLogger.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/activityLogger.js)
> Activity Logger - Audit trail for all system actions
  Integrates with UI components and will sync to backend

```javascript
/**
* Activity Logger - Audit trail for all system actions
* Integrates with UI components and will sync to backend
*/
export const ACTIVITY_TYPES = {
```

```javascript
/**
* Log an activity
* @param {object} params
* @returns {object} - Activity record
*/
export const logActivity = ({
```

```javascript
}) => {
```

```javascript
/**
* Get current user from localStorage (simplified)
*/
const getCurrentUser = () => {
```

```javascript
/**
* Sync activity to backend and local cache
* @param {object} activity
*/
const syncToBackend = async (activity) => {
```

```javascript
/**
* Get activity log with filters
* @param {object} filters
* @returns {object[]}
*/
export const getActivityLog = (filters = {}) => {
```

```javascript
result = result.filter(a => a.type === filters.type);
```

```javascript
result = result.filter(a => a.entityType === filters.entityType);
```

```javascript
result = result.filter(a => a.entityId === filters.entityId);
```

```javascript
result = result.filter(a => a.user?.id === filters.userId);
```

```javascript
result = result.filter(a => new Date(a.timestamp) >= new Date(filters.startDate));
```

```javascript
result = result.filter(a => new Date(a.timestamp) <= new Date(filters.endDate));
```

```javascript
result = result.filter(a =>
```

```javascript
/**
* Get activity for a specific entity
* @param {string} entityType
* @param {string} entityId
* @returns {object[]}
*/
export const getEntityHistory = (entityType, entityId) => {
```

```javascript
/**
* Clear activity log (admin only)
*/
export const clearActivityLog = () => {
```

```javascript
/**
* Initialize activity log (used on app load)
*/
export const initializeActivityLog = (logs) => {
```

```javascript
export const logOrderCreate = (order) => {
```

```javascript
export const logOrderStatusChange = (order, previousStatus, newStatus, reason = '') => {
```

```javascript
export const logBulkUpdate = (orderIds, status) => {
```

```javascript
export const logCarrierAssign = (order, carrier) => {
```

```javascript
export const logLabelGenerate = (order, awb) => {
```

```javascript
export const logImportComplete = (source, count, errors = 0) => {
```

```javascript
export const logExport = (type, count) => {
```

```javascript
export const logUserLogin = (user) => {
```

```javascript
export const logUserLogout = (user) => {
```

## [activityLoggerEnhanced.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/activityLoggerEnhanced.js)
> Activity Logger Enhanced Service
  Comprehensive audit trail and activity logging for production environments
  Persists logs to Zoho Catalyst backend

```javascript
/**
* Activity Logger Enhanced Service
* Comprehensive audit trail and activity logging for production environments
* Persists logs to Zoho Catalyst backend
*/
/**
* Log an activity to the local queue and Catalyst
* @param {Object} activity Activity details
* @param {string} activity.action Action type (CREATE, UPDATE, DELETE, VIEW, etc.)
* @param {string} activity.module Module affected (Orders, Inventory, etc.)
* @param {Object} activity.data Activity data/payload
* @param {string} activity.userId User ID performing the action
* @param {string} activity.userEmail User email
* @param {string} activity.ipAddress IP address (optional)
* @param {number} activity.duration Duration in ms (optional)
* @returns {Promise<void>}
*/
export const logActivity = async (activity = {}) => {
```

```javascript
/**
* Log an order-related activity
* @param {Object} order Order object
* @param {string} action Action type
* @param {string} userId User ID
* @returns {Promise<void>}
*/
export const logOrderActivity = async (order, action, userId) => {
```

```javascript
/**
* Log an inventory-related activity
* @param {Object} inventory Inventory item
* @param {string} action Action type
* @param {number} quantityChange Change in quantity
* @param {string} userId User ID
* @returns {Promise<void>}
*/
export const logInventoryActivity = async (inventory, action, quantityChange, userId) => {
```

```javascript
/**
* Log a user authentication activity
* @param {string} action Action type (LOGIN, LOGOUT, FAILED_LOGIN)
* @param {string} userId User ID
* @param {string} userEmail User email
* @param {boolean} success Success status
* @param {string} reason Reason for failure (optional)
* @returns {Promise<void>}
*/
export const logAuthActivity = async (action, userId, userEmail, success, reason) => {
```

```javascript
/**
* Log a report or data export activity
* @param {string} reportName Report name
* @param {Object} filters Report filters
* @param {number} recordCount Number of records
* @param {string} userId User ID
* @returns {Promise<void>}
*/
export const logReportActivity = async (reportName, filters, recordCount, userId) => {
```

```javascript
/**
* Save activity log locally to IndexedDB or localStorage
* @param {Object} log Activity log object
* @returns {Promise<void>}
*/
const saveLogLocally = async (log) => {
```

```javascript
/**
* Sync pending logs to Catalyst backend
* @returns {Promise<void>}
*/
export const syncLogsToBackend = async () => {
```

```javascript
const pendingLogs = logQueue.filter((log) => log.status === 'pending');
```

```javascript
// This should call your Catalyst cloud function
```

```javascript
logs: pendingLogs.map((log) => ({
```

```javascript
logQueue = logQueue.map((log) =>
```

```javascript
pendingLogs.some((p) => p.id === log.id)
```

```javascript
/**
* Get activity logs with optional filters
* @param {Object} filters Filter options
* @param {string} filters.module Filter by module
* @param {string} filters.action Filter by action
* @param {string} filters.userId Filter by user ID
* @param {number} filters.limit Limit number of results
* @returns {Array} Filtered activity logs
*/
export const getActivityLogs = (filters = {}) => {
```

```javascript
if (module) logs = logs.filter((log) => log.module === module);
```

```javascript
if (action) logs = logs.filter((log) => log.action === action);
```

```javascript
if (userId) logs = logs.filter((log) => log.userId === userId);
```

```javascript
/**
* Get activity summary statistics
* @returns {Object} Summary statistics
*/
export const getActivitySummary = () => {
```

```javascript
logs.forEach((log) => {
```

```javascript
/**
* Clean up old logs older than retention period
* @returns {Promise<void>}
*/
export const cleanupOldLogs = async () => {
```

```javascript
(log) => new Date(log.timestamp) >= cutoffDate
```

```javascript
/**
* Start automatic sync timer
* @param {number} interval Sync interval in ms
* @returns {void}
*/
export const startAutoSync = (interval = SYNC_INTERVAL) => {
```

```javascript
syncTimer = setInterval(() => {
```

```javascript
/**
* Stop automatic sync timer
* @returns {void}
*/
export const stopAutoSync = () => {
```

```javascript
/**
* Generate unique log ID
* @returns {string} Unique log ID
*/
const generateLogId = () => {
```

```javascript
/**
* Clear all activity logs (use with caution)
* @returns {Promise<void>}
*/
export const clearAllLogs = async () => {
```

## [analyticsService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/analyticsService.js)
> Calculate order volume trend with linear regression
  @param {Array} orders - List of orders
  @param {number} days - Days to analyze (default 30)
  @returns {Object} - {slope, intercept, r2, trend}

```javascript
/**
* Calculate order volume trend with linear regression
* @param {Array} orders - List of orders
* @param {number} days - Days to analyze (default 30)
* @returns {Object} - {slope, intercept, r2, trend}
*/
export const getOrderTrend = (orders = [], days = 30) => {
```

```javascript
orders.forEach(order => {
```

```javascript
const sumY = data.reduce((a, b) => a + b, 0);
```

```javascript
const sumXY = data.reduce((sum, y, x) => sum + x * y, 0);
```

```javascript
const predictions = data.map((_, x) => slope * x + intercept);
```

```javascript
const ssRes = data.reduce((sum, y, x) => sum + Math.pow(y - predictions[x], 2), 0);
```

```javascript
const ssTot = data.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
```

```javascript
/**
* Forecast future order volume
* @param {Array} orders - Historical orders
* @param {number} daysAhead - Days to forecast
* @returns {Array} - Forecasted daily volumes
*/
export const forecastOrderVolume = (orders = [], daysAhead = 7) => {
```

```javascript
/**
* Get key performance indicators
*/
export const getKPIs = (orders = [], startDate, endDate) => {
```

```javascript
const filtered = orders.filter(o => {
```

```javascript
const totalRevenue = filtered.reduce((sum, o) => sum + (o.amount || 0), 0);
```

```javascript
const delivered = filtered.filter(o => o.status === 'DELIVERED').length;
```

```javascript
const rto = filtered.filter(o => o.status === 'RTO_INITIATED').length;
```

```javascript
const deliveredOrders = filtered.filter(o => o.status === 'DELIVERED' && o.deliveredAt);
```

```javascript
const totalTime = deliveredOrders.reduce((sum, o) => {
```

```javascript
filtered.forEach(o => {
```

```javascript
const topCarrier = Object.entries(carrierCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
```

```javascript
/**
* Get revenue by carrier
*/
export const getRevenueByCarrier = (orders = []) => {
```

```javascript
orders.forEach(o => {
```

```javascript
.map(([carrier, revenue]) => ({ carrier, revenue }))
```

```javascript
.sort((a, b) => b.revenue - a.revenue);
```

```javascript
/**
* Get order status distribution
*/
export const getStatusDistribution = (orders = []) => {
```

```javascript
orders.forEach(o => {
```

```javascript
.map(([status, count]) => ({
```

```javascript
.sort((a, b) => b.count - a.count);
```

```javascript
/**
* Get zone-wise performance
*/
export const getZonePerformance = (orders = []) => {
```

```javascript
orders.forEach(o => {
```

```javascript
return Object.entries(zoneMetrics).map(([zone, metrics]) => ({
```

```javascript
/**
* Cache analytics results
*/
export const cacheAnalytics = async (key, data, ttl = 3600000) => {
```

```javascript
/**
* Retrieve cached analytics
*/
export const getCachedAnalytics = async (key) => {
```

```javascript
/**
* Project future revenue based on current trends
*/
export const projectRevenue = (orders = [], days = 30) => {
```

```javascript
? orders.reduce((sum, o) => sum + (o.amount || 0), 0) / orders.length
```

```javascript
/**
* Calculate profitability per SKU
*/
export const calculateSKUProfitability = (orders = [], skuMaster = []) => {
```

```javascript
orders.forEach(o => {
```

```javascript
const skuData = (skuMaster || []).find(s => s.sku === o.sku) || {};
```

```javascript
return Object.values(profitability).map(p => ({
```

```javascript
})).sort((a, b) => b.profit - a.profit);
```

## [apiService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/apiService.js)
> API Service Layer - Centralized API management for all integrations
  This abstracts away the complexity of different API endpoints

```javascript
/**
* API Service Layer - Centralized API management for all integrations
* This abstracts away the complexity of different API endpoints
*/
export const CreatorAPI = {
```

```javascript
/**
* Get records from a Creator report
* @param {string} reportName - Name of the Creator report
* @param {object} criteria - Optional filter criteria
*/
/**
* Create a new record in Creator
* @param {string} formName - Name of the Creator form
* @param {object} data - Record data
*/
/**
* Update a record in Creator
* @param {string} reportName - Report containing the record
* @param {string} recordId - ID of the record to update
* @param {object} data - Fields to update
*/
export const CRMAPI = {
```

```javascript
/**
* Get accounts (dealers) from CRM
* @param {object} params - Query parameters
*/
/**
* Get a single account by ID
* @param {string} accountId
*/
/**
* Search accounts by name or code
* @param {string} query
*/
export const AmazonAPI = {
```

```javascript
/**
* Get orders from Amazon
* @param {object} params - Date range, status filters
*/
/**
* Get order details including items
* @param {string} orderId - Amazon Order ID
*/
export const FlipkartAPI = {
```

```javascript
/**
* Get orders from Flipkart
* @param {object} params - Filters
*/
export const CarrierAPI = {
```

```javascript
export const checkAPIHealth = async () => {
```

## [carrierOptimizer.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/carrierOptimizer.js)
> Get optimal carrier for an order
  @param {Object} order - Order data {pincode, weight, amount, zone, delivery_type}
  @returns {Promise<Object>} - Recommended carrier with cost details

```javascript
/**
* Get optimal carrier for an order
* @param {Object} order - Order data {pincode, weight, amount, zone, delivery_type}
* @returns {Promise<Object>} - Recommended carrier with cost details
*/
export const getOptimalCarrier = async (order) => {
```

```javascript
const eligibleCarriers = Object.values(CARRIER_CONFIG).filter(carrier => {
```

```javascript
const scoredCarriers = eligibleCarriers.map(carrier => {
```

```javascript
const best = scoredCarriers.sort((a, b) => b.score - a.score)[0];
```

```javascript
alternates: scoredCarriers.slice(1, 3).map(sc => ({
```

```javascript
/**
* Record carrier performance for future optimization
* @param {String} carrierId - Carrier ID
* @param {Object} performance - {zone, delivery_time_days, success, cost, weight}
*/
export const recordCarrierPerformance = async (carrierId, performance) => {
```

```javascript
/**
* Get all carriers matching zone
*/
export const getCarriersByZone = (zone) => {
```

```javascript
return Object.values(CARRIER_CONFIG).filter(c => c.zones.includes(zone));
```

```javascript
function calculateCarrierScore(carrier, order, historicalData) {
```

```javascript
function calculateShippingCost(carrier, order) {
```

## [carrierRateEngine.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/carrierRateEngine.js)
> Carrier Rate Engine - Calculate shipping rates based on weight, zone, and carrier
  Uses actual rate card logic for Pan-India logistics

```javascript
/**
* Carrier Rate Engine - Calculate shipping rates based on weight, zone, and carrier
* Uses actual rate card logic for Pan-India logistics
*/
export const CARRIER_RATES = {
```

```javascript
/**
* Preferred Carrier Matrix (Legacy Logic)
* Defines the 'Default' preferred carrier for specific zones or states
*/
export const PREFERRED_CARRIER_MATRIX = {
```

```javascript
/**
* Get zone for a destination
* @param {string} state
* @param {string} city
* @returns {string}
*/
export const getZone = (state, city = '') => {
```

```javascript
/**
* Calculate shipping rate for a carrier
* @param {string} carrierId
* @param {object} shipment - { weight, state, city, isCOD, codAmount }
* @returns {object}
*/
export const calculateRate = (carrierId, shipment) => {
```

```javascript
/**
* Get rates from all carriers
* @param {object} shipment
* @returns {object[]}
*/
export const getAllRates = (shipment) => {
```

```javascript
const rates = Object.keys(CARRIER_RATES).map(carrierId => {
```

```javascript
.filter(r => !r.error)
```

```javascript
.sort((a, b) => a.total - b.total);
```

```javascript
export const getRecommendation = (shipment, priority = 'smart') => {
```

```javascript
const options = rates.map(rate => {
```

```javascript
const minCost = Math.min(...rates.map(r => r.total));
```

```javascript
const maxCost = Math.max(...rates.map(r => r.total));
```

```javascript
const minDays = Math.min(...rates.map(r => r.estimatedDelivery[0]));
```

```javascript
const maxDays = Math.max(...rates.map(r => r.estimatedDelivery[0]));
```

```javascript
winner = options.sort((a, b) => a.scores.speed - b.scores.speed)[0];
```

```javascript
winner = options.sort((a, b) => a.scores.reliability - b.scores.reliability)[0];
```

```javascript
winner = options.sort((a, b) => a.scores.cost - b.scores.cost)[0];
```

```javascript
options.sort((a, b) => {
```

```javascript
const matrixCarrier = options.find(o => o.carrierId === matrixOverrideId);
```

```javascript
/**
* Check if pincode is serviceable
* @param {string} pincode
* @param {string} carrierId
* @returns {boolean}
*/
export const isPincodeServiceable = async (pincode, carrierId = null) => {
```

## [churnService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/churnService.js)
> Churn Service (Retention AI)
  Simulates AI-driven customer retention scoring and identification.

```javascript
/**
* Churn Service (Retention AI)
* Simulates AI-driven customer retention scoring and identification.
*/
class ChurnService {
```

```javascript
/**
* Calculate churn risk score for a customer based on activity.
* @param {Object} customer - Customer data
* @param {Array} orders - Customer's order history
* @returns {Object} { score, riskLevel, daysSinceLastOrder }
*/
const customerOrders = orders.filter(o => o.customerPhone === customer.phone);
```

```javascript
const lastOrderDate = customerOrders.reduce((latest, order) => {
```

```javascript
/**
* Get all "At Risk" customers for outreach.
* @param {Array} customers
* @param {Array} orders
* @returns {Array} Customers with HIGH or CRITICAL churn risk
*/
.map(customer => ({
```

```javascript
.filter(c => c.churn.riskLevel === 'HIGH' || c.churn.riskLevel === 'CRITICAL')
```

```javascript
.sort((a, b) => b.churn.score - a.churn.score);
```

## [complianceService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/complianceService.js)
> Compliance Service
  Handles HSN/SAC code mapping, GST calculations, and E-way bill generation.

```javascript
/**
* Compliance Service
* Handles HSN/SAC code mapping, GST calculations, and E-way bill generation.
*/
export const HSN_DATABASE = {
```

```javascript
class ComplianceService {
```

```javascript
/**
* Get HSN code for a given SKU.
* @param {string} sku - Product SKU
* @returns {string} HSN Code
*/
/**
* Get applicable GST rate based on SKU category.
* @param {string} sku
* @returns {number} GST percentage
*/
/**
* Determine if E-way bill is required.
* @param {number} invoiceValue
* @param {string} originState
* @param {string} destState
* @returns {boolean}
*/
/**
* Generate E-way bill data structure.
* @param {Object} order
* @returns {Object} E-way bill details
*/
export const validateHSN = (code) => service.validateHSN(code);
```

```javascript
export const getHSNCode = (sku) => service.getHSNCode(sku);
```

## [currencyService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/currencyService.js)
> Currency Service
  Provides multi-currency pricing support with simulated exchange rates.

```javascript
/**
* Currency Service
* Provides multi-currency pricing support with simulated exchange rates.
*/
class CurrencyService {
```

```javascript
return Object.entries(SUPPORTED_CURRENCIES).map(([code, data]) => ({
```

## [dataUtilsOptimized.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/dataUtilsOptimized.js)
> DataUtilsOptimized.js
  Optimized data processing utilities for order management
  Includes deduplication, merging, validation, and transformation functions

```javascript
/**
* DataUtilsOptimized.js
* Optimized data processing utilities for order management
* Includes deduplication, merging, validation, and transformation functions
*/
class DataUtilsOptimized {
```

```javascript
/**
* Deduplicate orders by removing duplicate entries
* Keeps the most recent version of each order
*/
.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
```

```javascript
.filter(order => {
```

```javascript
/**
* Merge orders from multiple sources intelligently
* Resolves conflicts by prioritizing recent updates
*/
localOrders.forEach(order => {
```

```javascript
remoteOrders.forEach(remoteOrder => {
```

```javascript
/**
* Validate order data structure
*/
const missing = required.filter(field => !order[field]);
```

```javascript
/**
* Filter orders by multiple criteria
*/
return orders.filter(order => {
```

```javascript
/**
* Group orders by a specific field
*/
orders.forEach(order => {
```

```javascript
/**
* Sort orders by field and direction
*/
sorted.sort((a, b) => {
```

```javascript
/**
* Calculate summary statistics for orders
*/
const totalAmount = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
```

```javascript
orders.forEach(order => {
```

```javascript
/**
* Transform order fields to standard format
*/
/**
* Batch normalize multiple orders
*/
return orders.map(order => this.normalizeOrder(order));
```

```javascript
/**
* Export orders to CSV format
*/
const rows = orders.map(order => [
```

```javascript
...rows.map(row => row.map(cell => `"${cell}"`).join(','))
```

## [dealerService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/dealerService.js)
> Dealer Service
  Handles wholesale logic, credit limits, and tiered pricing for B2B partners.

```javascript
/**
* Dealer Service
* Handles wholesale logic, credit limits, and tiered pricing for B2B partners.
*/
class DealerService {
```

## [errorHandlerService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/errorHandlerService.js)
> Log an error

```javascript
/**
* Log an error
*/
export const logError = (error, context = {}) => {
```

```javascript
/**
* Get all error logs
*/
export const getErrorLogs = (limit = 50) => {
```

```javascript
/**
* Clear error logs
*/
export const clearErrorLogs = () => {
```

```javascript
/**
* Handle and recover from common errors
*/
export const handleError = (error, recovery = {}) => {
```

```javascript
/**
* Convert HTTP status to error type
*/
export const getErrorType = (status) => {
```

```javascript
/**
* Create error object
*/
export const createError = (message, type, severity = ERROR_SEVERITY.MEDIUM, status = 500) => {
```

## [forecastService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/forecastService.js)
> Demand Forecasting Service
  Provides insights into future order volumes based on historical data.

```javascript
/**
* Demand Forecasting Service
* Provides insights into future order volumes based on historical data.
*/
/**
* Calculate Simple Moving Average (SMA) for order volumes
* @param {Array} orders - List of order objects
* @param {number} days - Number of days to look back
* @param {number} forecastDays - Number of days to forecast ahead
* @returns {Array} List of { date, actual, forecast } objects
*/
export const calculateSMAForecast = (orders, days = 30, forecastDays = 7) => {
```

```javascript
orders.forEach(order => {
```

```javascript
const sma = window.reduce((a, b) => a + b, 0) / window.length;
```

```javascript
/**
* Predict future demand for a specific SKU
* @param {Array} orders - List of all orders
* @param {string} sku - SKU code
* @param {number} days - Historical window
* @returns {number} Predicted quantity needed for next 30 days
*/
export const predictSKUDemand = (orders, sku, days = 30) => {
```

```javascript
const skuOrders = orders.filter(o => o.sku === sku);
```

```javascript
const totalQuantity = skuOrders.reduce((sum, o) => sum + (parseInt(o.quantity) || 1), 0);
```

```javascript
/**
* Predict arrival date for a vendor shipment based on historical lead times
* @param {string} vendorId
* @param {string} sku
* @returns {Object} { predictedDate, riskLevel }
*/
export const predictVendorArrival = (vendorId, sku) => {
```

## [handoffService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/handoffService.js)
> Handoff Service
  Automates the creation of session summaries and prepares the repository for agent transitions.

```javascript
/**
* Handoff Service
* Automates the creation of session summaries and prepares the repository for agent transitions.
*/
class HandoffService {
```

```javascript
/**
* Identifies modified files in the current session using git or timestamps.
* @returns {Array<string>} List of modified file paths.
*/
.filter(line => line.trim() !== '')
```

```javascript
.map(line => line.slice(3).trim());
```

## [healthCheck.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/healthCheck.js)
> Health Check Service
  Verifies connectivity to critical APIs and services.

```javascript
/**
* Health Check Service
* Verifies connectivity to critical APIs and services.
*/
class HealthCheckService {
```

```javascript
/**
* Check a single service health.
* @param {string} serviceName
* @returns {Promise<Object>} { service, status, latency }
*/
await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
```

```javascript
/**
* Run health checks on all services.
* @returns {Promise<Object>} Full health status
*/
Object.keys(this.endpoints).map(service => this.checkService(service))
```

```javascript
const healthy = results.filter(r => r.status === 'healthy').length;
```

## [internationalService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/internationalService.js)
> International Operations Service
  
  Handles multi-currency conversion, international shipping calculations,
  and cross-border compliance (HSN/VAT/Duty).

```javascript
/**
* International Operations Service
*
* Handles multi-currency conversion, international shipping calculations,
* and cross-border compliance (HSN/VAT/Duty).
*/
export const CURRENCY_DATABASE = {
```

```javascript
/**
* Convert amount from INR to target currency
* @param {number} amount - Amount in INR
* @param {string} targetCurrency - Target currency code
* @returns {object} - { value, symbol, formatted }
*/
export const convertFromINR = (amount, targetCurrency = 'USD') => {
```

```javascript
/**
* Get International Shipping Estimate
* @param {string} country - Destination country
* @param {number} weight - Weight in KG
* @returns {number} - Estimated shipping cost in INR
*/
export const getInternationalShippingEstimate = (country, weight) => {
```

```javascript
/**
* Calculate Cross-Border Duties & Taxes (Placeholder)
* @param {number} productValue - Value in INR
* @param {string} destinationCountry
* @returns {object} - Duty breakdown
*/
export const calculateCrossBorderDuty = (productValue, destinationCountry) => {
```

## [internationalShippingService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/internationalShippingService.js)
> International Shipping Service
  
  API stubs for international carriers (DHL, FedEx, Aramex).
  These will be connected to live APIs when credentials are available.

```javascript
/**
* International Shipping Service
*
* API stubs for international carriers (DHL, FedEx, Aramex).
* These will be connected to live APIs when credentials are available.
*/
/**
* Determine shipping zone for a country
* @param {string} country
* @returns {string}
*/
const getZoneForCountry = (country) => {
```

```javascript
/**
* Get shipping rate estimate for international carrier
* @param {string} carrierId
* @param {string} country
* @param {number} weight
* @returns {object}
*/
export const getInternationalRate = (carrierId, country, weight) => {
```

```javascript
/**
* Get all international carrier rates for comparison
* @param {string} country
* @param {number} weight
* @returns {object[]}
*/
export const compareInternationalRates = (country, weight) => {
```

```javascript
return Object.keys(CARRIERS).map(key => {
```

```javascript
}).filter(Boolean).sort((a, b) => a.total - b.total);
```

```javascript
/**
* Create shipment (MOCK)
* @param {object} order
* @param {string} carrierId
* @returns {Promise<object>}
*/
export const createInternationalShipment = async (order, carrierId) => {
```

```javascript
await new Promise(resolve => setTimeout(resolve, 800));
```

```javascript
/**
* Track international shipment (MOCK)
* @param {string} trackingNumber
* @returns {Promise<object>}
*/
export const trackInternationalShipment = async (trackingNumber) => {
```

```javascript
await new Promise(resolve => setTimeout(resolve, 500));
```

## [keyboardShortcuts.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/keyboardShortcuts.js)
> Initialize keyboard shortcuts system
  @param {Object} customShortcuts - Optional custom shortcuts to add

```javascript
/**
* Initialize keyboard shortcuts system
* @param {Object} customShortcuts - Optional custom shortcuts to add
*/
export const initializeShortcuts = (customShortcuts = {}) => {
```

```javascript
Object.entries(DEFAULT_SHORTCUTS).forEach(([combo, config]) => {
```

```javascript
Object.entries(customShortcuts).forEach(([combo, config]) => {
```

```javascript
/**
* Register a keyboard shortcut
* @param {String} shortcut - Key combination (e.g., 'Ctrl+K', 'Shift+Alt+S')
* @param {String|Function} callback - Action name or callback function
* @param {Object} options - Options { description, scope }
*/
export const registerShortcut = (shortcut, callback, options = {}) => {
```

```javascript
return () => unregisterShortcut(shortcut);
```

```javascript
export const unregisterShortcut = (shortcut) => {
```

```javascript
/**
* Bind a shortcut to a callback function (for named actions)
* @param {String} action - Action name
* @param {Function} callback - Function to execute
*/
export const bindAction = (action, callback) => {
```

```javascript
config.callback = callback; // Rebind string action to function
```

```javascript
/**
* Get all registered shortcuts
* @returns {Array} - Array of {combo, action, description}
*/
export const getAllShortcuts = () => {
```

```javascript
return Array.from(shortcuts.entries()).map(([combo, config]) => ({
```

```javascript
export const getShortcuts = getAllShortcuts;
```

```javascript
/**
* Format shortcut for display (e.g. 'ctrl+k' -> 'Ctrl + K')
*/
export const formatShortcut = (combo) => {
```

```javascript
.map(part => part.charAt(0).toUpperCase() + part.slice(1))
```

```javascript
/**
* Toggle shortcuts on/off
*/
export const toggleShortcuts = (enable = null) => {
```

```javascript
/**
* Remove a shortcut
*/
export const removeShortcut = (combo) => {
```

```javascript
/**
* Cleanup and remove all listeners
*/
export const cleanup = () => {
```

```javascript
/**
* Destroy shortcuts (Alias for cleanup)
*/
export const destroyShortcuts = cleanup;
```

```javascript
/**
* Register default shortcuts (Helper)
*/
export const registerDefaultShortcuts = (actionsMap) => {
```

```javascript
Object.entries(actionsMap).forEach(([actionName, callback]) => {
```

```javascript
function parseShortcut(shortcut) {
```

```javascript
function parseKeyCombo(event) {
```

```javascript
function handleKeyDown(event) {
```

```javascript
if (typeof config.callback === 'function') {
```

```javascript
} else if (typeof config.action === 'function') {
```

```javascript
export const initShortcuts = initializeShortcuts; // Alias
```

## [keyboardShortcutsEnhanced.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/keyboardShortcutsEnhanced.js)
> KeyboardShortcutsEnhanced.js
  Global keyboard shortcuts for Bluewud OTS application
  Supports custom shortcuts, command palette, and global hotkeys

```javascript
/**
* KeyboardShortcutsEnhanced.js
* Global keyboard shortcuts for Bluewud OTS application
* Supports custom shortcuts, command palette, and global hotkeys
*/
class KeyboardShortcutsEnhanced {
```

```javascript
document.addEventListener('keydown', (e) => this.handleKeyDown(e));
```

```javascript
return ['ctrl', 'alt'].some(mod => {
```

```javascript
const callbacks = this.listeners.filter(l => l.action === action);
```

```javascript
callbacks.forEach(callback => {
```

```javascript
this.listeners = this.listeners.filter(l =>
```

```javascript
return this.commandPalette.filter(cmd =>
```

```javascript
imported.forEach(([key, { action, handler }]) => {
```

```javascript
this.addCustomShortcut(key, action, handler || (() => {}));
```

## [labelGeneratorEnhanced.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/labelGeneratorEnhanced.js)
> LabelGeneratorEnhanced.js
  Enhanced shipping label generation for multiple carriers
  Supports Delhivery, BlueDart, XpressBees, and other logistics partners

```javascript
/**
* LabelGeneratorEnhanced.js
* Enhanced shipping label generation for multiple carriers
* Supports Delhivery, BlueDart, XpressBees, and other logistics partners
*/
class LabelGeneratorEnhanced {
```

```javascript
/**
* Generate shipping label for an order
*/
/**
* Validate order has required fields for label generation
*/
required.forEach(field => {
```

```javascript
/**
* Generate Delhivery label format
*/
contents: items.map(item => `${item.quantity}x ${item.name}`).join('; ')
```

```javascript
/**
* Generate BlueDart label format
*/
product: items.map(i => i.name).join(', ')
```

```javascript
/**
* Generate XpressBees label format
*/
description: items.map(i => i.name).join(', ')
```

```javascript
/**
* Route to appropriate carrier label generator
*/
/**
* Calculate total weight from items
*/
return items.reduce((total, item) => total + (item.weight || 0.5), 0);
```

## [labelPrintService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/labelPrintService.js)
> Label & Print Service - Generate shipping labels, manifests, and invoices
  Uses browser print APIs with proper formatting for thermal printers

```javascript
/**
* Label & Print Service - Generate shipping labels, manifests, and invoices
* Uses browser print APIs with proper formatting for thermal printers
*/
export const LABEL_SIZES = {
```

```javascript
const generateBarcode128 = (text) => {
```

```javascript
return text.split('').map(c => {
```

```javascript
/**
* Generate HTML for a shipping label
* @param {object} order - Order data
* @param {string} size - Label size key
* @returns {string} - HTML content
*/
export const generateLabelHTML = (order, size = '4x6') => {
```

```javascript
/**
* Print a shipping label
* @param {object} order
* @param {string} size
*/
export const printLabel = (order, size = '4x6') => {
```

```javascript
printWindow.onload = () => {
```

```javascript
/**
* Generate manifest/pickup sheet for multiple orders
* @param {object[]} orders
* @param {string} carrier
* @returns {string} - HTML content
*/
export const generateManifestHTML = (orders, carrier = 'All Carriers') => {
```

```javascript
const rows = orders.map((order, idx) => `
```

```javascript
/**
* Print manifest
* @param {object[]} orders
* @param {string} carrier
*/
export const printManifest = (orders, carrier) => {
```

```javascript
printWindow.onload = () => printWindow.print();
```

```javascript
/**
* Generate packing slip
* @param {object} order
* @returns {string}
*/
export const generatePackingSlipHTML = (order) => {
```

```javascript
/**
* Download labels as PDF (opens print dialog)
* @param {object[]} orders
* @param {string} size
*/
export const batchPrintLabels = (orders, size = '4x6') => {
```

```javascript
orders.forEach((order, idx) => {
```

```javascript
setTimeout(() => {
```

## [localizationService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/localizationService.js)
> Localization Service
  
  Provides locale-specific formatting and translations for
  international market support.

```javascript
/**
* Localization Service
*
* Provides locale-specific formatting and translations for
* international market support.
*/
/**
* Set the active locale
* @param {string} locale
*/
export const setLocale = (locale) => {
```

```javascript
/**
* Get active locale
* @returns {string}
*/
export const getLocale = () => {
```

```javascript
/**
* Format currency based on locale
* @param {number} value
* @param {string} localeOverride
* @returns {string}
*/
export const formatCurrency = (value, localeOverride = null) => {
```

```javascript
/**
* Format date based on locale
* @param {Date|string} date
* @param {string} localeOverride
* @returns {string}
*/
export const formatDate = (date, localeOverride = null) => {
```

```javascript
/**
* Get all available locales
* @returns {object[]}
*/
export const getAvailableLocales = () => {
```

```javascript
return Object.entries(LOCALES).map(([code, data]) => ({
```

## [localizedTemplateService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/localizedTemplateService.js)
> Localized Template Service
  
  Generates invoices, packing slips, and labels in target locale languages.

```javascript
/**
* Localized Template Service
*
* Generates invoices, packing slips, and labels in target locale languages.
*/
/**
* Get localized template data
* @param {string} templateType - 'invoice', 'packingSlip', 'label'
* @param {string} locale - Target locale
* @returns {object}
*/
export const getTemplate = (templateType, locale = null) => {
```

```javascript
/**
* Generate localized invoice HTML
* @param {object} order
* @param {object[]} items
* @param {string} locale
* @returns {string}
*/
export const generateLocalizedInvoice = (order, items = [], locale = null) => {
```

```javascript
const itemsHtml = items.map((item, idx) => `
```

```javascript
/**
* Get supported locales for a template type
* @param {string} templateType
* @returns {string[]}
*/
export const getSupportedLocales = (templateType) => {
```

## [marginProtectionService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/marginProtectionService.js)
> AI-Powered Margin Protection Service
  
  Protects profitability by analyzing orders and flagged those that fall
  below acceptable margin thresholds based on real-time cost data.

```javascript
/**
* AI-Powered Margin Protection Service
*
* Protects profitability by analyzing orders and flagged those that fall
* below acceptable margin thresholds based on real-time cost data.
*/
/**
* Get system-wide margin thresholds
*/
export const getMarginThresholds = () => {
```

```javascript
export const validateMargin = (order, skuData) => {
```

```javascript
/**
* Batch analyze recent orders for margin leakage
* @param {object[]} orders
* @param {object[]} skuMaster
* @returns {object[]} - Flagged orders
*/
export const detectMarginLeakage = (orders, skuMaster) => {
```

```javascript
return orders.map(order => {
```

```javascript
const skuData = skuMaster.find(s => s.sku === order.sku);
```

```javascript
}).filter(o => o.marginAlert !== null);
```

## [marketplaceService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/marketplaceService.js)
> Marketplace Sync Service
  Handles communication (stubs) with Amazon SP-API and Flipkart API.

```javascript
/**
* Marketplace Sync Service
* Handles communication (stubs) with Amazon SP-API and Flipkart API.
*/
/**
* Fetch new orders from Amazon SP-API
*/
export const fetchAmazonOrders = async () => {
```

```javascript
/**
* Fetch new orders from Flipkart API
*/
export const fetchFlipkartOrders = async () => {
```

```javascript
/**
* Push inventory levels to all marketplaces
*/
export const syncInventoryToMarketplaces = async (inventoryLevels) => {
```

## [mlForecastService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/mlForecastService.js)
> ML Forecast Service
  Advanced demand forecasting using additive trend-seasonal decomposition.

```javascript
/**
* ML Forecast Service
* Advanced demand forecasting using additive trend-seasonal decomposition.
*/
class MLForecastService {
```

```javascript
/**
* Predict demand for a specific SKU.
* @param {Array} orders - Historical orders
* @param {string} sku - SKU ID
* @param {number} forecastDays - Days to predict
* @returns {Object} Forecast results with decomposition
*/
.filter(o => o.sku === sku)
```

```javascript
.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
```

```javascript
const values = dailyData.map(d => d.quantity);
```

```javascript
avgDemand: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
```

```javascript
/**
* Predict when an item will go out of stock.
*/
orders.forEach(o => {
```

```javascript
const residuals = values.map((v, i) => v - (trend.slope * i + trend.intercept));
```

```javascript
const seasonal = Array(7).fill(0).map(() => []);
```

```javascript
residuals.forEach((r, i) => {
```

```javascript
return seasonal.map(dayValues => {
```

```javascript
return dayValues.reduce((a, b) => a + b, 0) / dayValues.length;
```

```javascript
const avg = values.reduce((a, b) => a + b, 0) / values.length;
```

```javascript
const squareDiffs = values.map(v => Math.pow(v - avg, 2));
```

```javascript
return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length) || 0;
```

```javascript
.reduce((sum, day) => sum + day.quantity, 0);
```

## [notificationService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/notificationService.js)
> Notification Service - Centralized notification management
  Handles in-app notifications, with hooks for future email/SMS/WhatsApp

```javascript
/**
* Notification Service - Centralized notification management
* Handles in-app notifications, with hooks for future email/SMS/WhatsApp
*/
export const NOTIFICATION_TYPES = {
```

```javascript
/**
* Create a notification
* @param {object} params
* @returns {object} - Created notification
*/
export const createNotification = ({
```

```javascript
}) => {
```

```javascript
listeners.forEach(callback => callback(notification));
```

```javascript
/**
* Get all notifications
* @param {object} filters
* @returns {object[]}
*/
export const getNotifications = (filters = {}) => {
```

```javascript
result = result.filter(n => !n.read);
```

```javascript
result = result.filter(n => n.type === filters.type);
```

```javascript
result = result.filter(n => n.priority === filters.priority);
```

```javascript
/**
* Mark notification as read
* @param {string} notificationId
*/
export const markAsRead = (notificationId) => {
```

```javascript
const notif = notifications.find(n => n.id === notificationId);
```

```javascript
/**
* Mark all notifications as read
*/
export const markAllAsRead = () => {
```

```javascript
notifications.forEach(n => {
```

```javascript
/**
* Get unread count
* @returns {number}
*/
export const getUnreadCount = () => {
```

```javascript
return notifications.filter(n => !n.read).length;
```

```javascript
/**
* Subscribe to new notifications
* @param {function} callback
* @returns {function} - Unsubscribe function
*/
export const subscribe = (callback) => {
```

```javascript
return () => {
```

```javascript
listeners = listeners.filter(l => l !== callback);
```

```javascript
/**
* Clear all notifications
*/
export const clearAll = () => {
```

```javascript
export const notifyOrderCreated = (order) => {
```

```javascript
export const notifyOrderShipped = (order) => {
```

```javascript
export const notifyOrderDelivered = (order) => {
```

```javascript
export const notifyOrderRTO = (order, reason) => {
```

```javascript
export const notifyLowStock = (sku, currentStock, reorderLevel) => {
```

```javascript
export const notifyBulkImport = (count, source) => {
```

```javascript
export const notifyCODPending = (count, amount) => {
```

## [offlineCacheService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/offlineCacheService.js)
> Offline Cache Service
  IndexedDB wrapper for offline-first data persistence
  
  Features:
  - Simple key-value storage
  - Automatic schema initialization
  - TTL support for data expiration
  - Batch operations
  - Sync state tracking

```javascript
/**
* Offline Cache Service
* IndexedDB wrapper for offline-first data persistence
*
* Features:
* - Simple key-value storage
* - Automatic schema initialization
* - TTL support for data expiration
* - Batch operations
* - Sync state tracking
*/
class OfflineCacheService {
```

```javascript
/**
* Initializes IndexedDB
* @returns {Promise<void>}
*/
return new Promise((resolve, reject) => {
```

```javascript
request.onerror = () => {
```

```javascript
request.onsuccess = () => {
```

```javascript
request.onupgradeneeded = (event) => {
```

```javascript
Object.entries(this.stores).forEach(([storeName, config]) => {
```

```javascript
(config.indexes || []).forEach(indexName => {
```

```javascript
/**
* Caches data in IndexedDB
* @param {string} storeName - Object store name
* @param {string} key - Data key (optional for auto-increment or keyPath based)
* @param {*} data - Data to cache
* @param {number} ttl - Time to live in milliseconds (optional)
* @returns {Promise<boolean>}
*/
return new Promise((resolve, reject) => {
```

```javascript
request.onsuccess = () => resolve(true);
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
/**
* Retrieves cached data
*/
return new Promise((resolve, reject) => {
```

```javascript
request.onsuccess = () => {
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onsuccess = () => resolve(request.result);
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onsuccess = () => resolve(true);
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onsuccess = () => resolve(true);
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
export const initOfflineCacheService = () => {
```

```javascript
export const cacheData = (store, key, data) => cacheInstance.cacheData(store, key, data);
```

```javascript
export const retrieveCachedData = (store, key) => cacheInstance.retrieveCachedData(store, key);
```

```javascript
export const clearCache = (store) => cacheInstance.clearStore(store);
```

```javascript
export const getOfflineCacheService = () => cacheInstance;
```

## [orderStateMachine.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/orderStateMachine.js)
> Order State Machine - Manages valid order status transitions
  Ensures business logic is enforced for order lifecycle

```javascript
/**
* Order State Machine - Manages valid order status transitions
* Ensures business logic is enforced for order lifecycle
*/
export const ORDER_STATUSES = {
```

```javascript
export const STATUS_META = {
```

```javascript
/**
* Check if a status transition is valid
* @param {string} currentStatus
* @param {string} newStatus
* @returns {boolean}
*/
export const isValidTransition = (currentStatus, newStatus) => {
```

```javascript
/**
* Get all valid next statuses for a given status
* @param {string} currentStatus
* @returns {string[]}
*/
export const getValidNextStatuses = (currentStatus) => {
```

```javascript
/**
* Transition an order to a new status with validation
* @param {object} order - Current order object
* @param {string} newStatus - Target status
* @param {object} metadata - Additional metadata (reason, user, etc.)
* @returns {object} - Updated order or error
*/
export const transitionOrder = (order, newStatus, metadata = {}) => {
```

```javascript
/**
* Bulk transition multiple orders
* @param {object[]} orders - Array of orders
* @param {string} newStatus - Target status
* @param {object} metadata - Additional metadata
* @returns {object} - Results with success/failure counts
*/
export const bulkTransition = (orders, newStatus, metadata = {}) => {
```

```javascript
orders.forEach(order => {
```

```javascript
/**
* Calculate order metrics from status history
* @param {object} order
* @returns {object} - Metrics like processing time, transit time, etc.
*/
export const calculateOrderMetrics = (order) => {
```

```javascript
const createdAt = history.find(h => h.to === ORDER_STATUSES.PENDING)?.timestamp;
```

```javascript
const pickedAt = history.find(h => h.to === ORDER_STATUSES.PICKED_UP)?.timestamp;
```

```javascript
const deliveredAt = history.find(h => h.to === ORDER_STATUSES.DELIVERED)?.timestamp;
```

## [pushNotificationService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/pushNotificationService.js)
> Push Notification Service
  Manages web push notifications for real-time alerts
  
  Features:
  - Service Worker integration
  - Subscription management
  - Notification persistence
  - Badge & icon management
  - Notification click handling

```javascript
/**
* Push Notification Service
* Manages web push notifications for real-time alerts
*
* Features:
* - Service Worker integration
* - Subscription management
* - Notification persistence
* - Badge & icon management
* - Notification click handling
*/
class PushNotificationService {
```

```javascript
/**
* Initializes the Push Notification Service
* @returns {Promise<void>}
*/
navigator.serviceWorker.addEventListener('message', (event) => {
```

```javascript
/**
* Requests and registers push subscription
* @param {string} userId - User ID
* @returns {Promise<object>} Subscription object
*/
/**
* Unsubscribes from push notifications
* @param {string} userId - User ID
* @returns {Promise<boolean>} Success status
*/
/**
* Sends notification to user
* @param {string} title - Notification title
* @param {object} options - Notification options
* @returns {Promise<void>}
*/
/**
* Sends order status update notification
* @param {object} order - Order object
* @returns {Promise<void>}
*/
/**
* Handles notification click
* @param {object} data - Notification data
*/
/**
* Gets current subscription status
* @param {string} userId - User ID
* @returns {object} Subscription status
*/
/**
* Persists subscription to backend
* @param {string} userId - User ID
* @param {object} subscription - Subscription object
* @returns {Promise<boolean>}
*/
/**
* Removes subscription from backend
* @param {string} userId - User ID
* @returns {Promise<boolean>}
*/
/**
* Converts VAPID public key from base64 to Uint8Array
* @param {string} base64String - Base64 encoded key
* @returns {Uint8Array}
*/
export const initPushNotificationService = (key) => {
```

```javascript
export const getPushNotificationService = () => pushNotificationInstance;
```

## [qcService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/qcService.js)
> QC Service (AI Integration)
  Simulates high-fidelity computer vision for quality control during GRN.

```javascript
/**
* QC Service (AI Integration)
* Simulates high-fidelity computer vision for quality control during GRN.
*/
class QCService {
```

```javascript
/**
* Simulates an AI scan of receiving packages.
* @returns {Promise<Object>} Scan results
*/
return new Promise((resolve) => {
```

```javascript
setTimeout(() => {
```

## [rateLimitService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/rateLimitService.js)
> Create or get rate limiter for an endpoint

```javascript
/**
* Create or get rate limiter for an endpoint
*/
export const getRateLimiter = (endpoint, maxRequests = 100, windowMs = 60000) => {
```

```javascript
/**
* Check if request is allowed
* @returns {Object} {allowed, remaining, resetTime, retryAfter}
*/
export const checkLimit = (endpoint, maxRequests = 100, windowMs = 60000) => {
```

```javascript
limiter.requests = limiter.requests.filter(time => now - time < windowMs);
```

```javascript
/**
* Middleware function for express/fastify
*/
export const rateLimitMiddleware = (maxRequests = 100, windowMs = 60000) => {
```

```javascript
return (req, res, next) => {
```

```javascript
/**
* Reset limiter for an endpoint
*/
export const resetLimiter = (endpoint) => {
```

```javascript
/**
* Get current status of all limiters
*/
export const getStatus = () => {
```

```javascript
requests: limiter.requests.filter(time => now - time < limiter.windowMs).length,
```

## [rbacMiddleware.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/rbacMiddleware.js)
> RBAC Middleware Utility
  Defines permissions and roles for the Bluewud OTS ecosystem.

```javascript
/**
* RBAC Middleware Utility
* Defines permissions and roles for the Bluewud OTS ecosystem.
*/
export const ROLES = {
```

```javascript
export const PERMISSIONS = {
```

```javascript
/**
* Check if a user has a specific permission.
* @param {Object} user - User object containing role
* @param {string} permission - Permission key
* @returns {boolean}
*/
export const can = (user, permission) => {
```

```javascript
/**
* Components wrapper for RBAC
*/
export const Guard = ({ user, permission, children, fallback = null }) => {
```

## [retryService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/retryService.js)
> Retry a function with exponential backoff
  @param {Function} fn - Async function to retry
  @param {Object} options - Retry options
  @returns {Promise} - Result of the function

```javascript
/**
* Retry a function with exponential backoff
* @param {Function} fn - Async function to retry
* @param {Object} options - Retry options
* @returns {Promise} - Result of the function
*/
export const retryWithBackoff = async (fn, options = {}) => {
```

```javascript
shouldRetry = (err) => true,
```

```javascript
new Promise((_, reject) =>
```

```javascript
() => reject(new Error(`${name} timeout after ${timeout}ms`)),
```

```javascript
await new Promise(resolve => setTimeout(resolve, delay));
```

```javascript
/**
* Wrap a function to automatically retry on failure
*/
export const withRetry = (fn, options = {}) => {
```

```javascript
return (...args) => retryWithBackoff(() => fn(...args), options);
```

```javascript
/**
* Retry logic for API calls with smart error detection
*/
export const retryApiCall = async (apiCall, options = {}) => {
```

```javascript
shouldRetry: (err) => {
```

```javascript
/**
* Circuit breaker pattern - prevent cascading failures
*/
export const circuitBreaker = (fn, options = {}) => {
```

```javascript
return async (...args) => {
```

```javascript
new Promise((_, reject) =>
```

```javascript
setTimeout(() => reject(new Error('Circuit breaker timeout')), timeout)
```

## [reverseLogisticsService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/reverseLogisticsService.js)
> Reverse Logistics Service
  Manages Return Merchandise Authorizations (RMA) and reverse shipment tracking.

```javascript
/**
* Reverse Logistics Service
* Manages Return Merchandise Authorizations (RMA) and reverse shipment tracking.
*/
class ReverseLogisticsService {
```

## [rtoService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/rtoService.js)
> RTO Service
  Intelligence layer for predicting Return-to-Origin (RTO) risk.
  Analysis based on payment method, pincode history, and customer behavior.

```javascript
/**
* RTO Service
* Intelligence layer for predicting Return-to-Origin (RTO) risk.
* Analysis based on payment method, pincode history, and customer behavior.
*/
class RTOService {
```

## [searchService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/searchService.js)
> Search Service - Unified search across orders, customers, and SKUs
  Supports fuzzy matching, filters, and recent searches

```javascript
/**
* Search Service - Unified search across orders, customers, and SKUs
* Supports fuzzy matching, filters, and recent searches
*/
/**
* Get search history from localStorage
*/
export const getSearchHistory = () => {
```

```javascript
/**
* Add to search history
* @param {string} query
* @param {string} type
*/
export const addToHistory = (query, type = 'general') => {
```

```javascript
const filtered = history.filter(h => h.query.toLowerCase() !== query.toLowerCase());
```

```javascript
/**
* Clear search history
*/
export const clearHistory = () => {
```

```javascript
/**
* Fuzzy match score (simple implementation)
* @param {string} text
* @param {string} query
* @returns {number} - Score 0-100
*/
const fuzzyScore = (text, query) => {
```

```javascript
/**
* Search orders
* @param {object[]} orders
* @param {string} query
* @param {object} filters
* @returns {object[]}
*/
export const searchOrders = (orders, query, filters = {}) => {
```

```javascript
let results = orders.map(order => {
```

```javascript
}).filter(order => order._searchScore > 20);
```

```javascript
results = results.filter(o => o.status === filters.status);
```

```javascript
results = results.filter(o => o.source === filters.source);
```

```javascript
results = results.filter(o => o.carrier === filters.carrier);
```

```javascript
results = results.filter(o => new Date(o.createdAt) >= new Date(filters.dateFrom));
```

```javascript
results = results.filter(o => new Date(o.createdAt) <= new Date(filters.dateTo));
```

```javascript
return results.sort((a, b) => b._searchScore - a._searchScore);
```

```javascript
/**
* Search customers (extract unique from orders)
* @param {object[]} orders
* @param {string} query
* @returns {object[]}
*/
export const searchCustomers = (orders, query) => {
```

```javascript
orders.forEach(order => {
```

```javascript
return customers.map(customer => {
```

```javascript
}).filter(c => c._searchScore > 20)
```

```javascript
.sort((a, b) => b._searchScore - a._searchScore);
```

```javascript
/**
* Search SKUs
* @param {object[]} skuMaster
* @param {string} query
* @returns {object[]}
*/
export const searchSKUs = (skuMaster, query) => {
```

```javascript
return skuMaster.map(sku => {
```

```javascript
}).filter(s => s._searchScore > 20)
```

```javascript
.sort((a, b) => b._searchScore - a._searchScore);
```

```javascript
/**
* Universal search across all entities
* @param {object} data - { orders, skuMaster }
* @param {string} query
* @returns {object} - Grouped results
*/
export const universalSearch = (data, query) => {
```

```javascript
/**
* Quick lookup by exact ID
* @param {object[]} orders
* @param {string} id - Order ID or AWB
* @returns {object|null}
*/
export const quickLookup = (orders, id) => {
```

```javascript
return orders.find(o =>
```

## [securityServices.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/securityServices.js)
> SecurityServices.js
  Comprehensive security features for Bluewud OTS
  Includes 2FA, IP whitelist, rate limiting, encryption, and audit logging

```javascript
/**
* SecurityServices.js
* Comprehensive security features for Bluewud OTS
* Includes 2FA, IP whitelist, rate limiting, encryption, and audit logging
*/
class SecurityServices {
```

```javascript
/**
* Generate and send 2FA code via email/SMS
*/
/**
* Verify 2FA code
*/
/**
* Add IP to whitelist
*/
/**
* Remove IP from whitelist
*/
/**
* Check if IP is whitelisted
*/
/**
* Get all whitelisted IPs
*/
/**
* Rate limiting check
*/
/**
* Track failed login attempts
*/
/**
* Check if account is locked
*/
/**
* Clear failed attempts on successful login
*/
/**
* Generate secure session token
*/
/**
* Validate session token
*/
/**
* Revoke session token
*/
/**
* Generate OTP (One Time Password)
*/
/**
* Generate secure random token
*/
.map(b => b.toString(16).padStart(2, '0'))
```

```javascript
/**
* Send OTP via email
*/
/**
* Send OTP via SMS
*/
/**
* Log security audit event
*/
/**
* Get audit log
*/
logs = logs.filter(l => l.userId === userId);
```

## [supplyChainService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/supplyChainService.js)
> supplyChainService.js
  Logic for batch-level inventory tracking and vendor management.

```javascript
/**
* supplyChainService.js
* Logic for batch-level inventory tracking and vendor management.
*/
/**
* Allocate stock using FIFO (First-In, First-Out)
* @param {Array} batches - Current batches for a SKU
* @param {number} quantity - Quantity needed
* @returns {Object} { allocatedBatches, remainingQuantity }
*/
export const allocateFIFO = (batches, quantity) => {
```

```javascript
const sortedBatches = [...batches].sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt));
```

```javascript
/**
* Get all active vendors
*/
export const getVendors = () => VENDORS;
```

```javascript
/**
* Predict shortages based on inventory levels, forecast demand and lead times
* @param {Array} inventory - Consolidated inventory list
* @param {Array} orders - Historical orders for forecasting
* @returns {Array} List of shortage alerts
*/
export const getShortagePredictions = (inventory, orders) => {
```

```javascript
inventory.forEach(item => {
```

```javascript
const skuOrders = orders.filter(o => o.sku === item.sku);
```

```javascript
const totalQty = skuOrders.reduce((sum, o) => sum + (parseInt(o.quantity) || 1), 0);
```

```javascript
return alerts.sort((a, b) => (a.urgency === 'CRITICAL' ? -1 : 1));
```

## [vendorService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/vendorService.js)
> Vendor Service
  Manages supply chain partners and tracks historical lead-time performance.

```javascript
/**
* Vendor Service
* Manages supply chain partners and tracks historical lead-time performance.
*/
class VendorService {
```

```javascript
return VENDORS.find(v => v.id === id);
```

## [warehouseOptimizer.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/warehouseOptimizer.js)
> Warehouse Optimizer Service
  Intelligent multi-warehouse routing and fulfillment optimization.

```javascript
/**
* Warehouse Optimizer Service
* Intelligent multi-warehouse routing and fulfillment optimization.
*/
class WarehouseOptimizer {
```

```javascript
/**
* Get all available warehouses.
*/
/**
* Calculate distance between two coordinates (Simplified Haversine)
*/
/**
* Find optimal warehouse based on pincode.
*/
/**
* Find optimal warehouse based on state.
*/
/**
* Smart warehouse selection considering load balancing and proximity.
*/
.filter(wh => (currentLoads[wh.id] || 0) < wh.capacity * 0.95)
```

```javascript
.map(wh => ({
```

```javascript
.sort((a, b) => a.distance - b.distance);
```

```javascript
.sort((a, b) => {
```

```javascript
/**
* Get warehouse utilization metrics.
*/
return Object.values(this.warehouses).map(wh => {
```

## [warehouseService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/warehouseService.js)
> Warehouse Service Adapter
  Bridges WarehouseManager.jsx requirements with WarehouseOptimizer logic.

```javascript
/**
* Warehouse Service Adapter
* Bridges WarehouseManager.jsx requirements with WarehouseOptimizer logic.
*/
export const getWarehouses = () => {
```

```javascript
export const routeOrderToWarehouse = (pincode) => {
```

## [whatsappService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/whatsappService.js)
> Message templates approved by Meta for WhatsApp Business

```javascript
/**
* Message templates approved by Meta for WhatsApp Business
*/
/**
* Format phone number to E.164 or required format (Add 91 if missing)
*/
const formatPhoneNumber = (phone) => {
```

```javascript
export const sendWhatsAppMessage = async (phoneNumber, templateKey, variables = {}) => {
```

```javascript
/**
* Send WhatsApp message to multiple customers (batch operation)
* @param {Array<Object>} orders - Array of {phoneNumber, templateKey, variables}
* @returns {Promise<Object>} - Batch results {successful, failed}
*/
export const sendBatchWhatsAppMessages = async (orders) => {
```

```javascript
batch.map(order =>
```

```javascript
batchResults.forEach((result, idx) => {
```

```javascript
await new Promise(resolve => setTimeout(resolve, 1000));
```

```javascript
/**
* Queue a WhatsApp message for retry (offline support)
* @param {String} phoneNumber - Customer phone number
* @param {String} templateKey - Template key
* @param {Object} variables - Template variables
*/
export const queueWhatsAppMessage = async (phoneNumber, templateKey, variables = {}) => {
```

```javascript
/**
* Process queued WhatsApp messages (call when coming online)
*/
export const processQueuedWhatsAppMessages = async () => {
```

```javascript
await new Promise(resolve => setTimeout(resolve, 200));
```

```javascript
/**
* Get WhatsApp message delivery status
* @param {String} messageId - WhatsApp message ID
* @returns {Promise<Object>} - Delivery status
*/
export const getMessageStatus = async (messageId) => {
```

```javascript
/**
* Check WhatsApp service health and configuration
*/
export const validateWhatsAppConfig = () => {
```

```javascript
/**
* Interpolate variables into template string
* @param {String} template - Template with {variableName} placeholders
* @param {Object} variables - Variable values
* @returns {String} - Interpolated message
*/
function interpolateTemplate(template, variables) {
```

```javascript
Object.entries(variables).forEach(([key, value]) => {
```

```javascript
/**
* Log WhatsApp message delivery
*/
async function logWhatsAppDelivery(phoneNumber, templateKey, messageId) {
```

## [whatsappServiceEnhanced.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/whatsappServiceEnhanced.js)
> WhatsApp Business API Service
  Sends order status updates via WhatsApp messaging
  
  Features:
  - Token refresh and management
  - Message templating
  - Error handling & retry logic
  - Rate limiting
  - Delivery tracking

```javascript
/**
* WhatsApp Business API Service
* Sends order status updates via WhatsApp messaging
*
* Features:
* - Token refresh and management
* - Message templating
* - Error handling & retry logic
* - Rate limiting
* - Delivery tracking
*/
class WhatsAppService {
```

```javascript
/**
* Sends a WhatsApp message using a template
* @param {string} orderId - Order ID
* @param {string} templateId - WhatsApp template ID
* @param {string} phoneNumber - Recipient phone number (with country code)
* @param {object} parameters - Template parameters
* @returns {Promise<object>} Message send result
*/
/**
* Sends multiple messages in batch (with queue management)
* @param {array} orders - Array of order objects with phone, templateId, parameters
* @returns {Promise<array>} Results for each message
*/
/**
* Builds template components for WhatsApp message
* @param {object} parameters - Template parameters
* @returns {array} Formatted components array
*/
const paramValues = Object.values(parameters).map(val => ({
```

```javascript
/**
* Refreshes API token (call periodically)
* @param {string} newToken - New token from backend
*/
/**
* Checks if message can be sent (rate limiting)
* @returns {boolean} True if within rate limit
*/
time => now - time < this.rateLimitWindow
```

```javascript
/**
* Tracks sent message in local history
* @param {object} messageData - Message data to track
*/
/**
* Persists message to IndexedDB
* @param {object} messageData - Message data
*/
/**
* Gets IndexedDB instance
* @returns {Promise<IDBDatabase>} Database instance
*/
return new Promise((resolve, reject) => {
```

```javascript
request.onsuccess = () => resolve(request.result);
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
/**
* Normalizes phone number to WhatsApp format
* @param {string} phone - Phone number
* @returns {string|null} Normalized phone or null if invalid
*/
/**
* Gets message delivery status
* @param {string} messageId - Message ID
* @returns {Promise<object>} Status information
*/
/**
* Utility delay function
* @param {number} ms - Milliseconds to delay
* @returns {Promise<void>}
*/
return new Promise(resolve => setTimeout(resolve, ms));
```

```javascript
export const initWhatsAppService = (apiToken, businessAccountId, phoneNumberId) => {
```

```javascript
export const getWhatsAppService = () => {
```

## [wholesaleService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/wholesaleService.js)
> Wholesale Service
  Manages tiered pricing for bulk orders and credit limit validations for dealers.

```javascript
/**
* Wholesale Service
* Manages tiered pricing for bulk orders and credit limit validations for dealers.
*/
class WholesaleService {
```

```javascript
/**
* Calculates the discounted unit price based on quantity.
* @param {number} basePrice - The standard retail price
* @param {number} quantity - Number of units being ordered
* @returns {number} The discounted unit price
*/
const tier = PRICE_TIERS.find(t => quantity >= t.minQty);
```

## [zohoBridgeService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/zohoBridgeService.js)
> Zoho CRM Bridge Service
  Handles communication with the Zoho Catalyst/CRM backend.

```javascript
/**
* Zoho CRM Bridge Service
* Handles communication with the Zoho Catalyst/CRM backend.
*/
const API_BASE = '/server/zoho'; // Base path for Catalyst functions
```

```javascript
/**
* Fetch latest SKU master from Zoho CRM
* @returns {Promise<Array>} List of SKU objects
*/
export const fetchSKUMaster = async () => {
```

```javascript
/**
* Push order to Zoho CRM (Create Deal/Order)
* @param {Object} order - Order data
* @returns {Promise<Object>} Response from Zoho
*/
export const pushOrderToZoho = async (order) => {
```

```javascript
/**
* Push only modified orders to Zoho (Delta Sync)
* @param {Array} orders - List of all orders
* @returns {Promise<Object>} Results summary
*/
export const syncDeltaOrders = async (orders) => {
```

```javascript
const modifiedOrders = orders.filter(o => !lastSync || new Date(o.lastUpdated || o.updatedAt) > new Date(lastSync));
```

```javascript
const results = await Promise.allSettled(modifiedOrders.map(o => pushOrderToZoho(o)));
```

## [zohoWebhookService.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/services/zohoWebhookService.js)
> Zoho Webhook Service (Simulated)
  Processes incoming data stream from Zoho CRM/Inventory
  Enables real-time reactive state updates

```javascript
/**
* Zoho Webhook Service (Simulated)
* Processes incoming data stream from Zoho CRM/Inventory
* Enables real-time reactive state updates
*/
class ZohoWebhookService {
```

```javascript
/**
* Register a callback for webhook events
* @param {Function} callback
*/
return () => {
```

```javascript
this.listeners = this.listeners.filter(l => l !== callback);
```

```javascript
/**
* Simulate an incoming webhook event
* @param {String} type - 'ORDER_UPDATED' | 'INVENTORY_SYNC'
* @param {Object} data
*/
this.listeners.forEach(listener => listener({ type, data }));
```

```javascript
/**
* Handle raw webhook payload (Catalyst Entry Point)
* @param {Object} payload
*/
this.listeners.forEach(listener => listener(mappedEvent));
```

## [integration.test.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/tests/integration.test.js)
> Bluewud OTS - Integration Tests
  
  Order flow integration tests for major user workflows.
  Tests the complete lifecycle using mock data.

```javascript
/**
* Bluewud OTS - Integration Tests
*
* Order flow integration tests for major user workflows.
* Tests the complete lifecycle using mock data.
*/
vi.mock('../services/offlineCacheService', () => ({
```

```javascript
vi.mock('../services/notificationService', () => ({
```

```javascript
describe('Order Flow Integration', () => {
```

```javascript
describe('Order Creation & Validation', () => {
```

```javascript
it('should validate and create a complete order', () => {
```

```javascript
it('should normalize Amazon order format', () => {
```

```javascript
it('should normalize Flipkart order format', () => {
```

```javascript
describe('Order State Machine', () => {
```

```javascript
beforeEach(() => {
```

```javascript
it('should transition from Pending to MTP-Applied', () => {
```

```javascript
it('should reject invalid transitions', () => {
```

```javascript
it('should track status history', () => {
```

```javascript
it('should return valid next statuses', () => {
```

```javascript
it('should handle bulk transitions', () => {
```

```javascript
describe('Carrier Rate Engine', () => {
```

```javascript
it('should return rates from all carriers', () => {
```

```javascript
rates.forEach(rate => {
```

```javascript
it('should provide carrier recommendation', () => {
```

```javascript
describe('Order Deduplication', () => {
```

```javascript
it('should merge orders with same external ID', () => {
```

```javascript
const amz100 = result.find(o => o.externalId === 'AMZ-100');
```

```javascript
it('should preserve unique orders', () => {
```

```javascript
describe('Complete Order Lifecycle', () => {
```

```javascript
it('should complete full order lifecycle', () => {
```

## [utils.test.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/tests/utils.test.js)
> Bluewud OTS - Unit Tests
  
  Core utility function tests using vanilla JS testing pattern.
  For use with Vitest or Jest.

```javascript
/**
* Bluewud OTS - Unit Tests
*
* Core utility function tests using vanilla JS testing pattern.
* For use with Vitest or Jest.
*/
describe('Security Utils', () => {
```

```javascript
describe('escapeHtml', () => {
```

```javascript
it('should escape HTML special characters', () => {
```

```javascript
it('should handle non-string inputs', () => {
```

```javascript
describe('stripHtml', () => {
```

```javascript
it('should remove HTML tags', () => {
```

```javascript
describe('isValidEmail', () => {
```

```javascript
it('should validate correct emails', () => {
```

```javascript
it('should reject invalid emails', () => {
```

```javascript
describe('isValidIndianPhone', () => {
```

```javascript
it('should validate Indian mobile numbers', () => {
```

```javascript
it('should reject invalid numbers', () => {
```

```javascript
describe('isValidPincode', () => {
```

```javascript
it('should validate 6-digit pincodes', () => {
```

```javascript
it('should reject invalid pincodes', () => {
```

```javascript
describe('isValidGST', () => {
```

```javascript
it('should validate correct GST format', () => {
```

```javascript
it('should reject invalid GST', () => {
```

```javascript
describe('sanitizeFilename', () => {
```

```javascript
it('should remove dangerous characters', () => {
```

```javascript
describe('Data Utils', () => {
```

```javascript
describe('calculateGST', () => {
```

```javascript
it('should calculate 18% GST by default', () => {
```

```javascript
it('should calculate reduced GST rate', () => {
```

```javascript
describe('getGSTType', () => {
```

```javascript
it('should return CGST+SGST for same state', () => {
```

```javascript
it('should return IGST for different states', () => {
```

```javascript
describe('generateOrderId', () => {
```

```javascript
it('should generate unique IDs', () => {
```

```javascript
it('should use provided prefix', () => {
```

```javascript
describe('validateOrder', () => {
```

```javascript
it('should pass valid order', () => {
```

```javascript
it('should fail invalid order', () => {
```

```javascript
describe('deduplicateOrders', () => {
```

```javascript
it('should merge duplicate orders', () => {
```

```javascript
describe('International Service', () => {
```

```javascript
describe('convertFromINR', () => {
```

```javascript
it('should convert INR to USD', () => {
```

```javascript
it('should format currency correctly', () => {
```

## [analyticsUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/analyticsUtils.js)
> Analytics Utilities
  Functions for data analysis, forecasting, and anomaly detection

```javascript
/**
* Analytics Utilities
* Functions for data analysis, forecasting, and anomaly detection
*/
/**
* Calculate simple moving average
*/
export const calculateMovingAverage = (data, windowSize = 7) => {
```

```javascript
const avg = window.reduce((sum, val) => sum + val, 0) / windowSize;
```

```javascript
/**
* Detect anomalies using standard deviation
*/
export const detectAnomalies = (data, threshold = 2.5) => {
```

```javascript
const mean = data.reduce((a, b) => a + b, 0) / data.length;
```

```javascript
const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
```

```javascript
return data.map((val, idx) => ({
```

```javascript
/**
* Linear regression forecast
*/
export const linearRegression = (data, forecastDays = 7) => {
```

```javascript
const sumY = data.reduce((a, b) => a + b, 0);
```

```javascript
const sumXY = data.reduce((sum, y, i) => sum + (i + 1) * y, 0);
```

```javascript
/**
* Calculate growth rate
*/
export const calculateGrowthRate = (current, previous) => {
```

```javascript
/**
* Aggregate data by period (day/week/month)
*/
export const aggregateByPeriod = (data, period = 'day') => {
```

```javascript
data.forEach(item => {
```

```javascript
return Object.entries(aggregated).map(([period, data]) => ({
```

```javascript
/**
* Calculate percentiles
*/
export const calculatePercentile = (data, percentile) => {
```

```javascript
const sorted = [...data].sort((a, b) => a - b);
```

```javascript
/**
* Get distribution stats
*/
export const getDistributionStats = (data) => {
```

```javascript
const sorted = [...data].sort((a, b) => a - b);
```

```javascript
const mean = data.reduce((a, b) => a + b, 0) / n;
```

```javascript
const mode = data.reduce((prev, current) =>
```

```javascript
(data.filter(v => v === current).length > data.filter(v => v === prev).length) ? current : prev
```

```javascript
/**
* Calculate cohort retention
*/
export const calculateRetention = (cohortData) => {
```

```javascript
cohortData.forEach(user => {
```

## [apiUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/apiUtils.js)
> API Utilities
  Provides API request handling with retry logic, offline support, and response normalization

```javascript
/**
* API Utilities
* Provides API request handling with retry logic, offline support, and response normalization
*/
/**
* Create API error with standardized format
*/
class APIError extends Error {
```

```javascript
/**
* Retry logic with exponential backoff
*/
) => {
```

```javascript
await new Promise((resolve) => setTimeout(resolve, delay));
```

```javascript
/**
* Check if response is successful
*/
const isSuccessStatus = (status) => status >= 200 && status < 300;
```

```javascript
/**
* Normalize API response
*/
const normalizeResponse = (data) => {
```

```javascript
/**
* Core fetch function with error handling
*/
) => {
```

```javascript
const timeoutId = setTimeout(() => controller.abort(), timeout);
```

```javascript
const data = await response.json().catch(() => ({}));
```

```javascript
/**
* Make API request with retry and offline support
*/
) => {
```

```javascript
() => fetchWithErrorHandling(endpoint, fetchOptions),
```

```javascript
/**
* GET request
*/
const get = (endpoint, options = {}) =>
```

```javascript
/**
* POST request
*/
const post = (endpoint, body, options = {}) =>
```

```javascript
/**
* PUT request
*/
const put = (endpoint, body, options = {}) =>
```

```javascript
/**
* PATCH request
*/
const patch = (endpoint, body, options = {}) =>
```

```javascript
/**
* DELETE request
*/
const del = (endpoint, options = {}) =>
```

```javascript
/**
* Batch requests with Promise.all
*/
const batch = async (requests) => {
```

```javascript
requests.map((req) => {
```

```javascript
return results.map((result) =>
```

```javascript
/**
* Queue request for retry when online
*/
const queueForRetry = (endpoint, options = {}) => {
```

```javascript
/**
* Process queued requests
*/
const processQueue = async () => {
```

## [commercialUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/commercialUtils.js)
> Commercial Utilities - Business logic for pricing, commissions, and profitability
  Based on legacy Bluewud Commercial Model (Deluge)

```javascript
/**
* Commercial Utilities - Business logic for pricing, commissions, and profitability
* Based on legacy Bluewud Commercial Model (Deluge)
*/
export const TMS_LEVELS = {
```

```javascript
/**
* Calculate net profitability for an SKU/Order
* @param {object} params - { sellingPrice, bomCost, commissionPercent, tmsLevel, gstRate, shippingCost }
* @returns {object} - Detailed profit breakdown
*/
export const calculateProfitability = ({
```

```javascript
}) => {
```

```javascript
/**
* Get Enhanced SKU with Parent Inheritance
* @param {string} skuCode - Child SKU Code
* @param {array} skuMaster - Master list of all SKUs (Parent & Child)
* @returns {object} - SKU with inherited attributes
*/
export const getEnhancedSKU = (skuCode, skuMaster = []) => {
```

```javascript
const sku = skuMaster.find(s => s.sku === skuCode);
```

```javascript
const parent = skuMaster.find(s => s.sku === sku.parentSku);
```

```javascript
/**
* Resolve SKU Aliases to Parent MTP Code
* @param {string} alias - The incoming SKU from marketplace (e.g. 'BW-CHAIR-BLK-AMZ')
* @param {array} aliasMaster - Array of { alias, parentCode }
* @returns {string} - Parent MTP Code
*/
export const resolveSkuAlias = (alias, aliasMaster = []) => {
```

```javascript
const found = aliasMaster.find(item => item.alias === alias);
```

## [contextInjection.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/contextInjection.js)
> Context Injection Utility
  Scans the src directory to extract function signatures and JSDoc for indexing.

```javascript
/**
* Context Injection Utility
* Scans the src directory to extract function signatures and JSDoc for indexing.
*/
class ContextInjection {
```

```javascript
/**
* Recursively find all JS/JSX files.
*/
files.forEach(file => {
```

```javascript
/**
* Extracts function signatures and JSDoc.
*/
lines.forEach(line => {
```

```javascript
// Simple regex for function signatures (classes, const functions, traditional functions)
```

```javascript
if (trimmed.includes('function') || trimmed.includes('=>') || trimmed.startsWith('class ') || (trimmed.startsWith('export const') && trimmed.includes('='))) {
```

```javascript
/**
* Extracts a high-level summary of the file (e.g., first few lines of comments).
*/
/**
* Generates the context_index.md file.
*/
files.forEach(file => {
```

```javascript
functions: signatures.map(s => s.signature)
```

```javascript
signatures.forEach(sig => {
```

## [dataUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/dataUtils.js)
> Data Utilities - Common data transformation and validation functions

```javascript
/**
* Data Utilities - Common data transformation and validation functions
*/
export const STATE_CODES = {
```

```javascript
/**
* Calculate GST for an amount
* @param {number} amount - Base amount
* @param {string} gstType - Type of GST rate
* @returns {object} - Breakdown of GST
*/
export const calculateGST = (amount, gstType = 'standard') => {
```

```javascript
/**
* Determine if IGST or CGST+SGST applies
* @param {string} sellerState
* @param {string} buyerState
* @returns {string} - 'IGST' or 'CGST+SGST'
*/
export const getGSTType = (sellerState, buyerState) => {
```

```javascript
/**
* Get state code for GST
* @param {string} stateName
* @returns {string}
*/
export const getStateCode = (stateName) => {
```

```javascript
/**
* Generate a unique order ID
* @param {string} prefix
* @returns {string}
*/
export const generateOrderId = (prefix = 'BW') => {
```

```javascript
/**
* Validate order data
* @param {object} order
* @returns {object} - { valid: boolean, errors: string[] }
*/
export const validateOrder = (order) => {
```

```javascript
/**
* Resolve SKU Alias to Parent MTP Code
* @param {string} sku - Incoming SKU
* @param {array} aliases - Alias master list
* @returns {string} - Parent MTP Code or original SKU
*/
export const resolveSkuAlias = (sku, aliases = []) => {
```

```javascript
const found = aliases.find(a => a.alias.toLowerCase() === sku.toLowerCase());
```

```javascript
/**
* Normalize order data from different sources
* @param {object} rawOrder - Raw order from Amazon/Flipkart/etc
* @param {string} source - Source platform
* @param {array} aliases - Optional alias master list for resolution
* @returns {object} - Normalized order
*/
export const normalizeOrder = (rawOrder, source, aliases = []) => {
```

```javascript
quantity: rawOrder.line_items?.reduce((sum, item) => sum + item.quantity, 0) || 1,
```

```javascript
/**
* Convert array of objects to CSV string
* @param {object[]} data
* @param {string[]} columns - Optional column order
* @returns {string}
*/
export const toCSV = (data, columns = null) => {
```

```javascript
const rows = data.map(row =>
```

```javascript
cols.map(col => {
```

```javascript
/**
* Download data as file
* @param {string} content - File content
* @param {string} filename
* @param {string} mimeType
*/
export const downloadFile = (content, filename, mimeType = 'text/csv') => {
```

```javascript
/**
* Export orders to CSV
* @param {object[]} orders
* @param {string} filename
*/
export const exportOrdersCSV = (orders, filename = 'orders_export.csv') => {
```

```javascript
/**
* Export data to JSON
* @param {any} data
* @param {string} filename
*/
export const exportJSON = (data, filename = 'export.json') => {
```

```javascript
/**
* Format date to Indian format
* @param {string|Date} date
* @returns {string}
*/
export const formatDateIN = (date) => {
```

```javascript
/**
* Format date with time
* @param {string|Date} date
* @returns {string}
*/
export const formatDateTimeIN = (date) => {
```

```javascript
/**
* Get relative time (e.g., "2 hours ago")
* @param {string|Date} date
* @returns {string}
*/
export const getRelativeTime = (date) => {
```

```javascript
/**
* Deduplicate orders based on Source and External ID
* @param {object[]} existingOrders
* @param {object[]} newOrders
* @returns {object[]} - Merged and deduplicated list
*/
export const deduplicateOrders = (existingOrders = [], newOrders = []) => {
```

```javascript
statusHistory: Array.from(new Set([...(existing.statusHistory || []), ...(no.statusHistory || [])].map(h => JSON.stringify(h)))).map(s => JSON.parse(s))
```

```javascript
export const deduplicateCustomers = (customers = []) => {
```

## [dateTimeUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/dateTimeUtils.js)
> Date/Time Utilities
  Advanced date/time operations including scheduling, timezone handling, and calendar utilities

```javascript
/**
* Date/Time Utilities
* Advanced date/time operations including scheduling, timezone handling, and calendar utilities
*/
/**
* Get current date in ISO format
*/
const now = () => new Date().toISOString();
```

```javascript
/**
* Get current Unix timestamp
*/
const timestamp = () => Date.now();
```

```javascript
/**
* Add days to a date
* @param {Date|string} date - Start date
* @param {number} days - Number of days to add
*/
const addDays = (date, days) => {
```

```javascript
/**
* Add hours to a date
* @param {Date|string} date - Start date
* @param {number} hours - Number of hours to add
*/
const addHours = (date, hours) => {
```

```javascript
/**
* Add minutes to a date
* @param {Date|string} date - Start date
* @param {number} minutes - Number of minutes to add
*/
const addMinutes = (date, minutes) => {
```

```javascript
/**
* Get difference between two dates in days
*/
const daysBetween = (date1, date2) => {
```

```javascript
/**
* Get difference between two dates in hours
*/
const hoursBetween = (date1, date2) => {
```

```javascript
/**
* Get difference between two dates in minutes
*/
const minutesBetween = (date1, date2) => {
```

```javascript
/**
* Check if date is in the past
*/
const isPast = (date) => new Date(date) < new Date();
```

```javascript
/**
* Check if date is in the future
*/
const isFuture = (date) => new Date(date) > new Date();
```

```javascript
/**
* Check if date is today
*/
const isToday = (date) => {
```

```javascript
/**
* Check if date is tomorrow
*/
const isTomorrow = (date) => {
```

```javascript
/**
* Get start of day
*/
const startOfDay = (date = new Date()) => {
```

```javascript
/**
* Get end of day
*/
const endOfDay = (date = new Date()) => {
```

```javascript
/**
* Get start of week
*/
const startOfWeek = (date = new Date()) => {
```

```javascript
/**
* Get start of month
*/
const startOfMonth = (date = new Date()) => {
```

```javascript
/**
* Get end of month
*/
const endOfMonth = (date = new Date()) => {
```

```javascript
/**
* Get all days in a month
*/
const getDaysInMonth = (date = new Date()) => {
```

```javascript
/**
* Check if year is leap year
*/
const isLeapYear = (year) => {
```

```javascript
/**
* Get week number of year
*/
const getWeekNumber = (date = new Date()) => {
```

```javascript
/**
* Get day name
*/
const getDayName = (date = new Date(), locale = 'en-US') => {
```

```javascript
/**
* Get month name
*/
const getMonthName = (date = new Date(), locale = 'en-US') => {
```

```javascript
/**
* Format as relative time (e.g., "2 hours ago", "in 3 days")
*/
const getRelativeTime = (date) => {
```

```javascript
/**
* Get business days between two dates (excluding weekends)
*/
const getBusinessDaysBetween = (date1, date2) => {
```

```javascript
/**
* Schedule a callback at a specific time
*/
const scheduleAt = (targetTime, callback) => {
```

```javascript
/**
* Schedule a recurring callback
*/
const scheduleRecurring = (interval, callback, options = {}) => {
```

```javascript
const scheduleNext = () => {
```

```javascript
setTimeout(() => {
```

```javascript
return { stop: () => { stopTime = -1; } };
```

```javascript
/**
* Get next occurrence of a time
*/
const getNextOccurrence = (hour, minute = 0) => {
```

```javascript
/**
* Convert between timezones (basic implementation)
*/
const convertTimezone = (date, fromOffset, toOffset) => {
```

## [deduplicationEngine.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/deduplicationEngine.js)
> Optimized Deduplication Engine
  High-performance streaming deduplication with O(n) time complexity
  Suitable for large batch operations (100k+ records)

```javascript
/**
* Optimized Deduplication Engine
* High-performance streaming deduplication with O(n) time complexity
* Suitable for large batch operations (100k+ records)
*/
/**
* Advanced deduplication with streaming and progress callback
* Optimized for memory efficiency with large datasets
* @param {Object[]} existingOrders - Existing orders array
* @param {Object[]} newOrders - New orders to merge
* @param {Function} onProgress - Callback for progress tracking (optional)
* @returns {Object[]} - Deduplicated orders array
* @example
* const result = deduplicateOrdersOptimized(existing, incoming, (progress) => {
*   console.log(`Progress: ${progress.percent}%`);
* });
*/
export const deduplicateOrdersOptimized = (existingOrders = [], newOrders = [], onProgress = null) => {
```

```javascript
/**
* Stream-based deduplication for very large datasets
* Returns an async generator for memory-efficient processing
* @param {AsyncIterable} existingOrdersStream - Stream of existing orders
* @param {AsyncIterable} newOrdersStream - Stream of new orders
* @returns {AsyncGenerator} - Yields deduplicated orders
* @example
* for await (const order of deduplicateOrdersStream(existing$, incoming$)) {
*   await processOrder(order);
* }
*/
export async function* deduplicateOrdersStream(existingOrdersStream, newOrdersStream) {
```

```javascript
/**
* Batch deduplication with configurable batch size
* Useful for processing large datasets in chunks
* @param {Object[]} existingOrders - Existing orders
* @param {Object[]} newOrders - New orders
* @param {Number} batchSize - Records to process per batch (default: 5000)
* @returns {Object[]} - Deduplicated orders
*/
export const deduplicateOrdersBatched = (existingOrders = [], newOrders = [], batchSize = 5000) => {
```

```javascript
/**
* Incremental deduplication
* Maintains a cache for repeated deduplication operations
* @param {Map} cache - Cache map (reuse across calls)
* @param {Object[]} newOrders - New orders to add to cache
* @returns {Object} - {cache: Map, deduplicated: Object[]}
*/
export const deduplicateOrdersIncremental = (cache = new Map(), newOrders = []) => {
```

```javascript
/**
* Customer deduplication with fuzzy matching
* Handles variations in phone numbers and emails
* @param {Object[]} customers - Customer array
* @param {Object} options - {strictPhoneMatch, strictEmailMatch, fuzzyThreshold}
* @returns {Object[]} - Deduplicated customers
*/
export const deduplicateCustomersAdvanced = (
```

```javascript
) => {
```

```javascript
/**
* Generate deduplication key from order
* @private
*/
function generateOrderKey(order) {
```

```javascript
/**
* Merge two order records intelligently
* @private
*/
function mergeOrderRecords(existing, incoming) {
```

```javascript
new Map(histories.map(h => [h.timestamp, h])).values()
```

```javascript
).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
```

```javascript
/**
* Normalize phone number for comparison
* @private
*/
function normalizePhone(phone) {
```

```javascript
/**
* Normalize email for comparison
* @private
*/
function normalizeEmail(email) {
```

```javascript
/**
* Get deduplication statistics
* @param {Object[]} original - Original array
* @param {Object[]} deduplicated - Deduplicated array
* @returns {Object} - Statistics object
*/
export const getDeduplicationStats = (original, deduplicated) => {
```

## [deduplicationUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/deduplicationUtils.js)
> Deduplication Utilities
  Optimized for processing large batches of orders (10k+)
  
  Features:
  - Streaming deduplication
  - Multiple deduplication strategies
  - Performance metrics
  - Memory-efficient processing

```javascript
/**
* Deduplication Utilities
* Optimized for processing large batches of orders (10k+)
*
* Features:
* - Streaming deduplication
* - Multiple deduplication strategies
* - Performance metrics
* - Memory-efficient processing
*/
/**
* Deduplicates orders using a Set-based approach
* Optimized for large datasets
* @param {array} orders - Array of order objects
* @param {string} key - Field to deduplicate by (default: 'id')
* @returns {array} Deduplicated orders
*/
export const deduplicateOrders = (orders, key = 'id') => {
```

```javascript
/**
* Streaming deduplication for memory efficiency
* Processes orders in chunks
* @param {array} orders - Array of order objects
* @param {number} chunkSize - Chunk size (default: 1000)
* @param {string} key - Field to deduplicate by
* @returns {Generator} Generator yielding deduplicated batches
*/
export function* streamDeduplicateOrders(orders, chunkSize = 1000, key = 'id') {
```

```javascript
/**
* Advanced deduplication with multiple field matching
* @param {array} orders - Array of order objects
* @param {array} keys - Fields to match for deduplication
* @returns {array} Deduplicated orders
*/
export const deduplicateByMultipleFields = (orders, keys = ['id', 'email']) => {
```

```javascript
const composite = keys.map(k => order[k]).join('|');
```

```javascript
/**
* Deduplication with similarity detection
* Finds similar orders based on customer email/phone
* @param {array} orders - Array of order objects
* @param {number} timeWindowMs - Time window for considering duplicates
* @returns {array} Deduplicated orders with merge info
*/
export const deduplicateWithMerge = (orders, timeWindowMs = 3600000) => { // 1 hour default
```

```javascript
const merged = orderGroup.sort((a, b) =>
```

```javascript
merged.totalQuantity = orderGroup.reduce((sum, o) => sum + (o.quantity || 1), 0);
```

```javascript
/**
* Performance metrics for deduplication
* @param {array} original - Original orders array
* @param {array} deduplicated - Deduplicated orders array
* @returns {object} Performance metrics
*/
export const getDeduplicationMetrics = (original, deduplicated) => {
```

```javascript
/**
* Batch deduplication with progress callback
* @param {array} orders - Array of order objects
* @param {function} onProgress - Progress callback
* @param {string} key - Field to deduplicate by
* @returns {Promise<array>} Deduplicated orders
*/
export const batchDeduplicateOrders = async (orders, onProgress = null, key = 'id') => {
```

```javascript
await new Promise(resolve => setTimeout(resolve, 0));
```

```javascript
/**
* Deduplicates and indexes orders for fast lookup
* @param {array} orders - Array of order objects
* @param {array} indexKeys - Fields to create indexes for
* @returns {object} Deduplicated orders and indexes
*/
export const deduplicateWithIndexes = (orders, indexKeys = ['id', 'email', 'phone']) => {
```

```javascript
indexKeys.forEach(key => {
```

```javascript
indexKeys.forEach(key => {
```

```javascript
findByEmail: (email) => indexes.email?.get(email) || [],
```

```javascript
findByPhone: (phone) => indexes.phone?.get(phone) || [],
```

```javascript
findById: (id) => indexes.id?.get(id)?.[0]
```

```javascript
/**
* WebWorker-ready deduplication for heavy lifting
* @param {array} orders - Array of order objects
* @param {string} key - Field to deduplicate by
* @returns {object} Deduplication result
*/
export const deduplicateWorkerFunction = (orders, key = 'id') => {
```

```javascript
// Export all functions
```

## [formatUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/formatUtils.js)
> Format Utilities
  Functions for formatting dates, currency, phone numbers, etc.

```javascript
/**
* Format Utilities
* Functions for formatting dates, currency, phone numbers, etc.
*/
/**
* Formats date to 'DD/MM/YYYY' format
* @param {Date|string} date - Date to format
* @returns {string} - Formatted date
*/
export const formatDate = (date) => {
```

```javascript
/**
* Formats date with time 'DD/MM/YYYY HH:mm'
* @param {Date|string} date - Date to format
* @returns {string} - Formatted datetime
*/
export const formatDateTime = (date) => {
```

```javascript
/**
* Formats currency to Indian Rupees
* @param {number} amount - Amount to format
* @param {string} currency - Currency code (default: INR)
* @returns {string} - Formatted currency string
*/
export const formatCurrency = (amount, currency = 'INR') => {
```

```javascript
/**
* Formats phone number to (XXX) XXX-XXXX format
* @param {string} phone - Phone number
* @returns {string} - Formatted phone number
*/
export const formatPhone = (phone) => {
```

```javascript
/**
* Formats pincode as XXXXXX
* @param {string} pincode - Pincode
* @returns {string} - Formatted pincode
*/
export const formatPincode = (pincode) => {
```

```javascript
/**
* Formats percentage with specified decimal places
* @param {number} value - Value as decimal (0-1)
* @param {number} decimals - Number of decimal places
* @returns {string} - Formatted percentage
*/
export const formatPercentage = (value, decimals = 2) => {
```

```javascript
/**
* Formats bytes to human-readable size
* @param {number} bytes - Number of bytes
* @returns {string} - Formatted size
*/
export const formatBytes = (bytes) => {
```

```javascript
/**
* Formats order ID with prefix and padding
* @param {number|string} id - Order ID
* @returns {string} - Formatted order ID
*/
export const formatOrderId = (id) => {
```

```javascript
/**
* Capitalizes first letter of a string
* @param {string} str - String to capitalize
* @returns {string} - Capitalized string
*/
export const capitalize = (str) => {
```

```javascript
/**
* Converts string to title case
* @param {string} str - String to convert
* @returns {string} - Title case string
*/
export const toTitleCase = (str) => {
```

```javascript
return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
```

```javascript
/**
* Truncates text with ellipsis
* @param {string} text - Text to truncate
* @param {number} maxLength - Maximum length
* @param {string} suffix - Suffix (default: '...')
* @returns {string} - Truncated text
*/
export const truncate = (text, maxLength, suffix = '...') => {
```

```javascript
/**
* Formats address as single line
* @param {object} address - Address object
* @returns {string} - Formatted address
*/
export const formatAddress = (address) => {
```

```javascript
/**
* Formats duration in milliseconds to readable format
* @param {number} ms - Milliseconds
* @returns {string} - Formatted duration
*/
export const formatDuration = (ms) => {
```

## [formatters.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/formatters.js)
> Formatters - Display formatting functions for the app
  Handles currency (INR), dates, status badges, and localized displays

```javascript
/**
* Formatters - Display formatting functions for the app
* Handles currency (INR), dates, status badges, and localized displays
*/
export const formatCurrency = (amount, opts = {}) => {
```

```javascript
export const formatCompactCurrency = (amount) => {
```

```javascript
export const formatDate = (date, format = 'DD/MM/YYYY') => {
```

```javascript
Object.entries(replacements).forEach(([key, value]) => {
```

```javascript
export const formatRelativeTime = (date) => {
```

```javascript
export const formatStatus = (status) => {
```

```javascript
export const formatPaymentMethod = (method) => {
```

```javascript
export const formatCarrier = (carrier) => {
```

```javascript
export const formatOrderSource = (source) => {
```

```javascript
export const formatAddress = (address, format = 'singleLine') => {
```

```javascript
export const formatPhoneNumber = (phone) => {
```

```javascript
export const formatPercentage = (value, decimals = 1) => {
```

```javascript
export const formatFileSize = (bytes) => {
```

```javascript
export const truncateText = (text, maxLength = 50, suffix = '...') => {
```

```javascript
export const capitalize = (str) => {
```

```javascript
export const uppercase = (str) => {
```

```javascript
export const lowercase = (str) => {
```

```javascript
export const titleCase = (str) => {
```

```javascript
.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
```

```javascript
export const formatOrderId = (id) => {
```

```javascript
export const formatSKU = (sku) => {
```

```javascript
export const formatQuantity = (qty, unit = 'pcs') => {
```

```javascript
export const formatWeight = (weight, unit = 'kg') => {
```

```javascript
export const formatDimensions = (length, width, height, unit = 'cm') => {
```

```javascript
export const formatPincode = (pincode) => {
```

```javascript
export const formatAadhar = (aadhar) => {
```

```javascript
export const formatPAN = (pan) => {
```

```javascript
export const formatGST = (gst) => {
```

```javascript
export const formatBatch = (items, formatter) => {
```

```javascript
return items.map(item => formatter(item));
```

## [integrationHelpers.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/integrationHelpers.js)
> Integration Helpers
  Utilities for integrating the AI package with the main app

```javascript
/**
* Integration Helpers
* Utilities for integrating the AI package with the main app
*/
/**
* Initialize all services and modules
*/
export const initializeIntegration = async (config = {}) => {
```

```javascript
/**
* Register service worker
*/
const registerServiceWorker = async () => {
```

```javascript
/**
* Initialize offline support
*/
const initializeOfflineSupport = () => {
```

```javascript
window.addEventListener('online', () => {
```

```javascript
window.addEventListener('offline', () => {
```

```javascript
/**
* Sync offline queue
*/
const syncOfflineQueue = async () => {
```

```javascript
/**
* Initialize keyboard shortcuts
*/
const initializeKeyboardShortcuts = () => {
```

```javascript
const registerShortcut = (keys, handler, description) => {
```

```javascript
const handleKeydown = (e) => {
```

```javascript
/**
* Initialize activity logging
*/
const initializeActivityLogging = () => {
```

```javascript
const logActivity = (action, details) => {
```

```javascript
/**
* Get user ID from session/localStorage
*/
const getUserId = () => {
```

```javascript
/**
* Check if feature is enabled
*/
export const isFeatureEnabled = (featureName) => {
```

```javascript
/**
* Get integration status
*/
export const getIntegrationStatus = () => {
```

```javascript
/**
* Migrate data from old format to new
*/
export const migrateData = (oldData, schema) => {
```

```javascript
Object.keys(schema).forEach(key => {
```

```javascript
const transformer = schema[key].transform || (v => v);
```

```javascript
/**
* Validate integration compatibility
*/
export const validateCompatibility = () => {
```

## [keyboardShortcuts.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/keyboardShortcuts.js)
> Keyboard Shortcuts Utility
  Comprehensive keyboard shortcut registry with 75+ shortcuts
  for power users in Bluewud OTS

```javascript
/**
* Keyboard Shortcuts Utility
* Comprehensive keyboard shortcut registry with 75+ shortcuts
* for power users in Bluewud OTS
*/
/**
* Register keyboard shortcut
* @param {string} keys Key combination (e.g., 'Ctrl+K')
* @param {Function} callback Function to execute
* @returns {void}
*/
export const registerShortcut = (keys, callback) => {
```

```javascript
document.addEventListener('keydown', (e) => {
```

```javascript
/**
* Check if key event matches a key combination
* @param {KeyboardEvent} e Keyboard event
* @param {string} keys Key combination string
* @returns {boolean} True if matches
*/
const matchesKeyCombo = (e, keys) => {
```

```javascript
/**
* Get key name from keyboard event
* @param {KeyboardEvent} e Keyboard event
* @returns {string} Key name
*/
const getKeyName = (e) => {
```

```javascript
/**
* Get all shortcuts
* @returns {Object} All shortcuts
*/
export const getAllShortcuts = () => shortcuts;
```

```javascript
/**
* Get shortcuts by category
* @param {string} category Category name
* @returns {Array} Filtered shortcuts
*/
export const getShortcutsByCategory = (category) => {
```

```javascript
([, value]) => value.category === category
```

```javascript
/**
* Get shortcut info by action
* @param {string} action Action name
* @returns {Object|null} Shortcut info or null
*/
export const getShortcutByAction = (action) => {
```

```javascript
([, value]) => value.action === action
```

```javascript
/**
* Get all unique categories
* @returns {Array} Categories
*/
export const getCategories = () => {
```

```javascript
Object.values(shortcuts).forEach(s => categories.add(s.category));
```

```javascript
/**
* Format shortcuts for display
* @returns {Array} Formatted shortcuts
*/
export const getFormattedShortcuts = () => {
```

```javascript
return Object.entries(shortcuts).map(([keys, value]) => ({
```

## [labelGenerator.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/labelGenerator.js)
> Generates a professional packing slip PDF for an order.
  @param {Object} order - The order data object.

```javascript
/**
* Generates a professional packing slip PDF for an order.
* @param {Object} order - The order data object.
*/
export const generatePackingSlip = (order) => {
```

```javascript
/**
* Generates a thermal-style shipping label (4x6 format).
* @param {Object} order - The order data object.
*/
export const generateShippingLabel = (order) => {
```

## [labelGeneratorEnhanced.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/labelGeneratorEnhanced.js)
> Enhanced Label Generator Utility
  Integrates with multiple carrier APIs for label generation
  
  Supported Carriers:
  - Delhivery
  - BlueDart
  - XpressBees
  
  Features:
  - Multi-carrier support
  - PDF generation
  - Barcode creation
  - Error handling & retry logic

```javascript
/**
* Enhanced Label Generator Utility
* Integrates with multiple carrier APIs for label generation
*
* Supported Carriers:
* - Delhivery
* - BlueDart
* - XpressBees
*
* Features:
* - Multi-carrier support
* - PDF generation
* - Barcode creation
* - Error handling & retry logic
*/
/**
* Generates shipping label for given order
* @param {object} order - Order object with details
* @param {string} carrier - Carrier name (delhivery, bluedart, xpressbees)
* @returns {Promise<object>} Label data and tracking info
*/
export const generateLabel = async (order, carrier = 'delhivery') => {
```

```javascript
/**
* Calls carrier API with order details
* @param {object} order - Order object
* @param {string} carrier - Carrier name
* @param {object} config - Carrier configuration
* @returns {Promise<object>} API response
*/
const callCarrierAPI = async (order, carrier, config) => {
```

```javascript
/**
* Builds API payload based on carrier requirements
* @param {object} order - Order object
* @param {string} carrier - Carrier name
* @returns {object} Formatted payload
*/
const buildCarrierPayload = (order, carrier) => {
```

```javascript
/**
* Formats address for carrier API
* @param {object} address - Address object
* @returns {string} Formatted address
*/
const formatAddress = (address) => {
```

```javascript
/**
* Calculates total weight from order items
* @param {object} order - Order object
* @returns {number} Weight in kg
*/
const calculateWeight = (order) => {
```

```javascript
return (order.items || []).reduce((total, item) => {
```

```javascript
/**
* Calculates dimensions from order items
* @param {object} order - Order object
* @returns {object} Dimensions (l, b, h in cm)
*/
const calculateDimensions = (order) => {
```

```javascript
/**
* Gets authentication token for carrier
* @param {string} carrier - Carrier name
* @returns {string} Authentication token
*/
const getCarrierToken = (carrier) => {
```

```javascript
/**
* Generates PDF label from label data
* @param {object} labelData - Label data from carrier
* @returns {Promise<Blob>} PDF blob
*/
export const generatePDF = async (labelData) => {
```

```javascript
/**
* Creates HTML for label printing
* @param {object} labelData - Label data
* @returns {HTMLElement} Label HTML element
*/
const createLabelHTML = (labelData) => {
```

```javascript
/**
* Downloads label as PDF
* @param {object} labelData - Label data
* @param {string} filename - Output filename
* @returns {Promise<void>}
*/
export const downloadLabel = async (labelData, filename = 'shipping_label.pdf') => {
```

```javascript
/**
* Generates barcode image data
* @param {string} value - Barcode value
* @returns {string} SVG barcode data
*/
export const generateBarcode = (value) => {
```

```javascript
/**
* Retries label generation if it fails
* @param {object} order - Order object
* @param {string} carrier - Carrier name
* @param {number} maxRetries - Maximum retry attempts
* @returns {Promise<object>} Label data or error
*/
export const generateLabelWithRetry = async (order, carrier, maxRetries = 3) => {
```

```javascript
await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
```

```javascript
// Export all functions
```

## [logisticsUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/logisticsUtils.js)
> India Logistics Utility Engine
  Handles Pan-India Zone Mapping, Rate Estimation, and Delivery Time Calculation.

```javascript
/**
* India Logistics Utility Engine
* Handles Pan-India Zone Mapping, Rate Estimation, and Delivery Time Calculation.
*/
export const INDIA_ZONES = {
```

```javascript
/**
* Maps a state/city to a logistic zone.
*/
export const getZoneFromLocation = (state, city) => {
```

```javascript
/**
* Industrial-grade Rate Estimator
* Based on legacy Bluewud pricing models.
*/
export const estimateRate = (config, weight, zone) => {
```

```javascript
/**
* Delivery Time Estimator (SLA)
*/
export const getSLA = (zone) => {
```

## [performanceMonitor.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/performanceMonitor.js)
> Performance Monitor Utility
  Tools for tracking and logging component render performance.

```javascript
/**
* Performance Monitor Utility
* Tools for tracking and logging component render performance.
*/
/**
* Hook to log component render times.
* @param {string} componentName - Name of the component for logging
*/
export const useRenderTime = (componentName) => {
```

```javascript
useEffect(() => {
```

```javascript
/**
* Measure the execution time of a function.
* @param {Function} fn - Function to measure
* @param {string} label - Label for logging
* @returns {Function} Wrapped function with timing
*/
export const measureTime = (fn, label) => {
```

```javascript
return async (...args) => {
```

```javascript
/**
* Log a performance mark for Chrome DevTools.
* @param {string} markName
*/
export const perfMark = (markName) => {
```

```javascript
/**
* Measure between two marks.
* @param {string} name
* @param {string} startMark
* @param {string} endMark
*/
export const perfMeasure = (name, startMark, endMark) => {
```

## [permissionUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/permissionUtils.js)
> Permission Utilities
  Centralized mapping of permissions to roles and helper functions.

```javascript
/**
* Permission Utilities
* Centralized mapping of permissions to roles and helper functions.
*/
export const PERMISSIONS = {
```

```javascript
/**
* Checks if a user object has a specific permission.
* @param {Object} user - The user session object from AuthContext
* @param {string} permission - The permission key from PERMISSIONS
* @returns {boolean}
*/
export const hasPermission = (user, permission) => {
```

```javascript
/**
* Helper to check if user is a dealer
*/
export const isDealer = (user) => {
```

## [securityUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/securityUtils.js)
> Security Utilities
  Input Sanitization, Encryption, and Security-related helpers

```javascript
/**
* Security Utilities
* Input Sanitization, Encryption, and Security-related helpers
*/
/**
* Escape HTML special characters to prevent XSS
* @param {string} str
* @returns {string}
*/
export const escapeHtml = (str) => {
```

```javascript
return str.replace(/[&<>"'`=/]/g, char => htmlEntities[char]);
```

```javascript
/**
* Strip HTML tags from a string
* @param {string} str
* @returns {string}
*/
export const stripHtml = (str) => {
```

```javascript
/**
* Sanitize an object's string properties (recursive)
* @param {object} obj
* @returns {object}
*/
export const sanitizeObject = (obj) => {
```

```javascript
/**
* Validate email format
* @param {string} email
* @returns {boolean}
*/
export const isValidEmail = (email) => {
```

```javascript
/**
* Validate Indian phone number
* @param {string} phone
* @returns {boolean}
*/
export const isValidIndianPhone = (phone) => {
```

```javascript
/**
* Validate Indian pincode
* @param {string} pincode
* @returns {boolean}
*/
export const isValidPincode = (pincode) => {
```

```javascript
/**
* Validate GST number format
* @param {string} gst
* @returns {boolean}
*/
export const isValidGST = (gst) => {
```

```javascript
/**
* Sanitize file name (remove path traversal attempts)
* @param {string} filename
* @returns {string}
*/
export const sanitizeFilename = (filename) => {
```

```javascript
/**
* Rate limiter helper (for form submissions)
*/
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
```

```javascript
/**
* Generate a secure random token
*/
export const generateSecureToken = (length = 32) => {
```

```javascript
/**
* Hash password using SHA256
*/
export const hashPassword = (password) => {
```

```javascript
/**
* Verify password against hash
*/
export const verifyPassword = (password, hash) => {
```

```javascript
/**
* Encrypt sensitive data
*/
export const encryptData = (data, key = process.env.VITE_ENCRYPTION_KEY) => {
```

```javascript
/**
* Decrypt sensitive data
*/
export const decryptData = (encryptedData, key = process.env.VITE_ENCRYPTION_KEY) => {
```

```javascript
/**
* Generate TOTP secret for 2FA
*/
export const generateTOTPSecret = () => {
```

```javascript
/**
* Generate OTP for email/SMS verification (6 digits)
*/
export const generateOTP = (length = 6) => {
```

```javascript
/**
* Hash sensitive identifiers (like API keys) for logging
*/
export const hashIdentifier = (identifier) => {
```

```javascript
/**
* Generate CSRF token
*/
export const generateCSRFToken = () => {
```

```javascript
/**
* Validate CSRF token
*/
export const validateCSRFToken = (token, storedToken) => {
```

```javascript
/**
* Sanitize user input to prevent XSS
*/
export const sanitizeInput = (input) => {
```

```javascript
/**
* Check if URL is safe and internal
*/
export const isSafeUrl = (url) => {
```

```javascript
/**
* Generate HTTP-only cookie string
*/
export const createSecureCookie = (name, value, options = {}) => {
```

```javascript
/**
* Validate JWT token structure (basic)
*/
export const isValidJWTStructure = (token) => {
```

```javascript
return parts.length === 3 && parts.every(part => part.length > 0);
```

```javascript
/**
* Extract JWT payload (without verification)
*/
export const extractJWTPayload = (token) => {
```

```javascript
/**
* Check if JWT is expired
*/
export const isJWTExpired = (token) => {
```

```javascript
/**
* Generate rate limit key
*/
export const generateRateLimitKey = (identifier, action) => {
```

## [selectors.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/selectors.js)
> Selectors - Redux/State selector functions
  Used for extracting and transforming data from global state
  Can be used with Reselect for memoization if needed

```javascript
/**
* Selectors - Redux/State selector functions
* Used for extracting and transforming data from global state
* Can be used with Reselect for memoization if needed
*/
export const selectAllOrders = (state) => state?.orders?.list || [];
```

```javascript
export const selectOrderById = (state, orderId) =>
```

```javascript
state?.orders?.list?.find(o => o.orderId === orderId);
```

```javascript
export const selectOrdersByStatus = (state, status) =>
```

```javascript
state?.orders?.list?.filter(o => o.status === status) || [];
```

```javascript
export const selectOrdersBySource = (state, source) =>
```

```javascript
state?.orders?.list?.filter(o => o.source === source) || [];
```

```javascript
export const selectOrdersByDateRange = (state, startDate, endDate) =>
```

```javascript
state?.orders?.list?.filter(o => {
```

```javascript
export const selectPendingOrders = (state) =>
```

```javascript
export const selectDeliveredOrders = (state) =>
```

```javascript
export const selectCancelledOrders = (state) =>
```

```javascript
export const selectTotalOrders = (state) => selectAllOrders(state).length;
```

```javascript
export const selectTotalOrderValue = (state) =>
```

```javascript
selectAllOrders(state).reduce((sum, order) => sum + (order.totalAmount || 0), 0);
```

```javascript
export const selectAverageOrderValue = (state) => {
```

```javascript
export const selectOrdersByPaymentMethod = (state, method) =>
```

```javascript
selectAllOrders(state).filter(o => o.paymentMethod === method);
```

```javascript
export const selectCODOrders = (state) =>
```

```javascript
export const selectPrepaidOrders = (state) =>
```

```javascript
export const selectAllProducts = (state) => state?.products?.list || [];
```

```javascript
export const selectProductById = (state, productId) =>
```

```javascript
state?.products?.list?.find(p => p.id === productId);
```

```javascript
export const selectProductBySKU = (state, sku) =>
```

```javascript
state?.products?.list?.find(p => p.sku === sku);
```

```javascript
export const selectProductsByCategory = (state, category) =>
```

```javascript
state?.products?.list?.filter(p => p.category === category) || [];
```

```javascript
export const selectLowStockProducts = (state, threshold = 10) =>
```

```javascript
state?.products?.list?.filter(p => p.stock <= threshold) || [];
```

```javascript
export const selectProductInventoryValue = (state) =>
```

```javascript
state?.products?.list?.reduce((sum, p) => sum + (p.price * p.stock), 0) || 0;
```

```javascript
export const selectAllCustomers = (state) => state?.customers?.list || [];
```

```javascript
export const selectCustomerById = (state, customerId) =>
```

```javascript
state?.customers?.list?.find(c => c.id === customerId);
```

```javascript
export const selectCustomerByEmail = (state, email) =>
```

```javascript
state?.customers?.list?.find(c => c.email === email);
```

```javascript
export const selectCustomerByPhone = (state, phone) =>
```

```javascript
state?.customers?.list?.find(c => c.phone === phone);
```

```javascript
export const selectCustomerOrderCount = (state, customerId) =>
```

```javascript
selectAllOrders(state).filter(o => o.customerId === customerId).length;
```

```javascript
export const selectTopCustomers = (state, limit = 10) => {
```

```javascript
.map(c => ({
```

```javascript
.filter(o => o.customerId === c.id)
```

```javascript
.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
```

```javascript
.sort((a, b) => b.totalSpent - a.totalSpent)
```

```javascript
export const selectAllWarehouses = (state) => state?.warehouses?.list || [];
```

```javascript
export const selectWarehouseById = (state, warehouseId) =>
```

```javascript
state?.warehouses?.list?.find(w => w.id === warehouseId);
```

```javascript
export const selectWarehouseByZone = (state, zone) =>
```

```javascript
state?.warehouses?.list?.filter(w => w.zone === zone) || [];
```

```javascript
export const selectWarehouseInventory = (state, warehouseId) =>
```

```javascript
state?.inventory?.filter(i => i.warehouseId === warehouseId) || [];
```

```javascript
export const selectAllShipments = (state) => state?.shipments?.list || [];
```

```javascript
export const selectShipmentById = (state, shipmentId) =>
```

```javascript
state?.shipments?.list?.find(s => s.id === shipmentId);
```

```javascript
export const selectShipmentsByCarrier = (state, carrier) =>
```

```javascript
state?.shipments?.list?.filter(s => s.carrier === carrier) || [];
```

```javascript
export const selectShipmentsByStatus = (state, status) =>
```

```javascript
state?.shipments?.list?.filter(s => s.status === status) || [];
```

```javascript
export const selectInTransitShipments = (state) =>
```

```javascript
export const selectPendingShipments = (state) =>
```

```javascript
export const selectDeliveredShipments = (state) =>
```

```javascript
export const selectOrdersByChannel = (state, channel) =>
```

```javascript
selectAllOrders(state).filter(o => o.source === channel);
```

```javascript
export const selectChannelMetrics = (state, channel) => {
```

```javascript
totalValue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
```

```javascript
avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length : 0
```

```javascript
export const selectAllChannelMetrics = (state) => {
```

```javascript
return channels.map(ch => selectChannelMetrics(state, ch));
```

```javascript
export const selectFilteredOrders = (state, filters = {}) => {
```

```javascript
if (filters.status) results = results.filter(o => o.status === filters.status);
```

```javascript
if (filters.source) results = results.filter(o => o.source === filters.source);
```

```javascript
if (filters.minAmount) results = results.filter(o => o.totalAmount >= filters.minAmount);
```

```javascript
if (filters.maxAmount) results = results.filter(o => o.totalAmount <= filters.maxAmount);
```

```javascript
if (filters.startDate) results = results.filter(o => new Date(o.createdAt) >= new Date(filters.startDate));
```

```javascript
if (filters.endDate) results = results.filter(o => new Date(o.createdAt) <= new Date(filters.endDate));
```

```javascript
results = results.filter(o =>
```

```javascript
export const selectPaginatedOrders = (state, page = 1, pageSize = 20) => {
```

```javascript
export const selectDashboardSummary = (state) => ({
```

```javascript
export const selectIsLoading = (state) => state?.ui?.loading || false;
```

```javascript
export const selectError = (state) => state?.ui?.error || null;
```

```javascript
export const selectOrdersLoading = (state) => state?.orders?.loading || false;
```

```javascript
export const selectOrdersError = (state) => state?.orders?.error || null;
```

```javascript
export const selectSortedOrders = (state, sortBy = 'createdAt', order = 'desc') => {
```

```javascript
return orders.sort((a, b) => {
```

```javascript
export const selectOrderCountByStatus = (state) => {
```

```javascript
orders.forEach(o => {
```

```javascript
export const selectRevenueByMonth = (state) => {
```

```javascript
orders.forEach(o => {
```

## [storageUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/storageUtils.js)
> Storage Utilities
  Provides abstraction for localStorage, sessionStorage, and IndexedDB operations
  with automatic serialization/deserialization and error handling

```javascript
/**
* Storage Utilities
* Provides abstraction for localStorage, sessionStorage, and IndexedDB operations
* with automatic serialization/deserialization and error handling
*/
/**
* Set item in localStorage
* @param {string} key - Storage key
* @param {*} value - Value to store (auto-serialized)
* @param {number} expiryMs - Optional expiry time in milliseconds
*/
set: (key, value, expiryMs = null) => {
```

```javascript
/**
* Get item from localStorage
* @param {string} key - Storage key
* @param {*} defaultValue - Default value if not found or expired
*/
get: (key, defaultValue = null) => {
```

```javascript
/**
* Remove item from localStorage
* @param {string} key - Storage key
*/
remove: (key) => {
```

```javascript
/**
* Clear all localStorage
*/
clear: () => {
```

```javascript
/**
* Check if key exists
* @param {string} key - Storage key
*/
has: (key) => {
```

```javascript
/**
* Get all keys
*/
keys: () => {
```

```javascript
return Object.keys(localStorage).filter((key) => {
```

```javascript
/**
* Set item in sessionStorage
* @param {string} key - Storage key
* @param {*} value - Value to store
*/
set: (key, value) => {
```

```javascript
/**
* Get item from sessionStorage
* @param {string} key - Storage key
* @param {*} defaultValue - Default value if not found
*/
get: (key, defaultValue = null) => {
```

```javascript
/**
* Remove item from sessionStorage
* @param {string} key - Storage key
*/
remove: (key) => {
```

```javascript
/**
* Clear all sessionStorage
*/
clear: () => {
```

```javascript
/**
* Initialize IndexedDB connection
* @param {Array} stores - Array of store definitions: [{name, keyPath, indexes}]
*/
init: async (stores = []) => {
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
request.onsuccess = () => {
```

```javascript
request.onupgradeneeded = (event) => {
```

```javascript
stores.forEach((store) => {
```

```javascript
store.indexes.forEach((index) => {
```

```javascript
/**
* Add item to IndexedDB
* @param {string} storeName - Store name
* @param {*} value - Value to store
*/
add: async (storeName, value) => {
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
request.onsuccess = () => resolve(request.result);
```

```javascript
/**
* Put item in IndexedDB (upsert)
* @param {string} storeName - Store name
* @param {*} value - Value to store
*/
put: async (storeName, value) => {
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
request.onsuccess = () => resolve(request.result);
```

```javascript
/**
* Get item from IndexedDB
* @param {string} storeName - Store name
* @param {*} key - Key to retrieve
*/
get: async (storeName, key) => {
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
request.onsuccess = () => resolve(request.result);
```

```javascript
/**
* Get all items from IndexedDB store
* @param {string} storeName - Store name
*/
getAll: async (storeName) => {
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
request.onsuccess = () => resolve(request.result);
```

```javascript
/**
* Delete item from IndexedDB
* @param {string} storeName - Store name
* @param {*} key - Key to delete
*/
delete: async (storeName, key) => {
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
request.onsuccess = () => resolve();
```

```javascript
/**
* Clear entire store
* @param {string} storeName - Store name
*/
clear: async (storeName) => {
```

```javascript
return new Promise((resolve, reject) => {
```

```javascript
request.onerror = () => reject(request.error);
```

```javascript
request.onsuccess = () => resolve();
```

## [validationUtils.js](file:///Users/anandinisingh/Downloads/webdev2/ots-webapp/src/utils/validationUtils.js)
> ValidationUtils - Core validation functions for the app
  Used for orders, users, addresses, and field-level validation
  India-first: handles GST, state codes, phone numbers

```javascript
/**
* ValidationUtils - Core validation functions for the app
* Used for orders, users, addresses, and field-level validation
* India-first: handles GST, state codes, phone numbers
*/
export const isValidIndianPhoneNumber = (phone) => {
```

```javascript
export const isValidEmail = (email) => {
```

```javascript
export const isValidGST = (gst) => {
```

```javascript
export const isValidPAN = (pan) => {
```

```javascript
export const isValidIndianPincode = (pincode) => {
```

```javascript
export const isValidAadhar = (aadhar) => {
```

```javascript
export const isValidAddress = (address) => {
```

```javascript
export const isValidOrderId = (orderId) => {
```

```javascript
export const isValidSKU = (sku) => {
```

```javascript
export const isValidAmount = (amount) => {
```

```javascript
export const isValidQuantity = (qty) => {
```

```javascript
export const isValidWeight = (weight) => {
```

```javascript
export const isValidDimensions = (length, width, height) => {
```

```javascript
const isValid = (dim) => {
```

```javascript
export const isValidOrderStatus = (status) => {
```

```javascript
export const isValidPaymentMethod = (method) => {
```

```javascript
export const isValidCarrier = (carrier) => {
```

```javascript
export const isValidOrderSource = (source) => {
```

```javascript
export const isValidStateCode = (stateCode) => {
```

```javascript
export const validateOrder = (order) => {
```

```javascript
order.items.forEach((item, idx) => {
```

```javascript
export const validateBatchEmails = (emails) => {
```

```javascript
return emails.map((email, idx) => ({
```

```javascript
export const validateBatchPhones = (phones) => {
```

```javascript
return phones.map((phone, idx) => ({
```

