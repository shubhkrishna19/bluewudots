/**
 * WhatsApp Business API Service
 * Comprehensive integration for sending order status updates via WhatsApp,
 * unified service handling both Real API and Simulation modes.
 * 
 * Features:
 * - Token management and lazy initialization
 * - Message templating with interpolation
 * - Batch delivery and rate limiting
 * - Delivery tracking and persistence
 * - Offline Queue Support
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
    this.apiToken = apiToken || import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || import.meta.env.VITE_WHATSAPP_API_TOKEN;
    this.businessAccountId = businessAccountId || import.meta.env.VITE_WHATSAPP_BUSINESS_ID;
    this.phoneNumberId = phoneNumberId || import.meta.env.VITE_WHATSAPP_PHONE_ID;
    this.baseUrl = WHATSAPP_API_BASE;
    this.batchSize = 50;
    this.retryAttempts = 3;
    this.rateLimitWindow = 60000;
    this.messagesPerWindow = 100;
    this.sentMessages = [];

    this.isSimulationMode = !this.apiToken || !this.phoneNumberId;
    if (this.isSimulationMode) {
      console.warn('⚠️ WhatsApp Service running in SIMULATION MODE (Missing Credentials)');
    }
  }

  normalizePhoneNumber(phone) {
    if (!phone) return null;
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) return null;
    if (cleaned.length === 10) cleaned = '91' + cleaned;
    return cleaned;
  }

  interpolateTemplate(templateKey, variables) {
    const template = MESSAGE_TEMPLATES[templateKey];
    if (!template) return '';
    let message = template.body;
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value || '');
    });
    return message;
  }

  canSendMessage() {
    const now = Date.now();
    this.sentMessages = this.sentMessages.filter(time => now - time < this.rateLimitWindow);
    return this.sentMessages.length < this.messagesPerWindow;
  }

  async sendWhatsAppMessage(phone, templateKey, variables = {}) {
    try {
      if (!this.canSendMessage()) {
        throw new Error('Rate limit exceeded');
      }

      const formattedPhone = this.normalizePhoneNumber(phone);
      if (!formattedPhone) return { success: false, error: 'Invalid phone number' };

      const messageBody = this.interpolateTemplate(templateKey, variables);
      const timestamp = new Date().toISOString();

      if (this.isSimulationMode) {
        console.log(`[SIMULATION] To: ${formattedPhone} | Msg: ${messageBody}`);
        const msgId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        await this.trackMessage({
          phone: formattedPhone,
          messageId: msgId,
          templateKey,
          variables,
          timestamp,
          status: 'simulated'
        });
        return { success: true, messageId: msgId, status: 'sent_mock' };
      }

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
          type: 'template',
          template: {
            name: MESSAGE_TEMPLATES[templateKey]?.id,
            language: { code: 'en_US' },
            components: this.buildTemplateComponents(variables)
          }
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'WhatsApp API Error');

      const msgId = result.messages[0].id;
      await this.trackMessage({
        phone: formattedPhone,
        messageId: msgId,
        templateKey,
        variables,
        timestamp,
        status: 'sent'
      });

      return { success: true, messageId: msgId, phone: formattedPhone };
    } catch (err) {
      console.error('[WhatsApp Error]:', err.message);
      await this.queueWhatsAppMessage(phone, templateKey, variables);
      return { success: false, error: err.message };
    }
  }

  buildTemplateComponents(variables) {
    if (!variables || Object.keys(variables).length === 0) return [];
    const paramValues = Object.values(variables).map(val => ({
      type: 'text',
      text: String(val)
    }));
    return [{ type: 'body', parameters: paramValues }];
  }

  async trackMessage(messageData) {
    this.sentMessages.push(Date.now());
    const key = `whatsapp:log:${new Date().toISOString().split('T')[0]}`;
    const log = await retrieveCachedData(key) || [];
    log.push(messageData);
    await cacheData(key, log);
  }

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
      if (i + this.batchSize < requests.length && !this.isSimulationMode) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    return results;
  }

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
}

let whatsappInstance = null;

export const initWhatsAppService = (apiToken, businessAccountId, phoneNumberId) => {
  whatsappInstance = new WhatsAppService(apiToken, businessAccountId, phoneNumberId);
  return whatsappInstance;
};

export const getWhatsAppService = () => {
  if (!whatsappInstance) {
    whatsappInstance = new WhatsAppService();
  }
  return whatsappInstance;
};

// Functional Exports
export const sendWhatsAppMessage = (phone, templateKey, variables) =>
  getWhatsAppService().sendWhatsAppMessage(phone, templateKey, variables);

export const sendBatchWhatsAppMessages = (requests) =>
  getWhatsAppService().sendBatchMessages(requests);

export const processQueuedWhatsAppMessages = () =>
  getWhatsAppService().processQueuedMessages();

export default {
  initWhatsAppService,
  getWhatsAppService,
  sendWhatsAppMessage,
  sendBatchWhatsAppMessages,
  processQueuedWhatsAppMessages,
  MESSAGE_TEMPLATES
};
