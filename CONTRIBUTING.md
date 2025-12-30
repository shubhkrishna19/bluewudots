# Bluewud OTS - Development Guide for AI Agents

## Architecture Overview
This is a React-based Order Tracking System with the following key principles:

1. **CRM is READ-ONLY**: All dealer/account data comes from Zoho CRM but we don't write back
2. **Multi-Channel**: Support for 8+ sales channels (Amazon, Flipkart, Shopify, etc.)
3. **Platform Labels**: Use carrier/marketplace APIs for labels, not generic PDFs
4. **India-First**: GST compliance, INR formatting, 28 States + 8 UTs zone mapping

## Key Files

### State Management
- `src/context/DataContext.jsx` - Global state for orders, logistics, SKU data

### Business Logic
- `src/utils/logisticsUtils.js` - Zone calculation, rate estimation
- `src/utils/commercialUtils.js` - GST, profitability calculations
- `src/utils/labelGenerator.js` - PDF generation (placeholder)

### Components
- `src/components/Automation/UniversalImporter.jsx` - Multi-channel CSV import
- `src/components/Logistics/CarrierSelection.jsx` - Carrier recommendations
- `src/components/Commercial/SKUMaster.jsx` - Profitability analysis
- `src/components/Orders/BarcodeDispatcher.jsx` - Camera scanning
- `src/components/Dealers/DealerLookup.jsx` - CRM dealer search
- `src/components/Dashboard/AnalyticsDashboard.jsx` - Charts
- `src/components/Settings/SettingsPanel.jsx` - Configuration

## Coding Standards

### CSS Classes
- Always use `glass` and `glass-hover` for cards
- Use CSS variables: `--primary`, `--accent`, `--success`, `--danger`
- Animate with `animate-fade` class

### Data Flow
1. Check `DataContext` for existing data before fetching
2. Use `setOrders`, `setLogistics`, `setSkuMaster` for updates
3. Every order must have a `source` field

### API Integration (Future)
- Amazon SP-API: Orders, Labels
- Flipkart Seller API: Orders, Labels
- Delhivery API: AWB, Tracking
- Zoho CRM API: Dealers, Accounts (READ-ONLY)

## Running Locally
```bash
cd ots-webapp
npm install
npm run dev
```
