/**
 * WhatsApp Business API Service
<<<<<<< HEAD
 * Comprehensive integration for sending order status updates via WhatsApp,
 * message templating, batch delivery, and retry logic.
=======
 * unified service handling both Real API and Simulation modes.
 * 
 * Features:
 * - Token refresh and management
 * - Message templating
 * - Error handling & retry logic
 * - Rate limiting
 * - Delivery tracking
 * - Offline Queue Support
>>>>>>> d69d792bf4d2adf3b6ce1623aaa55ba05e8e8502
 */

import { cacheData, retrieveCachedData } from './offlineCacheService';

<<<<<<< HEAD
const WHATSAPP_API_BASE = import.meta.env.VITE_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';

/**
 * Approved Message Templates
 */
export const MESSAGE_TEMPLATES = {
  ORDER_CONFIRMED: {
    id: 'order_confirmed_v1',
    body: '✅ Order Confirmed\nYour order #{orderId} has been confirmed!\nTotal: ₹{amount}\nEstimated Delivery: {deliveryDate}'
  },
  ORDER_SHIPPED: {
    id: 'order_shipped_v1',
    body: '📦 Order Shipped!\nYour order #{orderId} is on its way.\nTracking: {awb}\nCarrier: {carrier}'
  },
  ORDER_DELIVERED: {
    id: 'order_delivered_v1',
    body: '✅ Order Delivered!\nYour order #{orderId} has been delivered.\nThank you for shopping with Bluewud!'
  },
  ORDER_OUT_FOR_DELIVERY: {
    id: 'order_out_for_delivery_v1',
    body: '🚚 Out for Delivery!\nYour order #{orderId} is out for delivery today.\nExpected by: {deliveryTime}'
  },
  RTO_ALERT: {
    id: 'rto_alert_v1',
    body: '⚠️ Delivery Issue\nWe had an issue delivering order #{orderId}.\nWe will attempt re-delivery. Contact us if needed.'
  }
};

class WhatsAppService {
  constructor(apiToken = null, businessAccountId = null, phoneNumberId = null) {
    this.apiToken = apiToken || import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
    this.businessAccountId = businessAccountId || import.meta.env.VITE_WHATSAPP_BUSINESS_ID;
    this.phoneNumberId = phoneNumberId || import.meta.env.VITE_WHATSAPP_PHONE_ID;
    this.baseUrl = WHATSAPP_API_BASE;
    this.batchSize = 50;
    this.retryAttempts = 3;
    this.isDevelopment = !this.apiToken || !this.phoneNumberId;
  }

  /**
   * Format phone number to E.164 without '+'
   */
  normalizePhoneNumber(phone) {
    if (!phone) return null;
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) cleaned = '91' + cleaned;
    return cleaned;
  }

  /**
   * Interpolate variables into template string
   */
  interpolateTemplate(template, variables) {
    if (!template) return '';
    let message = template;
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value || '');
    });
    return message;
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsAppMessage(phone, templateKey, variables = {}) {
    const formattedPhone = this.normalizePhoneNumber(phone);
    const template = MESSAGE_TEMPLATES[templateKey];

    if (!formattedPhone) return { success: false, error: 'Invalid phone number' };
    if (!template) return { success: false, error: `Unknown template: ${templateKey}` };

    const messageBody = this.interpolateTemplate(template.body, variables);

    // Development / Mock mode
    if (this.isDevelopment) {
      console.log(`[WhatsApp MOCK] To: ${formattedPhone} | Msg: ${messageBody}`);
      return {
        success: true,
        messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        status: 'sent_mock'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhone,
          type: 'text',
          text: { body: messageBody }
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'WhatsApp API Error');
      }

      const msgId = result.messages[0].id;
      await this.logWhatsAppDelivery(formattedPhone, templateKey, msgId);

      return { success: true, messageId: msgId, phone: formattedPhone };
    } catch (err) {
      console.error('[WhatsApp Error]:', err.message);
      await this.queueWhatsAppMessage(formattedPhone, templateKey, variables);
      return { success: false, error: err.message, phone: formattedPhone };
    }
  }

  /**
   * Send multiple messages in batch
   */
  async sendBatchMessages(requests) {
    const results = { successful: [], failed: [] };
    for (let i = 0; i < requests.length; i += this.batchSize) {
      const batch = requests.slice(i, i + this.batchSize);
      const batchResults = await Promise.all(
        batch.map(r => this.sendWhatsAppMessage(r.phone || r.phoneNumber, r.templateKey || r.templateId, r.variables || r.parameters))
      );
      batchResults.forEach(res => {
        if (res.success) results.successful.push(res);
        else results.failed.push(res);
      });
      if (i + this.batchSize < requests.length) await new Promise(r => setTimeout(r, 1000));
    }
    return results;
  }

  /**
   * Offline Queueing
   */
  async queueWhatsAppMessage(phone, templateKey, variables = {}) {
    const queue = (await retrieveCachedData('whatsapp:queue')) || [];
    queue.push({
      phone,
      templateKey,
      variables,
      timestamp: Date.now(),
      retryCount: 0,
      id: `qwa_${Date.now()}`
    });
    await cacheData('whatsapp:queue', queue);
  }

  async processQueuedMessages() {
    const queue = (await retrieveCachedData('whatsapp:queue')) || [];
    if (queue.length === 0) return;

    const remaining = [];
    for (const msg of queue) {
      if (msg.retryCount < this.retryAttempts) {
        const result = await this.sendWhatsAppMessage(msg.phone, msg.templateKey, msg.variables);
        if (!result.success) {
          msg.retryCount++;
          remaining.push(msg);
        }
=======
class WhatsAppService {
  constructor(apiToken, businessAccountId, phoneNumberId) {
    this.apiToken = apiToken;
    this.businessAccountId = businessAccountId;
    this.phoneNumberId = phoneNumberId;
    this.baseUrl = 'https://graph.instagram.com/v18.0'; // Or specific WhatsApp API URL
    this.tokenExpiry = null;
    this.rateLimitWindow = 60000; // 1 minute
    this.messagesPerWindow = 100;
    this.sentMessages = [];

    // Check if configuration warrants simulation mode
    this.isSimulationMode = !apiToken || !phoneNumberId;
    if (this.isSimulationMode) {
      console.warn('⚠️ WhatsApp Service running in SIMULATION MODE (Missing Credentials)');
    }
  }

  /**
   * Sends a WhatsApp message using a template
   * @param {string} orderId - Order ID or Reference
   * @param {string} templateId - WhatsApp template ID/name
   * @param {string} phoneNumber - Recipient phone number
   * @param {object} parameters - Template parameters
   * @returns {Promise<object>} Message send result
   */
  async sendWhatsAppMessage(orderId, templateId, phoneNumber, parameters = {}) {
    try {
      // 1. Rate Limit Check
      if (!this.canSendMessage()) {
        throw new Error('Rate limit exceeded. Please try again later.');
>>>>>>> d69d792bf4d2adf3b6ce1623aaa55ba05e8e8502
      }

      // 2. Phone Validation
      const validPhone = this.normalizePhoneNumber(phoneNumber);
      if (!validPhone) {
        throw new Error(`Invalid phone number format: ${phoneNumber}`);
      }

      const timestamp = new Date().toISOString();

      // 3. SIMULATION MODE
      if (this.isSimulationMode) {
        console.log(`[SIMULATION] Sending WhatsApp to ${validPhone} (Template: ${templateId})`, parameters);
        this.trackMessage({
          orderId,
          messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          phoneNumber: validPhone,
          templateId,
          timestamp: Date.now(),
          status: 'simulated'
        });
        return {
          success: true,
          messageId: `sim_${Date.now()}`,
          orderId,
          timestamp,
          mode: 'simulation'
        };
      }

      // 4. REAL API SEND
      const payload = {
        messaging_product: 'whatsapp',
        to: validPhone,
        type: 'template',
        template: {
          name: templateId,
          language: { code: 'en_US' },
          components: this.buildTemplateComponents(parameters)
        }
      };

      const response = await fetch(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiToken}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        // Check for specific error codes (e.g., 1004 = user blocked, 131030 = 24hr window closed)
        throw new Error(`WhatsApp API Error: ${error.error?.message || response.statusText}`);
      }

      const result = await response.json();

      // 5. Track Success
      this.trackMessage({
        orderId,
        messageId: result.messages[0].id,
        phoneNumber: validPhone,
        templateId,
        timestamp: Date.now(),
        status: 'sent'
      });

      return {
        success: true,
        messageId: result.messages[0].id,
        orderId,
        timestamp,
        mode: 'real'
      };

    } catch (error) {
      console.error('WhatsApp send failed:', error);
      // Queue for offline retry if network error?
      // For now just return error
      return {
        success: false,
        error: error.message,
        orderId,
        timestamp: new Date().toISOString()
      };
    }
    await cacheData('whatsapp:queue', remaining);
  }

<<<<<<< HEAD
  async logWhatsAppDelivery(phone, templateKey, messageId) {
    const log = { phone, templateKey, messageId, timestamp: new Date().toISOString(), status: 'sent' };
    await cacheData(`wa_delivery_${messageId}`, log);
  }
}

// Singleton Instance
let whatsappInstance = new WhatsAppService();
=======
  /**
   * Sends multiple messages in batch
   */
  async sendBatchMessages(orders) {
    const results = [];
    for (const order of orders) {
      const result = await this.sendWhatsAppMessage(
        order.id,
        order.templateId,
        order.phoneNumber,
        order.parameters
      );
      results.push(result);
      if (!this.isSimulationMode) await this.delay(100); // Throttling for real API
    }
    return results;
  }

  buildTemplateComponents(parameters) {
    if (!parameters || Object.keys(parameters).length === 0) return [];

    // Naive implementation: assuming all params go to BODY component in order
    // In production, might need header/body/footer separation based on template
    const paramValues = Object.values(parameters).map(val => ({
      type: 'text',
      text: String(val)
    }));

    return [{ type: 'body', parameters: paramValues }];
  }

  canSendMessage() {
    const now = Date.now();
    this.sentMessages = this.sentMessages.filter(time => now - time < this.rateLimitWindow);
    return this.sentMessages.length < this.messagesPerWindow;
  }

  trackMessage(messageData) {
    this.sentMessages.push(messageData.timestamp);
    this.persistMessage(messageData);
  }

  async persistMessage(messageData) {
    // Use existing offlineCacheService instead of raw IndexedDB for consistency
    // Append to daily log or specific store
    const key = `whatsapp:log:${new Date().toISOString().split('T')[0]}`;
    const log = await retrieveCachedData(key) || [];
    log.push(messageData);
    await cacheData(key, log);
  }

  normalizePhoneNumber(phone) {
    if (!phone) return null;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) return null;
    if (cleaned.length === 10) return `91${cleaned}`; // Default to India
    return cleaned;
  }

  delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
}

// Singleton Pattern
let whatsappInstance = null;
>>>>>>> d69d792bf4d2adf3b6ce1623aaa55ba05e8e8502

export const initWhatsAppService = (apiToken, businessAccountId, phoneNumberId) => {
  whatsappInstance = new WhatsAppService(apiToken, businessAccountId, phoneNumberId);
  return whatsappInstance;
};

<<<<<<< HEAD
export const getWhatsAppService = () => whatsappInstance;

// Functional Exports for backward compatibility
export const sendWhatsAppMessage = (phone, templateKey, variables) =>
  whatsappInstance.sendWhatsAppMessage(phone, templateKey, variables);

export const sendBatchWhatsAppMessages = (requests) =>
  whatsappInstance.sendBatchMessages(requests);

export const processQueuedWhatsAppMessages = () =>
  whatsappInstance.processQueuedMessages();

export default {
  initWhatsAppService,
  getWhatsAppService,
  sendWhatsAppMessage,
  sendBatchWhatsAppMessages,
  processQueuedWhatsAppMessages,
  MESSAGE_TEMPLATES
};
=======
export const getWhatsAppService = () => {
  if (!whatsappInstance) {
    // Auto-initialize with env vars if accessed before explicit init
    // This ensures components don't break if main.jsx didn't init it yet (lazy init)
    console.log('Lazy initializing WhatsApp Service...');
    whatsappInstance = new WhatsAppService(
      import.meta.env.VITE_WHATSAPP_API_TOKEN,
      import.meta.env.VITE_WHATSAPP_BUSINESS_ID,
      import.meta.env.VITE_WHATSAPP_PHONE_ID
    );
  }
  return whatsappInstance;
};

export default WhatsAppService;
>>>>>>> d69d792bf4d2adf3b6ce1623aaa55ba05e8e8502
