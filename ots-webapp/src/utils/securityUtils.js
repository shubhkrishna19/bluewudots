/**
 * Security Utilities
 * Input Sanitization, Encryption, and Security-related helpers
 */

import crypto from 'crypto-js';

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str 
 * @returns {string}
 */
export const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  return str.replace(/[&<>"'`=/]/g, char => htmlEntities[char]);
};

/**
 * Strip HTML tags from a string
 * @param {string} str 
 * @returns {string}
 */
export const stripHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '');
};

/**
 * Sanitize an object's string properties (recursive)
 * @param {object} obj 
 * @returns {object}
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? escapeHtml(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Indian phone number
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidIndianPhone = (phone) => {
  const cleanPhone = phone?.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleanPhone);
};

/**
 * Validate Indian pincode
 * @param {string} pincode 
 * @returns {boolean}
 */
export const isValidPincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};

/**
 * Validate GST number format
 * @param {string} gst 
 * @returns {boolean}
 */
export const isValidGST = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

/**
 * Sanitize file name (remove path traversal attempts)
 * @param {string} filename 
 * @returns {string}
 */
export const sanitizeFilename = (filename) => {
  if (typeof filename !== 'string') return 'file';
  return filename
    .replace(/\.\./g, '')
    .replace(/[\/\\:*?"<>|]/g, '_')
    .slice(0, 255);
};

/**
 * Rate limiter helper (for form submissions)
 */
const rateLimitMap = new Map();

export const checkRateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { attempts: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (now - record.firstAttempt > windowMs) {
    rateLimitMap.set(key, { attempts: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.attempts >= maxAttempts) {
    const retryAfter = Math.ceil((record.firstAttempt + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.attempts++;
  return { allowed: true, remaining: maxAttempts - record.attempts };
};

/**
 * Generate a secure random token
 */
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Hash password using SHA256
 */
export const hashPassword = (password) => {
  if (!password) return null;
  return crypto.SHA256(password).toString();
};

/**
 * Verify password against hash
 */
export const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

/**
 * Encrypt sensitive data
 */
export const encryptData = (data, key = process.env.VITE_ENCRYPTION_KEY) => {
  if (!key) throw new Error('Encryption key not provided');
  try {
    return crypto.AES.encrypt(JSON.stringify(data), key).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

/**
 * Decrypt sensitive data
 */
export const decryptData = (encryptedData, key = process.env.VITE_ENCRYPTION_KEY) => {
  if (!key) throw new Error('Encryption key not provided');
  try {
    const decrypted = crypto.AES.decrypt(encryptedData, key).toString(crypto.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

/**
 * Generate TOTP secret for 2FA
 */
export const generateTOTPSecret = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return secret;
};

/**
 * Generate OTP for email/SMS verification (6 digits)
 */
export const generateOTP = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Hash sensitive identifiers (like API keys) for logging
 */
export const hashIdentifier = (identifier) => {
  if (!identifier) return null;
  return crypto.SHA256(identifier).toString().substring(0, 16);
};

/**
 * Generate CSRF token
 */
export const generateCSRFToken = () => {
  return generateSecureToken(64);
};

/**
 * Validate CSRF token
 */
export const validateCSRFToken = (token, storedToken) => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  if (typeof document === 'undefined') return escapeHtml(String(input));
  const div = document.createElement('div');
  div.textContent = String(input);
  return div.innerHTML;
};

/**
 * Check if URL is safe and internal
 */
export const isSafeUrl = (url) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin === window.location.origin;
  } catch {
    return false;
  }
};

/**
 * Generate HTTP-only cookie string
 */
export const createSecureCookie = (name, value, options = {}) => {
  const {
    maxAge = 86400, // 24 hours
    path = '/',
    secure = true,
    sameSite = 'Strict',
    httpOnly = true
  } = options;

  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  cookieStr += `; Max-Age=${maxAge}`;
  cookieStr += `; Path=${path}`;
  if (secure) cookieStr += '; Secure';
  if (httpOnly) cookieStr += '; HttpOnly';
  if (sameSite) cookieStr += `; SameSite=${sameSite}`;

  return cookieStr;
};

/**
 * Validate JWT token structure (basic)
 */
export const isValidJWTStructure = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

/**
 * Extract JWT payload (without verification)
 */
export const extractJWTPayload = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('JWT payload extraction error:', error);
    return null;
  }
};

/**
 * Check if JWT is expired
 */
export const isJWTExpired = (token) => {
  const payload = extractJWTPayload(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

/**
 * Generate rate limit key
 */
export const generateRateLimitKey = (identifier, action) => {
  return `rl_${hashIdentifier(identifier)}_${action}`;
};

export default {
  escapeHtml,
  stripHtml,
  sanitizeObject,
  isValidEmail,
  isValidIndianPhone,
  isValidPincode,
  isValidGST,
  sanitizeFilename,
  checkRateLimit,
  generateSecureToken,
  hashPassword,
  verifyPassword,
  encryptData,
  decryptData,
  generateTOTPSecret,
  generateOTP,
  hashIdentifier,
  generateCSRFToken,
  validateCSRFToken,
  sanitizeInput,
  isSafeUrl,
  createSecureCookie,
  isValidJWTStructure,
  extractJWTPayload,
  isJWTExpired,
  generateRateLimitKey
};
