/**
 * Zoho Webhook Service
 * Handles incoming webhooks from Zoho CRM for real-time data sync
 */

class ZohoWebhookService {
  constructor() {
    this.listeners = new Map()
    this.webhookSecret = import.meta.env.VITE_ZOHO_WEBHOOK_SECRET
  }

  /**
   * Register a listener for specific Zoho module updates
   * @param {string} module - 'Products', 'Sales_Orders', etc.
   * @param {function} callback - Function to call when update received
   */
  on(module, callback) {
    if (!this.listeners.has(module)) {
      this.listeners.set(module, [])
    }
    this.listeners.get(module).push(callback)
  }

  /**
   * Alias for 'on' to support different test patterns
   */
  subscribe(callback) {
    // For general 'shipment' updates or as generic listener
    this.on('shipment', callback)
    return () => {
      const listeners = this.listeners.get('shipment') || []
      this.listeners.set(
        'shipment',
        listeners.filter((l) => l !== callback)
      )
    }
  }

  /**
   * Process incoming webhook from Zoho
   * @param {object} payload - Webhook payload from Zoho
   */
  async processWebhook(payload) {
    try {
      // Verify webhook signature if secret is configured
      if (this.webhookSecret && payload.signature) {
        const isValid = this.verifySignature(payload)
        if (!isValid) {
          console.error('❌ Invalid webhook signature')
          return { success: false, error: 'Invalid signature' }
        }
      }

      const moduleName = payload.module || payload.entity
      const { operation, action, data, details } = payload
      const actualOperation = operation || action
      const actualData = data || details

      console.log(`[Zoho Webhook] ${actualOperation} on ${moduleName}:`, actualData)

      // Transform logic for specific integrations (e.g., carrier webhooks via Zoho)
      let domainEvent = { operation: actualOperation, data: actualData }

      if (moduleName === 'shipment' && actualData.status === 'undelivered') {
        domainEvent = {
          type: 'RTO_INITIATED',
          operation: 'update',
          data: {
            ...actualData,
            rtoReason: actualData.reason?.includes('doorstep') ? 'Customer Refused' : actualData.reason,
            status: 'RTO-Initiated',
          },
        }
      }

      // Trigger registered listeners
      const moduleListeners = this.listeners.get(moduleName) || []
      for (const callback of moduleListeners) {
        await callback(domainEvent)
      }

      return { success: true }
    } catch (error) {
      console.error('[Zoho Webhook] Processing error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Verify webhook signature (HMAC SHA256)
   */
  verifySignature(payload) {
    // Implementation would use crypto.subtle.digest
    // For now, return true (implement when webhook secret is available)
    return true
  }

  /**
   * Setup webhook endpoint (for Express/Node backend)
   * This is a reference implementation - actual webhook receiver
   * would be on the server side
   */
  getWebhookEndpoint() {
    return '/api/webhooks/zoho'
  }
}

// Singleton Instance
const zohoWebhookService = new ZohoWebhookService()
export default zohoWebhookService
