---
description: Standard handoff protocol for AI agents to ensure session continuity and state accuracy.
---

Follow these steps to hand off the session to the next agent:

1. **Update `task.md`**:
   - Mark completed items with `[x]`.
   - Update in-progress items with `[/]`.
   - Add the **VERY NEXT** step for the incoming agent.

2. **Generate Session Summary**:
   // turbo
   - Run `node handoff.js "Detailed notes on pending logic" "Identified risk areas/conflicts"`.
   - This creates `session_summary.json` with modified files and context.

3. **Verify Documentation**:
   - Ensure `walkthrough.md` contains logs/proof for all completed work.
   - Update `AGENT_COORDINATION.md` if any protocols changed.

4. **Clear Locks**:
   - Remove your entries from `LOCKS.md`.

5. **Final Notification**:
   - Call `notify_user` with paths to modified files and a concise summary of the session.
