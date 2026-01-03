/**
 * Formatters - Display formatting functions for the app
 * Handles currency (INR), dates, status badges, and localized displays
 */

// Currency formatter (INR)
export const formatCurrency = (amount, opts = {}) => {
  const { locale = 'en-IN', minimumFractionDigits = 0, maximumFractionDigits = 2 } = opts;
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(num);
};

// Compact currency (e.g., 1.2K, 1M)
export const formatCompactCurrency = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0';
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return formatCurrency(num);
};

// Date formatter
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');
  
  const replacements = {
    'DD': day,
    'MM': month,
    'YYYY': year,
    'HH': hour,
    'mm': minute,
    'ss': second
  };
  
  let result = format;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(key, value);
  });
  return result;
};

// Relative time formatter (e.g., "2 hours ago", "3 days ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  
  return formatDate(date, 'DD/MM/YYYY');
};

// Status formatter with color codes
export const formatStatus = (status) => {
  const statusMap = {
    'PENDING': { label: 'Pending', color: 'warning', icon: '⏳' },
    'CONFIRMED': { label: 'Confirmed', color: 'info', icon: '✓' },
    'PROCESSING': { label: 'Processing', color: 'info', icon: '⚙️' },
    'READY_TO_SHIP': { label: 'Ready to Ship', color: 'info', icon: '📦' },
    'SHIPPED': { label: 'Shipped', color: 'info', icon: '📤' },
    'IN_TRANSIT': { label: 'In Transit', color: 'primary', icon: '🚚' },
    'OUT_FOR_DELIVERY': { label: 'Out for Delivery', color: 'primary', icon: '🚗' },
    'DELIVERED': { label: 'Delivered', color: 'success', icon: '✅' },
    'CANCELLED': { label: 'Cancelled', color: 'danger', icon: '❌' },
    'RETURNED': { label: 'Returned', color: 'warning', icon: '↩️' },
    'FAILED': { label: 'Failed', color: 'danger', icon: '⚠️' }
  };
  
  return statusMap[String(status).toUpperCase()] || { label: status, color: 'secondary', icon: '?' };
};

// Payment method formatter
export const formatPaymentMethod = (method) => {
  const methodMap = {
    'COD': 'Cash on Delivery',
    'PREPAID': 'Prepaid',
    'UPI': 'UPI',
    'CREDIT_CARD': 'Credit Card',
    'DEBIT_CARD': 'Debit Card',
    'NETBANKING': 'Net Banking',
    'WALLET': 'Wallet'
  };
  
  return methodMap[String(method).toUpperCase()] || method;
};

// Carrier/Shipping formatter
export const formatCarrier = (carrier) => {
  const carrierMap = {
    'DELHIVERY': 'Delhivery',
    'BLUEDART': 'Blue Dart',
    'XPRESSBEES': 'Xpressbees',
    'FEDEX': 'FedEx',
    'ARAMEX': 'Aramex',
    'INDIA_POST': 'India Post'
  };
  
  return carrierMap[String(carrier).toUpperCase()] || carrier;
};

// Order source formatter
export const formatOrderSource = (source) => {
  const sourceMap = {
    'AMAZON': 'Amazon',
    'FLIPKART': 'Flipkart',
    'MYNTRA': 'Myntra',
    'MEESHO': 'Meesho',
    'WEBSITE': 'Website',
    'INSTAGRAM': 'Instagram',
    'WHATSAPP': 'WhatsApp',
    'MANUAL': 'Manual'
  };
  
  return sourceMap[String(source).toUpperCase()] || source;
};

// Address formatter
export const formatAddress = (address, format = 'singleLine') => {
  if (!address) return '';
  const { street, city, state, pincode, country = 'India' } = address;
  
  if (format === 'multiLine') {
    return `${street}\n${city}, ${state} ${pincode}\n${country}`;
  }
  // singleLine
  return `${street}, ${city}, ${state} ${pincode}, ${country}`;
};

// Phone formatter
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  return `+91-${cleaned.substring(0, 5)}-${cleaned.substring(5)}`;
};

// Percentage formatter
export const formatPercentage = (value, decimals = 1) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0%';
  return `${num.toFixed(decimals)}%`;
};

// File size formatter (bytes to human-readable)
export const formatFileSize = (bytes) => {
  const num = parseFloat(bytes);
  if (isNaN(num) || num === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(num) / Math.log(k));
  
  return `${(num / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text) return '';
  const str = String(text);
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

// Uppercase
export const uppercase = (str) => {
  return String(str).toUpperCase();
};

// Lowercase
export const lowercase = (str) => {
  return String(str).toLowerCase();
};

// Title case
export const titleCase = (str) => {
  if (!str) return '';
  return String(str)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Order ID formatter with separator
export const formatOrderId = (id) => {
  if (!id) return '';
  return String(id).toUpperCase();
};

// SKU formatter
export const formatSKU = (sku) => {
  return String(sku).toUpperCase();
};

// Quantity formatter with unit
export const formatQuantity = (qty, unit = 'pcs') => {
  if (qty === null || qty === undefined) return '0 ' + unit;
  return `${parseInt(qty, 10)} ${unit}`;
};

// Weight formatter (convert to readable format)
export const formatWeight = (weight, unit = 'kg') => {
  if (!weight) return '0 ' + unit;
  const num = parseFloat(weight);
  if (isNaN(num)) return weight;
  return `${num.toFixed(2)} ${unit}`;
};

// Dimension formatter
export const formatDimensions = (length, width, height, unit = 'cm') => {
  return `${parseFloat(length).toFixed(1)}${unit} × ${parseFloat(width).toFixed(1)}${unit} × ${parseFloat(height).toFixed(1)}${unit}`;
};

// PIN/ZIP formatter
export const formatPincode = (pincode) => {
  if (!pincode) return '';
  return String(pincode).replace(/\D/g, '').substring(0, 6);
};

// Aadhar formatter (masked for privacy)
export const formatAadhar = (aadhar) => {
  if (!aadhar) return '';
  const cleaned = String(aadhar).replace(/\D/g, '');
  if (cleaned.length !== 12) return aadhar;
  return `XXXX XXXX ${cleaned.substring(8)}`;
};

// PAN formatter (masked for privacy)
export const formatPAN = (pan) => {
  if (!pan) return '';
  const upper = String(pan).toUpperCase();
  if (upper.length !== 10) return upper;
  return `${upper.substring(0, 5)}XXXX${upper.substring(9)}`;
};

// GST formatter
export const formatGST = (gst) => {
  if (!gst) return '';
  return String(gst).toUpperCase();
};

// Batch formatter for arrays
export const formatBatch = (items, formatter) => {
  if (!Array.isArray(items)) return [];
  return items.map(item => formatter(item));
};

export default {
  formatCurrency,
  formatCompactCurrency,
  formatDate,
  formatRelativeTime,
  formatStatus,
  formatPaymentMethod,
  formatCarrier,
  formatOrderSource,
  formatAddress,
  formatPhoneNumber,
  formatPercentage,
  formatFileSize,
  truncateText,
  capitalize,
  uppercase,
  lowercase,
  titleCase,
  formatOrderId,
  formatSKU,
  formatQuantity,
  formatWeight,
  formatDimensions,
  formatPincode,
  formatAadhar,
  formatPAN,
  formatGST,
  formatBatch
};
