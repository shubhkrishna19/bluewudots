# CLAUDE.md — Bluewud OTS (Claude Code Extension)
# This file extends AGENTS.md with Claude Code-specific context.
# READ AGENTS.md FIRST — all architecture, rules, and project identity live there.

---

## Claude Code Notes

- **React 19 + Vite 7**: cutting edge versions — some ecosystem packages may lag. Check compatibility before adding deps.
- **205+ components**: before modifying any component, search for all usages with grep. Side effects are everywhere in a codebase this large.
- **`import.meta.env.DEV`**: the demo accounts guard. Vite strips DEV-only code in production builds. Do not replace with runtime checks.
- **`AI_INTEGRATION_PACKAGE/`**: contains codebase context files (component map, architecture notes). Read before doing large refactors.
- **RBAC**: route guards + component-level permission checks both exist. Adding a new page requires BOTH.

## Useful Claude Code Commands for This Project

```bash
# Dev server
cd ots-webapp && npm run dev

# Production build
cd ots-webapp && npm run build

# Find all usages of a component
grep -r "ComponentName" ots-webapp/src --include="*.jsx" --include="*.js"

# Check bundle size after build
du -sh ots-webapp/dist/assets/*

# Verify demo accounts are stripped in prod
npm run build && grep -r "admin123" ots-webapp/dist/ || echo "GOOD: demo accounts stripped"
```

## What to Read Before Touching Code

1. `AGENTS.md` — RBAC critical warning + full tech stack
2. `PROJECT_IDENTITY.md` — locked identity
3. `AI_INTEGRATION_PACKAGE/` — codebase context (component map, architecture)
4. `ots-webapp/vite.config.js` — build config (tuned, do not change)
5. `ots-webapp/src/components/Auth/LoginPage.jsx` — RBAC + demo guard pattern
