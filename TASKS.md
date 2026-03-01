# Tasks — Bluewud OTS (Order Tracking System)

## Protocol
Before claiming a task: read AGENTS.md + COORDINATION.md (in BluewudOrchestrator/).
Claim a task by moving it to IN PROGRESS with your agent tag [CLAUDE]/[CODEX-XX]/[MINIMAX]/[OPENCLAW].
Always work on a branch: feat/[agent]-T[id]-[slug]. Never commit directly to main.
⚠️ This app has 205+ components. Always grep for usages before modifying any component.
⚠️ RBAC is critical — never remove role checks from routes or components.

## PENDING
- [ ] [T-001] Add order status timeline component showing stage-by-stage progression (Priority: HIGH)
- [ ] [T-002] Add export to PDF for individual order details page (Priority: MED)
- [ ] [T-003] Add notification badge on sidebar for orders pending review (Priority: MED)
- [ ] [T-004] Optimize API calls on dashboard — currently fetches all orders on every render (Priority: HIGH)
- [ ] [T-005] Add search by AWB (airway bill) number across all orders (Priority: HIGH)

## IN PROGRESS
(none)

## DONE
(none yet — project initialized)
