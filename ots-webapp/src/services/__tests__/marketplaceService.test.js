
import { describe, it, expect, vi, beforeEach } from 'vitest';
import marketplaceService from '../marketplaceService';

// Mock ENV
vi.stubGlobal('import.meta', { env: { VITE_AMAZON_SELLER_ID: '', VITE_FLIPKART_APP_ID: '' } });

describe('MarketplaceService', () => {
    it('should initialize in simulation mode without credentials', () => {
        expect(marketplaceService.isAmazonLive).toBe(false);
        expect(marketplaceService.isFlipkartLive).toBe(false);
    });

    it('should fetch mock orders in simulation mode', async () => {
        const orders = await marketplaceService.fetchOrders('amazon');
        expect(orders.length).toBeGreaterThan(0);
        expect(orders[0].source).toBe('Amazon');
        expect(orders[0].id).toContain('AMZ-');
    });

    it('should simulate inventory sync', async () => {
        const result = await marketplaceService.syncInventory('SKU-123', 50, 'amazon');
        expect(result.success).toBe(true);
        expect(result.mode).toBe('simulation');
    });
});
