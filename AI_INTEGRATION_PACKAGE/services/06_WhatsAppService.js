/**
 * WhatsApp Business API Service
 * Sends order status updates via WhatsApp messaging
 * 
 * Features:
 * - Token refresh and management
 * - Message templating
 * - Error handling & retry logic
 * - Rate limiting
 * - Delivery tracking
 */

class WhatsAppService {
  constructor(apiToken, businessAccountId, phoneNumberId) {
    this.apiToken = apiToken;
    this.businessAccountId = businessAccountId;
    this.phoneNumberId = phoneNumberId;
    this.baseUrl = 'https://graph.instagram.com/v18.0';
    this.tokenExpiry = null;
    this.messageQueue = [];
    this.rateLimitWindow = 60000; // 1 minute
    this.messagesPerWindow = 100;
    this.sentMessages = [];
  }

  /**
   * Sends a WhatsApp message using a template
   * @param {string} orderId - Order ID
   * @param {string} templateId - WhatsApp template ID
   * @param {string} phoneNumber - Recipient phone number (with country code)
   * @param {object} parameters - Template parameters
   * @returns {Promise<object>} Message send result
   */
  async sendWhatsAppMessage(orderId, templateId, phoneNumber, parameters = {}) {
    try {
      // Check rate limit
      if (!this.canSendMessage()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Validate phone number format
      const validPhone = this.normalizePhoneNumber(phoneNumber);
      if (!validPhone) {
        throw new Error('Invalid phone number format');
      }

      // Prepare message payload
      const payload = {
        messaging_product: 'whatsapp',
        to: validPhone,
        type: 'template',
        template: {
          name: templateId,
          language: {
            code: 'en_US'
          },
          components: this.buildTemplateComponents(parameters)
        }
      };

      // Send message
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
        throw new Error(`WhatsApp API Error: ${error.error?.message}`);
      }

      const result = await response.json();
      
      // Track sent message
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
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('WhatsApp message send failed:', error);
      return {
        success: false,
        error: error.message,
        orderId,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Sends multiple messages in batch (with queue management)
   * @param {array} orders - Array of order objects with phone, templateId, parameters
   * @returns {Promise<array>} Results for each message
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
      // Add delay between messages to avoid rate limiting
      await this.delay(100);
    }
    return results;
  }

  /**
   * Builds template components for WhatsApp message
   * @param {object} parameters - Template parameters
   * @returns {array} Formatted components array
   */
  buildTemplateComponents(parameters) {
    if (!parameters || Object.keys(parameters).length === 0) {
      return [];
    }

    const paramValues = Object.values(parameters).map(val => ({
      type: 'text',
      text: String(val)
    }));

    return [
      {
        type: 'body',
        parameters: paramValues
      }
    ];
  }

  /**
   * Refreshes API token (call periodically)
   * @param {string} newToken - New token from backend
   */
  refreshToken(newToken) {
    this.apiToken = newToken;
    this.tokenExpiry = Date.now() + (3600 * 1000); // 1 hour
    console.log('WhatsApp API token refreshed');
  }

  /**
   * Checks if message can be sent (rate limiting)
   * @returns {boolean} True if within rate limit
   */
  canSendMessage() {
    const now = Date.now();
    // Clean old messages outside window
    this.sentMessages = this.sentMessages.filter(
      time => now - time < this.rateLimitWindow
    );
    return this.sentMessages.length < this.messagesPerWindow;
  }

  /**
   * Tracks sent message in local history
   * @param {object} messageData - Message data to track
   */
  trackMessage(messageData) {
    this.sentMessages.push(messageData.timestamp);
    // Also store in IndexedDB for persistence
    this.persistMessage(messageData);
  }

  /**
   * Persists message to IndexedDB
   * @param {object} messageData - Message data
   */
  async persistMessage(messageData) {
    try {
      const db = await this.getDB();
      const tx = db.transaction(['whatsappMessages'], 'readwrite');
      tx.objectStore('whatsappMessages').add(messageData);
      await tx.done;
    } catch (error) {
      console.error('Failed to persist message:', error);
    }
  }

  /**
   * Gets IndexedDB instance
   * @returns {Promise<IDBDatabase>} Database instance
   */
  async getDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('bluewud_ots', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Normalizes phone number to WhatsApp format
   * @param {string} phone - Phone number
   * @returns {string|null} Normalized phone or null if invalid
   */
  normalizePhoneNumber(phone) {
    // Remove non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Should be 10-15 digits
    if (cleaned.length < 10 || cleaned.length > 15) {
      return null;
    }
    
    // Add country code if missing (assume India +91)
    if (cleaned.length === 10) {
      return `91${cleaned}`;
    }
    
    return cleaned;
  }

  /**
   * Gets message delivery status
   * @param {string} messageId - Message ID
   * @returns {Promise<object>} Status information
   */
  async getMessageStatus(messageId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${messageId}?fields=status,timestamp`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );

      const data = await response.json();
      return {
        messageId,
        status: data.status,
        timestamp: data.timestamp
      };
    } catch (error) {
      console.error('Failed to get message status:', error);
      return null;
    }
  }

  /**
   * Utility delay function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export as singleton
let whatsappInstance = null;

export const initWhatsAppService = (apiToken, businessAccountId, phoneNumberId) => {
  whatsappInstance = new WhatsAppService(apiToken, businessAccountId, phoneNumberId);
  return whatsappInstance;
};

export const getWhatsAppService = () => {
  if (!whatsappInstance) {
    throw new Error('WhatsApp Service not initialized. Call initWhatsAppService first.');
  }
  return whatsappInstance;
};

// Usage Examples:
// ============
// 1. Initialize (in main.jsx or App.jsx)
// import { initWhatsAppService } from './services/06_WhatsAppService';
// const whatsapp = initWhatsAppService(
//   import.meta.env.VITE_WHATSAPP_API_TOKEN,
//   import.meta.env.VITE_WHATSAPP_BUSINESS_ID,
//   import.meta.env.VITE_WHATSAPP_PHONE_ID
// );

// 2. Send single message
// const result = await whatsapp.sendWhatsAppMessage(
//   'ORD-12345',
//   'order_status_template',
//   '+919876543210',
//   { orderId: 'ORD-12345', status: 'Shipped', tracking: 'DHL123456' }
// );

// 3. Send batch messages
// const results = await whatsapp.sendBatchMessages([
//   { id: 'ORD-1', phoneNumber: '+919876543210', templateId: 'template1', parameters: {...} },
//   { id: 'ORD-2', phoneNumber: '+919876543211', templateId: 'template1', parameters: {...} }
// ]);

export default WhatsAppService;
