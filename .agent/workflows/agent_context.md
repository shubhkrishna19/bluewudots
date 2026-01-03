---
description: Protocol for new agents to quickly establish accurate project context.
---

When starting a new session, follow these steps to get up to speed:

1. **Read SSOT (Single Source of Truth)**:
   - Read [AI_MASTER_MANUAL.md](file:///Users/anandinisingh/Downloads/webdev2/AI_MASTER_MANUAL.md) for core principles and roadmap.
   - Read [AGENT_COORDINATION.md](file:///Users/anandinisingh/Downloads/webdev2/AGENT_COORDINATION.md) for current collaboration status.

2. **Check Active Locks**:
   - Review [LOCKS.md](file:///Users/anandinisingh/Downloads/webdev2/LOCKS.md) to ensure no other agent is working on the same files.

3. **Recover Last Session State**:
   - Read `session_summary.json` to see modified files and pending logic from the previous agent.

4. **Review Task Status**:
   - Check the latest `task.md` in the artifacts directory to identify the next priority task.

5. **Index Codebase**:
   // turbo
   - Run `node ots-webapp/src/utils/contextInjection.js` to refresh `context_index.md`.
