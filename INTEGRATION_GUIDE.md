# Bluewud OTS - Integration & Setup Guide

> **For Developers & Administrators**  
> This guide documents all human-required setup tasks, Zoho integrations, and third-party API configurations needed to make the OTS production-ready.

---

## 📋 Table of Contents

1. [Pre-requisites Checklist](#pre-requisites-checklist)
2. [Zoho Ecosystem Integration](#zoho-ecosystem-integration)
3. [Third-Party API Integrations](#third-party-api-integrations)
4. [Environment Configuration](#environment-configuration)
5. [Deployment Steps](#deployment-steps)
6. [Testing & Validation](#testing--validation)

---

## ✅ Pre-requisites Checklist

### Zoho Accounts Required
| Account | Purpose | URL |
|---------|---------|-----|
| Zoho One Admin | Central admin portal | [one.zoho.com](https://one.zoho.com) |
| Zoho Creator | Legacy OTS forms & data | [creator.zoho.com](https://creator.zoho.com) |
| Zoho CRM | Dealer/Account management | [crm.zoho.com](https://crm.zoho.com) |
| Zoho Catalyst | Cloud functions & hosting | [catalyst.zoho.com](https://catalyst.zoho.com) |
| Zoho Analytics | BI dashboards (optional) | [analytics.zoho.com](https://analytics.zoho.com) |

### Third-Party Accounts Required
| Service | Purpose | Registration URL |
|---------|---------|------------------|
| Amazon Seller Central | SP-API access | [sellercentral.amazon.in](https://sellercentral.amazon.in) |
| Flipkart Seller Hub | Order API | [seller.flipkart.com](https://seller.flipkart.com) |
| Delhivery Partner Portal | Shipping API | [www.delhivery.com/partners](https://www.delhivery.com/partners) |
| BlueDart API | Shipping API | Contact BlueDart sales |
| XpressBees | Shipping API | [www.xpressbees.com](https://www.xpressbees.com) |
| Ecom Express | Shipping API | [ecomexpress.in](https://ecomexpress.in) |

---

## 🔗 Zoho Ecosystem Integration

### Step 1: Zoho Creator → Catalyst Data Sync

**What you need to do manually:**

1. **Open Zoho Creator App**
   - Navigate to your Bluewud OTS Creator application
   - Go to Settings → API → Enable API Access

2. **Get Creator API Credentials**
   ```
   - Organization ID: [Found in Creator Settings → Organization]
   - App Link Name: Bluewud_OTS (or your app's link name)
   - Report Names: Orders, CourierRates, Account, DeliveryAgents
   ```

3. **Create Zoho OAuth Client**
   - Go to [api-console.zoho.com](https://api-console.zoho.com)
   - Click "ADD CLIENT" → "Server-based Applications"
   - Fill in:
     - Client Name: `Bluewud OTS Web App`
     - Homepage URL: `https://your-catalyst-app.zohoplatformapps.com`
     - Redirect URI: `https://your-catalyst-app.zohoplatformapps.com/callback`
   - Note down Client ID and Client Secret

4. **Generate Refresh Token**
   - Use the OAuth flow to generate a refresh token with scopes:
     ```
     ZohoCreator.report.READ
     ZohoCreator.report.CREATE
     ZohoCreator.form.CREATE
     ZohoCRM.modules.accounts.READ
     ZohoCRM.modules.contacts.READ
     ```

5. **Configure Catalyst Function**
   - In Catalyst Console → Functions → Your bridgex function
   - Add these environment variables:
     ```
     ZOHO_CLIENT_ID=<your_client_id>
     ZOHO_CLIENT_SECRET=<your_client_secret>
     ZOHO_REFRESH_TOKEN=<your_refresh_token>
     CREATOR_ORG_ID=<your_org_id>
     CREATOR_APP_LINK=Bluewud_OTS
     ```

---

### Step 2: Zoho CRM Integration

**Purpose:** Sync dealer/account data to OTS

1. **Enable CRM API**
   - Go to CRM → Settings → Developer Space → APIs
   - Note down your CRM Organization ID

2. **Create Custom Connection (optional)**
   - In CRM → Settings → Developer Space → Connections
   - Create connection to Creator if you want two-way sync

3. **Map CRM Fields to OTS**
   | CRM Module | CRM Field | OTS Field |
   |------------|-----------|-----------|
   | Accounts | Account_Name | dealer_name |
   | Accounts | Account_Code | dealer_code |
   | Accounts | Billing_City | city |
   | Accounts | Billing_State | state |
   | Contacts | First_Name + Last_Name | contact_name |
   | Contacts | Phone | phone |

---

### Step 3: Zoho Catalyst Setup

1. **Create Catalyst Project**
   ```bash
   catalyst init
   # Select: Web Client + Advanced I/O Function
   ```

2. **Configure Security Rules**
   - Go to Catalyst Console → Settings → Security Rules
   - Add rule to allow all authenticated requests:
     ```json
     {
       "webapp": {
         "allow": ["*"]
       },
       "functions": {
         "bridgex": {
           "allow": ["*"]
         }
       }
     }
     ```

3. **Deploy Frontend**
   ```bash
   cd ots-webapp
   npm run build
   # Copy dist/* to catalyst/client/
   catalyst deploy
   ```

---

## 🚚 Third-Party API Integrations

### Amazon SP-API Integration

**Human Tasks Required:**

1. **Register as Developer**
   - Go to Seller Central → Apps & Services → Develop Apps
   - Register as a developer (requires approval ~24-48 hours)

2. **Create App**
   - App Type: Private (for your own seller account)
   - IAM ARN: Create in AWS Console
   - Roles: Orders, Fulfillment

3. **Get Credentials**
   - LWA Client ID
   - LWA Client Secret
   - Refresh Token (after OAuth authorization)
   - AWS Access Key & Secret

4. **Add to Environment**
   ```env
   AMAZON_LWA_CLIENT_ID=
   AMAZON_LWA_CLIENT_SECRET=
   AMAZON_REFRESH_TOKEN=
   AMAZON_SELLER_ID=
   AWS_ACCESS_KEY=
   AWS_SECRET_KEY=
   ```

5. **Endpoints Used**
   - `/orders/v0/orders` - Get orders
   - `/orders/v0/orders/{orderId}` - Order details
   - `/shipping/v1/shipments` - Create shipment

---

### Flipkart Seller API

**Human Tasks Required:**

1. **Apply for API Access**
   - Go to Flipkart Seller Hub → Developer
   - Apply for API partnership (requires business verification)

2. **Get API Credentials**
   - Application ID
   - Application Secret

3. **Add to Environment**
   ```env
   FLIPKART_APP_ID=
   FLIPKART_APP_SECRET=
   ```

4. **Endpoints Used**
   - `/orders/filter` - Get orders
   - `/orders/{orderId}` - Order details
   - `/returns/` - Return orders

---

### Delhivery API Integration

**Human Tasks Required:**

1. **Partner Registration**
   - Contact Delhivery sales or register at partner portal
   - Complete KYC verification

2. **Get API Credentials**
   - API Token (provided after onboarding)
   - Client Name

3. **Add to Environment**
   ```env
   DELHIVERY_API_TOKEN=
   DELHIVERY_CLIENT_NAME=
   DELHIVERY_PICKUP_PINCODE=
   ```

4. **Endpoints Used**
   - `/api/cmu/create.json` - Create waybill
   - `/api/p/packing_slip` - Generate label
   - `/api/v1/packages/json/` - Track shipment

---

### BlueDart API Integration

**Human Tasks Required:**

1. **Apply for API Access**
   - Contact BlueDart business development
   - Sign commercial agreement

2. **Get Credentials**
   - License Key
   - Login ID
   - Customer Code

3. **Add to Environment**
   ```env
   BLUEDART_LICENSE_KEY=
   BLUEDART_LOGIN_ID=
   BLUEDART_CUSTOMER_CODE=
   ```

---

## ⚙️ Environment Configuration

### Create `.env` File

Copy `.env.example` to `.env` and fill in all values:

```env
# === ZOHO OAUTH ===
VITE_ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXX
VITE_ZOHO_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_ZOHO_REFRESH_TOKEN=1000.XXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXX

# === ZOHO CREATOR ===
VITE_CREATOR_ORG_ID=XXXXXXXXXX
VITE_CREATOR_APP_LINK=Bluewud_OTS

# === ZOHO CRM ===
VITE_CRM_ORG_ID=XXXXXXXXXX

# === AMAZON SP-API ===
VITE_AMAZON_LWA_CLIENT_ID=
VITE_AMAZON_LWA_CLIENT_SECRET=
VITE_AMAZON_REFRESH_TOKEN=
VITE_AMAZON_SELLER_ID=

# === FLIPKART ===
VITE_FLIPKART_APP_ID=
VITE_FLIPKART_APP_SECRET=

# === DELHIVERY ===
VITE_DELHIVERY_API_TOKEN=
VITE_DELHIVERY_CLIENT_NAME=

# === BLUEDART ===
VITE_BLUEDART_LICENSE_KEY=
VITE_BLUEDART_LOGIN_ID=
VITE_BLUEDART_CUSTOMER_CODE=

# === APP CONFIG ===
VITE_APP_ENVIRONMENT=production
VITE_CATALYST_PROJECT_ID=
```

---

## 🚀 Deployment Steps

### Option A: Zoho Catalyst (Recommended)

1. **Build the React app**
   ```bash
   cd ots-webapp
   npm run build
   ```

2. **Copy to Catalyst client folder**
   ```bash
   cp -r dist/* ../catalyst/client/
   ```

3. **Deploy to Catalyst**
   ```bash
   cd ../catalyst
   catalyst deploy
   ```

4. **Configure Custom Domain (Optional)**
   - Go to Catalyst Console → Hosting → Custom Domain
   - Add CNAME record to your DNS

### Option B: Vercel/Netlify

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

---

## 🧪 Testing & Validation

### Checklist Before Go-Live

| # | Test | Status |
|---|------|--------|
| 1 | Login with all user roles (Admin, Manager, Operator) | ⬜ |
| 2 | Import orders from Amazon CSV | ⬜ |
| 3 | Import orders from Flipkart CSV | ⬜ |
| 4 | Create quick order manually | ⬜ |
| 5 | Bulk update order statuses | ⬜ |
| 6 | Generate invoice PDF | ⬜ |
| 7 | Barcode scanner marks order as shipped | ⬜ |
| 8 | Carrier rate comparison shows correct rates | ⬜ |
| 9 | Zone map displays correct state distribution | ⬜ |
| 10 | Export orders to CSV | ⬜ |
| 11 | Activity log records all actions | ⬜ |
| 12 | Mobile layout works on tablet | ⬜ |
| 13 | Mobile layout works on phone | ⬜ |
| 14 | Notification panel opens and closes | ⬜ |
| 15 | User profile panel shows correct info | ⬜ |
| 16 | Logout clears session | ⬜ |

---

## 📞 Support Contacts

| Integration | Support |
|-------------|---------|
| Zoho Creator/Catalyst | [help.zoho.com](https://help.zoho.com) |
| Amazon SP-API | [developer.amazonservices.in](https://developer.amazonservices.in) |
| Delhivery | support@delhivery.com |
| BlueDart | Your assigned account manager |

---

## 🔄 Data Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Amazon/Flipkart │────▶│    OTS WebApp   │────▶│  Zoho Creator   │
│   Seller Portal  │     │   (React/Vite)  │     │   (Database)    │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Zoho CRM      │     │ Zoho Catalyst   │     │ Carrier APIs    │
│ (Dealers/Accts) │     │ (Cloud Backend) │     │ (Labels/Track)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2024 | Initial guide with all integrations |

---

**Document Maintainer:** Bluewud Engineering Team  
**Last Updated:** December 30, 2024
