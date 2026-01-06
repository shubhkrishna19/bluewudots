/**
 * Webhook Simulation Service
 * Simulates real-time data pulses from carriers, marketplaces, and payment gateways.
 */

class WebhookService {
    constructor() {
        this.subscribers = new Set();
        this.isEnabled = false;
        this.intervalId = null;
    }

    /**
     * Subscribe to real-time events
     * @param {Function} callback 
     */
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    /**
     * Start the simulation pulse
     */
    start() {
        if (this.isEnabled) return;
        this.isEnabled = true;

        this.intervalId = setInterval(() => {
            const event = this.generateRandomEvent();
            this.notify(event);
        }, 8000); // Pulse every 8 seconds
    }

    /**
     * Stop the simulation
     */
    stop() {
        this.isEnabled = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Generate a realistic incoming webhook event
     */
    generateRandomEvent() {
        const eventTypes = [
            { type: 'ORDER_DELIVERED', source: 'Delhivery', severity: 'success' },
            { type: 'PAYMENT_RECEIVED', source: 'Razorpay', severity: 'success' },
            { type: 'INVENTORY_LOW', source: 'Warehouse-1', severity: 'warning' },
            { type: 'NEW_SALE', source: 'Amazon', severity: 'info' },
            { type: 'RETURNS_PICKUP', source: 'BlueDart', severity: 'info' }
        ];

        const base = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        return {
            id: `wh_${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...base,
            payload: {
                message: `${base.type} from ${base.source} processed successfully.`,
                value: Math.floor(Math.random() * 5000) + 500,
                reference: `REF-${Math.random().toString(36).substring(7).toUpperCase()}`
            }
        };
    }

    notify(event) {
        this.subscribers.forEach(cb => cb(event));
    }
}

const webhookService = new WebhookService();
export default webhookService;
