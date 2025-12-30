# Human Tasks Checklist - Bluewud OTS

> **Everything YOU need to do to make this app production-ready.**  
> These are tasks that require human intervention, credentials, or business decisions.

---

## 🔴 CRITICAL (Before Launch)

### 1. Zoho OAuth Setup
- [ ] Create OAuth client at [api-console.zoho.com](https://api-console.zoho.com)
- [ ] Generate refresh token with required scopes
- [ ] Add credentials to `.env` file
- [ ] Test API connection from Catalyst function

### 2. Zoho Creator API Access
- [ ] Enable API access in Creator app settings
- [ ] Note down Organization ID and App Link Name
- [ ] Create/verify these reports exist:
  - [ ] Orders
  - [ ] CourierRates
  - [ ] Account
  - [ ] DeliveryAgents
  - [ ] SKU_Master

### 3. Production Deployment
- [ ] Buy/configure custom domain (optional)
- [ ] Build React app (`npm run build`)
- [ ] Deploy to Zoho Catalyst
- [ ] Test all pages load correctly

---

## 🟡 HIGH PRIORITY (Week 1)

### 4. Amazon SP-API
- [ ] Register as developer on Seller Central
- [ ] Wait for approval (~24-48 hours)
- [ ] Create private app
- [ ] Set up AWS IAM role
- [ ] Generate LWA credentials
- [ ] Complete OAuth authorization flow
- [ ] Add credentials to `.env`

### 5. Flipkart Seller API
- [ ] Apply for API partnership
- [ ] Complete business verification
- [ ] Get Application ID and Secret
- [ ] Add credentials to `.env`

### 6. Delhivery Partnership
- [ ] Contact Delhivery sales team
- [ ] Sign commercial agreement
- [ ] Complete KYC process
- [ ] Get API token
- [ ] Add credentials to `.env`

### 7. BlueDart Partnership
- [ ] Contact BlueDart business development
- [ ] Sign commercial agreement
- [ ] Get License Key and Login ID
- [ ] Add credentials to `.env`

---

## 🟢 MEDIUM PRIORITY (Week 2-3)

### 8. Zoho CRM Integration
- [ ] Verify CRM Accounts module has dealer data
- [ ] Map CRM fields to OTS fields
- [ ] Test dealer sync in OTS

### 9. Real User Accounts
- [ ] Create production user accounts
- [ ] Assign correct roles
- [ ] Update mock users in AuthContext with real credentials
- [ ] Set up SSO if needed (Zoho One)

### 10. Data Migration
- [ ] Export existing orders from Creator
- [ ] Import into OTS (if needed)
- [ ] Verify data integrity

### 11. WhatsApp Business API (Optional)
- [ ] Apply for WhatsApp Business API
- [ ] Get approved (can take 1-2 weeks)
- [ ] Set up message templates
- [ ] Integrate with OTS notifications

---

## ⚪ LOW PRIORITY (Future)

### 12. XpressBees Integration
- [ ] Partner registration
- [ ] API credentials
- [ ] Add credentials to `.env`

### 13. Ecom Express Integration
- [ ] Partner registration
- [ ] API credentials
- [ ] Add credentials to `.env`

### 14. Analytics Dashboard
- [ ] Connect Zoho Analytics
- [ ] Create BI dashboards
- [ ] Embed in OTS

### 15. Advanced Security
- [ ] Enable 2FA for admin accounts
- [ ] Set up IP whitelisting
- [ ] Configure session timeout

---

## 📋 Zoho Creator Forms to Create/Verify

| Form Name | Purpose | Status |
|-----------|---------|--------|
| Orders | Main order storage | ⬜ Verify |
| Order_Items | Line items per order | ⬜ Create |
| CourierRates | Carrier rate cards | ⬜ Verify |
| Account | Dealer/Customer data | ⬜ Verify |
| DeliveryAgents | Carrier master | ⬜ Verify |
| SKU_Master | Product catalog | ⬜ Create |
| Invoices | Invoice records | ⬜ Create |
| COD_Remittances | COD tracking | ⬜ Create |
| Inventory | Warehouse stock | ⬜ Create |
| Activity_Log | Audit trail | ⬜ Create |

---

## 🔑 Credentials You Need to Obtain

| Credential | Where to Get | Store In |
|------------|--------------|----------|
| Zoho Client ID | [api-console.zoho.com](https://api-console.zoho.com) | `.env` |
| Zoho Client Secret | [api-console.zoho.com](https://api-console.zoho.com) | `.env` |
| Zoho Refresh Token | OAuth flow | `.env` |
| Creator Org ID | Creator Settings | `.env` |
| Amazon LWA Client ID | Seller Central | `.env` |
| Amazon LWA Secret | Seller Central | `.env` |
| Amazon Refresh Token | OAuth flow | `.env` |
| Flipkart App ID | Seller Hub | `.env` |
| Flipkart App Secret | Seller Hub | `.env` |
| Delhivery API Token | Partner portal | `.env` |
| BlueDart License Key | Account manager | `.env` |
| BlueDart Login ID | Account manager | `.env` |

---

## 📅 Estimated Timeline

| Week | Tasks |
|------|-------|
| **Week 1** | Zoho OAuth, Creator API, Deploy to Catalyst |
| **Week 2** | Amazon SP-API, Flipkart API |
| **Week 3** | Carrier APIs (Delhivery, BlueDart) |
| **Week 4** | Testing, Bug fixes, Go-Live |

---

## ❓ FAQs

### Q: What if I don't have Amazon/Flipkart seller account?
A: The CSV import will still work manually. API integration is optional but recommended for automation.

### Q: Can I use this without Zoho Creator?
A: No, Creator is the database backend. You can migrate to a different DB later but initially Creator is required.

### Q: How long does Amazon SP-API approval take?
A: Usually 24-48 hours, but can take up to a week for new sellers.

### Q: Is Catalyst hosting free?
A: Yes, Catalyst has a generous free tier. Paid plans available for higher usage.

---

## 📞 Need Help?

- **Zoho Issues:** [help.zoho.com](https://help.zoho.com)
- **Amazon SP-API:** Amazon Developer Forums
- **Carrier APIs:** Contact your account manager

---

**Last Updated:** December 30, 2024
