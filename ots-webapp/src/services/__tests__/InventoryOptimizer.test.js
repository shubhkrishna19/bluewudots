import { describe, it, expect, vi } from 'vitest';
import InventoryOptimizer from '../InventoryOptimizer';
import mlForecastService from '../mlForecastService';

vi.mock('../mlForecastService');

describe('InventoryOptimizer', () => {
    it('should generate reorder alerts when stock is low', async () => {
        // Mock forecast: Will execute stock out in 5 days
        mlForecastService.predictStockOutDate.mockReturnValue({
            date: '2025-01-10',
            days: 5,
            urgency: 'CRITICAL'
        });

        const mockOrders = [{ id: 1, sku: 'SKU-A', quantity: 10 }];
        const mockInventory = {
            'SKU-A': { sku: 'SKU-A', inStock: 10, minStock: 5, leadTime: 7 }
        };

        const alerts = await InventoryOptimizer.generateReorderAlerts(mockOrders, mockInventory);

        expect(alerts).toHaveLength(1);
        expect(alerts[0].sku).toBe('SKU-A');
        expect(alerts[0].urgency).toBe('CRITICAL');
        // Lead time (7) > Days remaining (5) => Late
    });

    it('should not alert if stock is sufficient', async () => {
        mlForecastService.predictStockOutDate.mockReturnValue({
            date: '2025-02-10',
            days: 35,
            urgency: 'SAFE'
        });

        const mockOrders = [{ id: 1, sku: 'SKU-B' }];
        const mockInventory = {
            'SKU-B': { sku: 'SKU-B', inStock: 100, leadTime: 7 }
        };

        const alerts = await InventoryOptimizer.generateReorderAlerts(mockOrders, mockInventory);
        expect(alerts).toHaveLength(0);
    });

    it('should calculate optimal reorder quantity', () => {
        mlForecastService.calculateRRQ.mockReturnValue(50);

        const rrq = InventoryOptimizer.calculateOptimalReorderQuantity({}, 'SKU-A');
        expect(rrq).toBe(50);
    });
});
