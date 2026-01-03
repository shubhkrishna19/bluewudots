/**
 * WhatsApp Business API Service
 * Complete integration for sending order status updates via WhatsApp,
 * message templating, batch delivery, and retry logic.
 */

import { cacheData, retrieveCachedData } from './offlineCacheService';

const WHATSAPP_API_BASE = import.meta.env.VITE_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const BATCH_SIZE = 50;
const RETRY_ATTEMPTS = 3;

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

/**
 * Format phone number to E.164 without '+'
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) cleaned = '91' + cleaned;
  return cleaned;
};

/**
 * Interpolate variables into template string
 */
const interpolateTemplate = (template, variables) => {
  if (!template) return '';
  let message = template;
  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), value || '');
  });
  return message;
};

/**
 * Send WhatsApp message
 */
export const sendWhatsAppMessage = async (phone, templateKey, variables = {}) => {
  const formattedPhone = formatPhoneNumber(phone);
  const template = MESSAGE_TEMPLATES[templateKey];

  if (!formattedPhone) return { success: false, error: 'Invalid phone number' };
  if (!template) return { success: false, error: `Unknown template: ${templateKey}` };

  const message = interpolateTemplate(template.body, variables);

  // If API credentials are missing, run in MOCK mode
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.log(`[WhatsApp MOCK] To: ${formattedPhone} | Msg: ${message}`);
    return {
      success: true,
      messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      status: 'sent_mock'
    };
  }

  try {
    const response = await fetch(`${WHATSAPP_API_BASE}/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedPhone,
        type: 'text',
        text: { body: message }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'WhatsApp API Error');
    }

    const msgId = result.messages[0].id;
    await logWhatsAppDelivery(formattedPhone, templateKey, msgId);

    return { success: true, messageId: msgId, phone: formattedPhone };
  } catch (err) {
    console.error('[WhatsApp Error]:', err.message);
    await queueWhatsAppMessage(formattedPhone, templateKey, variables);
    return { success: false, error: err.message, phone: formattedPhone };
  }
};

/**
 * Batch processing
 */
export const sendBatchWhatsAppMessages = async (requests) => {
  const results = { successful: [], failed: [] };

  for (let i = 0; i < requests.length; i += BATCH_SIZE) {
    const batch = requests.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(r => sendWhatsAppMessage(r.phone || r.phoneNumber, r.templateKey, r.variables))
    );

    batchResults.forEach(res => {
      if (res.success) results.successful.push(res);
      else results.failed.push(res);
    });

    if (i + BATCH_SIZE < requests.length) await new Promise(r => setTimeout(r, 1000));
  }
  return results;
};

/**
 * Offline Sync & Queueing
 */
export const queueWhatsAppMessage = async (phone, templateKey, variables = {}) => {
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
};

export const processQueuedWhatsAppMessages = async () => {
  const queue = (await retrieveCachedData('whatsapp:queue')) || [];
  if (queue.length === 0) return;

  const remaining = [];
  for (const msg of queue) {
    if (msg.retryCount < RETRY_ATTEMPTS) {
      const result = await sendWhatsAppMessage(msg.phone, msg.templateKey, msg.variables);
      if (!result.success) {
        msg.retryCount++;
        remaining.push(msg);
      }
    }
  }
  await cacheData('whatsapp:queue', remaining);
};

const logWhatsAppDelivery = async (phone, templateKey, messageId) => {
  const log = { phone, templateKey, messageId, timestamp: new Date().toISOString(), status: 'sent' };
  await cacheData(`wa_delivery_${messageId}`, log);
};

export default {
  sendWhatsAppMessage,
  sendBatchWhatsAppMessages,
  processQueuedWhatsAppMessages,
  MESSAGE_TEMPLATES
};
