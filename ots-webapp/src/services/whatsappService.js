// WhatsApp Business API Service
// Complete integration for sending order status updates via WhatsApp,
// message templating, batch delivery, and retry logic.

import { cacheData, retrieveCachedData } from './offlineCacheService';
import { queueNotification } from './pushNotificationService';

const WHATSAPP_API_BASE = process.env.VITE_WHATSAPP_API_URL || 'https://graph.instagram.com/v18.0';
const PHONE_NUMBER_ID = process.env.VITE_WHATSAPP_PHONE_ID;
const ACCESS_TOKEN = process.env.VITE_WHATSAPP_ACCESS_TOKEN;
const BATCH_SIZE = 50; // Max messages per batch
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;

/**
 * Message templates approved by Meta for WhatsApp Business
 */
const MESSAGE_TEMPLATES = {
  ORDER_CONFIRMED: {
    name: 'order_confirmed_v1',
    body: '✅ Order Confirmed\nYour order #{orderId} has been confirmed!\nTotal: ₹{amount}\nEstimated Delivery: {deliveryDate}'
  },
  ORDER_SHIPPED: {
    name: 'order_shipped_v1',
    body: '📦 Order Shipped!\nYour order #{orderId} is on its way.\nTracking: {awb}\nCarrier: {carrier}'
  },
  ORDER_DELIVERED: {
    name: 'order_delivered_v1',
    body: '✅ Order Delivered!\nYour order #{orderId} has been delivered.\nThank you for shopping with Bluewud!'
  },
  ORDER_OUT_FOR_DELIVERY: {
    name: 'order_out_for_delivery_v1',
    body: '🚚 Out for Delivery!\nYour order #{orderId} is out for delivery today.\nExpected by: {deliveryTime}'
  },
  RTO_INITIATED: {
    name: 'rto_initiated_v1',
    body: '⚠️ Delivery Issue\nWe had an issue delivering order #{orderId}.\nWe will attempt re-delivery. Contact us if needed.'
  }
};

/**
 * Send WhatsApp message to a customer
 * @param {String} phoneNumber - Customer phone number with country code (e.g., "919876543210")
 * @param {String} templateKey - Template key from MESSAGE_TEMPLATES
 * @param {Object} variables - Variables to interpolate in message
 * @returns {Promise<Object>} - API response
 */
<<<<<<< HEAD
const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    // Ensure 10-digit Indian number has country code
    if (cleaned.length === 10) {
        cleaned = '91' + cleaned;
    }
    return cleaned;
};

/**
 * Replace template placeholders with actual values
 * @param {string} template - Template body with {{placeholders}}
 * @param {object} data - Key-value pairs for replacement
 * @returns {string} - Filled message
 */
const fillTemplate = (template, data) => {
    let message = template;
    Object.entries(data).forEach(([key, value]) => {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
    });
    return message;
};

const API_ENDPOINT = '/server/notifications/whatsapp';
const API_KEY = import.meta.env.VITE_WHATSAPP_API_KEY || ''; // To be configured in Catalyst

/**
 * Send WhatsApp message via API
 */
const sendWhatsAppMessage = async (phone, templateId, data) => {
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) {
        return { success: false, error: 'Invalid phone number' };
    }

    const template = MESSAGE_TEMPLATES[templateId];
=======
export const sendWhatsAppMessage = async (phoneNumber, templateKey, variables = {}) => {
  try {
    const template = MESSAGE_TEMPLATES[templateKey];
>>>>>>> 4be53487f72a2bfacf3cde5d60b2e7a7e0ec3174
    if (!template) {
      throw new Error(`Unknown template: ${templateKey}`);
    }

<<<<<<< HEAD
    const messageBody = {
        to: formattedPhone,
        template: template.id,
        params: data,
        apiKey: API_KEY
    };

    try {
        // MOCK: In production, this would be a real API call to Catalyst or Meta
        // const response = await fetch(API_ENDPOINT, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(messageBody)
        // });
        // const result = await response.json();

        // Simulation for development
        console.log(`[WhatsApp API] Request to ${formattedPhone}:`, messageBody);

        return {
            success: true,
            messageId: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: 'queued',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('[WhatsApp Service Error]:', error);
        return { success: false, error: 'Failed to transmit message' };
    }
=======
    const message = interpolateTemplate(template.body, variables);
    
    const response = await fetch(
      `${WHATSAPP_API_BASE}/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phoneNumber,
          type: 'text',
          text: { body: message }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`WhatsApp API Error: ${error.error?.message || response.statusText}`);
    }

    const result = await response.json();
    console.log(`[WhatsApp] Message sent to ${phoneNumber}:`, result.messages[0].id);
    
    // Log delivery
    await logWhatsAppDelivery(phoneNumber, templateKey, result.messages[0].id);
    
    return { success: true, messageId: result.messages[0].id, phoneNumber };
  } catch (err) {
    console.error('[WhatsApp] Send failed:', err);
    // Queue for retry
    await queueWhatsAppMessage(phoneNumber, templateKey, variables);
    return { success: false, error: err.message, phoneNumber };
  }
>>>>>>> 4be53487f72a2bfacf3cde5d60b2e7a7e0ec3174
};

/**
 * Send WhatsApp message to multiple customers (batch operation)
 * @param {Array<Object>} orders - Array of {phoneNumber, templateKey, variables}
 * @returns {Promise<Object>} - Batch results {successful, failed}
 */
export const sendBatchWhatsAppMessages = async (orders) => {
  const results = {
    successful: [],
    failed: [],
    queued: 0
  };

  // Process in batches to respect API rate limits
  for (let i = 0; i < orders.length; i += BATCH_SIZE) {
    const batch = orders.slice(i, i + BATCH_SIZE);
    
    const batchResults = await Promise.all(
      batch.map(order => 
        sendWhatsAppMessage(order.phoneNumber, order.templateKey, order.variables)
      )
    );

    batchResults.forEach((result, idx) => {
      if (result.success) {
        results.successful.push(result);
      } else {
        results.failed.push({ ...result, orderIndex: i + idx });
      }
    });

    // Rate limiting
    if (i + BATCH_SIZE < orders.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('[WhatsApp] Batch complete:', results);
  return results;
};

/**
 * Queue a WhatsApp message for retry (offline support)
 * @param {String} phoneNumber - Customer phone number
 * @param {String} templateKey - Template key
 * @param {Object} variables - Template variables
 */
export const queueWhatsAppMessage = async (phoneNumber, templateKey, variables = {}) => {
  const queue = (await retrieveCachedData('whatsapp:queue')) || [];
  queue.push({
    phoneNumber,
    templateKey,
    variables,
    timestamp: Date.now(),
    retryCount: 0,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  });
  await cacheData('whatsapp:queue', queue);
  console.log(`[WhatsApp] Message queued for ${phoneNumber}`);
};

/**
 * Process queued WhatsApp messages (call when coming online)
 */
export const processQueuedWhatsAppMessages = async () => {
  const queue = (await retrieveCachedData('whatsapp:queue')) || [];
  let processed = 0;

  for (const msg of queue) {
    if (msg.retryCount >= RETRY_ATTEMPTS) {
      console.warn(`[WhatsApp] Max retries exceeded for ${msg.phoneNumber}`);
      continue;
    }

    try {
      const result = await sendWhatsAppMessage(msg.phoneNumber, msg.templateKey, msg.variables);
      if (result.success) {
        processed++;
        // Remove from queue
        const updated = queue.filter(m => m.id !== msg.id);
        await cacheData('whatsapp:queue', updated);
      } else {
        msg.retryCount++;
        msg.lastRetry = Date.now();
      }
    } catch (err) {
      console.error(`[WhatsApp] Retry failed for ${msg.phoneNumber}:`, err);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`[WhatsApp] Processed ${processed} queued messages`);
};

/**
 * Get WhatsApp message delivery status
 * @param {String} messageId - WhatsApp message ID
 * @returns {Promise<Object>} - Delivery status
 */
export const getMessageStatus = async (messageId) => {
  try {
    const deliveryLog = await retrieveCachedData(`whatsapp:delivery:${messageId}`);
    return deliveryLog || { messageId, status: 'unknown' };
  } catch (err) {
    console.error('[WhatsApp] Status check failed:', err);
    return null;
  }
};

/**
 * Check WhatsApp service health and configuration
 */
export const validateWhatsAppConfig = () => {
  const config = {
    hasPhoneId: !!PHONE_NUMBER_ID,
    hasAccessToken: !!ACCESS_TOKEN,
    hasApiUrl: !!WHATSAPP_API_BASE,
    templatesCount: Object.keys(MESSAGE_TEMPLATES).length
  };

  const isValid = config.hasPhoneId && config.hasAccessToken;
  console.log('[WhatsApp] Config validation:', { ...config, isValid });
  return isValid;
};

// ===== Private Helpers =====

/**
 * Interpolate variables into template string
 * @param {String} template - Template with {variableName} placeholders
 * @param {Object} variables - Variable values
 * @returns {String} - Interpolated message
 */
function interpolateTemplate(template, variables) {
  let message = template;
  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  return message;
}

/**
 * Log WhatsApp message delivery
 */
async function logWhatsAppDelivery(phoneNumber, templateKey, messageId) {
  const deliveryLog = {
    phoneNumber,
    templateKey,
    messageId,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };
  await cacheData(`whatsapp:delivery:${messageId}`, deliveryLog, 7 * 24 * 60 * 60 * 1000); // 7 days
}

export default {
  sendWhatsAppMessage,
  sendBatchWhatsAppMessages,
  queueWhatsAppMessage,
  processQueuedWhatsAppMessages,
  getMessageStatus,
  validateWhatsAppConfig,
  MESSAGE_TEMPLATES
};
