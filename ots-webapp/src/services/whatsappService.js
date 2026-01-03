/**
 * WhatsApp Order Updates Service (Mockup)
 * 
 * This service provides a template for integrating with WhatsApp Business API
 * for sending order status updates to customers.
 * 
 * In production, this would connect to:
 * - WhatsApp Business API (via Twilio, MessageBird, or direct Meta API)
 * - Or Interakt/WATI for India-specific integrations
 */

// Message Templates (approved by Meta for WhatsApp Business)
const MESSAGE_TEMPLATES = {
    ORDER_CONFIRMED: {
        id: 'order_confirmed_v1',
        body: `🎉 Order Confirmed!\n\nHi {{customerName}},\nYour order #{{orderId}} has been confirmed.\n\nProduct: {{productName}}\nAmount: ₹{{amount}}\n\nWe'll notify you when it ships. Thank you for shopping with Bluewud!`
    },
    ORDER_SHIPPED: {
        id: 'order_shipped_v1',
        body: `📦 Order Shipped!\n\nHi {{customerName}},\nGreat news! Your order #{{orderId}} is on its way.\n\nCarrier: {{carrierName}}\nTracking: {{trackingId}}\nExpected Delivery: {{eta}}\n\nTrack here: {{trackingUrl}}`
    },
    ORDER_DELIVERED: {
        id: 'order_delivered_v1',
        body: `✅ Order Delivered!\n\nHi {{customerName}},\nYour order #{{orderId}} has been delivered.\n\nWe hope you love your purchase! Rate us: ⭐⭐⭐⭐⭐\n\nThank you for choosing Bluewud!`
    },
    RTO_INITIATED: {
        id: 'rto_initiated_v1',
        body: `📍 Delivery Update\n\nHi {{customerName}},\nWe attempted to deliver your order #{{orderId}} but couldn't reach you.\n\nPlease ensure availability for the next attempt or contact us to reschedule.\n\nSupport: {{supportNumber}}`
    }
};

/**
 * Format phone number for WhatsApp API (E.164 format)
 * @param {string} phone - Raw phone number
 * @returns {string} - Formatted phone (e.g., 919876543210)
 */
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
    if (!template) {
        return { success: false, error: 'Invalid template' };
    }

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
};

// ============================================
// PUBLIC API
// ============================================

export const sendOrderConfirmation = async (order) => {
    return sendWhatsAppMessage(order.phone, 'ORDER_CONFIRMED', {
        customerName: order.customerName || 'Valued Customer',
        orderId: order.id,
        productName: order.sku || 'Your Product',
        amount: order.amount?.toLocaleString('en-IN') || '0'
    });
};

export const sendShippingUpdate = async (order, trackingUrl) => {
    return sendWhatsAppMessage(order.phone, 'ORDER_SHIPPED', {
        customerName: order.customerName || 'Valued Customer',
        orderId: order.id,
        carrierName: order.carrier || 'Courier Partner',
        trackingId: order.awb || 'N/A',
        eta: order.eta || '3-5 business days',
        trackingUrl: trackingUrl || `https://track.bluewud.com/${order.awb}`
    });
};

export const sendDeliveryConfirmation = async (order) => {
    return sendWhatsAppMessage(order.phone, 'ORDER_DELIVERED', {
        customerName: order.customerName || 'Valued Customer',
        orderId: order.id
    });
};

export const sendRTOAlert = async (order, supportNumber = '1800-XXX-XXXX') => {
    return sendWhatsAppMessage(order.phone, 'RTO_INITIATED', {
        customerName: order.customerName || 'Valued Customer',
        orderId: order.id,
        supportNumber
    });
};

export default {
    sendOrderConfirmation,
    sendShippingUpdate,
    sendDeliveryConfirmation,
    sendRTOAlert,
    MESSAGE_TEMPLATES
};
