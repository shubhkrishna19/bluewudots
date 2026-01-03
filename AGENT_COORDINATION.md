# 🤝 Bluewud OTS: Agent Coordination Protocol

This document outlines the rules and tools for multiple AI agents collaborating on the Bluewud OTS codebase. Following these protocols ensures work accuracy, prevents race conditions, and maintains a clean audit trail.

---

## 🏗️ 1. Coordination Tools

### 1.1 File Locking (`LOCKS.md`)
Before making substantial changes to core files, you **MUST** acquire a lock.
- **Protocol**: Add a `LOCK` entry in [LOCKS.md](file:///Users/anandinisingh/Downloads/webdev2/LOCKS.md).
- **Format**: `LOCK [FILE_PATH] [AGENT_NAME] [ISO_TIME]`
- **Unlocking**: Remove the lock entry once the task is complete or the session ends.

### 1.2 Session Handoff (`handoff.js` & `handoffService.js`)
At the end of every session, run the handoff tool to persist state for the next agent.
- **Command**: `node handoff.js "Notes on logic" "Risk areas"`
- **Output**: Generates `session_summary.json` containing modified files and context.

### 1.3 Context Indexing (`contextInjection.js`)
Use the indexing tool to get a high-level overview of the codebase functions and JSDoc.
- **Command**: `node ots-webapp/src/utils/contextInjection.js`
- **Output**: Refreshes [context_index.md](file:///Users/anandinisingh/Downloads/webdev2/context_index.md).

---

## 🔄 2. Standard Workflows

### 2.1 Starting a Session
Always run the `agent_context` workflow:
1. Read `AI_MASTER_MANUAL.md`.
2. Check `LOCKS.md`.
3. Read the latest `session_summary.json`.
4. Run context indexing to update your internal map.

### 2.2 Ending a Session
Always run the `handoff` workflow:
1. Update `task.md` with progress and the **next step**.
2. Run the handoff CLI tool.
3. Clear your locks in `LOCKS.md`.
4. Notify the user via `notify_user` with paths to modified files.

---

## 🛡️ 3. Conflict Resolution
- If a file you need is locked, **DO NOT** edit it.
- Check the `AGENT_NAME` and `ISO_TIME` in `LOCKS.md`.
- If a lock is stale (>4 hours), notify the user before proceeding.
- If two agents need to edit the same file, coordinate via `task.md` sub-tasks to ensure sequential execution.

---
*Maintained by Antigravity AI - Collaboration Mode*
