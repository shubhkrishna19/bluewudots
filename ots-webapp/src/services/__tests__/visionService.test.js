import { describe, it, expect } from 'vitest';
import visionService from '../visionService';

describe('Vision Service (AI Simulation)', () => {

    it('should detect objects with simulated latency', async () => {
        const mockBlob = new Blob(['mock-image'], { type: 'image/jpeg' });
        const start = Date.now();
        const results = await visionService.analyzeImage(mockBlob);
        const duration = Date.now() - start;

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0]).toHaveProperty('label');
        expect(results[0]).toHaveProperty('confidence');

        // Ensure simulation delay is roughly respected (allowing for minor variance)
        expect(duration).toBeGreaterThan(1000);
    });

    it('should verify packing against ordered items', async () => {
        const orderItems = [{ sku: 'SKU-A', qty: 1 }];
        const mockBlob = new Blob(['mock-box'], { type: 'image/jpeg' });

        const verification = await visionService.verifyPacking(orderItems, mockBlob);

        // This test depends on the random simulation in visionService.
        // We check structure rather than deterministic outcome for boolean success
        expect(verification).toHaveProperty('detected');
        expect(verification).toHaveProperty('missing');
        expect(verification).toHaveProperty('timestamp');
    });

    it('should extract text via OCR simulation', async () => {
        const mockBlob = new Blob(['mock-label'], { type: 'image/jpeg' });
        const ocr = await visionService.performOCR(mockBlob);

        expect(ocr.text).toContain('AWB');
        expect(ocr.fields.trackingId).toBe('TRK123456789');
        expect(ocr.fields.orderId).toBe('ORD-001');
    });

});
