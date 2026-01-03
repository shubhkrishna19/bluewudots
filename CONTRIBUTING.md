# Bluewud OTS - Development Guide for AI Agents

## Architecture Overview
This is a React-based Order Tracking System with the following key principles:

1. **CRM is READ-ONLY**: All dealer/account data comes from Zoho CRM but we don't write back
2. **Multi-Channel**: Support for 8+ sales channels (Amazon, Flipkart, Shopify, etc.)
3. **Platform Labels**: Use carrier/marketplace APIs for labels, not generic PDFs
4. **India-First**: GST compliance, INR formatting, 28 States + 8 UTs zone mapping

### Supply Chain & Finance
- `src/services/supplyChainService.js` - FIFO, batch tracking, shortage prediction
- `src/services/marginProtectionService.js` - AI margin guard, leakage detection
- `src/components/SupplyChain/ProductionTracker.jsx` - Batch monitoring
- `src/components/Commercial/MarginGuard.jsx` - Financial risk oversight

## System Services (Shared)
- `src/services/activityLogger.js` - Audit trail for all actions
- `src/services/notificationService.js` - Multi-channel alerts (WhatsApp/Push/Discord)
- `src/services/searchService.js` - Global fuzzy search (Ctrl+K)
- `src/services/keyboardShortcuts.js` - Global hotkeys manager

## Coding Standards

### UI Components
- **Glassmorphism**: Always use `glass` and `glass-hover` for cards.
- **Theming**: Use CSS variables: `--primary`, `--accent`, `--success`, `--danger`, `--warning`.
- **Animations**: Use `animate-fade`, `animate-slide-up`, or `animate-pulse` for alerts.
- **Icons**: Use Emojis for quick visual reference or Lucide-React if installed.

### Logic Patters
- **FIFO**: Inventory deduction must always use `src/services/supplyChainService.js` logic.
- **Margin Protection**: Every order creation must trigger a margin check via `DataContext`.
- **Audit Trail**: Every significant state change (Order update, Stock adjustment) MUST be logged via `logActivity`.

### API Integration (Current/Future)
- **Zoho Sync**: Manual and auto-sync triggers for SKU Master and Orders.
- **Notification Webhooks**: Mocked for WhatsApp/Push, ready for production endpoints.
- **Amazon Node**: Logic for Amazon IN order mapping and CSV transformation.

## Running Locally
```bash
cd ots-webapp
npm install
npm run dev
```
