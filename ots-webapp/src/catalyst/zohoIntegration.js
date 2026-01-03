/**
 * Zoho Catalyst Integration
 * Backend functions for Zoho Creator and Catalyst integration
 * Handles API calls, data syncing, and business logic
 */

// Configuration
const CATALYST_CONFIG = {
  tableId: process.env.ZOHO_TABLE_ID,
  appId: process.env.ZOHO_APP_ID,
  orgId: process.env.ZOHO_ORG_ID,
  apiKey: process.env.ZOHO_API_KEY,
  apiUrl: 'https://catalyst.zoho.com/api/v1',
}

/**
 * Create a new order in Zoho Creator
 */
export const createOrderInZoho = async (orderData) => {
  try {
    const response = await fetch(
      `${CATALYST_CONFIG.apiUrl}/tables/${CATALYST_CONFIG.tableId}/rows`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Zoho-oauthtoken ${CATALYST_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          data: orderData,
          options: { notify: true },
        }),
      }
    )
    if (!response.ok) throw new Error('Failed to create order')
    return await response.json()
  } catch (error) {
    console.error('Error creating order in Zoho:', error)
    throw error
  }
}

/**
 * Update existing order in Zoho Creator
 */
export const updateOrderInZoho = async (rowId, orderData) => {
  try {
    const response = await fetch(
      `${CATALYST_CONFIG.apiUrl}/tables/${CATALYST_CONFIG.tableId}/rows/${rowId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Zoho-oauthtoken ${CATALYST_CONFIG.apiKey}`,
        },
        body: JSON.stringify({ data: orderData }),
      }
    )
    if (!response.ok) throw new Error('Failed to update order')
    return await response.json()
  } catch (error) {
    console.error('Error updating order in Zoho:', error)
    throw error
  }
}

/**
 * Fetch orders from Zoho Creator
 */
export const fetchOrdersFromZoho = async (filters = {}) => {
  try {
    let url = `${CATALYST_CONFIG.apiUrl}/tables/${CATALYST_CONFIG.tableId}/rows`
    const params = new URLSearchParams()
    if (filters.status) params.append('filter', `status = '${filters.status}'`)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.offset) params.append('offset', filters.offset)
    if (params.toString()) url += '?' + params.toString()

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Zoho-oauthtoken ${CATALYST_CONFIG.apiKey}` },
    })
    if (!response.ok) throw new Error('Failed to fetch orders')
    return await response.json()
  } catch (error) {
    console.error('Error fetching orders from Zoho:', error)
    throw error
  }
}

/**
 * Sync orders between local state and Zoho
 */
export const syncOrdersToZoho = async (localOrders) => {
  const syncResults = { created: [], updated: [], failed: [] }
  for (const order of localOrders) {
    try {
      if (order.zohoId) {
        await updateOrderInZoho(order.zohoId, order)
        syncResults.updated.push(order.orderId)
      } else {
        const result = await createOrderInZoho(order)
        syncResults.created.push(order.orderId)
      }
    } catch (error) {
      syncResults.failed.push({ orderId: order.orderId, error: error.message })
    }
  }
  return syncResults
}

/**
 * Fetch inventory from Zoho CRM
 */
export const fetchInventoryFromZohoCRM = async () => {
  try {
    const response = await fetch('https://www.zohoapis.com/crm/v3/modules/Inventory', {
      headers: { Authorization: `Zoho-oauthtoken ${CATALYST_CONFIG.apiKey}` },
    })
    if (!response.ok) throw new Error('Failed to fetch inventory')
    return await response.json()
  } catch (error) {
    console.error('Error fetching inventory from Zoho CRM:', error)
    throw error
  }
}

/**
 * Log activity to Zoho Creator activity table
 */
export const logActivityToZoho = async (activity) => {
  try {
    const activityData = {
      orderId: activity.orderId,
      action: activity.action,
      timestamp: new Date().toISOString(),
      userId: activity.userId,
      details: activity.details,
      status: activity.status,
    }
    const response = await fetch(
      `${CATALYST_CONFIG.apiUrl}/tables/${CATALYST_CONFIG.tableId}/rows`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Zoho-oauthtoken ${CATALYST_CONFIG.apiKey}`,
        },
        body: JSON.stringify({ data: activityData }),
      }
    )
    if (!response.ok) throw new Error('Failed to log activity')
    return await response.json()
  } catch (error) {
    console.error('Error logging activity to Zoho:', error)
    throw error
  }
}

/**
 * Fetch analytics/metrics from Zoho
 */
export const fetchAnalyticsFromZoho = async (dateRange = {}) => {
  try {
    const { startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate = new Date() } =
      dateRange
    const response = await fetch(
      `${CATALYST_CONFIG.apiUrl}/tables/${CATALYST_CONFIG.tableId}/rows?filter=createdAt >= '${startDate.toISOString()}' AND createdAt <= '${endDate.toISOString()}'`,
      { headers: { Authorization: `Zoho-oauthtoken ${CATALYST_CONFIG.apiKey}` } }
    )
    if (!response.ok) throw new Error('Failed to fetch analytics')
    const data = await response.json()
    return aggregateAnalyticsData(data.data)
  } catch (error) {
    console.error('Error fetching analytics from Zoho:', error)
    throw error
  }
}

/**
 * Aggregate raw order data into analytics
 */
const aggregateAnalyticsData = (orders) => {
  const analytics = {
    totalOrders: orders.length,
    totalRevenue: 0,
    ordersByStatus: {},
    ordersBySource: {},
    ordersByDate: {},
    topProducts: {},
    customerMetrics: { totalCustomers: new Set(), repeatCustomers: 0 },
  }

  orders.forEach((order) => {
    analytics.totalRevenue += order.totalAmount || 0
    analytics.ordersByStatus[order.status] = (analytics.ordersByStatus[order.status] || 0) + 1
    analytics.ordersBySource[order.source] = (analytics.ordersBySource[order.source] || 0) + 1
    const date = new Date(order.createdAt).toISOString().split('T')[0]
    analytics.ordersByDate[date] = (analytics.ordersByDate[date] || 0) + 1
    if (order.customerId) analytics.customerMetrics.totalCustomers.add(order.customerId)
    if (order.items) {
      order.items.forEach((item) => {
        analytics.topProducts[item.sku] = (analytics.topProducts[item.sku] || 0) + item.quantity
      })
    }
  })

  analytics.customerMetrics.totalCustomers = analytics.customerMetrics.totalCustomers.size
  return analytics
}

/**
 * Validate Zoho connection
 */
export const validateZohoConnection = async () => {
  try {
    const response = await fetch(`${CATALYST_CONFIG.apiUrl}/tables/${CATALYST_CONFIG.tableId}`, {
      headers: { Authorization: `Zoho-oauthtoken ${CATALYST_CONFIG.apiKey}` },
    })
    return response.ok
  } catch (error) {
    console.error('Error validating Zoho connection:', error)
    return false
  }
}

export default {
  createOrderInZoho,
  updateOrderInZoho,
  fetchOrdersFromZoho,
  syncOrdersToZoho,
  fetchInventoryFromZohoCRM,
  logActivityToZoho,
  fetchAnalyticsFromZoho,
  validateZohoConnection,
}
