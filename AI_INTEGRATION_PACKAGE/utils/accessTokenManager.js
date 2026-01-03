/**
 * Access Token Manager Utility
 * Handles secure storage and management of OAuth tokens
 * 
 * Features:
 * - Secure token storage (localStorage/sessionStorage)
 * - Token encryption/decryption
 * - Token expiry tracking
 * - Automatic token refresh coordination
 */

const TOKEN_STORAGE_KEY = 'bluewud_oauth_tokens';
const TOKEN_ENCRYPTION_KEY = 'bluewud_token_secret';

class AccessTokenManager {
  constructor(options = {}) {
    this.useSecureStorage = options.useSecureStorage !== false;
    this.encryptTokens = options.encryptTokens !== false;
    this.storageType = options.storageType || 'localStorage'; // 'localStorage' or 'sessionStorage'
    this.storage = window[this.storageType];
  }

  /**
   * Saves access token and metadata
   * @param {object} tokenData - Token data including access_token, refresh_token, expires_in
   * @param {string} provider - Token provider (e.g., 'zoho', 'google')
   */
  saveToken(tokenData, provider = 'zoho') {
    try {
      const tokenEntry = {
        provider,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        acquiredAt: Date.now(),
        expiresAt: Date.now() + (tokenData.expires_in * 1000)
      };

      let storedData = this.getAllTokens();
      storedData[provider] = tokenEntry;

      const serialized = JSON.stringify(storedData);
      const dataToStore = this.encryptTokens ? this.encrypt(serialized) : serialized;

      this.storage.setItem(TOKEN_STORAGE_KEY, dataToStore);
      console.log(`Token saved for provider: ${provider}`);
      return true;
    } catch (error) {
      console.error('Token save failed:', error);
      return false;
    }
  }

  /**
   * Gets stored access token
   * @param {string} provider - Token provider
   * @returns {string|null} Access token or null
   */
  getAccessToken(provider = 'zoho') {
    try {
      const tokenData = this.getTokenData(provider);
      return tokenData ? tokenData.accessToken : null;
    } catch (error) {
      console.error('Get access token failed:', error);
      return null;
    }
  }

  /**
   * Gets stored refresh token
   * @param {string} provider - Token provider
   * @returns {string|null} Refresh token or null
   */
  getRefreshToken(provider = 'zoho') {
    try {
      const tokenData = this.getTokenData(provider);
      return tokenData ? tokenData.refreshToken : null;
    } catch (error) {
      console.error('Get refresh token failed:', error);
      return null;
    }
  }

  /**
   * Gets complete token data
   * @param {string} provider - Token provider
   * @returns {object|null} Token data or null
   */
  getTokenData(provider = 'zoho') {
    try {
      const allTokens = this.getAllTokens();
      return allTokens[provider] || null;
    } catch (error) {
      console.error('Get token data failed:', error);
      return null;
    }
  }

  /**
   * Gets all stored tokens
   * @returns {object} All tokens indexed by provider
   */
  getAllTokens() {
    try {
      const stored = this.storage.getItem(TOKEN_STORAGE_KEY);
      if (!stored) return {};

      const decrypted = this.encryptTokens ? this.decrypt(stored) : stored;
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Get all tokens failed:', error);
      return {};
    }
  }

  /**
   * Checks if token is expired
   * @param {string} provider - Token provider
   * @returns {boolean} True if expired
   */
  isTokenExpired(provider = 'zoho') {
    const tokenData = this.getTokenData(provider);
    if (!tokenData) return true;
    return Date.now() >= tokenData.expiresAt;
  }

  /**
   * Gets time until token expiry
   * @param {string} provider - Token provider
   * @returns {number} Milliseconds until expiry, or -1 if expired
   */
  getTimeUntilExpiry(provider = 'zoho') {
    const tokenData = this.getTokenData(provider);
    if (!tokenData) return -1;
    return tokenData.expiresAt - Date.now();
  }

  /**
   * Gets token status
   * @param {string} provider - Token provider
   * @returns {object} Token status info
   */
  getTokenStatus(provider = 'zoho') {
    const tokenData = this.getTokenData(provider);
    if (!tokenData) {
      return {
        exists: false,
        isExpired: true
      };
    }

    const now = Date.now();
    const isExpired = now >= tokenData.expiresAt;
    const expiresIn = tokenData.expiresAt - now;

    return {
      exists: true,
      isExpired,
      provider,
      acquiredAt: new Date(tokenData.acquiredAt).toISOString(),
      expiresAt: new Date(tokenData.expiresAt).toISOString(),
      expiresInMs: expiresIn,
      expiresInSeconds: Math.floor(expiresIn / 1000),
      expiresInMinutes: Math.floor(expiresIn / 60000),
      hasRefreshToken: !!tokenData.refreshToken
    };
  }

  /**
   * Removes token for provider
   * @param {string} provider - Token provider
   * @returns {boolean} Success status
   */
  removeToken(provider = 'zoho') {
    try {
      const allTokens = this.getAllTokens();
      delete allTokens[provider];
      this.storage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(allTokens));
      console.log(`Token removed for provider: ${provider}`);
      return true;
    } catch (error) {
      console.error('Token removal failed:', error);
      return false;
    }
  }

  /**
   * Clears all tokens
   * @returns {boolean} Success status
   */
  clearAllTokens() {
    try {
      this.storage.removeItem(TOKEN_STORAGE_KEY);
      console.log('All tokens cleared');
      return true;
    } catch (error) {
      console.error('Clear all tokens failed:', error);
      return false;
    }
  }

  /**
   * Encrypts token data (simple base64, use proper encryption in production)
   * @param {string} data - Data to encrypt
   * @returns {string} Encrypted data
   */
  encrypt(data) {
    if (!this.encryptTokens) return data;
    try {
      return btoa(JSON.stringify({ data, timestamp: Date.now() }));
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  /**
   * Decrypts token data
   * @param {string} encryptedData - Encrypted data
   * @returns {string} Decrypted data
   */
  decrypt(encryptedData) {
    if (!this.encryptTokens) return encryptedData;
    try {
      const decrypted = JSON.parse(atob(encryptedData));
      return decrypted.data;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  /**
   * Gets storage info
   * @returns {object} Storage details
   */
  getStorageInfo() {
    try {
      const stored = this.storage.getItem(TOKEN_STORAGE_KEY);
      const allTokens = this.getAllTokens();
      const providers = Object.keys(allTokens);

      return {
        storageType: this.storageType,
        providers,
        tokenCount: providers.length,
        storageSize: stored ? stored.length : 0,
        tokens: providers.reduce((acc, provider) => {
          acc[provider] = this.getTokenStatus(provider);
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Get storage info failed:', error);
      return null;
    }
  }
}

// Export utility functions
export const saveToken = (tokenData, provider = 'zoho') => {
  const manager = new AccessTokenManager();
  return manager.saveToken(tokenData, provider);
};

export const getAccessToken = (provider = 'zoho') => {
  const manager = new AccessTokenManager();
  return manager.getAccessToken(provider);
};

export const getRefreshToken = (provider = 'zoho') => {
  const manager = new AccessTokenManager();
  return manager.getRefreshToken(provider);
};

export const getTokenStatus = (provider = 'zoho') => {
  const manager = new AccessTokenManager();
  return manager.getTokenStatus(provider);
};

export const isTokenExpired = (provider = 'zoho') => {
  const manager = new AccessTokenManager();
  return manager.isTokenExpired(provider);
};

export const removeToken = (provider = 'zoho') => {
  const manager = new AccessTokenManager();
  return manager.removeToken(provider);
};

export const clearAllTokens = () => {
  const manager = new AccessTokenManager();
  return manager.clearAllTokens();
};

export default AccessTokenManager;
