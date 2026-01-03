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

        let eventType = `${entity}_${action}`.toUpperCase();
        let mappedData = { ...details };

        // RTO Detection Logic
        if (entity === 'shipment' || entity === 'delivery') {
            const status = (details.status || '').toLowerCase();
            const reason = (details.reason || '').toLowerCase();

            if (status === 'undelivered' || status === 'returned') {
                eventType = 'RTO_INITIATED';
                mappedData.rtoStatus = 'RTO-Initiated';

                if (reason.includes('refuse') || reason.includes('cancelled')) {
                    mappedData.rtoReason = 'Customer Refused';
                } else if (reason.includes('address') || reason.includes('location')) {
                    mappedData.rtoReason = 'Incorrect Address';
                } else {
                    mappedData.rtoReason = 'Carrier Undelivered';
                }
            }
        }

        // Logic to map Zoho internal fields to OTS state
        const mappedEvent = {
            type: eventType,
            data: mappedData,
            timestamp: new Date().toISOString()
        };

        this.listeners.forEach(listener => listener(mappedEvent));
    }
}

const webhookService = new ZohoWebhookService();
export default webhookService;
