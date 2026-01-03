
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WhatsAppService, { initWhatsAppService, getWhatsAppService } from '../whatsappService';

// Mock fetch
global.fetch = vi.fn();

describe('WhatsAppService', () => {
    let service;

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset singleton
        service = new WhatsAppService('mock-token', 'mock-biz-id', 'mock-phone-id');
    });

    it('should initialize in real mode with credentials', () => {
        expect(service.isSimulationMode).toBe(false);
    });

    it('should initialize in simulation mode without credentials', () => {
        const simService = new WhatsAppService(null, null, null);
        expect(simService.isSimulationMode).toBe(true);
    });

    it('should normalize phone numbers correctly', () => {
        expect(service.normalizePhoneNumber('9876543210')).toBe('919876543210');
        expect(service.normalizePhoneNumber('+91 98765 43210')).toBe('919876543210');
        expect(service.normalizePhoneNumber('123')).toBe(null);
    });

    it('should send message via API in real mode', async () => {
        // Mock successful response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ messages: [{ id: 'wamd.test' }] })
        });

        const result = await service.sendWhatsAppMessage('ORD-1', 'confirmed', '9876543210', { amount: 100 });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.success).toBe(true);
        expect(result.mode).toBe('real');
    });

    it('should fall back to simulation if credentials missing', async () => {
        const simService = new WhatsAppService(null, null, null);
        const result = await simService.sendWhatsAppMessage('ORD-1', 'confirmed', '9876543210');

        expect(fetch).not.toHaveBeenCalled();
        expect(result.success).toBe(true);
        expect(result.mode).toBe('simulation');
    });
});
