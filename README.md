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

## 📄 License

Proprietary - Bluewud Industries
