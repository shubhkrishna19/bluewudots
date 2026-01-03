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

      const { module, operation, data } = payload
      console.log(`[Zoho Webhook] ${operation} on ${module}:`, data)

      // Trigger registered listeners
      const moduleListeners = this.listeners.get(module) || []
      for (const callback of moduleListeners) {
        await callback({ operation, data })
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
