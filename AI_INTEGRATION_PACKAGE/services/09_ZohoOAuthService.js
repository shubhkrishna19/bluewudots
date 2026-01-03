/**
 * Zoho OAuth 2.0 Service
 * Manages authentication and token refresh for Zoho API integration
 * 
 * Features:
 * - OAuth 2.0 flow implementation
 * - Automatic token refresh
 * - Secure token storage
 * - Error handling & retry logic
 * - Multi-scope support
 */

class ZohoOAuthService {
  constructor(config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.refreshToken = config.refreshToken;
    this.dataCenter = config.dataCenter || 'com';
    this.organizationId = config.organizationId;
    this.appLinkName = config.appLinkName;
    
    // Token management
    this.accessToken = null;
    this.tokenExpiry = null;
    this.tokenRefreshBuffer = 5 * 60 * 1000; // Refresh 5 mins before expiry
    
    // API endpoints
    this.accountsUrl = `https://accounts.zoho.${this.dataCenter}/oauth/v2/token`;
    this.apiBaseUrl = `https://www.zohoapis.${this.dataCenter}`;
    this.creatorApiUrl = `${this.apiBaseUrl}/creator/v2`;
    this.crmApiUrl = `${this.apiBaseUrl}/crm/v7`;
    this.catalystApiUrl = `${this.apiBaseUrl}/catalyst`;
    
    // OAuth scopes
    this.scopes = [
      'ZohoCRM.modules.all',
      'ZohoCRM.settings.all',
      'ZohoCatalyst.functions.all',
      'ZohoCatalyst.projects.READ',
      'ZohoCreator.report.ALL',
      'ZohoCreator.application.ALL'
    ];
  }

  /**
   * Generates authorization URL for OAuth flow
   * @param {string} redirectUri - Redirect URI after authorization
   * @returns {string} Authorization URL
   */
  generateAuthorizationUrl(redirectUri) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      scope: this.scopes.join(','),
      redirect_uri: redirectUri,
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.zoho.${this.dataCenter}/oauth/v2/auth?${params.toString()}`;
  }

  /**
   * Exchanges authorization code for tokens
   * @param {string} authCode - Authorization code from OAuth flow
   * @param {string} redirectUri - Redirect URI used in auth request
   * @returns {Promise<object>} Token response
   */
  async exchangeCodeForTokens(authCode, redirectUri) {
    try {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: authCode,
        redirect_uri: redirectUri
      });

      const response = await fetch(this.accountsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Token exchange failed: ${error.error_description}`);
      }

      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token, data.expires_in);
      return data;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  /**
   * Gets valid access token (refreshes if needed)
   * @returns {Promise<string>} Valid access token
   */
  async getAccessToken() {
    // Check if token needs refresh
    if (this.shouldRefreshToken()) {
      await this.refreshAccessToken();
    }

    if (!this.accessToken) {
      throw new Error('Access token not available. Please authenticate first.');
    }

    return this.accessToken;
  }

  /**
   * Checks if token should be refreshed
   * @returns {boolean} True if refresh needed
   */
  shouldRefreshToken() {
    if (!this.tokenExpiry || !this.accessToken) return true;
    return Date.now() >= (this.tokenExpiry - this.tokenRefreshBuffer);
  }

  /**
   * Refreshes access token using refresh token
   * @returns {Promise<object>} New token response
   */
  async refreshAccessToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('Refresh token not available. Re-authenticate required.');
      }

      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken
      });

      const response = await fetch(this.accountsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Token refresh failed: ${error.error_description}`);
      }

      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token, data.expires_in);
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Sets tokens and calculates expiry
   * @param {string} accessToken - Access token
   * @param {string} refreshToken - Refresh token
   * @param {number} expiresIn - Expiry time in seconds
   */
  setTokens(accessToken, refreshToken, expiresIn) {
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
    console.log('Tokens updated, expiry:', new Date(this.tokenExpiry).toISOString());
  }

  /**
   * Makes authenticated API request
   * @param {string} endpoint - API endpoint (relative to base URL)
   * @param {object} options - Fetch options
   * @returns {Promise<object>} API response
   */
  async apiRequest(endpoint, options = {}) {
    try {
      const accessToken = await this.getAccessToken();
      const url = endpoint.startsWith('http') ? endpoint : `${this.apiBaseUrl}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (response.status === 401) {
        // Token likely expired, refresh and retry
        await this.refreshAccessToken();
        return this.apiRequest(endpoint, options);
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API request failed: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * Gets list of Creator reports
   * @returns {Promise<array>} Reports list
   */
  async getCreatorReports() {
    return this.apiRequest(`/creator/v2/${this.organizationId}/reports`);
  }

  /**
   * Gets list of Creator forms
   * @returns {Promise<array>} Forms list
   */
  async getCreatorForms() {
    return this.apiRequest(`/creator/v2/${this.organizationId}/forms`);
  }

  /**
   * Adds records to Creator form
   * @param {string} formId - Form ID
   * @param {array} records - Records to add
   * @returns {Promise<object>} Response
   */
  async addCreatorRecords(formId, records) {
    return this.apiRequest(`/creator/v2/${this.organizationId}/${formId}`, {
      method: 'POST',
      body: JSON.stringify({ data: records })
    });
  }

  /**
   * Gets CRM modules
   * @returns {Promise<array>} Modules list
   */
  async getCRMModules() {
    return this.apiRequest('/crm/v7/settings/modules');
  }

  /**
   * Gets records from CRM module
   * @param {string} moduleName - Module name (e.g., 'Contacts', 'Deals')
   * @param {object} params - Query parameters
   * @returns {Promise<array>} Records
   */
  async getCRMRecords(moduleName, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.apiRequest(`/crm/v7/${moduleName}?${queryParams}`);
  }

  /**
   * Creates record in CRM module
   * @param {string} moduleName - Module name
   * @param {object} data - Record data
   * @returns {Promise<object>} Created record
   */
  async createCRMRecord(moduleName, data) {
    return this.apiRequest(`/crm/v7/${moduleName}`, {
      method: 'POST',
      body: JSON.stringify({ data: [data] })
    });
  }

  /**
   * Updates record in CRM module
   * @param {string} moduleName - Module name
   * @param {string} recordId - Record ID
   * @param {object} data - Updated data
   * @returns {Promise<object>} Updated record
   */
  async updateCRMRecord(moduleName, recordId, data) {
    return this.apiRequest(`/crm/v7/${moduleName}/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [data] })
    });
  }

  /**
   * Executes Catalyst function
   * @param {string} functionName - Function name
   * @param {object} payload - Function payload
   * @returns {Promise<object>} Function response
   */
  async executeCatalystFunction(functionName, payload) {
    return this.apiRequest(
      `/catalyst/v2/functions/execute/${functionName}`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
  }

  /**
   * Clears stored tokens
   */
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    console.log('Tokens cleared');
  }

  /**
   * Gets current token status
   * @returns {object} Token status info
   */
  getTokenStatus() {
    return {
      hasAccessToken: !!this.accessToken,
      hasRefreshToken: !!this.refreshToken,
      expiresAt: this.tokenExpiry ? new Date(this.tokenExpiry).toISOString() : null,
      expiresIn: this.tokenExpiry ? Math.floor((this.tokenExpiry - Date.now()) / 1000) : null,
      needsRefresh: this.shouldRefreshToken()
    };
  }
}

// Export as singleton
let oauthInstance = null;

export const initZohoOAuthService = (config) => {
  oauthInstance = new ZohoOAuthService(config);
  return oauthInstance;
};

export const getZohoOAuthService = () => {
  if (!oauthInstance) {
    throw new Error('Zoho OAuth Service not initialized. Call initZohoOAuthService first.');
  }
  return oauthInstance;
};

// Usage Examples:
// ============
// 1. Initialize with environment config
// import { initZohoOAuthService } from './services/09_ZohoOAuthService';
// const oauth = initZohoOAuthService({
//   clientId: import.meta.env.VITE_ZOHO_CLIENT_ID,
//   clientSecret: import.meta.env.VITE_ZOHO_CLIENT_SECRET,
//   refreshToken: import.meta.env.VITE_ZOHO_REFRESH_TOKEN,
//   dataCenter: import.meta.env.VITE_ZOHO_DATA_CENTER,
//   organizationId: import.meta.env.VITE_ZOHO_ORG_ID,
//   appLinkName: import.meta.env.VITE_ZOHO_APP_LINK_NAME
// });

// 2. Get authorization URL
// const authUrl = oauth.generateAuthorizationUrl('http://localhost:3000/callback');
// window.location.href = authUrl;

// 3. Exchange code for tokens (in callback handler)
// await oauth.exchangeCodeForTokens(authCode, 'http://localhost:3000/callback');

// 4. Make authenticated API requests
// const records = await oauth.getCRMRecords('Contacts');
// const reports = await oauth.getCreatorReports();

export default ZohoOAuthService;
