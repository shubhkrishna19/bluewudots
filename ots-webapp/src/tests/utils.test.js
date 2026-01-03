/**
 * Bluewud OTS - Unit Tests
 * 
 * Core utility function tests using vanilla JS testing pattern.
 * For use with Vitest or Jest.
 */

import { describe, it, expect } from 'vitest';

// Import utilities to test
import { escapeHtml, stripHtml, isValidEmail, isValidIndianPhone, isValidPincode, isValidGST, sanitizeFilename } from '../utils/securityUtils';
import { calculateGST, getGSTType, generateOrderId, validateOrder, deduplicateOrders } from '../utils/dataUtils';
import { convertFromINR } from '../services/internationalService';

describe('Security Utils', () => {
    describe('escapeHtml', () => {
        it('should escape HTML special characters', () => {
            expect(escapeHtml('<script>alert("xss")</script>')).not.toContain('<script>');
            expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
        });

        it('should handle non-string inputs', () => {
            expect(escapeHtml(123)).toBe(123);
            expect(escapeHtml(null)).toBe(null);
        });
    });

    describe('stripHtml', () => {
        it('should remove HTML tags', () => {
            expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
        });
    });

    describe('isValidEmail', () => {
        it('should validate correct emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.co.in')).toBe(true);
        });

        it('should reject invalid emails', () => {
            expect(isValidEmail('notanemail')).toBe(false);
            expect(isValidEmail('missing@domain')).toBe(false);
        });
    });

    describe('isValidIndianPhone', () => {
        it('should validate Indian mobile numbers', () => {
            expect(isValidIndianPhone('9876543210')).toBe(true);
            expect(isValidIndianPhone('6123456789')).toBe(true);
        });

        it('should reject invalid numbers', () => {
            expect(isValidIndianPhone('1234567890')).toBe(false); // Starts with 1
            expect(isValidIndianPhone('987654321')).toBe(false); // 9 digits
        });
    });

    describe('isValidPincode', () => {
        it('should validate 6-digit pincodes', () => {
            expect(isValidPincode('560001')).toBe(true);
            expect(isValidPincode('400001')).toBe(true);
        });

        it('should reject invalid pincodes', () => {
            expect(isValidPincode('56000')).toBe(false); // 5 digits
            expect(isValidPincode('5600012')).toBe(false); // 7 digits
        });
    });

    describe('isValidGST', () => {
        it('should validate correct GST format', () => {
            expect(isValidGST('29AABCU9603R1ZM')).toBe(true);
        });

        it('should reject invalid GST', () => {
            expect(isValidGST('INVALIDGST')).toBe(false);
        });
    });

    describe('sanitizeFilename', () => {
        it('should remove dangerous characters', () => {
            expect(sanitizeFilename('../../../etc/passwd')).not.toContain('..');
            expect(sanitizeFilename('file:name.txt')).toBe('file_name.txt');
        });
    });
});

describe('Data Utils', () => {
    describe('calculateGST', () => {
        it('should calculate 18% GST by default', () => {
            const result = calculateGST(1000);
            expect(result.gstRate).toBe(18);
            expect(result.totalWithGst).toBe(1180);
            expect(result.cgst).toBe(90);
            expect(result.sgst).toBe(90);
        });

        it('should calculate reduced GST rate', () => {
            const result = calculateGST(1000, 'reduced');
            expect(result.gstRate).toBe(12);
            expect(result.totalWithGst).toBe(1120);
        });
    });

    describe('getGSTType', () => {
        it('should return CGST+SGST for same state', () => {
            expect(getGSTType('Karnataka', 'Karnataka')).toBe('CGST+SGST');
        });

        it('should return IGST for different states', () => {
            expect(getGSTType('Karnataka', 'Maharashtra')).toBe('IGST');
        });
    });

    describe('generateOrderId', () => {
        it('should generate unique IDs', () => {
            const id1 = generateOrderId();
            const id2 = generateOrderId();
            expect(id1).not.toBe(id2);
        });

        it('should use provided prefix', () => {
            const id = generateOrderId('TEST');
            expect(id.startsWith('TEST-')).toBe(true);
        });
    });

    describe('validateOrder', () => {
        it('should pass valid order', () => {
            const order = {
                customerName: 'Test Customer',
                phone: '9876543210',
                pincode: '560001',
                state: 'Karnataka',
                sku: 'SKU-001',
                weight: 2.5
            };
            const result = validateOrder(order);
            expect(result.valid).toBe(true);
            expect(result.errors.length).toBe(0);
        });

        it('should fail invalid order', () => {
            const order = { customerName: 'T' }; // Too short
            const result = validateOrder(order);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('deduplicateOrders', () => {
        it('should merge duplicate orders', () => {
            const existing = [{ id: '1', source: 'amazon', externalId: 'AMZ-001', status: 'Pending' }];
            const incoming = [{ id: '2', source: 'amazon', externalId: 'AMZ-001', status: 'Shipped' }];
            const result = deduplicateOrders(existing, incoming);
            expect(result.length).toBe(1);
            expect(result[0].status).toBe('Shipped'); // New takes precedence
        });
    });
});

describe('International Service', () => {
    describe('convertFromINR', () => {
        it('should convert INR to USD', () => {
            const result = convertFromINR(100000, 'USD');
            expect(result.symbol).toBe('$');
            expect(result.value).toBeGreaterThan(0);
        });

        it('should format currency correctly', () => {
            const result = convertFromINR(10000, 'EUR');
            expect(result.formatted).toContain('€');
        });
    });
});
