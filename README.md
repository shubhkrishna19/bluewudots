# Bluewud OTS - Order Tracking System

**Industrial-Grade Logistics & Order Management for Pan-India Operations**

[![GitHub](https://img.shields.io/badge/GitHub-bluewudots-blue)](https://github.com/shubhkrishna19/bluewudots)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/shubhkrishna19/bluewudots.git
cd bluewudots/ots-webapp

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📦 Features

| Module | Status | Description |
|:-------|:------:|:------------|
| **Analytics Dashboard** | ✅ | Real-time charts with Recharts |
| **Multi-Channel OMS** | ✅ | Import from 8 sales channels |
| **India Logistics Engine** | ✅ | Zone mapping for 28 States + 8 UTs |
| **Barcode Dispatcher** | ✅ | Camera-based scanning for dispatch |
| **SKU/MTP Master** | ✅ | Profitability analysis with GST |
| **Dealer Network** | ✅ | CRM-linked dealer management |
| **Settings Panel** | ✅ | App configuration & API status |

---

## 🛒 Supported Sales Channels

- Amazon IN (SP-API ready)
- Flipkart
- Shopify
- Urban Ladder
- Pepperfry
- IndiaMART
- Local Shop
- Dealer Orders

---

## 🏗️ Tech Stack

- **Frontend**: React 19 + Vite 7
- **Styling**: Vanilla CSS (Glassmorphism design)
- **Charts**: Recharts
- **CSV Parsing**: PapaParse
- **PDF Generation**: jsPDF
- **Barcode Scanning**: html5-qrcode
- **Backend (Planned)**: Zoho Catalyst

---

## 📁 Project Structure

```
ots-webapp/
├── src/
│   ├── components/
│   │   ├── Automation/      # Channel importers
│   │   ├── Commercial/      # SKU/MTP logic
│   │   ├── Dashboard/       # Analytics
│   │   ├── Dealers/         # Dealer management
│   │   ├── Logistics/       # Carrier selection
│   │   ├── Orders/          # Dispatch & Journey
│   │   └── Settings/        # Configuration
│   ├── context/             # DataContext (state)
│   ├── utils/               # Business logic
│   └── catalyst/            # Zoho SDK setup
├── .env.example             # Environment template
└── package.json
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_CATALYST_PROJECT_ID=your_project_id
VITE_CATALYST_CLIENT_ID=your_client_id
VITE_CATALYST_ENVIRONMENT=development
```

---

## 🤝 Multi-Agent Development

This project supports collaborative development with AI agents:
- **Command Center**: See `.gemini/` folder for implementation plans
- **Task Tracking**: `task.md` contains the development checklist
- **Code Style**: Glassmorphism CSS, React functional components

---

## 📋 Roadmap

- [ ] Zoho CRM API integration (READ-ONLY)
- [ ] Amazon SP-API OAuth flow
- [ ] Delhivery/BlueDart AWB generation
- [ ] Real-time carrier tracking webhooks

---

## 🚀 Recent Developments (Phase 12+)

### Offline Caching & PWA Support
- **File**: `src/services/offlineCacheService.js`
- **Features**:
  - IndexedDB-based offline caching for orders, SKU master, and analytics
  - TTL (time-to-live) support for automatic cache expiration
  - Namespace-based cache organization for multi-tenant data isolation
  - Zero external dependencies, production-ready
- **Usage**: Import and use `cacheData()`, `retrieveCachedData()`, `clearNamespace()`, etc.

### Enhanced Data Processing
- **Deduplication Engine** (`src/utils/dataUtils.js`)
  - Optimized for 10k+ order batches with sliding-window duplicate detection
  - Partial duplicate detection (same customer/SKU within 15-min window)
  - Merges status history from duplicate orders

### Label & Logistics Utilities
- **Thermal Label Printing** (`src/utils/labelGenerator.js`)
  - 4x6 thermal label generation with jsPDF
  - Barcode integration for direct warehouse printing
  - Warehouse-standard formatting

- **Logistics Status Normalizer** (`src/utils/logisticsUtils.js`)
  - Unified carrier status mapping (Delhivery, XpressBees, etc.)
  - Normalization to internal state: `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `RTO_INITIATED`

## 📄 License

Proprietary - Bluewud Industries
