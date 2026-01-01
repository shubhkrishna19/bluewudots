/**
 * Validation Utilities
 * Comprehensive validation functions for order data, addresses, contact info, etc.
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number (10-15 digits with optional +)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

/**
 * Validates Indian postal code (6 digits)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} - True if valid pincode
 */
export const validatePincode = (pincode) => {
  return /^[1-9]{1}[0-9]{5}$/.test(pincode);
};

/**
 * Validates order data structure
 * @param {object} order - Order object to validate
 * @returns {object} - Validation result { valid: boolean, errors: [] }
 */
export const validateOrder = (order) => {
  const errors = [];

  if (!order.id) errors.push('Order ID is required');
  if (!order.customerName) errors.push('Customer name is required');
  if (!validateEmail(order.customerEmail)) errors.push('Valid email is required');
  if (!validatePhone(order.customerPhone)) errors.push('Valid phone number is required');
  if (!order.items || order.items.length === 0) errors.push('At least one item is required');
  if (!order.shippingAddress) errors.push('Shipping address is required');
  if (!order.deliveryDate) errors.push('Delivery date is required');
  if (order.totalAmount <= 0) errors.push('Total amount must be greater than 0');

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates shipping address
 * @param {object} address - Address object
 * @returns {object} - Validation result { valid: boolean, errors: [] }
 */
export const validateAddress = (address) => {
  const errors = [];

  if (!address.street) errors.push('Street address is required');
  if (!address.city) errors.push('City is required');
  if (!address.state) errors.push('State is required');
  if (!validatePincode(address.pincode)) errors.push('Valid 6-digit pincode is required');
  if (!address.country) errors.push('Country is required');

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates order item
 * @param {object} item - Item object
 * @returns {object} - Validation result { valid: boolean, errors: [] }
 */
export const validateOrderItem = (item) => {
  const errors = [];

  if (!item.productId) errors.push('Product ID is required');
  if (!item.productName) errors.push('Product name is required');
  if (item.quantity <= 0) errors.push('Quantity must be greater than 0');
  if (item.price <= 0) errors.push('Price must be greater than 0');
  if (!item.sku) errors.push('SKU is required');

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates payment details
 * @param {object} payment - Payment object
 * @returns {object} - Validation result { valid: boolean, errors: [] }
 */
export const validatePayment = (payment) => {
  const errors = [];

  if (!payment.method) errors.push('Payment method is required');
  if (payment.amount <= 0) errors.push('Payment amount must be greater than 0');
  if (payment.method === 'card') {
    if (!payment.cardNumber || !/^\d{13,19}$/.test(payment.cardNumber.replace(/\s/g, ''))) {
      errors.push('Valid card number is required (13-19 digits)');
    }
    if (!payment.cardHolder) errors.push('Card holder name is required');
  } else if (payment.method === 'upi') {
    if (!payment.upiId || !/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(payment.upiId)) {
      errors.push('Valid UPI ID is required');
    }
  } else if (payment.method === 'netbanking') {
    if (!payment.bankName) errors.push('Bank name is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {boolean} - True if valid range
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  return new Date(startDate) < new Date(endDate);
};

/**
 * Validates order status transition
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - New status
 * @returns {boolean} - True if valid transition
 */
export const validateStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['packed', 'cancelled'],
    'packed': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'returned'],
    'delivered': ['returned'],
    'cancelled': [],
    'returned': []
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export default {
  validateEmail,
  validatePhone,
  validatePincode,
  validateOrder,
  validateAddress,
  validateOrderItem,
  validatePayment,
  validateDateRange,
  validateStatusTransition,
  sanitizeInput
};
