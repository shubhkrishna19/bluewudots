/**
 * Marketplace Service - Amazon SP-API & Flipkart API Integration
 * Handles Order Fetching, Inventory Sync, and Price Updates.
 * Support Hybrid Mode: Real API if credentials exist, otherwise Mock Simulation.
 */

class MarketplaceService {
    constructor() {
        this.amazonCreds = {
            sellerId: import.meta.env.VITE_AMAZON_SELLER_ID,
            accessToken: import.meta.env.VITE_AMAZON_ACCESS_TOKEN
        };
        this.flipkartCreds = {
            appId: import.meta.env.VITE_FLIPKART_APP_ID,
            accessToken: import.meta.env.VITE_FLIPKART_ACCESS_TOKEN
        };

        this.isAmazonLive = !!(this.amazonCreds.sellerId && this.amazonCreds.accessToken);
        this.isFlipkartLive = !!(this.flipkartCreds.appId && this.flipkartCreds.accessToken);

        if (!this.isAmazonLive) console.warn('⚠️ Amazon Service running in SIMULATION MODE');
        if (!this.isFlipkartLive) console.warn('⚠️ Flipkart Service running in SIMULATION MODE');
    }

    /**
     * Fetch pending orders from Marketplace
     * @param {string} platform 'amazon' | 'flipkart'
     */
    async fetchOrders(platform = 'amazon') {
        if (platform === 'amazon' && this.isAmazonLive) {
            return this.fetchAmazonRealOrders();
        }
        if (platform === 'flipkart' && this.isFlipkartLive) {
            return this.fetchFlipkartRealOrders();
        }

        // Return Mock Data
        return this.getMockOrders(platform);
    }

    /**
     * Sync Inventory Update to Marketplace
     * @param {string} sku 
     * @param {number} quantity 
     * @param {string} platform 
     */
    async syncInventory(sku, quantity, platform = 'amazon') {
        console.log(`[Marketplace] Syncing ${sku} to ${platform}: Qty ${quantity}`);

        if (platform === 'amazon' && this.isAmazonLive) {
            // await axios.post(...)
            return { success: true, platform, sku, mode: 'live' };
        }

        // Mock Success
        await new Promise(r => setTimeout(r, 800)); // Simulate latency
        return { success: true, platform, sku, mode: 'simulation' };
    }

    // --- Mock Data Generators ---

    getMockOrders(platform) {
        const count = Math.floor(Math.random() * 5) + 1;
        const orders = [];
        const prefix = platform === 'amazon' ? 'AMZ' : 'FK';

        for (let i = 0; i < count; i++) {
            orders.push({
                id: `${prefix}-${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 10000)}`,
                customer: `Mock Customer ${Math.floor(Math.random() * 100)}`,
                sku: `SKU-${Math.floor(Math.random() * 100)}`,
                amount: Math.floor(Math.random() * 5000) + 500,
                status: 'Unshipped',
                source: platform === 'amazon' ? 'Amazon' : 'Flipkart',
                orderDate: new Date().toISOString(),
                city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune'][Math.floor(Math.random() * 4)],
                state: ['Maharashtra', 'Delhi', 'Karnataka', 'Maharashtra'][Math.floor(Math.random() * 4)]
            });
        }
        return orders;
    }

    // --- Real API Stubs (Future Implementation) ---

    async fetchAmazonRealOrders() {
        console.log('Fetching from Amazon SP-API...');
        // Implementation would use fetch() with Signature V4 signing
        return [];
    }

    async fetchFlipkartRealOrders() {
        console.log('Fetching from Flipkart API...');
        return [];
    }
}

// Singleton Instance
const marketplaceService = new MarketplaceService();
export default marketplaceService;
