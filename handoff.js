/**
 * CLI Entry point for AI Handoff
 * Usage: node handoff.js "Optional pending logic notes" "Optional risk area notes"
 */

import handoffService from './ots-webapp/src/services/handoffService.js';

const pendingNotes = process.argv[2] || "None specified.";
const riskNotes = process.argv[3] || "None identified.";

console.log('--- Bluewud OTS AI Handoff Tool ---');

try {
    handoffService.executeHandoff({
        pendingLogic: [pendingNotes],
        riskAreas: [riskNotes],
        nextSteps: "Review task.md and session_summary.json for immediate context."
    });
} catch (error) {
    console.error('Fatal: Handoff failed.', error.message);
    process.exit(1);
}
