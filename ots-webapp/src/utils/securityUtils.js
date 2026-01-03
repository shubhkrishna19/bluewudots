/**
 * Input Sanitization Utilities
 * 
 * Security layer for XSS prevention and input validation.
 */

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

export default {
    escapeHtml,
    stripHtml,
    sanitizeObject,
    isValidEmail,
    isValidIndianPhone,
    isValidPincode,
    isValidGST,
    sanitizeFilename,
    checkRateLimit
};
