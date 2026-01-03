/**
 * Zoho Webhook Service (Simulated)
 * Processes incoming data stream from Zoho CRM/Inventory
 * Enables real-time reactive state updates
 */

class ZohoWebhookService {
    constructor() {
        this.listeners = [];
    }

    /**
     * Register a callback for webhook events
     * @param {Function} callback 
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Simulate an incoming webhook event
     * @param {String} type - 'ORDER_UPDATED' | 'INVENTORY_SYNC'
     * @param {Object} data 
     */
    simulateIncomingEvent(type, data) {
        console.log(`[Zoho Webhook] Received ${type}:`, data);
        this.listeners.forEach(listener => listener({ type, data }));
    }

    /**
     * Handle raw webhook payload (Catalyst Entry Point)
     * @param {Object} payload 
     */
    processWebhook(payload) {
        const { action, entity, details } = payload;

        // Logic to map Zoho internal fields to OTS state
        const mappedEvent = {
            type: `${entity}_${action}`.toUpperCase(),
            data: details,
            timestamp: new Date().toISOString()
        };

        this.listeners.forEach(listener => listener(mappedEvent));
    }
}

const webhookService = new ZohoWebhookService();
export default webhookService;
