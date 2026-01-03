/**
 * Security Utilities
 * Input Sanitization, Encryption, 2FA, IP Whitelisting, and Identity Protection
 */

import crypto from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'bluewud-ots-fallback-key';

// Internal State for singleton features
const state = {
  enabled2FA: new Map(),
  ipWhitelist: new Set(),
  rateLimitMap: new Map(),
  failedAttempts: new Map()
};

/**
 * Escape HTML special characters to prevent XSS
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
 */
export const stripHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '');
};

/**
 * Sanitize user input to prevent XSS (browser-based fallback)
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  if (typeof document === 'undefined') return escapeHtml(String(input));
  const div = document.createElement('div');
  div.innerText = String(input);
  return div.innerHTML;
};

/**
 * Sanitize an object's string properties (recursive)
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? escapeHtml(obj) : obj;
  }
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

// --- VALIDATION HELPERS ---
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidIndianPhone = (phone) => /^[6-9]\d{9}$/.test(phone?.replace(/\D/g, ''));
export const isValidPincode = (pincode) => /^\d{6}$/.test(pincode);
export const isValidGST = (gst) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);

// --- CRYPTO & IDENTITY ---
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export const hashPassword = (password) => {
  if (!password) return null;
  return crypto.SHA256(password).toString();
};

export const encryptData = (data, key = ENCRYPTION_KEY) => {
  try {
    return crypto.AES.encrypt(JSON.stringify(data), key).toString();
  } catch (error) {
    console.error('[Security] Encryption error:', error);
    return null;
  }
};

export const decryptData = (encryptedData, key = ENCRYPTION_KEY) => {
  try {
    const bytes = crypto.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(crypto.enc.Utf8));
  } catch (error) {
    console.error('[Security] Decryption error:', error);
    return null;
  }
};

// --- 2FA & IP WHITELIST ---
export const initiate2FA = async (userId, method = 'email') => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  state.enabled2FA.set(userId, { code, expiry: Date.now() + 300000 });
  console.log(`[Security MOCK] 2FA Code for ${userId} (${method}): ${code}`);
  return { success: true, method };
};

export const verify2FA = (userId, code) => {
  const record = state.enabled2FA.get(userId);
  if (!record || Date.now() > record.expiry) return false;
  if (record.code === code) {
    state.enabled2FA.delete(userId);
    return true;
  }
  return false;
};

export const addIPToWhitelist = (ip) => state.ipWhitelist.add(ip);
export const isIPWhitelisted = (ip) => state.ipWhitelist.size === 0 || state.ipWhitelist.has(ip);

// --- RATE LIMITING ---
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
  const now = Date.now();
  const record = state.rateLimitMap.get(key);
  if (!record || (now - record.firstAttempt > windowMs)) {
    state.rateLimitMap.set(key, { attempts: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  if (record.attempts >= maxAttempts) {
    return { allowed: false, retryAfter: Math.ceil((record.firstAttempt + windowMs - now) / 1000) };
  }
  record.attempts++;
  return { allowed: true, remaining: maxAttempts - record.attempts };
};

export default {
  escapeHtml,
  stripHtml,
  sanitizeInput,
  sanitizeObject,
  isValidEmail,
  isValidIndianPhone,
  isValidPincode,
  isValidGST,
  generateSecureToken,
  hashPassword,
  encryptData,
  decryptData,
  initiate2FA,
  verify2FA,
  addIPToWhitelist,
  isIPWhitelisted,
  checkRateLimit
};
