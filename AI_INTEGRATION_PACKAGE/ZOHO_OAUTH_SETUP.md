# Zoho OAuth 2.0 Setup Guide for Bluewud OTS

## Overview

This guide walks you through setting up OAuth 2.0 authentication for Zoho integration with Bluewud OTS. This enables secure API access to your Zoho Creator and CRM data.

## Prerequisites

- Active Zoho account with admin access
- Zoho Creator application set up
- Zoho CRM setup (optional but recommended)
- Development/Staging environment ready

## Step 1: Register OAuth Client at api-console.zoho.com

### 1.1 Navigate to Zoho API Console

1. Go to https://api-console.zoho.com/
2. Sign in with your Zoho account
3. Select the appropriate data center:
   - **com** - United States (US)
   - **eu** - Europe (EU)
   - **in** - India (IN)
   - **au** - Australia (AU)
   - **cn** - China (CN)

### 1.2 Create Self Client

For development/testing:

1. Click **Clients** → **Create Client**
2. Choose **Self Client**
3. Enter:
   - **Client Name**: Bluewud OTS
   - **Description**: Order Tracking System Integration
4. Click **Create**

### 1.3 Get Your Credentials

You'll receive:
- **Client ID**
- **Client Secret**

⚠️ **IMPORTANT**: Save these securely. You'll need them next.

## Step 2: Generate Refresh Token

### 2.1 Use Token Generation Script

Add the following code to your project (use in development only):

```javascript
// getZohoToken.js - Development only!
const generateAuthURL = (clientId, redirectUri) => {
  const scope = [
    'ZohoCRM.modules.all',
    'ZohoCRM.settings.all',
    'ZohoCatalyst.functions.all',
    'ZohoCatalyst.projects.READ',
    'ZohoCreator.report.ALL',
    'ZohoCreator.application.ALL',
  ].join(',');
  
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    scope: scope,
    redirect_uri: redirectUri,
    access_type: 'offline',
  });
  
  return `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`;
};

// Usage:
const authUrl = generateAuthURL(
  'YOUR_CLIENT_ID',
  'http://localhost:3000/callback'
);
console.log('Open this URL in browser:', authUrl);
```

### 2.2 Get Authorization Code

1. Create a redirect URI handler (e.g., callback.html)
2. Open the generated auth URL in your browser
3. Log in and authorize the application
4. You'll be redirected with an authorization **code** in the URL

### 2.3 Exchange Code for Tokens

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=http://localhost:3000/callback"
```

Response:
```json
{
  "access_token": "your_access_token",
  "refresh_token": "your_refresh_token",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Save the `refresh_token` - you'll need this!**

## Step 3: Update .env Configuration

Add to your `.env.local` file:

```env
VITE_ZOHO_CLIENT_ID=YOUR_CLIENT_ID
VITE_ZOHO_CLIENT_SECRET=YOUR_CLIENT_SECRET
VITE_ZOHO_REFRESH_TOKEN=YOUR_REFRESH_TOKEN
VITE_ZOHO_DATA_CENTER=com
VITE_ZOHO_ORG_ID=YOUR_ORGANIZATION_ID
VITE_ZOHO_APP_LINK_NAME=your_app_link_name
```

### Finding Your Organization ID & App Link Name:

1. Go to **Zoho Creator** → **Settings** → **Organization**
2. Copy the **Organization ID**
3. Go to your application settings
4. Copy the **Link Name** (usually lowercase with underscores)

## Step 4: Set Required OAuth Scopes

Ensure your OAuth client has these scopes:

```
ZohoCRM.modules.all
ZohoCRM.settings.all
ZohoCatalyst.functions.all
ZohoCatalyst.projects.READ
ZohoCreator.report.ALL
ZohoCreator.application.ALL
```

### To add scopes:

1. Go to api-console.zoho.com
2. Click on your client
3. Add scopes under **Scope**
4. Save changes

## Step 5: Enable Creator API Access

1. Go to **Zoho Creator** → **Settings** → **API Access**
2. Enable **Allow API Access**
3. Save

## Step 6: Test Connection

Create a test script:

```javascript
// testZohoConnection.js
async function testZohoConnection() {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(
      'https://www.zohoapis.com/creator/v2/YOUR_ORG_ID/reports',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const data = await response.json();
    console.log('✅ Connection successful!', data);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}
```

## Troubleshooting

### "Invalid client_id"
- Verify CLIENT_ID is correct
- Check data center setting matches your account region

### "Refresh token expired"
- Refresh tokens expire after 6 months of inactivity
- Regenerate using the authorization flow

### "Insufficient Privileges"
- Ensure scopes include required permissions
- Check user has admin access to Creator app

### "CORS Error"
- API calls must be from server, not client-side
- Use backend proxy for API requests

## Security Best Practices

1. **Never commit secrets** - Use `.env.local` (in .gitignore)
2. **Rotate tokens** - Regenerate refresh tokens quarterly
3. **Use HTTPS** - Always in production
4. **Limit scopes** - Request only necessary permissions
5. **Secure storage** - Encrypt tokens at rest

## Production Deployment

For production:

1. Create a **production OAuth client** (not self client)
2. Configure proper **redirect URIs**
3. Store secrets in **environment variables** (not code)
4. Enable **2FA** on Zoho account
5. Use **API rate limiting**

## Next Steps

1. ✅ Complete this setup
2. Test API connection with included test script
3. Integrate with your application
4. Set up error handling and token refresh logic
5. Deploy to staging for testing

## Resources

- [Zoho API Console](https://api-console.zoho.com/)
- [Zoho OAuth Documentation](https://www.zoho.com/creator/help/api/oauth-overview.html)
- [Zoho Creator API Docs](https://www.zoho.com/creator/help/zc-api/zcapi-get-all-reports.html)
- [Zoho CRM API Docs](https://www.zoho.com/crm/developer/docs/api/)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Zoho API logs at api-console.zoho.com
3. Enable debug logging: `VITE_APP_DEBUG=true`
4. Contact Zoho support with your Organization ID
