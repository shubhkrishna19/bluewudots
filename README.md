# Bluewud OTS - Unified Hub

Industrial-grade logistics and order tracking system for Bluewud India. Built with React (Vite) and Zoho Catalyst.

## 🛠️ Global Setup Guide
This project is designed to be portable and secure. Follow these steps to recreate or continue development from any machine.

### 1. Prerequisites
- **Node.js** (v18+)
- **Git**
- **Zoho Catalyst CLI**: `npm install -g zcatalyst-cli`

### 2. Fork & Clone
```bash
git clone https://github.com/shubhkrishna19/bluewudots.git
cd bluewudots/ots-webapp
npm install
```

### 3. Security & Credentials
This project uses environment variables to protect sensitive Zoho Catalyst credentials. **Never commit your `.env` file.**

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Fill in your credentials from the Zoho Catalyst console:
   - `VITE_CATALYST_PROJECT_ID`
   - `VITE_CATALYST_CLIENT_ID`

### 4. Running Locally
```bash
npm run dev
```

## 🧠 Command Center
All architectural decisions and logic modules are documented in the [Command Center](.gemini/antigravity/brain/07ac5797-ef5d-46d8-9e26-2bf615bd6963/implementation_plan.md). Refer to this file for multi-agent coordination.

## 🇮🇳 Pan-India Logistics
- Supported Carriers: BlueDart, Delhivery, Ecom Express, XpressBees.
- Compliance: Full GST orchestration (IGST/CGST/SGST).

---
© 2025 Bluewud India. Confidential and Proprietary.
