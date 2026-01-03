/**
 * SecurityServices.js
 * Comprehensive security features for Bluewud OTS
 * Includes 2FA, IP whitelist, rate limiting, encryption, and audit logging
 */

class SecurityServices {
  constructor() {
    this.enabled2FA = new Map();
    this.ipWhitelist = new Set();
    this.rateLimits = new Map();
    this.failedAttempts = new Map();
    this.sessionTokens = new Map();
    this.auditLog = [];
    this.maxFailedAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
    this.rateLimitWindow = 60 * 1000; // 1 minute
    this.rateLimitMax = 100;
  }

  /**
   * Generate and send 2FA code via email/SMS
   */
  async initiateTwo FA(userId, method = 'email') {
    try {
      const code = this._generateOTP();
      const timestamp = Date.now();
      const expiryTime = timestamp + (5 * 60 * 1000); // 5 minutes

      // Store temporarily
      this.enabled2FA.set(userId, {
        code,
        method,
        attempts: 0,
        expiry: expiryTime,
        timestamp
      });

      // Send via specified method
      if (method === 'email') {
        await this._sendEmailOTP(userId, code);
      } else if (method === 'sms') {
        await this._sendSMSOTP(userId, code);
      }

      this._logAudit(userId, '2FA_INITIATED', { method });
      return { success: true, method };
    } catch (error) {
      console.error('2FA initiation failed:', error);
      throw error;
    }
  }

  /**
   * Verify 2FA code
   */
  verify2FA(userId, code) {
    const twoFAData = this.enabled2FA.get(userId);

    if (!twoFAData) {
      this._logAudit(userId, '2FA_VERIFY_FAILED', { reason: 'NO_ACTIVE_2FA' });
      throw new Error('No active 2FA session');
    }

    if (Date.now() > twoFAData.expiry) {
      this.enabled2FA.delete(userId);
      this._logAudit(userId, '2FA_VERIFY_FAILED', { reason: 'EXPIRED' });
      throw new Error('2FA code expired');
    }

    if (twoFAData.attempts >= 3) {
      this.enabled2FA.delete(userId);
      this._logAudit(userId, '2FA_VERIFY_FAILED', { reason: 'MAX_ATTEMPTS' });
      throw new Error('Too many failed attempts');
    }

    if (twoFAData.code !== code) {
      twoFAData.attempts++;
      this._logAudit(userId, '2FA_VERIFY_FAILED', { attempt: twoFAData.attempts });
      throw new Error('Invalid 2FA code');
    }

    // Success
    this.enabled2FA.delete(userId);
    this._logAudit(userId, '2FA_VERIFIED', {});
    return { success: true, verified: true };
  }

  /**
   * Add IP to whitelist
   */
  addIPToWhitelist(ip) {
    this.ipWhitelist.add(ip);
    this._logAudit('ADMIN', 'IP_ADDED_TO_WHITELIST', { ip });
  }

  /**
   * Remove IP from whitelist
   */
  removeIPFromWhitelist(ip) {
    this.ipWhitelist.delete(ip);
    this._logAudit('ADMIN', 'IP_REMOVED_FROM_WHITELIST', { ip });
  }

  /**
   * Check if IP is whitelisted
   */
  isIPWhitelisted(ip) {
    return this.ipWhitelist.has(ip);
  }

  /**
   * Get all whitelisted IPs
   */
  getWhitelistIPs() {
    return Array.from(this.ipWhitelist);
  }

  /**
   * Rate limiting check
   */
  checkRateLimit(userId, ip) {
    const key = `${userId}-${ip}`;
    const now = Date.now();
    
    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, { count: 1, windowStart: now });
      return { allowed: true, remaining: this.rateLimitMax - 1 };
    }

    const limit = this.rateLimits.get(key);
    const windowElapsed = now - limit.windowStart;

    // Reset if window expired
    if (windowElapsed > this.rateLimitWindow) {
      limit.count = 1;
      limit.windowStart = now;
      return { allowed: true, remaining: this.rateLimitMax - 1 };
    }

    // Check if limit exceeded
    if (limit.count >= this.rateLimitMax) {
      this._logAudit(userId, 'RATE_LIMIT_EXCEEDED', { ip });
      return { allowed: false, remaining: 0, retryAfter: this.rateLimitWindow - windowElapsed };
    }

    limit.count++;
    return { allowed: true, remaining: this.rateLimitMax - limit.count };
  }

  /**
   * Track failed login attempts
   */
  recordFailedAttempt(userId, ip) {
    const key = userId;
    const now = Date.now();
    
    if (!this.failedAttempts.has(key)) {
      this.failedAttempts.set(key, { count: 1, firstAttempt: now, lockedUntil: null });
    } else {
      const attempts = this.failedAttempts.get(key);
      attempts.count++;

      if (attempts.count >= this.maxFailedAttempts) {
        attempts.lockedUntil = now + this.lockoutDuration;
        this._logAudit(userId, 'ACCOUNT_LOCKED', { ip, attempts: attempts.count });
      }
    }
  }

  /**
   * Check if account is locked
   */
  isAccountLocked(userId) {
    const attempts = this.failedAttempts.get(userId);
    if (!attempts || !attempts.lockedUntil) return false;
    
    const now = Date.now();
    if (now > attempts.lockedUntil) {
      // Unlock account
      attempts.count = 0;
      attempts.lockedUntil = null;
      return false;
    }

    return true;
  }

  /**
   * Clear failed attempts on successful login
   */
  clearFailedAttempts(userId) {
    this.failedAttempts.delete(userId);
  }

  /**
   * Generate secure session token
   */
  generateSessionToken(userId) {
    const token = this._generateSecureToken();
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    this.sessionTokens.set(token, {
      userId,
      createdAt: Date.now(),
      expiryTime,
      lastActivity: Date.now()
    });

    this._logAudit(userId, 'SESSION_CREATED', { token: token.substring(0, 10) });
    return token;
  }

  /**
   * Validate session token
   */
  validateSessionToken(token) {
    const session = this.sessionTokens.get(token);
    if (!session) return false;

    if (Date.now() > session.expiryTime) {
      this.sessionTokens.delete(token);
      return false;
    }

    session.lastActivity = Date.now();
    return true;
  }

  /**
   * Revoke session token
   */
  revokeSessionToken(token) {
    this.sessionTokens.delete(token);
  }

  /**
   * Generate OTP (One Time Password)
   */
  _generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate secure random token
   */
  _generateSecureToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Send OTP via email
   */
  async _sendEmailOTP(userId, code) {
    // Implementation would send via email service
    console.log(`Email OTP sent to user ${userId}: ${code}`);
  }

  /**
   * Send OTP via SMS
   */
  async _sendSMSOTP(userId, code) {
    // Implementation would send via SMS service
    console.log(`SMS OTP sent to user ${userId}: ${code}`);
  }

  /**
   * Log security audit event
   */
  _logAudit(userId, event, details = {}) {
    this.auditLog.push({
      timestamp: new Date().toISOString(),
      userId,
      event,
      details,
      ipAddress: details.ip || 'unknown'
    });

    // Keep only last 1000 entries
    if (this.auditLog.length > 1000) {
      this.auditLog.shift();
    }
  }

  /**
   * Get audit log
   */
  getAuditLog(userId = null, limit = 100) {
    let logs = this.auditLog;
    if (userId) {
      logs = logs.filter(l => l.userId === userId);
    }
    return logs.slice(-limit).reverse();
  }

  /**
   * Export audit log for compliance
   */
  exportAuditLog() {
    return JSON.stringify(this.auditLog, null, 2);
  }
}

// Export singleton instance
const securityServices = new SecurityServices();
export default securityServices;
