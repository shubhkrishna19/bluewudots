
import { describe, it, expect, vi } from 'vitest';
import carrierFactory from '../carriers/CarrierFactory';
import DelhiveryStrategy from '../carriers/DelhiveryStrategy';

describe('Carrier Strategy Pattern', () => {

    it('should return Delhivery strategy from factory', () => {
        const strategy = carrierFactory.getCarrier('delhivery');
        expect(strategy).toBeInstanceOf(DelhiveryStrategy);
        expect(strategy.name).toBe('Delhivery');
    });

    it('should throw error for unsupported carrier', () => {
        expect(() => carrierFactory.getCarrier('invalid_carrier')).toThrow(/not supported/);
    });

    it('should use simulation if token is missing (Delhivery)', async () => {
        const strategy = carrierFactory.getCarrier('delhivery');
        // Force simulation
        strategy.config.token = null;

        const shipment = { originPincode: '560001', destPincode: '110001', weight: 500 };
        const rates = await strategy.getRates(shipment);

        expect(rates.carrierId).toBe('delhivery');
        expect(rates.isLive).toBe(false);
        expect(rates.total).toBeGreaterThan(0);
    });

    it('should mark as live if API effectively mocked', async () => {
        const strategy = carrierFactory.getCarrier('delhivery');
        strategy.config.token = 'mock_token';

        const shipment = { originPincode: '560001', destPincode: '110001', weight: 500 };
        const rates = await strategy.getRates(shipment);

        expect(rates.isLive).toBe(true);
        expect(rates.carrierName).toContain('(Live)');
    });
});
