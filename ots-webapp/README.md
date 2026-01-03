# Bluewud OTS - Operations & Tracking System (v2.0)

Integrated operations platform for Bluewud India, featuring AI-driven fulfillment, ML demand forecasting, and B2B partner management.

## 🚀 Key Features

### 🧠 Intelligence Layer

- **ML Demand Forecasting**: Realistic demand predictions based on historical trends.
- **AI Career Optimization**: Real-time carrier selection based on cost and performance.
- **Retention AI**: Predictive churn analysis to identify at-risk customers.

### 🏭 Logistics & Supply Chain

- **Multi-Warehouse Fulfillment**: Intelligent pincode-based routing across 5 regional hubs.
- **Universal Importer**: Seamless order mapping from Amazon (SP-API) and Flipkart.
- **Production Tracker**: End-to-end visibility from BOM to QC and GRN.

### 🤝 Strategic B2B Hub

- **Dealer Portal**: Wholesale ordering with tiered pricing and credit limits.
- **Enterprise RBAC**: Strict permission matrix (Admin, Manager, Dealer, Operator).

## 🛠️ Tech Stack

- **Frontend**: React.js with Glassmorphism UI.
- **State**: Custom Context Providers with Offline-First Persistence (IndexedDB).
- **Communication**: WhatsApp Business API Integration + Push Notifications.
- **Deployment**: Local build scripts + GitHub Actions CI/CD.

## 📦 Setup & Development

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.production` to `.env` and fill in API secrets.

3. **Start Development**:

   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

_Bluewud OTS - Built for Precision._
