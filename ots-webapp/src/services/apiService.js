/**
 * API Service Layer - Centralized API management for all integrations
 * This abstracts away the complexity of different API endpoints
 */

const API_BASE = import.meta.env.VITE_CATALYST_URL || ''

// ============================================
// ZOHO CREATOR API
// ============================================
export const CreatorAPI = {
  baseUrl: `${API_BASE}/server/creator`,

  /**
   * Get records from a Creator report
   * @param {string} reportName - Name of the Creator report
   * @param {object} criteria - Optional filter criteria
   */
  async getRecords(reportName, criteria = {}) {
    try {
      const params = new URLSearchParams({
        report: reportName,
        ...criteria,
      })
      const response = await fetch(`${this.baseUrl}/records?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error(`Creator API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Creator API getRecords failed:', error)
      throw error
    }
  },

  /**
   * Create a new record in Creator
   * @param {string} formName - Name of the Creator form
   * @param {object} data - Record data
   */
  async createRecord(formName, data) {
    try {
      const response = await fetch(`${this.baseUrl}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ form: formName, data }),
      })
      if (!response.ok) throw new Error(`Creator API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Creator API createRecord failed:', error)
      throw error
    }
  },

  /**
   * Update a record in Creator
   * @param {string} reportName - Report containing the record
   * @param {string} recordId - ID of the record to update
   * @param {object} data - Fields to update
   */
  async updateRecord(reportName, recordId, data) {
    try {
      const response = await fetch(`${this.baseUrl}/records/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report: reportName, data }),
      })
      if (!response.ok) throw new Error(`Creator API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Creator API updateRecord failed:', error)
      throw error
    }
  },
}

// ============================================
// ZOHO CRM API
// ============================================
export const CRMAPI = {
  baseUrl: `${API_BASE}/server/crm`,

  /**
   * Get accounts (dealers) from CRM
   * @param {object} params - Query parameters
   */
  async getAccounts(params = {}) {
    try {
      const queryParams = new URLSearchParams(params)
      const response = await fetch(`${this.baseUrl}/accounts?${queryParams}`)
      if (!response.ok) throw new Error(`CRM API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('CRM API getAccounts failed:', error)
      throw error
    }
  },

  /**
   * Get a single account by ID
   * @param {string} accountId
   */
  async getAccountById(accountId) {
    try {
      const response = await fetch(`${this.baseUrl}/accounts/${accountId}`)
      if (!response.ok) throw new Error(`CRM API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('CRM API getAccountById failed:', error)
      throw error
    }
  },

  /**
   * Search accounts by name or code
   * @param {string} query
   */
  async searchAccounts(query) {
    return this.getAccounts({ search: query })
  },
}

// ============================================
// AMAZON SP-API
// ============================================
export const AmazonAPI = {
  baseUrl: `${API_BASE}/server/amazon`,

  /**
   * Get orders from Amazon
   * @param {object} params - Date range, status filters
   */
  async getOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        createdAfter:
          params.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        ...params,
      })
      const response = await fetch(`${this.baseUrl}/orders?${queryParams}`)
      if (!response.ok) throw new Error(`Amazon API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Amazon API getOrders failed:', error)
      throw error
    }
  },

  /**
   * Get order details including items
   * @param {string} orderId - Amazon Order ID
   */
  async getOrderDetails(orderId) {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`)
      if (!response.ok) throw new Error(`Amazon API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Amazon API getOrderDetails failed:', error)
      throw error
    }
  },
}

// ============================================
// FLIPKART API
// ============================================
export const FlipkartAPI = {
  baseUrl: `${API_BASE}/server/flipkart`,

  /**
   * Get orders from Flipkart
   * @param {object} params - Filters
   */
  async getOrders(params = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filter: {
            states: params.states || ['APPROVED'],
            ...params,
          },
        }),
      })
      if (!response.ok) throw new Error(`Flipkart API Error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Flipkart API getOrders failed:', error)
      throw error
    }
  },
}

// ============================================
// CARRIER APIs
// ============================================
export const CarrierAPI = {
  delhivery: {
    baseUrl: `${API_BASE}/server/delhivery`,

    async createWaybill(orderData) {
      const response = await fetch(`${this.baseUrl}/waybill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      return response.json()
    },

    async trackShipment(awb) {
      const response = await fetch(`${this.baseUrl}/track/${awb}`)
      return response.json()
    },

    async getLabel(awb) {
      const response = await fetch(`${this.baseUrl}/label/${awb}`)
      return response.blob()
    },
  },

  bluedart: {
    baseUrl: `${API_BASE}/server/bluedart`,

    async createWaybill(orderData) {
      const response = await fetch(`${this.baseUrl}/waybill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      return response.json()
    },

    async trackShipment(awb) {
      const response = await fetch(`${this.baseUrl}/track/${awb}`)
      return response.json()
    },
  },

  xpressbees: {
    baseUrl: `${API_BASE}/server/xpressbees`,

    async createWaybill(orderData) {
      const response = await fetch(`${this.baseUrl}/waybill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      return response.json()
    },

    async trackShipment(awb) {
      const response = await fetch(`${this.baseUrl}/track/${awb}`)
      return response.json()
    },
  },
}

// ============================================
// UTILITY: API Health Check
// ============================================
export const checkAPIHealth = async () => {
  const results = {}

  try {
    const creatorRes = await fetch(`${API_BASE}/server/health/creator`)
    results.creator = creatorRes.ok
  } catch {
    results.creator = false
  }

  try {
    const crmRes = await fetch(`${API_BASE}/server/health/crm`)
    results.crm = crmRes.ok
  } catch {
    results.crm = false
  }

  try {
    const amazonRes = await fetch(`${API_BASE}/server/health/amazon`)
    results.amazon = amazonRes.ok
  } catch {
    results.amazon = false
  }

  return results
}

export default {
  CreatorAPI,
  CRMAPI,
  AmazonAPI,
  FlipkartAPI,
  CarrierAPI,
  checkAPIHealth,
}
