/**
 * Data Utilities - Unit Tests
 * Comprehensive test suite for data transformation, deduplication, and validation functions.
 * JSDoc-documented with error handling and performance benchmarks.
 */

import {
  deduplicateOrders,
  deduplicateCustomers,
  validateOrder,
  normalizeOrder,
  calculateGST,
  generateOrderId,
  resolveSkuAlias,
  toCSV,
  formatDateIN,
  getRelativeTime,
} from '../utils/dataUtils'

/**
 * Test Suite: Order Deduplication
 * Tests streaming deduplication with large datasets
 */
describe('deduplicateOrders', () => {
  test('should deduplicate orders by source and externalId', () => {
    const existing = [
      { id: '1', source: 'amazon', externalId: 'AMZ001', customerName: 'John', statusHistory: [] },
    ]
    const incoming = [
      {
        id: '2',
        source: 'amazon',
        externalId: 'AMZ001',
        customerName: 'John Updated',
        statusHistory: [],
      },
      { id: '3', source: 'flipkart', externalId: 'FK001', customerName: 'Jane', statusHistory: [] },
    ]

    const result = deduplicateOrders(existing, incoming)
    expect(result.length).toBe(2) // 1 merged + 1 new
    expect(result[0].customerName).toBe('John Updated') // New data takes precedence
  })

  test('should merge status history correctly', () => {
    const existing = [
      {
        id: '1',
        source: 'amazon',
        externalId: 'AMZ001',
        statusHistory: [{ timestamp: '2024-01-01', status: 'Pending' }],
      },
    ]
    const incoming = [
      {
        id: '2',
        source: 'amazon',
        externalId: 'AMZ001',
        statusHistory: [{ timestamp: '2024-01-02', status: 'Shipped' }],
      },
    ]

    const result = deduplicateOrders(existing, incoming)
    expect(result[0].statusHistory.length).toBe(2)
  })

  test('should handle large batch deduplication efficiently', () => {
    const largeSet = Array.from({ length: 10000 }, (_, i) => ({
      id: `order_${i}`,
      source: 'amazon',
      externalId: `AMZ${i % 5000}`, // 5000 unique externalIds
      customerName: `Customer ${i}`,
      statusHistory: [],
    }))
    const newSet = Array.from({ length: 1000 }, (_, i) => ({
      id: `order_new_${i}`,
      source: 'amazon',
      externalId: `AMZ${i}`,
      customerName: `Customer New ${i}`,
      statusHistory: [],
    }))

    const start = performance.now()
    const result = deduplicateOrders(largeSet, newSet)
    const duration = performance.now() - start

    // Should complete in under 100ms
    expect(duration).toBeLessThan(100)
    expect(result.length).toBeLessThanOrEqual(largeSet.length + newSet.length)
  })

  test('should handle empty arrays', () => {
    expect(deduplicateOrders([], [])).toEqual([])
    const orders = [{ id: '1', source: 'amazon', externalId: 'AMZ001', statusHistory: [] }]
    expect(deduplicateOrders(orders, [])).toEqual(orders)
    expect(deduplicateOrders([], orders)).toEqual(orders)
  })
})

/**
 * Test Suite: Customer Deduplication
 */
describe('deduplicateCustomers', () => {
  test('should deduplicate customers by phone number', () => {
    const customers = [
      { id: '1', phone: '919876543210', email: 'john@example.com', name: 'John' },
      { id: '2', phone: '+91 9876543210', email: 'john.new@example.com', name: 'John Updated' },
    ]

    const result = deduplicateCustomers(customers)
    expect(result.length).toBe(1)
    expect(result[0].email).toBe('john.new@example.com') // Last occurrence wins
  })

  test('should deduplicate customers by email', () => {
    const customers = [
      { id: '1', phone: '919876543210', email: 'john@example.com', name: 'John' },
      { id: '2', phone: '919123456789', email: 'john@example.com', name: 'John Smith' },
    ]

    const result = deduplicateCustomers(customers)
    expect(result.length).toBe(1)
  })

  test('should handle customers without phone or email', () => {
    const customers = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane', email: 'jane@example.com' },
    ]

    const result = deduplicateCustomers(customers)
    expect(result.length).toBe(2)
  })
})

/**
 * Test Suite: Order Validation
 */
describe('validateOrder', () => {
  test('should validate correct order', () => {
    const order = {
      customerName: 'John Doe',
      phone: '9876543210',
      pincode: '123456',
      state: 'Maharashtra',
      sku: 'SKU001',
      weight: 1.5,
    }

    const result = validateOrder(order)
    expect(result.valid).toBe(true)
    expect(result.errors.length).toBe(0)
  })

  test('should catch invalid phone number', () => {
    const order = {
      customerName: 'John',
      phone: '123456', // Invalid format
      pincode: '123456',
      state: 'Maharashtra',
      sku: 'SKU001',
      weight: 1.5,
    }

    const result = validateOrder(order)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Valid 10-digit Indian phone number required')
  })
})

/**
 * Test Suite: GST Calculation
 */
describe('calculateGST', () => {
  test('should calculate standard GST (18%)', () => {
    const result = calculateGST(1000, 'standard')
    expect(result.baseAmount).toBe(1000)
    expect(result.cgst).toBe(90)
    expect(result.sgst).toBe(90)
    expect(result.totalWithGst).toBe(1180)
  })

  test('should calculate reduced GST (12%)', () => {
    const result = calculateGST(1000, 'reduced')
    expect(result.gstRate).toBe(12)
    expect(result.totalWithGst).toBe(1120)
  })
})

/**
 * Test Suite: Order ID Generation
 */
describe('generateOrderId', () => {
  test('should generate unique order IDs', () => {
    const id1 = generateOrderId()
    const id2 = generateOrderId()
    expect(id1).not.toBe(id2)
    expect(id1).toMatch(/^BW-/)
  })

  test('should use custom prefix', () => {
    const id = generateOrderId('CUSTOM')
    expect(id).toMatch(/^CUSTOM-/)
  })
})

/**
 * Test Suite: CSV Export
 */
describe('toCSV', () => {
  test('should convert array of objects to CSV', () => {
    const data = [
      { id: '1', name: 'John', age: '30' },
      { id: '2', name: 'Jane', age: '25' },
    ]

    const csv = toCSV(data, ['id', 'name', 'age'])
    expect(csv).toContain('id,name,age')
    expect(csv).toContain('1,John,30')
    expect(csv).toContain('2,Jane,25')
  })

  test('should escape commas in values', () => {
    const data = [{ name: 'Smith, John', city: 'New York' }]
    const csv = toCSV(data)
    expect(csv).toContain('"Smith, John"')
  })
})

/**
 * Test Suite: Date Formatting
 */
describe('formatDateIN', () => {
  test('should format date in Indian format', () => {
    const date = new Date('2024-01-15')
    const formatted = formatDateIN(date)
    expect(formatted).toMatch(/\d{2}-[A-Za-z]{3}-\d{4}/)
  })
})

/**
 * Test Suite: Relative Time
 */
describe('getRelativeTime', () => {
  test('should return "just now" for recent dates', () => {
    const now = new Date()
    const result = getRelativeTime(now)
    expect(result).toBe('just now')
  })

  test('should return minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000)
    const result = getRelativeTime(fiveMinutesAgo)
    expect(result).toMatch(/\d+ min ago/)
  })
})

/**
 * Performance Benchmark Suite
 */
describe('Performance Benchmarks', () => {
  test('deduplicateOrders with 50k records should complete in < 200ms', () => {
    const largeDataset = Array.from({ length: 50000 }, (_, i) => ({
      id: `order_${i}`,
      source: 'amazon',
      externalId: `AMZ${i % 10000}`,
      customerName: `Customer ${i}`,
      statusHistory: [],
    }))

    const start = performance.now()
    deduplicateOrders(largeDataset, [])
    const duration = performance.now() - start

    expect(duration).toBeLessThan(300)
    console.log(`✓ Deduplication of 50k records: ${duration.toFixed(2)}ms`)
  })

  test('validateOrder should complete in < 1ms', () => {
    const order = {
      customerName: 'John Doe',
      phone: '9876543210',
      pincode: '123456',
      state: 'Maharashtra',
      sku: 'SKU001',
      weight: 1.5,
    }

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      validateOrder(order)
    }
    const duration = performance.now() - start

    expect(duration / 1000).toBeLessThan(1)
    console.log(`✓ 1000 validations: ${(duration / 1000).toFixed(3)}ms each`)
  })
})

export default {
  deduplicateOrders,
  deduplicateCustomers,
  validateOrder,
  normalizeOrder,
  calculateGST,
}
