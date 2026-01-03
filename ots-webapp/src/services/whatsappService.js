/**
 * WhatsApp Business API Service
 * Comprehensive integration for sending order status updates via WhatsApp,
 * message templating, batch delivery, and retry logic.
 */

import { cacheData, retrieveCachedData } from './offlineCacheService';

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
      }
    }
    await cacheData('whatsapp:queue', remaining);
  }

  async logWhatsAppDelivery(phone, templateKey, messageId) {
    const log = { phone, templateKey, messageId, timestamp: new Date().toISOString(), status: 'sent' };
    await cacheData(`wa_delivery_${messageId}`, log);
  }
}

// Singleton Instance
let whatsappInstance = new WhatsAppService();

export const initWhatsAppService = (apiToken, businessAccountId, phoneNumberId) => {
  whatsappInstance = new WhatsAppService(apiToken, businessAccountId, phoneNumberId);
  return whatsappInstance;
};

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
