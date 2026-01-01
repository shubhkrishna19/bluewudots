/**
 * Validation Utils Tests
 * Comprehensive test suite for validation functions
 */

import * as validators from '../utils/validationUtils';

describe('validationUtils', () => {
  describe('Phone Number Validation', () => {
    test('should validate valid Indian phone numbers', () => {
      expect(validators.isValidIndianPhoneNumber('9876543210')).toBe(true);
      expect(validators.isValidIndianPhoneNumber('8765432109')).toBe(true);
      expect(validators.isValidIndianPhoneNumber(7654321098)).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(validators.isValidIndianPhoneNumber('123456')).toBe(false);
      expect(validators.isValidIndianPhoneNumber('98765432100')).toBe(false);
      expect(validators.isValidIndianPhoneNumber('1234567890')).toBe(false);
      expect(validators.isValidIndianPhoneNumber('')).toBe(false);
      expect(validators.isValidIndianPhoneNumber(null)).toBe(false);
    });
  });

  describe('Email Validation', () => {
    test('should validate valid emails', () => {
      expect(validators.isValidEmail('test@example.com')).toBe(true);
      expect(validators.isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    test('should reject invalid emails', () => {
      expect(validators.isValidEmail('invalid.email')).toBe(false);
      expect(validators.isValidEmail('test@')).toBe(false);
      expect(validators.isValidEmail('@example.com')).toBe(false);
      expect(validators.isValidEmail('')).toBe(false);
    });
  });

  describe('GST Validation', () => {
    test('should validate valid GST numbers', () => {
      expect(validators.isValidGST('27AAFCT5055K1Z0')).toBe(true);
    });

    test('should reject invalid GST numbers', () => {
      expect(validators.isValidGST('INVALID')).toBe(false);
      expect(validators.isValidGST('')).toBe(false);
    });
  });

  describe('PAN Validation', () => {
    test('should validate valid PAN', () => {
      expect(validators.isValidPAN('AAAPA5055K')).toBe(true);
    });

    test('should reject invalid PAN', () => {
      expect(validators.isValidPAN('123456')).toBe(false);
      expect(validators.isValidPAN('AAAPA5055')).toBe(false);
    });
  });

  describe('Pincode Validation', () => {
    test('should validate valid pincodes', () => {
      expect(validators.isValidIndianPincode('110001')).toBe(true);
      expect(validators.isValidIndianPincode(560034)).toBe(true);
    });

    test('should reject invalid pincodes', () => {
      expect(validators.isValidIndianPincode('12345')).toBe(false);
      expect(validators.isValidIndianPincode('1234567')).toBe(false);
      expect(validators.isValidIndianPincode('')).toBe(false);
    });
  });

  describe('Amount Validation', () => {
    test('should validate valid amounts', () => {
      expect(validators.isValidAmount('100')).toBe(true);
      expect(validators.isValidAmount('99.99')).toBe(true);
      expect(validators.isValidAmount(0)).toBe(true);
      expect(validators.isValidAmount(1000000)).toBe(true);
    });

    test('should reject invalid amounts', () => {
      expect(validators.isValidAmount(-100)).toBe(false);
      expect(validators.isValidAmount('abc')).toBe(false);
      expect(validators.isValidAmount('')).toBe(false);
      expect(validators.isValidAmount(null)).toBe(false);
    });
  });

  describe('Status Validation', () => {
    test('should validate valid statuses', () => {
      expect(validators.isValidOrderStatus('PENDING')).toBe(true);
      expect(validators.isValidOrderStatus('DELIVERED')).toBe(true);
      expect(validators.isValidOrderStatus('cancelled')).toBe(true);
    });

    test('should reject invalid statuses', () => {
      expect(validators.isValidOrderStatus('INVALID')).toBe(false);
      expect(validators.isValidOrderStatus('')).toBe(false);
    });
  });

  describe('Order Validation', () => {
    const validOrder = {
      orderId: 'BW-20230101-00001',
      source: 'WEBSITE',
      status: 'PENDING',
      shippingAddress: {
        street: '123 Main Street',
        city: 'Bangalore',
        state: 'KA',
        pincode: '560034'
      },
      billingAddress: {
        street: '123 Main Street',
        city: 'Bangalore',
        state: 'KA',
        pincode: '560034'
      },
      items: [{
        sku: 'PROD001',
        quantity: 2,
        price: 100
      }],
      totalAmount: 200,
      paymentMethod: 'PREPAID'
    };

    test('should validate valid orders', () => {
      const result = validators.validateOrder(validOrder);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    test('should detect invalid orders', () => {
      const invalidOrder = { ...validOrder, orderId: 'INVALID' };
      const result = validators.validateOrder(invalidOrder);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors.orderId).toBeDefined();
    });
  });
});
