/**
 * ValidationUtils - Core validation functions for the app
 * Used for orders, users, addresses, and field-level validation
 * India-first: handles GST, state codes, phone numbers
 */

// Phone number validation (India: 10 digits)
export const isValidIndianPhoneNumber = (phone) => {
  if (!phone) return false;
  const cleaned = String(phone).replace(/\D/g, '');
  return cleaned.length === 10 && /^[6-9]/.test(cleaned);
};

// Email validation
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

// GST validation (15-character alphanumeric)
export const isValidGST = (gst) => {
  if (!gst) return false;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(String(gst).toUpperCase());
};

// PAN validation (10 characters)
export const isValidPAN = (pan) => {
  if (!pan) return false;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(String(pan).toUpperCase());
};

// Pincode validation (6 digits)
export const isValidIndianPincode = (pincode) => {
  if (!pincode) return false;
  const cleaned = String(pincode).replace(/\D/g, '');
  return cleaned.length === 6;
};

// AADHAR validation (12 digits)
export const isValidAadhar = (aadhar) => {
  if (!aadhar) return false;
  const cleaned = String(aadhar).replace(/\D/g, '');
  return cleaned.length === 12;
};

// Address validation
export const isValidAddress = (address) => {
  if (!address) return false;
  const { street, city, state, pincode } = address;
  return (
    street && street.trim().length >= 3 &&
    city && city.trim().length >= 2 &&
    state && state.length === 2 &&
    isValidIndianPincode(pincode)
  );
};

// Order ID validation format
export const isValidOrderId = (orderId) => {
  if (!orderId) return false;
  // Order IDs typically follow pattern: BW-YYYYMMDD-XXXXX
  const orderRegex = /^[A-Z]{2}-\d{8}-\d{5}$/;
  return orderRegex.test(String(orderId));
};

// SKU validation
export const isValidSKU = (sku) => {
  if (!sku) return false;
  // SKU: alphanumeric, 3-20 characters
  const skuRegex = /^[A-Z0-9]{3,20}$/;
  return skuRegex.test(String(sku).toUpperCase());
};

// Amount validation (non-negative number, up to 2 decimals)
export const isValidAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0 && num <= 9999999.99;
};

// Quantity validation (positive integer)
export const isValidQuantity = (qty) => {
  if (qty === null || qty === undefined || qty === '') return false;
  const num = parseInt(qty, 10);
  return !isNaN(num) && num > 0 && num <= 999999;
};

// Weight validation in KG
export const isValidWeight = (weight) => {
  if (weight === null || weight === undefined || weight === '') return false;
  const num = parseFloat(weight);
  return !isNaN(num) && num > 0 && num <= 100;
};

// Dimension validation (L x W x H in cm)
export const isValidDimensions = (length, width, height) => {
  const isValid = (dim) => {
    const num = parseFloat(dim);
    return !isNaN(num) && num > 0 && num <= 300;
  };
  return isValid(length) && isValid(width) && isValid(height);
};

// Order status validation
export const isValidOrderStatus = (status) => {
  const validStatuses = [
    'PENDING', 'CONFIRMED', 'PROCESSING',
    'READY_TO_SHIP', 'SHIPPED', 'IN_TRANSIT',
    'OUT_FOR_DELIVERY', 'DELIVERED',
    'CANCELLED', 'RETURNED', 'FAILED'
  ];
  return validStatuses.includes(String(status).toUpperCase());
};

// Payment method validation
export const isValidPaymentMethod = (method) => {
  const validMethods = [
    'COD', 'PREPAID', 'UPI', 'CREDIT_CARD',
    'DEBIT_CARD', 'NETBANKING', 'WALLET'
  ];
  return validMethods.includes(String(method).toUpperCase());
};

// Shipping carrier validation
export const isValidCarrier = (carrier) => {
  const validCarriers = [
    'DELHIVERY', 'BLUEDART', 'XPRESSBEES',
    'FEDEX', 'ARAMEX', 'INDIA_POST'
  ];
  return validCarriers.includes(String(carrier).toUpperCase());
};

// Source channel validation
export const isValidOrderSource = (source) => {
  const validSources = [
    'AMAZON', 'FLIPKART', 'MYNTRA', 'MEESHO',
    'WEBSITE', 'INSTAGRAM', 'WHATSAPP', 'MANUAL'
  ];
  return validSources.includes(String(source).toUpperCase());
};

// State code validation (2-letter Indian state codes)
export const isValidStateCode = (stateCode) => {
  const validStates = [
    'AP', 'AR', 'AS', 'BR', 'CG', 'CH', 'CT', 'DD', 'DL', 'DN',
    'GA', 'GJ', 'HR', 'HP', 'JK', 'JH', 'KA', 'KL', 'LD', 'LA',
    'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OR', 'OD', 'PB', 'PY',
    'RJ', 'SK', 'TG', 'TR', 'TN', 'UP', 'UT', 'WB', 'TS'
  ];
  return validStates.includes(String(stateCode).toUpperCase());
};

// Comprehensive order validation
export const validateOrder = (order) => {
  const errors = {};
  
  if (!order.orderId || !isValidOrderId(order.orderId)) {
    errors.orderId = 'Invalid order ID format';
  }
  
  if (!order.source || !isValidOrderSource(order.source)) {
    errors.source = 'Invalid order source';
  }
  
  if (!order.status || !isValidOrderStatus(order.status)) {
    errors.status = 'Invalid order status';
  }
  
  if (!order.shippingAddress || !isValidAddress(order.shippingAddress)) {
    errors.shippingAddress = 'Invalid shipping address';
  }
  
  if (!order.billingAddress || !isValidAddress(order.billingAddress)) {
    errors.billingAddress = 'Invalid billing address';
  }
  
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.items = 'Order must have at least one item';
  } else {
    order.items.forEach((item, idx) => {
      if (!isValidSKU(item.sku)) {
        errors[`items[${idx}].sku`] = 'Invalid SKU';
      }
      if (!isValidQuantity(item.quantity)) {
        errors[`items[${idx}].quantity`] = 'Invalid quantity';
      }
      if (!isValidAmount(item.price)) {
        errors[`items[${idx}].price`] = 'Invalid price';
      }
    });
  }
  
  if (!isValidAmount(order.totalAmount)) {
    errors.totalAmount = 'Invalid total amount';
  }
  
  if (!isValidPaymentMethod(order.paymentMethod)) {
    errors.paymentMethod = 'Invalid payment method';
  }
  
  return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
};

// Email batch validation
export const validateBatchEmails = (emails) => {
  return emails.map((email, idx) => ({
    email,
    valid: isValidEmail(email),
    index: idx
  }));
};

// Phone batch validation
export const validateBatchPhones = (phones) => {
  return phones.map((phone, idx) => ({
    phone,
    valid: isValidIndianPhoneNumber(phone),
    index: idx
  }));
};

export default {
  isValidIndianPhoneNumber,
  isValidEmail,
  isValidGST,
  isValidPAN,
  isValidIndianPincode,
  isValidAadhar,
  isValidAddress,
  isValidOrderId,
  isValidSKU,
  isValidAmount,
  isValidQuantity,
  isValidWeight,
  isValidDimensions,
  isValidOrderStatus,
  isValidPaymentMethod,
  isValidCarrier,
  isValidOrderSource,
  isValidStateCode,
  validateOrder,
  validateBatchEmails,
  validateBatchPhones
};
