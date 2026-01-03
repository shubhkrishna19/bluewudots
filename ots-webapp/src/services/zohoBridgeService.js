import { SKU_MASTER } from '../data/skuMasterData'

/**
 * Zoho CRM Bridge Service - Real API Implementation
 * Handles OAuth 2.0 authentication and communication with Zoho CRM v2 API
 */

const ZOHO_CONFIG = {
  clientId: import.meta.env.VITE_ZOHO_CLIENT_ID,
  clientSecret: import.meta.env.VITE_ZOHO_CLIENT_SECRET,
  refreshToken: import.meta.env.VITE_ZOHO_REFRESH_TOKEN,
  orgId: import.meta.env.VITE_ZOHO_ORG_ID,
  apiDomain: import.meta.env.VITE_ZOHO_API_DOMAIN || 'https://www.zohoapis.com',
  accountsDomain: 'https://accounts.zoho.com',
}

class ZohoBridgeService {
  constructor() {
    this.accessToken = null
    this.tokenExpiry = null
    this.isConfigured = !!(ZOHO_CONFIG.clientId && ZOHO_CONFIG.refreshToken)

    if (!this.isConfigured) {
      console.warn('⚠️ Zoho CRM running in OFFLINE MODE (missing credentials)')
    }
  }

  /**
   * Refresh OAuth access token using refresh token
   */
  async refreshAccessToken() {
    if (!this.isConfigured) return null

    try {
      const response = await fetch(`${ZOHO_CONFIG.accountsDomain}/oauth/v2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          refresh_token: ZOHO_CONFIG.refreshToken,
          client_id: ZOHO_CONFIG.clientId,
          client_secret: ZOHO_CONFIG.clientSecret,
          grant_type: 'refresh_token',
        }),
      })

      if (!response.ok) {
        throw new Error(`OAuth refresh failed: ${response.status}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + data.expires_in * 1000

      console.log('✅ Zoho OAuth token refreshed')
      return this.accessToken
    } catch (error) {
      console.error('❌ Zoho OAuth Error:', error)
      return null
    }
  }

  /**
   * Get valid access token (refresh if expired)
   */
  async getAccessToken() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.refreshAccessToken()
    }
    return this.accessToken
  }

  /**
   * Fetch latest SKU master from Zoho CRM Products module
   * @returns {Promise<Array>} List of SKU objects
   */
  async fetchSKUMaster() {
    try {
      console.log('[Zoho] 🔄 Fetching SKU Master from CRM...')

      if (!this.isConfigured) {
        console.warn('[Zoho] ⚠️ Offline mode - using seed data')
        return SKU_MASTER
      }

      const token = await this.getAccessToken()
      if (!token) {
        return SKU_MASTER // Fallback
      }

      const response = await fetch(
        `${ZOHO_CONFIG.apiDomain}/crm/v2/Products?fields=Product_Name,Product_Code,Unit_Price,Qty_in_Stock`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        console.warn('[Zoho] API Error, falling back to seed data')
        return SKU_MASTER
      }

      const data = await response.json()
      const skus = data.data.map((product) => ({
        sku: product.Product_Code,
        name: product.Product_Name,
        price: product.Unit_Price,
        stock: product.Qty_in_Stock || 0,
        zohoId: product.id,
      }))

      console.log(`✅ Synchronized ${skus.length} SKUs from Zoho CRM`)
      return skus
    } catch (error) {
      console.error('[Zoho] ❌ SKU Sync Error:', error)
      return SKU_MASTER // Resilient fallback
    }
  }

  /**
   * Push order to Zoho CRM Sales Orders module
   * @param {Object} order - Order data
   * @returns {Promise<Object>} Response from Zoho
   */
  async pushOrderToZoho(order) {
    try {
      console.log(`[Zoho] 📤 Pushing Order ${order.id} to CRM...`)

      if (!this.isConfigured) {
        console.log('[Zoho] Offline mode - order not synced')
        return { success: false, offline: true }
      }

      const token = await this.getAccessToken()
      if (!token) {
        throw new Error('Failed to get access token')
      }

      const zohoOrder = {
        Subject: `Order ${order.id}`,
        Customer_Name: order.customer || order.customerName,
        Status: this.mapStatusToZoho(order.status),
        Grand_Total: order.amount || order.totalAmount,
        Shipping_City: order.city,
        Shipping_State: order.state,
        Shipping_Code: order.pincode,
        Product_Details: [
          {
            product: { name: order.sku },
            quantity: order.quantity || 1,
          },
        ],
      }

      const response = await fetch(`${ZOHO_CONFIG.apiDomain}/crm/v2/Sales_Orders`, {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [zohoOrder] }),
      })

      if (!response.ok) {
        throw new Error(`Zoho API Error: ${response.status}`)
      }

      const data = await response.json()
      console.log(`✅ Order ${order.id} synced to Zoho CRM`)
      return { success: true, zohoId: data.data[0].details.id }
    } catch (error) {
      console.error('❌ Zoho Order Push Error:', error)
      throw error
    }
  }

  /**
   * Map internal order status to Zoho status
   */
  mapStatusToZoho(status) {
    const statusMap = {
      Pending: 'Created',
      Imported: 'Created',
      'Carrier-Assigned': 'Approved',
      'In-Transit': 'Delivered',
      Delivered: 'Delivered',
      RTO: 'Cancelled',
    }
    return statusMap[status] || 'Created'
  }

  /**
   * Push only modified orders to Zoho (Delta Sync)
   * @param {Array} orders - List of all orders
   * @returns {Promise<Object>} Results summary
   */
  async syncDeltaOrders(orders) {
    const lastSync = localStorage.getItem('last_zoho_sync_time')
    const modifiedOrders = orders.filter(
      (o) => !lastSync || new Date(o.lastUpdated || o.updatedAt) > new Date(lastSync)
    )

    if (modifiedOrders.length === 0) {
      return { success: true, count: 0 }
    }

    console.log(`🔄 Syncing ${modifiedOrders.length} modified orders to Zoho...`)

    const results = await Promise.allSettled(modifiedOrders.map((o) => this.pushOrderToZoho(o)))

    localStorage.setItem('last_zoho_sync_time', new Date().toISOString())

    return {
      success: true,
      count: modifiedOrders.length,
      succeeded: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
    }
  }
}

// Singleton Instance
const zohoBridgeService = new ZohoBridgeService()

export const fetchSKUMaster = () => zohoBridgeService.fetchSKUMaster()
export const pushOrderToZoho = (order) => zohoBridgeService.pushOrderToZoho(order)
export const syncDeltaOrders = (orders) => zohoBridgeService.syncDeltaOrders(orders)

export default zohoBridgeService
