/**
 * Marketplace Sync Service
 * Handles bi-directional synchronization with external marketplaces (Amazon, Flipkart, Shopify).
 * - Syncs Inventory Updates (Outbound)
 * - Fetches New Orders (Inbound)
 * - Calculates Platform Fees
 */

const MARKETPLACE_FEES = {
    AMAZON: { commission: 0.15, fixed: 15, shipping: 70 },
    FLIPKART: { commission: 0.12, fixed: 20, shipping: 65 },
    SHOPIFY: { commission: 0.02, fixed: 0, shipping: 0 }, // Assuming 2% gateway fee
    DEFAULT: { commission: 0.10, fixed: 10, shipping: 50 }
};

class MarketplaceSyncService {

    /**
     * Push inventory update to marketplace
     * @param {string} sku - The SKU to sync
     * @param {number} quantity - New stock level
     * @param {string} channel - 'amazon' | 'flipkart' | 'shopify'
     */
    async syncInventory(sku, quantity, channel = 'amazon') {
        console.log(`[SyncService] Pushing stock update for ${sku} to ${channel.toUpperCase()}: ${quantity} units`);

        // Mock API Latency
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Success/Failure
        if (Math.random() > 0.9) {
            throw new Error(`Failed to connect to ${channel.toUpperCase()} API.`);
        }

        return {
            success: true,
            channel,
            sku,
            updatedAt: new Date().toISOString(),
            message: `Successfully updated ${sku} stock on ${channel}.`
        };
    }

    /**
     * Fetch pending orders from marketplace
     * @param {string} channel 
     */
    async fetchOrders(channel = 'amazon') {
        console.log(`[SyncService] Polling new orders from ${channel.toUpperCase()}...`);

        await new Promise(resolve => setTimeout(resolve, 1200));

        // Mock Orders
        const mockOrders = [];
        if (Math.random() > 0.5) {
            const count = Math.floor(Math.random() * 5) + 1;
            for (let i = 0; i < count; i++) {
                mockOrders.push({
                    id: `${channel.slice(0, 3).toUpperCase()}-${Date.now()}-${i}`,
                    customer: `Auto-Imported ${channel} Customer`,
                    amount: Math.floor(Math.random() * 5000) + 500,
                    status: 'Pending',
                    channel
                });
            }
        }

        return {
            success: true,
            count: mockOrders.length,
            orders: mockOrders
        };
    }

    /**
     * Calculate estimated platform fees
     * @param {string} channel 
     * @param {number} sellingPrice 
     */
    calculateFees(channel, sellingPrice) {
        const fees = MARKETPLACE_FEES[channel?.toUpperCase()] || MARKETPLACE_FEES.DEFAULT;

        const commissionCost = sellingPrice * fees.commission;
        const totalFee = commissionCost + fees.fixed + fees.shipping;
        const netPayout = sellingPrice - totalFee;

        return {
            sellingPrice,
            breakdown: {
                commission: commissionCost.toFixed(2),
                fixedFee: fees.fixed,
                shippingEst: fees.shipping
            },
            totalFee: totalFee.toFixed(2),
            netPayout: netPayout.toFixed(2),
            marginPercent: ((netPayout / sellingPrice) * 100).toFixed(1)
        };
    }
}

export default new MarketplaceSyncService();
