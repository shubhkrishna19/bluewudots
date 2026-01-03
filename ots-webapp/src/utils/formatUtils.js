/**
 * Format Utilities
 * Functions for formatting dates, currency, phone numbers, etc.
 */

/**
 * Formats date to 'DD/MM/YYYY' format
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formats date with time 'DD/MM/YYYY HH:mm'
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted datetime
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
};

/**
 * Formats currency to Indian Rupees
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Formats phone number to (XXX) XXX-XXXX format
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) return phone;
  
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+91-${cleaned.slice(2, 5)}-${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }
  
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

/**
 * Formats pincode as XXXXXX
 * @param {string} pincode - Pincode
 * @returns {string} - Formatted pincode
 */
export const formatPincode = (pincode) => {
  return pincode.replace(/[^0-9]/g, '').slice(0, 6);
};

/**
 * Formats percentage with specified decimal places
 * @param {number} value - Value as decimal (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Formats bytes to human-readable size
 * @param {number} bytes - Number of bytes
 * @returns {string} - Formatted size
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Formats order ID with prefix and padding
 * @param {number|string} id - Order ID
 * @returns {string} - Formatted order ID
 */
export const formatOrderId = (id) => {
  return `ORD-${String(id).padStart(8, '0')}`;
};

/**
 * Capitalizes first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts string to title case
 * @param {string} str - String to convert
 * @returns {string} - Title case string
 */
export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

/**
 * Truncates text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix (default: '...')
 * @returns {string} - Truncated text
 */
export const truncate = (text, maxLength, suffix = '...') => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Formats address as single line
 * @param {object} address - Address object
 * @returns {string} - Formatted address
 */
export const formatAddress = (address) => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Formats duration in milliseconds to readable format
 * @param {number} ms - Milliseconds
 * @returns {string} - Formatted duration
 */
export const formatDuration = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  
  return parts.join(' ') || '0s';
};

export default {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatPhone,
  formatPincode,
  formatPercentage,
  formatBytes,
  formatOrderId,
  capitalize,
  toTitleCase,
  truncate,
  formatAddress,
  formatDuration
};
