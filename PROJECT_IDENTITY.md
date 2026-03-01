# PROJECT IDENTITY — Bluewud OTS (Order Tracking System)

> **🔒 Locked. Do not modify without Shubh's approval.**
> Owner: Shubh Krishna / Bluewud Industries

---

## What This Project Is

**Bluewud OTS** is the company's internal order management and logistics platform — the nerve center for all e-commerce operations.

Covers: Amazon/Flipkart order import, logistics (Delhivery, BlueDart, XpressBees), inventory, finance, dealer portal, WhatsApp notifications, analytics, and demand forecasting.

**Scale:** 205 React components, 45+ services, RBAC with 6 roles, Docker + GitHub Actions CI/CD.

---

## Deployment Target

| Layer | Technology | Details |
|---|---|---|
| Frontend | React 19 + Vite 7 | `ots-webapp/` |
| Build | Docker (Nginx) | Multi-stage: node:18-alpine → nginx:alpine |
| CI/CD | GitHub Actions | lint → test → build → deploy (staging/prod) |
| Backend | Zoho Catalyst | Cloud functions |
| APIs | Amazon SP-API, Flipkart, WhatsApp Business, Delhivery, BlueDart | Via env vars |

---

## Approved Tech Stack

| Layer | Approved |
|---|---|
| Frontend | React 19, Vite 7, Recharts, lucide-react, jsPDF, PapaParse, xlsx, crypto-js |
| State | React Context API (custom hooks) |
| Testing | Vitest + coverage |
| Linting | ESLint + Prettier + Husky |
| Container | Docker (Nginx) |

---

## Folder Structure

```
ots-webapp/
  src/
    components/   — 205 React components (Orders, Logistics, Inventory, Finance, etc.)
    services/     — 45+ business logic services (RBAC, API, analytics, ML, etc.)
    context/      — React Context providers
    catalyst/     — Zoho integration layer
  Dockerfile      — Production container
  vite.config.js  — Build config (minification enabled)
  .env.example    — 170+ env var documentation

AI_INTEGRATION_PACKAGE/  — 14 production-ready modules ready for integration
legacy/                  — Excel master data files (gitignored, large)
deploy.sh                — Deployment automation
.github/workflows/       — CI/CD pipeline
```

---

## Auth / RBAC

- **DEV:** demo accounts shown on login page (wrapped in `import.meta.env.DEV` — hidden in production)
- **PROD:** Zoho OAuth — configure `VITE_ZOHO_CLIENT_ID` and related env vars
- 6 roles: ADMIN, MANAGER, OPERATOR, WAREHOUSE, SALES, DEALER
- Guard component wraps every protected route

---

## Untouchable Without Shubh's Approval

- `src/services/rbacMiddleware.js` — RBAC permissions matrix
- `Dockerfile` — Production container config
- `.github/workflows/ci.yml` — CI/CD pipeline
- Environment variable names — Vercel/Catalyst must match exactly
- This file (`PROJECT_IDENTITY.md`)
