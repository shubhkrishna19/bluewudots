# AGENTS.md — Bluewud OTS (Order Tracking System)
# Universal AI context file. Read this first, regardless of which AI tool you are.
# Works with: Claude Code, MiniMax, Antigravity, OpenClaw, Codex, Cursor, Copilot

---

## Project Identity

- **Name:** Bluewud OTS (Order Tracking System)
- **Owner:** Shubh (Bluewud)
- **Platform:** Docker + (planned: cloud hosting)
- **Status:** Active Development
- **Purpose:** Internal order tracking and logistics management platform. Replaces manual tracking via Excel. 205+ React components across a full-stack app with role-based access control.

---

## Tech Stack

| Layer       | Tech                                              |
|-------------|---------------------------------------------------|
| Frontend    | React 19 + Vite 7 + Tailwind CSS                 |
| State mgmt  | Zustand or Context API                            |
| Charts      | Recharts                                          |
| Routing     | React Router v7                                   |
| Backend     | (planned — currently frontend-heavy)              |
| Packaging   | Docker                                            |
| Build       | Vite 7 with esbuild minification + code splitting |

---

## CRITICAL — Role-Based Access Control (RBAC)

> This app has **admin, manager, and viewer roles**. Never remove RBAC checks from routes or components.
> The permissions model is load-bearing — one missing check exposes sensitive order data to wrong users.

---

## Critical Rules — Any AI Must Follow

1. **NEVER display demo accounts in production builds.** They are wrapped in `import.meta.env.DEV ? [...] : []` — do not remove this guard.
2. **`vite.config.js` is tuned** — `minify: 'esbuild'` + manual chunks (vendor, charts). Do not disable minification.
3. **205+ components** — understand the component tree before refactoring. Use grep/search to find usages.
4. **`AI_INTEGRATION_PACKAGE/`** folder contains context files for AI agents working on this project — read it.
5. **`ots-webapp/`** is the main app directory. Root is project config only.
6. **Never call `docker build` or `docker push`** without Shubh's instruction.

---

## File Structure (important files)

```
ots-webapp/
  src/
    components/       ← 205+ React components (organized by feature)
      Auth/
        LoginPage.jsx ← RBAC roles + demo account guard
      Orders/
      Logistics/
      Dashboard/
    contexts/         ← Global state (auth, orders, etc.)
    hooks/            ← Custom React hooks
  vite.config.js      ← Build config (minify + chunking — do not change)
AI_INTEGRATION_PACKAGE/ ← AI agent context files (read this folder)
.gitignore            ← Covers session/agent-generated files
PROJECT_IDENTITY.md   ← Locked identity
```

---

## Build Output

```bash
cd ots-webapp
npm install
npm run build       # outputs to ots-webapp/dist/
npm run dev         # local dev server
```

Production bundle is split:
- `vendor.js` — React + React DOM
- `charts.js` — Recharts
- `index.js` — app code

---

## Demo Accounts (DEV ONLY)

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Admin   | admin@bluewud.com   | admin123   |
| Manager | manager@bluewud.com | manager123 |
| Viewer  | viewer@bluewud.com  | viewer123  |

These are ONLY shown in development builds (`import.meta.env.DEV === true`). They must never appear in production.

---

## When Working on This Project

- Before modifying a component, search for all usages: `grep -r "ComponentName" ots-webapp/src`
- Check RBAC on every new route/page you add
- Recharts chart configs follow patterns in existing chart components — match the style
- The `AI_INTEGRATION_PACKAGE/` has codebase context — use it before starting major work

---

## Handoff Protocol

When done: summarize changes, list modified files, flag TODOs. Do not build/deploy.


## Session Start Checklist

Every session, before writing any code:
1. Read this AGENTS.md fully
2. Read TASKS.md — check what's IN PROGRESS (don't duplicate work)
3. Claim your task in TASKS.md before starting
4. Work on a branch: feat/[agent-tag]-T[id]-[slug]
5. Full protocol: BluewudOrchestrator/COORDINATION.md
