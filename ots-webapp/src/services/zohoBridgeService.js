import { SKU_MASTER } from '../data/skuMasterData';

/**
 * Zoho CRM Bridge Service
 * Handles communication with the Zoho Catalyst/CRM backend.
 */

const API_BASE = '/server/zoho'; // Base path for Catalyst functions

/**
 * Fetch latest SKU master from Zoho CRM
 * @returns {Promise<Array>} List of SKU objects
 */
export const fetchSKUMaster = async () => {
    try {
        console.log('[Bluewud-AI] 🔄 Fetching SKU Master (Syncing with SSOT)...');

        const response = await fetch(`${API_BASE}/sku`);
        if (!response.ok) {
            // Fallback to seed data if network fails (for offline/dev resilience)
            console.warn('[Bluewud-AI] ⚠️ Zoho Sync failed, falling back to Seed Data.');
            return SKU_MASTER;
        }
        const data = await response.json();
        console.log('[Bluewud-AI] ✅ Synchronized with Zoho CRM SKU Master');
        return data;
    } catch (error) {
        console.error('[Bluewud-AI] ❌ SKU Sync Error:', error);
        return SKU_MASTER; // Resilient fallback
    }
};

/**
 * Push order to Zoho CRM (Create Deal/Order)
 * @param {Object} order - Order data
 * @returns {Promise<Object>} Response from Zoho
 */
export const pushOrderToZoho = async (order) => {
    try {
        console.log(`[Bluewud-AI] 📤 Pushing Order ${order.id} to Zoho CRM...`);

        const response = await fetch(`${API_BASE}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        if (!response.ok) throw new Error(`Zoho API Error: ${response.status}`);
        const data = await response.json();
        console.log(`✅ Order ${order.id} synced to Zoho CRM.`);
        return data;
    } catch (error) {
        console.error('❌ Zoho Order Push Error:', error);
        throw error;
    }
};

/**
 * Push only modified orders to Zoho (Delta Sync)
 * @param {Array} orders - List of all orders
 * @returns {Promise<Object>} Results summary
 */
export const syncDeltaOrders = async (orders) => {
    const lastSync = localStorage.getItem('last_zoho_sync_time');
    const modifiedOrders = orders.filter(o => !lastSync || new Date(o.lastUpdated || o.updatedAt) > new Date(lastSync));

    if (modifiedOrders.length === 0) return { success: true, count: 0 };

    console.log(`🔄 Syncing ${modifiedOrders.length} modified orders to Zoho...`);

    const results = await Promise.allSettled(modifiedOrders.map(o => pushOrderToZoho(o)));

    localStorage.setItem('last_zoho_sync_time', new Date().toISOString());
    return {
        success: true,
        count: modifiedOrders.length,
        results
    };
};

export default {
    fetchSKUMaster,
    pushOrderToZoho,
    syncDeltaOrders
};
