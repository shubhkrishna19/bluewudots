/**
 * Marketplace Sync Service
 * Handles communication (stubs) with Amazon SP-API and Flipkart API.
 */

const API_BASE = '/server/marketplace';

/**
 * Fetch new orders from Amazon SP-API
 */
export const fetchAmazonOrders = async () => {
    console.log('📡 [AMAZON] Pulsing SP-API for new orders...');
    try {
        const response = await fetch(`${API_BASE}/amazon/orders`);
        if (!response.ok) throw new Error(`Amazon API Error: ${response.status}`);
        const data = await response.json();
        console.log(`✅ [AMAZON] ${data.count || 0} new orders found.`);
        return { success: true, count: data.count || 0, orders: data.orders || [] };
    } catch (error) {
        console.error('❌ [AMAZON] Sync Failed:', error);
        throw error;
    }
};

/**
 * Fetch new orders from Flipkart API
 */
export const fetchFlipkartOrders = async () => {
    console.log('📡 [FLIPKART] Fetching Seller API stream...');
    try {
        const response = await fetch(`${API_BASE}/flipkart/orders`);
        if (!response.ok) throw new Error(`Flipkart API Error: ${response.status}`);
        const data = await response.json();
        console.log(`✅ [FLIPKART] ${data.count || 0} new orders found.`);
        return { success: true, count: data.count || 0, orders: data.orders || [] };
    } catch (error) {
        console.error('❌ [FLIPKART] Sync Failed:', error);
        throw error;
    }
};

/**
 * Push inventory levels to all marketplaces
 */
export const syncInventoryToMarketplaces = async (inventoryLevels) => {
    console.log('📤 [MARKETPLACE] Broadcasting stock levels...');
    try {
        const response = await fetch(`${API_BASE}/inventory/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inventory: inventoryLevels })
        });
        if (!response.ok) throw new Error(`Inventory Sync Error: ${response.status}`);
        const data = await response.json();
        console.log(`✅ [MARKETPLACE] Broadcast complete: ${data.processedCount} SKUs updated.`);
        return { success: true, broadcastedCount: data.processedCount };
    } catch (error) {
        console.error('❌ [MARKETPLACE] Broadcast Failed:', error);
        throw error;
    }
};

export default {
    fetchAmazonOrders,
    fetchFlipkartOrders,
    syncInventoryToMarketplaces
};
