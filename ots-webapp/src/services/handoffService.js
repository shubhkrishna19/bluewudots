/**
 * Handoff Service
 * Automates the creation of session summaries and prepares the repository for agent transitions.
 */

import fs from 'fs'
import { execSync } from 'child_process'
import path from 'path'

class HandoffService {
  constructor(basePath = process.cwd()) {
    this.basePath = basePath
    this.summaryPath = path.join(this.basePath, 'session_summary.json')
  }

  /**
   * Identifies modified files in the current session using git or timestamps.
   * @returns {Array<string>} List of modified file paths.
   */
  getModifiedFiles() {
    try {
      // Check git status for modified and untracked files
      const output = execSync('git status --porcelain', { cwd: this.basePath }).toString()
      return output
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => line.slice(3).trim())
    } catch (error) {
      console.error('Git not available or error occurred:', error.message)
      return []
    }
  }

  /**
   * Generates a structured session summary.
   * @param {Object} metadata Additional context like pending logic or risky areas.
   */
  generateSummary(metadata = {}) {
    const modifiedFiles = this.getModifiedFiles()
    const summary = {
      agentId: 'Antigravity',
      timestamp: new Date().toISOString(),
      modifiedFiles,
      pendingLogic: metadata.pendingLogic || [],
      riskAreas: metadata.riskAreas || [],
      nextSteps: metadata.nextSteps || 'Check task.md for detailed breakdown.',
    }

    fs.writeFileSync(this.summaryPath, JSON.stringify(summary, null, 2))
    console.log(`[Handoff] Session summary generated at ${this.summaryPath}`)
    return summary
  }

  /**
   * Simulates the /handoff command.
   */
  executeHandoff(metadata) {
    console.log('--- Initiating Agent Handoff ---')
    this.generateSummary(metadata)
    console.log('1. Session summary captured.')
    console.log('2. Verification logs pending in walkthrough.md (Recommended).')
    console.log('3. Ensure all LOCKS.md entries are cleared.')
    console.log('--- Handoff Ready ---')
  }
}

export default new HandoffService()
