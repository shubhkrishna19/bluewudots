import { describe, it, expect, vi } from 'vitest';
import marketplaceService from '../marketplaceService';

describe('MarketplaceService', () => {
    it('should fetch mock orders in simulation mode for Amazon', async () => {
        const orders = await marketplaceService.fetchOrders('amazon');
        expect(orders).toBeInstanceOf(Array);
        expect(orders.length).toBeGreaterThan(0);
        expect(orders[0]).toHaveProperty('source', 'Amazon');
        expect(orders[0].id).toMatch(/^AMZ-/);
    });

    it('should fetch mock orders in simulation mode for Flipkart', async () => {
        const orders = await marketplaceService.fetchOrders('flipkart');
        expect(orders).toBeInstanceOf(Array);
        expect(orders.length).toBeGreaterThan(0);
        expect(orders[0]).toHaveProperty('source', 'Flipkart');
        expect(orders[0].id).toMatch(/^FK-/);
    });

    it('should simulate inventory sync', async () => {
        const result = await marketplaceService.syncInventory('TEST-SKU', 10, 'amazon');
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('mode', 'simulation');
        expect(result).toHaveProperty('sku', 'TEST-SKU');
    });

    it('should handle invalid platform gracefuly', async () => {
        // Should default to mock generator but might return empty or generic mock based on implementation
        // Our mock generator handles 'amazon' or 'flipkart', let's see what happens with 'other'
        // The mock generator uses platform name for prefix, so it should just work or fail gracefully
        const orders = await marketplaceService.fetchOrders('other');
        expect(orders).toBeInstanceOf(Array);
        expect(orders[0].source).toBe('Flipkart'); // Default fallback in getMockOrders might vary, checking logic
    });
});
