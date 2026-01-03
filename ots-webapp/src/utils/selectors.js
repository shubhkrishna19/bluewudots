/**
 * Selectors - Redux/State selector functions
 * Used for extracting and transforming data from global state
 * Can be used with Reselect for memoization if needed
 */

// Order selectors
export const selectAllOrders = (state) => state?.orders?.list || [];
export const selectOrderById = (state, orderId) => 
  state?.orders?.list?.find(o => o.orderId === orderId);
export const selectOrdersByStatus = (state, status) => 
  state?.orders?.list?.filter(o => o.status === status) || [];
export const selectOrdersBySource = (state, source) => 
  state?.orders?.list?.filter(o => o.source === source) || [];
export const selectOrdersByDateRange = (state, startDate, endDate) => 
  state?.orders?.list?.filter(o => {
    const d = new Date(o.createdAt);
    return d >= new Date(startDate) && d <= new Date(endDate);
  }) || [];
export const selectPendingOrders = (state) => 
  selectOrdersByStatus(state, 'PENDING');
export const selectDeliveredOrders = (state) => 
  selectOrdersByStatus(state, 'DELIVERED');
export const selectCancelledOrders = (state) => 
  selectOrdersByStatus(state, 'CANCELLED');

// Order analytics selectors
export const selectTotalOrders = (state) => selectAllOrders(state).length;
export const selectTotalOrderValue = (state) => 
  selectAllOrders(state).reduce((sum, order) => sum + (order.totalAmount || 0), 0);
export const selectAverageOrderValue = (state) => {
  const orders = selectAllOrders(state);
  return orders.length > 0 ? selectTotalOrderValue(state) / orders.length : 0;
};
export const selectOrdersByPaymentMethod = (state, method) => 
  selectAllOrders(state).filter(o => o.paymentMethod === method);
export const selectCODOrders = (state) => 
  selectOrdersByPaymentMethod(state, 'COD');
export const selectPrepaidOrders = (state) => 
  selectOrdersByPaymentMethod(state, 'PREPAID');

// Product/Item selectors
export const selectAllProducts = (state) => state?.products?.list || [];
export const selectProductById = (state, productId) => 
  state?.products?.list?.find(p => p.id === productId);
export const selectProductBySKU = (state, sku) => 
  state?.products?.list?.find(p => p.sku === sku);
export const selectProductsByCategory = (state, category) => 
  state?.products?.list?.filter(p => p.category === category) || [];
export const selectLowStockProducts = (state, threshold = 10) => 
  state?.products?.list?.filter(p => p.stock <= threshold) || [];
export const selectProductInventoryValue = (state) => 
  state?.products?.list?.reduce((sum, p) => sum + (p.price * p.stock), 0) || 0;

// User/Customer selectors
export const selectAllCustomers = (state) => state?.customers?.list || [];
export const selectCustomerById = (state, customerId) => 
  state?.customers?.list?.find(c => c.id === customerId);
export const selectCustomerByEmail = (state, email) => 
  state?.customers?.list?.find(c => c.email === email);
export const selectCustomerByPhone = (state, phone) => 
  state?.customers?.list?.find(c => c.phone === phone);
export const selectCustomerOrderCount = (state, customerId) => 
  selectAllOrders(state).filter(o => o.customerId === customerId).length;
export const selectTopCustomers = (state, limit = 10) => {
  const customers = selectAllCustomers(state);
  return customers
    .map(c => ({
      ...c,
      orderCount: selectCustomerOrderCount(state, c.id),
      totalSpent: selectAllOrders(state)
        .filter(o => o.customerId === c.id)
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
};

// Warehouse/Inventory selectors
export const selectAllWarehouses = (state) => state?.warehouses?.list || [];
export const selectWarehouseById = (state, warehouseId) => 
  state?.warehouses?.list?.find(w => w.id === warehouseId);
export const selectWarehouseByZone = (state, zone) => 
  state?.warehouses?.list?.filter(w => w.zone === zone) || [];
export const selectWarehouseInventory = (state, warehouseId) => 
  state?.inventory?.filter(i => i.warehouseId === warehouseId) || [];

// Shipment/Logistics selectors
export const selectAllShipments = (state) => state?.shipments?.list || [];
export const selectShipmentById = (state, shipmentId) => 
  state?.shipments?.list?.find(s => s.id === shipmentId);
export const selectShipmentsByCarrier = (state, carrier) => 
  state?.shipments?.list?.filter(s => s.carrier === carrier) || [];
export const selectShipmentsByStatus = (state, status) => 
  state?.shipments?.list?.filter(s => s.status === status) || [];
export const selectInTransitShipments = (state) => 
  selectShipmentsByStatus(state, 'IN_TRANSIT');
export const selectPendingShipments = (state) => 
  selectShipmentsByStatus(state, 'PENDING');
export const selectDeliveredShipments = (state) => 
  selectShipmentsByStatus(state, 'DELIVERED');

// Channel selectors
export const selectOrdersByChannel = (state, channel) => 
  selectAllOrders(state).filter(o => o.source === channel);
export const selectChannelMetrics = (state, channel) => {
  const orders = selectOrdersByChannel(state, channel);
  return {
    channel,
    orderCount: orders.length,
    totalValue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length : 0
  };
};
export const selectAllChannelMetrics = (state) => {
  const channels = ['AMAZON', 'FLIPKART', 'MYNTRA', 'MEESHO', 'WEBSITE', 'INSTAGRAM', 'WHATSAPP', 'MANUAL'];
  return channels.map(ch => selectChannelMetrics(state, ch));
};

// Filter/Search selectors
export const selectFilteredOrders = (state, filters = {}) => {
  let results = selectAllOrders(state);
  
  if (filters.status) results = results.filter(o => o.status === filters.status);
  if (filters.source) results = results.filter(o => o.source === filters.source);
  if (filters.minAmount) results = results.filter(o => o.totalAmount >= filters.minAmount);
  if (filters.maxAmount) results = results.filter(o => o.totalAmount <= filters.maxAmount);
  if (filters.startDate) results = results.filter(o => new Date(o.createdAt) >= new Date(filters.startDate));
  if (filters.endDate) results = results.filter(o => new Date(o.createdAt) <= new Date(filters.endDate));
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(o => 
      o.orderId?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.email?.toLowerCase().includes(q) ||
      o.phone?.includes(q)
    );
  }
  
  return results;
};

// Pagination selectors
export const selectPaginatedOrders = (state, page = 1, pageSize = 20) => {
  const orders = selectAllOrders(state);
  const start = (page - 1) * pageSize;
  return {
    data: orders.slice(start, start + pageSize),
    total: orders.length,
    page,
    pageSize,
    totalPages: Math.ceil(orders.length / pageSize)
  };
};

// Dashboard/Summary selectors
export const selectDashboardSummary = (state) => ({
  totalOrders: selectTotalOrders(state),
  totalOrderValue: selectTotalOrderValue(state),
  avgOrderValue: selectAverageOrderValue(state),
  pendingOrders: selectPendingOrders(state).length,
  deliveredOrders: selectDeliveredOrders(state).length,
  cancelledOrders: selectCancelledOrders(state).length,
  totalCustomers: selectAllCustomers(state).length,
  totalProducts: selectAllProducts(state).length,
  inTransitShipments: selectInTransitShipments(state).length,
  pendingShipments: selectPendingShipments(state).length
});

// Loading and Error selectors
export const selectIsLoading = (state) => state?.ui?.loading || false;
export const selectError = (state) => state?.ui?.error || null;
export const selectOrdersLoading = (state) => state?.orders?.loading || false;
export const selectOrdersError = (state) => state?.orders?.error || null;

// Sorting selectors
export const selectSortedOrders = (state, sortBy = 'createdAt', order = 'desc') => {
  const orders = [...selectAllOrders(state)];
  return orders.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (order === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });
};

// Aggregation selectors
export const selectOrderCountByStatus = (state) => {
  const orders = selectAllOrders(state);
  const counts = {};
  orders.forEach(o => {
    counts[o.status] = (counts[o.status] || 0) + 1;
  });
  return counts;
};

export const selectRevenueByMonth = (state) => {
  const orders = selectAllOrders(state);
  const revenue = {};
  orders.forEach(o => {
    const date = new Date(o.createdAt);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    revenue[month] = (revenue[month] || 0) + (o.totalAmount || 0);
  });
  return revenue;
};

export default {
  selectAllOrders,
  selectOrderById,
  selectOrdersByStatus,
  selectTotalOrders,
  selectTotalOrderValue,
  selectAverageOrderValue,
  selectAllCustomers,
  selectTopCustomers,
  selectAllProducts,
  selectLowStockProducts,
  selectDashboardSummary,
  selectFilteredOrders,
  selectPaginatedOrders,
  selectSortedOrders,
  selectOrderCountByStatus,
  selectRevenueByMonth,
  selectChannelMetrics
};
